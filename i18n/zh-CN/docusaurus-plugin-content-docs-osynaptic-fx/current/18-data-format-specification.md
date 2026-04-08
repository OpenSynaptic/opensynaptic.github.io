---
id: data-format-specification
title: 数据格式规范
sidebar_label: 数据格式规范
---

# 18 OpenSynaptic 标准数据格式定义（规范）

本文档提供 `OSynaptic-FX` 当前实现所使用的标准数据格式的严格定义。除非特别说明，所有多字节整数均采用**大端字节序**。

## A.1 数据帧（DATA_*）线路格式

适用命令：`DATA_FULL(63)`、`DATA_DIFF(170)`、`DATA_HEART(127)` 及其安全变体（`64/171/128`）。

| 偏移 | 长度 | 字段 | 定义 |
|---:|---:|---|---|
| 0 | 1 | `cmd` | 命令字节 |
| 1 | 1 | `route_count` | 当前实现固定为 `1` |
| 2 | 4 | `source_aid` | 发送方 AID（u32） |
| 6 | 1 | `tid` | 事务/通道标识符（u8） |
| 7 | 6 | `timestamp_raw` | 原始时间戳（u48） |
| 13 | N | `body` | 业务载荷 |
| 13+N | 1 | `crc8` | 覆盖 `body` 的 CRC8 |
| 14+N | 2 | `crc16` | 覆盖前面所有字节（含 `crc8`）的 CRC16/CCITT |

接收方必须先验证 `crc16`，验证失败则拒绝；如果启用了时间戳保护，还必须执行重放/乱序检查。

## A.2 命令字节定义

| 类别 | 命令 | 值 |
|---|---|---:|
| 数据 | `DATA_FULL` | 63 |
| 数据 | `DATA_FULL_SEC` | 64 |
| 数据 | `DATA_DIFF` | 170 |
| 数据 | `DATA_DIFF_SEC` | 171 |
| 数据 | `DATA_HEART` | 127 |
| 数据 | `DATA_HEART_SEC` | 128 |
| 控制 | `ID_REQUEST` | 1 |
| 控制 | `ID_ASSIGN` | 2 |
| 控制 | `HANDSHAKE_ACK` | 5 |
| 控制 | `HANDSHAKE_NACK` | 6 |
| 控制 | `PING` | 9 |
| 控制 | `PONG` | 10 |
| 控制 | `TIME_REQUEST` | 11 |
| 控制 | `TIME_RESPONSE` | 12 |
| 控制 | `SECURE_DICT_READY` | 13 |
| 控制 | `SECURE_CHANNEL_ACK` | 14 |

## A.3 单传感器业务载荷规范

`osfx_core_encode_sensor_packet*` 生成的 body 规范：

```text
sensor_id|unit|b62_value
```

约束：

- `sensor_id`：传感器标识符字符串。
- `unit`：标准化单位（例如 `Pa`、`K`）。
- `b62_value`：`round(standardized_value × 10000)` 的 `int64` 结果进行 Base62 编码。

## A.4 控制帧最小结构（通用）

- `ID_REQUEST`：`[cmd:1][seq:2]`（最少 3 字节，可选追加 JSON 设备元数据）
- `ID_ASSIGN`：`[cmd:1][seq:2][assigned_id:4]`（基础 7 字节）
  - **可选扩展（向后兼容）**：服务端可追加 `[server_time:8]`（u64 BE Unix 时间戳），共 15 字节。旧/简单客户端只读前 7 字节，忽略扩展。使用 `osfx_parse_id_assign()` 安全解析两种变体。
- `HANDSHAKE_NACK`：`[cmd:1][seq:2][reason:utf8-bytes]`
- `TIME_REQUEST`：`[cmd:1][seq:2]`
- `TIME_RESPONSE`：`[cmd:1][seq:2][unix_ts:8]`（u64 BE）

## A.5 安全语义

- 安全数据 cmd 必须映射到对应的基础数据 cmd 进行语义处理。
- 若会话未建立而收到安全数据，接收方应拒绝（`NO_SESSION` 语义）。
- 时间戳检查返回：`ACCEPT / REPLAY / OUT_OF_ORDER`；后两种必须拒绝。

