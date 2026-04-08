---
id: 05-configuration
title: 配置参考
sidebar_label: 配置
---

# 配置参考（`osrx_config.h`）

所有宏均有 `#ifndef` 保护。可通过 CMake `-D` 标志覆盖，或在包含任何 OSynaptic-RX 头文件之前定义。

---

## 缓冲区与字段大小

| 宏 | 默认值 | 描述 |
|---|---|---|
| `OSRX_PACKET_MAX` | `96` | 最大线路帧字节数（= `OSRXParser` 缓冲区大小）。扩展 body 帧时可增大。|
| `OSRX_ID_MAX` | `9` | 传感器 ID 最大长度，含 NUL 终止符 |
| `OSRX_UNIT_MAX` | `9` | 单位字符串最大长度，含 NUL 终止符 |
| `OSRX_B62_MAX` | `14` | Base62 字符串最大长度，含 NUL 终止符 |
| `OSRX_BODY_MAX` | `64` | body 最大字节数（须 ≤ `OSRX_PACKET_MAX - 13 - 3`）|

---

## 解码器行为

| 宏 | 默认值 | 描述 |
|---|---|---|
| `OSRX_VALUE_SCALE` | `10000` | `field->scaled` 除以此值得到实际值。须与 TX 侧保持一致。|
| `OSRX_CMD_DATA_FULL` | `63` | 期望的 `cmd` 字节（0x3F）。其他值的帧将被拒绝。|

---

## 功能开关

| 宏 | 默认值 | 节省 Flash | 节省 RAM | 效果 |
|---|---|---|---|---|
| `OSRX_VALIDATE_CRC8` | `1` | ~80 B（AVR）| 0 | 设为 `0` 跳过 body CRC-8 校验。**不建议生产环境使用。**|
| `OSRX_VALIDATE_CRC16` | `1` | ~90 B（AVR）| 0 | 设为 `0` 跳过整帧 CRC-16 校验。**不建议使用。**|
| `OSRX_NO_PARSER` | `0` | ~316 B | 102 B | 设为 `1` 排除流式解析器（`OSRXParser`）。仅配合 `osrx_sensor_recv()` 使用。|
| `OSRX_NO_TIMESTAMP` | `0` | ~20 B | 4 B | 设为 `1` 从 `osrx_packet_meta` 中去掉 `ts_sec` 字段。适用于 64 B 以下的超小目标。|

---

## 配置预设等级

### Ultra 等级（ATtiny85 / ATmega48 — 每字节都要省）

```c
/* 在任何 OSynaptic-RX 包含之前放置，或通过 CMake -D 标志传入 */
#define OSRX_NO_PARSER       1   /* 排除 OSRXParser：节省 316 B Flash + 102 B RAM */
#define OSRX_NO_TIMESTAMP    1   /* 节省 20 B Flash，4 B RAM */
#define OSRX_VALIDATE_CRC8   0   /* 节省 ~80 B Flash（接受 CRC8 风险）*/
#define OSRX_PACKET_MAX     64   /* 帧较短时可缩小缓冲区 */
```

CMake 等效写法：
```cmake
cmake -B build \
  -DOSRX_NO_PARSER=ON \
  -DOSRX_NO_TIMESTAMP=ON \
  -DOSRX_VALIDATE_CRC8=0 \
  -DOSRX_PACKET_MAX=64
```

### Tight 等级（ATmega88 — 1 KB RAM，8 KB Flash）

```c
#define OSRX_NO_TIMESTAMP    1
/* 保留 CRC 校验和解析器 */
```

### Standard 等级（ATmega328P / Uno — 舒适默认值）

无需任何覆盖，直接使用库默认值。

### Comfort 等级（ATmega2560 / ESP32 — 多通道）

```c
#define OSRX_PACKET_MAX    128   /* 允许更大的帧 */
/* 其他默认值不变；为每个通道实例化独立的 OSRXParser */
```

---

## CMake 覆盖示例

```cmake
# 极小 AVR 目标：无解析器，无时间戳，无 CRC8
cmake -B build \
  -DOSRX_NO_PARSER=ON \
  -DOSRX_NO_TIMESTAMP=ON \
  -DOSRX_VALIDATE_CRC8=0

# 多通道大缓冲区
cmake -B build -DOSRX_PACKET_MAX=128

# Debug 构建，开启全部校验
cmake -B build -DCMAKE_BUILD_TYPE=Debug
```
