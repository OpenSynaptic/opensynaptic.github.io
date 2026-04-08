---
id: 09-api-reference
title: API Reference
sidebar_label: API Reference
---

# API Reference

OSynaptic-RX exposes five header modules. The recommended entry point for new projects is `osrx_sensor.h`.

---

## `osrx_sensor.h` — All-in-one decode (recommended)

### `osrx_sensor_recv()`

```c
int osrx_sensor_recv(const osrx_u8        *packet,
                     int                   len,
                     osrx_packet_meta     *meta,
                     osrx_sensor_field    *field);
```

Decode header + body + validate both CRCs in a single call.

| Parameter | Direction | Description |
|---|---|---|
| `packet` | in | Raw frame bytes from your transport |
| `len` | in | Number of bytes in `packet` |
| `meta` | out | Decoded header fields; always populated on return |
| `field` | out | Decoded sensor fields; populated only when return value is nonzero |

**Returns:** `1` on full success (structural parse + both CRCs pass), `0` otherwise.

`meta->crc8_ok` and `meta->crc16_ok` are set independently. A return value of `0` may still have a valid CRC-8 if only CRC-16 failed (or vice versa).

### `osrx_sensor_unpack()`

```c
int osrx_sensor_unpack(const osrx_u8     *body,
                       int                body_len,
                       osrx_sensor_field *out);
```

Parse a body slice `"sid|unit|b62"` into `osrx_sensor_field` only (no header decode, no CRC).

---

## `osrx_parser.h` — Streaming byte accumulator

### `OSRXParser` struct

```c
typedef struct {
    osrx_u8   buf[OSRX_PACKET_MAX]; /* accumulation buffer */
    int       len;                   /* number of bytes accumulated so far */
    osrx_frame_cb fn;                /* user callback */
    void     *ctx;                   /* user context pointer */
} OSRXParser;
```

RAM footprint: **102 bytes** at default `OSRX_PACKET_MAX=96`.

### Function table

| Function | Signature | Description |
|---|---|---|
| `osrx_parser_init` | `(OSRXParser *p, osrx_frame_cb cb, void *ctx)` | Initialise parser; register callback |
| `osrx_feed_byte` | `(OSRXParser *p, osrx_u8 b) → int` | Push one byte. Returns `0` on overflow/reset, `1` otherwise |
| `osrx_feed_done` | `(OSRXParser *p) → int` | Signal frame end; parse + callback. Returns `1` if structurally valid |
| `osrx_feed_bytes` | `(OSRXParser *p, const osrx_u8 *data, int len) → int` | Feed all bytes then call `osrx_feed_done` in one call |
| `osrx_parser_reset` | `(OSRXParser *p)` | Discard accumulated bytes without parsing |

### Callback signature

```c
typedef void (*osrx_frame_cb)(
    const osrx_packet_meta  *meta,   /* header fields, always valid */
    const osrx_sensor_field *field,  /* sensor fields; NULL for non-sensor frames */
    const osrx_u8           *raw,    /* raw frame bytes */
    int                      raw_len,
    void                    *ctx     /* user context from osrx_parser_init() */
);
```

---

## `osrx_packet.h` — Header-only decoder

```c
int osrx_packet_decode(const osrx_u8    *packet,
                       int               len,
                       osrx_packet_meta *out);
```

Decodes only the 13-byte header. Does not parse body or validate CRCs. Useful when you only need `aid`, `tid`, and `ts_sec`.

---

## `osrx_b62.h` — Base62 decoder

```c
osrx_i32 osrx_b62_decode(const char *s, int len, int *ok);
```

| Parameter | Description |
|---|---|
| `s` | Pointer to Base62 string (need not be NUL-terminated) |
| `len` | Number of significant characters to decode |
| `ok` | Set to `1` on success, `0` on invalid character or overflow |

**Returns:** Decoded signed 32-bit integer. Result is valid only when `*ok == 1`.

---

## `osrx_crc.h` — CRC primitives

```c
osrx_u8  osrx_crc8 (const osrx_u8 *data, int len,
                    osrx_u8 poly,  osrx_u8  init);

osrx_u16 osrx_crc16(const osrx_u8 *data, int len,
                    osrx_u16 poly, osrx_u16 init);
```

Both use bit-loop implementation: **zero bytes of RAM**, no lookup table.

| Algorithm | Call | Standard check value |
|---|---|---|
| CRC-8/SMBUS | `osrx_crc8(data, len, 0x07, 0x00)` | `0xF4` for `"123456789"` |
| CRC-16/CCITT-FALSE | `osrx_crc16(data, len, 0x1021, 0xFFFF)` | `0x29B1` for `"123456789"` |

---

## Data Structures

### `osrx_packet_meta`

```c
typedef struct {
    osrx_u32 aid;        /* agent ID (32-bit, big-endian decoded) */
    osrx_u8  tid;        /* transaction ID */
#if !OSRX_NO_TIMESTAMP
    osrx_u64 ts_sec;     /* Unix timestamp seconds */
#endif
    int      crc8_ok;    /* 1 = body CRC-8 passed */
    int      crc16_ok;   /* 1 = frame CRC-16 passed */
    int      body_offset;/* byte offset of body within packet */
    int      body_len;   /* length of body slice in bytes */
} osrx_packet_meta;
```

### `osrx_sensor_field`

```c
typedef struct {
    char      sensor_id[OSRX_ID_MAX];   /* NUL-terminated sensor ID, e.g. "T1" */
    char      unit[OSRX_UNIT_MAX];      /* NUL-terminated unit, e.g. "Cel" */
    osrx_i32  scaled;                   /* fixed-point value × OSRX_VALUE_SCALE */
} osrx_sensor_field;
```

**Getting the real value:**
```c
double real = (double)field.scaled / OSRX_VALUE_SCALE;  /* float */
long   whole = (long)(field.scaled / OSRX_VALUE_SCALE); /* integer part */
long   frac  = (long)labs(field.scaled % OSRX_VALUE_SCALE); /* fractional part */
```

---

## Stack Usage Summary (AVR, -Os)

| Function | Stack peak |
|---|---|
| `osrx_sensor_recv()` | ~41 B (direct path) |
| `osrx_feed_done()` + callback chain | ~55 B |
| `osrx_crc8()` / `osrx_crc16()` | ~4 B |
| `osrx_b62_decode()` | ~8 B |
