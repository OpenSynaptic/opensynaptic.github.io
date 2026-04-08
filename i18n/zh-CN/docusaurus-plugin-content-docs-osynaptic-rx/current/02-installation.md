---
id: 02-installation
title: 安装
sidebar_label: 安装
---

# 安装

## Arduino IDE

1. 下载 [OSynaptic-RX.zip](https://github.com/OpenSynaptic/OSynaptic-RX/releases)
2. **项目 > 加载库 > 添加 .ZIP 库** → 选择下载的压缩包
3. 重启 IDE
4. 验证：**文件 > 示例 > OSynaptic-RX** 应出现在菜单中

在草图中：
```c
#include <OSynaptic-RX.h>  // 引入所有模块
```

## Arduino CLI

```bash
arduino-cli lib install "OSynaptic-RX"
```

## CMake（原生 / 交叉编译）

需要 CMake ≥ 3.10 以及支持 C89 的编译器。

```bash
git clone https://github.com/OpenSynaptic/OSynaptic-RX.git
cd OSynaptic-RX
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
find_package(osrx 1.0 REQUIRED)
target_link_libraries(my_app PRIVATE osrx::osrx)
```

`osrx::osrx` 目标通过用法需求自动传递头文件目录和编译定义，无需手动添加 `-I` 或 `-D` 标志。

## 验证

运行包含 39 个断言的测试套件：

```bash
cmake -B build -DOSRX_BUILD_TESTS=ON -DCMAKE_BUILD_TYPE=Debug
cmake --build build
ctest --test-dir build --output-on-failure
```

预期结果：**39 passed, 0 failed**。

| 测试组 | 数量 | 测试内容 |
|---|---|---|
| CRC-8/SMBUS | — | 标准校验值、单字节、NULL/零长度边界 |
| CRC-16/CCITT-FALSE | — | 标准校验值、两端字节、NULL 边界 |
| Base62 解码 | — | 零值、负值、字母表边界、回绕、INT32_MIN、NULL 边界 |
| 帧解码 | — | AID 大端序、ts_sec 字节、body 偏移、CRC-8 位置、CRC-16 大端序 |
| 传感器解包 | — | 有效 body、缺少竖线、子字段过长、无效 Base62 字符 |
| OSRX_NO_TIMESTAMP | — | 结构体布局正确、标志设置时字段缺失 |
| **合计** | **39** | 预期：39 passed, 0 failed |
