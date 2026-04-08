# Plugin Hijacking — Practical Code Samples

This page shows hands-on examples for overriding built-in behavior, adding custom display sections, and intercepting node data.

---

## Example 1 — Override a Built-in Display Section

Replace the built-in `identity` panel with a custom version that adds extra fields.

```python
import time
from opensynaptic.services.display_api import DisplayProvider, register_display_provider


class CustomIdentityProvider(DisplayProvider):
    """
    Override the built-in opensynaptic_core:identity section.
    Registering a provider with the same plugin_name + section_id
    replaces the built-in one.
    """

    def __init__(self):
        super().__init__(
            plugin_name='opensynaptic_core',  # same namespace as built-in
            section_id='identity',            # same section ID as built-in
            display_name='Device Identity (Extended)'
        )
        self.category = 'core'
        self.priority = 100             # same priority keeps it at top
        self.refresh_interval_s = 10.0

    def extract_data(self, node=None, **kwargs):
        if not node:
            return {'error': 'Node not available'}
        cfg = getattr(node, 'config', {})
        return {
            'device_id': getattr(node, 'device_id', 'UNKNOWN'),
            'assigned_id': getattr(node, 'assigned_id', None),
            'version': cfg.get('VERSION', '?'),
            # Extra fields not in the built-in:
            'active_transporters': sorted(getattr(node, 'active_transporters', {}).keys()),
            'platform': 'opensynaptic',
            'timestamp': int(time.time()),
        }

    def format_text(self, data):
        lines = ['=== Device Identity (Extended) ===']
        for k, v in data.items():
            if k != 'timestamp':
                lines.append(f'  {k:<25} {v}')
        return '\n'.join(lines)


# Register at module import time — overrides the built-in
register_display_provider(CustomIdentityProvider())
```

**Import this file at node startup and the built-in `identity` section is replaced.**

---

## Example 2 — Add a New Metrics Panel

Add a custom panel that shows pipeline throughput metrics.

```python
import time
import threading
from opensynaptic.services.display_api import DisplayProvider, register_display_provider


class ThroughputMetricsProvider(DisplayProvider):

    def __init__(self):
        super().__init__(
            plugin_name='my_monitor',
            section_id='throughput',
            display_name='Throughput Metrics'
        )
        self.category = 'metrics'
        self.priority = 75
        self.refresh_interval_s = 2.0
        self._counts = {'packets': 0, 'errors': 0}
        self._lock = threading.Lock()

    def increment(self, packets=0, errors=0):
        """Call this from your data-processing code to update counters."""
        with self._lock:
            self._counts['packets'] += packets
            self._counts['errors'] += errors

    def extract_data(self, node=None, **kwargs):
        with self._lock:
            counts = dict(self._counts)
        total = counts['packets'] + counts['errors']
        return {
            'total_packets': total,
            'ok_packets': counts['packets'],
            'error_packets': counts['errors'],
            'error_rate': round(counts['errors'] / total, 4) if total else 0.0,
            'timestamp': int(time.time()),
        }

    def format_html(self, data):
        import html
        rate_color = 'red' if data['error_rate'] > 0.05 else 'green'
        return (
            f"<table>"
            f"<tr><td>Total</td><td>{data['total_packets']}</td></tr>"
            f"<tr><td>OK</td><td>{data['ok_packets']}</td></tr>"
            f"<tr><td>Errors</td><td>{data['error_packets']}</td></tr>"
            f"<tr><td>Error rate</td><td style='color:{rate_color}'>{data['error_rate']:.2%}</td></tr>"
            f"</table>"
        )


# Create instance so the same object can be imported and updated
throughput_provider = ThroughputMetricsProvider()
register_display_provider(throughput_provider)

# From elsewhere in your code, call:
# throughput_provider.increment(packets=10)
```

Render via HTTP:
```bash
curl "http://127.0.0.1:8765/api/display/render/my_monitor/throughput"
```

---

## Example 3 — Service Plugin That Polls a Sensor

A full Service Plugin that reads a hardware counter every N seconds and exposes it as a display section.

