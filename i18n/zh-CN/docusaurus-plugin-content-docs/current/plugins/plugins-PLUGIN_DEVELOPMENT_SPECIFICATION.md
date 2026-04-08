---
title: 插件开发规范
---

# 插件开发规范

OpenSynaptic 的完整插件开发参考。

---

## 概述

OpenSynaptic 有两种主要扩展机制：

1. **DisplayProvider（显示提供程序）** — 向 TUI 和 Web 面板添加可视化面板
2. **ServicePlugin（服务插件）** — 运行带完整生命周期管理的后台服务

两者可组合使用：一个插件可以同时注册 DisplayProvider 并作为 ServicePlugin 运行。

---

## 第一部分：DisplayProvider API

### 类层次结构

```
DisplayProvider (ABC)
  └─ YourProvider
```

### 构造函数

```python
class YourProvider(DisplayProvider):
    def __init__(self):
        super().__init__(
            plugin_name='your_plugin',    # str：唯一命名空间
            section_id='your_section',    # str：命名空间内的唯一 ID
            display_name='人类可读名称'    # str：显示在 UI 中（可选）
        )
```

调用 `super().__init__()` 后，在 `register_display_provider()` 之前设置额外属性：

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `category` | str | `"plugin"` | 在 UI 中将面板归组 |
| `priority` | int | `50` | 渲染优先级 0–100（越大越靠前） |
| `refresh_interval_s` | float | `2.0` | 建议客户端刷新频率（秒） |
| `render_mode` | str | `"safe_html"` | HTML 安全模式：`safe_html` · `trusted_html` · `json_only` |

### 必需方法：`extract_data()`

```python
def extract_data(self, node=None, **kwargs) -> dict:
    """
    返回该面板的原始数据字典。

    参数
    ----
    node : OpenSynaptic 节点对象，不可用时为 None
    **kwargs : 调用者上下文（过滤器、选项等）

    返回
    ----
    dict — 任何 JSON 可序列化内容
    """
    return {
        'my_value': 42,
        'my_status': 'ok',
        'timestamp': int(time.time()),
    }
```

### 可选格式化方法

重写以在不同渲染上下文中自定义输出：

```python
def format_json(self, data: dict) -> dict:
    """返回 JSON 可序列化字典。默认：原样返回 data。"""
    return data

def format_html(self, data: dict) -> str:
    """返回 HTML 字符串。默认：自动生成的表格。"""
    return f"<div class='panel'><h3>{self.display_name}</h3><pre>{json.dumps(data, indent=2)}</pre></div>"

def format_text(self, data: dict) -> str:
    """返回终端纯文本。默认：JSON 格式化。"""
    lines = [f"=== {self.display_name} ==="]
    for k, v in data.items():
        lines.append(f"  {k}: {v}")
    return "\n".join(lines)

def format_table(self, data: dict) -> list:
    """返回用于表格渲染的列表。默认：单行字典。"""
    return [data]
```

### 注册

在模块导入时或 ServicePlugin 的 `auto_load()` 内调用一次：

```python
from opensynaptic.services.display_api import register_display_provider

register_display_provider(YourProvider())
```

### 系统内置 section

| Section ID | plugin_name | display_name | 刷新间隔 |
|---|---|---|---|
| `identity` | `opensynaptic_core` | 设备标识 | 10 s |
| `config` | `opensynaptic_core` | 配置 | 5 s |
| `transport` | `opensynaptic_core` | 传输状态 | 3 s |
| `pipeline` | `opensynaptic_core` | 管道指标 | 2 s |
| `plugins` | `opensynaptic_core` | 插件状态 | 3 s |
| `db` | `opensynaptic_core` | 数据库状态 | 5 s |

插件可通过注册相同 `plugin_name` + `section_id` 的提供程序来覆盖这些内置 section。

---

## 第二部分：ServicePlugin API

### 最小接口

ServicePlugin 是符合以下契约的任意类：

```python
class MyPlugin:

    def __init__(self, node):
        """
        接收节点对象。保存引用，但不要在此处启动 I/O。
        __init__ 阶段节点可能尚未完全初始化。
        """
        self.node = node

    def auto_load(self):
        """
        ServiceManager.load() 首次激活插件时调用。
        在此处启动后台线程、打开套接字、注册 DisplayProvider。
        必须返回 self。
        """
        return self

    def close(self):
        """
        节点关闭时调用。停止线程、关闭套接字、释放资源。
        """
        pass
```

