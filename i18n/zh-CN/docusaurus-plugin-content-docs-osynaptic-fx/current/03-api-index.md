---
id: api-index
title: API 索引
sidebar_label: API 索引
---

# 03 API 索引

## 门面（Facade）

- 头文件：`include/osfx_core.h`
- 主要能力：
  - `osfx_core_encode_sensor_packet*`
  - `osfx_core_decode_sensor_packet*`
  - `osfx_core_encode_multi_sensor_packet_auto`
  - `osfx_core_decode_multi_sensor_packet_auto`

## Easy API

- 头文件：`include/osfx_easy.h`
- 主要能力：
  - `osfx_easy_init`
  - `osfx_easy_init_id_allocator`
  - `osfx_easy_allocate_aid`
  - `osfx_easy_encode_sensor_auto`
  - `osfx_easy_encode_multi_sensor_auto`

## 数据包与融合（Packet & Fusion）

- `include/osfx_fusion_packet.h`
- `include/osfx_fusion_state.h`
- FULL/DIFF/HEART 编码、解码与状态转换。

## 安全（Security）

- `include/osfx_secure_session.h`
- `include/osfx_payload_crypto.h`
- `include/osfx_handshake_dispatch.h`
- 关键语义：
  - 会话状态：`INIT / PLAINTEXT_SENT / DICT_READY / SECURE`
  - 时间戳检查：`ACCEPT / REPLAY / OUT_OF_ORDER`

## 运行时（Runtime）

- `include/osfx_transporter_runtime.h`
- `include/osfx_protocol_matrix.h`
- `include/osfx_service_runtime.h`
- 关键控制面 API：
  - `osfx_service_register_ex`
  - `osfx_service_count`
  - `osfx_service_name_at`
  - `osfx_service_load`
  - `osfx_service_command`

## 作用域插件 API

- `include/osfx_plugin_transport.h`
- `include/osfx_plugin_test.h`
- `include/osfx_plugin_port_forwarder.h`
- `include/osfx_platform_runtime.h`
- `include/osfx_cli_lite.h`

## 使用建议

- 外部集成优先使用 `osfx_core.h`。
- 平台命令路由场景使用 `osfx_platform_runtime + osfx_cli_lite`。
- 通过插件命令管理 `port_forwarder` 规则，不要直接修改内部结构。
