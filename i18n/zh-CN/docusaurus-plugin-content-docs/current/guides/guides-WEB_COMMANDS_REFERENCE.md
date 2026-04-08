---
title: Web 命令参考
---

# Web 命令参考

OpenSynaptic HTTP API 完整速查。默认服务地址：`http://127.0.0.1:8765`

---

## 认证

若启用了 API 密钥认证，所有请求须附加：

```
Authorization: Bearer <api_key>
```

在 `Config.json` 中配置：
```json
"WEB": {
    "api_key": "your_secret_key",
    "enabled": true,
    "port": 8765
}
```

---

## 节点状态

### 获取节点状态

```bash
GET /api/status
```

```bash
curl http://127.0.0.1:8765/api/status
```

响应示例：
```json
{
    "status": "running",
    "version": "1.3.0",
    "uptime_s": 3724,
    "node_id": "00:1A:2B:3C:4D:5E"
}
```

---

## 传感器数据

### 获取所有传感器最新读数

```bash
GET /api/sensors
```

### 获取指定传感器

```bash
GET /api/sensors/{sensor_id}
```

```bash
curl http://127.0.0.1:8765/api/sensors/T1
```

响应：
```json
{
    "sensor_id": "T1",
    "unit": "Cel",
    "value": 21.5,
    "scaled": 215000,
    "ts": 1716000000
}
```

### 查询历史数据

```bash
GET /api/sensors/{sensor_id}/history?limit=100&since=1716000000
```

---

## 显示面板

### 获取所有面板

```bash
GET /api/display
```

### 获取指定 section

```bash
GET /api/display/{section_id}
```

```bash
curl http://127.0.0.1:8765/api/display/transport
```

### 获取插件面板

```bash
GET /api/display/my_plugin.status
```

---

## 插件管理

### 列出所有插件

```bash
GET /api/plugins
```

### 加载插件

```bash
POST /api/plugins
Content-Type: application/json

{"plugin": "my_plugin", "action": "load"}
```

### 卸载插件

```bash
POST /api/plugins
Content-Type: application/json

{"plugin": "my_plugin", "action": "unload"}
```

### 执行插件子命令

```bash
POST /api/plugins
Content-Type: application/json

{"plugin": "my_plugin", "action": "cmd", "sub_cmd": "status"}
```

带参数：
```bash
{"plugin": "my_plugin", "action": "cmd", "sub_cmd": "set-flag", "args": ["true"]}
```

---

## 配置管理

### 获取当前配置

```bash
GET /api/config
```

### 更新配置项

```bash
PATCH /api/config
Content-Type: application/json

{"key": "TRANSPORT.port", "value": 9000}
```

---

## 传输管理

### 获取传输状态

```bash
GET /api/transport
```

### 重启传输层

```bash
POST /api/transport/restart
```

---

## 日志

### 获取最近日志

```bash
GET /api/logs?tail=50&level=ERROR
```

### WebSocket 实时日志

```
ws://127.0.0.1:8765/ws/logs
```

---

## 错误码

| HTTP 状态码 | 含义 |
|---|---|
| `200 OK` | 成功 |
| `400 Bad Request` | 请求格式错误或参数无效 |
| `401 Unauthorized` | API 密钥缺失或无效 |
| `404 Not Found` | 资源不存在（如 sensor_id 不存在） |
| `409 Conflict` | 操作冲突（如插件已加载） |
| `500 Internal Server Error` | 服务器内部错误 |

---

## 完整示例：PowerShell

```powershell
$base = "http://127.0.0.1:8765"
$headers = @{"Authorization" = "Bearer my_secret"}

# 获取状态
Invoke-RestMethod -Uri "$base/api/status" -Headers $headers

# 加载插件
Invoke-RestMethod -Uri "$base/api/plugins" -Method POST -Headers $headers `
    -ContentType "application/json" `
    -Body '{"plugin":"cpu_temp","action":"load"}'

# 获取面板数据
Invoke-RestMethod -Uri "$base/api/display/transport" -Headers $headers
```

---

## 完整示例：Python

```python
import requests

BASE = "http://127.0.0.1:8765"
HEADERS = {"Authorization": "Bearer my_secret"}

# 获取所有传感器
r = requests.get(f"{BASE}/api/sensors", headers=HEADERS)
print(r.json())

# 执行插件命令
r = requests.post(f"{BASE}/api/plugins", headers=HEADERS, json={
    "plugin": "my_plugin",
    "action": "cmd",
    "sub_cmd": "status"
})
print(r.json())
```

---

## 参见

- [TUI 快速参考](guides-TUI_QUICK_REFERENCE) — 终端界面和 CLI 速查
- [插件开发规范](../plugins/plugins-PLUGIN_DEVELOPMENT_SPECIFICATION) — 插件 API
