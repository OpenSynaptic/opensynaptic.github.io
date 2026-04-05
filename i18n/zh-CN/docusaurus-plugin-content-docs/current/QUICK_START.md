---
layout: default
title: 快速开始指南
language: zh
---

# 快速文档查找

使用此页面快速跳转到正确的文档集合。

---

## 运行时首次启动

使用以下命令之一直接启动 `main`：

```powershell
# Windows 快捷命令（无需 Activate.ps1）
.\run-main.cmd run --once --quiet

# 已安装的入口点
os-node run --once --quiet
```

如果首次运行时缺少本机运行时库，启动会自动尝试本机构建一次，然后重试节点创建。  
手动回退：

```powershell
os-node native-check
os-node native-build
```

---

## 我是..., 我想...

### 新开发者
- 快速入门 -> [plugins/PLUGIN_STARTER_KIT.md](plugins/plugins-PLUGIN_STARTER_KIT)
- 理解架构 -> [ARCHITECTURE.md](ARCHITECTURE)
- 构建第一个插件 -> [plugins/PLUGIN_DEVELOPMENT_SPECIFICATION.md](plugins/plugins-PLUGIN_DEVELOPMENT_SPECIFICATION)

### 插件开发者
- 开发规范 -> [plugins/PLUGIN_DEVELOPMENT_SPECIFICATION_2026.md](plugins/plugins-PLUGIN_DEVELOPMENT_SPECIFICATION_2026)
- 快速参考 -> [plugins/PLUGIN_QUICK_REFERENCE_2026.md](plugins/plugins-PLUGIN_QUICK_REFERENCE_2026)
- 传输器集成 -> [TRANSPORTER_PLUGIN.md](TRANSPORTER_PLUGIN)
- 实用代码示例 -> [plugins/PLUGIN_HIJACKING_PRACTICAL_CODE.md](plugins/plugins-PLUGIN_HIJACKING_PRACTICAL_CODE)

### API 集成者
- API 概览 -> [API.md](API)
- 显示 API 指南 -> [guides/DISPLAY_API_GUIDE.md](guides/guides-DISPLAY_API_GUIDE)
- 显示 API 快速开始 -> [guides/DISPLAY_API_QUICKSTART.md](guides/guides-DISPLAY_API_QUICKSTART)
- 配置架构 -> [CONFIG_SCHEMA.md](CONFIG_SCHEMA)

### 系统操作员
- 运行时配置 -> [CONFIG_SCHEMA.md](CONFIG_SCHEMA)
- ID 租赁系统 -> [ID_LEASE_SYSTEM.md](ID_LEASE_SYSTEM)
- ID 租赁配置参考 -> [ID_LEASE_CONFIG_REFERENCE.md](ID_LEASE_CONFIG_REFERENCE)
- Web 命令参考 -> [guides/WEB_COMMANDS_REFERENCE.md](guides/guides-WEB_COMMANDS_REFERENCE)
- TUI 快速参考 -> [guides/TUI_QUICK_REFERENCE.md](guides/guides-TUI_QUICK_REFERENCE)

### 性能工程师
- 优化报告 -> [reports/PERFORMANCE_OPTIMIZATION_REPORT.md](reports/reports-PERFORMANCE_OPTIMIZATION_REPORT)
- 最终性能总结 -> [reports/FINAL_PERFORMANCE_REPORT.md](reports/reports-FINAL_PERFORMANCE_REPORT)
- 架构演变分析 -> [architecture/ARCHITECTURE_EVOLUTION_COMPARISON.md](architecture/architecture-ARCHITECTURE_EVOLUTION_COMPARISON)

### 故障排除
- Bug 修复说明 -> [reports/BUG_FIX_REPORT.md](reports/reports-BUG_FIX_REPORT)
- 模块导入修复 -> [internal/FIX_ModuleNotFoundError.md](internal/internal-FIX_ModuleNotFoundError)
- Web 命令修复 -> [internal/WEB_COMMAND_FIX.md](internal/internal-WEB_COMMAND_FIX)
- 所有报告 -> [reports/](reports/reports-CODE_CHANGES_SUMMARY)

### 架构师 / 维护者
- 架构 -> [ARCHITECTURE.md](ARCHITECTURE)
- 核心 API -> [CORE_API.md](CORE_API)
- FFI 分析 -> [architecture/ARCHITECTURE_FFI_ANALYSIS.md](architecture/architecture-ARCHITECTURE_FFI_ANALYSIS)
- 文档结构 -> [DOCUMENT_ORGANIZATION.md](DOCUMENT_ORGANIZATION)

---

## 类别概览

- 架构和设计 -> `docs/architecture/`
- API 参考 -> 根文档 + `docs/api/`
- 功能指南 -> `docs/features/`
- 插件开发 -> `docs/plugins/`
- 用户/开发者指南 -> `docs/guides/`
- 报告和日志 -> `docs/reports/`
- 内部说明 -> `docs/internal/`

---

## 典型工作流程

1. **开始插件开发**：
   - [plugins/PLUGIN_STARTER_KIT.md](plugins/plugins-PLUGIN_STARTER_KIT)
   - [plugins/PLUGIN_DEVELOPMENT_SPECIFICATION_2026.md](plugins/plugins-PLUGIN_DEVELOPMENT_SPECIFICATION_2026)
   - [plugins/PLUGIN_QUICK_REFERENCE_2026.md](plugins/plugins-PLUGIN_QUICK_REFERENCE_2026)

2. **理解系统内部**：
   - [文档索引](/zh-CN/docs/index)
   - [ARCHITECTURE.md](ARCHITECTURE)
   - [CORE_API.md](CORE_API)

3. **集成 API**：
   - [API.md](API)
   - [guides/DISPLAY_API_GUIDE.md](guides/guides-DISPLAY_API_GUIDE)
   - [CONFIG_SCHEMA.md](CONFIG_SCHEMA)

4. **追踪变更**：
   - [reports/CHANGELOG.md](reports/reports-CHANGELOG_2026M03_24)
   - [reports/CODE_CHANGES_SUMMARY.md](reports/reports-CODE_CHANGES_SUMMARY)

---

## 需要帮助？

- 完整索引：[INDEX.md](/zh-CN/docs/index)
- 文档中心：[文档索引](/zh-CN/docs/index)
- 项目根 README：[Repository README](https://github.com/opensynaptic/opensynaptic/blob/main/README.md)

_最后更新：2026-04-04（本地工作区）_
