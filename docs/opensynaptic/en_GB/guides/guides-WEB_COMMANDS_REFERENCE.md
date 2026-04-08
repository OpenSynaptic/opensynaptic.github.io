# Web API Command Reference

Complete HTTP API reference for the `web_user` plugin.

Default address: **`http://127.0.0.1:8765/`**

---

## Starting the Web Server

```powershell
# Start and block (keep terminal open)
os-node web-user --cmd start -- --host 127.0.0.1 --port 8765 --block

# Or via standalone alias
os-web --cmd start -- --host 0.0.0.0 --port 8765 --block
```

Then open **`http://127.0.0.1:8765/`** for the built-in management dashboard.

---

## Authentication

Controlled by `RESOURCES.service_plugins.web_user` in `Config.json`:

| Setting | Default | Effect |
|---|---|---|
| `auth_enabled` | `false` | If `true`, all management calls require `X-Admin-Token` |
| `admin_token` | `""` | Token value to match |
| `read_only` | `false` | If `true`, all write operations return `403` |
| `management_enabled` | `true` | If `false`, management endpoints return `403` |

**Two permission tiers:**

- **Standard** — User management (`/users/*`). Token required only when `auth_enabled=true`.
- **Management** — All `/api/*` endpoints. Always requires `management_enabled=true`. When `auth_enabled=true`, also requires the token header.

**How to send the token:**

```
X-Admin-Token: your-secret-token
```

Example with `curl`:
```bash
curl -H "X-Admin-Token: mytoken" http://127.0.0.1:8765/api/plugins
```

---

## Endpoint Summary Table

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/health` | None | Service health check |
| GET | `/api/health` | None | Service health check (alias) |
| GET | `/` | None | Built-in management UI (HTML) |
| GET | `/api/dashboard` | Management | Full node snapshot |
| GET | `/api/ui/config` | Management | Read UI settings |
| PUT | `/api/ui/config` | Management + Write | Update UI settings |
| GET | `/api/config` | Management | Read config value |
| PUT | `/api/config` | Management + Write | Write config value |
| GET | `/api/options/schema` | Management | Option schema listing |
| PUT | `/api/options` | Management + Write | Batch-update options |
| GET | `/api/cli/help` | Management | CLI command table |
| GET | `/api/oscli/jobs` | Management | Job history / single job |
| GET | `/api/oscli/metrics` | Management | Execution metrics |
| POST | `/api/oscli/execute` | Management + Write | Run CLI command |
| GET | `/api/overview` | Management | Node overview |
| GET | `/api/plugins` | Management | Plugin list |
| POST | `/api/plugins` | Management + Write | Load / control plugin |
| GET | `/api/plugins/config` | Management | Plugin option schema |
| PUT | `/api/plugins/config` | Management + Write | Set plugin option |
| GET | `/api/plugins/commands` | Management | Plugin sub-commands |
| GET | `/api/plugins/visual-schema` | Management | Plugin display metadata |
| GET | `/api/transport` | Management | Transport layer status |
| POST | `/api/transport` | Management + Write | Enable / reload transport |
| GET | `/api/display/providers` | Management | Display provider list |
| GET | `/api/display/render/{section}` | Management | Render one display section |
| GET | `/api/display/all` | Management | Render all display sections |
| GET | `/api/data/packets` | Standard | List packets |
| GET | `/api/data/packets/{uuid}` | Standard | Get one packet |
| GET | `/api/data/sensors` | Standard | List sensor readings |
| GET | `/api/data/devices` | Standard | List devices |
| GET | `/users` | Standard | List users |
| POST | `/users` | Standard + Write | Create user |
| PUT | `/users/{username}` | Standard + Write | Update user |
| DELETE | `/users/{username}` | Standard + Write | Delete user |
| POST | `/api/cli/execute` | Management + Write | Legacy inline CLI (blocks) |

---

## Detailed Endpoint Reference

### GET /health · GET /api/health

No auth required. Use for uptime monitoring.

```bash
curl http://127.0.0.1:8765/health
```

Response:
```json
{
  "ok": true,
  "service": "web_user"
}
```

---

### GET /

Returns the built-in management UI as HTML. Requires `ui_enabled = true` in config.

If `ui_enabled = false`:
```json
HTTP 403
<h3>web_user UI is disabled by config: ui_enabled=false</h3>
```

---

### GET /api/dashboard

Returns a live snapshot of the node. Pass `sections` to get only specific panels.

**Query parameters:**

| Parameter | Required | Description |
|---|---|---|
| `sections` | No | Comma-separated list. Omit for all sections. |

Available sections: `identity`, `transport`, `plugins`, `pipeline`, `config`, `users`, `db`, or any plugin section.

```bash
curl http://127.0.0.1:8765/api/dashboard
curl "http://127.0.0.1:8765/api/dashboard?sections=identity,transport"
```

Response:
```json
{
  "ok": true,
  "dashboard": {
    "identity": {
      "device_id": "HUB_01",
      "assigned_id": 1,
      "version": "1.3.0",
      "timestamp": 1700000000
    },
    "transport": {
      "active_transporters": ["udp"],
      "transporters_status": { "udp": true, "tcp": false },
      "transport_status": { "quic": false },
      "physical_status": { "uart": false },
      "application_status": { "mqtt": false },
      "timestamp": 1700000000
    },
    "plugins": {
      "mount_index": ["tui", "web_user", "env_guard"],
      "runtime_index": {
        "tui": { "enabled": true, "mode": "manual", "loaded": true },
        "web_user": { "enabled": true, "mode": "manual", "loaded": true }
      },
      "timestamp": 1700000000
    },
    "pipeline": {
      "standardizer_cache_entries": 42,
      "engine_rev_unit_entries": 18,
      "fusion_ram_cache_aids": [1, 2],
      "fusion_template_count": 8,
      "timestamp": 1700000000
    },
    "db": {
      "enabled": true,
      "dialect": "sqlite",
      "timestamp": 1700000000
    }
  }
}
```

---

### GET /api/ui/config

Returns the current UI appearance settings.

```bash
curl http://127.0.0.1:8765/api/ui/config
```

Response:
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

---

### PUT /api/ui/config

Update any subset of UI appearance settings.

```bash
curl -X PUT http://127.0.0.1:8765/api/ui/config \
  -H "Content-Type: application/json" \
  -d '{"ui_theme": "router-light", "ui_compact": true, "ui_refresh_seconds": 5}'
