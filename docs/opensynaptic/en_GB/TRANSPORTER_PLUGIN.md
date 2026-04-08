# Transporter Plugin Guide

How to write, register, and enable a new transporter for OpenSynaptic.

---

## Overview

OpenSynaptic's transport layer is split into three tiers:

| Tier | Config key | Examples |
|---|---|---|
| **Application** | `RESOURCES.application_status` | MQTT, Matter, Zigbee |
| **Transport** | `RESOURCES.transport_status` | UDP, TCP, QUIC, WebSocket |
| **Physical** | `RESOURCES.physical_status` | UART, RS-485, CAN, LoRa, Bluetooth |

Discovery behavior per tier:

- **Application layer**: each driver must be listed in `TransporterService.APP_LAYER_DRIVERS` to be discovered
- **Transport layer**: each driver must be listed in `TransportLayerManager._CANDIDATES`
- **Physical layer**: each driver must be listed in `PhysicalLayerManager._CANDIDATES`

All three tiers share the same `send()` / `listen()` interface. The node's payload serialization pipeline produces binary frames that are handed off to your driver's `send()`.

---

## Required Interface

Every transporter module must expose a `send()` function:

```python
def send(payload: bytes, config: dict) -> bool:
    """
    Send a binary packet using this transport medium.

    payload : bytes  — pre-encoded binary frame
    config  : dict   — full Config.json dict (read-only)

    Returns True on success, False on any failure.
    """
    raise NotImplementedError
```

### Optional: receive loop

```python
def listen(config: dict, callback) -> None:
    """
    Start a receive loop (blocking or background thread).

    callback : callable — call with (raw_bytes: bytes, addr: tuple)
                          for every packet received
    """
    raise NotImplementedError
```

---

## Adding a Transport-layer Driver (Example: WebSocket)

### Step 1 — Implement the driver

Create a Python module with a `send()` function:

```python
# websocket_driver.py
import websocket   # pip install websocket-client

def send(payload: bytes, config: dict) -> bool:
    """Send payload over WebSocket."""
    try:
        ws_cfg = (
            config
            .get('RESOURCES', {})
            .get('transport_config', {})
            .get('websocket', {})
        )
        url = ws_cfg.get('url', 'ws://localhost:8765')
        timeout = float(ws_cfg.get('timeout', 3.0))
        ws = websocket.create_connection(url, timeout=timeout)
        ws.send_binary(payload)
        ws.close()
        return True
    except Exception:
        return False
```

### Step 2 — Register in the layer manager candidates

Add your driver key and module path to `TransportLayerManager._CANDIDATES` (in the transport layer manager class). The candidates list maps driver name → importable module path:

```python
_CANDIDATES = (
    # ... existing entries ...
    ('websocket', 'websocket_driver'),   # ← add your driver here
)
```

### Step 3 — Add a Config.json status entry

The driver will only activate if its key is `true` in `Config.json`:

```json
{
  "RESOURCES": {
    "transport_status": {
      "websocket": false
    }
  }
}
```

### Step 4 — Add an optional config block

Place driver-specific configuration under `transport_config`:

```json
{
  "RESOURCES": {
    "transport_config": {
      "websocket": {
        "url": "ws://192.168.1.100:8765",
        "timeout": 3.0
      }
    }
  }
}
```

Access inside `send()`:
```python
ws_cfg = config.get('RESOURCES', {}).get('transport_config', {}).get('websocket', {})
url = ws_cfg.get('url', 'ws://localhost:8765')
```

### Step 5 — Enable the driver

Via CLI:
```powershell
os-node transporter-toggle --config Config.json --name websocket --enable
```

Via `config-set`:
```powershell
os-node config-set --config Config.json --key RESOURCES.transport_status.websocket --value true --type bool
```

Via HTTP API (when web_user is running):
```bash
curl -X POST http://127.0.0.1:8765/api/transport \
  -H "Content-Type: application/json" \
  -d '{"medium": "websocket", "enabled": true}'
```

Directly in `Config.json`:
```json
{
  "RESOURCES": {
    "transport_status": {
      "websocket": true
    }
  }
}
```

---

## Adding an Application-layer Driver (Example: Custom Protocol)

