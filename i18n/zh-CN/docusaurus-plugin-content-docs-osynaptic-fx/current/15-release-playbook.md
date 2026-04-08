---
id: release-playbook
title: 发布操作手册
sidebar_label: 发布操作手册
---

# 15 发布操作手册

## 目标

生成以 Arduino 库为优先的发布包，包含：示例编译验证、质量门禁证据和完整文档。

## 步骤 0：Arduino 包完整性

- 验证 `library.properties` 版本和元数据完整性。
- 验证 `src/OSynapticFX.h` 仍为公开的 Arduino 引入入口。
- 确认 `examples/` 包含至少 5 个实战 Sketch。

```powershell
arduino-cli compile --fqbn arduino:avr:uno .\examples\BasicEncode
arduino-cli compile --fqbn arduino:avr:uno .\examples\MultiSensorNodePacket
```

## 步骤 1：构建 + 测试

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\build.ps1 -Compiler auto
powershell -ExecutionPolicy Bypass -File .\scripts\test.ps1 -Matrix
```

## 步骤 2：基准测试门禁

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\bench.ps1 -Compiler auto -MemoryLimitKB 16
```

## 步骤 3：验证报告

- `build/quality_gate_report.md`
- `build/bench/bench_report.md`
- `build/bench/bench_report.csv`

## 步骤 4：更新发布文档

- `docs/08-release-notes.md`
- `docs/09-mirror-coverage-report.md`
- `docs/13-performance-summary.md`
- `docs/CHANGELOG.md`

## 步骤 5：最终验收

使用 `docs/10-acceptance-checklist.md` 中的清单并标记所有条目已完成。

## 交付物清单

| 类型 | 内容 |
|---|---|
| Arduino 元数据 | `library.properties` |
| Arduino 引入入口 | `src/OSynapticFX.h` |
| 实战 Sketch | `examples/` |
| 静态库产物（维护者） | `libosfx_core.a` / `osfx_core.lib` |
| 质量门禁报告 | `build/quality_gate_report.md` |
| 基准测试报告 | `build/bench/bench_report.md` 和 `.csv` |
| 发布说明 | `docs/08-release-notes.md` |
| 镜像覆盖报告 | `docs/09-mirror-coverage-report.md` |
| 变更日志 | `docs/CHANGELOG.md` |
