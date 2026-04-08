---
id: 07-transport-selection
title: Transport Selection Guide
sidebar_label: Transport Selection
---

# Transport Selection Guide

## UART / RS-485 — Use Streaming Parser

- Feed bytes from UART ISR using osrx_feed_byte()
- Call osrx_feed_done() after 15 ms idle gap
- For distances > 10 m add RS-485 driver (MAX485 / SN75176)

## WiFi UDP (ESP32/ESP8266) — No Parser

- Each UDP datagram = one complete frame
- Call osrx_feed_bytes(buf, n) or osrx_sensor_recv() per parsePacket()
- Set OSRX_NO_PARSER=1 to save 316 B Flash + 102 B RAM

## LoRa (SX1276/SX1278) — No Parser

- Each LoRa packet = one complete frame
- Call osrx_sensor_recv() inside onReceive
- Available RSSI/SNR from LoRa radio API

## SPI / I²C Bridge — No Parser

- SPI CS-rising ISR triggers osrx_feed_done()
- I²C stop-condition triggers osrx_feed_done()

## Multi-Channel — One Parser Per Channel

```c
static OSRXParser chan[4];  /* 4 × 102 B = 408 B RAM on ATmega2560 */

void uart0_isr(void) { osrx_feed_byte(&chan[0], UDR0); }
void uart1_isr(void) { osrx_feed_byte(&chan[1], UDR1); }
void uart2_isr(void) { osrx_feed_byte(&chan[2], UDR2); }
void uart3_isr(void) { osrx_feed_byte(&chan[3], UDR3); }

/* In idle-gap detection, call osrx_feed_done(&chan[n]) per channel */
```
