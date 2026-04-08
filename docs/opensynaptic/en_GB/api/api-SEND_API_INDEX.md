# OpenSynaptic Send API - Index & Quick Reference

Complete index of all client-facing APIs for sending data.

---

## 📌 Quick Links

| Resource | Location | Purpose |
|----------|----------|---------|
| **Full API Docs** | [SEND_API_REFERENCE.md](./api-SEND_API_REFERENCE) | Comprehensive reference with examples |
| **Quick Examples** | [QUICK_START_SEND_EXAMPLES.md](../guides/guides-QUICK_START_SEND_EXAMPLES) | Copy-paste code snippets |
| **Python Core** | [src/opensynaptic/core/pycore/core.py](https://github.com/OpenSynaptic/OpenSynaptic/blob/main/src/opensynaptic/core/pycore/core.py) | Pure Python implementation |
| **Rust Core** | [src/opensynaptic/core/rscore/core.py](https://github.com/OpenSynaptic/OpenSynaptic/blob/main/src/opensynaptic/core/rscore/core.py) | FFI-wrapped Rust implementation |
| **CLI Commands** | [src/opensynaptic/CLI/app.py](https://github.com/OpenSynaptic/OpenSynaptic/blob/main/src/opensynaptic/CLI/app.py) | Command-line interface |
| **Web API** | [src/opensynaptic/services/web_user/](https://github.com/OpenSynaptic/OpenSynaptic/tree/main/src/opensynaptic/services/web_user/) | HTTP/REST endpoints |

---

## 🔑 Core API Methods

### Transmit/Send Pipeline

```
transmit()  →  Returns (binary_packet, assigned_id, strategy)
   ↓
dispatch()  →  Returns bool (success/failure)
```

| Method | Signature | Returns | Location |
|--------|-----------|---------|----------|
| **`transmit()`** | `transmit(sensors, device_id=None, device_status='ONLINE', **kwargs)` | `(bytes, int, str)` | [core.py #509](https://github.com/OpenSynaptic/OpenSynaptic/blob/main/src/opensynaptic/core/pycore/core.py#L509) |
| **`transmit_fast()`** | `transmit_fast(sensors=None, device_id=None, device_status='ONLINE', **kwargs)` | `(bytes, int, str)` | [core.py #542](https://github.com/OpenSynaptic/OpenSynaptic/blob/main/src/opensynaptic/core/pycore/core.py#L542) |
| **`transmit_batch()`** | `transmit_batch(batch_items, **kwargs)` | `List[(bytes, int, str)]` | [core.py #548](https://github.com/OpenSynaptic/OpenSynaptic/blob/main/src/opensynaptic/core/pycore/core.py#L548) |
| **`dispatch()`** | `dispatch(packet, medium=None)` | `bool` | [core.py #559](https://github.com/OpenSynaptic/OpenSynaptic/blob/main/src/opensynaptic/core/pycore/core.py#L559) |
| **`dispatch_with_reply()`** | `dispatch_with_reply(packet, server_ip=None, server_port=None, timeout=3.0)` | `Optional[bytes]` | [core.py #492](https://github.com/OpenSynaptic/OpenSynaptic/blob/main/src/opensynaptic/core/pycore/core.py#L492) |

### Setup/Identity

| Method | Signature | Returns | Purpose |
|--------|-----------|---------|---------|
| **`ensure_id()`** | `ensure_id(server_ip, server_port, device_meta=None, timeout=5.0)` | `bool` | Request device ID from server |
| **`ensure_time()`** | `ensure_time(server_ip=None, server_port=None, timeout=3.0)` | `Optional[int]` | Sync device clock |

### Receive/Decode

| Method | Signature | Returns | Purpose |
|--------|-----------|---------|---------|
| **`receive()`** | `receive(raw_bytes)` | `dict` | Decompress binary packet to JSON |
| **`receive_via_protocol()`** | `receive_via_protocol(raw_bytes, addr=None)` | `dict` | Decode with protocol dispatch |

---

## 🛠️ CLI Commands

All commands start with `os-node` or `python -u src/main.py`.

### Primary Send Command

**`transmit` / `os-transmit`**
- Single sensor: `--value VAL --unit UNIT`
- Multiple sensors: `--sensors '[...]'`
- From file: `--sensors-file path.json`
- Custom transporter: `--medium UDP|TCP|MQTT|...`

See: [CLI/parsers/core.py](https://github.com/OpenSynaptic/OpenSynaptic/blob/main/src/opensynaptic/CLI/parsers/core.py#L77)

### Setup Commands

| Command | Purpose | Example |
|---------|---------|---------|
| `ensure-id` | Get device ID from server | `os-node ensure-id --host 192.168.1.100 --port 8080` |
| `time-sync` | Sync clock with server | `os-node time-sync --host 192.168.1.100 --port 8080` |
| `transmit` | Send sensor data | `os-node transmit --value 3.14 --unit Pa` |

### Debug/Test Commands

| Command | Purpose | Example |
|---------|---------|---------|
| `inject` | Test pipeline stage | `os-node inject --module compress --value 25 --unit Cel` |
| `decode` | Decode binary packet | `os-node decode --hex 1001f042a8c0` |
| `status` | Show device state | `os-node status` |
| `id-info` | Show device ID info | `os-node id-info` |
| `transport-status` | List active transporters | `os-node transport-status` |
| `snapshot` | JSON dump of all state | `os-node snapshot` |

---

## 🌐 REST/HTTP APIs

All via web_user service at `http://<host>:<port>/api/...`

### Start Service

```bash
os-web --cmd start -- --host 127.0.0.1 --port 8765 --block
```

### Key Endpoints

| Endpoint | Method | Purpose | Payload |
|----------|--------|---------|---------|
| `/api/oscli/execute` | POST | Execute CLI command | `{"command": "transmit ...", "background": false}` |
| `/api/dashboard` | GET | Get system status | - |
| `/api/config` | GET/PUT | Read/write config | JSON config object |
| `/api/options` | GET/PUT | Read/write options | `{"updates": [{...}]}` |
| `/api/transport` | GET/POST | Transporter control | `{"medium": "udp", "reload": false}` |
| `/health` | GET | Health check | - |

See: [web_user/README.md](../internal/internal-WEB_USER_README#api-endpoint-quick-reference)

---

## 📦 Data Formats

### Input: Sensor Data (before transmit)

```python
[
    [sensor_id, status, value, unit],  # 4-tuple per sensor
    ...
]

# Example:
[
    ['T1', 'OK', 25.3, 'Cel'],
    ['H1', 'OK', 65.0, '%'],
]
```

### Output: Transmitted Packet (from transmit)

```python
(
    binary_packet,  # bytes/bytearray
    assigned_id,    # int
    strategy        # str: 'FULL_PACKET' or 'DIFF_PACKET'
)
```

### Received/Decoded: JSON Dict (from receive)

```python
{
    'id': 'device_id',
    's': 'ONLINE',
    't': 1710000000,
    's1_id': 'T1',
    's1_v': 25.3,
    's1_u': 'Cel',
    's2_id': 'H1',
    's2_v': 65.0,
    's2_u': '%',
    # ... more sensors
}
```

---

## 🔌 Transporter Matrix

Supported media for `dispatch(packet, medium=X)`:

### Layer 4 (Transport)
- `UDP` – Default, UDP over IP
- `TCP` – TCP socket
- `QUIC` – QUIC protocol (emerging)
- `MQTT` – MQTT pub/sub
- `IWIP` – Embedded IP  
- `UIP` – Micro IP

### Layer 1 (Physical)
- `UART` – Serial port (RS-232)
- `RS485` – RS-485 serial
- `CAN` – CAN bus
- `LoRa` – LoRaWAN radio
- `Bluetooth` – BLE/Bluetooth

Configuration in `Config.json`:
- Status map: `RESOURCES.transport_status`, `RESOURCES.physical_status`
- Settings: `RESOURCES.transport_config`, `RESOURCES.physical_config`

---

## 🎯 Common Usage Patterns

### Pattern 1: Basic Send

```python
from opensynaptic.core import OpenSynaptic
node = OpenSynaptic()
packet, aid, strategy = node.transmit([['V1', 'OK', 3.14, 'Pa']])
node.dispatch(packet)
```

### Pattern 2: Ensure ID First

```python
if node._is_id_missing():
    node.ensure_id('192.168.1.100', 8080)
# Now safe to transmit
```

### Pattern 3: Batch Multiple

```python
batch = [
    {'sensors': [['V1', 'OK', 3.14, 'Pa']]},
    {'sensors': [['T1', 'OK', 25.3, 'Cel']]},
]
results = node.transmit_batch(batch)
for packet, aid, strategy in results:
    node.dispatch(packet)
```

### Pattern 4: CLI One-Shot

```bash
os-node transmit --value 3.14 --unit Pa --medium UDP
```

### Pattern 5: HTTP API Call

```bash
curl -X POST http://127.0.0.1:8765/api/oscli/execute \
  -H 'Content-Type: application/json' \
  -d '{"command":"transmit --value 3.14 --unit Pa","background":false}'
```

---

## 🔍 Service Interfaces

Location: `src/opensynaptic/services/`

### Key Services

| Service | Interface | Purpose |
|---------|-----------|---------|
| **service_manager** | ServiceManager | Plugin lifecycle |
| **transporters** | TransporterManager | Transporter drivers |
| **web_user** | Web UI service | Dashboard & HTTP API |
| **db_engine** | DatabaseManager | SQL export |
| **test_plugin** | Test suite | Component/stress tests |

Import paths:
```python
from opensynaptic.services import ServiceManager
from opensynaptic.core import get_core_manager
from opensynaptic.services.transporters.drivers import udp
```

---

## 📍 File Locations Summary

### Core Implementation
- `src/opensynaptic/core/pycore/core.py` – Main Python class
- `src/opensynaptic/core/rscore/core.py` – Rust-bound FFI wrapper

### CLI & Commands
- `src/opensynaptic/CLI/app.py` – Main CLI handler
- `src/opensynaptic/CLI/parsers/core.py` – Argument parsing
- `src/main.py` – Entry point

### Transport Layer (dispatch targets)
- `src/opensynaptic/core/transport_layer/protocols/udp.py`
- `src/opensynaptic/core/transport_layer/protocols/tcp.py`
- `src/opensynaptic/core/transport_layer/protocols/mqtt.py`
- `src/opensynaptic/services/transporters/drivers/` – App-level drivers

### Physical Layer (serial/radio)
- `src/opensynaptic/core/physical_layer/protocols/uart.py`
- `src/opensynaptic/core/physical_layer/protocols/rs485.py`
- `src/opensynaptic/core/physical_layer/protocols/can.py`

### Web Service
- `src/opensynaptic/services/web_user/handlers.py` – HTTP endpoints
- `src/opensynaptic/services/web_user/README.md` – API documentation

### Tests & Examples
- `tests/integration/test_pipeline_e2e.py` – E2E test with transmit/receive
- `scripts/integration_test.py` – Full integration suite
- `scripts/udp_receive_test.py` – UDP receiver example
- `scripts/random_registration_protocol_e2e.py` – ID allocation example

---

## 🚀 Getting Started

### Step 1: Install
```bash
pip install -e .
```

### Step 2: Bootstrap Config
```bash
os-node repair-config
os-node demo --open-browser  # Interactive first-run
```

### Step 3: Get Device ID
```bash
# If using a server
os-node ensure-id --host <server_ip> --port 8080

# Or manually set in Config.json
os-node config-set --key assigned_id --value 42 --type int
```

### Step 4: Send Data
```bash
# CLI
os-node transmit --value 3.14 --unit Pa

# Or Python
python -c "from opensynaptic.core import OpenSynaptic; node = OpenSynaptic(); packet, aid, strategy = node.transmit([['V1','OK',3.14,'Pa']]); print(f'Sent: {node.dispatch(packet)}')"
```

---

## 📚 Documentation Map

- **API Reference:** [SEND_API_REFERENCE.md](./api-SEND_API_REFERENCE)
- **Quick Examples:** [QUICK_START_SEND_EXAMPLES.md](../guides/guides-QUICK_START_SEND_EXAMPLES)
- **Architecture:** [ARCHITECTURE.md](../ARCHITECTURE)
- **Config Schema:** [CONFIG_SCHEMA.md](../CONFIG_SCHEMA)
- **CLI Guide:** [src/opensynaptic/CLI/README.md](https://github.com/OpenSynaptic/OpenSynaptic/blob/main/src/opensynaptic/CLI/README.md)
- **Transport Plugin:** [TRANSPORTER_PLUGIN.md](../TRANSPORTER_PLUGIN)
- **ID Allocation:** [ID_LEASE_SYSTEM.md](../ID_LEASE_SYSTEM)

---

## ⚡ Performance Tips

1. **Use `transmit_fast()` for real-time:** Bypasses extra checks (pycore only)
2. **Enable batching (rscore):** `config['engine_settings']['tx_batch_enabled'] = True`
3. **Zero-copy transport:** `config['engine_settings']['zero_copy_transport'] = True`
4. **Reduce precision:** Lower `precision` value = smaller packets, faster encode
5. **Multi-threaded dispatch:** Use thread pool for concurrent sends

---

## 🔧 Troubleshooting Checklist

- ❌ "Device has no assigned ID" → Run `os-node ensure-id`
- ❌ "No available driver" → Check `os-node transport-status`
- ❌ "Dispatch failed" → Verify target host/port in config
- ❌ "Timestamp sync" → Run `os-node time-sync`
- ❌ "Import errors" → Check `pip install -e .` and native libs

Run diagnostic:
```bash
os-node diagnose  # Auto-repair suggestions
os-node doctor    # Detailed health check
```

---

## 📞 Support

- Issues: [GitHub Issues](https://github.com/OpenSynaptic/OpenSynaptic/issues)
- Discussions: [GitHub Discussions](https://github.com/OpenSynaptic/OpenSynaptic/discussions)
- Wiki: [OpenSynaptic Wiki](https://github.com/OpenSynaptic/OpenSynaptic/wiki)
