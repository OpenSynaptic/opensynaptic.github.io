---
id: 03-api-tiers
title: API Tiers
sidebar_label: API Tiers
---

# API Tiers

OSynaptic-TX provides three independent API tiers. All tiers produce identical frames; the choice is purely about RAM and code size.

## Tier Comparison

| Tier | Function | Stack peak | Static RAM | Flash (~1 sensor) |
|---|---|---|---|---|
| **A** | ostx_sensor_pack() | ~137 B | 96 B | ~600 B |
| **B** | ostx_static_pack() | ~51 B | 96 B | ~430 B |
| **C** | ostx_stream_pack() | ~21 B | 0 B | ~760 B |

## When to Use Each Tier

### Tier A — Dynamic strings

Use when sensor ID or unit is determined at runtime (e.g., read from EEPROM, received from a config packet, or generated in a loop).

```c
int len = ostx_sensor_pack(aid, "T1", "Cel", tid, ts_sec, value, out_buf);
```

### Tier B — Static descriptor

Use when every sensor property is known at compile time. The OSTX_STATIC_DEFINE macro places the descriptor in program memory (Flash / ROM), avoiding SRAM. Tier B has lower stack than A and is the recommended default for most projects.

```c
OSTX_STATIC_DEFINE(s_temp, aid, "T1", "Cel");
int len = ostx_static_pack(&s_temp, tid, ts_sec, value, out_buf);
```

### Tier C — Streaming callback

Use on devices where SRAM is extremely scarce. No output buffer is needed — you provide a byte-emit callback. Tier C uses the most Flash (byte-by-byte write overhead) but the least RAM of all three tiers.

```c
OSTX_STATIC_DEFINE(s_temp, aid, "T1", "Cel");
ostx_stream_pack(&s_temp, tid, ts_sec, value, emit_fn, ctx);
```

## Combining Tiers

You can use multiple tiers in the same project. The linker drops the compiled objects for tiers whose functions are never referenced, so unused tiers impose no Flash cost.

```c
/* Use Tier C for temperature (RAM budget critical) */
ostx_stream_pack(&s_temp, tid++, ts, temp_scaled, emit, NULL);

/* Use Tier A for a dynamic sensor ID read from EEPROM */
char id[OSTX_ID_MAX];
eeprom_read_block(id, EE_SENSOR_ID, sizeof(id));
ostx_sensor_pack(aid, id, "Cel", tid++, ts, temp_scaled, out_buf);
```
