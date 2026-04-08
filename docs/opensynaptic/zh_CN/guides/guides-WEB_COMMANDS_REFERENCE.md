# Web API 命令参考

OpenSynaptic `web_user` 插件的完整 REST API 参考。

默认地址：`http://127.0.0.1:8765/`  
完整英文版本：[en_GB/guides/WEB_COMMANDS_REFERENCE](../../en_GB/guides/guides-WEB_COMMANDS_REFERENCE)

---

## 认证

| 模式 | 请求头 |
|---|---|
| `auth_enabled=false`（默认）| 无需认证 |
| `auth_enabled=true` | `X-Admin-Token: <admin_token>` |

**权限层级：**
- **标准**：读取操作，无需令牌
- **管理**：需要 `management_enabled=true`；开启 `auth_enabled` 时需要令牌
- **管理 + 写**：额外需要 `read_only=false`

---

## 错误码

| 代码 | 含义 |
|---|---|
| `400` | 请求无效（格式错误或字段缺失）|
| `401` | 缺少 `X-Admin-Token` |
| `403` | 权限不足（`management_enabled=false` 或 `read_only=true`）|
| `404` | 资源不存在 |
| `409` | 冲突（如用户名已存在）|
| `503` | 节点未就绪（无 `node` 上下文）|

---

## 健康检查

### `GET /health`

无需认证。

```bash
curl http://127.0.0.1:8765/health
```

响应：
```json
{ "ok": true, "service": "web_user" }
```

---

## 面板

### `GET /api/dashboard`

**认证：** 管理  
**查询参数：** `sections=identity,transport,pipeline`（可选，逗号分隔；默认全部）

```bash
curl -H "X-Admin-Token: mytoken" \
     "http://127.0.0.1:8765/api/dashboard?sections=identity,transport"
```

响应：
```json
{
  "ok": true,
  "dashboard": {
    "identity": {
      "device_id": "HUB_01",
      "assigned_id": 1,
      "version": "1.3.1",
      "timestamp": 1700000000
    },
    "transport": {
      "active_transporters": ["udp"],
      "transporters_status": { "udp": true, "tcp": false },
      "transport_status": {},
      "physical_status": {},
      "application_status": {},
      "timestamp": 1700000000
    }
  }
}
```

---

## 配置

### `GET /api/config?key=<点路径>`

读取单个配置键（支持点分隔路径）。

```bash
curl "http://127.0.0.1:8765/api/config?key=engine_settings.precision"
```

响应：
```json
{ "ok": true, "key": "engine_settings.precision", "value": 6 }
```

### `PUT /api/config`

**认证：** 管理 + 写

```bash
curl -X PUT http://127.0.0.1:8765/api/config \
     -H "Content-Type: application/json" \
     -d '{"key":"engine_settings.precision","value":8,"value_type":"int"}'
```

请求体字段：

| 字段 | 类型 | 说明 |
|---|---|---|
| `key` | string | 点分隔的配置路径 |
| `value` | any | 新值 |
| `value_type` | string | `int`、`float`、`bool`、`str`、`json` |

### `GET /api/options/schema`

读取完整选项 schema（含类型、描述、可写标记）。

```bash
curl "http://127.0.0.1:8765/api/options/schema?only_writable=1"
```

### `PUT /api/options`

批量更新选项。

```bash
curl -X PUT http://127.0.0.1:8765/api/options \
     -H "Content-Type: application/json" \
     -d '{
       "updates": [
         {"key":"engine_settings.precision","value":8,"value_type":"int"},
         {"key":"RESOURCES.service_plugins.web_user.ui_compact","value":true,"value_type":"bool"}
       ]
     }'
```

---

## UI 设置

### `GET /api/ui/config`

```bash
curl http://127.0.0.1:8765/api/ui/config
```

响应：
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

### `PUT /api/ui/config`

```bash
curl -X PUT http://127.0.0.1:8765/api/ui/config \
     -H "Content-Type: application/json" \
     -d '{"ui_theme":"router-light","ui_compact":true}'
```

---

## 作业（OS CLI）

### `GET /api/oscli/jobs`

```bash
# 查看最近20条作业
curl "http://127.0.0.1:8765/api/oscli/jobs?limit=20&include_output=1"

# 查询单个作业
curl "http://127.0.0.1:8765/api/oscli/jobs?id=abc123"
```

### `POST /api/oscli/execute`

**认证：** 管理 + 写

```bash
curl -X POST http://127.0.0.1:8765/api/oscli/execute \
     -H "Content-Type: application/json" \
     -d '{"command":"plugin-test --suite component","background":true}'
```

响应：
```json
{ "ok": true, "job_id": "abc123", "status": "queued" }
```

### `GET /api/oscli/metrics`

```bash
curl http://127.0.0.1:8765/api/oscli/metrics
```

---

## 插件

### `GET /api/plugins`

列出所有插件及运行时状态。

```bash
curl http://127.0.0.1:8765/api/plugins
```

响应（摘要）：
```json
{
  "ok": true,
  "plugins": {
    "tui": { "loaded": true, "enabled": true, "mode": "manual" },
    "web_user": { "loaded": true, "enabled": true },
    "env_guard": { "loaded": true, "enabled": true, "auto_start": true }
  }
}
```

