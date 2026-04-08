---
id: 04-wire-format
title: Wire Format
sidebar_label: Wire Format
---

# Wire Format

Every frame follows the OpenSynaptic FULL packet layout (C89, big-endian):

```
[cmd:1][route:1][aid:4BE][tid:1][ts:6BE][body...][crc8:1][crc16:2]
 ─────────────── 13-byte header ─────────────── ─body─ ──3 CRC──
```

---

## Field Definitions

| Field | Size | C89 type | Description |
|---|---|---|---|
| `cmd` | 1 B | `osrx_u8` | `0x3F` (63) = DATA_FULL plaintext. `0x40` (64) = encrypted (not decoded by RX). |
| `route` | 1 B | `osrx_u8` | Routing/hop-count flags |
| `aid` | 4 B | `osrx_u32` | Source agent ID, big-endian |
| `tid` | 1 B | `osrx_u8` | Transaction ID (wraps 0–255) |
| `ts` | 6 B | `osrx_u64` | Unix timestamp seconds, 48-bit big-endian |
| `body` | variable | — | `sensor_id\|unit\|b62value` |
| `crc8` | 1 B | `osrx_u8` | CRC-8/SMBUS (poly 0x07, init 0x00) over body only |
| `crc16` | 2 B | `osrx_u16` | CRC-16/CCITT-FALSE (poly 0x1021, init 0xFFFF) over full frame |

Minimum frame size: **19 bytes** (2-char sid, 1-char unit, 1-char b62 value).

---

## Body Format

The body contains pipe-delimited ASCII fields:

```
<sensor_id> '|' <unit> '|' <b62_value>
```

| Sub-field | Max length (default) | Description |
|---|---|---|
| `sensor_id` | 8 chars + NUL (`OSRX_ID_MAX=9`) | Short alphanumeric sensor identifier, e.g. `T1`, `HUMID` |
| `unit` | 8 chars + NUL (`OSRX_UNIT_MAX=9`) | UCUM-style unit string, e.g. `Cel`, `Pct`, `m/s2` |
| `b62_value` | 13 chars + NUL (`OSRX_B62_MAX=14`) | Base62-encoded fixed-point integer (scale 10000) |

Example body (hex, ASCII shown):

```
54 31 7C 43 65 6C 7C 4E 41 31
T  1  |  C  e  l  |  N  A  1
```

This decodes as `T1 | Cel | NA1` → sensor T1, unit Celsius, value = Base62 decode of "NA1".

---

## CRC Algorithms

### CRC-8/SMBUS

- Polynomial: `0x07`
- Initial value: `0x00`
- Input/Output reflected: No
- Covers: body bytes only (from first byte after header to byte before CRC-8)

Standard check value: `0xF4` for ASCII string `"123456789"`.

```c
/* Bit-loop CRC-8 — no lookup table, 0 B RAM */
osrx_u8 osrx_crc8(const osrx_u8 *data, int len, osrx_u8 poly, osrx_u8 init);
```

### CRC-16/CCITT-FALSE

- Polynomial: `0x1021`
- Initial value: `0xFFFF`
- Input/Output reflected: No
- Covers: **entire frame** from `cmd` through `crc8` (inclusive)

Standard check value: `0x29B1` for ASCII string `"123456789"`.

```c
/* Bit-loop CRC-16 — no lookup table, 0 B RAM */
osrx_u16 osrx_crc16(const osrx_u8 *data, int len, osrx_u16 poly, osrx_u16 init);
```

---

## Base62 Decode Algorithm

The `b62_value` field encodes a signed 32-bit integer using Base62 (alphabet `0–9A–Za–z`). The encoding is big-endian positional, with the most-significant digit first.

```
alphabet: 0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz
```

Decode formula (for `N` characters):

```
value = d[0]×62^(N-1) + d[1]×62^(N-2) + ... + d[N-1]×62^0
```

Where `d[i]` is the digit position of character `s[i]` in the alphabet.

| b62 string | Decoded int32 | Real value (÷10000) |
|---|---|---|
| `0` | 0 | 0.0000 |
| `A` | 10 | 0.0010 |
| `a` | 36 | 0.0036 |
| `NA1` | (23×62² + 10×62 + 1) = 88,249 | 8.8249 |
| `2Rbs` | 215,000 | 21.5000 °C |

OSynaptic-RX provides `osrx_b62_decode()`:

```c
osrx_i32 osrx_b62_decode(const char *s, int len, int *ok);
/* s need not be NUL-terminated; len = number of significant characters */
```

---

## Annotated Hex Dump

A real 30-byte sensor frame carrying `T1=21.5 °C` from agent `0x00000001`:

```
Offset  Hex   Meaning
──────────────────────────────────────────────────────────────
  0     3F    cmd = 0x3F (DATA_FULL plaintext)
  1     00    route flags
  2-5   00 00 00 01  aid = 1 (big-endian)
  6     05    tid = 5
  7-12  00 00 65 F0 3D 00  ts = Unix seconds (big-endian 48-bit)
  13    54 31 7C 43 65 6C 7C 32 52 62 73  body = "T1|Cel|2Rbs"
  24    XX    crc8 (over body bytes 13..23)
  25-26 YY ZZ crc16 (over entire frame 0..24, big-endian)
```

Full detailed specification: [docs/03-wire-format.md](https://github.com/OpenSynaptic/OSynaptic-RX/blob/main/docs/03-wire-format.md) in the repository.