### Step 1 — Implement the driver

```python
# myapp_driver.py

def send(payload: bytes, config: dict) -> bool:
    """Send via custom application protocol."""
    app_cfg = (
        config
        .get('RESOURCES', {})
        .get('application_config', {})
        .get('myapp', {})
    )
    endpoint = app_cfg.get('endpoint', 'http://localhost:9000/ingest')
    try:
        import urllib.request
        req = urllib.request.Request(
            endpoint,
            data=payload,
            headers={'Content-Type': 'application/octet-stream'},
            method='POST',
        )
        urllib.request.urlopen(req, timeout=5.0)
        return True
    except Exception:
        return False
```

### Step 2 — Register in APP_LAYER_DRIVERS

Add the driver name to the application-layer transporter service's allowed set:

```python
class TransporterService:
    APP_LAYER_DRIVERS = {'mqtt', 'matter', 'zigbee', 'myapp'}   # ← add here
```

Drivers **not** in this set will not be loaded even if the module exists and the status key is `true`.

### Step 3 — Enable in Config.json

```json
{
  "RESOURCES": {
    "application_status": {
      "myapp": true
    },
    "application_config": {
      "myapp": {
        "endpoint": "http://192.168.1.50:9000/ingest"
      }
    }
  }
}
```

---

## Adding a Physical-layer Driver (Example: LoRa)

Physical drivers follow the same `send()` / `listen()` interface.

```python
# lora_driver.py

def send(payload: bytes, config: dict) -> bool:
    """Send payload over LoRa via serial interface."""
    phy_cfg = (
        config
        .get('RESOURCES', {})
        .get('physical_config', {})
        .get('lora', {})
    )
    port = phy_cfg.get('port', '/dev/ttyUSB0')
    baudrate = int(phy_cfg.get('baudrate', 115200))
    try:
        import serial
        with serial.Serial(port, baudrate, timeout=2.0) as ser:
            ser.write(payload)
        return True
    except Exception:
        return False


def listen(config: dict, callback) -> None:
    """Blocking LoRa receive loop — run in a background thread."""
    import serial, time
    phy_cfg = (
        config.get('RESOURCES', {}).get('physical_config', {}).get('lora', {})
    )
    port = phy_cfg.get('port', '/dev/ttyUSB0')
    baudrate = int(phy_cfg.get('baudrate', 115200))
    with serial.Serial(port, baudrate, timeout=1.0) as ser:
        while True:
            data = ser.read(512)
            if data:
                callback(data, (port, 0))
```

Register in `PhysicalLayerManager._CANDIDATES` and enable under `RESOURCES.physical_status.lora = true`.

---

## Verifying Transport Status

```powershell
# Show all three layer status maps
os-node transport-status --config Config.json

# Show in TUI
os-node tui --config Config.json --section transport
```

Via HTTP:
```bash
curl http://127.0.0.1:8765/api/transport
```

Expected response:
```json
{
  "ok": true,
  "transport": {
    "active_transporters": ["udp", "websocket"],
    "transporters_status": { "udp": true, "websocket": true },
    "transport_status": { "quic": false },
    "physical_status": { "lora": false }
  }
}
```

Example: add `bluetooth.py`:

```
src/opensynaptic/core/physical_layer/protocols/bluetooth.py
```

```json
"physical_status": {
    "bluetooth": true
},
"physical_config": {
    "bluetooth": {
        "address": "AA:BB:CC:DD:EE:FF",
        "port": 1
    }
}
```

---

## Naming Conventions

- File name (lowercase, no hyphens): `udp.py`, `lora.py`, `my_proto.py`
- Status key in Config (same lowercase): `"udp"`, `"lora"`, `"my_proto"`
- `TransporterManager` normalises medium strings to lowercase before lookup

---

## Testing Your Driver

After enabling, verify via CLI:

```powershell
python -u src/main.py transport-status --config Config.json
python -u src/main.py transmit --config Config.json --sensor-id V1 --value 1.0 --unit Pa --medium myapp
```

To test send / receive in isolation, use `inject` + your own listener:

```powershell
python -u src/main.py inject --config Config.json --module full --sensor-id V1 --value 3.14 --unit Pa
```

