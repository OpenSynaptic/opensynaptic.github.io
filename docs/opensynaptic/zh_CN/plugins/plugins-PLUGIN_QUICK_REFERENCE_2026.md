# 插件快速参考 2026

---

## Display Provider 最小代码

```python
from opensynaptic.services.display_api import DisplayProvider, register_display_provider

class MyProvider(DisplayProvider):
    plugin_name  = "my_plugin"
    section_id   = "dashboard"
    display_name = "我的面板"
    category     = "monitoring"
    priority     = 50

    def extract_data(self, node, **kwargs) -> dict:
        return {
            "active": node.transport.active_transporters,
            "timestamp": node.get_time()
        }

register_display_provider(MyProvider())
```

---

## Display Provider 属性速查

| 属性 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `plugin_name` | str | ✅ | 唯一命名空间（避免与内置名冲突）|
| `section_id` | str | ✅ | 分区标识符（命名空间内唯一）|
| `display_name` | str | ✅ | 面板显示名称 |
| `category` | str | | 用于面板分组（任意字符串）|
| `priority` | int | | 0-100，越小越靠前（默认 50）|
| `refresh_interval_s` | float | | 自动刷新间隔（秒）|
| `render_mode` | str | | `"json"`（默认）、`"html"`、`"text"` |

---

## Display Provider 方法速查

| 方法 | 签名 | 说明 |
|---|---|---|
| `extract_data` | `(node, **kwargs) → dict` | **必须实现**，返回原始数据 |
| `format_json` | `(data: dict) → str` | 自定义 JSON 输出（可选）|
| `format_html` | `(data: dict) → str` | 自定义 HTML 渲染（可选）|
| `format_text` | `(data: dict) → str` | 自定义文本输出（可选）|
| `format_table` | `(data: dict) → str` | 自定义表格输出（可选）|

---

## Service Plugin 最小代码

```python
class MyPlugin:
    def auto_load(self, node):
        self._node = node

    def close(self):
        pass

    def get_required_config(self) -> dict:
        return {}

    def get_cli_commands(self) -> list:
        return []
```

---

## PLUGIN_SPECS 模板

```python
"my_plugin": {
    "class":    "my_plugin.MyPlugin",
    "defaults": {
        "enabled":    True,
        "auto_start": False,
    }
}
```

---

## 生命周期流程

```
节点启动
    │
    ├─→ auto_load(node)         ← 在此处初始化，保存 node 引用
    │
    ├─→ [插件运行中]
    │       ├─→ CLI 命令调度  → get_cli_commands()[n].handler(args)
    │       └─→ 定时任务 / 事件线程（如需要）
    │
    └─→ close()                 ← 在此处停止线程、关闭连接
```

---

## 挂载模式

| 模式 | 触发条件 | 说明 |
|---|---|---|
| `manual` | 显式 `--cmd start` 或 API | 默认；不自动启动 |
| `auto_start` | 节点启动时 | `auto_start: true` 时 |
| `on_demand` | 首次 CLI 调用时 | 轻量级插件适用 |

---

## 内置分区 ID 速查

| `--section` 参数 | section_id（API 路径中使用）|
|---|---|
| `identity` | `opensynaptic_core/identity` |
| `config` | `opensynaptic_core/config` |
| `transport` | `opensynaptic_core/transport` |
| `pipeline` | `opensynaptic_core/pipeline` |
| `plugins` | `opensynaptic_core/plugins` |
| `db` | `opensynaptic_core/db` |

要覆盖内置分区，使用相同的 `plugin_name` + `section_id`。

---

## CLI 与 HTTP 快速调用

```powershell
# 从 TUI 查看自定义分区
os-node tui --config Config.json --section my_plugin/dashboard

# 从 Web API 查看
curl "http://127.0.0.1:8765/api/display/render/my_plugin%2Fdashboard?format=json"

# 查看所有分区列表
curl http://127.0.0.1:8765/api/display/providers

# 运行插件子命令
os-node my-plugin --cmd status
curl -X POST http://127.0.0.1:8765/api/plugins \
     -d '{"plugin":"my_plugin","action":"cmd","sub_cmd":"status","args":[]}'
```

---

## 配置读写

```python
def auto_load(self, node):
    # 读取配置
    precision = node.config.get("engine_settings.precision", default=6)
    enabled   = node.config.get("RESOURCES.service_plugins.my_plugin.enabled", default=True)

    # 写入配置
    node.config.set("RESOURCES.service_plugins.my_plugin.last_run",
                    node.get_time(), value_type="float")
```

---

## 避免与以下内置名称冲突

- `tui`、`web_user`、`dependency_manager`、`env_guard`、`port_forwarder`、`test_plugin`
- `opensynaptic_core`（内置 Display Provider 命名空间）

---

## 发布前检查

- [ ] 所有 `extract_data` 均在固定时间内返回（建议 < 200ms）
- [ ] `close()` 可安全多次调用（幂等）
- [ ] 没有硬编码路径引用（使用 `node.config.get()` 读取路径）
- [ ] 已在所有格式（json/html/text）下测试（如已实现）
- [ ] 分区 ID 格式为 `snake_case`
- [ ] 插件名（`plugin_name`）全局唯一
