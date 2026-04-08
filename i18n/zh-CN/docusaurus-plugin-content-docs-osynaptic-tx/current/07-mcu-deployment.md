---
id: 07-mcu-deployment
title: MCU 部署参考
sidebar_label: MCU 部署
---

# MCU 部署参考

## 8 位 AVR

| MCU | Flash | RAM | UART | 推荐等级 | 备注 |
|---|---|---|---|---|---|
| ATtiny25 | 2 KB | 128 B | USI（软件）| C | 极度受限；等级 C + `OSTX_NO_TIMESTAMP=1` |
| ATtiny45 | 4 KB | 256 B | USI（软件）| C | |
| ATtiny85 | 8 KB | 512 B | USI（软件）| C | 等级 B 谨慎也能适配 |
| ATmega48 | 4 KB | 512 B | 硬件 UART0 | C | |
| ATmega88 | 8 KB | 1 KB | 硬件 UART0 | B/C | 第一款能舒适使用等级 B 的 MCU |
| ATmega168 | 16 KB | 1 KB | 硬件 UART0 | B | |
| ATmega328P | 32 KB | 2 KB | 硬件 UART0 | A/B/C | Arduino Uno/Nano 基准 |
| ATmega32U4 | 32 KB | 2.5 KB | 硬件 UART + USB | A | Arduino Leonardo/Micro |
| ATmega2560 | 256 KB | 8 KB | 4× 硬件 UART | A | Arduino Mega 2560 |
| ATmega4809 | 48 KB | 6 KB | 4× USART | A | Arduino Nano Every |

## 8 位 PIC（SDCC / MPLAB XC8）

| MCU | Flash | RAM | 等级 | 备注 |
|---|---|---|---|---|
| PIC16F877A | 14 KB | 368 B | B/C | XC8 + `OSTX_NO_TIMESTAMP=1` |
| PIC18F4550 | 32 KB | 2 KB | A/B | 完整支持 |
| PIC18F97J60 | 128 KB | 3.87 KB | A | 支持以太网的 PIC18 |

## 8 位 8051（SDCC / Keil）

| MCU | Flash | RAM | 等级 | 备注 |
|---|---|---|---|---|
| AT89S52 | 8 KB | 256 B | C | 仅等级 C + 最小配置 |
| STC89C52RC | 8 KB | 512 B | C | |
| STC15W4K56S4 | 56 KB | 4 KB | B/C | |

## STM8

| MCU | Flash | RAM | 等级 | 备注 |
|---|---|---|---|---|
| STM8S003F3 | 8 KB | 1 KB | C | 仅 UART1；优先选择等级 C |
| STM8S105C6 | 32 KB | 2 KB | B | |
| STM8S207R8 | 64 KB | 6 KB | A | |

## 32 位 ARM 与 RISC-V

| MCU | Flash | RAM | 备注 |
|---|---|---|---|
| STM32F030F4 | 16 KB | 4 KB | 所有等级可用；UART DMA TX 舒适 |
| STM32F103C8 | 64 KB | 20 KB | 完整多传感器节点 |
| ESP8266 | 1–4 MB | 80 KB | WiFi UDP；每次传感器读数一次调用 |
| ESP32 | 4 MB | 520 KB | 推荐的 WiFi 网关 |
| RP2040 | 2 MB | 264 KB | PIO 硬件 UART；DMA 友好，搭配等级 C |
| GigaDevice GD32F130 | 64 KB | 8 KB | STM32 直接替代品 |
| WCH CH32V003 | 16 KB | 2 KB | RISC-V；仅等级 C |

## 配置等级映射

| 等级 | RAM 预算 | Flash 预算 | 典型目标 |
|---|---|---|---|
| C（流式）| ≥ 128 B | ≥ 2 KB | ATtiny85、AT89S52 |
| B（静态）| ≥ 512 B | ≥ 4 KB | ATmega88、STM8S003、PIC16F877A |
| A（动态）| ≥ 1 KB | ≥ 8 KB | ATmega328P、STM32、ESP32 |
