---
id: 05-configuration
title: Configuration Reference
sidebar_label: Configuration
---

# Configuration Reference (`osrx_config.h`)

All macros are `#ifndef`-guarded. Override via CMake `-D` flags or by defining before including any OSynaptic-RX header.

---

## Buffer &amp; Field Sizes

| Macro | Default | Description |
|---|---|---|
| `OSRX_PACKET_MAX` | `96` | Maximum wire frame size in bytes (= `OSRXParser` buffer size). Increase for extended-body frames. |
| `OSRX_ID_MAX` | `9` | Max sensor ID length including NUL terminator |
| `OSRX_UNIT_MAX` | `9` | Max unit string length including NUL terminator |
| `OSRX_B62_MAX` | `14` | Max Base62 string length including NUL terminator |
| `OSRX_BODY_MAX` | `64` | Max body byte count (must be ≤ `OSRX_PACKET_MAX - 13 - 3`) |

---

## Decoder Behaviour

| Macro | Default | Description |
|---|---|---|
| `OSRX_VALUE_SCALE` | `10000` | Divide `field->scaled` by this to obtain the real value. Must match the TX side. |
| `OSRX_CMD_DATA_FULL` | `63` | Expected `cmd` byte (0x3F). Frames with other values are rejected. |

---

## Feature Toggles

| Macro | Default | Flash saved | RAM saved | Effect |
|---|---|---|---|---|
| `OSRX_VALIDATE_CRC8` | `1` | ~80 B (AVR) | 0 | Set to `0` to skip body CRC-8 check. **Not recommended for production.** |
| `OSRX_VALIDATE_CRC16` | `1` | ~90 B (AVR) | 0 | Set to `0` to skip full-frame CRC-16 check. **Not recommended.** |
| `OSRX_NO_PARSER` | `0` | ~316 B | 102 B | Set to `1` to exclude streaming parser (`OSRXParser`). Use with `osrx_sensor_recv()` only. |
| `OSRX_NO_TIMESTAMP` | `0` | ~20 B | 4 B | Set to `1` to exclude `ts_sec` field from `osrx_packet_meta`. Useful on sub-64 B targets. |

---

## Config Tier Presets

### Ultra tier (ATtiny85 / ATmega48 — every byte counts)

```c
/* Place before any OSynaptic-RX include, or via CMake -D flags */
#define OSRX_NO_PARSER       1   /* excludes OSRXParser: save 316 B Flash + 102 B RAM */
#define OSRX_NO_TIMESTAMP    1   /* save 20 B Flash, 4 B RAM */
#define OSRX_VALIDATE_CRC8   0   /* save ~80 B Flash (accept CRC8 risk) */
#define OSRX_PACKET_MAX     64   /* smaller buffer if frames are short */
```

CMake equivalent:
```cmake
cmake -B build \
  -DOSRX_NO_PARSER=ON \
  -DOSRX_NO_TIMESTAMP=ON \
  -DOSRX_VALIDATE_CRC8=0 \
  -DOSRX_PACKET_MAX=64
```

### Tight tier (ATmega88 — 1 KB RAM, 8 KB Flash)

```c
#define OSRX_NO_TIMESTAMP    1
/* Keep CRC validation; keep parser */
```

### Standard tier (ATmega328P / Uno — comfortable defaults)

No overrides needed. Use the library defaults as-is.

### Comfort tier (ATmega2560 / ESP32 — multi-channel)

```c
#define OSRX_PACKET_MAX    128   /* allow larger frames */
/* All other defaults fine; instantiate multiple OSRXParser for each channel */
```

---

## CMake Override Examples

```cmake
# Minimal AVR target: no parser, no timestamp, no CRC8
cmake -B build \
  -DOSRX_NO_PARSER=ON \
  -DOSRX_NO_TIMESTAMP=ON \
  -DOSRX_VALIDATE_CRC8=0

# Multi-channel with larger buffer
cmake -B build -DOSRX_PACKET_MAX=128

# Debug build with all checks
cmake -B build -DCMAKE_BUILD_TYPE=Debug
```