```

Request body fields:

| Field | Type | Description |
|---|---|---|
| `ui_theme` | `str` | `"router-dark"` or `"router-light"` |
| `ui_layout` | `str` | `"sidebar"` (currently only option) |
| `ui_refresh_seconds` | `int` | Dashboard auto-refresh interval (seconds) |
| `ui_compact` | `bool` | Compact row density |
| `ui_enabled` | `bool` | Enable/disable the `/` management page |

Response:
```json
{
  "ok": true,
  "updated": { "ui_theme": "router-light", "ui_compact": true }
}
```

---

### GET /api/config

Read a config value by dot-notation key path.

**Query parameters:**

| Parameter | Required | Description |
|---|---|---|
| `key` | No | Dot path into Config.json. Omit to read everything. |

```bash
curl "http://127.0.0.1:8765/api/config?key=engine_settings.precision"
curl "http://127.0.0.1:8765/api/config?key=RESOURCES.transport_status"
curl "http://127.0.0.1:8765/api/config"
```

Response:
```json
{
  "key": "engine_settings.precision",
  "value": 6
}
```

---

### PUT /api/config

Write a single config value by key path.

```bash
curl -X PUT http://127.0.0.1:8765/api/config \
  -H "Content-Type: application/json" \
  -d '{"key": "engine_settings.precision", "value": 8, "value_type": "int"}'
