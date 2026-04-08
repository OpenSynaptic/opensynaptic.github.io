# Quick Start

Get an OpenSynaptic node running in under 5 minutes.

---

## Prerequisites

| Requirement | Version |
|---|---|
| Python | 3.10 or later |
| OS | Windows 10/11, Linux, macOS |
| Disk space | ~50 MB |

---

## Step 1 — Clone and Install

```powershell
git clone https://github.com/OpenSynaptic/OpenSynaptic.git
cd OpenSynaptic
pip install -e .
```

Verify installation:
```powershell
os-node --help
```

---

## Step 2 — Run the Demo (One Command)

The `demo` command starts a local virtual sensor loop and opens the web dashboard automatically:

```powershell
os-node demo --open-browser
```

This will:
1. Create a temporary `Config.json` in memory (no files written)
2. Start the `web_user` plugin at `http://127.0.0.1:8765/`
3. Generate virtual sensor packets (temperature, pressure, voltage) every 2 seconds
4. Open your browser to the management dashboard

You should see the live dashboard with panels for device identity, transport status, pipeline metrics, and plugin state.

Press `Ctrl+C` to stop.

---

## Step 3 — Create a Persistent Config

Use the wizard to generate a `Config.json` for a real node:

```powershell
os-node wizard
```

Or use defaults immediately:
```powershell
os-node init --default
```

This creates `Config.json` in the current directory with safe defaults:

```json
{
  "device_id": "MY_NODE_01",
  "VERSION": "1.3.1",
  "engine_settings": { "precision": 6 },
  "RESOURCES": {
    "transporters_status": { "udp": true },
    "service_plugins": {
      "web_user": { "enabled": true, "port": 8765 }
    }
  }
}
```

---

## Step 4 — Start the Node

```powershell
os-node run --config Config.json
```

The node runs indefinitely, sending heartbeats and processing sensor data.

For a one-shot test cycle:
```powershell
os-node run --config Config.json --once
```

---

## Step 5 — Start the Web Dashboard

```powershell
os-node web-user --cmd start -- --host 127.0.0.1 --port 8765 --block
```

Then open **`http://127.0.0.1:8765/`** in your browser.

Alternatively use the standalone alias:
```powershell
os-web --cmd start -- --host 127.0.0.1 --port 8765 --block
```

---

## Step 6 — Send a Sensor Reading

```powershell
os-node transmit --config Config.json --sensor-id V1 --value 3.14 --unit Pa --medium UDP
```

This encodes the reading through the full pipeline (standardize → compress → fuse → send) and dispatches it via UDP.

---

## Step 7 — View Node Status in the Terminal

```powershell
# Full snapshot across all sections
os-node tui --config Config.json

# Single section (identity, config, transport, pipeline, plugins, db)
os-node tui --config Config.json --section transport

# Live interactive mode (Ctrl+C to stop)
os-node tui --config Config.json --interactive --interval 2.0
```

---

## Step 8 — Inspect and Edit Config

```powershell
# View all config
os-node config-show --config Config.json

# Read one key
os-node config-get --config Config.json --key engine_settings.precision

# Write a value
os-node config-set --config Config.json --key engine_settings.precision --value 8 --type int

# Write a sub-object in one command
os-node config-set --config Config.json --key RESOURCES.transport_config.quic \
  --value '{"port":4433,"timeout":3.0}' --type json
```

---

## Common Command Reference

| Goal | Command |
|---|---|
| One-command demo with browser | `os-node demo --open-browser` |
| Generate config with wizard | `os-node wizard` |
| Generate config with defaults | `os-node init --default` |
| Run node loop | `os-node run --config Config.json` |
| One-cycle test run | `os-node run --config Config.json --once` |
| TUI snapshot | `os-node tui --config Config.json` |
| TUI live mode | `os-node tui --config Config.json --interactive` |
| Start web dashboard | `os-web --cmd start -- --host 0.0.0.0 --port 8765 --block` |
| Send a sensor value | `os-node transmit --config Config.json --sensor-id S1 --value 1.0 --unit Pa --medium UDP` |
| Enable a transporter | `os-node transporter-toggle --config Config.json --name udp --enable` |
| List plugins | `os-node plugin-list --config Config.json` |
| Check native libs | `os-node native-check` |
| Build native libs | `os-node native-build` |

---

## If Native Libraries Are Missing

On first run, the node will attempt to build native C bindings automatically. If the build fails (e.g. no C compiler), you see a structured error and the node falls back to Python-only mode.

Manual fallback:
```powershell
os-node native-check         # diagnose environment
os-node native-build         # attempt build with progress output
```

---

## What To Do Next

| I want to... | Go to... |
|---|---|
| Understand the full CLI | [internal/CLI Reference](internal/internal-CLI_README) |
| Use the Web API from scripts | [guides/Web API Reference](guides/guides-WEB_COMMANDS_REFERENCE) |
| Understand TUI sections | [guides/TUI Quick Reference](guides/guides-TUI_QUICK_REFERENCE) |
| Build a plugin | [plugins/Plugin Starter Kit](plugins/plugins-PLUGIN_STARTER_KIT) |
| Add a new transport protocol | [TRANSPORTER_PLUGIN.md](TRANSPORTER_PLUGIN) |
| Understand the architecture | [ARCHITECTURE.md](ARCHITECTURE) |
| View API reference | [API.md](API) |

   - [reports/CHANGELOG.md](reports/reports-CHANGELOG_2026M03_24)
   - [reports/CODE_CHANGES_SUMMARY.md](reports/reports-CODE_CHANGES_SUMMARY)

---

## Need Help?

- Full index: [INDEX.md](/docs/index)
- Documentation hub: [README.md](/docs/readme)
- Project root readme: [Repository README](https://github.com/opensynaptic/opensynaptic/blob/main/README.md)

_Last updated: 2026-04-02 (local workspace)_

