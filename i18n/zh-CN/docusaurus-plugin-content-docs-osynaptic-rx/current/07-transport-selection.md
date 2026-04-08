---
id: 07-transport-selection
title: 传输方式选择指南
sidebar_label: 传输方式选择
---

# 传输方式选择指南

## UART / RS-485 — 使用流式解析器

- 在 UART ISR 中用 `osrx_feed_byte()` 喂入字节
- 15 ms 空闲间隔后调用 `osrx_feed_done()`
- 距离 > 10 m 时添加 RS-485 驱动器（MAX485 / SN75176）

## WiFi UDP（ESP32/ESP8266）— 无需解析器

- 每个 UDP 数据报 = 一帧完整数据
- 每次 `parsePacket()` 后调用 `osrx_feed_bytes(buf, n)` 或 `osrx_sensor_recv()`
- 设置 `OSRX_NO_PARSER=1` 可节省 316 B Flash + 102 B RAM

## LoRa（SX1276/SX1278）— 无需解析器

- 每个 LoRa 数据包 = 一帧完整数据
- 在 `onReceive` 回调中调用 `osrx_sensor_recv()`
- 可从 LoRa 无线电 API 获取 RSSI/SNR

## SPI / I²C 桥接 — 无需解析器

- SPI CS 上升沿 ISR 中触发 `osrx_feed_done()`
- I²C 停止条件中触发 `osrx_feed_done()`

## 多通道 — 每通道一个解析器

```c
static OSRXParser chan[4];  /* 4 × 102 B = ATmega2560 上 408 B RAM */

void uart0_isr(void) { osrx_feed_byte(&chan[0], UDR0); }
void uart1_isr(void) { osrx_feed_byte(&chan[1], UDR1); }
void uart2_isr(void) { osrx_feed_byte(&chan[2], UDR2); }
void uart3_isr(void) { osrx_feed_byte(&chan[3], UDR3); }

/* 在空闲间隔检测中，逐通道调用 osrx_feed_done(&chan[n]) */
```
