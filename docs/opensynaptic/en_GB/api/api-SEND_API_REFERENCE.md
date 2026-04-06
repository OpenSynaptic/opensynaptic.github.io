# OpenSynaptic Client API Reference - Sending Data

Complete guide to sending data through the OpenSynaptic 2-N-2 IoT protocol stack.

## Table of Contents
1. [Core Python APIs](#core-python-apis)
2. [CLI Commands](#cli-commands)
3. [REST/HTTP APIs](#rest-http-apis)
4. [Request/Payload Formats](#request-payload-formats)
5. [Usage Examples](#usage-examples)
6. [Transporter Support](#transporter-support)
7. [Advanced Features](#advanced-features)

---

## Core Python APIs

### 1. Main OpenSynaptic Class

Located in: `src/opensynaptic/core/pycore/core.py` and `src/opensynaptic/core/rscore/core.py`

#### Node Initialization

```python
from opensynaptic.core import OpenSynaptic

# Create node with default config path (~/.config/opensynaptic/Config.json)
node = OpenSynaptic()

# Create node with custom config path
node = OpenSynaptic(config_path='/path/to/Config.json')
```

#### Method: `transmit()`

**Signature:**
```python
def transmit(
    sensors,
    device_id=None,
    device_status='ONLINE',
    **kwargs
) -> Tuple[bytes, int, str]:
    """
    Standardize, compress, and fuse sensor data into binary packet.
    
    Returns:
        (binary_packet, assigned_id, strategy)
        - binary_packet: bytes of compressed, fused data
        - assigned_id: the device's physical ID (from config or lease)
        - strategy: 'FULL_PACKET' or 'DIFF_PACKET'
    
    Raises:
        RuntimeError: if device has no assigned ID (call ensure_id() first)
    """
```

**Parameters:**

- **`sensors`** (required): List of sensor readings in UCUM-standardized format
  ```python
  [
      [sensor_id, status, value, unit],  # sensor 1
      [sensor_id, status, value, unit],  # sensor 2
      ...
  ]
  ```
  
  Example:
  ```python
  [
      ['T1', 'OK', 25.3, 'Cel'],      # Temperature
      ['H1', 'OK', 65.0, '%'],        # Humidity
      ['P1', 'OK', 101325, 'Pa'],     # Pressure
  ]
  ```

- **`device_id`** (optional): Override the device ID in config
  ```python
  device_id='HUB_01'
  ```

- **`device_status`** (optional): Device operating state (default: `'ONLINE'`)
  ```python
  device_status='ONLINE'  # or 'OFFLINE', 'DEGRADED', etc.
  ```

- **`**kwargs`**: Additional options
  - `t`: Timestamp (Unix seconds, auto-set if omitted)
    ```python
    t=1710000000
    ```

#### Method: `transmit_fast()`

```python
def transmit_fast(
    sensors=None,
    device_id=None,
    device_status='ONLINE',
    **kwargs
) -> Tuple[bytes, int, str]:
    """
    Alias for transmit() (same behavior in both pycore and rscore).
    For pycore: identical to transmit().
    For rscore: may use batch queue if batching is enabled.
    """
```

#### Method: `transmit_batch()`

```python
def transmit_batch(
    batch_items,
    **kwargs
) -> List[Tuple[bytes, int, str]]:
    """
    Transmit multiple sensor readings in one call.
    
    Args:
        batch_items: List of sensor data dicts or lists
        **kwargs: Base parameters applied to each item
    
    Returns:
        List of (binary_packet, assigned_id, strategy) tuples
    """
```

**Example:**
```python
results = node.transmit_batch([
    {'sensors': [['V1', 'OK', 3.14, 'Pa']]},
    {'sensors': [['T1', 'OK', 25.3, 'Cel']]},
    {'sensors': [['H1', 'OK', 65.0, '%']]},
])
# results = [
#     (packet1, aid, strategy1),
#     (packet2, aid, strategy2),
#     (packet3, aid, strategy3),
# ]
```

#### Method: `dispatch()`

**Signature:**
```python
def dispatch(
    packet,
    medium=None
) -> bool:
    """
    Send binary packet through transporter layer.
    
    Args:
        packet: Binary data from transmit() (bytes/bytearray)
        medium: Transporter name ('UDP', 'TCP', 'MQTT', 'UART', etc.)
                If None, uses config default (usually 'UDP')
    
    Returns:
        bool: True if packet sent successfully
    """
```

**Example:**
```python
packet, aid, strategy = node.transmit([['V1', 'OK', 3.14, 'Pa']])
success = node.dispatch(packet, medium='UDP')
if success:
    print(f"✓ Sent {len(packet)} bytes via UDP")
else:
    print("✗ Send failed")
```

#### Method: `dispatch_with_reply()`

```python
def dispatch_with_reply(
    packet,
    server_ip=None,
    server_port=None,
    timeout=3.0
) -> Optional[bytes]:
    """
    Send packet and wait for reply from server.
    
    Returns:
        bytes: Response from server, or None if timeout
    """
```

#### Method: `ensure_id()`

```python
def ensure_id(
    server_ip,
    server_port,
    device_meta=None,
    timeout=5.0
) -> bool:
    """
    Request and persist device ID from server.
    Required before calling transmit().
    
    Args:
        server_ip: IP of ID allocation server
        server_port: Port of ID allocation server
        device_meta: Optional dict with device info
                    {'type': 'sensor_node', 'hw': 'ESP32'}
        timeout: Request timeout in seconds
    
    Returns:
        bool: True if ID successfully obtained and stored
    """
```

**Example:**
```python
success = node.ensure_id(
    server_ip='192.168.1.100',
    server_port=8080,
    device_meta={'type': 'sensor_node', 'hw': 'ESP32'}
)
if success:
    print(f"✓ ID assigned: {node.assigned_id}")
```

#### Method: `ensure_time()`

```python
def ensure_time(
    server_ip=None,
    server_port=None,
    timeout=3.0
) -> Optional[int]:
    """
    Sync device time with server.
    Automatically called if timestamp is too old.
    
    Returns:
        int: Server timestamp, or None if sync failed
    """
```

#### Method: `receive()`

```python
def receive(raw_bytes) -> dict:
    """
    Decompress and parse a received binary packet.
    
    Returns:
        dict: Decoded sensor data with keys:
              - 'id': device_id
              - 's': device status
              - 't': timestamp
              - 's1_id', 's1_v', 's1_u': sensor 1 id/value/unit
              - 's2_id', 's2_v', 's2_u': sensor 2 id/value/unit
              - ... (for each sensor)
    """
```

---

## CLI Commands

### Command: `transmit` (aka `os-transmit`)

Send a single or multiple sensor readings via command line.

**Usage:**
```bash
os-node transmit [OPTIONS]
python -u src/main.py transmit [OPTIONS]
```

**Options:**

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `--config PATH` | str | auto-detected | Path to Config.json |
| `--sensor-id ID` | str | `'V1'` | Sensor identifier (single mode) |
| `--sensor-status ST` | str | `'OK'` | Sensor status (single mode) |
| `--value VAL` | float | `1.0` | Sensor value (single mode) |
| `--unit UNIT` | str | `'Pa'` | UCUM unit (single mode) |
| `--sensors JSON` | str | - | Multi-sensor JSON array (overrides single mode) |
| `--sensors-file PATH` | str | - | File containing JSON sensor array |
| `--device-id ID` | str | config default | Override device ID |
| `--status ST` | str | `'ONLINE'` | Device status |
| `--medium TRANS` | str | config default | Transporter ('UDP', 'TCP', 'MQTT', etc.) |

**Examples:**

Single sensor:
```bash
os-node transmit --value 3.14 --unit Pa
os-node transmit --sensor-id V1 --value 25.3 --unit Cel
```

Multiple sensors:
```bash
os-node transmit --sensors '[["V1","OK",3.14,"Pa"],["T1","OK",25.3,"Cel"]]'
```

From file:
```bash
os-node transmit --sensors-file sensors.json --device-id HUB_01
```

Custom transporter:
```bash
os-node transmit --value 42 --unit Pa --medium TCP
os-node transmit --value 42 --unit Pa --medium MQTT
```

Output format (JSON):
```json
{
  "assigned_id": 42,
  "strategy": "FULL_PACKET",
  "packet_len": 24,
  "packet_cmd": 16,
  "dispatch_path": "driver",
  "sensors_count": 1,
  "sent": true
}
```

### Command: `inject` (pipeline debugging)

Test individual pipeline stages without dispatching.

**Usage:**
```bash
os-node inject --module STAGE [OPTIONS]
```

**Stages:**
- `standardize`: Convert sensor data to internal fact format
- `compress`: Apply Base62 compression
- `fuse`: Fuse into binary packet (requires FULL strategy)
- `full`: Run all stages (standardize → compress → fuse)

**Example:**
```bash
# Test standardization
os-node inject --module standardize --value 3.14 --unit Pa

# Test compression
os-node inject --module compress --value 25.3 --unit Cel

# Full pipeline
os-node inject --module full --sensors '[["V1","OK",3.14,"Pa"],["T1","OK",25.3,"Cel"]]'
```

---

## REST/HTTP APIs

### Web UI Service: `web_user` plugin

Start the management dashboard:
```bash
os-node web-user --cmd start -- --host 127.0.0.1 --port 8765 --block
os-web --cmd start -- --host 127.0.0.1 --port 8765 --block
```

Then open: `http://127.0.0.1:8765/`

### HTTP Endpoint: POST /api/oscli/execute

Execute OpenSynaptic CLI commands via HTTP.

**Request:**
```http
POST /api/oscli/execute
Content-Type: application/json
X-Admin-Token: <admin_token>  # if auth_enabled=true

{
  "command": "transmit --value 3.14 --unit Pa",
  "background": false
}
```

**Response:**
```json
{
  "ok": true,
  "job_id": "uuid-here",
  "status": "completed",
  "stdout": "{\"assigned_id\": 42, \"sent\": true}",
  "stderr": "",
  "exit_code": 0
}
```

### HTTP Endpoint: GET /api/dashboard

Retrieve system status, ID info, and transporter states.

```http
GET /api/dashboard
```

Response includes:
- Device ID and assigned physical ID
- Transporter availability (UDP, TCP, MQTT, etc.)
- Service statuses
- Pipeline configuration

### HTTP Endpoint: PUT /api/config

Update configuration (requires admin token).

```http
PUT /api/config
Content-Type: application/json
X-Admin-Token: <admin_token>

{
  "engine_settings": {
    "precision": 6
  }
}
```

### HTTP Endpoint: PUT /api/options

Batch update runtime options.

```http
PUT /api/options
Content-Type: application/json

{
  "updates": [
    {
      "key": "engine_settings.precision",
      "value": 6,
      "value_type": "int"
    },
    {
      "key": "OpenSynaptic_Setting.default_medium",
      "value": "TCP",
      "value_type": "str"
    }
  ]
}
```

---

## Request/Payload Formats

### Sensor Data Format (Pre-transmission)

Sensors are provided as a list of 4-tuples in UCUM standard:

```python
[
    [sensor_id, status, value, unit],
    [sensor_id, status, value, unit],
    ...
]
```

**Fields:**
- **`sensor_id`** (str): Unique identifier (e.g., 'V1', 'T1', 'H1')
- **`status`** (str): Sensor state ('OK', 'ERROR', 'OFFLINE', etc.)
- **`value`** (float/int): Numeric measurement
- **`unit`** (str): UCUM unit code
  - Common: `'Pa'` (pressure), `'Cel'` (Celsius), `'%'` (percent), `'m'` (meter)
  - Full list: `libraries/Units/*.json`

**Example valid sensors:**
```python
[
    ['V1', 'OK', 101325.0, 'Pa'],     # Pressure (Pascals)
    ['T1', 'OK', 25.3, 'Cel'],        # Temperature (Celsius)
    ['H1', 'OK', 65.0, '%'],          # Humidity (percent)
    ['Bat', 'OK', 3.7, 'V'],          # Battery voltage
    ['RSSI', 'OK', -75, 'dBm'],       # Signal strength
]
```

### Internal Format After Standardization

The standardizer converts to a "fact" dict:

```python
{
    'id': device_id,                # Device identifier
    's': device_status,             # Status
    't': timestamp,                 # Unix seconds
    's1_id': 'V1',                  # Sensor 1 ID
    's1_v': 101325.0,               # Sensor 1 value
    's1_u': 'Pa',                   # Sensor 1 unit
    's2_id': 'T1',
    's2_v': 25.3,
    's2_u': 'Cel',
    # ... additional fields
}
```

### Binary Packet Format (After Transmission)

The packet returned from `transmit()` is a binary blob:
- **Type:** `bytes` or `bytearray`
- **Length:** Varies (typically 10-80 bytes)
- **Structure:** 2-N-2 encoded format
  - Header: command byte + sequence info
  - Payload: compressed sensor data
  - Trailer: checksum/metadata

Use `node.receive(binary_packet)` to decode.

### JSON Response Format from `transmit()`

```python
packet, assigned_id, strategy = node.transmit(sensors=[...])
# assigned_id: int (e.g., 42)
# strategy: str ('FULL_PACKET' or 'DIFF_PACKET')
```

---

## Usage Examples

### Example 1: Basic Single-Sensor Send

```python
from opensynaptic.core import OpenSynaptic

# Initialize
node = OpenSynaptic()

# Ensure device has an ID
if node._is_id_missing():
    node.ensure_id(
        server_ip='192.168.1.100',
        server_port=8080,
        device_meta={'type': 'sensor_node', 'hw': 'ESP32'}
    )

# Send one sensor
sensors = [['V1', 'OK', 3.14, 'Pa']]
packet, aid, strategy = node.transmit(sensors=sensors)
success = node.dispatch(packet, medium='UDP')

print(f"Sent {len(packet)} bytes, strategy={strategy}, success={success}")
```

### Example 2: Multi-Sensor Transmission

```python
# Multiple sensors in one packet
sensors = [
    ['V1', 'OK', 101325, 'Pa'],      # Pressure
    ['T1', 'OK', 25.3, 'Cel'],       # Temperature
    ['H1', 'OK', 65.0, '%'],         # Humidity
    ['Bat', 'OK', 3.7, 'V'],         # Battery
]

packet, aid, strategy = node.transmit(
    sensors=sensors,
    device_id='HUB_01',
    device_status='ONLINE',
)
success = node.dispatch(packet, medium='UDP')
```

### Example 3: Batch Transmission

```python
batch = [
    {'sensors': [['V1', 'OK', 3.14, 'Pa']]},
    {'sensors': [['T1', 'OK', 25.3, 'Cel']]},
    {'sensors': [['H1', 'OK', 65.0, '%']]},
]

results = node.transmit_batch(batch)

for i, (packet, aid, strategy) in enumerate(results):
    success = node.dispatch(packet, medium='UDP')
    print(f"Item {i}: sent={success}, len={len(packet)}")
```

### Example 4: Custom Timestamp

```python
import time

packet, aid, strategy = node.transmit(
    sensors=[['V1', 'OK', 3.14, 'Pa']],
    t=int(time.time() - 3600)  # 1 hour ago
)
success = node.dispatch(packet)
```

### Example 5: Using Different Transporters

```python
sensors = [['V1', 'OK', 3.14, 'Pa']]
packet, aid, strategy = node.transmit(sensors=sensors)

# Try multiple transporter options
for medium in ['UDP', 'TCP', 'MQTT']:
    try:
        success = node.dispatch(packet, medium=medium)
        if success:
            print(f"✓ Sent via {medium}")
            break
    except Exception as e:
        print(f"✗ {medium} failed: {e}")
```

### Example 6: Receive and Echo

```python
# Sender
packet, aid, strategy = node.transmit([['V1', 'OK', 3.14, 'Pa']])
node.dispatch(packet, medium='UDP')

# Receiver (on another node or same node)
received_bytes = receive_from_network()  # e.g., UDP socket
decoded = node.receive(received_bytes)

print(decoded)
# Output:
# {
#     'id': 'DEMO_NODE',
#     's': 'ONLINE',
#     't': 1710000000,
#     's1_id': 'V1',
#     's1_v': 3.14,
#     's1_u': 'Pa',
#     ...
# }
```

### Example 7: CLI via Python subprocess

```python
import subprocess
import json

# Single sensor
result = subprocess.run([
    'python', '-u', 'src/main.py', 'transmit',
    '--value', '3.14',
    '--unit', 'Pa',
    '--medium', 'UDP'
], capture_output=True, text=True)

output = json.loads(result.stdout)
print(f"✓ Sent: {output['sent']}, length={output['packet_len']}")

# Multiple sensors via JSON
sensors_json = '[["V1","OK",3.14,"Pa"],["T1","OK",25.3,"Cel"]]'
result = subprocess.run([
    'python', '-u', 'src/main.py', 'transmit',
    '--sensors', sensors_json,
    '--medium', 'TCP'
], capture_output=True, text=True)
```

### Example 8: HTTP-based Transmission (via web_user service)

```python
import requests
import json

# Start web service first:
# os-web --cmd start -- --host 127.0.0.1 --port 8765 --block

# Execute CLI command via REST
response = requests.post(
    'http://127.0.0.1:8765/api/oscli/execute',
    json={
        'command': 'transmit --value 3.14 --unit Pa',
        'background': False
    }
)

result = response.json()
if result['ok']:
    output = json.loads(result['stdout'])
    print(f"✓ Status: {result['status']}, sent={output['sent']}")
```

---

## Transporter Support

The `medium` parameter in `dispatch()` selects the transporter layer:

### Built-in Transporters

| Medium | Type | Layer | Default Port | Config Key |
|--------|------|-------|--------------|------------|
| **UDP** | Socket | L4 | 8080 | `transport_options.port` |
| **TCP** | Socket | L4 | 8888 | `transport_options.port` |
| **QUIC** | Socket | L4 | 4433 | `transport_options.port` |
| **MQTT** | Pub/Sub | L7 | 1883 | `application_config.mqtt` |
| **UART** | Serial | L1 | COM1/ttyUSB0 | `physical_config.uart` |
| **RS485** | Serial | L1 | COM1/ttyUSB0 | `physical_config.rs485` |
| **CAN** | Bus | L1 | N/A | `physical_config.can` |
| **LoRa** | Radio | L1 | N/A | `physical_config.lora` |
| **Bluetooth** | Radio | L1 | 5454 | `physical_config.bluetooth` |
| **IWIP** | Embedded | L4 | N/A | `transport_config.iwip` |
| **UIP** | Embedded | L4 | N/A | `transport_config.uip` |

### Configuration Example (Config.json)

```json
{
  "RESOURCES": {
    "transport_status": {
      "udp": true,
      "tcp": true,
      "mqtt": false,
      "quic": false
    },
    "transport_config": {
      "udp": {
        "host": "127.0.0.1",
        "port": 8080
      },
      "tcp": {
        "host": "127.0.0.1",
        "port": 8888
      }
    },
    "physical_status": {
      "uart": true,
      "rs485": false,
      "can": false
    },
    "physical_config": {
      "uart": {
        "port": "COM1",
        "baudrate": 9600
      }
    }
  }
}
```

---

## Advanced Features

### 1. Retry Configuration

Configure automatic retries in `engine_settings`:

```python
config = node.config
config['engine_settings']['network_retry'] = {
    'enabled': True,
    'max_retries': 3,
    'interval_seconds': 0.5
}
node._save_config()
```

Or via CLI:
```bash
os-node config-set --key engine_settings.network_retry.max_retries --value 3 --type int
```

### 2. Batching (Rscore only)

Enable transmission batching for high throughput:

```python
config['engine_settings']['tx_batch_enabled'] = True
config['engine_settings']['tx_batch_window_ms'] = 100
config['engine_settings']['tx_batch_max_items'] = 50
```

Query batch metrics:
```python
metrics = node.get_last_batch_metrics()
print(f"Batch size: {metrics['count']}")
print(f"Timing: {metrics['stage_timing_ms']}")
```

### 3. Precision Control

Adjust compression precision (0-10, default 4):

```python
node.config['engine_settings']['precision'] = 6
node._save_config()
```

Higher precision = better accuracy, larger packets.

### 4. Zero-Copy Transport

Enable for low-latency scenarios:

```python
node.config['engine_settings']['zero_copy_transport'] = True
```

### 5. Dispatch Path Tracking (Rscore)

Get information about which driver was used:

```python
packet, aid, strategy = node.transmit([['V1', 'OK', 3.14, 'Pa']])
node.dispatch(packet, medium='UDP')

# Check which driver was actually used
dispatch_path = node.get_last_dispatch_path()
print(f"Used path: {dispatch_path}")  # 'ffi', 'driver', or 'none'
```

### 6. ID Leasing (Long-lived Devices)

Configure ID lease policy:

```json
{
  "security_settings": {
    "id_lease": {
      "offline_hold_days": 30,
      "base_lease_seconds": 2592000,
      "adaptive_enabled": true,
      "metrics_flush_seconds": 10
    }
  }
}
```

Query metrics:
```bash
os-node config-get --key security_settings.id_lease.metrics
```

### 7. Secure Data Transmission

When secure sessions are configured:
- Handshake protocol automatically engaged
- Plaintext detection logging
- Secure command bytes used in packet header

```python
node.config['security_settings']['secure_session_expire_seconds'] = 86400
```

### 8. Pipeline Introspection

Get information about active pipeline:

```bash
os-node pipeline-info
# Outputs: precision, zero-copy enabled, cache state, etc.

os-node watch --module pipeline --interval 1
# Live monitor pipeline changes
```

### 9. Service Integration

Mount additional plugins for custom send workflows:

```python
from opensynaptic.services import ServiceManager

service_mgr = node.service_manager
service_mgr.load('db_engine')  # Enable SQL export
service_mgr.load('deps')       # Dependency manager
```

---

## Troubleshooting

### "Device has no assigned ID"

**Error:** `RuntimeError: Device 'DEMO_NODE' has no assigned physical ID. Call ensure_id() first.`

**Solution:**
```python
node.ensure_id(
    server_ip='<server_ip>',
    server_port=8080,
    device_meta={'type': 'sensor_node'}
)
```

Or via CLI:
```bash
os-node ensure-id --host <server_ip> --port 8080
```

### "No available driver"

**Error:** `No available driver: <medium>`

**Check:**
```bash
os-node status
# Lists active transporters

os-node transport-status
# Detailed transporter info
```

**Enable in config:**
```bash
os-node transporter-toggle --name uart --enable
```

### "Dispatch failed"

**Debug:**
```bash
# Check dispatch path
os-node config-show | grep dispatch

# Inspect recent packets
os-node snapshot | jq .transporters_status
```

**Verify serial/network configuration:**
```bash
# For UART
os-node config-get --key RESOURCES.physical_config.uart

# For UDP/TCP
os-node config-get --key RESOURCES.transport_config
```

### Timestamp Sync Issues

If timestamps are rejected:
```python
# Manually sync time
server_time = node.ensure_time(
    server_ip='<server_ip>',
    server_port=8080,
    timeout=3.0
)
```

---

## See Also

- Full architecture: [docs/ARCHITECTURE.md](../ARCHITECTURE)
- Configuration schema: [docs/CONFIG_SCHEMA.md](../CONFIG_SCHEMA)
- Transport layer guide: [docs/TRANSPORTER_PLUGIN.md](../TRANSPORTER_PLUGIN)
- CLI reference: [src/opensynaptic/CLI/README.md](../internal/internal-CLI_README)
- Test examples: [tests/integration/test_pipeline_e2e.py](https://github.com/OpenSynaptic/OpenSynaptic/blob/main/tests/integration/test_pipeline_e2e.py)
