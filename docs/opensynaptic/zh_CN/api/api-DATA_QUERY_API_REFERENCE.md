---
sidebar_label: '数据查询 API 参考'
sidebar_position: 5
---

# 数据查询 API 参考

> 自 **v1.3.1** 起可用

数据查询 API 通过 HTTP 对外提供对 OpenSynaptic SQL 存储层（`os_packets` 和 `os_sensors` 表）的只读访问。

所有端点由 `web_user` 服务提供（默认 `http://127.0.0.1:8765`）。

---

## 鉴权

当 `web_user` 服务配置中 `auth_enabled = true` 时，所有数据查询端点均需携带 `X-Admin-Token` 请求头。

```http
X-Admin-Token: <your-admin-token>
```

若 Token 缺失或错误，服务器返回 `401 Unauthorized`。

---

## 前提条件

需在 `Config.json` 中启用 SQL 存储：

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

支持的数据库方言：`sqlite`、`mysql`、`postgresql`。

若未配置存储，所有数据查询端点返回：

```json
{ "ok": false, "error": "database not configured" }
```

HTTP 状态码 `503`。

---

## 端点

### `GET /api/data/devices`

列出数据库中记录的所有设备，包含最后活跃时间戳和数据包总数。

#### 查询参数

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `limit` | integer | `100` | 最大返回设备数（1–500） |
| `offset` | integer | `0` | 分页偏移量 |

#### 响应

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

| 字段 | 类型 | 说明 |
|------|------|------|
| `device_id` | string | 设备标识符 |
| `last_seen` | integer | 最近数据包的 Unix 时间戳 |
| `packet_count` | integer | 该设备的数据包总数 |
| `total` | integer | 设备总数（用于分页） |

---

### `GET /api/data/packets`

分页返回数据包列表，按 `timestamp_raw` 降序排列。

#### 查询参数

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `device_id` | string | — | 按设备 ID 过滤（精确匹配） |
| `status` | string | — | 按 `device_status` 过滤（如 `ONLINE`、`WARN`） |
| `since` | integer | — | Unix 时间戳下界（含） |
| `until` | integer | — | Unix 时间戳上界（含） |
| `limit` | integer | `50` | 最大行数（1–500） |
| `offset` | integer | `0` | 分页偏移量 |

#### 响应

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

| 字段 | 类型 | 说明 |
|------|------|------|
| `packet_uuid` | string | UUID 主键 |
| `device_id` | string | 来源设备 ID |
| `device_status` | string | 数据包发送时的设备状态 |
| `timestamp_raw` | integer | 原始数据包的 Unix 时间戳 |
| `payload_json` | object | 解码后的数据包载荷 |
| `created_at` | integer | 行插入时的 Unix 时间戳 |
| `total` | integer | 匹配行总数（用于分页） |

---

### `GET /api/data/packets/{uuid}`

按 UUID 获取单条数据包及其所有传感器读数。

#### 路径参数

| 参数 | 说明 |
|------|------|
| `uuid` | 数据包 UUID（即 `packet_uuid` 字段值） |

#### 响应 — 找到（`200`）

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

#### 响应 — 未找到（`404`）

```json
{
  "ok": false,
  "error": "packet not found",
  "packet_uuid": "00000000-0000-0000-0000-000000000000"
}
```

---

### `GET /api/data/sensors`

分页返回传感器读数，与数据包元数据联表。
结果按 `timestamp_raw` 降序、`sensor_index` 升序排列。

#### 查询参数

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `device_id` | string | — | 按设备 ID 过滤 |
| `sensor_id` | string | — | 按传感器标识过滤（如 `TEMP`、`HUM`） |
| `since` | integer | — | Unix 时间戳下界 |
| `until` | integer | — | Unix 时间戳上界 |
| `limit` | integer | `50` | 最大行数（1–500） |
| `offset` | integer | `0` | 分页偏移量 |

#### 响应

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

| 字段 | 类型 | 说明 |
|------|------|------|
| `packet_uuid` | string | 父数据包 UUID |
| `sensor_index` | integer | 在数据包内的 1-based 索引 |
| `sensor_id` | string | 传感器标识符 |
| `sensor_status` | string | 读数时的传感器状态 |
| `normalized_value` | float \| null | UCUM 归一化数值 |
| `normalized_unit` | string \| null | UCUM 单位字符串 |
| `device_id` | string | 来源设备 ID（来自父数据包） |
| `timestamp_raw` | integer | Unix 时间戳（来自父数据包） |
| `total` | integer | 匹配行总数 |

---

## Python API

可直接在 `DatabaseManager` 实例上调用查询方法：

```python
from opensynaptic.services.db_engine import DatabaseManager

db = DatabaseManager.from_opensynaptic_config(config)
db.connect()

# 列出设备
result = db.query_devices(limit=50, offset=0)

# 列出数据包
result = db.query_packets(device_id='SENSOR_NODE_01', since=1710000000, limit=20)

# 获取单条数据包
result = db.query_packet('a1b2c3d4-e5f6-7890-abcd-ef1234567890')
# 未找到时返回 None

# 传感器读数
result = db.query_sensors(sensor_id='TEMP', since=1710000000)
```

所有方法返回纯 `dict` 对象，结构与上方 JSON 响应一致。

---

## 错误码

| HTTP 状态码 | 含义 |
|-------------|------|
| `200` | 成功 |
| `400` | 请求错误（如路径参数缺失） |
| `401` | 未授权 — `X-Admin-Token` 缺失或无效 |
| `404` | 资源不存在 |
| `503` | 数据库未配置 |
