# 📚 OpenSynaptic 完整导航

<div align="center">

**中文文档完整索引** — 91+ 页

[![](https://img.shields.io/badge/语言-中文-blue?style=flat-square)]()
[![](https://img.shields.io/badge/总页数-91%2B-brightgreen?style=flat-square)]()
[![](https://img.shields.io/badge/最后更新-2026--04--04-blueviolet?style=flat-square)]()

[🇬🇧 English](../en_GB/Navigation-EN) • [🏠 首页](Home) • [🔍 完整索引](INDEX)

</div>

---

## 🚀 从这里开始

<table width="100%">
  <tr>
    <td width="33%">
      <h3>🆕 初次接触？</h3>
      <ul>
        <li><a href="README"><strong>README</strong></a><br/>安装和快速开始</li>
        <li><a href="QUICK_START">快速入门</a><br/>运行第一条命令</li>
        <li><a href="ARCHITECTURE">架构概览</a><br/>系统设计详解</li>
      </ul>
    </td>
    <td width="33%">
      <h3>🔍 快速查询</h3>
      <ul>
        <li><a href="guides-QUICK_REFERENCE">快速参考</a><br/>速查手册</li>
        <li><a href="guides-TUI_QUICK_REFERENCE">TUI 命令</a><br/>终端界面参考</li>
        <li><a href="guides-WEB_COMMANDS_REFERENCE">Web 命令</a><br/>Web 界面参考</li>
      </ul>
    </td>
    <td width="33%">
      <h3>⭐ 推荐阅读</h3>
      <ul>
        <li><a href="CONFIG_SCHEMA">配置架构</a><br/>完整配置指南</li>
        <li><a href="API">API 概览</a><br/>所有公共 API</li>
        <li><a href="plugins-PLUGIN_DEVELOPMENT_SPECIFICATION_2026">插件规范</a><br/>最新插件开发</li>
      </ul>
    </td>
  </tr>
</table>

---

## 🏗️ 架构与设计

| 主题 | 文档 |
|------|------|
| **核心管道** | [核心管道接口](architecture-CORE_PIPELINE_INTERFACE_EXPOSURE) • [架构演变](architecture-ARCHITECTURE_EVOLUTION_COMPARISON) • [FFI 分析](architecture-ARCHITECTURE_FFI_ANALYSIS) • [FFI 验证图表](architecture-FFI_VERIFICATION_DIAGRAMS) |
| **主要架构** | [架构概览](ARCHITECTURE)（必读） |

---

## 🔌 API 与绑定

| 层级 | 文档 |
|------|------|
| **公共 API** | [API 概览](API) — 从这里开始 • [核心 API](CORE_API) — 详细参考 |
| **语言绑定** | [Pycore/Rust API](PYCORE_RUST_API) — Python 绑定 • [Rscore API](RSCORE_API) — Rust 接口 |
| **传输层** | [传输器插件](TRANSPORTER_PLUGIN) — 自定义传输 • [Display API](guides-DISPLAY_API_GUIDE) — UI 系统 |

---

## ⚙️ 配置与管理

| 主题 | 文档 |
|------|------|
| **配置** | [配置架构](CONFIG_SCHEMA) — 完整参考 • [ID 租约系统](ID_LEASE_SYSTEM) — 设备 ID 管理 • [ID 租约配置](ID_LEASE_CONFIG_REFERENCE) — 快速指南 |
| **运维** | [重启命令](guides-RESTART_COMMAND_GUIDE) — 优雅重启 • [功能开关](features-FEATURE_TOGGLE_GUIDE) — 启用/禁用 |

---

## 🔧 指南与教程

<table width="100%">
  <tr>
    <th align="left" width="25%">🎮 用户界面</th>
    <th align="left" width="25%">🔌 集成</th>
    <th align="left" width="25%">📡 网络</th>
    <th align="left" width="25%">🚀 高级</th>
  </tr>
  <tr>
    <td>
      • <a href="guides-DISPLAY_API_GUIDE">Display API</a><br/>
      • <a href="guides-DISPLAY_API_QUICKSTART">Display 快速开始</a><br/>
      • <a href="guides-TUI_QUICK_REFERENCE">TUI 参考</a><br/>
      • <a href="guides-WEB_COMMANDS_REFERENCE">Web 命令</a>
    </td>
    <td>
      • <a href="guides-QUICK_REFERENCE">快速参考</a><br/>
      • <a href="../en_GB/guides-drivers-quick-reference">驱动参考</a>
    </td>
    <td>
      • <a href="features-PORT_FORWARDER_COMPLETE_GUIDE">端口转发</a><br/>
      • <a href="features-PORT_FORWARDER_ONE_TO_MANY_GUIDE">端口转发 1-to-N</a><br/>
      • <a href="features-ENHANCED_PORT_FORWARDER_GUIDE">增强端口转发</a>
    </td>
    <td>
      • <a href="features-IMPLEMENTATION_universal_driver_support">驱动支持</a><br/>
      • <a href="features-FEATURE_TOGGLE_GUIDE">功能开关</a>
    </td>
  </tr>
</table>

---

## 🎨 插件开发

<table width="100%">
  <tr>
    <th align="center" width="50%">📘 快速开始</th>
    <th align="center" width="50%">🔧 高级主题</th>
  </tr>
  <tr>
    <td>
      <strong>1. <a href="plugins-PLUGIN_DEVELOPMENT_SPECIFICATION_2026">插件规范 2026</a></strong><br/>
      最新规范和需求<br/><br/>
      <strong>2. <a href="plugins-PLUGIN_STARTER_KIT">启动工具包</a></strong><br/>
      复制粘贴模板即可开始<br/><br/>
      <strong>3. <a href="plugins-PLUGIN_QUICK_REFERENCE">快速参考</a></strong><br/>
      API 查询和示例
    </td>
    <td>
      • <a href="plugins-PLUGIN_HIJACKING_PORT_FORWARDING">劫持：端口转发</a><br/>
      • <a href="plugins-PLUGIN_DOCS_INDEX">文档索引</a><br/>
      • <a href="plugins-PLUGIN_DEVELOPMENT_SPECIFICATION">遗留规范</a><br/>
    </td>
  </tr>
</table>

---

## 📦 版本发布

<table width="100%">
  <tr>
    <th align="left">版本</th>
    <th align="left">文档</th>
  </tr>
  <tr>
    <td><strong>v1.1.0</strong>（最新）</td>
    <td><a href="releases-v1.1.0">发布说明</a></td>
  </tr>
  <tr>
    <td><strong>v1.0.0-rc1</strong></td>
    <td><a href="releases-v1.0.0-rc1">发布说明</a></td>
  </tr>
  <tr>
    <td><strong>v0.3.0</strong></td>
    <td><a href="releases-v0.3.0公告">公告</a></td>
  </tr>
  <tr>
    <td><strong>v0.2.0</strong></td>
    <td><a href="releases-v0.2.0公告">公告</a></td>
  </tr>
  <tr>
    <td><strong>发布管理</strong></td>
    <td><a href="releases-RELEASE_CHECKLIST">发布清单</a></td>
  </tr>
</table>

---

## 📊 报告与资源库

<table width="100%">
  <tr>
    <th align="left" width="50%">📈 报告</th>
    <th align="left" width="50%">📚 资源库</th>
  </tr>
  <tr>
    <td>
      • <a href="reports-CHANGELOG_2026M03_24">2026-03-24 更新日志</a><br/>
      • <a href="reports-COMPREHENSIVE_COMPLETION_SUMMARY">实现完成</a><br/>
      • <a href="../en_GB/reports-FINAL_PERFORMANCE_REPORT">性能报告</a><br/>
      • <a href="reports-BUG_FIX_REPORT">Bug 修复报告</a><br/>
      • <a href="../en_GB/reports-TUI_REFACTOR_COMPLETION_SUMMARY">TUI 重构</a>
    </td>
    <td>
      • <a href="INDEX">完整索引</a><br/>
      • <a href="DOCUMENT_ORGANIZATION">文档组织</a><br/>
      • <a href="I18N">国际化指南</a><br/><br/>
      <em>所有 91+ 中文页面<br/>
      文档完整资源库</em>
    </td>
  </tr>
</table>

---

## 🔬 内部资源与高级

| 分类 | 文档 |
|------|------|
| **性能优化** | [性能手册第一阶段](../en_GB/internal-PHASE1_PERF_PLAYBOOK) • [性能手册第二阶段](../en_GB/internal-PHASE2_PERF_PLAYBOOK) • [优化报告](../en_GB/internal-OPTIMIZATION_REPORT) |
| **深度研究** | [Agents](../en_GB/internal-AGENTS) • [Pycore 内部](../en_GB/internal-PYCORE_INTERNALS) |

---

## 🌐 快速导航

<div align="center">

### 语言和首页
[🇬🇧 **English Navigation**](../en_GB/Navigation-EN) | [🏠 **首页**](Home) | [🔍 **完整索引**](INDEX)

### 常见任务
[如何安装？](README) — [如何配置？](CONFIG_SCHEMA) — [如何开发插件？](plugins-PLUGIN_STARTER_KIT)

---

**最后更新：** 2026-04-04 | **总页数：** 91+ | **状态：** ✅ 完整

[⬆ 返回顶部](#-opensynaptic-完整导航)

</div>