### `POST /api/plugins`

**认证：** 管理 + 写

加载插件：
```bash
curl -X POST http://127.0.0.1:8765/api/plugins \
     -d '{"plugin":"tui","action":"load"}'
```

启用/禁用：
```bash
curl -X POST http://127.0.0.1:8765/api/plugins \
     -d '{"plugin":"tui","action":"set_enabled","enabled":false}'
```

运行子命令：
```bash
curl -X POST http://127.0.0.1:8765/api/plugins \
     -d '{"plugin":"tui","action":"cmd","sub_cmd":"render","args":["--section","transport"]}'
```

### `GET /api/plugins/config?plugin=<名称>`

```bash
curl "http://127.0.0.1:8765/api/plugins/config?plugin=web_user"
```

### `PUT /api/plugins/config`

```bash
curl -X PUT http://127.0.0.1:8765/api/plugins/config \
     -d '{"plugin":"web_user","key":"auto_start","value":true,"value_type":"bool"}'
```

---

## 传输层

### `GET /api/transport`

```bash
curl http://127.0.0.1:8765/api/transport
```

响应：
```json
{
  "ok": true,
  "transport": {
    "active_transporters": ["udp"],
    "transporters_status": { "udp": true, "tcp": false },
    "transport_status": { "quic": false },
    "physical_status": { "uart": false },
    "application_status": { "mqtt": false }
  }
}
```

### `POST /api/transport`

**认证：** 管理 + 写

启用/禁用：
```bash
curl -X POST http://127.0.0.1:8765/api/transport \
     -d '{"medium":"udp","enabled":true}'
```

重新加载驱动：
```bash
curl -X POST http://127.0.0.1:8765/api/transport \
     -d '{"medium":"udp","reload":true}'
```

---

## 显示 API

### `GET /api/display/providers`

```bash
curl http://127.0.0.1:8765/api/display/providers
```

### `GET /api/display/render/{section}`

```bash
# JSON 格式
curl "http://127.0.0.1:8765/api/display/render/opensynaptic_core%2Ftransport?format=json"

# HTML 格式（用于嵌入面板）
curl "http://127.0.0.1:8765/api/display/render/opensynaptic_core%2Ftransport?format=html"
```

内置 section 路径：

| section_id | 说明 |
|---|---|
| `opensynaptic_core/identity` | 设备标识 |
| `opensynaptic_core/config` | 当前配置快照 |
| `opensynaptic_core/transport` | 传输层状态 |
| `opensynaptic_core/pipeline` | 处理管道指标 |
| `opensynaptic_core/plugins` | 插件挂载状态 |
| `opensynaptic_core/db` | 数据库状态 |

### `GET /api/display/all`

```bash
curl "http://127.0.0.1:8765/api/display/all?format=json"
```

---

## 数据查询 API

### `GET /api/data/packets`

| 参数 | 类型 | 说明 |
|---|---|---|
| `device_id` | string | 按设备过滤 |
| `status` | string | `ok`、`error` 等 |
| `since` | ISO8601 / 时间戳 | 开始时间 |
| `until` | ISO8601 / 时间戳 | 结束时间 |
| `limit` | int | 最多 500（默认 50）|
| `offset` | int | 分页偏移 |

```bash
curl "http://127.0.0.1:8765/api/data/packets?device_id=HUB_01&limit=10"
```

### `GET /api/data/packets/{uuid}`

```bash
curl "http://127.0.0.1:8765/api/data/packets/abc-def-123"
```

### `GET /api/data/sensors`

```bash
curl "http://127.0.0.1:8765/api/data/sensors?sensor_id=V1&limit=20"
```

### `GET /api/data/devices`

```bash
curl http://127.0.0.1:8765/api/data/devices
```

---

## 用户管理

### `GET /users`

```bash
curl http://127.0.0.1:8765/users
```

响应：
```json
{
  "users": [
    { "username": "admin", "role": "admin", "enabled": true },
    { "username": "alice", "role": "user", "enabled": true }
  ]
}
```

### `POST /users`

```bash
curl -X POST http://127.0.0.1:8765/users \
     -d '{"username":"alice","role":"user","enabled":true}'
```

### `PUT /users/{username}`

```bash
curl -X PUT http://127.0.0.1:8765/users/alice \
     -d '{"role":"admin"}'
```

### `DELETE /users/{username}`

```bash
curl -X DELETE http://127.0.0.1:8765/users/alice
```

---

## 插件 CLI 命令速查

```powershell
# 服务器控制
os-web --cmd start  -- --host 127.0.0.1 --port 8765 --block
os-web --cmd stop
os-web --cmd status

# 查看面板
os-web --cmd dashboard

# 用户管理
os-web --cmd list
os-web --cmd add    -- --username alice --role admin
os-web --cmd update -- --username alice --role user --disable
os-web --cmd delete -- --username alice

# 选项控制
os-web --cmd options-schema  -- --only-writable
os-web --cmd options-set     -- --key engine_settings.precision --value 8 --type int

# 通过 Web 插件执行 CLI 命令
os-web --cmd cli -- --line "plugin-test --suite component"
```
