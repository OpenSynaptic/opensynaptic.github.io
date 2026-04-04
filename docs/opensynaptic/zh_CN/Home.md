# 🎯 OpenSynaptic Wiki

<div align="center">

**A 2-N-2 IoT Protocol Stack** — Standardize • Compress • Dispatch

[![Latest Release](https://img.shields.io/badge/release-v1.1.0-blue?style=flat-square)](../en_GB/releases-v1.1.0)
[![Documentation](https://img.shields.io/badge/docs-201%20pages-brightgreen?style=flat-square)](../en_GB/INDEX)
[![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)](https://github.com/opensynaptic/opensynaptic/blob/main/LICENSE)
[![Status](https://img.shields.io/badge/status-Active-success?style=flat-square)]()
[![Languages](https://img.shields.io/badge/languages-EN%20%7C%20中文-orange?style=flat-square)]()

[GitHub](https://github.com/opensynaptic/opensynaptic) • [Issues](https://github.com/opensynaptic/opensynaptic/issues) • [Discussions](https://github.com/opensynaptic/opensynaptic/discussions)

</div>

---

## 🌍 Language Selection

<table width="100%">
  <tr>
    <td width="50%" align="center">
      <h3>🇬🇧 English</h3>
      <p><strong>Full documentation in English</strong></p>
      <p>
        <a href="../en_GB/Navigation-EN"><strong>→ Full Navigation</strong></a><br/>
        <a href="../en_GB/README">Installation</a> • 
        <a href="../en_GB/ARCHITECTURE">Architecture</a> • 
        <a href="../en_GB/QUICK_START">Quick Start</a>
      </p>
    </td>
    <td width="50%" align="center">
      <h3>🇨🇳 中文</h3>
      <p><strong>全部中文文档</strong></p>
      <p>
        <a href="Home"><strong>→ 🇨🇳 中文首页</strong></a><br/>
        <a href="Navigation-ZH"><strong>→ 完整导航</strong></a><br/>
        <a href="README">安装指南</a> • 
        <a href="ARCHITECTURE">架构</a> • 
        <a href="QUICK_START">快速开始</a>
      </p>
    </td>
  </tr>
</table>

---

## 🎯 Choose Your Path

<table width="100%">
  <tr>
    <td align="center" width="25%">
      <h3>👨‍💼</h3>
      <h4>First Time?</h4>
      <p>New to OpenSynaptic?</p>
      [**Get Started →**](../en_GB/README)
    </td>
    <td align="center" width="25%">
      <h3>🔧</h3>
      <h4>Operator</h4>
      <p>Deploy & manage</p>
      [**Configure →**](../en_GB/Navigation-EN)
    </td>
    <td align="center" width="25%">
      <h3>🔌</h3>
      <h4>Developer</h4>
      <p>Build plugins</p>
      [**Dev Guide →**](../en_GB/plugins-PLUGIN_DEVELOPMENT_SPECIFICATION_2026)
    </td>
    <td align="center" width="25%">
      <h3>📚</h3>
      <h4>Architecture</h4>
      <p>Understand system</p>
      [**Learn →**](../en_GB/ARCHITECTURE)
    </td>
  </tr>
</table>

---

## 📦 What is OpenSynaptic?

<table width="100%">
  <tr>
    <th align="left" width="30%">Aspect</th>
    <th align="left" width="70%">Description</th>
  </tr>
  <tr>
    <td><strong>Core Purpose</strong></td>
    <td>2-N-2 IoT protocol stack for standardizing, compressing, and dispatching sensor data across heterogeneous networks</td>
  </tr>
  <tr>
    <td><strong>Pipeline</strong></td>
    <td><code>sensors → standardize (UCUM) → compress (Base62) → fuse (FULL/DIFF) → dispatch (transport)</code></td>
  </tr>
  <tr>
    <td><strong>Key Features</strong></td>
    <td>Multi-language backends (Python, Rust), pluggable transporters (UDP, MQTT, UART), device ID leasing, TUI + Web UI</td>
  </tr>
  <tr>
    <td><strong>Scalability</strong></td>
    <td>Tested on 1M+ messages, 12 protocol types, stress tested up to 200 concurrent workers</td>
  </tr>
  <tr>
    <td><strong>Use Cases</strong></td>
    <td>Sensor networks, edge computing, IoT gateways, protocol bridging, heterogeneous device management</td>
  </tr>
</table>

---

## ⚡ Quick Commands

```powershell
# Install and run
pip install -e .
os-node demo --open-browser

# Run tests
py -3 -m pytest --cov=opensynaptic tests
python scripts/integration_test.py

# Plugin development
python -u src/main.py plugin-test --suite component
python -u src/main.py plugin-test --suite integration

# System information
python -u src/main.py native-check
python -u src/main.py core --set rscore --persist
```

---

## 📋 Documentation Highlights

<table width="100%">
  <tr>
    <th align="center">🏗️ Architecture</th>
    <th align="center">🔌 APIs</th>
    <th align="center">⚙️ Configuration</th>
    <th align="center">🎯 Guides</th>
  </tr>
  <tr>
    <td>
      • [Core Architecture](../en_GB/ARCHITECTURE)<br/>
      • [Design Evolution](../en_GB/architecture-ARCHITECTURE_EVOLUTION_COMPARISON)<br/>
      • [FFI Analysis](../en_GB/architecture-ARCHITECTURE_FFI_ANALYSIS)<br/>
      • [API Spec](../en_GB/API)
    </td>
    <td>
      • [Core API](../en_GB/CORE_API)<br/>
      • [Pycore/Rust](../en_GB/PYCORE_RUST_API)<br/>
      • [Rscore API](../en_GB/RSCORE_API)<br/>
      • [Display API](../en_GB/guides-DISPLAY_API_GUIDE)
    </td>
    <td>
      • [Config Schema](../en_GB/CONFIG_SCHEMA)<br/>
      • [ID Lease System](../en_GB/ID_LEASE_SYSTEM)<br/>
      • [Feature Toggles](../en_GB/features-FEATURE_TOGGLE_GUIDE)<br/>
      • [Quick Ref](../en_GB/ID_LEASE_CONFIG_REFERENCE)
    </td>
    <td>
      • [TUI Guide](../en_GB/guides-TUI_QUICK_REFERENCE)<br/>
      • [Web Commands](../en_GB/guides-WEB_COMMANDS_REFERENCE)<br/>
      • [Drivers Ref](../en_GB/guides-drivers-quick-reference)<br/>
      • [Restart Guide](../en_GB/guides-RESTART_COMMAND_GUIDE)
    </td>
  </tr>
</table>

---

## 🔧 Common Tasks

<table width="100%">
  <tr>
    <th align="left">I want to...</th>
    <th align="left">Go to...</th>
  </tr>
  <tr>
    <td>Install OpenSynaptic</td>
    <td>[README](../en_GB/README) → [Quick Start](../en_GB/QUICK_START)</td>
  </tr>
  <tr>
    <td>Understand the system design</td>
    <td>[Architecture](../en_GB/ARCHITECTURE) → [Core API](../en_GB/CORE_API)</td>
  </tr>
  <tr>
    <td>Configure my deployment</td>
    <td>[Config Schema](../en_GB/CONFIG_SCHEMA) → [ID Lease](../en_GB/ID_LEASE_SYSTEM)</td>
  </tr>
  <tr>
    <td>Manage device IDs</td>
    <td>[ID Lease System](../en_GB/ID_LEASE_SYSTEM) → [ID Lease Config](../en_GB/ID_LEASE_CONFIG_REFERENCE)</td>
  </tr>
  <tr>
    <td>Build a custom plugin</td>
    <td>[Plugin Spec](../en_GB/plugins-PLUGIN_DEVELOPMENT_SPECIFICATION_2026) → [Starter Kit](../en_GB/plugins-PLUGIN_STARTER_KIT)</td>
  </tr>
  <tr>
    <td>Use the Terminal UI</td>
    <td>[TUI Quick Reference](../en_GB/guides-TUI_QUICK_REFERENCE) → [Display API](../en_GB/guides-DISPLAY_API_GUIDE)</td>
  </tr>
  <tr>
    <td>Configure network transports</td>
    <td>[Transporter Plugin](../en_GB/TRANSPORTER_PLUGIN) → [Port Forwarder](../en_GB/features-PORT_FORWARDER_COMPLETE_GUIDE)</td>
  </tr>
  <tr>
    <td>Optimize for performance</td>
    <td>[Performance Report](../en_GB/reports-FINAL_PERFORMANCE_REPORT) → [Perf Playbooks](../en_GB/internal-PHASE1_PERF_PLAYBOOK)</td>
  </tr>
  <tr>
    <td>Set up graceful restarts</td>
    <td>[Restart Guide](../en_GB/guides-RESTART_COMMAND_GUIDE)</td>
  </tr>
  <tr>
    <td>Check implementation status</td>
    <td>[Implementation Complete](../en_GB/reports-IMPLEMENTATION_COMPLETE) → [Changelog](../en_GB/reports-CHANGELOG_2026M03_24)</td>
  </tr>
</table>

---

## 📊 Wiki Statistics

<table width="100%">
  <tr>
    <th align="center">📍 Metric</th>
    <th align="center">📈 Value</th>
  </tr>
  <tr>
    <td><strong>Total Pages</strong></td>
    <td>201</td>
  </tr>
  <tr>
    <td><strong>English Documents</strong></td>
    <td>110+</td>
  </tr>
  <tr>
    <td><strong>Chinese Documents (中文)</strong></td>
    <td>91+</td>
  </tr>
  <tr>
    <td><strong>Plugin Resources</strong></td>
    <td>8+</td>
  </tr>
  <tr>
    <td><strong>Technical Reports</strong></td>
    <td>12+</td>
  </tr>
  <tr>
    <td><strong>Last Updated</strong></td>
    <td>2026-04-04</td>
  </tr>
</table>

---

## 🌳 Knowledge Base Structure

```
OpenSynaptic Wiki Root
├── 📍 Home (This page)
├── 📍 Navigation-EN (Full English Index)
├── 📍 Navigation-ZH (完整中文索引)
│
├── 📚 Core Documentation (../en_GB/README, en-ARCHITECTURE, en-API, etc.)
├── 🏗️ Architecture & Design (../en_GB/architecture-*)
├── 🔌 APIs & Bindings (../en_GB/CORE_API, en-PYCORE_RUST_API, en-RSCORE_API)
├── ⚙️ Configuration (../en_GB/CONFIG_SCHEMA, en-ID_LEASE_SYSTEM)
├── 🎯 Features (../en_GB/features-*)
├── 🔧 Guides & Tutorials (../en_GB/guides-*)
├── 🎨 Plugin Development (../en_GB/plugins-*)
├── 📦 Releases (../en_GB/releases-*)
├── 📊 Technical Reports (../en_GB/reports-*)
└── 📋 Internal Resources (../en_GB/internal-*)
```

---

## 🚀 Getting Started in 3 Steps

| Step | Action | Link |
|------|--------|------|
| **1️⃣ Install** | Follow installation guide for your platform | [README](../en_GB/README) |
| **2️⃣ Run** | Start the demo and explore the UI | [Quick Start](../en_GB/QUICK_START) |
| **3️⃣ Learn** | Choose your path and dive into documentation | See [Roles](#-choose-your-path) above |

---

## 🌐 Navigation & Support

### Full Documentation Index
- **[English Navigation](../en_GB/Navigation-EN)** — Complete guide to all English documentation
- **[中文导航](Navigation-ZH)** — 完整的中文文档导航

### Community & Support
- 🐙 [GitHub Repository](https://github.com/opensynaptic/opensynaptic) — Source code and issues
- 💬 [Discussions](https://github.com/opensynaptic/opensynaptic/discussions) — Ask questions and share ideas
- 🐛 [Issue Tracker](https://github.com/opensynaptic/opensynaptic/issues) — Report bugs and request features

### Project Status
- ✅ Latest version: **v1.1.0**
- ✅ License: **MIT**
- ✅ Languages: **English & 中文**
- ✅ Platforms: **Windows, Linux, macOS**

---

<div align="center">

**Made with ❤️ for the IoT community**

[⬆ Back to top](#-opensynaptic-wiki)

</div>

