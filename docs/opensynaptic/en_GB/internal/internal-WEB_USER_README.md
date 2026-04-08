# web_user plugin

Web management entry for OpenSynaptic nodes. Provides a built-in dashboard, REST API, user management, plugin control, transport control, and a command console.

Default address: `http://127.0.0.1:8765/`

---

## Start the Server

```powershell
# Start from CLI (blocks until Ctrl+C)
os-node web-user --cmd start -- --host 127.0.0.1 --port 8765 --block

# Standalone alias (after install)
os-web --cmd start -- --host 127.0.0.1 --port 8765 --block

# Start in background (returns immediately)
os-node web-user --cmd start -- --host 0.0.0.0 --port 8765
```

Open `http://127.0.0.1:8765/` for the built-in management dashboard.

---

## Authentication

| Config key | Default | Description |
|---|---|---|
| `auth_enabled` | `false` | If `true`, management API calls require `X-Admin-Token` header |
| `admin_token` | `""` | Required token value |
| `read_only` | `false` | If `true`, all write operations return `403` |
| `management_enabled` | `true` | If `false`, all `/api/*` management endpoints return `403` |

Send the token as a request header:
```
X-Admin-Token: your-secret-token
```

---

## API Endpoint Quick Reference

### Health

| Method | Path | Auth | Returns |
|---|---|---|---|
| GET | `/health` | None | `{"ok": true, "service": "web_user"}` |
| GET | `/api/health` | None | Same as above |

### Dashboard and Overview

| Method | Path | Auth | Query params |
|---|---|---|---|
| GET | `/api/dashboard` | Mgmt | `sections=identity,transport` (optional) |
| GET | `/api/overview` | Mgmt | — |

`/api/dashboard` response:
```json
{
  "ok": true,
  "dashboard": {
    "identity": { "device_id": "HUB_01", "assigned_id": 1, "version": "1.3.1", "timestamp": 1700000000 },
    "transport": { "active_transporters": ["udp"], "transporters_status": {"udp": true}, "timestamp": 1700000000 },
    "pipeline": { "standardizer_cache_entries": 42, "fusion_template_count": 8, "timestamp": 1700000000 },
    "plugins": { "mount_index": ["tui", "web_user"], "runtime_index": {"tui": {"loaded": true}}, "timestamp": 1700000000 },
    "db": { "enabled": true, "dialect": "sqlite", "timestamp": 1700000000 }
  }
}
```

### Config

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/api/config?key=a.b.c` | Mgmt | Read one config key (dot path) |
| PUT | `/api/config` | Mgmt + Write | Write one config key |
| GET | `/api/options/schema?only_writable=1` | Mgmt | Full option schema |
| PUT | `/api/options` | Mgmt + Write | Batch-update options |

`PUT /api/config` body:
```json
{ "key": "engine_settings.precision", "value": 8, "value_type": "int" }
```

`PUT /api/options` body:
```json
{
  "updates": [
    { "key": "engine_settings.precision", "value": 8, "value_type": "int" },
    { "key": "RESOURCES.service_plugins.web_user.ui_compact", "value": true, "value_type": "bool" }
  ]
}
```

### UI Settings

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/api/ui/config` | Mgmt | Read UI appearance settings |
| PUT | `/api/ui/config` | Mgmt + Write | Update UI appearance settings |

`GET /api/ui/config` response:
```json
{
  "ok": true,
  "ui": {
    "ui_enabled": true,
    "ui_theme": "router-dark",
    "ui_layout": "sidebar",
    "ui_refresh_seconds": 3,
    "ui_compact": false
  }
}
```

### Jobs (OS CLI)

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/api/oscli/jobs` | Mgmt | List jobs; `?id=` for single; `?include_output=1` for output |
| GET | `/api/oscli/metrics` | Mgmt | Aggregate execution metrics |
| POST | `/api/oscli/execute` | Mgmt + Write | Submit CLI command as background job |

`POST /api/oscli/execute` body:
```json
{ "command": "plugin-test --suite component", "background": true }
```

Response:
```json
{ "ok": true, "job_id": "abc123", "status": "queued" }
```

### Plugins

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/api/plugins` | Mgmt | List all plugins + runtime state |
| POST | `/api/plugins` | Mgmt + Write | Load, enable/disable, or run sub-command |
| GET | `/api/plugins/config?plugin=NAME` | Mgmt | Plugin option schema |
| PUT | `/api/plugins/config` | Mgmt + Write | Update plugin option |
| GET | `/api/plugins/commands?plugin=NAME` | Mgmt | Plugin sub-command list |
| GET | `/api/plugins/visual-schema?plugin=NAME` | Mgmt | Plugin display metadata |

`POST /api/plugins` — load:
```json
{ "plugin": "tui", "action": "load" }
```

