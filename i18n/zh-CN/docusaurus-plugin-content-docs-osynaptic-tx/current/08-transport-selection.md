---
id: 08-transport-selection
title: 传输方式选择指南
sidebar_label: 传输方式选择
---

# 传输方式选择指南

## UART / RS-485

最常见的传输方式。在 `loop()` 或 ISR 触发器中调用 `ostx_stream_pack()`（或 `ostx_static_pack()`）。

```c
OSTX_STATIC_DEFINE(s_t, AID, "T1", "Cel");
static void emit(ostx_u8 b, void*) { Serial.write(b); }

void loop() {
    ostx_stream_pack(&s_t, tid++,
                     (ostx_u32)(millis()/1000), scaled, emit, NULL);
    delay(1000);
}
```

距离 > 10 m 时，使用 MAX485 或 SN75176 RS-485 收发器。OpenSynaptic 线路格式自带分界（无需 `\n`）。

## WiFi UDP（ESP32 / ESP8266）

使用 `ostx_static_pack()` 构建缓冲区，然后作为 UDP 数据报发送：

```c
#include <WiFiUdp.h>
WiFiUDP udp;
static ostx_u8 buf[OSTX_PACKET_MAX];

void send_reading(void) {
    int n = ostx_static_pack(&s_temp, tid++,
                              (ostx_u32)(millis()/1000), scaled, buf);
    if (n > 0) {
        udp.beginPacket(SERVER_IP, SERVER_PORT);
        udp.write(buf, (size_t)n);
        udp.endPacket();
    }
}
```

不需要流式支持时设置 `OSTX_NO_STREAM=1` 可节省 160 B Flash。

## LoRa（SX1276 / SX1278 / SX1262）

使用 `ostx_static_pack()` 构建帧，再用 LoRa 库发送：

```c
static ostx_u8 buf[OSTX_PACKET_MAX];

void send_lora(void) {
    int n = ostx_static_pack(&s_hum, tid++,
                              (ostx_u32)(millis()/1000), scaled, buf);
    if (n > 0 && LoRa.beginPacket()) {
        LoRa.write(buf, (size_t)n);
        LoRa.endPacket();
    }
}
```

LoRa 负载限制：SX1276 最大 255 字节；OpenSynaptic 帧通常 20–40 字节，远在预算之内。

## nRF24L01+

使用 `ostx_static_pack()` 构建，必要时分割为 32 字节片段（OpenSynaptic 帧通常 < 32 字节）：

```c
static ostx_u8 buf[OSTX_PACKET_MAX];

void send_nrf(void) {
    int n = ostx_static_pack(&s_co2, tid++,
                              (ostx_u32)(millis()/1000), scaled, buf);
    if (n > 0 && n <= 32) {
        radio.write(buf, (uint8_t)n);
    }
}
```

## CAN 总线

使用等级 C 逐字节将帧填入 CAN 数据字段（最多 8 字节/帧）：

```c
static uint8_t can_buf[8];
static int     can_idx = 0;

static void emit_can(ostx_u8 b, void*) {
    can_buf[can_idx++] = b;
    if (can_idx == 8) {
        CAN.sendMsgBuf(0x100, 0, 8, can_buf);
        can_idx = 0;
    }
}
```
