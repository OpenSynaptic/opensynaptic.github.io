---
id: 03-decode-paths
title: Decode Paths
sidebar_label: Decode Paths
---

# Decode Paths

OSynaptic-RX provides two independent decode paths. Choose based on your transport.

## Path A — Streaming Parser

Use when your transport delivers bytes one-at-a-time with no natural frame boundary (UART, RS-485, USB-CDC).

**How it works:**
1. Call osrx_feed_byte(&parser, b) for each received byte
2. Detect the end of a frame with a **15 ms idle gap** (no byte received)
3. Call osrx_feed_done(&parser) to trigger parse + callback

**Memory cost:** OSRXParser = 102 B RAM + ~316 B Flash

```c
static OSRXParser parser;
// In setup:
osrx_parser_init(&parser, my_callback, NULL);
// In ISR or polling:
osrx_feed_byte(&parser, incoming_byte);
// On idle gap:
osrx_feed_done(&parser);
```

## Path B — Direct Frame Decode

Use when your transport provides complete frames (UDP datagrams, LoRa packets, SPI frames).

**How it works:**
- Call osrx_sensor_recv(buf, len, &meta, &field) once per received datagram
- Returns 1 on success; meta and field are populated immediately

**Memory cost:** 0 B RAM (no OSRXParser). Set OSRX_NO_PARSER=1 to exclude parser code.

```c
// Called when a UDP datagram arrives:
osrx_packet_meta  meta;
osrx_sensor_field field;
if (osrx_sensor_recv(udp_buf, udp_len, &meta, &field)) {
    // use field.sensor_id, field.unit, field.scaled
}
```

## Comparison

| | Streaming | Direct |
|---|---|---|
| RAM | 102 B (OSRXParser) | 0 B |
| Flash | ~616 B (full) | ~442 B |
| Transport | UART, RS-485 | UDP, LoRa, SPI |
| Frame boundary | 15 ms idle gap | Natural (datagram / CS) |
| Multi-channel | One parser per channel | N/A |
