---
id: troubleshooting
title: 故障排查
sidebar_label: 故障排查
---

# 14 故障排查

> 本文档以维护者为主要受众（原生脚本/CLI）。如遇 Arduino 使用问题，请先从 `examples/` 和开发板核心配置入手。

## 构建/测试失败

### 症状

- `No C compiler found (clang/gcc/cl)`

### 处理方法

安装对应工具链后重新运行：

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\test.ps1 -Compiler auto
```

## 矩阵门禁失败

### 症状

- `quality gate failed; see ...quality_gate_report.md`

### 处理方法

仅复跑失败的编译器：

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\test.ps1 -Compiler clang
powershell -ExecutionPolicy Bypass -File .\scripts\test.ps1 -Compiler gcc
powershell -ExecutionPolicy Bypass -File .\scripts\test.ps1 -Compiler cl
```

## CLI 冒烟测试失败

### 症状

- `CLI smoke failed: ...`

### 处理方法

验证独立 CLI 构建与命令路由：

```powershell
.\build\osfx_cli_cl.exe plugin-list
.\build\osfx_cli_cl.exe transport-status
```

## 基准内存锁定失败

### 症状

- `bench_failed=1 reason=mem_limit_exceeded`

### 处理方法

查看 `bench_report.md` 中的内存行。

**放宽阈值进行诊断：**

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\bench.ps1 -Compiler auto -MemoryLimitKB 64
```

**如需临时禁用锁：**

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\bench.ps1 -Compiler auto -MemoryLimitKB 0
```