```

Request body:

| Field | Required | Description |
|---|---|---|
| `key` | Yes | Dot-notation key path |
| `value` | Yes | New value (any JSON type) |
| `value_type` | No | `"str"` \| `"int"` \| `"float"` \| `"bool"` \| `"json"` (default `"json"`) |

Response:
```json
{
  "ok": true,
  "key": "engine_settings.precision",
  "value": 8
}
```

---

### GET /api/options/schema

Get all configurable option definitions, optionally filtered to writable ones only.

**Query parameters:**

| Parameter | Default | Description |
|---|---|---|
| `only_writable` | `0` | Set to `1` to return only writable fields |

```bash
curl "http://127.0.0.1:8765/api/options/schema?only_writable=1"
```

Response:
```json
{
  "ok": true,
  "schema": [
    {
      "key": "engine_settings.precision",
      "value": 6,
      "value_type": "int",
      "label": "Precision",
      "description": "Decimal precision for sensor values",
      "writable": true,
      "category": "engine"
    },
    {
      "key": "RESOURCES.service_plugins.web_user.ui_compact",
      "value": false,
      "value_type": "bool",
      "label": "Compact UI",
      "description": "Use compact row density in dashboard",
      "writable": true,
      "category": "web_user"
    }
  ]
}
```

Used by the built-in **Auto Option Studio** to auto-generate typed controls.

---

### PUT /api/options

Apply multiple option updates in a single request.

```bash
curl -X PUT http://127.0.0.1:8765/api/options \
  -H "Content-Type: application/json" \
  -d '{
    "updates": [
      {"key": "engine_settings.precision", "value": 8, "value_type": "int"},
      {"key": "RESOURCES.service_plugins.web_user.ui_compact", "value": true, "value_type": "bool"}
    ]
  }'
```

Request body:

| Field | Required | Description |
|---|---|---|
| `updates` | Yes | Array of `{key, value, value_type}` objects |

Response:
```json
{
  "ok": true,
  "updated": 2,
  "results": [
    {"key": "engine_settings.precision", "ok": true},
    {"key": "RESOURCES.service_plugins.web_user.ui_compact", "ok": true}
  ]
}
```

CLI equivalent:
```powershell
os-web --cmd options-apply -- --updates '[{"key":"engine_settings.precision","value":8,"value_type":"int"}]'
```

---

### GET /api/cli/help

Returns the full CLI command table.

```bash
curl http://127.0.0.1:8765/api/cli/help
```

Response:
```json
{
  "ok": true,
  "commands": [
    { "name": "run", "aliases": ["os-run"], "description": "Persistent run loop" },
    { "name": "tui", "aliases": ["os-tui"], "description": "Render TUI snapshot" }
  ]
}
```

---

### GET /api/oscli/jobs

List all background CLI job history, or get one job by ID.

**Query parameters:**

| Parameter | Default | Description |
|---|---|---|
| `id` | — | Job ID. If set, returns one job only. |
| `limit` | `20` | Max jobs to list (max `200`) |
| `include_output` | `0` | Set to `1` to include captured output text |
| `output_limit` | `120000` | Max output bytes (range `1000`–`2000000`) |

```bash
curl "http://127.0.0.1:8765/api/oscli/jobs?limit=5&include_output=1"
curl "http://127.0.0.1:8765/api/oscli/jobs?id=abc123"
```

Single-job response:
```json
{
  "ok": true,
  "job": {
    "id": "abc123",
    "command": "plugin-test --suite component",
    "status": "done",
    "started_at": 1700000000.0,
    "finished_at": 1700000015.0,
    "exit_code": 0,
    "output": "[PASS] 12/12 component tests"
  }
}
```

List response:
```json
{
  "ok": true,
  "jobs": [
    { "id": "abc123", "command": "plugin-test --suite component", "status": "done", "exit_code": 0 }
  ]
}
```

Job `status` values: `"queued"` · `"running"` · `"done"` · `"error"`

---

### GET /api/oscli/metrics

Returns aggregated execution statistics for all CLI jobs.

Response:
```json
{
  "ok": true,
  "metrics": {
    "total_jobs": 12,
    "running_jobs": 0,
    "failed_jobs": 2,
    "success_rate": 0.83
  }
}
```

---

### POST /api/oscli/execute

Submit an OS CLI command to run as a background job.

```bash
curl -X POST http://127.0.0.1:8765/api/oscli/execute \
  -H "Content-Type: application/json" \
  -d '{"command": "plugin-test --suite component", "background": true}'
