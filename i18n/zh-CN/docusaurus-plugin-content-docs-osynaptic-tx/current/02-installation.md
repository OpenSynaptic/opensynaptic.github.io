---
id: 02-installation
title: 安装
sidebar_label: 安装
---

# 安装

## Arduino IDE

1. 下载 [OSynaptic-TX.zip](https://github.com/OpenSynaptic/OSynaptic-TX/releases)
2. **项目 > 加载库 > 添加 .ZIP 库** → 选择下载的压缩包
3. 重启 IDE；**文件 > 示例 > OSynaptic-TX** 应出现在菜单中

```c
#include <OSynaptic-TX.h>  // 引入所有 TX 模块
```

## Arduino CLI

```bash
arduino-cli lib install "OSynaptic-TX"
```

## CMake（原生 / 交叉编译）

```bash
git clone https://github.com/OpenSynaptic/OSynaptic-TX.git
cd OSynaptic-TX
cmake -B build -DCMAKE_BUILD_TYPE=MinSizeRel
cmake --build build
ctest --test-dir build --output-on-failure
```

### 全局安装

```bash
cmake --install build --prefix /usr/local
```

### 通过 find_package 集成

```cmake
find_package(ostx 1.0 REQUIRED)
target_link_libraries(my_sensor PRIVATE ostx::ostx)
```

## 测试套件

```bash
cmake -B build -DOSTX_BUILD_TESTS=ON
cmake --build build
ctest --test-dir build --output-on-failure
```

预期结果：**50 passed, 0 failed**。
