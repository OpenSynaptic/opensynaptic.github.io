# TUI Quick Reference

The TUI (Text-based User Interface) shows live node status in the terminal. It's driven by the Display API and supports both snapshot and interactive modes.

---

## Commands

```powershell
# Snapshot: print all sections once and exit
os-node tui --config Config.json

# Snapshot: print one specific section and exit
os-node tui --config Config.json --section transport

# Interactive live mode (refreshes every 2 seconds, Ctrl+C to stop)
os-node tui --config Config.json --interactive

# Interactive live mode with faster refresh and specific section
os-node tui --config Config.json --interactive --section pipeline --interval 1.0

# Route through plugin-cmd (same result)
os-node plugin-cmd --config Config.json --plugin tui --cmd render
os-node plugin-cmd --config Config.json --plugin tui --cmd render -- --section transport
os-node plugin-cmd --config Config.json --plugin tui --cmd interactive -- --interval 2.0
```

---

## Section Reference

Pass `--section <name>` to render a single panel. Omit `--section` to render all panels at once.

### `identity` — Device Identity

Shows the node's device ID, assigned numeric ID, and software version.

```json
{
  "device_id": "HUB_01",
  "assigned_id": 1,
  "version": "1.3.0",
  "timestamp": 1700000000
}
```

| Field | Type | Description |
|---|---|---|
| `device_id` | string | Human-readable device identifier from Config.json |
| `assigned_id` | integer or null | Numeric ID assigned by the server (null until `ensure-id` succeeds) |
| `version` | string | Software version string |
| `timestamp` | integer | Unix timestamp when the snapshot was taken |

---

### `config` — Configuration

Shows the four main configuration blocks from `Config.json`.

```json
{
  "engine_settings": {
    "precision": 6,
    "float_base": 1000000
  },
  "payload_switches": {
    "enable_compression": true,
    "enable_crc16": true
  },
  "opensynaptic_setting": {
    "heartbeat_interval": 30
  },
  "security_settings": {
    "drop_on_crc16_failure": true,
    "whitelist_enabled": false
  },
  "timestamp": 1700000000
}
```

| Field | Description |
|---|---|
| `engine_settings` | Processing precision, float precision base |
| `payload_switches` | Enable/disable compression, CRC, encryption flags |
| `opensynaptic_setting` | Protocol heartbeat and timing settings |
| `security_settings` | Packet filtering and security controls |

---

### `transport` — Transport Status

Shows the active transporter list and the status map for all three transport tiers.

```json
{
  "active_transporters": ["udp"],
  "transporters_status": {
    "udp": true,
    "tcp": false,
    "lora": false
  },
  "transport_status": {
    "quic": false,
    "websocket": false
  },
  "physical_status": {
    "uart": false,
    "can": false,
    "rs485": false
  },
  "application_status": {
    "mqtt": false,
    "matter": false
  },
  "timestamp": 1700000000
}
```

| Field | Description |
|---|---|
| `active_transporters` | Currently live transporter names (actively sending/receiving) |
| `transporters_status` | Application-layer transporter enable switches |
| `transport_status` | Network transport layer enable switches (e.g. QUIC, WebSocket) |
| `physical_status` | Physical medium enable switches (e.g. UART, CAN) |
| `application_status` | Protocol bridge enable switches (e.g. MQTT, Matter) |

To enable a transporter:
```powershell
os-node transporter-toggle --config Config.json --name udp --enable
```

---

### `pipeline` — Pipeline Metrics

Shows internal processing pipeline counters.

```json
{
  "standardizer_cache_entries": 42,
  "engine_rev_unit_entries": 18,
  "fusion_ram_cache_aids": [1, 2, 7],
  "fusion_template_count": 8,
  "timestamp": 1700000000
}
```

