---
sidebar_label: 'v1.3.0 / v1.3.1 Release Notes'
sidebar_position: 10
---

# OpenSynaptic v1.3.0 / v1.3.1 Release Notes

> Release Date: 2026-04-07 (v1.3.0) / 2026-04-08 (v1.3.1)

---

## v1.3.1 — Data Query REST API

v1.3.1 is a minor feature release on top of v1.3.0. It adds a complete read-only
HTTP data query layer over the existing SQL storage tables.

### New: Data Query REST API

Four new GET endpoints are available on the `web_user` service (default `127.0.0.1:8765`):

| Endpoint | Description |
|----------|-------------|
| `GET /api/data/devices` | List all known devices with `last_seen` timestamp and `packet_count`. |
| `GET /api/data/packets` | Paginated packet listing with filters. |
| `GET /api/data/packets/{uuid}` | Single packet detail with full sensor array. |
| `GET /api/data/sensors` | Paginated sensor readings joined with packet metadata. |

**Authentication:** All endpoints honour the standard `X-Admin-Token` header when
`auth_enabled = true` in the `web_user` service config.

**Unavailable DB:** Returns `503` with `{"ok": false, "error": "database not configured"}`
when no SQL backend is configured.

#### Query Parameters

**`GET /api/data/packets`**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `device_id` | string | — | Filter by device ID |
| `status` | string | — | Filter by `device_status` |
| `since` | integer | — | Unix epoch lower bound (inclusive) |
| `until` | integer | — | Unix epoch upper bound (inclusive) |
| `limit` | integer | `50` | Max rows (1–500) |
| `offset` | integer | `0` | Pagination offset |

**`GET /api/data/sensors`**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `device_id` | string | — | Filter by device ID |
| `sensor_id` | string | — | Filter by sensor identifier |
| `since` | integer | — | Unix epoch lower bound |
| `until` | integer | — | Unix epoch upper bound |
| `limit` | integer | `50` | Max rows (1–500) |
| `offset` | integer | `0` | Pagination offset |

**`GET /api/data/devices`**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `limit` | integer | `100` | Max rows (1–500) |
| `offset` | integer | `0` | Pagination offset |

#### Example Response — `/api/data/devices`

```json
{
  "ok": true,
  "devices": [
    { "device_id": "DEV_A", "last_seen": 1710000200, "packet_count": 2 },
    { "device_id": "DEV_B", "last_seen": 1710000300, "packet_count": 1 }
  ],
  "total": 2,
  "limit": 100,
  "offset": 0
}
```

#### Example Response — `/api/data/packets/{uuid}`

```json
{
  "ok": true,
  "packet": {
    "packet_uuid": "a1b2c3d4-...",
    "device_id": "DEV_A",
    "device_status": "ONLINE",
    "timestamp_raw": 1710000200,
    "payload_json": { "id": "DEV_A", "s": "ONLINE", "t": 1710000200 },
    "created_at": 1710000201
  },
  "sensors": [
    {
      "sensor_index": 1,
      "sensor_id": "TEMP",
      "sensor_status": "OK",
      "normalized_value": 23.1,
      "normalized_unit": "Cel"
    }
  ]
}
```

### New: `DatabaseManager` Query Methods

Four read-only methods added to `opensynaptic.services.db_engine.DatabaseManager`:

```python
db.query_devices(limit=100, offset=0)
db.query_packets(device_id=None, since=None, until=None, status=None, limit=50, offset=0)
db.query_packet(packet_uuid)          # returns None if not found
db.query_sensors(device_id=None, sensor_id=None, since=None, until=None, limit=50, offset=0)
```

All queries use parameterized SQL and are compatible with SQLite, MySQL, and PostgreSQL.

### Bug Fixes

- `pyproject.toml` now sets `pythonpath = ["src"]` for pytest, enabling
  `python -m pytest` without a prior `pip install -e .`.

### Tests

Added `tests/unit/test_data_query_api.py` — **20 new test cases** covering all
query methods and HTTP endpoints.

---

## v1.3.0 — Wheel Packaging, Security & Cross-Platform

v1.3.0 merges all v1.2.x improvements and new features into a single production release.

### Bug Fixes — Critical

#### Wheel Installation Equivalence

`pip install opensynaptic` now produces a fully functional installation equivalent
to running from source.

- **`standardization.py` cache path** — `standardization_cache.json` was resolved
  relative to `__file__` (inside read-only `site-packages`). Fixed to resolve
  relative to `project_root`.
- **`libraries/__init__.py` import path** — Dynamic imports used
  `importlib.import_module("libraries.xxx")`. Fixed to `"opensynaptic.libraries.xxx"`.

#### Runtime Data Bundled

`libraries/OS_Symbols.json`, `Prefixes.json`, and all `Units/*.json` UCUM data files
are now bundled inside the wheel under `opensynaptic/libraries/`.

### Bug Fixes — Build & Release

- **Cross-platform wheel contamination** — Windows `.dll` files no longer appear in
  Linux wheels. `src/opensynaptic/utils/c/bin/` is fully gitignored.
- **`CIBW_BEFORE_BUILD`** now runs `build_native.py` before maturin, ensuring each
  wheel carries only the correct platform's shared libraries.
- **Rust/C sources in wheels** — Added `[tool.maturin] exclude` entries to strip
  source files from binary wheels.

### New Features

#### Cross-Platform Entry Points

Added `scripts/run-main.sh`, `scripts/venv-python.sh`, `scripts/venv-pip.sh` —
bash equivalents of `.cmd` files for Linux/macOS.

#### Tab Completion (Linux/macOS)

Added `scripts/enable_argcomplete.sh` supporting bash, zsh, and fish.

#### ID Allocator Performance

Migrated `id_allocator.py` from `plugins/` to `src/opensynaptic/utils/id_allocator.py`.
Replaced `min(self._released)` O(n) scan with `heapq.heappop` O(log n).

### Security

- **XSS in `display_api.py`** — Replaced manual `.replace('<', '&lt;')` with
  `html.escape(str(x), quote=True)`.
- **Plugin registry**: Added recursion depth limit to `_deep_merge_missing`
  (max 10) to prevent stack overflow on malformed config.

---

## Upgrade Notes

Both releases are **fully backward-compatible**. No configuration changes are required.

To use the data query API, ensure SQL storage is enabled:

```json
{
  "storage": {
    "sql": {
      "enabled": true,
      "dialect": "sqlite",
      "driver": { "path": "data/opensynaptic.db" }
    }
  }
}
```