### 配置集成

从 `get_required_config()` 返回默认配置。这些默认值在首次运行时合并到 `Config.json → RESOURCES.service_plugins.{name}` 中：

```python
@staticmethod
def get_required_config():
    return {
        'enabled': True,
        'mode': 'manual',     # 'manual' 或 'auto'
        'my_interval': 5.0,
        'my_flag': False,
    }
```

在运行时读取配置值：

```python
def auto_load(self):
    cfg = self.node.config
    plugin_cfg = cfg.get('RESOURCES', {}).get('service_plugins', {}).get('my_plugin', {})
    self.interval = plugin_cfg.get('my_interval', 5.0)
    return self
```

### CLI 命令暴露

从 `get_cli_commands()` 返回字典。每个键成为通过 `plugin-cmd` 可调用的子命令：

```python
def get_cli_commands(self):
    return {
        'status': self._cmd_status,
        'reset': self._cmd_reset,
        'set-flag': self._cmd_set_flag,
    }

def _cmd_status(self, args=None):
    return {'ok': True, 'running': self.running, 'interval': self.interval}
```

CLI 调用：
```powershell
os-node plugin-cmd --config Config.json --plugin my_plugin --cmd status
os-node plugin-cmd --config Config.json --plugin my_plugin --cmd set-flag -- true
```

HTTP 调用：
```bash
curl -X POST http://127.0.0.1:8765/api/plugins \
  -H "Content-Type: application/json" \
  -d '{"plugin": "my_plugin", "action": "cmd", "sub_cmd": "status"}'
```

### plugin_registry.py 注册

在 `services/plugin_registry.py` 中添加您的插件：

```python
PLUGIN_SPECS = {
    'my_plugin': {
        'module': 'path.to.my_module',
        'class': 'MyPlugin',
        'defaults': {
            'enabled': True,
            'mode': 'manual',
            'my_interval': 5.0,
            'my_flag': False,
        },
    },
}

ALIASES = {
    'my-plugin': 'my_plugin',
}
```

### 挂载模式

| 模式 | 行为 |
|---|---|
| `manual` | 挂载但**不**自动调用 `auto_load()`。通过 `plugin-load` 或 `POST /api/plugins` 手动启动。 |
| `auto` | 节点启动时 `ServiceManager.start_all()` 自动调用 `auto_load()`。 |

---

## 第三部分：组合使用

插件可以同时暴露 DisplayProvider 并作为 ServicePlugin 运行：

```python
class MyFullPlugin:

    def __init__(self, node):
        self.node = node
        self._provider = None

    def auto_load(self):
        from opensynaptic.services.display_api import register_display_provider
        self._provider = MyPluginDisplayProvider(plugin=self)
        register_display_provider(self._provider)
        return self

    @staticmethod
    def get_required_config():
        return {'enabled': True, 'mode': 'manual'}

    def get_cli_commands(self):
        return {'status': self._cmd_status}

    def _cmd_status(self, args=None):
        return {'ok': True}

    def close(self):
        pass
```

---

## 数据类型约束

`extract_data()` 必须只返回 JSON 可序列化类型：

| Python 类型 | JSON |
|---|---|
| `dict` | 对象 |
| `list`, `tuple` | 数组 |
| `str` | 字符串 |
| `int`, `float` | 数字 |
| `bool` | 布尔值 |
| `None` | null |

**不要**直接返回 `datetime` 对象、自定义类实例或 `bytes`。

---

## 生命周期概览

```
节点启动
  └─ ServiceManager.start_all()
      ├─ auto 模式插件：调用 auto_load()
      └─ manual 模式插件：等待显式加载调用

显式加载（CLI 或 HTTP）
  └─ ServiceManager.load(name)
      └─ 调用 plugin.auto_load()

节点关闭
  └─ ServiceManager.stop_all()
      └─ 对每个已加载插件调用 plugin.close()
```

---

## 参见

- [插件启动包](plugins-PLUGIN_STARTER_KIT) — 含步骤说明的入门教程
- [2026 扩展规范](plugins-PLUGIN_DEVELOPMENT_SPECIFICATION_2026) — 高级模式
- [插件快速参考](plugins-PLUGIN_QUICK_REFERENCE_2026) — 速查卡片
- [插件劫持实践代码](plugins-PLUGIN_HIJACKING_PRACTICAL_CODE) — 拦截与劫持示例
