---
id: 08-transport-selection
title: Transport Selection Guide
sidebar_label: Transport Selection
---

# Transport Selection Guide

## UART / RS-485

Most common transport. Call `ostx_stream_pack()` (or `ostx_static_pack()`) inside `loop()` or an ISR trigger.

```c
OSTX_STATIC_DEFINE(s_t, AID, "T1", "Cel");
static void emit(ostx_u8 b, void*) { Serial.write(b); }

void loop() {
    ostx_stream_pack(&s_t, tid++,
                     (ostx_u32)(millis()/1000), scaled, emit, NULL);
    delay(1000);
}
```

For distances > 10 m, use a MAX485 or SN75176 RS-485 transceiver. The OSynaptic wire format is self-delimiting (no `\n` required).

## WiFi UDP (ESP32 / ESP8266)

Use `ostx_static_pack()` to build a buffer, then send as a UDP datagram:

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

Set `OSTX_NO_STREAM=1` to save 160 B Flash when streaming is not needed.

## LoRa (SX1276 / SX1278 / SX1262)

Use `ostx_static_pack()` to build the frame, then send with the LoRa library:

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

LoRa payload limit: SX1276 max payload 255 bytes; OpenSynaptic frames are typically 20-40 bytes — well within budget.

## nRF24L01+

Use `ostx_static_pack()` and split into 32-byte fragments if needed (OpenSynaptic frames are typically < 32 bytes for 1-2 sensors):

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

## Standalone WiFi vs Integrated WiFi

| Approach | MCU | WiFi module | Integration |
|---|---|---|---|
| Integrated | ESP32 / ESP8266 | On-chip | Best — single firmware |
| AT command | ATmega328P | ESP-01(AT) | Use `Serial1` for sensor TX, `Serial` for AT channel |
| SPI bridge | ATmega328P | Wiznet W5500 | Build UDP frame directly with Ethernet library |

## Transport Summary

| Transport | Buffer mode | Typical latency | Range |
|---|---|---|---|
| UART | Stream (Tier C) | < 1 ms | 1–15 m (RS-485: 1200 m) |
| WiFi UDP | Buffered (Tier B) | 5–50 ms LAN | Unlimited (LAN/WAN) |
| LoRa | Buffered (Tier B) | 50–500 ms | 0.5–15 km |
| nRF24L01+ | Buffered (Tier B) | 1–5 ms | 10–100 m |
| BLE (notify) | Stream (Tier C) | 10–45 ms | 10–30 m |
