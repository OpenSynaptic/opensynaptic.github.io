---
id: intro
title: OSynaptic-TX 概述
sidebar_label: 概述
---

# OSynaptic-TX

**面向 8 位 MCU 的 TX 专用 OpenSynaptic 数据包编码器**

[![C89](https://img.shields.io/badge/C-89-00599C?logo=c&logoColor=white)](https://github.com/OpenSynaptic/OSynaptic-TX)
[![Version](https://img.shields.io/badge/version-1.0.0-2E8B57)](https://github.com/OpenSynaptic/OSynaptic-TX/releases)
[![AVR](https://img.shields.io/badge/AVR-supported-00599C)](https://github.com/OpenSynaptic/OSynaptic-TX)
[![ESP32](https://img.shields.io/badge/ESP32-supported-E7352C)](https://github.com/OpenSynaptic/OSynaptic-TX)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue)](https://github.com/OpenSynaptic/OSynaptic-TX/blob/main/LICENSE)

OSynaptic-TX 使用纯 C89 代码将传感器读数编码为 OpenSynaptic 线格式（FULL 帧），不使用堆内存，在 AVR 上栈峰值低至 **21 字节**。可通过任意串行传输直接与 OpenSynaptic 服务器及 OSynaptic-FX 网关配对使用。

**GitHub：** [https://github.com/OpenSynaptic/OSynaptic-TX](https://github.com/OpenSynaptic/OSynaptic-TX)

---

## 为什么选择 OSynaptic-TX？

| 特性 | 说明 |
|------|------|
| **仅 TX，无解码代码** | Flash 占用仅为全双工库的一小部分 |
| **C89 纯净** | 兼容所有面向 8 位 MCU 的工具链：avr-gcc、SDCC、IAR、MPLAB XC8 |
| **无堆内存** | 零 `malloc`/`free` 调用；所有缓冲区保存在栈上或为 `static` |
| **三级 API** | 按 MCU 的 RAM 预算选择合适的 API 层级 |

---

## 快速导航

- [快速上手](01-quick-start)
- [安装指南](02-installation)
- [API 层级](03-api-tiers)
- [线格式](04-wire-format)
- [配置说明](05-configuration)
- [单位验证](06-unit-validation)
- [MCU 部署](07-mcu-deployment)
- [传输选择](08-transport-selection)
- [API 参考](09-api-reference)
- [示例](10-examples)
