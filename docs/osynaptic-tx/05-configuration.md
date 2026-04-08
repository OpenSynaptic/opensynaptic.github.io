---
id: 05-configuration
title: Configuration Macros
sidebar_label: Configuration
---

# Configuration Macros

All macros live in `ostx_config.h` (or set by CMake/Arduino IDE). Set them **before** including any `<OSynaptic-TX.h>` header.

## Buffer Sizes

| Macro | Default | Unit | Description |
|---|---|---|---|
| `OSTX_PACKET_MAX` | `96` | bytes | Maximum output packet size. Must be large enough for header + longest possible body |
| `OSTX_ID_MAX` | `9` | bytes | Sensor ID max length (including NUL); default allows up to 8 chars |
| `OSTX_UNIT_MAX` | `9` | bytes | Unit string max length (including NUL) |

## Value Scaling

| Macro | Default | Description |
|---|---|---|
| `OSTX_VALUE_SCALE` | `10000` | Fixed-point scale factor. `scaled = real_value × OSTX_VALUE_SCALE` |

You can set this to any power of ten. Example: `100` for 2-decimal-place precision saves approximately 1-2 Base62 digits per packet.

## Timestamp

| Macro | Default | Description |
|---|---|---|
| `OSTX_NO_TIMESTAMP` | `0` | Set to `1` to omit timestamp fields from struct and packet. Saves ~20 B Flash + 4 B stack |

When `OSTX_NO_TIMESTAMP=1`, pass `0` for the `ts_sec` argument; the library ignores the value and the TS_SEC field is zeroed in the packet.

## Feature Toggles

| Macro | Default | Description |
|---|---|---|
| `OSTX_NO_STATIC` | `0` | Set to `1` to exclude Tier B (static descriptor API) |
| `OSTX_NO_STREAM` | `0` | Set to `1` to exclude Tier C (streaming callback API) |
| `OSTX_DISABLE_B62_TABLE` | `0` | Not applicable — TX uses a lookup-table encoder for speed |

## Memory Profiles (AVR, avr-gcc -Os, ATmega328P)

| Profile | Defines | Flash | Stack | Static RAM |
|---|---|---|---|---|
| Full (all tiers) | defaults | ~760 B | ~137 B (Tier A) | 96 B |
| Tier B only | `OSTX_NO_STREAM=1` | ~430 B | ~51 B | 96 B |
| Tier C only | `OSTX_NO_STATIC=1` | ~600 B | ~21 B | 0 B |
| No timestamp | `OSTX_NO_TIMESTAMP=1` | ~740 B | ~117 B | 96 B |
| Minimal | `OSTX_NO_STATIC=1 OSTX_NO_STREAM=1` | ~600 B | ~137 B | 96 B (Tier A only) |

## CMake Usage

```cmake
target_compile_definitions(my_sensor PRIVATE
    OSTX_NO_TIMESTAMP=1
    OSTX_NO_STATIC=1
)
```

## Arduino IDE Usage

Add to **Sketch > Sketch Properties** (Arduino 3.x) or define before the include:

```c
#define OSTX_NO_TIMESTAMP 1
#define OSTX_NO_STATIC    1
#include <OSynaptic-TX.h>
```