| Field | Description |
|---|---|
| `standardizer_cache_entries` | Number of unit conversion rules cached by the Standardizer |
| `engine_rev_unit_entries` | Number of reverse-lookup unit symbols loaded in the Engine |
| `fusion_ram_cache_aids` | List of assigned IDs (AIDs) with Fusion template data in RAM |
| `fusion_template_count` | Total sensor template definitions across all Fusion cache entries |

High counts indicate normal operation after a warm-up period. Zero values may indicate cold start or unconfigured device.

---

### `plugins` — Plugin Status

Shows all service plugins and their runtime state.

```json
{
  "mount_index": ["tui", "web_user", "env_guard", "dependency_manager"],
  "runtime_index": {
    "tui": { "enabled": true, "mode": "manual", "loaded": true },
    "web_user": { "enabled": true, "mode": "manual", "loaded": true },
    "env_guard": { "enabled": true, "mode": "manual", "loaded": false }
  },
  "timestamp": 1700000000
}
```

| Field | Description |
|---|---|
| `mount_index` | All plugins that are mounted (registered with ServiceManager) |
| `runtime_index` | Per-plugin runtime state: `enabled`, `mode`, `loaded` |

`loaded: true` means `auto_load()` has been called on this plugin. `mode` is either `"manual"` (started on demand) or `"auto"` (started at node boot).

---

### `db` — Database Status

Shows whether the database backend is configured and active.

```json
{
  "enabled": true,
  "dialect": "sqlite",
  "timestamp": 1700000000
}
```

| Field | Description |
|---|---|
| `enabled` | `true` if a database driver is configured and connected |
| `dialect` | `"sqlite"` · `"postgresql"` · `"mysql"` · `null` (not configured) |

To enable SQLite:
```json
// Config.json → storage.sql
{
  "enabled": true,
  "driver": "sqlite",
  "path": "data/my_node.db"
}
```

---

## Plugin Display Sections

Plugins can register additional display sections using the Display API. These appear as `{plugin_name}:{section_id}` and can be rendered alongside built-in sections.

Discover available sections:
```bash
curl http://127.0.0.1:8765/api/display/providers
```

Render a plugin section via TUI:
```powershell
os-node tui --config Config.json --section my_plugin:my_section
```

Render a plugin section via HTTP:
```bash
curl "http://127.0.0.1:8765/api/display/render/my_plugin/my_section"
```

---

## Interactive Mode Controls

When `--interactive` is active:

| Key | Action |
|---|---|
| `Ctrl+C` | Stop and exit |

Use `--interval N` to set the refresh rate in seconds (e.g. `--interval 0.5` for 500 ms).

```powershell
os-node tui --config Config.json --interactive --interval 0.5
```

Use `--duration N` to auto-stop after N seconds:

```powershell
os-node tui --config Config.json --interactive --interval 2.0 --duration 30
```

---

## Flags Summary

| Flag | Default | Description |
|---|---|---|
| `--config` | auto-detect | Path to `Config.json` |
| `--section` | all | Section name to render. See section reference above. |
| `--interactive` | off | Enable live-refresh mode |
| `--interval` | `2.0` | Refresh interval in seconds (interactive mode) |
| `--duration` | `0` | Stop after N seconds; `0` = unlimited |
| `--quiet` | off | Suppress INFO log lines in output |

---

## Web API Equivalents

Every TUI section is also accessible via the HTTP API when `web_user` is running:

| TUI section | HTTP endpoint |
|---|---|
| `identity` | `GET /api/display/render/opensynaptic_core/identity` |
| `config` | `GET /api/display/render/opensynaptic_core/config` |
| `transport` | `GET /api/display/render/opensynaptic_core/transport` |
| `pipeline` | `GET /api/display/render/opensynaptic_core/pipeline` |
| `plugins` | `GET /api/display/render/opensynaptic_core/plugins` |
| `db` | `GET /api/display/render/opensynaptic_core/db` |
| All at once | `GET /api/display/all` |
| Dashboard view | `GET /api/dashboard` |
