# Plugin Development Specification

Full reference for building plugins in OpenSynaptic.

---

## Overview

OpenSynaptic has two primary extensibility mechanisms:

1. **Display Provider** — adds visual panels to the TUI and web dashboard
2. **Service Plugin** — adds a full-lifecycle background service

Both can be combined: a single plugin can register Display Providers *and* run as a Service Plugin.

---

## Part 1: Display Provider API

### Class Hierarchy

```
DisplayProvider (ABC)
  └─ YourProvider
```

### Constructor

```python
class YourProvider(DisplayProvider):
    def __init__(self):
        super().__init__(
            plugin_name='your_plugin',    # str: unique namespace
            section_id='your_section',    # str: unique ID within namespace
            display_name='Human Name'     # str: shown in UI (optional)
        )
```

After `super().__init__()`, set additional attributes before `register_display_provider()`:

| Attribute | Type | Default | Description |
|---|---|---|---|
| `category` | str | `"plugin"` | Groups panels together in UI |
| `priority` | int | `50` | Rendering priority 0–100 (higher = first) |
| `refresh_interval_s` | float | `2.0` | Suggested client-side refresh rate |
| `render_mode` | str | `"safe_html"` | HTML safety mode: `"safe_html"` · `"trusted_html"` · `"json_only"` |

### Required method: `extract_data()`

```python
def extract_data(self, node=None, **kwargs) -> dict:
    """
    Return a dict containing the raw data for this panel.

    Parameters
    ----------
    node : OpenSynaptic node object, or None if not available
    **kwargs : additional caller context (filters, options)

    Returns
    -------
    dict — any JSON-serializable content
    """
    return {
        'my_value': 42,
        'my_status': 'ok',
        'timestamp': int(time.time()),
    }
```

### Optional format methods

Override to customize output in different rendering contexts:

```python
def format_json(self, data: dict) -> dict:
    """Return JSON-serializable dict. Default: data as-is."""
    return data

def format_html(self, data: dict) -> str:
    """Return HTML string. Default: auto-generated table."""
    return f"<div class='panel'><h3>{self.display_name}</h3><pre>{json.dumps(data, indent=2)}</pre></div>"

def format_text(self, data: dict) -> str:
    """Return plain text for terminal. Default: JSON pretty-print."""
    lines = [f"=== {self.display_name} ==="]
    for k, v in data.items():
        lines.append(f"  {k}: {v}")
    return "\n".join(lines)

def format_table(self, data: dict) -> list:
    """Return list of dicts for tabular rendering. Default: single-row dict."""
    return [data]
```

### Registration

Call once — at module import time, or inside your Service Plugin's `auto_load()`:

```python
from opensynaptic.services.display_api import register_display_provider

register_display_provider(YourProvider())
```

### Built-in sections registered by the system

| Section ID | plugin_name | display_name | Refresh |
|---|---|---|---|
| `identity` | `opensynaptic_core` | Device Identity | 10 s |
| `config` | `opensynaptic_core` | Configuration | 5 s |
| `transport` | `opensynaptic_core` | Transport Status | 3 s |
| `pipeline` | `opensynaptic_core` | Pipeline Metrics | 2 s |
| `plugins` | `opensynaptic_core` | Plugins Status | 3 s |
| `db` | `opensynaptic_core` | Database Status | 5 s |

These are auto-registered at import time. Plugins may override them by registering a provider with the same `plugin_name` + `section_id`.

---

## Part 2: Service Plugin API

### Minimum interface

A Service Plugin is any class that conforms to the following contract:

```python
class MyPlugin:

    def __init__(self, node):
        """
        Receive the node object. Store a reference but do not start I/O here.
        The node may not be fully initialized at __init__ time.
        """
        self.node = node

    def auto_load(self):
        """
        Called by ServiceManager.load() when the plugin is first activated.
        Start background threads, open sockets, register display providers here.
        Must return self.
        """
        return self

    def close(self):
        """
        Called on node shutdown. Stop threads, close sockets, release resources.
        """
        pass
```

### Config integration

Return your default config from `get_required_config()`. These defaults are merged into `Config.json → RESOURCES.service_plugins.{name}` on first run.

```python
@staticmethod
def get_required_config():
    return {
        'enabled': True,
        'mode': 'manual',     # 'manual' or 'auto'
        'my_interval': 5.0,
        'my_flag': False,
    }
```

Read your config values at runtime:

```python
def auto_load(self):
    cfg = self.node.config  # full Config.json dict
    plugin_cfg = cfg.get('RESOURCES', {}).get('service_plugins', {}).get('my_plugin', {})
    self.interval = plugin_cfg.get('my_interval', 5.0)
    return self
```

### CLI command exposure

Return a dict from `get_cli_commands()`. Each key becomes a sub-command available via `plugin-cmd`.

