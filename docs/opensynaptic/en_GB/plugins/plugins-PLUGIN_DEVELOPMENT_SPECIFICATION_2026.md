# Plugin Development Specification 2026

Extended plugin development reference covering all hooks, advanced patterns, and best practices.

---

## Plugin Architecture Overview

```
OpenSynaptic Node
├─ ServiceManager                          ← mounts service plugins
│   ├─ TUIService         (tui)
│   ├─ WebUserService     (web_user)
│   ├─ EnvGuardService    (env_guard)
│   ├─ PortForwarder      (port_forwarder)
│   └─ YourPlugin         (your_plugin)   ← plugin you write
│
├─ DisplayRegistry                         ← display providers
│   ├─ opensynaptic_core:identity
│   ├─ opensynaptic_core:transport
│   ├─ opensynaptic_core:pipeline
│   └─ your_plugin:your_section           ← section you write
│
└─ Transport Layer
    ├─ Application: UDP, TCP, MQTT...      ← TransporterService
    ├─ Transport: QUIC, WebSocket...       ← TransportLayerManager
    └─ Physical: UART, CAN, LoRa...       ← PhysicalLayerManager
```

---

## Service Plugin — Complete Interface

### Constructor and lifecycle hooks

```python
class MyPlugin:

    # ── Construction ─────────────────────────────────────────────────────────

    def __init__(self, node):
        """
        Store a reference to the node. Do NOT start I/O here.
        Node services (transporters, DB, other plugins) may not be ready yet.
        """
        self.node = node
        self.started = False

    # ── Required lifecycle ────────────────────────────────────────────────────

    def auto_load(self):
        """
        Called exactly once when plugin is first activated.
        Start threads, open connections, register display providers, etc.
        MUST return self — ServiceManager stores the return value.
        """
        self.started = True
        # Register display sections here (lazy registration)
        from opensynaptic.services.display_api import register_display_provider
        register_display_provider(MySection(plugin=self))
        return self

    def close(self):
        """
        Called on node shutdown or explicit plugin unload.
        Stop threads and release all resources.
        """
        self.started = False

    # ── Config integration ────────────────────────────────────────────────────

    @staticmethod
    def get_required_config():
        """
        Default config values. Written into
        Config.json → RESOURCES.service_plugins.my_plugin
        during node initialization when the key is missing.
        Return a flat dict; nested dicts are supported.
        """
        return {
            'enabled': True,
            'mode': 'manual',      # or 'auto' for automatic start at boot
            'interval': 10.0,
            'targets': [],
            'debug': False,
        }

    # ── CLI commands ──────────────────────────────────────────────────────────

    def get_cli_commands(self):
        """
        Return a dict mapping sub-command name → handler callable.
        Handlers receive a list of string args (may be empty).
        """
        return {
            'status': self._cmd_status,
            'start': self._cmd_start,
            'stop': self._cmd_stop,
            'set': self._cmd_set,
        }

    def _cmd_status(self, args=None):
        cfg = self._get_config()
        return {
            'ok': True,
            'started': self.started,
            'interval': cfg.get('interval', 10.0),
        }

    def _cmd_start(self, args=None):
        if self.started:
            return {'ok': False, 'error': 'already started'}
        self.auto_load()
        return {'ok': True}

    def _cmd_stop(self, args=None):
        self.close()
        return {'ok': True}

    def _cmd_set(self, args=None):
        """
        Example: --key interval --value 5.0 --type float
        """
        if not args or len(args) < 4:
            return {'ok': False, 'error': 'usage: set --key KEY --value VALUE'}
        # Parse args manually or use argparse inside here
        import argparse
        p = argparse.ArgumentParser()
        p.add_argument('--key', required=True)
        p.add_argument('--value', required=True)
        p.add_argument('--type', default='str')
        ns, _ = p.parse_known_args(args)
        # Apply change via node config
        return {'ok': True, 'key': ns.key, 'value': ns.value}

    # ── Helpers ───────────────────────────────────────────────────────────────

    def _get_config(self):
        """Read this plugin's config block from Config.json."""
        return (
            self.node.config
            .get('RESOURCES', {})
            .get('service_plugins', {})
            .get('my_plugin', {})
        )
```

---

## Display Provider — Complete Interface

```python
import time
import json
import html
from opensynaptic.services.display_api import DisplayProvider, register_display_provider


class MySection(DisplayProvider):

    def __init__(self, plugin=None):
        super().__init__(
            plugin_name='my_plugin',
            section_id='main',
            display_name='My Plugin Main View'
        )
        self._plugin = plugin
        self.category = 'plugin'        # groups panels: 'core', 'metrics', 'plugin', etc.
        self.priority = 60              # 0–100; higher displayed first
        self.refresh_interval_s = 5.0  # client-side polling hint
        self.render_mode = 'safe_html'  # HTML safety mode

    # ── Required ─────────────────────────────────────────────────────────────

    def extract_data(self, node=None, **kwargs):
        """Must return a JSON-serializable dict."""
        plugin = self._plugin
        return {
            'started': getattr(plugin, 'started', False),
            'rows': [
                {'label': 'Row A', 'value': 1.23, 'unit': 'Pa'},
                {'label': 'Row B', 'value': 45.6, 'unit': 'Cel'},
            ],
            'timestamp': int(time.time()),
        }

    # ── Optional format overrides ─────────────────────────────────────────────

    def format_json(self, data):
        """JSON API response. Default is data as-is."""
        return data

    def format_html(self, data):
        """
        HTML for the web dashboard.
        Use html.escape() on any user data to prevent XSS.
        """
        rows_html = ''.join(
            f"<tr><td>{html.escape(r['label'])}</td>"
            f"<td>{r['value']}</td><td>{html.escape(r['unit'])}</td></tr>"
            for r in data.get('rows', [])
        )
        return (
            f"<table><thead><tr><th>Label</th><th>Value</th><th>Unit</th></tr></thead>"
            f"<tbody>{rows_html}</tbody></table>"
        )

    def format_text(self, data):
        """Plain text for the terminal TUI."""
        lines = [f"=== {self.display_name} ==="]
        for r in data.get('rows', []):
            lines.append(f"  {r['label']:<20} {r['value']:>10}  {r['unit']}")
        return "\n".join(lines)

    def format_table(self, data):
        """Tabular format — return list of dicts."""
        return data.get('rows', [])
```

