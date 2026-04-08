---
id: CHANGELOG
title: 变更日志
sidebar_label: 变更日志
---

# 变更日志

`OSynaptic-FX` 的所有重要变更均记录于本文件中。

## [v1.0.1] - 2026-04-06

### 兼容性

- 已验证与 **OpenSynaptic v1.2.0** RSCore 性能基线兼容。
  - OpenSynaptic v1.2.0 搭载优化后的 Rust 计算引擎（RSCore），在 AMD Ryzen 5 9600X 上可达约 130 万包/秒；MCU 侧线路格式不变——无需修改 OSynaptic-FX。
- 将 `20-arduino-easy-api.md` 添加至文档并同步镜像至 `opensynaptic.github.io` 文档站点。

### 文档

- 新增指南：`docs/20-arduino-easy-api.md`——Arduino Easy API 快速入门参考。

---

## [v1.0.0-p5] - 2026-04-04

### 新增

- 作用域插件模块：
  - `transport`（轻量版）
  - `test_plugin`（轻量版）
  - `port_forwarder`（完整版）
- 平台运行时适配器与 CLI 轻量路由。
- 独立 CLI 入口：`tools/osfx_cli_main.c`。
- 编译器矩阵质量门禁模式（`test.ps1 -Matrix`）。
- 质量报告产物：`build/quality_gate_report.md`。
- `docs/` 下完整文档库。

### 变更

- 服务运行时控制面 API 扩展，支持 list/load/cmd 模式。
- README 更新，涵盖作用域插件策略与质量门禁用法。

### 移除/排除

- 本次发布范围外的插件接口：
  - `web`
  - `sql`
  - `dependency_manager`
  - `env_guard`