`POST /api/plugins` — enable/disable:
```json
{ "plugin": "tui", "action": "set_enabled", "enabled": false }
```

`POST /api/plugins` — run sub-command:
```json
{ "plugin": "tui", "action": "cmd", "sub_cmd": "render", "args": ["--section", "transport"] }
```

### Transport

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/api/transport` | Mgmt | All transport layer status |
| POST | `/api/transport` | Mgmt + Write | Enable/disable or reload a medium |

`GET /api/transport` response:
```json
{
  "ok": true,
  "transport": {
    "active_transporters": ["udp"],
    "transporters_status": { "udp": true, "tcp": false },
    "transport_status": { "quic": false },
    "physical_status": { "uart": false },
    "application_status": { "mqtt": false }
  },
  "items": [{ "medium": "udp", "enabled": true }]
}
```

`POST /api/transport` — enable:
```json
{ "medium": "udp", "enabled": true }
```

`POST /api/transport` — reload driver:
```json
{ "medium": "udp", "reload": true }
```

### Display API

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/api/display/providers` | Mgmt | List all registered display providers |
| GET | `/api/display/render/{section}` | Mgmt | Render one section; `?format=json\|html\|text` |
| GET | `/api/display/all` | Mgmt | Render all sections; `?format=json\|html` |

Built-in section paths: `opensynaptic_core/identity`, `opensynaptic_core/config`, `opensynaptic_core/transport`, `opensynaptic_core/pipeline`, `opensynaptic_core/plugins`, `opensynaptic_core/db`.

### Data Query API

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/api/data/packets` | Standard | Query historical packets |
| GET | `/api/data/packets/{uuid}` | Standard | Get one packet by UUID |
| GET | `/api/data/sensors` | Standard | Query sensor readings |
| GET | `/api/data/devices` | Standard | List known devices |

`GET /api/data/packets` query parameters: `device_id`, `status`, `since`, `until`, `limit` (max 500), `offset`.

`GET /api/data/sensors` query parameters: `device_id`, `sensor_id`, `since`, `until`, `limit`, `offset`.

### User Management

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/users` | Standard | List users |
| POST | `/users` | Standard + Write | Create user |
| PUT | `/users/{username}` | Standard + Write | Update role or enabled flag |
| DELETE | `/users/{username}` | Standard + Write | Delete user |

`POST /users` body:
```json
{ "username": "alice", "role": "user", "enabled": true }
```

`PUT /users/alice` body:
```json
{ "role": "admin", "enabled": false }
```

`GET /users` response:
```json
{
  "users": [
    { "username": "admin", "role": "admin", "enabled": true },
    { "username": "alice", "role": "user", "enabled": true }
  ]
}
```

### Legacy Execute

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/cli/execute` | Mgmt + Write | Run CLI command inline (blocks) |

```json
{ "command": "status" }
```

---

## UI Config Keys

Set via CLI or HTTP under `RESOURCES.service_plugins.web_user`:

| Key | Type | Default | Description |
|---|---|---|---|
| `ui_enabled` | bool | `true` | Enable/disable the `/` management page |
| `ui_theme` | str | `"router-dark"` | `"router-dark"` or `"router-light"` |
| `ui_layout` | str | `"sidebar"` | `"sidebar"` (only current option) |
| `ui_refresh_seconds` | int | `3` | Dashboard auto-refresh interval |
| `ui_compact` | bool | `false` | Compact row density |

The built-in **Auto Option Studio** reads `/api/options/schema` and auto-generates typed controls:

- `bool` → toggle selector
- `int` / `float` → numeric input with step
- `str` → text input
- `json` → JSON textarea

The built-in **Command Console** executes OS CLI commands through `/api/oscli/execute` and shows real-time job output.

---

## Plugin CLI Commands

```powershell
# Server control
os-web --cmd start   -- --host 127.0.0.1 --port 8765 --block
os-web --cmd stop
os-web --cmd status

# Read information
os-web --cmd dashboard
os-web --cmd list                         # list users

# User management
os-web --cmd add    -- --username alice --role admin
os-web --cmd update -- --username alice --role user --disable
os-web --cmd delete -- --username alice

# Option control
os-web --cmd options-schema  -- --only-writable
os-web --cmd options-set     -- --key engine_settings.precision --value 8 --type int
os-web --cmd options-apply   -- --updates '[{"key":"engine_settings.precision","value":8,"value_type":"int"}]'

# Execute CLI command through web plugin
os-web --cmd cli -- --line "plugin-test --suite component"
```

---

## Full API Reference

For complete request/response schemas and all query parameters, see:

→ [Web API Command Reference](../guides/guides-WEB_COMMANDS_REFERENCE)

