---
title: 插件启动包
---

# 插件启动包

手把手教程：从零构建一个显示 CPU 温度的 OpenSynaptic 插件。

---

## 前提条件

```powershell
pip install -e .          # 安装 OpenSynaptic（开发模式）
pip install psutil        # 用于读取系统传感器数据
```

---

## 步骤 1：创建插件文件

在 `src/opensynaptic/services/` 目录下新建 `cpu_temp_plugin/`:

```
src/opensynaptic/services/cpu_temp_plugin/
    __init__.py
    main.py
```

**`__init__.py`** — 空文件即可：
```python
# 空
```

**`main.py`**：
```python
import time
import threading

try:
    import psutil
    _HAS_PSUTIL = True
except ImportError:
    _HAS_PSUTIL = False

from opensynaptic.services.display_api import DisplayProvider, register_display_provider


class CpuTempProvider(DisplayProvider):
    """在仪表板上显示 CPU 温度面板。"""

    def __init__(self, plugin):
        super().__init__(
            plugin_name='cpu_temp',
            section_id='cpu_temperature',
            display_name='CPU 温度'
        )
        self._plugin = plugin
        self.priority = 55
        self.refresh_interval_s = 3.0

    def extract_data(self, node=None, **kwargs):
        return self._plugin.get_latest()


class CpuTempPlugin:
    """每 5 秒轮询一次 CPU 温度的 ServicePlugin。"""

    def __init__(self, node):
        self.node = node
        self._latest = {}
        self._stop_event = threading.Event()
        self._thread = None

    def auto_load(self):
        provider = CpuTempProvider(plugin=self)
        register_display_provider(provider)

        self._thread = threading.Thread(target=self._poll, daemon=True)
        self._thread.start()
        return self

    def _poll(self):
        while not self._stop_event.is_set():
            self._latest = self._read()
            self._stop_event.wait(timeout=self._get_interval())

    def _read(self):
        if not _HAS_PSUTIL:
            return {'error': 'psutil not installed'}
        temps = {}
        try:
            raw = psutil.sensors_temperatures()
            for chip, entries in raw.items():
                for e in entries:
                    label = e.label or chip
                    temps[label] = {'current': e.current,
                                    'high': e.high,
                                    'critical': e.critical}
        except AttributeError:
            return {'error': 'platform not supported'}
        return {'sensors': temps, 'ts': int(time.time())}

    def _get_interval(self):
        return (self.node.config
                .get('RESOURCES', {})
                .get('service_plugins', {})
                .get('cpu_temp', {})
                .get('interval', 5.0))

    def get_latest(self):
        return dict(self._latest)

    def close(self):
        self._stop_event.set()
        if self._thread:
            self._thread.join(timeout=3.0)

    @staticmethod
    def get_required_config():
        return {
            'enabled': True,
            'mode': 'auto',
            'interval': 5.0,
        }

    def get_cli_commands(self):
        return {
            'status': self._cmd_status,
            'latest': self._cmd_latest,
        }

    def _cmd_status(self, args=None):
        return {'ok': True, 'running': not self._stop_event.is_set()}

    def _cmd_latest(self, args=None):
        return self.get_latest()
```

---

## 步骤 2：注册插件

编辑 `src/opensynaptic/services/plugin_registry.py`，添加：

```python
PLUGIN_SPECS = {
    # ... 已有条目 ...
    'cpu_temp': {
        'module': 'opensynaptic.services.cpu_temp_plugin.main',
        'class': 'CpuTempPlugin',
        'defaults': {
            'enabled': True,
            'mode': 'auto',
            'interval': 5.0,
        },
    },
}

ALIASES = {
    # ... 已有别名 ...
    'cpu-temp': 'cpu_temp',
}
```

---

## 步骤 3：添加到 Config.json

在 `Config.json` 的 `RESOURCES.service_plugins` 下添加：

```json
"service_plugins": {
    "cpu_temp": {
        "enabled": true,
        "mode": "auto",
        "interval": 5.0
    }
}
```

---

## 步骤 4：运行并验证

```powershell
# 启动节点
python -u src/main.py start --config Config.json

# 在另一个终端查看面板
os-node display --config Config.json --section cpu_temp.cpu_temperature

# 执行 CLI 命令
os-node plugin-cmd --config Config.json --plugin cpu_temp --cmd latest
```

---

## 步骤 5：手动加载（manual 模式）

如果 `mode` 设置为 `manual`：

```powershell
os-node plugin-load --config Config.json --plugin cpu_temp
os-node plugin-cmd  --config Config.json --plugin cpu_temp --cmd status
os-node plugin-unload --config Config.json --plugin cpu_temp
```

---

## 完成了！

你已创建一个具备以下功能的完整插件：
- 后台线程轮询硬件传感器
- DisplayProvider 向仪表板暴露数据
- CLI 命令 `status` 和 `latest`
- 配置文件集成（可调节轮询间隔）

---

## 下一步

- [插件开发规范](plugins-PLUGIN_DEVELOPMENT_SPECIFICATION) — 完整 API 参考
- [插件开发规范 2026](plugins-PLUGIN_DEVELOPMENT_SPECIFICATION_2026) — 高级模式（多 section、管道注入）
- [插件劫持实践代码](plugins-PLUGIN_HIJACKING_PRACTICAL_CODE) — 覆盖内置功能
