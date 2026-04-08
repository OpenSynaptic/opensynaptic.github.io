---
title: 插件开发规范 2026
---

# 插件开发规范 2026

2026 扩展规范，涵盖高级插件模式、多 section、管道注入和异步设计。

---

## 多 Section DisplayProvider

一个插件可注册多个 DisplayProvider，每个显示不同数据维度：

```python
from opensynaptic.services.display_api import DisplayProvider, register_display_provider

class TempProvider(DisplayProvider):
    def __init__(self):
        super().__init__('env_plugin', 'temperature', '温度')
        self.priority = 70

    def extract_data(self, node=None, **kwargs):
        return {'value': node.sensors.get('T1', 0), 'unit': 'Cel'}

class HumProvider(DisplayProvider):
    def __init__(self):
        super().__init__('env_plugin', 'humidity', '湿度')
        self.priority = 65

    def extract_data(self, node=None, **kwargs):
        return {'value': node.sensors.get('H1', 0), 'unit': 'Pct'}

# 在 auto_load() 中注册两者
register_display_provider(TempProvider())
register_display_provider(HumProvider())
```

---

## 覆盖内置 Section

插件可通过注册相同 `plugin_name` + `section_id` 覆盖系统内置面板：

```python
class CustomTransportProvider(DisplayProvider):
    def __init__(self):
        super().__init__('opensynaptic_core', 'transport', '传输状态（增强版）')
        self.priority = 99  # 高优先级确保覆盖

    def extract_data(self, node=None, **kwargs):
        base = node.transport_status() if node else {}
        base['custom_metric'] = self._get_custom()
        return base

    def _get_custom(self):
        return 'active'
```

---

## 后台线程模式

适用于需要持续采集数据的插件：

```python
import threading
import time

class PollerPlugin:

    def __init__(self, node):
        self.node = node
        self._thread = None
        self._stop_event = threading.Event()
        self._latest = {}

    def auto_load(self):
        self._thread = threading.Thread(target=self._poll_loop, daemon=True)
        self._thread.start()
        return self

    def _poll_loop(self):
        while not self._stop_event.is_set():
            try:
                self._latest = self._collect()
            except Exception:
                pass
            self._stop_event.wait(timeout=self.node.config.get(
                'RESOURCES', {}).get('service_plugins', {}).get(
                    'poller_plugin', {}).get('interval', 5.0))

    def _collect(self):
        return {'ts': int(time.time()), 'count': 1}

    def close(self):
        self._stop_event.set()
        if self._thread:
            self._thread.join(timeout=3.0)

    @staticmethod
    def get_required_config():
        return {'enabled': True, 'mode': 'auto', 'interval': 5.0}
```

---

## 管道数据注入

插件可将自定义数据写入节点管道，供下游消费：

```python
def _collect(self):
    data = self._read_sensor()
    # 推送到节点的数据管道
    if hasattr(self.node, 'pipeline') and self.node.pipeline:
        self.node.pipeline.push({
            'source': 'my_plugin',
            'sensor_id': 'custom_T1',
            'unit': 'Cel',
            'value': data['temp'],
        })
    return data
```

---

## 错误处理策略

| 场景 | 推荐做法 |
|---|---|
| `extract_data()` 异常 | 捕获并返回 `{'error': str(e)}`，不要让异常逃逸 |
| `auto_load()` 失败 | 记录日志，返回 `self`；不要抛出 |
| 后台线程崩溃 | 在线程的 try/except 中捕获，等待间隔后重试 |
| 配置键缺失 | 永远使用 `.get(key, default)` |

错误处理示例：

```python
def extract_data(self, node=None, **kwargs):
    try:
        return self._unsafe_collect(node)
    except ConnectionError as e:
        return {'error': 'connection_failed', 'detail': str(e)}
    except Exception as e:
        return {'error': 'unexpected', 'detail': str(e)}
```

---

## 测试插件

使用 `plugin-test` 套件验证插件行为：

```powershell
# 组件级测试（单元）
python -u src/main.py plugin-test --config Config.json --suite component

# 压力测试
python -u src/main.py plugin-test --config Config.json --suite stress --workers 8 --total 200
```

单元测试最小模式（不依赖完整节点）：

```python
import unittest
from my_module import MyPlugin

class TestMyPlugin(unittest.TestCase):
    def test_extract_data_no_node(self):
        # 不依赖完整节点的最小测试
        class FakeNode:
            config = {}
        p = MyPlugin(FakeNode())
        p.auto_load()
        # 如果插件有 DisplayProvider，直接测试 extract_data
        result = p._provider.extract_data(node=None)
        self.assertIn('value', result)
        p.close()
```

---

## 插件开发检查清单

- [ ] 类有 `__init__(node)`, `auto_load()`, `close()` 三个方法
- [ ] `auto_load()` 返回 `self`
- [ ] `get_required_config()` 包含 `enabled` 和 `mode`
- [ ] `extract_data()` 只返回 JSON 可序列化类型
- [ ] 后台线程使用 `daemon=True` 或在 `close()` 中正确终止
- [ ] 已在 `plugin_registry.py` 中注册
- [ ] `PLUGIN_SPECS` 中的 `module` 路径可正常 import
- [ ] 已测试 `mode: auto` 下是否正常自动启动

---

## 参见

- [插件开发规范](plugins-PLUGIN_DEVELOPMENT_SPECIFICATION) — 基础 API 参考
- [插件快速参考](plugins-PLUGIN_QUICK_REFERENCE_2026) — 代码速查
- [插件劫持实践代码](plugins-PLUGIN_HIJACKING_PRACTICAL_CODE) — 拦截示例
- [插件启动包](plugins-PLUGIN_STARTER_KIT) — 手把手教程