```

Request body:

| Field | Default | Description |
|---|---|---|
| `command` | Required | CLI command line (without `os-node` prefix) |
| `background` | `true` | `true` = return immediately with job ID; `false` = wait for completion |

Response (background):
```json
{
  "ok": true,
  "job_id": "abc123",
  "status": "queued"
}
```

Response (blocking, `"background": false`):
```json
{
  "ok": true,
  "job_id": "abc123",
  "status": "done",
  "exit_code": 0,
  "output": "[PASS] 12/12 component tests"
}
```

CLI equivalent:
```powershell
os-web --cmd cli -- --line "plugin-test --suite component"
```

---

### GET /api/overview

Returns a compact full-node overview.

Response:
```json
{
  "ok": true,
  "overview": {
    "device_id": "HUB_01",
    "assigned_id": 1,
    "version": "1.3.0",
    "active_transporters": ["udp"],
    "plugins": {
      "mounted": ["tui", "web_user"],
      "loaded": ["tui", "web_user"]
    },
    "pipeline": {
      "standardizer_cache_entries": 42,
      "fusion_template_count": 8
    }
  }
}
```

---

### GET /api/plugins

Returns all mounted service plugins and their runtime status.

```bash
curl http://127.0.0.1:8765/api/plugins
```

Response:
```json
{
  "ok": true,
  "plugins": {
    "mode": "runtime",
    "mount_index": ["tui", "web_user", "env_guard"],
    "runtime_index": {
      "tui": { "enabled": true, "mode": "manual", "loaded": true },
      "web_user": { "enabled": true, "mode": "manual", "loaded": true }
    }
  },
  "items": [
    { "name": "tui", "enabled": true, "loaded": true, "mode": "manual" },
    { "name": "web_user", "enabled": true, "loaded": true, "mode": "manual" }
  ]
}
```

---

### POST /api/plugins

Control plugin state: load, enable/disable, or run a sub-command.

**Load a plugin:**
```bash
curl -X POST http://127.0.0.1:8765/api/plugins \
  -H "Content-Type: application/json" \
  -d '{"plugin": "tui", "action": "load"}'
```

**Enable/disable a plugin:**
```bash
curl -X POST http://127.0.0.1:8765/api/plugins \
  -H "Content-Type: application/json" \
  -d '{"plugin": "tui", "action": "set_enabled", "enabled": false}'
```

**Run a plugin sub-command:**
```bash
curl -X POST http://127.0.0.1:8765/api/plugins \
  -H "Content-Type: application/json" \
  -d '{"plugin": "tui", "action": "cmd", "sub_cmd": "render", "args": ["--section", "transport"]}'
```

Request body fields:

| Field | Required | Description |
|---|---|---|
| `plugin` | Yes | Plugin name (e.g. `"tui"`, `"env_guard"`) |
| `action` | No | `"load"` \| `"cmd"` \| `"set_enabled"` (default: `"load"`) |
| `enabled` | For `set_enabled` | `true` or `false` |
| `sub_cmd` | For `cmd` | Plugin sub-command name |
| `args` | For `cmd` | Array of string arguments |

Response:
```json
{ "ok": true, "plugin": "tui", "items": [...] }
```

---

### GET /api/plugins/config

Get option schema for a specific plugin.

**Query parameters:**

| Parameter | Required | Description |
|---|---|---|
| `plugin` | Yes | Plugin name (e.g. `"web_user"`) |
| `only_writable` | No (default `1`) | `1` = writable options only |

```bash
curl "http://127.0.0.1:8765/api/plugins/config?plugin=web_user"
curl "http://127.0.0.1:8765/api/plugins/config?plugin=tui&only_writable=0"
```

Response:
```json
{
  "ok": true,
  "plugin": "web_user",
  "schema": [
    {
      "key": "RESOURCES.service_plugins.web_user.ui_theme",
      "value": "router-dark",
      "value_type": "str",
      "label": "UI Theme",
      "writable": true
    }
  ]
}
```

---

### PUT /api/plugins/config

Update one or more options for a specific plugin.

```bash
curl -X PUT http://127.0.0.1:8765/api/plugins/config \
  -H "Content-Type: application/json" \
  -d '{
    "plugin": "web_user",
    "updates": [
      {"key": "RESOURCES.service_plugins.web_user.ui_compact", "value": true, "value_type": "bool"}
    ]
  }'
