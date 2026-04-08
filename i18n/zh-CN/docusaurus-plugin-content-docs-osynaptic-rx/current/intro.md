---
id: intro
title: OSynaptic-RX 概述
sidebar_label: 概述
---

# OSynaptic-RX

**面向 8 位 MCU 的 RX 专用 OpenSynaptic 数据包解码器**

[![C89](https://img.shields.io/badge/C-89-00599C?logo=c&logoColor=white)](https://github.com/OpenSynaptic/OSynaptic-RX)
[![Version](https://img.shields.io/badge/version-1.0.0-2E8B57)](https://github.com/OpenSynaptic/OSynaptic-RX/releases)
[![AVR](https://img.shields.io/badge/AVR-supported-00599C)](https://github.com/OpenSynaptic/OSynaptic-RX)
[![ESP32](https://img.shields.io/badge/ESP32-supported-E7352C)](https://github.com/OpenSynaptic/OSynaptic-RX)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue)](https://github.com/OpenSynaptic/OSynaptic-RX/blob/main/LICENSE)

OSynaptic-RX 使用纯 C89 代码，通过任意串行传输接口（UART / UDP / LoRa / RS-485 / SPI）将 OpenSynaptic 传感帧解码为经过验证的整数传感读数。不使用任何堆内存，在 AVR 上栈峰值低至 **55 字节**。

**GitHub：** [https://github.com/OpenSynaptic/OSynaptic-RX](https://github.com/OpenSynaptic/OSynaptic-RX)

---

## 为什么选择 OSynaptic-RX？

| 特性 | 说明 |
|------|------|
| **仅 RX，无编码代码** | Flash 占用仅为全双工库的一小部分 |
| **C89 纯净** | 兼容所有面向 8 位 MCU 的工具链：avr-gcc、SDCC、IAR、MPLAB XC8 |
| **无堆内存** | 零 `malloc`/`free` 调用；所有状态保存在栈或全局 `OSRXParser` 中 |
| **无浮点** | 值解码为定点缩放整数（`field->scaled / OSRX_VALUE_SCALE`） |

---

## 快速导航

- [快速上手](01-quick-start)
- [安装指南](02-installation)
- [解码路径](03-decode-paths)
- [线格式](04-wire-format)
- [配置说明](05-configuration)
- [MCU 部署](06-mcu-deployment)
- [传输选择](07-transport-selection)
- [Flash 优化](08-flash-optimization)
- [API 参考](09-api-reference)
- [示例](10-examples)
