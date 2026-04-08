---
id: intro
title: OSynaptic-TX Overview
sidebar_label: Overview
---

# OSynaptic-TX

**TX-only OpenSynaptic packet encoder for 8-bit MCUs**

[![C89](https://img.shields.io/badge/C-89-00599C?logo=c&logoColor=white)](https://github.com/OpenSynaptic/OSynaptic-TX)
[![Version](https://img.shields.io/badge/version-1.0.0-2E8B57)](https://github.com/OpenSynaptic/OSynaptic-TX/releases)
[![AVR](https://img.shields.io/badge/AVR-supported-00599C)](https://github.com/OpenSynaptic/OSynaptic-TX)
[![ESP32](https://img.shields.io/badge/ESP32-supported-E7352C)](https://github.com/OpenSynaptic/OSynaptic-TX)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue)](https://github.com/OpenSynaptic/OSynaptic-TX/blob/main/LICENSE)

OSynaptic-TX encodes sensor readings into the OpenSynaptic wire format (FULL frames) using pure C89, no heap, and a stack peak as low as **21 bytes** on AVR. Pairs directly with the OpenSynaptic server and OSynaptic-FX gateway over any serial transport.

**GitHub:** [https://github.com/OpenSynaptic/OSynaptic-TX](https://github.com/OpenSynaptic/OSynaptic-TX)

---

## Why OSynaptic-TX?

| Feature | Details |
|---|---|
| **TX-only, no decode code** | Flash cost is a fraction of a full-duplex library |
| **C89 clean** | Compiles on every toolchain targeting 8-bit MCUs: avr-gcc, SDCC, IAR, MPLAB XC8 |
| **No heap** | Zero `malloc`/`free` calls; all buffers are stack or `static` |
| **Three API tiers** | Pick the tier that matches your MCU's RAM budget |
| **Spec-compatible** | Packets decode directly by OpenSynaptic server without glue code |

---

## Try In 30 Seconds

```
Arduino IDE → Sketch > Include Library > Add .ZIP Library → select OSynaptic-TX.zip
File > Examples > OSynaptic-TX > BasicTX → Upload
```

Open Serial Monitor at **115200 baud** — FULL packets stream out once per second.

---

## Three API Tiers

Choose the tier that matches your MCU's available RAM:

| Tier | Stack peak | Static RAM | Flash (~1 sensor) | When to use |
|---|---|---|---|---|
| **A** — `ostx_sensor_pack()` | ~137 B | 96 B | ~600 B | Dynamic runtime strings; most flexible |
| **B** — `ostx_static_pack()` | ~51 B | 96 B | ~430 B | Compile-time sensor descriptor in Flash |
| **C** — `ostx_stream_pack()` | ~21 B | 0 B | ~760 B | Zero-buffer streaming via callback — minimum RAM |

All three tiers produce **identical wire frames**. The linker drops unused modules automatically.

---

## Memory Footprint

### API C Streaming (recommended for AVR ≤ 4 KB SRAM)

| Resource | Value |
|---|---|
| Stack peak | ~21 bytes |
| Static RAM | 0 bytes |
| Flash (Uno/Nano, 1 sensor) | ~760 bytes |

### Minimum supported MCU

| Resource | Value | Example devices |
|---|---|---|
| RAM | ≥ 128 B | ATtiny25 / ATmega48 |
| Flash | ≥ 2 KB | ATtiny25 / ATmega48 |

---

## Quick Navigation

| Section | Description |
|---|---|
| [Quick Start](./01-quick-start) | API C, B, and A code examples |
| [Installation](./02-installation) | Arduino IDE, CMake, find_package |
| [API Tiers](./03-api-tiers) | When to use A vs B vs C |
| [Wire Format](./04-wire-format) | Byte-level packet layout |
| [Configuration](./05-configuration) | `ostx_config.h` macros |
| [Unit Validation](./06-unit-validation) | UCUM unit codes and SI prefix rules |
| [MCU Deployment](./07-mcu-deployment) | Per-MCU capability table |
| [Transport Selection](./08-transport-selection) | UART, UDP, LoRa, nRF24 guidance |
| [API Reference](./09-api-reference) | Complete function and struct reference |
| [Examples](./10-examples) | Five annotated examples |

---

## Related Projects

- **OSynaptic-RX** — the receiver side: [GitHub](https://github.com/OpenSynaptic/OSynaptic-RX) · [Docs](../osynaptic-rx/intro)
- **OSynaptic-FX** — high-level C99 runtime: [GitHub](https://github.com/OpenSynaptic/OSynaptic-FX) · [Docs](../osynaptic-fx/intro)
- **OpenSynaptic** — the Python/Rust server hub: [GitHub](https://github.com/OpenSynaptic/OpenSynaptic)
