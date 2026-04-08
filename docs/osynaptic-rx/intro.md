---
id: intro
title: OSynaptic-RX Overview
sidebar_label: Overview
---

# OSynaptic-RX

**RX-only OpenSynaptic packet decoder for 8-bit MCUs**

[![C89](https://img.shields.io/badge/C-89-00599C?logo=c&logoColor=white)](https://github.com/OpenSynaptic/OSynaptic-RX)
[![Version](https://img.shields.io/badge/version-1.0.0-2E8B57)](https://github.com/OpenSynaptic/OSynaptic-RX/releases)
[![AVR](https://img.shields.io/badge/AVR-supported-00599C)](https://github.com/OpenSynaptic/OSynaptic-RX)
[![ESP32](https://img.shields.io/badge/ESP32-supported-E7352C)](https://github.com/OpenSynaptic/OSynaptic-RX)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue)](https://github.com/OpenSynaptic/OSynaptic-RX/blob/main/LICENSE)

OSynaptic-RX decodes OpenSynaptic sensor frames from any serial transport (UART / UDP / LoRa / RS-485 / SPI) into validated integer sensor readings using pure C89, with no heap usage and a stack peak as low as **55 bytes** on AVR.

**GitHub:** [https://github.com/OpenSynaptic/OSynaptic-RX](https://github.com/OpenSynaptic/OSynaptic-RX)

---

## Why OSynaptic-RX?

| Feature | Details |
|---|---|
| **RX-only, no encode code** | Flash cost is a fraction of a full-duplex library |
| **C89 clean** | Compiles on every toolchain targeting 8-bit MCUs: avr-gcc, SDCC, IAR, MPLAB XC8 |
| **No heap** | Zero `malloc`/`free` calls; all state in a stack-or-global `OSRXParser` |
| **No float** | Values decoded into fixed-point scaled integers (`field->scaled / OSRX_VALUE_SCALE`) |
| **Dual CRC** | CRC-8/SMBUS (body) + CRC-16/CCITT-FALSE (full frame) — bit-loop, 0 B RAM, no lookup table |
| **Spec-compatible** | Decodes every frame from OSynaptic-TX and the OpenSynaptic Python hub without glue code |

---

## Try In 30 Seconds

```
Arduino IDE → Sketch > Include Library > Add .ZIP Library → select OSynaptic-RX.zip
File > Examples > OSynaptic-RX > BasicRX → Upload
```

Connect an OSynaptic-TX node to the RX board's Serial port. Open Serial Monitor at **9600 baud** — decoded sensor readings appear once per received frame.

---

## Two Decode Paths

| Path | API | Best for |
|---|---|---|
| **Streaming parser** | `osrx_feed_byte()` + `osrx_feed_done()` | UART with idle-gap, USB-CDC |
| **Direct frame decode** | `osrx_sensor_recv()` | UDP, LoRa, SPI (frame boundary from transport) |

The streaming parser uses `OSRXParser` (102 B RAM on AVR). For transports with natural frame boundaries, set `OSRX_NO_PARSER=1` to save **102 B RAM + 316 B Flash** and call `osrx_sensor_recv()` directly on the datagram buffer.

---

## Memory Footprint

### Streaming parser (UART / RS-485)

| Resource | Size |
|---|---|
| OSRXParser static RAM | 102 B (buf[96] + len + fn_ptr + ctx_ptr) |
| Stack peak in callback | ~55 B |
| Flash (full defaults, -Os) | ~616 B |

### Direct decode (UDP / LoRa, `OSRX_NO_PARSER=1`)

| Resource | Size |
|---|---|
| OSRXParser RAM | 0 B (parser excluded) |
| Stack peak (`osrx_sensor_recv`) | ~41 B |
| Flash (-Os) | ~442 B |

### Minimum supported MCU

| Mode | Min RAM | Min Flash | Example device |
|---|---|---|---|
| Streaming | ≥ 256 B | ≥ 2 KB | ATmega88 / ATmega168 |
| No parser | ≥ 64 B | ≥ 1 KB | ATtiny85 / ATmega48 |

---

## Quick Navigation

| Section | Description |
|---|---|
| [Quick Start](./01-quick-start) | Code walkthrough for three environments |
| [Installation](./02-installation) | Arduino IDE, CMake, and find_package |
| [Decode Paths](./03-decode-paths) | Streaming vs direct decode — choose the right one |
| [Wire Format](./04-wire-format) | Byte-level packet layout, CRC specs, Base62 decode |
| [Configuration](./05-configuration) | All `osrx_config.h` macros with defaults |
| [MCU Deployment](./06-mcu-deployment) | Per-MCU config tier table |
| [Transport Selection](./07-transport-selection) | UART, UDP, LoRa, SPI, multi-channel |
| [Flash Optimization](./08-flash-optimization) | 8 flash profiles with measured values |
| [API Reference](./09-api-reference) | Complete function and struct reference |
| [Examples](./10-examples) | Five annotated examples |

---

## Related Projects

- **OSynaptic-TX** — the sender side: [GitHub](https://github.com/OpenSynaptic/OSynaptic-TX) · [Docs](../osynaptic-tx/intro)
- **OSynaptic-FX** — high-level C99 runtime: [GitHub](https://github.com/OpenSynaptic/OSynaptic-FX) · [Docs](../osynaptic-fx/intro)
- **OpenSynaptic** — the Python/Rust server hub: [GitHub](https://github.com/OpenSynaptic/OpenSynaptic)