```python
import time
import threading
from opensynaptic.services.display_api import DisplayProvider, register_display_provider


class SensorPollerDisplay(DisplayProvider):
    def __init__(self, poller):
        super().__init__(
            plugin_name='sensor_poller',
            section_id='readings',
            display_name='Live Sensor Readings'
        )
        self._poller = poller
        self.category = 'plugin'
        self.priority = 70
        self.refresh_interval_s = 1.0

    def extract_data(self, node=None, **kwargs):
        return self._poller.get_snapshot()


class SensorPollerPlugin:

    def __init__(self, node):
        self.node = node
        self._running = False
        self._snapshot = {}
        self._lock = threading.Lock()
        self._thread = None

    def auto_load(self):
        self._running = True
        self._thread = threading.Thread(target=self._poll_loop, daemon=True)
        self._thread.start()
        register_display_provider(SensorPollerDisplay(poller=self))
        return self

    @staticmethod
    def get_required_config():
        return {
            'enabled': True,
            'mode': 'manual',
            'poll_interval': 1.0,
            'sensor_path': '/dev/null',    # override with real path
        }

    def get_cli_commands(self):
        return {
            'status': self._cmd_status,
            'snapshot': self._cmd_snapshot,
        }

    def _cmd_status(self, args=None):
        return {'ok': True, 'running': self._running}

    def _cmd_snapshot(self, args=None):
        return self.get_snapshot()

    def get_snapshot(self):
        with self._lock:
            return dict(self._snapshot)

    def _poll_loop(self):
        cfg = (
            self.node.config
            .get('RESOURCES', {})
            .get('service_plugins', {})
            .get('sensor_poller', {})
        )
        interval = float(cfg.get('poll_interval', 1.0))
        while self._running:
            try:
                # Replace with real sensor reading
                value = time.time() % 100
                with self._lock:
                    self._snapshot = {
                        'value': round(value, 3),
                        'unit': 'arb',
                        'read_at': int(time.time()),
                    }
            except Exception as exc:
                with self._lock:
                    self._snapshot = {'error': str(exc)}
            time.sleep(interval)

    def close(self):
        self._running = False
```

---

## Example 4 — Extend the Dashboard with Node-Level Stats

Add a panel that reads directly from the node object.

```python
import time
from opensynaptic.services.display_api import DisplayProvider, register_display_provider


class NodeStatsProvider(DisplayProvider):

    def __init__(self):
        super().__init__(
            plugin_name='my_stats',
            section_id='node',
            display_name='Extended Node Stats'
        )
        self.category = 'core'
        self.priority = 55
        self.refresh_interval_s = 5.0

    def extract_data(self, node=None, **kwargs):
        if not node:
            return {'available': False}
        cfg = getattr(node, 'config', {})
        fusion = getattr(node, 'fusion', None)
        ram_cache = getattr(fusion, '_RAM_CACHE', {}) if fusion else {}
        return {
            'device_id': getattr(node, 'device_id', None),
            'assigned_id': getattr(node, 'assigned_id', None),
            'version': cfg.get('VERSION', '?'),
            'active_transporters': sorted(getattr(node, 'active_transporters', {}).keys()),
            'fusion_cached_devices': len(ram_cache),
            'fusion_template_total': sum(
                len(v.get('data', {}).get('templates', {})) for v in ram_cache.values()
            ),
            'db_enabled': bool(getattr(node, 'db_manager', None)),
            'timestamp': int(time.time()),
        }

    def format_text(self, data):
        lines = ['=== Extended Node Stats ===']
        for k, v in data.items():
            if k != 'timestamp':
                lines.append(f'  {k:<30} {str(v):>15}')
        return '\n'.join(lines)


register_display_provider(NodeStatsProvider())
```

---

## Example 5 — Batch Register Multiple Sections at Once

Register all your plugin's sections from a single `auto_load()` call.

```python
import time
from opensynaptic.services.display_api import DisplayProvider, register_display_provider


def _make_provider(plugin_name, section_id, display_name, fn, priority=50, interval=3.0):
    """Dynamically create a DisplayProvider from a function."""

    class _FnProvider(DisplayProvider):
        def __init__(self):
            super().__init__(plugin_name, section_id, display_name)
            self.priority = priority
            self.refresh_interval_s = interval

        def extract_data(self, node=None, **kwargs):
            return fn(node)

    return _FnProvider()


def register_my_plugin_sections():
    register_display_provider(_make_provider(
        plugin_name='fleet_monitor',
        section_id='summary',
        display_name='Fleet Summary',
        fn=lambda node: {
            'node_count': 1,
            'timestamp': int(time.time()),
        },
        priority=80,
        interval=10.0,
    ))

    register_display_provider(_make_provider(
        plugin_name='fleet_monitor',
        section_id='alerts',
        display_name='Active Alerts',
        fn=lambda node: {
            'alert_count': 0,
            'alerts': [],
            'timestamp': int(time.time()),
        },
        priority=90,
        interval=2.0,
    ))


# Call from auto_load() or at import time
register_my_plugin_sections()
```

---

## Render and Check

After registering any provider, verify it appears in the registry:

```bash
# List all registered providers
curl http://127.0.0.1:8765/api/display/providers

# Render your section as JSON
curl "http://127.0.0.1:8765/api/display/render/my_plugin/section_id"

# Render as HTML
curl "http://127.0.0.1:8765/api/display/render/my_plugin/section_id?format=html"

# Render all at once
curl http://127.0.0.1:8765/api/display/all
```

Via TUI:
```powershell
os-node tui --config Config.json --section my_plugin:section_id
```