```

Response:
```json
{ "ok": true, "updated": 1, "results": [...] }
```

---

### GET /api/plugins/commands

Get the list of CLI sub-commands that a plugin exposes.

```bash
curl "http://127.0.0.1:8765/api/plugins/commands?plugin=tui"
```

Response:
```json
{
  "plugin": "tui",
  "commands": {
    "render": { "description": "Render a single TUI section", "args": ["--section"] },
    "interactive": { "description": "Live interactive refresh loop", "args": ["--interval"] }
  }
}
```

---

### GET /api/plugins/visual-schema

Get display metadata for all sections provided by a plugin.

```bash
curl "http://127.0.0.1:8765/api/plugins/visual-schema?plugin=opensynaptic_core"
```

Response:
```json
{
  "plugin": "opensynaptic_core",
  "sections": [
    {
      "id": "opensynaptic_core:identity",
      "display_name": "Device Identity",
      "category": "core",
      "priority": 100,
      "refresh_interval_s": 10.0,
      "supported_formats": ["json", "html", "text", "table"]
    },
    {
      "id": "opensynaptic_core:transport",
      "display_name": "Transport Status",
      "category": "core",
      "priority": 90,
      "refresh_interval_s": 3.0,
      "supported_formats": ["json", "html", "text", "table"]
    }
  ]
}
```

---

### GET /api/transport

Returns the full transport layer status across all three tiers.

```bash
curl http://127.0.0.1:8765/api/transport
```

Response:
```json
{
  "ok": true,
  "transport": {
    "active_transporters": ["udp"],
    "transporters_status": { "udp": true, "tcp": false },
    "transport_status": { "quic": false },
    "physical_status": { "uart": false, "can": false },
    "application_status": { "mqtt": false }
  },
  "items": [
    { "medium": "udp", "enabled": true, "tier": "application" }
  ]
}
```

---

### POST /api/transport

Enable/disable a transport medium, or reload its driver.

**Enable or disable:**
```bash
curl -X POST http://127.0.0.1:8765/api/transport \
  -H "Content-Type: application/json" \
  -d '{"medium": "udp", "enabled": true}'
```

**Reload driver (re-initialize):**
```bash
curl -X POST http://127.0.0.1:8765/api/transport \
  -H "Content-Type: application/json" \
  -d '{"medium": "udp", "reload": true}'