## A.6 实现一致性要求

- 发送方必须按本节的顺序和编码规则进行帧构建。
- 接收方必须按本节的验证顺序（长度/CRC/序列号）验证帧。
- 任一字段不满足约束时，必须返回错误或 NACK，不应静默丢弃。

## A.7 数据传输必填字段（发送方 MUST）

发送方构建 `DATA_*` 帧时，以下字段不可省略：

- `cmd`：必须是已定义数据命令之一（`63/170/127` 或安全变体）
- `route_count`：当前实现必须写 `1`
- `source_aid`：必须为有效设备 ID（u32）
- `tid`：必须提供（u8）
- `timestamp_raw`：必须提供（u48，建议单调递增）
- `body`：必须存在并按业务载荷规范编码
- `crc8`：必须在写入前基于 `body` 计算
- `crc16`：必须在写入前基于前面所有字节计算

## A.8 字段值域与边界

| 字段 | 约束 |
|---|---|
| `cmd` | 只允许命令表中定义的值；未知值不得发送 |
| `route_count` | 固定为 `1` |
| `source_aid` | `0..4294967295`（工程实践建议避免用 `0`） |
| `tid` | `0..255` |
| `timestamp_raw` | `0..2^48-1`（线路格式）；建议使用统一秒级或毫秒级校准 |
| `body_len` | 必须满足实现缓冲区限制；超出必须拒绝 |

## A.9 帧构建顺序（发送方唯一顺序）

1. 先完成业务数据标准化和 body 编码。
2. 计算 `crc8`（覆盖 body）。
3. 按 A.1 定义写入头部字段（`cmd/route_count/source_aid/tid/timestamp_raw`）。
4. 拼接 `body + crc8`。
5. 计算 `crc16`（覆盖当前段：header + body + crc8），追加到末尾。
6. 得到最终可发送的二进制帧。

> 偏离此顺序可能导致接收方 CRC 验证失败。

## A.10 发送前检查清单

至少执行以下检查：

- 命令合法性检查（`cmd` 是否在已定义集合中）
- 时间戳有效性检查（空/回滚/异常跳变）
- 缓冲区容量检查（避免截断写入）
- `crc8/crc16` 自校验（可选二次计算对比）
- 安全场景会话检查（`dict_ready/key_set` 是否满足）

任一检查失败必须中止发送并返回错误。

## A.11 错误处理规范（发送方）

| 错误类型 | 推荐映射错误码 |
|---|---|
| 字段缺失/无效 | `OSFX_GLUE_ERR_ARG` |
| 编码失败 | `OSFX_GLUE_ERR_CODEC` |
| 运行时依赖不可用（会话/插件/路由） | `OSFX_GLUE_ERR_RUNTIME` |

**禁止"带错发送"**：遇到错误时必须拒绝发送，不得发送不完整或无效帧。

## A.12 用户输入数据契约（User Input Contract）

本节定义"业务/用户侧需要提供什么"，避免将所有线路格式字段误认为需要用户手动提供。

### A.12.1 `osfx_glue_encode_sensor_auto(...)` 路径（推荐）

用户必须提供：

| 字段 | 示例 | 说明 |
|---|---|---|
| `tid` | `1` | `0..255` |
| `timestamp_raw` | `1710001000` | 建议单调递增 |
| `sensor_id` | `TEMP` | 建议短标识符，避免含分隔符 `\|` |
| `input_value` | `23.5` | 有效浮点数 |
| `input_unit` | `cel` / `kPa` | 参见 `18-standardized-units.md` |

用户**不需要**提供（由系统自动生成或内部维护）：

- `cmd`（由 `fusion_state` 自动决定 FULL/DIFF/HEART）
- `route_count`（固定为 `1`）
- `source_aid`（来自 `glue.local_aid`）
- `crc8` / `crc16`（内部自动计算）

### A.12.2 低层 `osfx_packet_encode_full/ex` 路径（高级）

直接调用低层打包 API 时，`cmd/source_aid/tid/timestamp/body` 均由调用方显式提供。此模式仅建议用于协议网关或测试工具，业务侧默认使用 `osfx_glue_encode_sensor_auto(...)`。