---

## PLUGIN_SPECS Entry Structure

```python
# services/plugin_registry.py → PLUGIN_SPECS

'my_plugin': {
    'module': 'my.package.my_module',   # importable path
    'class': 'MyPlugin',               # class name
    'defaults': {
        # mirrors get_required_config()
        'enabled': True,
        'mode': 'manual',
        'interval': 10.0,
        'targets': [],
        'debug': False,
    },
},
```

Add an alias to ALIASES for a friendlier CLI name:
```python
ALIASES = {
    'my-plugin': 'my_plugin',   # allows: plugin-cmd --plugin my-plugin
}
```

---

## Mount and Load Sequence

1. `ServiceManager.mount(name, instance, config)` — stores the plugin object in `mount_index`. Does **not** call `auto_load()`.
2. `ServiceManager.load(name)` — checks `runtime_index['loaded']`, calls `auto_load()` once.
3. `ServiceManager.stop_all()` — calls `close()` on every mounted plugin.

Call `load()` manually or set `mode = 'auto'` in defaults:

```python
# Force load on startup
'defaults': {
    'mode': 'auto',  # auto-calls auto_load() during start_all()
    ...
}
```

Manual load via CLI:
```powershell
os-node plugin-load --config Config.json --name my_plugin
```

Manual load via HTTP:
```bash
curl -X POST http://127.0.0.1:8765/api/plugins \
  -d '{"plugin": "my_plugin", "action": "load"}'
```

---

## Config Key Paths

Read config using dot-notation:

```python
# Full path: RESOURCES.service_plugins.my_plugin.interval
value = (
    node.config
    .get('RESOURCES', {})
    .get('service_plugins', {})
    .get('my_plugin', {})
    .get('interval', 10.0)
)
```

Write via CLI:
```powershell
os-node config-set --config Config.json \
    --key RESOURCES.service_plugins.my_plugin.interval \
    --value 5.0 --type float
```

Write via HTTP:
```bash
curl -X PUT http://127.0.0.1:8765/api/config \
  -d '{"key": "RESOURCES.service_plugins.my_plugin.interval", "value": 5.0, "value_type": "float"}'
```

---

## Thread Safety Guidelines

- `extract_data()` is called from multiple threads (HTTP handler threads + TUI refresh threads). Use locks for shared mutable state.
- `auto_load()` is called at most once by `ServiceManager.load()`. Still, be idempotent.
- Do not call blocking I/O on the main thread from `auto_load()`. Spawn a daemon thread for background work.

```python
import threading

class MyPlugin:

    def __init__(self, node):
        self.node = node
        self._lock = threading.Lock()
        self._value = 0
        self._thread = None

    def auto_load(self):
        self._thread = threading.Thread(target=self._background_loop, daemon=True)
        self._thread.start()
        return self

    def _background_loop(self):
        import time
        while True:
            with self._lock:
                self._value += 1
            time.sleep(1.0)

    def get_value(self):
        with self._lock:
            return self._value

    def close(self):
        # Thread is daemon=True, will stop when process exits
        pass
```

---

## Accessing Node Subsystems

From inside your plugin, the `node` object exposes:

| Attribute | Type | Description |
|---|---|---|
| `node.config` | dict | Full Config.json in memory |
| `node.device_id` | str | Device ID string |
| `node.assigned_id` | int or None | Numeric ID from server |
| `node.active_transporters` | dict | `{name: driver_object}` for live transporters |
| `node.service_manager` | ServiceManager | Access other plugins |
| `node.standardizer` | Standardizer | Unit conversion engine |
| `node.engine` | Engine | Encoding engine |
| `node.fusion` | FusionEngine | Fusion/template engine |
| `node.db_manager` | DatabaseManager or None | Database access |

Access another plugin from within your plugin:

```python
tui = self.node.service_manager.get('tui')
if tui:
    snapshot = tui.render_section('identity')
```

---

## Validation Checklist

Before publishing a plugin:

- [ ] `auto_load()` returns `self`
- [ ] `extract_data()` returns only JSON-serializable types
- [ ] All background threads are daemon threads or stopped in `close()`
- [ ] `get_required_config()` is decorated `@staticmethod`
- [ ] `get_cli_commands()` returns a dict (not a list)
- [ ] PLUGIN_SPECS entry exists with correct `module` + `class`
- [ ] Plugin name is unique (no collision with existing plugins)
- [ ] No blocking calls on the main thread in `auto_load()`

---

## See Also

- Quick reference card → [PLUGIN_QUICK_REFERENCE_2026.md](plugins-PLUGIN_QUICK_REFERENCE_2026)
- Practical code examples → [PLUGIN_HIJACKING_PRACTICAL_CODE.md](plugins-PLUGIN_HIJACKING_PRACTICAL_CODE)
- Starter Kit tutorial → [PLUGIN_STARTER_KIT.md](plugins-PLUGIN_STARTER_KIT)
