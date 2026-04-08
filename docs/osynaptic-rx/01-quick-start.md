---
id: 01-quick-start
title: Quick Start
sidebar_label: Quick Start
---

# OSynaptic-RX — Quick Start

Three integration patterns: Arduino streaming, ESP32 UDP, and native C.

---

## Pattern 1 — Arduino Streaming (UART with idle-gap)

Suitable for any Arduino board receiving from an OSynaptic-TX device over a hardware Serial port.

```c
#include <OSynaptic-RX.h>

static OSRXParser parser;

/* Called by the parser when a complete, structurally valid frame arrives */
static void on_frame(const osrx_packet_meta  *meta,
                     const osrx_sensor_field *field,
                     const osrx_u8 *raw, int raw_len, void *ctx)
{
    /* Discard frames with failed CRCs */
    if (!meta->crc8_ok || !meta->crc16_ok) return;

    /* field is NULL for non-sensor frames (HEART, DIFF, etc.) */
    if (!field) return;

    /* field->scaled / OSRX_VALUE_SCALE = real float value (integer arithmetic) */
    long whole = (long)(field->scaled / OSRX_VALUE_SCALE);
    long frac  = (long)(field->scaled % OSRX_VALUE_SCALE);
    if (frac < 0) frac = -frac;

    Serial.print(field->sensor_id);
    Serial.print(": ");
    Serial.print(whole);  Serial.print(".");
    Serial.print(frac, DEC);
    Serial.print(" ");
    Serial.println(field->unit);
}

void setup() {
    Serial.begin(9600);
    osrx_parser_init(&parser, on_frame, NULL);
}

static unsigned long last_byte_ms = 0;
static bool          got_byte     = false;

void loop() {
    while (Serial.available()) {
        osrx_feed_byte(&parser, (osrx_u8)Serial.read());
        last_byte_ms = millis();
        got_byte = true;
    }
    /* 15 ms idle gap signals end of frame */
    if (got_byte && (millis() - last_byte_ms) > 15) {
        osrx_feed_done(&parser);
        got_byte = false;
    }
}
```

**Key points:**
- `osrx_parser_init()` registers your callback once; the parser resets automatically after each frame.
- The 15 ms idle-gap threshold works reliably for baud rates ≥ 9600. At 1200 baud, increase to 50 ms.
- `field->scaled` is always in fixed-point with scale factor `OSRX_VALUE_SCALE` (default 10000). Example: `scaled = 215000` → `21.5000 °C`.

---

## Pattern 2 — ESP32 UDP (one datagram per frame)

Each UDP datagram contains exactly one complete OpenSynaptic frame. No idle-gap parser needed.

```c
#include <OSynaptic-RX.h>
#include <WiFi.h>
#include <WiFiUdp.h>

static WiFiUDP     udp;
static uint8_t     udp_buf[OSRX_PACKET_MAX];
static const int   UDP_PORT = 7000;

void setup() {
    Serial.begin(115200);
    WiFi.begin("your-ssid", "your-password");
    while (WiFi.status() != WL_CONNECTED) delay(200);
    udp.begin(UDP_PORT);
    Serial.println("Listening on UDP " + String(UDP_PORT));
}

void loop() {
    int n = udp.parsePacket();
    if (n <= 0) return;

    int len = udp.read((char *)udp_buf,
                       n < (int)sizeof(udp_buf) ? n : (int)sizeof(udp_buf));
    if (len <= 0) return;

    osrx_packet_meta  meta;
    osrx_sensor_field field;

    if (osrx_sensor_recv(udp_buf, len, &meta, &field)) {
        Serial.printf("AID=0x%08X  sensor=%s  value=%ld.%04ld %s\n",
                      (unsigned)meta.aid,
                      field.sensor_id,
                      (long)(field.scaled / OSRX_VALUE_SCALE),
                      (long)labs(field.scaled % OSRX_VALUE_SCALE),
                      field.unit);
    }
}
```

**Key points:**
- `osrx_sensor_recv()` handles full decode + CRC validation in one call.
- Returns `1` on success, `0` if any check fails (bad CRC, bad length, bad body format).
- Set `OSRX_NO_PARSER=1` in your `CMakeLists.txt` or before the include to save 316 B Flash + 102 B RAM.

---

## Pattern 3 — Native C (CMake / bare-metal / desktop)

```c
#include "osrx_sensor.h"
#include <stdio.h>
#include <stdlib.h>

/* buf[] holds a raw frame delivered by your transport layer */
void process_frame(const osrx_u8 *buf, int buf_len) {
    osrx_packet_meta  meta;
    osrx_sensor_field field;

    int ok = osrx_sensor_recv(buf, buf_len, &meta, &field);
    if (!ok) {
        fprintf(stderr, "Decode failed (len=%d, crc8=%d, crc16=%d)\n",
                buf_len, meta.crc8_ok, meta.crc16_ok);
        return;
    }

    long whole = (long)(field.scaled / OSRX_VALUE_SCALE);
    long frac  = (long)labs(field.scaled % OSRX_VALUE_SCALE);
    printf("%s: %ld.%04ld %s  (aid=0x%08X ts=%llu)\n",
           field.sensor_id, whole, frac, field.unit,
           (unsigned)meta.aid, (unsigned long long)meta.ts_sec);
}
```

**CMake integration:**

```cmake
find_package(osrx 1.0 REQUIRED)
target_link_libraries(my_app PRIVATE osrx::osrx)
```

---

## Choosing Your Decode Path

| Your transport | Recommended path | Why |
|---|---|---|
| UART / RS-485 | Streaming parser | Bytes arrive individually; idle-gap = frame boundary |
| USB-CDC (Arduino) | Streaming parser | Same byte-by-byte arrival behavior |
| UDP (WiFi / Ethernet) | Direct decode | Datagram IS the frame; no parser state needed |
| LoRa (SX1276) | Direct decode | `onReceive` callback hands you a complete packet |
| SPI frame | Direct decode | CS-rising edge = frame boundary; call `osrx_feed_done()` if contiguous |
| Multi-channel | One parser per channel | Each `OSRXParser` instance is independent |

---

## Value Decoding Cheat-Sheet

```
field->scaled   = raw fixed-point value
OSRX_VALUE_SCALE = 10000 (default)

  real_value = field->scaled / OSRX_VALUE_SCALE

Examples:
  215000 / 10000 = 21.5000   (21.5 °C temperature)
  650000 / 10000 = 65.0000   (65% relative humidity)
      -5 / 10000 = -0.0005   (slightly below zero)
```

To print without floating-point:
```c
long whole = (long)(field->scaled / OSRX_VALUE_SCALE);
long frac  = (long)labs(field->scaled % OSRX_VALUE_SCALE);
bool neg   = (field->scaled < 0 && whole == 0);
printf("%s%ld.%04ld %s", neg ? "-" : "", whole, frac, field->unit);
```
