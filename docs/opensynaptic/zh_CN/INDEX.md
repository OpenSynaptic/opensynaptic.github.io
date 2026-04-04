# 📑 OpenSynaptic 完整文档索引

<div align="center">

**所有文档在一个地方** — 88+ 中文文档

[![](https://img.shields.io/badge/语言-中文-blue?style=flat-square)]()
[![](https://img.shields.io/badge/总文档数-88%2B-brightgreen?style=flat-square)]()
[![](https://img.shields.io/badge/最后更新-2026--04--04-blueviolet?style=flat-square)]()

[🇬🇧 English Index](../en_GB/INDEX) • [🏠 首页](Home) • [📖 Navigation-ZH](Navigation-ZH)

</div>

---

## 🚀 快速开始（按顺序阅读）

| 步骤 | 文档 | 目的 |
|------|------|------|
| 1️⃣ | [README](README) | 安装和概览 |
| 2️⃣ | [架构](ARCHITECTURE) | 系统设计 |
| 3️⃣ | [配置架构](CONFIG_SCHEMA) | 配置指南 |
| 4️⃣ | [API 概览](API) | 公开接口 |

---

## 🏗️ 按类别浏览

### 架构 (4 文档)
| 文档 | 用途 |
|------|------|
| [核心架构](ARCHITECTURE) | 主系统设计 |
| [核心管道接口](architecture-CORE_PIPELINE_INTERFACE_EXPOSURE) | 管道内部 |
| [架构演变](architecture-ARCHITECTURE_EVOLUTION_COMPARISON) | 设计更改 |
| [FFI 分析](architecture-ARCHITECTURE_FFI_ANALYSIS) | 外部函数接口 |

### API 与契约 (8 文档)
| 文档 | 用途 |
|------|------|
| [API 概览](API) | 所有公开接口 |
| [核心 API](CORE_API) | Python 核心接口 |
| [Pycore/Rust API](PYCORE_RUST_API) | Python/Rust 绑定 |
| [Rscore API](RSCORE_API) | Rust 核心接口 |
| [传输插件](TRANSPORTER_PLUGIN) | 传输层 |
| [配置架构](CONFIG_SCHEMA) | 配置参考 |
| [Display API 报告](api-DISPLAY_API_FINAL_REPORT) | 显示系统 |
| [Display 实现](api-DISPLAY_API_IMPLEMENTATION_SUMMARY) | 实现指南 |

### 功能与管理 (7 文档)
| 文档 | 用途 |
|------|------|
| [ID 租赁系统](ID_LEASE_SYSTEM) | 设备 ID 管理 |
| [ID 租赁配置](ID_LEASE_CONFIG_REFERENCE) | ID 速查表 |
| [增强端口转发](features-ENHANCED_PORT_FORWARDER_GUIDE_zh) | 高级路由 |
| [功能开关](features-FEATURE_TOGGLE_GUIDE) | 启用/禁用功能 |
| [端口转发](features-PORT_FORWARDER_COMPLETE_GUIDE) | 端口转发指南 |
| [端口转发 1-to-N](features-PORT_FORWARDER_ONE_TO_MANY_GUIDE) | 多跳转发 |
| [通用驱动](features-IMPLEMENTATION_universal_driver_support_zh) | 自定义驱动 |

### 插件开发 (9 文档)
| 文档 | 用途 |
|------|------|
| [插件规范 2026](plugins-PLUGIN_DEVELOPMENT_SPECIFICATION_2026) | 最新规范 |
| [插件启动工具包](plugins-PLUGIN_STARTER_KIT_zh) | 模板代码 |
| [插件快速参考](plugins-PLUGIN_QUICK_REFERENCE_zh) | API 速查表 |
| [插件劫持](plugins-PLUGIN_HIJACKING_PORT_FORWARDING_zh) | 高级模式 |
| [插件文档索引](plugins-PLUGIN_DOCS_INDEX) | 所有插件文档 |
| [插件规范（旧版）](plugins-PLUGIN_DEVELOPMENT_SPECIFICATION_zh) | 旧规范 |
| [插件快速参考 2026](plugins-PLUGIN_QUICK_REFERENCE_2026) | 2026 API 总结 |
| [插件启动 2026](plugins-PLUGIN_STARTER_KIT_2026) | 2026 模板 |
| [插件代码模式](plugins-PLUGIN_HIJACKING_PRACTICAL_CODE) | 代码示例 |

### 指南与教程 (10 文档)
| 文档 | 用途 |
|------|------|
| [Display API 指南](guides-DISPLAY_API_GUIDE) | UI 系统教程 |
| [Display 快速开始](guides-DISPLAY_API_QUICKSTART) | 快速入门 |
| [Display README](guides-DISPLAY_API_README) | 说明文件 |
| [Display 索引](guides-DISPLAY_API_INDEX) | 主题索引 |
| [重启命令](guides-RESTART_COMMAND_GUIDE) | 优雅重启 |
| [快速参考](guides-QUICK_REFERENCE_zh) | 主要速查表 |
| [Web 命令](guides-WEB_COMMANDS_REFERENCE) | Web API 命令 |
| [TUI 参考](guides-TUI_QUICK_REFERENCE) | 终端 UI 命令 |
| [重构参考](guides-REFACTORING_QUICK_REFERENCE_zh) | 代码重构 |
| [升级 v0.3.0](../en_GB/guides-upgrade-v0.3.0) | 版本升级指南 |

### 报告 (25+ 文档)
| 分类 | 文档 |
|------|------|
| **日志** | [更新日志](reports-CHANGELOG_2026M03_24_zh) • [审计](../en_GB/reports-DOC_FRESHNESS_AUDIT_2026-04-02) |
| **性能** | [最终报告](../en_GB/reports-FINAL_PERFORMANCE_REPORT) • [优化](../en_GB/reports-PERFORMANCE_OPTIMIZATION_REPORT) |
| **完整性** | [实现完成](reports-COMPREHENSIVE_COMPLETION_SUMMARY_zh) • [代码更改](reports-CODE_CHANGES_SUMMARY_zh) |
| **修复** | [Bug 报告](reports-BUG_FIX_REPORT_zh) |
| **Display API** | [最终报告](../en_GB/reports-DISPLAY_API_FINAL_REPORT) |
| **TUI** | [重构总结](../en_GB/reports-TUI_REFACTOR_COMPLETION_SUMMARY) |
| **版本** | [v1.1.0](releases-v1.1.0) • [v1.0.0-rc1](releases-v1.0.0-rc1) • [v0.3.0](releases-v0.3.0公告_zh) • [v0.2.0](releases-v0.2.0公告_zh) |

### 内部与高级 (12+ 文档)
| 文档 | 用途 |
|------|------|
| [Agents](../en_GB/internal-AGENTS) | 自动化框架 |
| [Pycore 内部](../en_GB/internal-PYCORE_INTERNALS) | Python 实现 |
| [第 1 阶段手册](../en_GB/internal-PHASE1_PERF_PLAYBOOK) | 性能优化 |
| [第 2 阶段手册](../en_GB/internal-PHASE2_PERF_PLAYBOOK) | 第 2 阶段优化 |
| [优化](../en_GB/internal-OPTIMIZATION_REPORT) | 优化报告 |
| [模块修复](../en_GB/internal-FIX_ModuleNotFoundError) | 导入问题 |
| [Web 修复](../en_GB/internal-WEB_COMMAND_FIX) | Web 命令修复 |
| [工作总结](../en_GB/internal-WORK_SUMMARY) | 工作概览 |
| [零拷贝](../en_GB/internal-ZERO_COPY_CLOSEOUT) | 零拷贝优化 |

---

## 👥 按角色分类

| 角色 | 目标 | 从这里开始 |
|------|------|----------|
| **新用户** | 快速上手 | [README](README) |
| **开发者** | 构建服务 | [插件规范](plugins-PLUGIN_DEVELOPMENT_SPECIFICATION_2026) |
| **API 使用者** | 使用 API | [API 概览](API) |
| **运维人员** | 配置系统 | [配置架构](CONFIG_SCHEMA) |
| **性能工程师** | 调优性能 | [性能报告](../en_GB/reports-FINAL_PERFORMANCE_REPORT) |
| **架构师** | 理解设计 | [架构](ARCHITECTURE) |
| **维护人员** | 跟踪更改 | [更新日志](reports-CHANGELOG_2026M03_24_zh) |

---

## 📊 文档统计

**总计：88+ 文档**

| 分类 | 数量 |
|------|-----:|
| 核心文档 | 4 |
| 架构 | 4 |
| API | 8 |
| 功能 | 7 |
| 插件 | 9 |
| 指南 | 10 |
| 报告 | 25+ |
| 内部 | 12+ |
| 版本发布 | 4 |

---

## 🔍 按文档类型查找

### 快速参考
- [ID 租赁配置](ID_LEASE_CONFIG_REFERENCE)
- [配置架构](CONFIG_SCHEMA)
- [快速参考](guides-QUICK_REFERENCE_zh)

### 深度指南
- [架构](ARCHITECTURE)
- [ID 租赁系统](ID_LEASE_SYSTEM)
- [插件规范 2026](plugins-PLUGIN_DEVELOPMENT_SPECIFICATION_2026)

### API 参考
- [API 概览](API)
- [核心 API](CORE_API)
- [Pycore/Rust](PYCORE_RUST_API)
- [Rscore](RSCORE_API)

---

## 🌐 语言与导航

<div align="center">

[🇬🇧 **English Index**](../en_GB/INDEX) | [🏠 **首页**](Home) | [📖 **Navigation-ZH**](Navigation-ZH)

---

**最后更新：** 2026-04-04 | **状态：** ✅ 完整 | **总文档：** 88+

[⬆ 返回顶部](#-opensynaptic-完整文档索引)

</div>  
