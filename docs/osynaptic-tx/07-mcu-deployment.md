---
id: 07-mcu-deployment
title: MCU Deployment Reference
sidebar_label: MCU Deployment
---

# MCU Deployment Reference

## 8-bit AVR

| MCU | Flash | RAM | UART | Recommended Tier | Notes |
|---|---|---|---|---|---|
| ATtiny25 | 2 KB | 128 B | USI (soft) | C | Extremely constrained; Tier C + `OSTX_NO_TIMESTAMP=1` |
| ATtiny45 | 4 KB | 256 B | USI (soft) | C | |
| ATtiny85 | 8 KB | 512 B | USI (soft) | C | Tier B also fits with care |
| ATmega48 | 4 KB | 512 B | HW UART0 | C | |
| ATmega88 | 8 KB | 1 KB | HW UART0 | B/C | First comfortable with Tier B |
| ATmega168 | 16 KB | 1 KB | HW UART0 | B | |
| ATmega328P | 32 KB | 2 KB | HW UART0 | A/B/C | Arduino Uno/Nano baseline |
| ATmega32U4 | 32 KB | 2.5 KB | HW UART + USB | A | Arduino Leonardo/Micro |
| ATmega2560 | 256 KB | 8 KB | 4× HW UART | A | Arduino Mega 2560 |
| ATmega4809 | 48 KB | 6 KB | 4× USART | A | Arduino Nano Every |

## 8-bit PIC (SDCC / MPLAB XC8)

| MCU | Flash | RAM | Tier | Notes |
|---|---|---|---|---|
| PIC16F877A | 14 KB | 368 B | B/C | XC8 with `OSTX_NO_TIMESTAMP=1` |
| PIC18F4550 | 32 KB | 2 KB | A/B | Full support |
| PIC18F97J60 | 128 KB | 3.87 KB | A | Ethernet-capable PIC18 |

## 8-bit 8051 (SDCC / Keil)

| MCU | Flash | RAM | Tier | Notes |
|---|---|---|---|---|
| AT89S52 | 8 KB | 256 B | C | Only Tier C + minimal config |
| STC89C52RC | 8 KB | 512 B | C | |
| STC15W4K56S4 | 56 KB | 4 KB | B/C | |

## STM8

| MCU | Flash | RAM | Tier | Notes |
|---|---|---|---|---|
| STM8S003F3 | 8 KB | 1 KB | C | UART1 only; Tier C preferred |
| STM8S105C6 | 32 KB | 2 KB | B | |
| STM8S207R8 | 64 KB | 6 KB | A | |

## 32-bit ARM & RISC-V

| MCU | Flash | RAM | Notes |
|---|---|---|---|
| STM32F030F4 | 16 KB | 4 KB | All tiers; UART DMA TX comfortable |
| STM32F103C8 | 64 KB | 20 KB | Full multi-sensor node |
| ESP8266 | 1–4 MB | 80 KB | WiFi UDP; one call per sensor reading |
| ESP32 | 4 MB | 520 KB | Preferred WiFi gateway |
| RP2040 | 2 MB | 264 KB | PIO-based UART; DMA-friendly with Tier C |
| GigaDevice GD32F130 | 64 KB | 8 KB | Drop-in STM32 replacement |
| WCH CH32V003 | 16 KB | 2 KB | RISC-V; Tier C only |

## Config Tier Mapping

| Tier | RAM budget | Flash budget | Typical targets |
|---|---|---|---|
| C (stream) | ≥ 128 B | ≥ 2 KB | ATtiny/85, AT89S52 |
| B (static) | ≥ 512 B | ≥ 4 KB | ATmega88, STM8S003, PIC16F877A |
| A (dynamic) | ≥ 1 KB | ≥ 8 KB | ATmega328P, STM32, ESP32 |
