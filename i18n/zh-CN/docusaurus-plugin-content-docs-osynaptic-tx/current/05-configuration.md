---
id: 05-configuration
title: 配置宏
sidebar_label: 配置
---

# 配置宏

所有宏均位于 `ostx_config.h`（或通过 CMake/Arduino IDE 设置）。须在包含任何 `<OSynaptic-TX.h>` 头文件**之前**设置。

## 缓冲区大小

| 宏 | 默认值 | 单位 | 描述 |
|---|---|---|---|
| `OSTX_PACKET_MAX` | `96` | 字节 | 最大输出数据包大小。须足够容纳头部 + 最长可能的 body |
| `OSTX_ID_MAX` | `9` | 字节 | 传感器 ID 最大长度（含 NUL）；默认最多 8 字符 |
| `OSTX_UNIT_MAX` | `9` | 字节 | 单位字符串最大长度（含 NUL）|

## 值缩放

| 宏 | 默认值 | 描述 |
|---|---|---|
| `OSTX_VALUE_SCALE` | `10000` | 定点缩放因子。`scaled = real_value × OSTX_VALUE_SCALE` |

可设置为任意 10 的幂次。例：`100` 表示 2 位小数精度，每个数据包约节省 1–2 个 Base62 字符。

## 时间戳

| 宏 | 默认值 | 描述 |
|---|---|---|
| `OSTX_NO_TIMESTAMP` | `0` | 设为 `1` 从结构体和数据包中省略时间戳字段。节省 ~20 B Flash + 4 B 栈 |

`OSTX_NO_TIMESTAMP=1` 时，`ts_sec` 参数传 `0`；库忽略该值，数据包中 TS_SEC 字段清零。

## 功能开关

| 宏 | 默认值 | 描述 |
|---|---|---|
| `OSTX_NO_STATIC` | `0` | 设为 `1` 排除等级 B（静态描述符 API）|
| `OSTX_NO_STREAM` | `0` | 设为 `1` 排除等级 C（流式回调 API）|
| `OSTX_DISABLE_B62_TABLE` | `0` | 不适用——TX 使用查找表编码器以提高速度 |

## 内存配置（AVR，avr-gcc -Os，ATmega328P）

| 配置 | 定义 | Flash | 栈 | 静态 RAM |
|---|---|---|---|---|
| 完整（所有等级）| 默认值 | ~760 B | ~137 B（等级 A）| 96 B |
| 仅等级 B | `OSTX_NO_STREAM=1` | ~430 B | ~51 B | 96 B |
| 仅等级 C | `OSTX_NO_STATIC=1` | ~600 B | ~21 B | 0 B |
| 无时间戳 | `OSTX_NO_TIMESTAMP=1` | ~740 B | ~117 B | 96 B |
| 最小配置 | `OSTX_NO_STATIC=1 OSTX_NO_STREAM=1` | ~600 B | ~137 B | 96 B（仅等级 A）|

## CMake 用法

```cmake
target_compile_definitions(my_sensor PRIVATE
    OSTX_NO_TIMESTAMP=1
    OSTX_NO_STATIC=1
)
```

## Arduino IDE 用法

在 **项目 > 项目属性**（Arduino 3.x）中添加，或在 include 之前定义：

```c
#define OSTX_NO_TIMESTAMP 1
#define OSTX_NO_STATIC    1
#include <OSynaptic-TX.h>
```
