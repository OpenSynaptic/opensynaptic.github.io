---
id: performance-summary
title: 性能摘要
sidebar_label: 性能摘要
---

# 13 性能摘要

> 维护者发布 QA 参考文档。Arduino 集成商可将其视为可选背景资料。

## 基准测试基线

来源报告：`build/bench/bench_report.md`

最新基线（`MemoryLimitKB=16`）：

| 传感器数 | 相对 JSON 压缩率 | P50 每传感器延迟 (μs) | P95 每传感器延迟 (μs) | Sensors/s |
|---:|---:|---:|---:|---:|
| 1 | 70.41% | 0.600 | 0.700 | 1,501,773 |
| 4 | 58.33% | 0.425 | 0.450 | 2,243,708 |
| 8 | 54.73% | 0.425 | 0.438 | 2,313,790 |
| 16 | 52.69% | 0.425 | 0.438 | 2,298,422 |

## RAM 锁定基线

| 指标 | 值 |
|---|---|
| RAM 工作集差值 | 12 KB |
| 内存上限锁阈值 | 16 KB |
| 内存上限锁状态 | PASS |

## 发布阈值建议

- 4/8/16 传感器档的压缩率应维持在 `50%` 以上。
- 基准主机上 `P95 每传感器延迟` 应低于 `1.0 μs`。
- `MemoryLimitKB=16` 条件下内存上限锁状态应为 `PASS`。

## 重新运行命令

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\bench.ps1 -Compiler auto -MemoryLimitKB 16
```
