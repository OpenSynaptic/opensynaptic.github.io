---
id: 06-mcu-deployment
title: MCU 部署参考
sidebar_label: MCU 部署
---

# MCU 部署参考

## 8 位 AVR 系列

| MCU | Flash | RAM | UART | 模式 | 等级 | 备注 |
|---|---|---|---|---|---|---|
| ATtiny85 | 8 KB | 512 B | USI/软件 | 无解析器 | Ultra | 禁用解析器；直接将完整 LoRa/UDP 数据报喂入 |
| ATmega48 | 4 KB | 512 B | 硬件 UART0 | 无解析器 | Ultra | 总 RAM 仅 512 B；须禁用解析器 |
| ATmega88 | 8 KB | 1 KB | 硬件 UART0 | 完整解析器 | Standard | 第一款能舒适运行完整解析器的 AVR |
| ATmega168 | 16 KB | 1 KB | 硬件 UART0 | 完整解析器 | Standard | |
| ATmega328P | 32 KB | 2 KB | 硬件 UART0 | 完整解析器 | Standard | Arduino Uno/Nano 基准。推荐入门平台。|
| ATmega32U4 | 32 KB | 2.5 KB | 硬件 UART + USB | 完整解析器 | Standard | USB-CDC：从 `SerialUSB.read()` 喂入字节 |
| ATmega2560 | 256 KB | 8 KB | 4× 硬件 UART | 完整解析器 | Comfort | 多通道：每个 UART 一个 OSRXParser，共 4 路 |
| ATmega4809 | 48 KB | 6 KB | 4× USART | 完整解析器 | Comfort | Arduino Nano Every（megaAVR-0）；UPDI 烧录 |

配置等级：**Ultra / Tight / Standard / Comfort**。宏设置详见[配置参考](./05-configuration)。

## 32 位目标

| MCU | Flash | RAM | 模式 | 备注 |
|---|---|---|---|---|
| STM32F030F4 | 16 KB | 4 KB | 完整解析器 | Cortex-M0；所有 API 可轻松适配 |
| STM32F103C8 | 64 KB | 20 KB | 完整解析器 | 多通道接收器；3× UART 可用 |
| ESP8266 | 1–4 MB | 80 KB | 完整解析器 | 每次 `osrx_feed_bytes` 调用对应一个 UDP 数据报 |
| ESP32 | 4 MB | 520 KB | 完整解析器 | 推荐的局域网网关平台 |
| RP2040 | 2 MB | 264 KB | 完整解析器 | PIO 硬件 UART；DMA 回调调用 `osrx_feed_bytes` |
