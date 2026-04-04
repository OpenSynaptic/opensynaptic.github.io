# Quick Documentation Finder

Use this page to quickly jump to the right document set.

---

## Runtime First Start

Use one of the following commands to start `main` directly:

```powershell
# Windows shortcut (no Activate.ps1 required)
.\run-main.cmd run --once --quiet

# Installed entrypoint
os-node run --once --quiet
```

If native runtime libraries are missing on first run, startup will auto-attempt native build once and retry node creation.
Manual fallback:

```powershell
os-node native-check
os-node native-build
```

---

## I am..., I want...

### New Developer
- Fast onboarding -> [plugins/PLUGIN_STARTER_KIT.md](plugins/plugins-PLUGIN_STARTER_KIT)
- Understand architecture -> [ARCHITECTURE.md](ARCHITECTURE)
- Build first plugin -> [plugins/PLUGIN_DEVELOPMENT_SPECIFICATION.md](plugins/plugins-PLUGIN_DEVELOPMENT_SPECIFICATION)

### Plugin Developer
- Development spec -> [plugins/PLUGIN_DEVELOPMENT_SPECIFICATION_2026.md](plugins/plugins-PLUGIN_DEVELOPMENT_SPECIFICATION_2026)
- Quick reference -> [plugins/PLUGIN_QUICK_REFERENCE_2026.md](plugins/plugins-PLUGIN_QUICK_REFERENCE_2026)
- Transporter integration -> [TRANSPORTER_PLUGIN.md](TRANSPORTER_PLUGIN)
- Practical code samples -> [plugins/PLUGIN_HIJACKING_PRACTICAL_CODE.md](plugins/plugins-PLUGIN_HIJACKING_PRACTICAL_CODE)

### API Integrator
- API overview -> [API.md](API)
- Display API guide -> [guides/DISPLAY_API_GUIDE.md](guides/guides-DISPLAY_API_GUIDE)
- Display API quickstart -> [guides/DISPLAY_API_QUICKSTART.md](guides/guides-DISPLAY_API_QUICKSTART)
- Config schema -> [CONFIG_SCHEMA.md](CONFIG_SCHEMA)

### System Operator
- Runtime configuration -> [CONFIG_SCHEMA.md](CONFIG_SCHEMA)
- ID lease system -> [ID_LEASE_SYSTEM.md](ID_LEASE_SYSTEM)
- ID lease config reference -> [ID_LEASE_CONFIG_REFERENCE.md](ID_LEASE_CONFIG_REFERENCE)
- Web command reference -> [guides/WEB_COMMANDS_REFERENCE.md](guides/guides-WEB_COMMANDS_REFERENCE)
- TUI quick reference -> [guides/TUI_QUICK_REFERENCE.md](guides/guides-TUI_QUICK_REFERENCE)

### Performance Engineer
- Optimization report -> [reports/PERFORMANCE_OPTIMIZATION_REPORT.md](reports/reports-PERFORMANCE_OPTIMIZATION_REPORT)
- Final performance summary -> [reports/FINAL_PERFORMANCE_REPORT.md](reports/reports-FINAL_PERFORMANCE_REPORT)
- Architecture evolution analysis -> [architecture/ARCHITECTURE_EVOLUTION_COMPARISON.md](architecture/architecture-ARCHITECTURE_EVOLUTION_COMPARISON)

### Troubleshooting
- Bug fix notes -> [reports/BUG_FIX_REPORT.md](reports/reports-BUG_FIX_REPORT)
- Module import fix -> [internal/FIX_ModuleNotFoundError.md](internal/internal-FIX_ModuleNotFoundError)
- Web command fix -> [internal/WEB_COMMAND_FIX.md](internal/internal-WEB_COMMAND_FIX)
- All reports -> [reports/](reports/reports-CODE_CHANGES_SUMMARY)

### Architect / Maintainer
- Architecture -> [ARCHITECTURE.md](ARCHITECTURE)
- Core API -> [CORE_API.md](CORE_API)
- FFI analysis -> [architecture/ARCHITECTURE_FFI_ANALYSIS.md](architecture/architecture-ARCHITECTURE_FFI_ANALYSIS)
- Documentation structure -> [DOCUMENT_ORGANIZATION.md](DOCUMENT_ORGANIZATION)

---

## Category Overview

- Architecture and design -> `docs/architecture/`
- API references -> root docs + `docs/api/`
- Feature guides -> `docs/features/`
- Plugin development -> `docs/plugins/`
- User/developer guides -> `docs/guides/`
- Reports and logs -> `docs/reports/`
- Internal notes -> `docs/internal/`

---

## Typical Workflows

1. Start plugin development:
   - [plugins/PLUGIN_STARTER_KIT.md](plugins/plugins-PLUGIN_STARTER_KIT)
   - [plugins/PLUGIN_DEVELOPMENT_SPECIFICATION_2026.md](plugins/plugins-PLUGIN_DEVELOPMENT_SPECIFICATION_2026)
   - [plugins/PLUGIN_QUICK_REFERENCE_2026.md](plugins/plugins-PLUGIN_QUICK_REFERENCE_2026)
2. Understand system internals:
   - [README.md](/docs/readme)
   - [ARCHITECTURE.md](ARCHITECTURE)
   - [CORE_API.md](CORE_API)
3. Integrate APIs:
   - [API.md](API)
   - [guides/DISPLAY_API_GUIDE.md](guides/guides-DISPLAY_API_GUIDE)
   - [CONFIG_SCHEMA.md](CONFIG_SCHEMA)
4. Track changes:
   - [reports/CHANGELOG.md](reports/reports-CHANGELOG_2026M03_24)
   - [reports/CODE_CHANGES_SUMMARY.md](reports/reports-CODE_CHANGES_SUMMARY)

---

## Need Help?

- Full index: [INDEX.md](/docs/index)
- Documentation hub: [README.md](/docs/readme)
- Project root readme: [Repository README](https://github.com/opensynaptic/opensynaptic/blob/main/README.md)

_Last updated: 2026-04-02 (local workspace)_

