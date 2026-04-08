---
id: 01-quick-start
title: 快速入门
sidebar_label: 快速入门
---

# OSynaptic-RX — 快速入门

三种集成模式：Arduino 串口流式接收、ESP32 UDP、以及原生 C。

---

## 模式 1 — Arduino 串口流式接收（UART + 空闲间隔）

适用于通过硬件串口从 OSynaptic-TX 设备接收数据的任意 Arduino 开发板。

```c
#include <OSynaptic-RX.h>

static OSRXParser parser;

/* 当解析器收到一个完整且结构有效的帧时触发 */
static void on_frame(const osrx_packet_meta  *meta,
                     const osrx_sensor_field *field,
                     const osrx_u8 *raw, int raw_len, void *ctx)
{
    /* 丢弃 CRC 校验失败的帧 */
    if (!meta->crc8_ok || !meta->crc16_ok) return;

    /* 非传感器帧（HEART、DIFF 等）field 为 NULL */
    if (!field) return;

    /* field->scaled / OSRX_VALUE_SCALE = 实际浮点值（整数运算） */
    long whole = (long)(field->scaled / OSRX_VALUE_SCALE);
    long frac  = (long)(field->scaled % OSRX_VALUE_SCALE);
    if (frac < 0) frac = -frac;

    Serial.print(field->sensor_id);
    Serial.print(": ");
    Serial.print(whole);  Serial.print(".");
    Serial.print(frac, DEC);
    Serial.print(" ");
    Serial.println(field->unit);
}

void setup() {
    Serial.begin(9600);
    osrx_parser_init(&parser, on_frame, NULL);
}

static unsigned long last_byte_ms = 0;
static bool          got_byte     = false;

void loop() {
    while (Serial.available()) {
        osrx_feed_byte(&parser, (osrx_u8)Serial.read());
        last_byte_ms = millis();
        got_byte = true;
    }
    /* 15 ms 空闲间隔表示帧结束 */
    if (got_byte && (millis() - last_byte_ms) > 15) {
        osrx_feed_done(&parser);
        got_byte = false;
    }
}
```

**要点：**
- `osrx_parser_init()` 只需注册一次回调；解析器在每帧结束后自动重置。
- 15 ms 空闲间隔阈值在波特率 ≥ 9600 时稳定可靠。1200 波特时请调高至 50 ms。
- `field->scaled` 始终采用定点数，缩放因子为 `OSRX_VALUE_SCALE`（默认 10000）。例：`scaled = 215000` → `21.5000 °C`。

---

## 模式 2 — ESP32 UDP（每个数据报一帧）

每个 UDP 数据报恰好包含一个完整的 OpenSynaptic 帧，无需空闲间隔解析器。

```c
#include <OSynaptic-RX.h>
#include <WiFiUdp.h>

WiFiUDP udp;
static osrx_u8 buf[OSRX_PACKET_MAX];

void receive_loop(void) {
    int n = udp.parsePacket();
    if (n <= 0) return;

    int r = udp.read(buf, sizeof(buf));
    if (r <= 0) return;

    osrx_packet_meta  meta;
    osrx_sensor_field field;

    if (osrx_sensor_recv(buf, r, &meta, &field)) {
        /* 使用 field.sensor_id, field.unit, field.scaled */
    }
}
```

**要点：**
- 无需 `OSRXParser` 结构体 — 节省 102 B RAM。
- 用 `osrx_sensor_recv()` 一次性完成帧解码与 CRC 校验。

---

## 模式 3 — 原生 C（不带 Arduino 框架）

适用于桌面 Linux/macOS 测试或嵌入式 RTOS 环境。

```c
#include "OSynaptic-RX.h"
#include <stdio.h>

static void on_frame(const osrx_packet_meta  *meta,
                     const osrx_sensor_field *field,
                     const osrx_u8 *raw, int len, void *ctx)
{
    if (!field) return;
    printf("AID=%08X sensor=%s unit=%s scaled=%ld\n",
           meta->aid, field->sensor_id, field->unit,
           (long)field->scaled);
}

int main(void) {
    OSRXParser p;
    osrx_parser_init(&p, on_frame, NULL);

    /* 从标准输入逐字节喂入 */
    int c;
    while ((c = getchar()) != EOF) {
        osrx_feed_byte(&p, (osrx_u8)c);
    }
    osrx_feed_done(&p);
    return 0;
}
```
