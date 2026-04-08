---
id: 04-wire-format
title: Wire Format
sidebar_label: Wire Format
---

# Wire Format

OSynaptic-TX emits **FULL** type OpenSynaptic frames identical to those consumed by OSynaptic-RX.

## Packet Structure

```
Byte:  0        1-4     5       6-9         10       11      12     13..N   N+1     N+2-N+3
       MAGIC   AID[4]  TID   TS_SEC[4]   TYPE    CRC8_H  HDR_END  BODY  CRC8_B  CRC16[2]
       0x53   BE u32   0-255   BE u32    0x46     —       0x7C     —       —       BE
```

| Field | Bytes | Description |
|---|---|---|
| MAGIC | 1 | `0x53` — synchronisation byte |
| AID | 4 | Agent ID, big-endian uint32 |
| TID | 1 | Transaction ID 0–255, wraps around |
| TS_SEC | 4 | Unix timestamp seconds, big-endian uint32 |
| TYPE | 1 | `0x46` = `'F'` = FULL sensor frame |
| CRC8 header | 1 | CRC-8/SMBUS over bytes 0–9 |
| HDR_END | 1 | `0x7C` = `'|'` |
| BODY | varies | ASCII: `sid|unit|b62value` |
| CRC8 body | 1 | CRC-8/SMBUS over body bytes only |
| CRC16 | 2 | CRC-16/CCITT-FALSE over full packet (0..N+1), big-endian |

## BODY Format

```
T1|Cel|2vBM
^  ^   ^
|  |   +-- Base62-encoded signed 32-bit value
|  +------ UCUM unit string (max 8 chars)
+--------- Sensor ID (max 8 alphanumeric ASCII chars)
```

**Base62 alphabet:** `0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz`

Negative values: leading `-` character precedes the Base62 digits.

## Worked Example

Value: **21.5 °C** → scaled = `215000` (using `OSTX_VALUE_SCALE=10000`)

1. `ostx_b62_encode(215000)` → `"2vBM"`
2. Body → `"T1|Cel|2vBM"` (11 bytes)
3. Header: AID=`0x00000001`, TID=`1`, TS=`0x661C3A00`, TYPE=`'F'`
4. CRC-8/SMBUS over header bytes → `0xNN`
5. Append `'|'`, body, CRC-8 over body, CRC-16 over full packet

The CRC algorithms are identical to those in OSynaptic-RX. See [OSynaptic-RX Wire Format](../osynaptic-rx/04-wire-format) for the full polynomial specs.
