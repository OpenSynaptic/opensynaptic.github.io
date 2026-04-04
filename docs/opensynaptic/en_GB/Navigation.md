# 📚 OpenSynaptic Complete Navigation

<div align="center">

**Full English Documentation Index** — 110+ Pages

[![](https://img.shields.io/badge/language-English-blue?style=flat-square)]()
[![](https://img.shields.io/badge/total%20pages-110%2B-brightgreen?style=flat-square)]()
[![](https://img.shields.io/badge/last%20updated-2026--04--04-blueviolet?style=flat-square)]()

[🇨🇳 中文版本](../zh_CN/Navigation-ZH) • [🏠 Home](Home) • [🔍 Full Index](INDEX)

</div>

---

## 🚀 Start Here

<table width="100%">
  <tr>
    <td width="33%">
      <h3>🆕 New to OpenSynaptic?</h3>
      <ul>
        <li><a href="README"><strong>README</strong></a><br/>Installation and quickstart</li>
        <li><a href="QUICK_START">Quick Start</a><br/>Run your first command</li>
        <li><a href="ARCHITECTURE">Architecture</a><br/>System design overview</li>
      </ul>
    </td>
    <td width="33%">
      <h3>🔍 Quick Lookup</h3>
      <ul>
        <li><a href="guides-QUICK_REFERENCE">Quick Reference</a><br/>Handy cheat sheet</li>
        <li><a href="guides-TUI_QUICK_REFERENCE">TUI Commands</a><br/>Terminal UI reference</li>
        <li><a href="guides-WEB_COMMANDS_REFERENCE">Web Commands</a><br/>Web UI reference</li>
      </ul>
    </td>
    <td width="33%">
      <h3>⭐ Recommended</h3>
      <ul>
        <li><a href="CONFIG_SCHEMA">Config Schema</a><br/>Full configuration guide</li>
        <li><a href="API">API Overview</a><br/>All public APIs</li>
        <li><a href="plugins-PLUGIN_DEVELOPMENT_SPECIFICATION_2026">Plugin Spec</a><br/>Latest plugin dev</li>
      </ul>
    </td>
  </tr>
</table>

---

## 🏗️ Architecture & Design

| Topic | Documents |
|-------|-----------|
| **Core Pipeline** | [Core Pipeline Interface](architecture-CORE_PIPELINE_INTERFACE_EXPOSURE) • [Evolution](architecture-ARCHITECTURE_EVOLUTION_COMPARISON) • [FFI Analysis](architecture-ARCHITECTURE_FFI_ANALYSIS) • [FFI Diagrams](architecture-FFI_VERIFICATION_DIAGRAMS) |
| **Main Architecture** | [Architecture Overview](ARCHITECTURE) (essential read) |

---

## 🔌 APIs & Bindings

| Level | Documents |
|-------|-----------|
| **Public APIs** | [API Overview](API) — Start here • [Core API](CORE_API) — Detailed reference |
| **Language Bindings** | [Pycore/Rust API](PYCORE_RUST_API) — Python bindings • [Rscore API](RSCORE_API) — Rust interface |
| **Transport** | [Transporter Plugin](TRANSPORTER_PLUGIN) — Custom transports • [Display API](guides-DISPLAY_API_GUIDE) — UI system |

---

## ⚙️ Configuration & Management

| Topic | Documents |
|-------|-----------|
| **Configuration** | [Config Schema](CONFIG_SCHEMA) — Full reference • [ID Lease System](ID_LEASE_SYSTEM) — Device ID mgmt • [ID Lease Config](ID_LEASE_CONFIG_REFERENCE) — Quick guide |
| **Operations** | [Restart Command](guides-RESTART_COMMAND_GUIDE) — Graceful restarts • [Feature Toggles](features-FEATURE_TOGGLE_GUIDE) — Enable/disable |

---

## 🔧 Guides & Tutorials

<table width="100%">
  <tr>
    <th align="left" width="25%">🎮 User Interfaces</th>
    <th align="left" width="25%">🔌 Integration</th>
    <th align="left" width="25%">📡 Networking</th>
    <th align="left" width="25%">🚀 Advanced</th>
  </tr>
  <tr>
    <td>
      • <a href="guides-DISPLAY_API_GUIDE">Display API</a><br/>
      • <a href="guides-DISPLAY_API_QUICKSTART">Display Quickstart</a><br/>
      • <a href="guides-TUI_QUICK_REFERENCE">TUI Ref</a><br/>
      • <a href="guides-WEB_COMMANDS_REFERENCE">Web Commands</a>
    </td>
    <td>
      • <a href="guides-QUICK_REFERENCE">Quick Ref</a><br/>
      • <a href="guides-drivers-quick-reference">Drivers Ref</a><br/>
      • <a href="guides-upgrade-v0.3.0">Upgrade v0.3.0</a>
    </td>
    <td>
      • <a href="features-PORT_FORWARDER_COMPLETE_GUIDE">Port Forwarder</a><br/>
      • <a href="features-PORT_FORWARDER_ONE_TO_MANY_GUIDE">Port Forward 1-to-N</a><br/>
      • <a href="features-ENHANCED_PORT_FORWARDER_GUIDE">Enhanced Port Fwd</a>
    </td>
    <td>
      • <a href="features-IMPLEMENTATION_universal_driver_support">Driver Support</a><br/>
      • <a href="features-FEATURE_TOGGLE_GUIDE">Feature Toggles</a>
    </td>
  </tr>
</table>

---

## 🎨 Plugin Development

<table width="100%">
  <tr>
    <th align="center" width="50%">📘 Getting Started</th>
    <th align="center" width="50%">🔧 Advanced Topics</th>
  </tr>
  <tr>
    <td>
      <strong>1. <a href="plugins-PLUGIN_DEVELOPMENT_SPECIFICATION_2026">Plugin Spec 2026</a></strong><br/>
      Latest specification and requirements<br/><br/>
      <strong>2. <a href="plugins-PLUGIN_STARTER_KIT">Starter Kit</a></strong><br/>
      Copy-paste template to begin<br/><br/>
      <strong>3. <a href="plugins-PLUGIN_QUICK_REFERENCE">Quick Reference</a></strong><br/>
      API lookup and examples
    </td>
    <td>
      • <a href="plugins-PLUGIN_HIJACKING_PORT_FORWARDING">Hijacking: Port Forward</a><br/>
      • <a href="plugins-PLUGIN_HIJACKING_PRACTICAL_CODE">Hijacking: Code Patterns</a><br/>
      • <a href="plugins-PLUGIN_DOCS_INDEX">Docs Index</a><br/>
      • <a href="plugins-PLUGIN_DEVELOPMENT_SPECIFICATION">Legacy Spec</a><br/>
    </td>
  </tr>
</table>

---

## 📦 Releases & Versions

<table width="100%">
  <tr>
    <th align="left">Version</th>
    <th align="left">Documentation</th>
  </tr>
  <tr>
    <td><strong>v1.1.0</strong> (Latest)</td>
    <td><a href="releases-v1.1.0">Release Notes</a></td>
  </tr>
  <tr>
    <td><strong>v1.0.0-rc1</strong></td>
    <td><a href="releases-v1.0.0-rc1">Release Notes</a></td>
  </tr>
  <tr>
    <td><strong>v0.3.0</strong></td>
    <td><a href="releases-v0.3.0_announcement_en">Announcement</a></td>
  </tr>
  <tr>
    <td><strong>v0.2.0</strong></td>
    <td><a href="releases-v0.2.0_announcement">Announcement</a></td>
  </tr>
  <tr>
    <td><strong>Release Management</strong></td>
    <td><a href="releases-RELEASE_CHECKLIST">Release Checklist</a></td>
  </tr>
</table>

---

## 📊 Reports & Repository

<table width="100%">
  <tr>
    <th align="left" width="50%">📈 Reports</th>
    <th align="left" width="50%">📚 Repository</th>
  </tr>
  <tr>
    <td>
      • <a href="reports-CHANGELOG_2026M03_24">2026-03-24 Changelog</a><br/>
      • <a href="reports-DOC_FRESHNESS_AUDIT_2026-04-02">Doc Freshness Audit</a><br/>
      • <a href="reports-IMPLEMENTATION_COMPLETE">Implementation Status</a><br/>
      • <a href="reports-FINAL_PERFORMANCE_REPORT">Performance Report</a><br/>
      • <a href="reports-DISPLAY_API_FINAL_REPORT">Display API Report</a><br/>
      • <a href="reports-drivers-final-capability-audit">Driver Audit</a><br/>
      • <a href="reports-TUI_REFACTOR_COMPLETION_SUMMARY">TUI Refactor</a>
    </td>
    <td>
      • <a href="en-INDEX">Complete Index</a><br/>
      • <a href="en-DOCUMENT_ORGANIZATION">Doc Organization</a><br/>
      • <a href="en-I18N">i18n Guide</a><br/><br/>
      <em>Full document repository with<br/>
      all 110+ English pages</em>
    </td>
  </tr>
</table>

---

## 🔬 Internal & Advanced

| Category | Documents |
|----------|-----------|
| **Performance** | [Playbook Phase 1](internal-PHASE1_PERF_PLAYBOOK) • [Playbook Phase 2](internal-PHASE2_PERF_PLAYBOOK) • [Optimization Report](internal-OPTIMIZATION_REPORT) |
| **Deep Dives** | [Agents](internal-AGENTS) • [Pycore Internals](internal-PYCORE_INTERNALS) |

---

## 🌐 Quick Navigation

<div align="center">

### Language & Home
[🇨🇳 **中文导航**](../zh_CN/Navigation-ZH) | [🏠 **Home**](Home) | [🔍 **Full Index**](INDEX)

### Common Tasks
[How to Install?](README) — [How to Configure?](CONFIG_SCHEMA) — [How to Build Plugin?](plugins-PLUGIN_STARTER_KIT)

---

**Last Updated:** 2026-04-04 | **Total Pages:** 110+ | **Status:** ✅ Complete

[⬆ Back to top](#-opensynaptic-complete-navigation)

</div>
