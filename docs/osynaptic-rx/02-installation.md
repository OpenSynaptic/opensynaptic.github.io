---
id: 02-installation
title: Installation
sidebar_label: Installation
---

# Installation

## Arduino IDE

1. Download [OSynaptic-RX.zip](https://github.com/OpenSynaptic/OSynaptic-RX/releases)
2. **Sketch > Include Library > Add .ZIP Library** → select the downloaded zip
3. Restart the IDE
4. Verify: **File > Examples > OSynaptic-RX** should appear

In your sketch:
```c
#include <OSynaptic-RX.h>  // pulls in all modules
```

## Arduino CLI

```bash
arduino-cli lib install "OSynaptic-RX"
```

## CMake (native / cross-compile)

Requires CMake ≥ 3.10 and a C89-capable compiler.

```bash
git clone https://github.com/OpenSynaptic/OSynaptic-RX.git
cd OSynaptic-RX
cmake -B build -DCMAKE_BUILD_TYPE=MinSizeRel
cmake --build build
ctest --test-dir build --output-on-failure
```

### Install system-wide

```bash
cmake --install build --prefix /usr/local
```

### Consume with ind_package

```cmake
find_package(osrx 1.0 REQUIRED)
target_link_libraries(my_app PRIVATE osrx::osrx)
```

The osrx::osrx target carries include directories and compile definitions through usage requirements — no manual -I or -D flags needed.

## Verification

Run the 39-assertion test suite:

```bash
cmake -B build -DOSRX_BUILD_TESTS=ON -DCMAKE_BUILD_TYPE=Debug
cmake --build build
ctest --test-dir build --output-on-failure
```

Expected: **39 passed, 0 failed**.

| Test group | Count | What is tested |
|---|---|---|
| CRC-8/SMBUS | — | Standard check value, single-byte, NULL/zero-length guards |
| CRC-16/CCITT-FALSE | — | Standard check value, two edge bytes, NULL guard |
| Base62 decode | — | Zero, negative, alphabet boundaries, rollover, INT32_MIN, NULL guards |
| Frame decode | — | AID big-endian, ts_sec bytes, body offset, CRC-8 position, CRC-16 big-endian |
| Sensor unpack | — | Valid body, missing \|, sub-field too long, invalid b62 char |
| OSRX_NO_TIMESTAMP | — | Struct layout correct, field absent when flag set |
| **Total** | **39** | Expected: 39 passed, 0 failed |
