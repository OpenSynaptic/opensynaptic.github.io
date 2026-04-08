---
id: architecture
title: 架构
sidebar_label: 架构
---

# 02 架构

## 分层结构

- **核心门面（Core Facade）**：`src/osfx_core_facade.c`，聚合标准化、编码、打包、解包。
- **协议核心（Protocol Core）**：`solidity`、`fusion_packet`、`fusion_state`、`template_grammar`。
- **安全层（Security）**：`secure_session`、`payload_crypto`、`handshake_dispatch`。
- **运行时（Runtime）**：`transporter_runtime`、`protocol_matrix`、`service_runtime`。
- **平台作用域插件（Platform Scoped Plugins）**：`plugin_transport`、`plugin_test`、`plugin_port_forwarder`。
- **平台适配器（Platform Adapter）**：`platform_runtime` + `cli_lite` + `tools/osfx_cli_main.c`。
- **胶合适配器（Glue Adapter）**：`osfx_glue`，将编码、握手、ID 和插件命令整合为统一 API。

## 关键数据流

1. 传感器输入 → 标准化 → Base62 → 数据包编码。
2. `fusion_state` 决定 FULL/DIFF/HEART 策略。
3. 可选安全会话加密（在协议矩阵之前）。
4. `transport` 插件可通过命令触发自动/协议分发。
5. `port_forwarder` 插件可按规则从源协议/端口转发到目标协议/端口。

## 详细控制流（服务端）

1. 接收控制包 `CMD=ID_REQUEST`（至少 3 字节含 seq）。
2. `osfx_hs_classify_dispatch(...)` 从分发上下文读取 `id_allocator`。
3. 调用 `osfx_id_allocate(...)` 尝试分配 AID。
4. 成功：构建 `ID_ASSIGN` 响应；失败：构建 `NACK(ID_POOL_EXHAUSTED)`。
5. 调用方将 `out_result.response` 回发给客户端。

## 详细数据流（设备侧）

1. `osfx_glue_encode_sensor_auto(...)` 读取本地 `local_aid` 和 `tx_state`。
2. 标准化 + Base62 + 数据包编码（FULL/DIFF/HEART 自动选择）。
3. 通过协议矩阵或上层发送器发送。
4. 下行/入站包进入 `osfx_glue_process_packet(...)`。
5. 若为数据包，执行时间戳防重放/乱序检查；若为控制包，进入握手分发。

## 插件运行时关系

- `osfx_platform_runtime_init(...)` 将 3 个作用域插件注册到 `service_runtime`。
- 插件列表/加载/命令统一由 `osfx_cli_lite_run(...)` 路由。
- 插件状态通过 `service_runtime` 计数器和返回字符串暴露。

## 设计原则

- **固定范围**：优先保证协议核心与交付控制面，不引入非目标服务。
- **API 稳定性**：对外保持统一的 `osfx_core.h` 入口。
- **可验证性**：每次变更必须通过原生/集成/CLI 冒烟测试。
- **编排解耦**：通过 `osfx_glue` 统一调用路径，减少上层重复的组装逻辑。