```python
def get_cli_commands(self):
    return {
        'status': self._cmd_status,
        'reset': self._cmd_reset,
        'set-flag': self._cmd_set_flag,
    }

def _cmd_status(self, args=None):
    return {'ok': True, 'running': self.running, 'interval': self.interval}

def _cmd_reset(self, args=None):
    self.running = False
    return {'ok': True}

def _cmd_set_flag(self, args=None):
    # args is a list of strings, same as sys.argv tail
    flag = bool(args[0]) if args else False
    self.my_flag = flag
    return {'ok': True, 'my_flag': self.my_flag}
```

Invoke from CLI:
```powershell
os-node plugin-cmd --config Config.json --plugin my_plugin --cmd status
os-node plugin-cmd --config Config.json --plugin my_plugin --cmd reset
os-node plugin-cmd --config Config.json --plugin my_plugin --cmd set-flag -- true
```

Invoke from HTTP:
```bash
curl -X POST http://127.0.0.1:8765/api/plugins \
  -H "Content-Type: application/json" \
  -d '{"plugin": "my_plugin", "action": "cmd", "sub_cmd": "status"}'
```

### PLUGIN_SPECS registration

Add your plugin to `services/plugin_registry.py`:

```python
PLUGIN_SPECS = {
    # ... existing entries ...
    'my_plugin': {
        'module': 'path.to.my_module',    # importable Python module path
        'class': 'MyPlugin',              # class name in that module
        'defaults': {
            'enabled': True,
            'mode': 'manual',
            'my_interval': 5.0,
            'my_flag': False,
        },
    },
}
```

Add an alias if you want users to use a shorter name:

```python
ALIASES = {
    # ... existing ...
    'my-plugin': 'my_plugin',
}
```

### Mount modes

| Mode | Behavior |
|---|---|
| `manual` | Plugin is mounted but `auto_load()` is **not** called automatically. Start with `plugin-load` or `POST /api/plugins`. |
| `auto` | `auto_load()` is called automatically when `ServiceManager.start_all()` runs at node boot. |

Set the mode in `defaults`:
```python
'defaults': {
    'mode': 'auto',   # start automatically on node boot
    ...
}
```

---

## Part 3: Combining Both

A plugin can expose Display Providers _and_ run as a Service Plugin:

```python
class MyFullPlugin:

    def __init__(self, node):
        self.node = node
        self._provider = None

    def auto_load(self):
        # Register display provider when plugin loads
        from opensynaptic.services.display_api import register_display_provider
        self._provider = MyPluginDisplayProvider(plugin=self)
        register_display_provider(self._provider)
        return self

    @staticmethod
    def get_required_config():
        return {
            'enabled': True,
            'mode': 'manual',
        }

    def get_cli_commands(self):
        return {
            'status': self._cmd_status,
        }

    def _cmd_status(self, args=None):
        return {'ok': True}

    def close(self):
        pass


class MyPluginDisplayProvider(DisplayProvider):

    def __init__(self, plugin):
        super().__init__(
            plugin_name='my_plugin',
            section_id='status',
            display_name='My Plugin Status'
        )
        self._plugin = plugin
        self.priority = 60

    def extract_data(self, node=None, **kwargs):
        return {
            'status': 'active',
            'details': 'from service plugin instance',
            'timestamp': int(time.time()),
        }
```

---

## Data Type Constraints

`extract_data()` must return only JSON-serializable types:

| Python type | JSON |
|---|---|
| `dict` | object |
| `list`, `tuple` | array |
| `str` | string |
| `int`, `float` | number |
| `bool` | boolean |
| `None` | null |

Do **not** return `datetime` objects, custom class instances, or `bytes` directly — convert them first.

---

## Lifecycle Summary

```
Node boot
  └─ ServiceManager.start_all()
      ├─ For auto-mode plugins: calls auto_load()
      └─ For manual-mode plugins: waits for explicit load call

Explicit load (CLI or HTTP)
  └─ ServiceManager.load(name)
      └─ calls plugin.auto_load()

Node shutdown
  └─ ServiceManager.stop_all()
      └─ calls plugin.close() for each loaded plugin
```

---

## See Also

- Starter Kit with step-by-step tutorial → [PLUGIN_STARTER_KIT.md](plugins-PLUGIN_STARTER_KIT)
- 2026 extended spec → [PLUGIN_DEVELOPMENT_SPECIFICATION_2026.md](plugins-PLUGIN_DEVELOPMENT_SPECIFICATION_2026)
- Quick reference card → [PLUGIN_QUICK_REFERENCE_2026.md](plugins-PLUGIN_QUICK_REFERENCE_2026)
- Practical code samples → [PLUGIN_HIJACKING_PRACTICAL_CODE.md](plugins-PLUGIN_HIJACKING_PRACTICAL_CODE)
