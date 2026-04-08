---
id: input-specification
title: 输入规范
sidebar_label: 输入规范
---

# 19 输入规范

本文档定义 `OSynaptic-FX` 在不同调用层级的输入规范，重点回答：谁提供传输规则，以及哪些字段是必须的。

## 1. 术语与分层

- **业务输入层**：调用 `osfx_glue_encode_sensor_auto(...)` 时的输入。
- **线路协议输入层**：通过网络收到的二进制帧，传入 `osfx_glue_process_packet(...)`。
- **低层帧构建层**：直接调用 `osfx_packet_encode_full/ex(...)`（高级用法）。

## 2. 业务输入层（OpenSynaptic 标准标定）

标准传输 API 标定（参考 `SEND_API_INDEX.md` / `SEND_API_REFERENCE.md`）：

```
transmit(sensors=[ [sensor_id, status, value, unit], ... ])
```

在 `OSynaptic-FX` 侧，等价于 `osfx_glue_encode_sensor_auto(...)`（单传感器）或多传感器封装器。

### 2.1 必填字段（用户/业务侧提供）

| 字段 | 类型 | 必填 | 示例 | 说明 |
|---|---|---|---|---|
| `tid` | `uint8_t` | 是 | `1` | 事务/通道标识符 |
| `timestamp_raw` | `uint64_t` | 是 | `1710001000` | 建议单调递增 |
| `sensor_id` | `string` | 是 | `TEMP` | 避免包含 `\|` |
| `input_value` | `double` | 是 | `23.5` | 原始传感器值 |
| `input_unit` | `string` | 是 | `cel` / `kPa` | 参见 [18-standardized-units.md](18-standardized-units.md) |

### 2.2 系统自动生成字段（用户不应手动提供）

| 字段 | 来源 |
|---|---|
| `cmd` | 由 `fusion_state` 自动选择 FULL/DIFF/HEART |
| `route_count` | 固定为 `1` |
| `source_aid` | `osfx_glue_ctx.local_aid` |
| `body` | 由标准化 + Base62 编码生成 |
| `crc8` / `crc16` | 内部自动计算 |

### 2.3 传输规则

1. 先执行单位标准化。
2. 编码 `sensor_id|unit|b62_value`。
3. 状态机决定 `cmd`。
4. 最后组帧并计算 CRC。

## 3. 线路协议输入层（接收与分发）

接口：`osfx_glue_process_packet(...)`

调用方必须提供完整的二进制帧（已是 OpenSynaptic 线路格式）：

| 字段 | 必填 | 说明 |
|---|---|---|
| `cmd` | 是 | 字节 0 |
| `route_count` | 是 | 字节 1，当前应为 `1` |
| `source_aid` | 是 | u32，大端 |
| `tid` | 是 | u8 |
| `timestamp_raw` | 是 | u48，大端 |
| `body` | 是 | 业务载荷 |
| `crc8` | 是 | Body CRC |
| `crc16` | 是 | 帧 CRC |

字段缺失/CRC 错误/序列号异常时，分发层必须拒绝并返回错误或 NACK。

## 4. 控制帧输入规范（通用）

### 4.1 `ID_REQUEST`

- 最小结构：`[cmd:1][seq:2]`
- 必填：`cmd=1`、`seq`
- 可选业务扩展：C99 核心当前不要求附加 JSON 元数据

### 4.2 `TIME_REQUEST`

- 最小结构：`[cmd:1][seq:2]`

### 4.3 `SECURE_DICT_READY`

- 结构：`[cmd:1][aid:4][timestamp_raw:8]`

### 4.4 `SECURE_CHANNEL_ACK`

- 结构：`[cmd:1][aid:4]`

## 5. 低层帧构建层（高级）

接口：`osfx_packet_encode_full(...)` / `osfx_packet_encode_ex(...)`

此模式下调用方必须提供 `cmd/source_aid/tid/timestamp/body`，适用于：

- 网关协议桥接
- 测试工具
- 特殊控制面帧构建

普通业务代码不建议直接使用。

## 6. 输入校验建议（发送前）

1. `sensor_id` 非空且长度在业务约束内。
2. `input_unit` 在白名单中（参见 [18-standardized-units.md](18-standardized-units.md)）。
3. `timestamp_raw` 从不回滚（至少在同一设备内单调）。
4. 缓冲区容量充足（避免截断）。
5. 遇到错误必须立即拒绝，切勿带错发送。

## 7. 典型错误与处理

| 错误码 | 含义 |
|---|---|
| `OSFX_GLUE_ERR_ARG` | 字段缺失或无效 |
| `OSFX_GLUE_ERR_CODEC` | 标准化或编码失败 |
| `OSFX_GLUE_ERR_RUNTIME` | 运行时依赖不可用（会话/路由/插件） |

## 8. 参考文档

- 线路格式规范：[18-data-format-specification.md](18-data-format-specification.md)
- 单位规范：[18-standardized-units.md](18-standardized-units.md)
- 详细示例：[16-examples-cookbook.md](16-examples-cookbook.md)
