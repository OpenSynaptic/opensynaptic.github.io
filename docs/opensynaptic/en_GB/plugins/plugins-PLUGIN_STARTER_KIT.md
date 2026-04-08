# Plugin Starter Kit

The fastest path to writing your first OpenSynaptic plugin.

---

## What Is a Plugin?

OpenSynaptic has three plugin types, each with a different scope:

| Type | What it adds | Registration |
|---|---|---|
| **Display Provider** | A new visual panel in TUI and the web dashboard | Call `register_display_provider()` |
| **Service Plugin** | A full background service with lifecycle, CLI commands, and config | Add entry to `PLUGIN_SPECS` in plugin_registry |
| **Transporter** | A new send/receive medium (transport, physical, or application layer) | Add to layer manager candidates + Config.json |

**Start here:** Display Providers are the easiest entry point — no PLUGIN_SPECS registration needed.

---

## Tutorial: Your First Display Provider

### Step 1 — Create a Python file anywhere on the Python path

```python
# my_plugin_display.py

from opensynaptic.services.display_api import DisplayProvider, register_display_provider
import time


class MyStatusDisplay(DisplayProvider):

    def __init__(self):
        super().__init__(
            plugin_name='my_plugin',    # unique namespace for your plugin
            section_id='status',        # unique ID for this panel
            display_name='My Plugin Status'
        )
        self.category = 'plugin'        # groups panels in the UI
        self.priority = 60              # 0–100; higher appears first
        self.refresh_interval_s = 5.0  # suggested refresh rate

    def extract_data(self, node=None, **kwargs):
        """Return a plain dict with your data."""
        return {
            'message': 'Hello from my plugin!',
            'active': True,
            'value': 3.14,
            'timestamp': int(time.time()),
        }


# Register the provider — call this once at import time or in auto_load()
register_display_provider(MyStatusDisplay())
```

### Step 2 — Import your file at node startup

In `Config.json`, add the file to the startup imports, **or** import it anywhere before the node starts:

```python
import my_plugin_display  # side-effect: registers the provider
```

### Step 3 — Verify registration

```bash
curl http://127.0.0.1:8765/api/display/providers
```

Your section will appear in the response:
```json
{
  "plugin_name": "my_plugin",
  "section_id": "status",
  "display_name": "My Plugin Status",
  "category": "plugin",
  "priority": 60,
  "refresh_interval_s": 5.0
}
```

### Step 4 — Render your section

Via HTTP:
```bash
curl "http://127.0.0.1:8765/api/display/render/my_plugin/status"
```

Via TUI:
```powershell
os-node tui --config Config.json --section my_plugin:status
```

Via dashboard:
```bash
curl "http://127.0.0.1:8765/api/dashboard?sections=my_plugin:status"
```

---

## Display Provider — Full Interface

```python
class MyDisplayProvider(DisplayProvider):

    def __init__(self):
        super().__init__(
            plugin_name='my_plugin',
            section_id='my_section',
            display_name='Human Readable Name'
        )
        self.category = 'plugin'       # for grouping in UI
        self.priority = 50             # higher = shown first (0–100)
        self.refresh_interval_s = 3.0  # UI polling hint
        self.render_mode = 'safe_html' # 'safe_html' | 'trusted_html' | 'json_only'

    # REQUIRED: return a dict with your data
    def extract_data(self, node=None, **kwargs):
        return {'key': 'value', 'timestamp': int(time.time())}

    # OPTIONAL: custom JSON representation (default: return extract_data() as-is)
    def format_json(self, data):
        return data

    # OPTIONAL: custom HTML for the web dashboard
    def format_html(self, data):
        return f"<div><strong>Value:</strong> {data.get('key')}</div>"

    # OPTIONAL: custom plain-text for TUI
    def format_text(self, data):
        return f"key = {data.get('key')}"

    # OPTIONAL: tabular format
    def format_table(self, data):
        return [{'key': k, 'value': v} for k, v in data.items()]
```

All `format_*` methods receive the output of `extract_data()`. You only need to override the formats you care about; the rest fall back to a sensible default.

---

## Tutorial: Service Plugin Skeleton

For a plugin that needs its own lifecycle, CLI commands, and config keys, use a Service Plugin.

### Minimum required class

```python
# my_service_plugin.py

class MyServicePlugin:

    def __init__(self, node):
        self.node = node
        self.running = False

    def auto_load(self):
        """Called when the plugin is first loaded (plugin-load or node start)."""
        self.running = True
        return self   # must return self

    @staticmethod
    def get_required_config():
        """Default config values. Merged into Config.json on first run."""
        return {
            'enabled': True,
            'mode': 'manual',
            'my_option': 'default_value',
        }

    def get_cli_commands(self):
        """Return CLI command handlers. Keys become sub-commands."""
        return {
            'status': self._cmd_status,
            'reset': self._cmd_reset,
        }

    def _cmd_status(self, args=None):
        return {'ok': True, 'running': self.running}

    def _cmd_reset(self, args=None):
        self.running = False
        return {'ok': True, 'reset': True}

    def close(self):
        """Called on node shutdown."""
        self.running = False
```

### Register in plugin_registry.py

Add an entry to `PLUGIN_SPECS` in `services/plugin_registry.py`:

```python
PLUGIN_SPECS = {
    # ... existing entries ...
    'my_plugin': {
        'module': 'my_service_plugin',       # importable module path
        'class': 'MyServicePlugin',          # class name
        'defaults': {
            'enabled': True,
            'mode': 'manual',
            'my_option': 'default_value',
        },
    },
}
```

### Load and use your plugin

```powershell
# Check it appears in the list
os-node plugin-list --config Config.json

# Load it (calls auto_load())
os-node plugin-load --config Config.json --name my_plugin

# Run a sub-command
os-node plugin-cmd --config Config.json --plugin my_plugin --cmd status
```

---

## Choosing the Right Plugin Type

```
Do you need to add data to the TUI/dashboard?
  → Display Provider (simplest, no registration needed)

Do you need a persistent background service with CLI control?
  → Service Plugin (add to PLUGIN_SPECS)

Do you need a new network protocol or physical medium?
  → Transporter (see TRANSPORTER_PLUGIN.md)
```

---

## Next Steps

- Full API and lifecycle reference → [PLUGIN_DEVELOPMENT_SPECIFICATION.md](plugins-PLUGIN_DEVELOPMENT_SPECIFICATION)
- Complete 2026 spec with all hooks → [PLUGIN_DEVELOPMENT_SPECIFICATION_2026.md](plugins-PLUGIN_DEVELOPMENT_SPECIFICATION_2026)
- Quick reference card → [PLUGIN_QUICK_REFERENCE_2026.md](plugins-PLUGIN_QUICK_REFERENCE_2026)
- Practical hijacking and override examples → [PLUGIN_HIJACKING_PRACTICAL_CODE.md](plugins-PLUGIN_HIJACKING_PRACTICAL_CODE)
- Transporter plugin guide → [TRANSPORTER_PLUGIN.md](../TRANSPORTER_PLUGIN)
