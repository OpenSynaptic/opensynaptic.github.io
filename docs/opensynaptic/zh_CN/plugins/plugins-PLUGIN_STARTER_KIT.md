# 插件入门套件

OpenSynaptic 提供两种插件类型：

| 类型 | 作用 | 选择时机 |
|---|---|---|
| **Display Provider** | 向 TUI 和 Web 面板贡献一个数据面板 | 只需可视化数据 |
| **Service Plugin** | 完整后台服务，含生命周期管理 | 需要并发任务、HTTP 端点或自定义命令 |

---

## 第一部分：创建 Display Provider（5 步）

### 第 1 步 — 继承 `DisplayProvider`

```python
from opensynaptic.services.display_api import DisplayProvider

class MyPanelProvider(DisplayProvider):
    plugin_name    = "my_plugin"      # 唯一插件命名空间
    section_id     = "status"         # 分区标识符（在命名空间内唯一）
    display_name   = "My Status Panel"
    category       = "monitoring"
    priority       = 50               # 0（最高）到 100（最低）
```

### 第 2 步 — 实现 `extract_data()`

```python
    def extract_data(self, node, **kwargs) -> dict:
        transport = node.transport
        return {
            "active": transport.active_transporters,
            "count":  len(transport.active_transporters),
            "timestamp": node.get_time()
        }
```

### 第 3 步 — 注册 Provider

```python
from opensynaptic.services.display_api import register_display_provider

# 模块加载时立即注册
register_display_provider(MyPanelProvider())
```

### 第 4 步 — 用 TUI 验证

```powershell
os-node tui --config Config.json --section my_plugin/status
```

### 第 5 步 — 从 Web API 验证

```bash
curl "http://127.0.0.1:8765/api/display/render/my_plugin%2Fstatus?format=json"
```

---

## 第二部分：创建 Service Plugin（最小骨架）

```python
class MyServicePlugin:
    """完整的 Service Plugin 模板"""

    def auto_load(self, node):
        """节点启动时调用"""
        self._node = node
        self._running = False

    def close(self):
        """节点关闭时调用——清理所有资源"""
        self._running = False

    def get_required_config(self) -> dict:
        """返回此插件需要的配置键及默认值"""
        return {
            "RESOURCES.service_plugins.my_plugin.enabled": True,
        }

    def get_cli_commands(self) -> list:
        """返回此插件暴露的 CLI 子命令"""
        return [
            {
                "name":    "status",
                "help":    "Show plugin status",
                "handler": self._cmd_status,
                "args":    []
            }
        ]

    def _cmd_status(self, args):
        running = getattr(self, "_running", False)
        print(f"Plugin running: {running}")
```

---

## 第三部分：注册到 PLUGIN_SPECS

在 `services/plugin_registry.py` 的 `PLUGIN_SPECS` 字典中添加：

```python
"my_plugin": {
    "class":    "my_plugin.MyServicePlugin",
    "defaults": {
        "enabled":    True,
        "auto_start": False,
    }
}
```

如需别名：

```python
ALIASES = {
    "myplugin": "my_plugin",   # os-node myplugin --cmd status
}
```

---

## 接下来阅读

| 目标 | 文档 |
|---|---|
| 完整 API 规范 | [插件开发规范](plugins-PLUGIN_DEVELOPMENT_SPECIFICATION) |
| 构建 Transporter 驱动 | [TRANSPORTER_PLUGIN.md](../TRANSPORTER_PLUGIN) |
| 可运行的代码示例 | [实用代码示例](plugins-PLUGIN_HIJACKING_PRACTICAL_CODE) |
