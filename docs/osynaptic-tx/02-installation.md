---
id: 02-installation
title: Installation
sidebar_label: Installation
---

# Installation

## Arduino IDE

1. Download [OSynaptic-TX.zip](https://github.com/OpenSynaptic/OSynaptic-TX/releases)
2. **Sketch > Include Library > Add .ZIP Library** → select the downloaded zip
3. Restart the IDE; **File > Examples > OSynaptic-TX** should appear

```c
#include <OSynaptic-TX.h>  // pulls in all TX modules
```

## Arduino CLI

```bash
arduino-cli lib install "OSynaptic-TX"
```

## CMake (native / cross-compile)

```bash
git clone https://github.com/OpenSynaptic/OSynaptic-TX.git
cd OSynaptic-TX
cmake -B build -DCMAKE_BUILD_TYPE=MinSizeRel
cmake --build build
ctest --test-dir build --output-on-failure
```

### Install system-wide

```bash
cmake --install build --prefix /usr/local
```

### Consume with find_package

```cmake
find_package(ostx 1.0 REQUIRED)
target_link_libraries(my_sensor PRIVATE ostx::ostx)
```

## Test Suite

```bash
cmake -B build -DOSTX_BUILD_TESTS=ON
cmake --build build
ctest --test-dir build --output-on-failure
```

Expected: **50 passed, 0 failed**.