```

Response:
```json
{ "ok": true, "medium": "udp", "enabled": true }
```

---

### GET /api/display/providers

Lists all registered display providers (built-in and plugin-provided).

```bash
curl http://127.0.0.1:8765/api/display/providers
```

Response:
```json
{
  "providers": [
    {
      "plugin_name": "opensynaptic_core",
      "section_id": "identity",
      "display_name": "Device Identity",
      "category": "core",
      "priority": 100,
      "refresh_interval_s": 10.0
    },
    {
      "plugin_name": "opensynaptic_core",
      "section_id": "pipeline",
      "display_name": "Pipeline Metrics",
      "category": "core",
      "priority": 85,
      "refresh_interval_s": 2.0
    }
  ],
  "total": 6
}
```

---

### GET /api/display/render/\{section\}

Render a single display section in the requested format.

**Path:** Replace `{section}` with `{plugin_name}/{section_id}`.

Built-in sections:
- `opensynaptic_core/identity`
- `opensynaptic_core/config`
- `opensynaptic_core/transport`
- `opensynaptic_core/pipeline`
- `opensynaptic_core/plugins`
- `opensynaptic_core/db`

**Query parameters:**

| Parameter | Default | Options |
|---|---|---|
| `format` | `json` | `json` · `html` · `text` · `table` |

```bash
curl "http://127.0.0.1:8765/api/display/render/opensynaptic_core/identity"
curl "http://127.0.0.1:8765/api/display/render/opensynaptic_core/transport?format=json"
curl "http://127.0.0.1:8765/api/display/render/my_plugin/my_section?format=html"
```

Success response (JSON format, `identity` section):
```json
{
  "device_id": "HUB_01",
  "assigned_id": 1,
  "version": "1.3.0",
  "timestamp": 1700000000
}
```

Not found response (HTTP 404):
```json
{ "error": "section not found" }
```

---

### GET /api/display/all

Renders all registered display sections at once.

**Query parameters:**

| Parameter | Default | Options |
|---|---|---|
| `format` | `json` | `json` · `html` · `text` |

```bash
curl "http://127.0.0.1:8765/api/display/all"
curl "http://127.0.0.1:8765/api/display/all?format=html"
```

Response:
```json
{
  "opensynaptic_core:identity": {
    "device_id": "HUB_01",
    "assigned_id": 1,
    "version": "1.3.0",
    "timestamp": 1700000000
  },
  "opensynaptic_core:transport": {
    "active_transporters": ["udp"],
    "transporters_status": { "udp": true },
    "timestamp": 1700000000
  },
  "opensynaptic_core:pipeline": {
    "standardizer_cache_entries": 42,
    "engine_rev_unit_entries": 18,
    "fusion_ram_cache_aids": [1, 2],
    "fusion_template_count": 8,
    "timestamp": 1700000000
  },
  "opensynaptic_core:db": {
    "enabled": true,
    "dialect": "sqlite",
    "timestamp": 1700000000
  }
}
```

---

### GET /api/data/packets

Query packet history from the database. No management token required.

Database must be configured (`storage.sql.enabled = true`); returns `503` otherwise.

**Query parameters:**

| Parameter | Default | Description |
|---|---|---|
| `device_id` | — | Filter by device ID |
| `status` | — | Filter by packet status string |
| `since` | — | Unix timestamp (lower bound) |
| `until` | — | Unix timestamp (upper bound) |
| `limit` | `50` | Results per page (max `500`) |
| `offset` | `0` | Pagination offset |

```bash
curl "http://127.0.0.1:8765/api/data/packets"
curl "http://127.0.0.1:8765/api/data/packets?device_id=HUB_01&limit=10"
curl "http://127.0.0.1:8765/api/data/packets?since=1700000000&until=1700086400&status=ok"
```

Response:
```json
{
  "ok": true,
  "total": 142,
  "limit": 10,
  "offset": 0,
  "items": [
    {
      "uuid": "abc123",
      "device_id": "HUB_01",
      "received_at": 1700000000,
      "status": "ok",
      "payload": "..."
    }
  ]
}
```

---

### GET /api/data/packets/\{uuid\}

Get a single packet by UUID.

```bash
curl "http://127.0.0.1:8765/api/data/packets/abc123"
```

Success response:
```json
{
  "ok": true,
  "uuid": "abc123",
  "device_id": "HUB_01",
  "received_at": 1700000000,
  "status": "ok",
  "payload": "..."
}
```

Not found (HTTP 404):
```json
{ "ok": false, "error": "packet not found", "packet_uuid": "abc123" }
```

---

### GET /api/data/sensors

Query sensor readings from the database.

**Query parameters:**

| Parameter | Default | Description |
|---|---|---|
| `device_id` | — | Filter by device ID |
| `sensor_id` | — | Filter by sensor ID (e.g. `"V1"`, `"T1"`) |
| `since` | — | Unix timestamp lower bound |
| `until` | — | Unix timestamp upper bound |
| `limit` | `50` | Results per page (max `500`) |
| `offset` | `0` | Pagination offset |

```bash
curl "http://127.0.0.1:8765/api/data/sensors?device_id=HUB_01&sensor_id=V1&limit=100"
```

Response:
```json
{
  "ok": true,
  "total": 532,
  "limit": 100,
  "offset": 0,
  "items": [
    {
      "device_id": "HUB_01",
      "sensor_id": "V1",
      "value": 3.14,
      "unit": "Pa",
      "recorded_at": 1700000000
    }
  ]
}
```

---

### GET /api/data/devices

List all known devices.

**Query parameters:**

| Parameter | Default | Description |
|---|---|---|
| `limit` | `100` | Results per page (max `500`) |
| `offset` | `0` | Pagination offset |

```bash
curl "http://127.0.0.1:8765/api/data/devices"
```

Response:
```json
{
  "ok": true,
  "total": 5,
  "limit": 100,
  "offset": 0,
  "items": [
    {
      "device_id": "HUB_01",
      "first_seen": 1700000000,
      "last_seen": 1700100000,
      "packet_count": 142
    }
  ]
}
```

---

### GET /users

List all users. No management token required (standard auth only).

```bash
curl http://127.0.0.1:8765/users
```

Response:
```json
{
  "users": [
    { "username": "admin", "role": "admin", "enabled": true },
    { "username": "viewer", "role": "user", "enabled": true }
  ]
}
```

---

### POST /users

Create a new user.

```bash
curl -X POST http://127.0.0.1:8765/users \
  -H "Content-Type: application/json" \
  -d '{"username": "alice", "role": "user", "enabled": true}'
