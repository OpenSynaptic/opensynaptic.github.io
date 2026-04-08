---
id: config-quick-reference
title: 配置快速参考
sidebar_label: 配置快速参考
---

# 12 配置快速参考

## Arduino 消费者快速参考

### 安装与引入

- 在 Arduino IDE 库管理器中搜索 `OSynaptic-FX` 并安装。
- Arduino 项目引入入口：`#include <OSynapticFX.h>`。

### Arduino CLI 编译示例

```powershell
arduino-cli compile --fqbn arduino:avr:uno .\examples\BasicEncode
arduino-cli compile --fqbn arduino:avr:uno .\examples\PacketMetaDecode
arduino-cli compile --fqbn arduino:avr:uno .\examples\FusionAutoMode
arduino-cli compile --fqbn arduino:avr:uno .\examples\SecureSessionRoundtrip
arduino-cli compile --fqbn arduino:avr:uno .\examples\MultiSensorNodePacket
```

### 预编译库文件布局

- `library.properties` 使用 `precompiled=full`。
- Arduino 识别的静态库路径模式：`src/{build.mcu}/libOSynapticFX.a`。
- 当前已映射的目录：
  - `src/atmega328p/`
  - `src/avr/`
  - `src/esp32/`
  - `src/rp2040/`
  - `src/cortex-m0plus/`
  - `src/stm32/`
  - `src/riscv32/`
- 非 Arduino 平台的预编译库存放于 `extras/precompiled-non-arduino/`，Arduino 构建工具不处理该目录。

## 维护者脚本参数

### `scripts/build.ps1`

- `-Compiler auto|clang|gcc|cl`
- 默认：`auto`

### `scripts/test.ps1`

- `-Compiler auto|clang|gcc|cl`
- `-Matrix`（运行 `clang/gcc/cl` 门禁矩阵）
- 默认：`-Compiler auto`

### `scripts/bench.ps1`

- `-Compiler auto|clang|gcc|cl`
- `-MemoryLimitKB <int>`
- 默认：`-MemoryLimitKB 16`
- 将 `-MemoryLimitKB 0` 设置为禁用内存锁。

## 常用配置示例

```powershell
# 本地快速验证
powershell -ExecutionPolicy Bypass -File .\scripts\test.ps1 -Compiler auto

# 发布矩阵门禁
powershell -ExecutionPolicy Bypass -File .\scripts\test.ps1 -Matrix

# 发布基准测试（默认 16 KB 锁）
powershell -ExecutionPolicy Bypass -File .\scripts\bench.ps1 -Compiler auto

# 严格锁限制的基准测试
powershell -ExecutionPolicy Bypass -File .\scripts\bench.ps1 -Compiler auto -MemoryLimitKB 8
```

## CLI 运行时配置入口

- `plugin-load <name> [config]` 可传入插件特定的配置字符串。
- 当前作用域插件：
  - `transport`
  - `test_plugin`
  - `port_forwarder`

## 报告产物

| 报告类型 | 路径 |
|---|---|
| 质量门禁报告 | `build/quality_gate_report.md` |
| 基准测试报告（Markdown） | `build/bench/bench_report.md` |
| 基准测试报告（CSV） | `build/bench/bench_report.csv` |
