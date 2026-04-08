# TUI 快速参考

OpenSynaptic `tui` 插件的完整字段参考。

---

## 启动 TUI

```powershell
# 所有分区一次性快照
os-node tui --config Config.json

# 指定单个分区
os-node tui --config Config.json --section transport

# 实时交互模式
os-node tui --config Config.json --interactive --interval 2.0 --duration 60
```

| 参数 | 说明 |
|---|---|
| `--section` | 单个分区名（省略则显示全部）|
| `--interactive` | 持续刷新，按 `Ctrl+C` 停止 |
| `--interval` | 刷新间隔（秒，默认 2.0，最小 0.5）|
| `--duration` | 自动停止前的运行时间（秒）|

---

## 内置分区

### `identity` — 设备标识

| 字段 | 类型 | 说明 |
|---|---|---|
| `device_id` | string | 配置中的设备名称（如 `"HUB_01"`）|
| `assigned_id` | integer | 分配的数字 ID（未分配时为 `null`）|
| `version` | string | 运行时版本字符串（如 `"1.3.1"`）|
| `timestamp` | float | 数据快照的 Unix 时间戳 |

```bash
curl "http://127.0.0.1:8765/api/display/render/opensynaptic_core%2Fidentity?format=json"
```

---

### `config` — 配置快照

| 字段 | 类型 | 说明 |
|---|---|---|
| `engine_settings` | object | 精度、融合策略等引擎参数 |
| `payload_switches` | object | 数据包字段选择开关 |
| `opensynaptic_setting` | object | 高级节点参数 |
| `security_settings` | object | 加密、令牌、TLS 开关 |
| `timestamp` | float | 快照时间戳 |

```bash
curl "http://127.0.0.1:8765/api/display/render/opensynaptic_core%2Fconfig?format=json"
```

---

### `transport` — 传输层

| 字段 | 类型 | 说明 |
|---|---|---|
| `active_transporters` | list[string] | 当前激活的传输器列表（如 `["udp","tcp"]`）|
| `transporters_status` | object | 每个核心传输器的开关状态 |
| `transport_status` | object | L4/叠加层传输器状态 |
| `physical_status` | object | 物理层传输器状态（UART、LoRa 等）|
| `application_status` | object | 应用层传输器状态（MQTT、HTTP 等）|
| `timestamp` | float | 快照时间戳 |

```powershell
# 通过 TUI
os-node tui --config Config.json --section transport

# 通过 Web API
curl "http://127.0.0.1:8765/api/transport"
```

---

### `pipeline` — 管道指标

| 字段 | 类型 | 说明 |
|---|---|---|
| `standardizer_cache_entries` | integer | 单位标准化器缓存条目数 |
| `engine_rev_unit_entries` | integer | 单位逆变换注册条目数 |
| `fusion_ram_cache_aids` | integer | 融合 RAM 缓存辅助条目数 |
| `fusion_template_count` | integer | 已注册的融合模板数 |
| `timestamp` | float | 快照时间戳 |

```bash
curl "http://127.0.0.1:8765/api/display/render/opensynaptic_core%2Fpipeline?format=json"
```

---

### `plugins` — 插件状态

| 字段 | 类型 | 说明 |
|---|---|---|
| `mount_index` | list[string] | 已挂载的插件名称列表 |
| `runtime_index` | object | 每个插件的详细运行时状态 |
| `timestamp` | float | 快照时间戳 |

`runtime_index` 示例：
```json
{
  "tui":        { "loaded": true,  "enabled": true,  "mode": "manual" },
  "web_user":   { "loaded": true,  "enabled": true,  "auto_start": false },
  "env_guard":  { "loaded": true,  "enabled": true,  "auto_start": true },
  "port_forwarder": { "loaded": false, "enabled": false }
}
```

```bash
curl "http://127.0.0.1:8765/api/display/render/opensynaptic_core%2Fplugins?format=json"
```

---

### `db` — 数据库

| 字段 | 类型 | 说明 |
|---|---|---|
| `enabled` | bool | 数据库持久化是否开启 |
| `dialect` | string | 数据库引擎（如 `"sqlite"`）|
| `timestamp` | float | 快照时间戳 |

```bash
curl "http://127.0.0.1:8765/api/display/render/opensynaptic_core%2Fdb?format=json"
```

---

## 插件自定义分区

插件可以注册额外的 TUI 分区。使用以下命令查看所有可用分区：

```bash
curl http://127.0.0.1:8765/api/display/providers
```

TUI 中使用插件分区的 ID 访问：
```powershell
os-node tui --config Config.json --section my_plugin/my_section
```

---

## 各分区 Web API 对应路径

| TUI `--section` | Web API 路径 |
|---|---|
| `identity` | `GET /api/display/render/opensynaptic_core%2Fidentity` |
| `config` | `GET /api/display/render/opensynaptic_core%2Fconfig` |
| `transport` | `GET /api/transport` 或 `GET /api/display/render/opensynaptic_core%2Ftransport` |
| `pipeline` | `GET /api/display/render/opensynaptic_core%2Fpipeline` |
| `plugins` | `GET /api/plugins` 或 `GET /api/display/render/opensynaptic_core%2Fplugins` |
| `db` | `GET /api/display/render/opensynaptic_core%2Fdb` |
| 全部 | `GET /api/display/all?format=json` |

---

## 插件 CLI 命令

```powershell
# TUI 实时渲染单个分区
os-node tui --cmd render -- --section transport

# 查看 TUI 帮助
os-node tui --cmd help

# 查看状态
os-node tui --cmd status
```
