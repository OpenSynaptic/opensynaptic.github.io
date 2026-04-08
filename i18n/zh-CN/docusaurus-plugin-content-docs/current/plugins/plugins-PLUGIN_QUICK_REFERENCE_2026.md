---
title: 插件快速参考 2026
---

# 插件快速参考 2026

> 一页纸速查：DisplayProvider + ServicePlugin 最常用的代码模式。

---

## 最小 DisplayProvider

```python
from opensynaptic.services.display_api import DisplayProvider, register_display_provider

class MyProvider(DisplayProvider):
    def __init__(self):
        super().__init__(
            plugin_name='my_plugin',
            section_id='status',
            display_name='我的状态面板'
        )
        self.priority = 60
        self.refresh_interval_s = 2.0

    def extract_data(self, node=None, **kwargs):
        return {'value': 42, 'unit': 'Cel'}

register_display_provider(MyProvider())
```

---

## 最小 ServicePlugin

```python
class MyPlugin:
    def __init__(self, node):
        self.node = node

    def auto_load(self):
        # 启动线程、打开套接字、注册 DisplayProvider
        return self

    def close(self):
        # 停止线程、释放资源
        pass

    @staticmethod
    def get_required_config():
        return {'enabled': True, 'mode': 'manual', 'interval': 5.0}

    def get_cli_commands(self):
        return {'status': self._cmd_status}

    def _cmd_status(self, args=None):
        return {'ok': True}
```

---

## plugin_registry.py 注册

```python
PLUGIN_SPECS = {
    'my_plugin': {
        'module': 'path.to.my_module',
        'class': 'MyPlugin',
        'defaults': {'enabled': True, 'mode': 'manual', 'interval': 5.0},
    },
}
ALIASES = {'my-plugin': 'my_plugin'}
```

---

## CLI 速查表

| 操作 | 命令 |
|---|---|
| 列出所有插件 | `os-node plugin-list --config Config.json` |
| 加载插件 | `os-node plugin-load --config Config.json --plugin my_plugin` |
| 卸载插件 | `os-node plugin-unload --config Config.json --plugin my_plugin` |
| 执行子命令 | `os-node plugin-cmd --config Config.json --plugin my_plugin --cmd status` |
| 查看所有面板 | `os-node display --config Config.json` |
| 查看单个面板 | `os-node display --config Config.json --section my_plugin.status` |

---

## HTTP API 速查表

| 操作 | 方法 + 路径 | 请求体 |
|---|---|---|
| 获取插件状态 | `GET /api/plugins` | — |
| 加载插件 | `POST /api/plugins` | `{"plugin":"my_plugin","action":"load"}` |
| 卸载插件 | `POST /api/plugins` | `{"plugin":"my_plugin","action":"unload"}` |
| 执行子命令 | `POST /api/plugins` | `{"plugin":"my_plugin","action":"cmd","sub_cmd":"status"}` |
| 获取面板数据 | `GET /api/display/{section_id}` | — |

---

## 挂载模式

| 模式 | 行为 |
|---|---|
| `manual` | 注册但不自动调用 `auto_load()`；需手动 `plugin-load` |
| `auto` | 节点启动时自动调用 `auto_load()` |

---

## DisplayProvider 常用属性

| 属性 | 默认值 | 说明 |
|---|---|---|
| `category` | `"plugin"` | UI 分组标签 |
| `priority` | `50` | 渲染顺序，数值越大越靠前 |
| `refresh_interval_s` | `2.0` | 客户端建议刷新间隔（秒） |
| `render_mode` | `"safe_html"` | `safe_html` / `trusted_html` / `json_only` |

---

## 常见错误排查

| 症状 | 原因 | 解决 |
|---|---|---|
| `plugin not found` | `PLUGIN_SPECS` 中无此键 | 检查 `plugin_registry.py` 注册项 |
| `auto_load` 未被调用 | 模式为 `manual` | 改为 `mode: auto` 或手动 `plugin-load` |
| 面板不显示 | `register_display_provider` 未调用 | 在 `auto_load()` 中注册 |
| JSON 序列化失败 | `extract_data` 返回了非 JSON 类型 | 避免返回 `datetime`、自定义类、`bytes` |

---

## 参考文档

- [插件开发规范](plugins-PLUGIN_DEVELOPMENT_SPECIFICATION) — 完整 API 文档
- [插件开发规范 2026](plugins-PLUGIN_DEVELOPMENT_SPECIFICATION_2026) — 高级模式
- [插件劫持实践代码](plugins-PLUGIN_HIJACKING_PRACTICAL_CODE) — 拦截与劫持示例
- [插件启动包](plugins-PLUGIN_STARTER_KIT) — 新手逐步教程
