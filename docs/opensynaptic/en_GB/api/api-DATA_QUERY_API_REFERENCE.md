---
sidebar_label: 'Data Query API Reference'
sidebar_position: 5
---

# Data Query API Reference

> Available since: **v1.3.1**

The Data Query API provides read-only HTTP access to the OpenSynaptic SQL storage
layer (`os_packets` and `os_sensors` tables).

All endpoints are served by the `web_user` service (default `http://127.0.0.1:8765`).

---

## Authentication

When `auth_enabled = true` in the `web_user` service configuration, all data query
endpoints require the `X-Admin-Token` header.

```http
X-Admin-Token: <your-admin-token>
```

If the token is missing or incorrect the server returns `401 Unauthorized`.

---

## Prerequisites

SQL storage must be enabled in `Config.json`:

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

Supported dialects: `sqlite`, `mysql`, `postgresql`.

If storage is not configured, all data query endpoints return:

```json
{ "ok": false, "error": "database not configured" }
```

with HTTP status `503`.

---

## Endpoints

### `GET /api/data/devices`

List distinct devices recorded in the database with their last-seen timestamp and
total packet count.

#### Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `limit` | integer | `100` | Maximum number of devices to return (1–500) |
| `offset` | integer | `0` | Pagination offset |

#### Response

```json
{
  "ok": true,
  "devices": [
    {
      "device_id": "SENSOR_NODE_01",
      "last_seen": 1712000500,
      "packet_count": 120
    }
  ],
  "total": 1,
  "limit": 100,
  "offset": 0
}
```

| Field | Type | Description |
|-------|------|-------------|
| `device_id` | string | Device identifier |
| `last_seen` | integer | Unix epoch of the most recent packet |
| `packet_count` | integer | Total packets from this device |
| `total` | integer | Total distinct devices (for pagination) |

---

### `GET /api/data/packets`

Return a paginated list of packets, ordered by `timestamp_raw` descending.

#### Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `device_id` | string | — | Filter by device ID (exact match) |
| `status` | string | — | Filter by `device_status` (e.g. `ONLINE`, `WARN`) |
| `since` | integer | — | Unix epoch lower bound (inclusive) |
| `until` | integer | — | Unix epoch upper bound (inclusive) |
| `limit` | integer | `50` | Max rows (1–500) |
| `offset` | integer | `0` | Pagination offset |

#### Response

```json
{
  "ok": true,
  "packets": [
    {
      "packet_uuid": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "device_id": "SENSOR_NODE_01",
      "device_status": "ONLINE",
      "timestamp_raw": 1712000500,
      "payload_json": { "id": "SENSOR_NODE_01", "s": "ONLINE", "t": 1712000500 },
      "created_at": 1712000501
    }
  ],
  "total": 120,
  "limit": 50,
  "offset": 0
}
```

| Field | Type | Description |
|-------|------|-------------|
| `packet_uuid` | string | UUID primary key |
| `device_id` | string | Source device ID |
| `device_status` | string | Device status at time of packet |
| `timestamp_raw` | integer | Unix epoch from the original packet |
| `payload_json` | object | Decoded packet payload |
| `created_at` | integer | Unix epoch when the row was inserted |
| `total` | integer | Total matching rows (for pagination) |

---

### `GET /api/data/packets/{uuid}`

Retrieve a single packet by its UUID, along with all associated sensor readings.

#### Path Parameters

| Parameter | Description |
|-----------|-------------|
| `uuid` | Packet UUID (from `packet_uuid` field) |

#### Response — Found (`200`)

```json
{
  "ok": true,
  "packet": {
    "packet_uuid": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "device_id": "SENSOR_NODE_01",
    "device_status": "ONLINE",
    "timestamp_raw": 1712000500,
    "payload_json": { "id": "SENSOR_NODE_01", "s": "ONLINE", "t": 1712000500 },
    "created_at": 1712000501
  },
  "sensors": [
    {
      "sensor_index": 1,
      "sensor_id": "TEMP",
      "sensor_status": "OK",
      "normalized_value": 22.5,
      "normalized_unit": "Cel"
    },
    {
      "sensor_index": 2,
      "sensor_id": "HUM",
      "sensor_status": "OK",
      "normalized_value": 55.0,
      "normalized_unit": "%"
    }
  ]
}
```

#### Response — Not Found (`404`)

```json
{
  "ok": false,
  "error": "packet not found",
  "packet_uuid": "00000000-0000-0000-0000-000000000000"
}
```

---

### `GET /api/data/sensors`

Return a paginated list of sensor readings, joined with packet metadata.
Results are ordered by `timestamp_raw` descending, then `sensor_index` ascending.

#### Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `device_id` | string | — | Filter by device ID |
| `sensor_id` | string | — | Filter by sensor identifier (e.g. `TEMP`, `HUM`) |
| `since` | integer | — | Unix epoch lower bound |
| `until` | integer | — | Unix epoch upper bound |
| `limit` | integer | `50` | Max rows (1–500) |
| `offset` | integer | `0` | Pagination offset |

#### Response

```json
{
  "ok": true,
  "sensors": [
    {
      "packet_uuid": "a1b2c3d4-...",
      "sensor_index": 1,
      "sensor_id": "TEMP",
      "sensor_status": "OK",
      "normalized_value": 22.5,
      "normalized_unit": "Cel",
      "device_id": "SENSOR_NODE_01",
      "timestamp_raw": 1712000500
    }
  ],
  "total": 240,
  "limit": 50,
  "offset": 0
}
```

| Field | Type | Description |
|-------|------|-------------|
| `packet_uuid` | string | Parent packet UUID |
| `sensor_index` | integer | 1-based position within the packet |
| `sensor_id` | string | Sensor identifier |
| `sensor_status` | string | Sensor status at time of reading |
| `normalized_value` | float \| null | UCUM-normalized numeric value |
| `normalized_unit` | string \| null | UCUM unit string |
| `device_id` | string | Source device ID (from parent packet) |
| `timestamp_raw` | integer | Unix epoch (from parent packet) |
| `total` | integer | Total matching rows |

---

## Python API

You can call the query methods directly on a `DatabaseManager` instance:

```python
from opensynaptic.services.db_engine import DatabaseManager

db = DatabaseManager.from_opensynaptic_config(config)
db.connect()

# List devices
result = db.query_devices(limit=50, offset=0)

# List packets
result = db.query_packets(device_id='SENSOR_NODE_01', since=1710000000, limit=20)

# Single packet
result = db.query_packet('a1b2c3d4-e5f6-7890-abcd-ef1234567890')
# Returns None if not found

# Sensor readings
result = db.query_sensors(sensor_id='TEMP', since=1710000000)
```

All methods return plain `dict` objects matching the JSON response structure above.

---

## Error Codes

| HTTP Status | Meaning |
|-------------|---------|
| `200` | Success |
| `400` | Bad request (e.g. missing required path segment) |
| `401` | Unauthorized — missing or invalid `X-Admin-Token` |
| `404` | Resource not found |
| `503` | Database not configured |
