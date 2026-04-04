# OpenSynaptic Documentation Hub

Use this page as the main entry point for repository documentation.

> **🌐 Multi-Language Support**: [English](README) | [简体中文](../zh_CN/README) | [完整索引](index.html)

**Snapshot date**: 2026-04-02 (local workspace)  
**Total docs under `docs/`**: rolling; see [INDEX.md](INDEX) for current inventory

---

## Quick Navigation

### Runtime Quick Start (validated)
1. Install: `pip install -e .`
2. Windows direct-start: `./run-main.cmd run --once --quiet`
3. Generic entrypoint: `os-node run --once --quiet`
4. First-run native recovery behavior: [../README.md#first-run-native-auto-repair](README#first-run-native-auto-repair)

### Start Here
1. [../README.md](README) - Project overview and installation.
2. [ARCHITECTURE.md](ARCHITECTURE) - System architecture and pipeline.
3. [plugins/PLUGIN_STARTER_KIT.md](plugins-PLUGIN_STARTER_KIT) - Plugin starter workflow.

### Core References

**Architecture and Design**
- [ARCHITECTURE.md](ARCHITECTURE)
- [architecture/](architecture-)

**API and Configuration**
- [API.md](API)
- [CORE_API.md](CORE_API)
- [CONFIG_SCHEMA.md](CONFIG_SCHEMA)
- [api/](api-)

**Python and Rust Integration**
- [PYCORE_RUST_API.md](PYCORE_RUST_API)
- [RSCORE_API.md](RSCORE_API)

### Plugins and Features

**Plugin Development**
- [plugins/PLUGIN_DEVELOPMENT_SPECIFICATION.md](plugins-PLUGIN_DEVELOPMENT_SPECIFICATION)
- [plugins/PLUGIN_DEVELOPMENT_SPECIFICATION_2026.md](plugins-PLUGIN_DEVELOPMENT_SPECIFICATION_2026)
- [plugins/PLUGIN_QUICK_REFERENCE.md](plugins-PLUGIN_QUICK_REFERENCE)
- [plugins/](plugins-)

**Feature References**
- [TRANSPORTER_PLUGIN.md](TRANSPORTER_PLUGIN)
- [ID_LEASE_SYSTEM.md](ID_LEASE_SYSTEM)
- [ID_LEASE_CONFIG_REFERENCE.md](ID_LEASE_CONFIG_REFERENCE)
- [features/](features-)

### Guides and Tutorials
- [guides/DISPLAY_API_GUIDE.md](guides-DISPLAY_API_GUIDE)
- [guides/DISPLAY_API_QUICKSTART.md](guides-DISPLAY_API_QUICKSTART)
- [guides/QUICK_REFERENCE.md](guides-QUICK_REFERENCE)
- [guides/WEB_COMMANDS_REFERENCE.md](guides-WEB_COMMANDS_REFERENCE)
- [guides/TUI_QUICK_REFERENCE.md](guides-TUI_QUICK_REFERENCE)
- [guides/](guides-)

### Reports and Change Tracking
- [reports/CHANGELOG.md](reports-CHANGELOG)
- [reports/CHANGELOG_2026M03_24.md](reports-CHANGELOG_2026M03_24)
- [reports/DOC_FRESHNESS_AUDIT_2026-04-02.md](reports-DOC_FRESHNESS_AUDIT_2026-04-02)
- [reports/root/](reports-root-)
- [reports/IMPLEMENTATION_COMPLETE.md](reports-IMPLEMENTATION_COMPLETE)
- [reports/COMPREHENSIVE_COMPLETION_SUMMARY.md](reports-COMPREHENSIVE_COMPLETION_SUMMARY)
- [reports/](reports-)

### Release Operations
- [releases/RELEASE_CHECKLIST.md](releases-RELEASE_CHECKLIST)
- [releases/RELEASE_1_1_0_RC1_COMPLETE.md](releases-RELEASE_1_1_0_RC1_COMPLETE)

### Internal Documentation
- [internal/AGENTS.md](internal-AGENTS)
- [internal/](internal-)

---

## Browse by Category

| Category | Path | File Count |
|---|---|---:|
| Architecture | [architecture/](architecture-) | 4 |
| API | [api/](api-) | 2 |
| Features | [features/](features-) | 5 |
| Plugins | [plugins/](plugins-) | 10 |
| Guides | [guides/](guides-) | 11 |
| Reports | [reports/](reports-) | 36 |
| Internal | [internal/](internal-) | 12 |
| Releases | [releases/](releases-) | 11 |

---

## Common Tasks

- Build a plugin: [plugins/PLUGIN_DEVELOPMENT_SPECIFICATION.md](plugins-PLUGIN_DEVELOPMENT_SPECIFICATION)
- Understand architecture: [ARCHITECTURE.md](ARCHITECTURE)
- Integrate API: [API.md](API)
- Configure runtime: [CONFIG_SCHEMA.md](CONFIG_SCHEMA)
- Tune performance: [reports/PERFORMANCE_OPTIMIZATION_REPORT.md](reports-PERFORMANCE_OPTIMIZATION_REPORT)
- Review bug fixes: [reports/BUG_FIX_REPORT.md](reports-BUG_FIX_REPORT)

---

## Maintenance Rules

- Keep English as the canonical language for maintained docs.
- Keep topic docs in `docs/`; keep snapshots in `docs/releases/`.
- Keep process/status notes in `docs/internal/`.
- Prefer linking to canonical pages instead of duplicating content.
- Keep command examples executable and tagged as `powershell`.

For full navigation, see [INDEX.md](INDEX).