```

Request body:

| Field | Required | Description |
|---|---|---|
| `username` | Yes | Unique username |
| `role` | No (default `"user"`) | `"admin"` or `"user"` |
| `enabled` | No (default `true`) | Whether the account is active |

Success (HTTP 201):
```json
{ "ok": true, "username": "alice" }
```

Conflict (HTTP 409, username already exists):
```json
{ "error": "username already exists" }
```

---

### PUT /users/\{username\}

Update a user's role or enabled status.

```bash
curl -X PUT http://127.0.0.1:8765/users/alice \
  -H "Content-Type: application/json" \
  -d '{"role": "admin", "enabled": false}'
```

Request body (all fields optional):

| Field | Description |
|---|---|
| `role` | `"admin"` or `"user"` |
| `enabled` | `true` or `false` |

Response:
```json
{ "ok": true, "username": "alice" }
```

Not found (HTTP 404):
```json
{ "error": "User 'alice' not found" }
```

CLI equivalent:
```powershell
os-web --cmd update -- --username alice --role admin
os-web --cmd update -- --username alice --disable
```

---

### DELETE /users/\{username\}

Delete a user.

```bash
curl -X DELETE http://127.0.0.1:8765/users/alice
```

Response:
```json
{ "ok": true, "username": "alice" }
```

Not found (HTTP 404):
```json
{ "error": "User 'alice' not found" }
```

---

### POST /api/cli/execute

Execute a legacy inline CLI command (blocks until complete).

```bash
curl -X POST http://127.0.0.1:8765/api/cli/execute \
  -H "Content-Type: application/json" \
  -d '{"command": "status"}'
```

Response:
```json
{ "ok": true, "command": "status", "result": "..." }
```

> For long-running commands, use `POST /api/oscli/execute` with `"background": true` instead.

---

## Error Codes

| HTTP Code | Meaning |
|---|---|
| `200` | Success |
| `201` | Created (user created) |
| `400` | Bad request — missing or invalid field |
| `401` | Unauthorized — missing or invalid `X-Admin-Token` |
| `403` | Forbidden — read-only mode active, or management disabled |
| `404` | Not found |
| `409` | Conflict — duplicate username |
| `503` | Service unavailable — database not configured |

All error responses follow the shape:
```json
{ "error": "description of the problem" }
```

---

## Web Plugin CLI Commands

The same API is also accessible from the CLI without starting an HTTP server:

```powershell
os-web --cmd status
os-web --cmd dashboard
os-web --cmd list
os-web --cmd add    -- --username alice --role admin
os-web --cmd update -- --username alice --role user --disable
os-web --cmd delete -- --username alice
os-web --cmd options-schema  -- --only-writable
os-web --cmd options-set     -- --key engine_settings.precision --value 8 --type int
os-web --cmd options-apply   -- --updates '[{"key":"engine_settings.precision","value":8,"value_type":"int"}]'
os-web --cmd cli             -- --line "plugin-test --suite component"
os-web --cmd stop
```
