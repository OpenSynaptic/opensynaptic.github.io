---
id: 06-mcu-deployment
title: MCU Deployment Reference
sidebar_label: MCU Deployment
---

# MCU Deployment Reference

## 8-bit AVR Family

| MCU | Flash | RAM | UART | Mode | Tier | Notes |
|---|---|---|---|---|---|---|
| ATtiny85 | 8 KB | 512 B | USI/SW | No parser | Ultra | Disable parser; feed full LoRa/UDP datagram directly |
| ATmega48 | 4 KB | 512 B | HW UART0 | No parser | Ultra | Only 512 B total RAM; disable parser to fit |
| ATmega88 | 8 KB | 1 KB | HW UART0 | Full parser | Standard | First AVR comfortable with full parser |
| ATmega168 | 16 KB | 1 KB | HW UART0 | Full parser | Standard | |
| ATmega328P | 32 KB | 2 KB | HW UART0 | Full parser | Standard | Arduino Uno/Nano baseline. Recommended entry point. |
| ATmega32U4 | 32 KB | 2.5 KB | HW UART + USB | Full parser | Standard | USB-CDC: feed bytes from SerialUSB.read() |
| ATmega2560 | 256 KB | 8 KB | 4× HW UART | Full parser | Comfort | Multi-channel: one OSRXParser per UART × 4 |
| ATmega4809 | 48 KB | 6 KB | 4× USART | Full parser | Comfort | Arduino Nano Every (megaAVR-0); UPDI programming |

Config tiers: **Ultra / Tight / Standard / Comfort**. See [Configuration](./05-configuration) for macro settings.

## 32-bit Targets

| MCU | Flash | RAM | Mode | Notes |
|---|---|---|---|---|
| STM32F030F4 | 16 KB | 4 KB | Full parser | Cortex-M0; all APIs fit comfortably |
| STM32F103C8 | 64 KB | 20 KB | Full parser | Multi-channel receiver; 3× UART available |
| ESP8266 | 1–4 MB | 80 KB | Full parser | One UDP datagram per osrx_feed_bytes call |
| ESP32 | 4 MB | 520 KB | Full parser | Preferred LAN gateway platform |
| RP2040 | 2 MB | 264 KB | Full parser | PIO-based UART; DMA callback into osrx_feed_bytes |
