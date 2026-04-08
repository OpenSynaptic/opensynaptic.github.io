---
id: arduino-easy-api
title: Arduino Easy API
sidebar_label: Arduino Easy API
---

# 20 Arduino Easy API

本文档介绍在现有 C99 核心 API 之上构建的简化 Arduino 面向层。

## 目标

- 保持原有低层 API 不变。
- 为 Sketch 开发者提供少量高频调用函数。
- 减少 `setup/loop` 路径中的样板代码。

## 头文件与入口

- Arduino 引入入口：`src/OSynapticFX.h`
- Easy API 头文件：`include/osfx_easy.h`
- Easy API 实现：`src/osfx_easy.c`
- 参考 Sketch：`examples/EasyQuickStart/EasyQuickStart.ino`

## 示例矩阵（当前）

| 类别 | 示例路径 |
|---|---|
| Easy API 优先入口 | `examples/EasyQuickStart/EasyQuickStart.ino` |
| 核心 API 示例 | `examples/BasicEncode/BasicEncode.ino` |
| | `examples/PacketMetaDecode/PacketMetaDecode.ino` |
| | `examples/FusionAutoMode/FusionAutoMode.ino` |
| | `examples/MultiSensorNodePacket/MultiSensorNodePacket.ino` |
| | `examples/SecureSessionRoundtrip/SecureSessionRoundtrip.ino` |
| 高级运行时/诊断 | `examples/FusionModeTest/FusionModeTest.ino` |
| | `examples/BootCliOrRun/BootCliOrRun.ino` |
| | `examples/QuickBench/QuickBench.ino` |

## Easy API 接口面

**上下文类型：**

- `osfx_easy_context`

**初始化与配置：**

- `osfx_easy_init`
- `osfx_easy_set_node`
- `osfx_easy_set_tid`
- `osfx_easy_set_aid`

**AID 分配辅助函数：**

- `osfx_easy_init_id_allocator`
- `osfx_easy_allocate_aid`
- `osfx_easy_touch_aid`
- `osfx_easy_save_ids`
- `osfx_easy_load_ids`
- `osfx_easy_is_aid_ready`

**编码辅助函数：**

- `osfx_easy_encode_sensor_auto`
- `osfx_easy_encode_multi_sensor_auto`
- `osfx_easy_cmd_name`

## 最小单传感器流程

1. 调用 `osfx_easy_init` 一次。
2. 在 `setup` 中调用 `osfx_easy_init_id_allocator` 和 `osfx_easy_allocate_aid`。
3. 在 `loop` 中调用 `osfx_easy_encode_sensor_auto`。
4. 通过 `osfx_easy_cmd_name` 打印命令字用于调试。

参考：`examples/EasyQuickStart/EasyQuickStart.ino`

```cpp
#include <OSynapticFX.h>

osfx_easy_context ctx;
uint8_t pkt_buf[128];

void setup() {
  Serial.begin(115200);
  osfx_easy_init(&ctx);
  osfx_easy_init_id_allocator(&ctx, /*start=*/1, /*end=*/255);
  osfx_easy_allocate_aid(&ctx);
}

void loop() {
  int len = osfx_easy_encode_sensor_auto(
    &ctx, 1, millis(),
    "TEMP", 23.5, "cel",
    pkt_buf, sizeof(pkt_buf)
  );
  if (len > 0) {
    Serial.print("cmd=");
    Serial.print(osfx_easy_cmd_name(&ctx));
    Serial.print(" len=");
    Serial.println(len);
  }
  delay(1000);
}
```

## 最小多传感器流程

1. 按上述步骤初始化上下文。
2. 通过 `osfx_easy_set_node` 设置节点信息。
3. 构建 `osfx_core_sensor_input[]` 数组。
4. 调用 `osfx_easy_encode_multi_sensor_auto`。

## 说明

- Easy API 与核心 API 使用相同的线路格式和融合行为。
- `osfx_easy_load_ids` 可恢复租约表状态，但不会自动选择当前本地 AID。
