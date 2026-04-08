# Plugin Quick Reference 2026

One-page cheat sheet for building OpenSynaptic plugins.

---

## Display Provider — Minimum Code

```python
import time
from opensynaptic.services.display_api import DisplayProvider, register_display_provider

class MyProvider(DisplayProvider):
    def __init__(self):
        super().__init__(plugin_name='my_plugin', section_id='metrics', display_name='My Metrics')
        self.category = 'plugin'
        self.priority = 60
        self.refresh_interval_s = 3.0

    def extract_data(self, node=None, **kwargs):
        return {'value': 42, 'status': 'ok', 'timestamp': int(time.time())}

register_display_provider(MyProvider())
```

---

## Display Provider — Attribute Reference

| Attribute | Type | Default | Set to |
|---|---|---|---|
| `plugin_name` | str | *required* | Unique namespace (e.g. `"my_plugin"`) |
| `section_id` | str | *required* | Unique ID within namespace (e.g. `"metrics"`) |
| `display_name` | str | `section_id` | Human-readable label |
| `category` | str | `"plugin"` | Panel group: `"core"` · `"metrics"` · `"plugin"` |
| `priority` | int | `50` | 0–100, higher = first |
| `refresh_interval_s` | float | `2.0` | UI polling hint |
| `render_mode` | str | `"safe_html"` | `"safe_html"` · `"trusted_html"` · `"json_only"` |

---

## Display Provider — Format Methods

| Method | Called when | Return type |
|---|---|---|
| `format_json(data)` | JSON API / default | `dict` |
| `format_html(data)` | Web dashboard | `str` (HTML) |
| `format_text(data)` | TUI terminal | `str` |
| `format_table(data)` | Table view | `list[dict]` |

All receive the output of `extract_data()`. Override only what you need.

---

## Service Plugin — Minimum Code

```python
class MyPlugin:
    def __init__(self, node):
        self.node = node

    def auto_load(self):
        return self   # must return self

    @staticmethod
    def get_required_config():
        return {'enabled': True, 'mode': 'manual', 'my_option': 'default'}

    def get_cli_commands(self):
        return {'status': lambda args=None: {'ok': True, 'started': True}}

    def close(self):
        pass
```

---

## Service Plugin — PLUGIN_SPECS Entry

Add to `services/plugin_registry.py`:

```python
PLUGIN_SPECS = {
    'my_plugin': {
        'module': 'path.to.module',
        'class': 'MyPlugin',
        'defaults': {'enabled': True, 'mode': 'manual', 'my_option': 'default'},
    },
}
ALIASES = {
    'my-plugin': 'my_plugin',   # optional short name
}
```

---

## Service Plugin — Lifecycle

```
mount(name, instance) → runtime_index: loaded=False
load(name)            → calls auto_load() → loaded=True
stop_all()            → calls close() on each loaded plugin
```

Mount modes:

| `mode` | Behavior |
|---|---|
| `"manual"` | Load only on explicit `plugin-load` or HTTP call |
| `"auto"` | Load automatically at node boot |

---

## CLI Commands

```powershell
os-node plugin-list   --config Config.json
os-node plugin-load   --config Config.json --name my_plugin
os-node plugin-cmd    --config Config.json --plugin my_plugin --cmd status
os-node plugin-cmd    --config Config.json --plugin my_plugin --cmd set -- --key my_option --value new_val
```

---

## HTTP API Quick Calls

```bash
# List all plugins
curl http://127.0.0.1:8765/api/plugins

# Load a plugin
curl -X POST http://127.0.0.1:8765/api/plugins \
  -d '{"plugin": "my_plugin", "action": "load"}'

# Run a sub-command
curl -X POST http://127.0.0.1:8765/api/plugins \
  -d '{"plugin": "my_plugin", "action": "cmd", "sub_cmd": "status"}'

# Enable/disable
curl -X POST http://127.0.0.1:8765/api/plugins \
  -d '{"plugin": "my_plugin", "action": "set_enabled", "enabled": false}'

# Render display section
curl http://127.0.0.1:8765/api/display/render/my_plugin/metrics
curl "http://127.0.0.1:8765/api/display/render/my_plugin/metrics?format=html"
```

---

## Config Read/Write

Read from inside plugin:
```python
cfg = self.node.config.get('RESOURCES', {}).get('service_plugins', {}).get('my_plugin', {})
value = cfg.get('my_option', 'default')
```

Write from CLI:
```powershell
os-node config-set --config Config.json \
  --key RESOURCES.service_plugins.my_plugin.my_option --value new_val
```

Write from HTTP:
```bash
curl -X PUT http://127.0.0.1:8765/api/plugins/config \
  -d '{"plugin": "my_plugin", "updates": [{"key": "RESOURCES.service_plugins.my_plugin.my_option", "value": "new_val", "value_type": "str"}]}'
```

---

## Built-in Section IDs

| Render path | Section name |
|---|---|
| `opensynaptic_core/identity` | `identity` |
| `opensynaptic_core/config` | `config` |
| `opensynaptic_core/transport` | `transport` |
| `opensynaptic_core/pipeline` | `pipeline` |
| `opensynaptic_core/plugins` | `plugins` |
| `opensynaptic_core/db` | `db` |

---

## Checklist

- [ ] `auto_load()` returns `self`
- [ ] `extract_data()` returns JSON-serializable dict only
- [ ] Background threads are daemon threads
- [ ] `get_required_config()` is `@staticmethod`
- [ ] PLUGIN_SPECS entry added with correct module + class path
- [ ] Plugin name does not clash with existing ones: `tui` · `web_user` · `env_guard` · `port_forwarder` · `dependency_manager` · `test_plugin`
