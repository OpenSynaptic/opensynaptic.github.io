---
id: glue-step-by-step
title: Glue 逐步集成指南
sidebar_label: Glue 集成指南
---

# 17 Glue 逐步集成指南

本文档提供 `osfx_glue` 的逐步代码说明，帮助快速将协议能力组装为可运行的调用链。

> 数据格式规范（帧格式、命令字节、字段定义等）已迁移至独立文档：  
> **[18-data-format-specification.md](18-data-format-specification.md)**

## 0. 目标

- 统一初始化：`fusion / security / id / runtime / plugin`
- 统一入口：编码、解码、握手分发、插件命令
- 适用于嵌入式主循环（轮询/事件驱动均支持）

## 1. 头文件与上下文

```c
#include "osfx_core.h"

osfx_glue_ctx glue;
osfx_glue_config cfg;
```

说明：

- `osfx_glue_ctx`：运行时总上下文。
- `osfx_glue_config`：初始化配置（本地 AID、ID 池范围、租约周期、安全过期时间、回调）。

## 2. 设置默认配置并按设备覆盖

```c
osfx_glue_default_config(&cfg);

cfg.local_aid = 500U;
cfg.id_start = 200U;
cfg.id_end = 1000U;
cfg.id_default_lease_seconds = 3600U;
cfg.secure_expire_seconds = 86400U;
```

**建议：**

- `local_aid`：本设备在网络中的唯一标识符（服务端 AID）。
- `id_start/id_end`：定义可分配的 AID 范围（服务端分配池）。
- 设备侧：只需要 `local_aid`，AID 池参数由服务端使用。

## 3. 初始化

```c
int rc = osfx_glue_init(&glue, &cfg);
if (rc != 0) {
    /* 初始化失败，检查 rc */
}
```

说明：

- 内部依次初始化 `fusion_state / secure_session / id_allocator / platform_runtime / plugins`。
- 返回 0 表示成功。

## 4. 编码（设备侧发包）

```c
uint8_t out_buf[256];
int out_len = 0;

osfx_glue_sensor_input input = {
    .tid = 1,
    .timestamp_raw = 1710001000ULL,
    .sensor_id = "TEMP",
    .input_value = 23.5,
    .input_unit = "cel"
};

int rc = osfx_glue_encode_sensor_auto(&glue, &input, out_buf, sizeof(out_buf), &out_len);
```

说明：

- `cmd`（FULL/DIFF/HEART）由 `fusion_state` 自动决定。
- `source_aid`、`crc8`、`crc16` 均由内部自动填写。
- `out_buf[0..out_len-1]` 即可发送的完整帧。

## 5. 解码（接收侧解包）

```c
osfx_glue_decode_result result;
int rc = osfx_glue_process_packet(&glue, in_buf, in_len, &result);
if (rc == 0) {
    /* 数据包：result.sensor_id / result.value / result.unit */
}
```

说明：

- 若为数据包，执行时间戳防重放/乱序检查后返回业务字段。
- 若为控制包，自动进入握手分发路径。

## 6. 握手分发（服务端）

```c
osfx_hs_result hs_result;
int rc = osfx_hs_classify_dispatch(&glue.hs_ctx, in_buf, in_len, &hs_result);
if (rc == 0 && hs_result.response_len > 0) {
    /* 将 hs_result.response 发回客户端 */
}
```

## 7. 插件命令（已加载后）

```c
/* 加载作用域插件 */
osfx_cli_lite_run(&glue.cli, "plugin-load port_forwarder");

/* 执行端口转发规则 */
osfx_cli_lite_run(&glue.cli, "port-forwarder add-rule r1 udp 8080 tcp 9000");
osfx_cli_lite_run(&glue.cli, "port-forwarder forward udp 8080 A1B2C3");
```

## 字段规范参考

| 场景 | 参考文档节 |
|---|---|
| 数据帧格式 | [18-data-format-specification.md#A.1](18-data-format-specification.md) |
| 命令字节表 | [18-data-format-specification.md#A.2](18-data-format-specification.md) |
| 用户输入最小合法集 | [18-data-format-specification.md#A.12](18-data-format-specification.md) |
