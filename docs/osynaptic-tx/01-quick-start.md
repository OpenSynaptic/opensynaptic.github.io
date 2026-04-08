---
id: 01-quick-start
title: Quick Start
sidebar_label: Quick Start
---

# OSynaptic-TX — Quick Start

Three API tiers, three code examples. Start with **API C** on any 8-bit AVR.

---

## API C — Zero-buffer Streaming (recommended for AVR ≤ 4 KB SRAM)

Stack peak: **~21 bytes** | Static RAM: **0 bytes**

```c
#include <OSynaptic-TX.h>

/* Sensor descriptor baked into Flash — 0 bytes of SRAM */
OSTX_STATIC_DEFINE(s_temp, 0x00000001UL, "T1", "Cel");

/* Emit callback — hand each byte directly to the Serial driver */
static void emit_byte(ostx_u8 b, void *ctx) {
    (void)ctx;
    Serial.write(b);
}

static ostx_u8 tid = 0;

void setup() {
    Serial.begin(115200);
}

void loop() {
    /* Value pre-scaled by OSTX_VALUE_SCALE (default 10000):
     * 215000 = 21.5000 °C
     * Substitute with your ADC reading × 10000 */
    ostx_stream_pack(&s_temp, tid++,
                     (ostx_u32)(millis() / 1000UL),
                     215000L,
                     emit_byte, NULL);
    delay(1000);
}
```

**How it works:** `ostx_stream_pack()` calls your `emit` callback once per output byte. Nothing is buffered — each byte goes directly to the transport, so static RAM stays at zero.

---

## API B — Static Descriptor (lower stack than A)

Stack peak: **~51 bytes** | Static RAM: **96 bytes** (output buffer)

```c
#include <OSynaptic-TX.h>

OSTX_STATIC_DEFINE(s_hum, 0x00000001UL, "H1", "Pct");

static ostx_u8 out_buf[OSTX_PACKET_MAX];
static ostx_u8 tid = 0;

void setup() { Serial.begin(115200); }

void loop() {
    /* 650000 = 65.0000 % relative humidity */
    int len = ostx_static_pack(&s_hum, tid++,
                               (ostx_u32)(millis() / 1000UL),
                               650000L,
                               out_buf);
    if (len > 0)
        Serial.write(out_buf, (size_t)len);
    delay(1000);
}
```

**When to use B vs C:**
- Use B when you need the complete frame in a buffer before sending (e.g., LoRa `LoRa.write(buf, len)` pattern).
- Use C when you can send bytes as they are generated (Serial, UDP, CAN).

---

## API A — Fully Dynamic

Stack peak: **~137 bytes** | Static RAM: **96 bytes** (output buffer)

```c
#include <OSynaptic-TX.h>

static ostx_u8 out_buf[OSTX_PACKET_MAX];
static ostx_u8 tid = 0;

void setup() { Serial.begin(115200); }

void loop() {
    int len = ostx_sensor_pack(
        0x00000001UL,          /* aid: agent ID (uint32) */
        "T1",                  /* sensor_id (max 8 chars) */
        "Cel",                 /* unit (max 8 chars, UCUM-style) */
        tid++,                 /* tid: transaction ID 0–255 */
        (ostx_u32)(millis() / 1000UL),  /* ts_sec: Unix timestamp */
        215000L,               /* scaled value × OSTX_VALUE_SCALE */
        out_buf
    );
    if (len > 0)
        Serial.write(out_buf, (size_t)len);
    delay(1000);
}
```

**When to use A:** When sensor ID and unit are determined at runtime (read from config, received over network, generated dynamically).

---

## Multi-sensor Node (API C)

```c
#include <OSynaptic-TX.h>

OSTX_STATIC_DEFINE(s_temp, 0x00000001UL, "T1",    "Cel");
OSTX_STATIC_DEFINE(s_hum,  0x00000001UL, "H1",    "Pct");
OSTX_STATIC_DEFINE(s_co2,  0x00000001UL, "CO2",   "ppm");

static void emit(ostx_u8 b, void *) { Serial.write(b); }
static ostx_u8 tid = 0;

void loop() {
    ostx_u32 ts = (ostx_u32)(millis() / 1000UL);
    ostx_stream_pack(&s_temp, tid++, ts, read_temp_scaled(), emit, NULL);
    ostx_stream_pack(&s_hum,  tid++, ts, read_hum_scaled(),  emit, NULL);
    ostx_stream_pack(&s_co2,  tid++, ts, read_co2_scaled(),  emit, NULL);
    delay(2000);
}
```

Each call to `ostx_stream_pack()` sends one complete frame independently.

---

## Value Encoding Cheat-Sheet

```
real_value × OSTX_VALUE_SCALE = scaled argument

Examples (OSTX_VALUE_SCALE = 10000):
  21.5 °C  → 215000
  65.3 %   → 653000
  0.0 m/s  → 0
  -5.2 °C  → -52000
  1013.25  → 10132500   (hPa)
```

For ADC values:
```c
/* ADC gives 0–1023 on a 10-bit channel, Vref=3.3V, sensor 0–100°C */
int adc = analogRead(A0);
long scaled = (long)adc * 100L * 10000L / 1023L;  /* temperature × 10000 */
```
