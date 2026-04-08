---
id: 09-api-reference
title: API Reference
sidebar_label: API Reference
---

# API Reference

OSynaptic-TX exposes three headers. The recommended entry point is `ostx_sensor.h`.

---

## `ostx_sensor.h` — Tier A (dynamic strings)

### `ostx_sensor_pack()`

```c
int ostx_sensor_pack(
    ostx_u32        aid,        /* agent ID */
    const char     *sensor_id,  /* NUL-terminated, max 8 chars */
    const char     *unit,       /* NUL-terminated, max 8 chars (UCUM) */
    ostx_u8         tid,        /* transaction ID 0–255 */
    ostx_u32        ts_sec,     /* Unix timestamp seconds */
    ostx_i32        scaled,     /* value × OSTX_VALUE_SCALE */
    ostx_u8        *out         /* output buffer, at least OSTX_PACKET_MAX bytes */
);
```

**Returns:** Packet length in bytes on success, `0` on error (sensor_id or unit too long, output buffer too small, unit validation failed).

---

## `ostx_static.h` — Tier B (Flash-stored descriptor)

### `OSTX_STATIC_DEFINE()` macro

```c
OSTX_STATIC_DEFINE(name, aid, sensor_id_literal, unit_literal);
```

Declares a `static const ostx_static_t name` placed in program memory. No SRAM is used for the descriptor itself.

### `ostx_static_pack()`

```c
int ostx_static_pack(
    const ostx_static_t *desc,  /* descriptor created with OSTX_STATIC_DEFINE */
    ostx_u8              tid,
    ostx_u32             ts_sec,
    ostx_i32             scaled,
    ostx_u8             *out
);
```

**Returns:** Packet length in bytes, or `0` on error.

---

## `ostx_stream.h` — Tier C (streaming callback)

### Emit callback type

```c
typedef void (*ostx_emit_fn)(ostx_u8 byte, void *ctx);
```

### `ostx_stream_pack()`

```c
void ostx_stream_pack(
    const ostx_static_t *desc,
    ostx_u8              tid,
    ostx_u32             ts_sec,
    ostx_i32             scaled,
    ostx_emit_fn         emit,
    void                *ctx
);
```

No return value — the `emit` callback is called once per output byte. If `emit` is `NULL`, the call is a no-op.

---

## `ostx_config.h` — Configuration

See [Configuration Macros](./05-configuration) for the full table.

---

## Data Types

| Type | Underlying type | Description |
|---|---|---|
| `ostx_u8` | `unsigned char` | Byte |
| `ostx_u32` | `unsigned long` | 32-bit unsigned (both 16-bit and 32-bit platforms) |
| `ostx_i32` | `signed long` | 32-bit signed |
| `ostx_static_t` | struct | Flash-stored sensor descriptor (opaque; use OSTX_STATIC_DEFINE) |

---

## Stack Usage Summary (AVR, -Os)

| Tier | Function | Stack peak |
|---|---|---|
| A | `ostx_sensor_pack()` | ~137 B |
| B | `ostx_static_pack()` | ~51 B |
| C | `ostx_stream_pack()` | ~21 B |

Excluding the user's stack frame for the `emit` callback (Tier C), which is typically 2–8 B for a simple `Serial.write()`.
