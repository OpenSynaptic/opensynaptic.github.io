---
title: 插件劫持实践代码
---

# 插件劫持实践代码

「劫持」是指用自定义逻辑覆盖或拦截 OpenSynaptic 现有行为的技术。本文档提供真实可用的代码示例。

---

## 场景 1：覆盖内置面板

最简单的劫持形式。注册与系统内置 section 相同的 `plugin_name` + `section_id`，即可替换其输出：

```python
from opensynaptic.services.display_api import DisplayProvider, register_display_provider
import time

class HijackedTransportProvider(DisplayProvider):
    """完全替换 opensynaptic_core.transport 面板"""

    def __init__(self):
        super().__init__('opensynaptic_core', 'transport', '传输状态（已劫持）')
        self.priority = 999  # 确保此实例优先

    def extract_data(self, node=None, **kwargs):
        original = {}
        if node and hasattr(node, 'transport_status'):
            original = node.transport_status()
        # 注入额外字段
        original['hijacked_by'] = 'my_monitor_plugin'
        original['hijack_ts'] = int(time.time())
        return original
```

注册：
```python
register_display_provider(HijackedTransportProvider())
```

---

## 场景 2：管道数据拦截

在管道数据到达下游之前截获并修改：

```python
import threading

class PipelineInterceptPlugin:

    def __init__(self, node):
        self.node = node
        self._orig_push = None

    def auto_load(self):
        # 保存原始方法引用，然后用包装函数替换
        if hasattr(self.node, 'pipeline') and self.node.pipeline:
            self._orig_push = self.node.pipeline.push
            self.node.pipeline.push = self._intercepted_push
        return self

    def _intercepted_push(self, frame):
        # 修改数据：将温度值限制在合理范围内
        if isinstance(frame, dict) and frame.get('unit') == 'Cel':
            val = frame.get('value', 0)
            if val > 150 or val < -50:
                frame['anomaly'] = True
                frame['raw_value'] = val
                frame['value'] = max(-50, min(150, val))
        # 继续调用原始 push
        if self._orig_push:
            self._orig_push(frame)

    def close(self):
        # 恢复原始方法
        if self._orig_push and hasattr(self.node, 'pipeline') and self.node.pipeline:
            self.node.pipeline.push = self._orig_push

    @staticmethod
    def get_required_config():
        return {'enabled': True, 'mode': 'auto'}
```

---

## 场景 3：CLI 命令注入

让你的插件暴露与系统命令同名的命令，实现透明拦截：

```python
class CLIHijackPlugin:

    def __init__(self, node):
        self.node = node
        self._call_log = []

    def auto_load(self):
        return self

    def get_cli_commands(self):
        return {
            'status': self._hijacked_status,
            'audit-log': self._cmd_audit_log,
        }

    def _hijacked_status(self, args=None):
        """记录所有 status 调用，然后委托给真实处理器"""
        self._call_log.append({'cmd': 'status', 'args': args})
        # 调用节点原生状态方法（如果存在）
        native = getattr(self.node, 'get_status', None)
        if native:
            result = native()
        else:
            result = {'status': 'ok'}
        result['audit_intercepted'] = True
        return result

    def _cmd_audit_log(self, args=None):
        return {'calls': self._call_log[-20:]}  # 最近 20 条

    def close(self):
        self._call_log.clear()

    @staticmethod
    def get_required_config():
        return {'enabled': True, 'mode': 'auto'}
```

---

## 场景 4：多 Section 面板劫持 + 汇总

劫持多个管道，并提供一个汇总面板：

```python
from opensynaptic.services.display_api import DisplayProvider, register_display_provider
import time

_summary = {}  # 全局汇总字典

class SummaryProvider(DisplayProvider):
    def __init__(self):
        super().__init__('aggregator', 'summary', '全局汇总')
        self.priority = 80
        self.refresh_interval_s = 1.0

    def extract_data(self, node=None, **kwargs):
        return dict(_summary)


class AggregatorPlugin:

    def __init__(self, node):
        self.node = node
        self._stop = False
        self._thread = None

    def auto_load(self):
        register_display_provider(SummaryProvider())
        import threading
        self._thread = threading.Thread(target=self._loop, daemon=True)
        self._thread.start()
        return self

    def _loop(self):
        import time
        while not self._stop:
            try:
                if self.node and hasattr(self.node, 'sensors'):
                    for sid, val in self.node.sensors.items():
                        _summary[sid] = {'value': val, 'ts': int(time.time())}
            except Exception:
                pass
            time.sleep(1.0)

    def close(self):
        self._stop = True
        if self._thread:
            self._thread.join(timeout=2.0)

    @staticmethod
    def get_required_config():
        return {'enabled': True, 'mode': 'auto'}
```

---

## 注意事项

| 注意点 | 建议 |
|---|---|
| 覆盖系统面板可能影响其他功能 | 在 `close()` 中恢复原始实现 |
| 管道拦截若抛出异常会阻塞管道 | 在 `_intercepted_push` 中 try/except 保护 |
| 高优先级面板会屏蔽同 section 的低优先级面板 | 仅在确实需要时使用 `priority=999` |

---

## 参见

- [插件开发规范](plugins-PLUGIN_DEVELOPMENT_SPECIFICATION)
- [插件开发规范 2026](plugins-PLUGIN_DEVELOPMENT_SPECIFICATION_2026)
- [插件快速参考](plugins-PLUGIN_QUICK_REFERENCE_2026)
- 对于规范的运行时行为，优先参考 `src/opensynaptic/` 中的源模块。
