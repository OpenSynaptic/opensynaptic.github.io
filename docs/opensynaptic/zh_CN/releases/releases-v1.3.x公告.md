---
sidebar_label: 'v1.3.0 / v1.3.1 版本公告'
sidebar_position: 10
---

# OpenSynaptic v1.3.0 / v1.3.1 版本说明

> 发布日期：2026-04-07（v1.3.0）/ 2026-04-08（v1.3.1）

---

## v1.3.1 — 数据查询 REST API

v1.3.1 是基于 v1.3.0 的小功能版本，首次通过 HTTP 将 SQL 存储层（`os_packets` / `os_sensors`）对外开放，提供完整的只读数据查询接口。

### 新功能：数据查询 REST API

`web_user` 服务（默认 `127.0.0.1:8765`）新增 4 个 GET 端点：

| 端点 | 说明 |
|------|------|
| `GET /api/data/devices` | 列出所有已知设备，包含 `last_seen` 时间戳和 `packet_count`。 |
| `GET /api/data/packets` | 分页列出数据包，支持多维过滤。 |
| `GET /api/data/packets/{uuid}` | 按 UUID 获取单条数据包及其传感器数组。 |
| `GET /api/data/sensors` | 分页列出传感器读数，与数据包元数据联表。 |

**鉴权：** 当 `web_user` 配置中 `auth_enabled = true` 时，所有端点均需携带 `X-Admin-Token` 请求头。

**数据库未配置：** 返回 `503` 及 `{"ok": false, "error": "database not configured"}`。

#### 查询参数

**`GET /api/data/packets`**

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `device_id` | string | — | 按设备 ID 过滤 |
| `status` | string | — | 按 `device_status` 过滤 |
| `since` | integer | — | Unix 时间戳下界（含） |
| `until` | integer | — | Unix 时间戳上界（含） |
| `limit` | integer | `50` | 最大行数（1–500） |
| `offset` | integer | `0` | 分页偏移量 |

**`GET /api/data/sensors`**

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `device_id` | string | — | 按设备 ID 过滤 |
| `sensor_id` | string | — | 按传感器标识过滤 |
| `since` | integer | — | Unix 时间戳下界 |
| `until` | integer | — | Unix 时间戳上界 |
| `limit` | integer | `50` | 最大行数（1–500） |
| `offset` | integer | `0` | 分页偏移量 |

**`GET /api/data/devices`**

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `limit` | integer | `100` | 最大行数（1–500） |
| `offset` | integer | `0` | 分页偏移量 |

#### 响应示例 — `/api/data/devices`

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

#### 响应示例 — `/api/data/packets/{uuid}`

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

### 新增：`DatabaseManager` 查询方法

`opensynaptic.services.db_engine.DatabaseManager` 新增四个只读方法：

```python
db.query_devices(limit=100, offset=0)
db.query_packets(device_id=None, since=None, until=None, status=None, limit=50, offset=0)
db.query_packet(packet_uuid)          # 未找到返回 None
db.query_sensors(device_id=None, sensor_id=None, since=None, until=None, limit=50, offset=0)
```

所有查询均使用参数化 SQL，兼容 SQLite、MySQL、PostgreSQL。

### 缺陷修复

- `pyproject.toml` 新增 `pythonpath = ["src"]` pytest 配置，无需 `pip install -e .` 即可直接运行 `python -m pytest`。

### 测试

新增 `tests/unit/test_data_query_api.py`，包含 **20 个测试用例**，覆盖所有查询方法和 HTTP 端点。

---

## v1.3.0 — 包安装修复、安全加固与跨平台支持

v1.3.0 将所有 v1.2.x 改进合并为单一生产版本发布。

### 关键缺陷修复

#### pip 安装等价性

`pip install opensynaptic` 现已与源码运行完全等价。

- **`standardization.py` 缓存路径** — `standardization_cache.json` 此前解析到只读的 `site-packages` 目录，导致 `PermissionError`。已修复为解析到 `project_root`。
- **`libraries/__init__.py` 导入路径** — 动态导入由 `"libraries.xxx"` 修正为 `"opensynaptic.libraries.xxx"`。

#### 运行时数据随包分发

`libraries/OS_Symbols.json`、`Prefixes.json` 及全部 `Units/*.json` UCUM 单位文件现已打包进 wheel 的 `opensynaptic/libraries/` 目录。

### 构建与发布修复

- **跨平台 wheel 污染** — Windows `.dll` 文件不再出现在 Linux wheel 中，`src/opensynaptic/utils/c/bin/` 已完整 gitignore。
- **`CIBW_BEFORE_BUILD`** — 在 maturin 打包前执行 `build_native.py`，确保每个 wheel 只包含对应平台的动态库。
- **Rust/C 源文件** — 在 `[tool.maturin] exclude` 中排除源文件，二进制 wheel 不再包含源码。

### 新功能

#### 跨平台入口脚本

新增 `scripts/run-main.sh`、`scripts/venv-python.sh`、`scripts/venv-pip.sh`，面向 Linux/macOS 开发者。

#### Tab 补全（Linux/macOS）

新增 `scripts/enable_argcomplete.sh`，支持 bash、zsh 和 fish。

#### ID 分配器性能

将 `id_allocator.py` 迁移至 `src/opensynaptic/utils/id_allocator.py`，将 `min()` O(n) 扫描替换为 `heapq.heappop` O(log n)。

### 安全

- **`display_api.py` XSS** — 用 `html.escape(str(x), quote=True)` 取代手动字符串替换。
- **插件注册表** — `_deep_merge_missing` 新增递归深度限制（最大 10 层），防止恶意配置导致栈溢出。

---

## 升级说明

两个版本均**完全向下兼容**，无需修改任何配置。

如需使用数据查询 API，请在 `Config.json` 中启用 SQL 存储：

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
