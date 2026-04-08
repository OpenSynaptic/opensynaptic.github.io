---
id: 01-quick-start
title: 快速入门
sidebar_label: 快速入门
---

# OSynaptic-TX — 快速入门

三种 API 等级，三个代码示例。从 **API C** 开始，适用于任意 8 位 AVR。

---

## API C — 零缓冲流式发送（推荐用于 SRAM ≤ 4 KB 的 AVR）

栈峰值：**~21 字节** | 静态 RAM：**0 字节**

```c
#include <OSynaptic-TX.h>

/* 传感器描述符存储在 Flash 中 — 占用 0 字节 SRAM */
OSTX_STATIC_DEFINE(s_temp, 0x00000001UL, "T1", "Cel");

/* 发送回调 — 将每个字节直接交给 Serial 驱动 */
static void emit_byte(ostx_u8 b, void *ctx) {
    (void)ctx;
    Serial.write(b);
}

static ostx_u8 tid = 0;

void setup() {
    Serial.begin(115200);
}

void loop() {
    /* 值已按 OSTX_VALUE_SCALE（默认 10000）预缩放：
     * 215000 = 21.5000 °C
     * 替换为你的 ADC 读数 × 10000 */
    ostx_stream_pack(&s_temp, tid++,
                     (ostx_u32)(millis() / 1000UL),
                     215000L,
                     emit_byte, NULL);
    delay(1000);
}
```

**工作原理：** `ostx_stream_pack()` 对每个输出字节调用一次 `emit` 回调，无任何缓冲——每字节直接送往传输层，静态 RAM 保持为零。

---

## API B — 静态描述符（栈开销低于 A）

栈峰值：**~51 字节** | 静态 RAM：**96 字节**（输出缓冲区）

```c
#include <OSynaptic-TX.h>

OSTX_STATIC_DEFINE(s_hum, 0x00000001UL, "H1", "Pct");

static ostx_u8 out_buf[OSTX_PACKET_MAX];
static ostx_u8 tid = 0;

void setup() { Serial.begin(115200); }

void loop() {
    /* 650000 = 65.0000% 相对湿度 */
    int len = ostx_static_pack(&s_hum, tid++,
                               (ostx_u32)(millis() / 1000UL),
                               650000L,
                               out_buf);
    if (len > 0)
        Serial.write(out_buf, (size_t)len);
    delay(1000);
}
```

**何时选 B vs C：**
- 需要在发送前将完整帧放入缓冲区时使用 B（如 LoRa 的 `LoRa.write(buf, len)` 模式）。
- 可以按字节生成实时发送时使用 C（Serial、UDP、CAN）。

---

## API A — 动态字符串

栈峰值：**~137 字节** | 静态 RAM：**96 字节**

```c
#include <OSynaptic-TX.h>

static ostx_u8 out_buf[OSTX_PACKET_MAX];
static ostx_u8 tid = 0;

void loop() {
    /* 传感器 ID 和单位在运行时确定（如从 EEPROM 读取）*/
    int len = ostx_sensor_pack(0x00000001UL,
                               "T1", "Cel",
                               tid++,
                               (ostx_u32)(millis() / 1000UL),
                               215000L,
                               out_buf);
    if (len > 0)
        Serial.write(out_buf, (size_t)len);
    delay(1000);
}
```
