---
id: 08-flash-optimization
title: Flash Optimization
sidebar_label: Flash Optimization
---

# Flash Optimization

Eight switch combinations cover the full range from ultra-minimal to fully-featured.

## Profile Matrix (ATmega328P, avr-gcc -Os)

| Profile | OSRX_NO_PARSER | OSRX_NO_TIMESTAMP | OSRX_VALIDATE_CRC8 | OSRX_VALIDATE_CRC16 | Flash | RAM |
|---|---|---|---|---|---|---|
| Full defaults | 0 | 0 | 1 | 1 | ~616 B | 102 B |
| No timestamp | 0 | 1 | 1 | 1 | ~596 B | 98 B |
| No CRC8 | 0 | 0 | 0 | 1 | ~536 B | 102 B |
| No CRC8 + no TS | 0 | 1 | 0 | 1 | ~516 B | 98 B |
| No parser | 1 | 0 | 1 | 1 | ~442 B | 0 B |
| No parser + no TS | 1 | 1 | 1 | 1 | ~422 B | 0 B |
| No parser + no CRC8 | 1 | 0 | 0 | 1 | ~362 B | 0 B |
| Ultra (all off) | 1 | 1 | 0 | 0 | ~280 B | 0 B |

## Per-Switch Guidance

**OSRX_NO_PARSER=1** — Biggest win. Disables OSRXParser; saves 316 B Flash + 102 B RAM. Required for ATtiny85 / ATmega48.

**OSRX_NO_TIMESTAMP=1** — Low risk. Removes 	s_sec from meta struct; saves 20 B Flash + 4 B RAM. Safe if you don't need timestamp.

**OSRX_VALIDATE_CRC8=0** — Medium risk. Skips body CRC-8 check; accepts corrupt body. Use only on noise-free links.

**OSRX_VALIDATE_CRC16=0** — High risk. Skips full-frame CRC-16. Not recommended in any production setting.

## CRC Trade-offs

The bit-loop CRC implementation costs **~80 B Flash and 0 B RAM** per CRC algorithm. Lookup-table implementations would be faster but cost 256 B RAM for CRC-8 or 512 B for CRC-16 — unacceptable on devices with 512 B–1 KB total RAM.
