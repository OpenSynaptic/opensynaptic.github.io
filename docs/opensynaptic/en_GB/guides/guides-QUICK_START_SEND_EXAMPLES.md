# OpenSynaptic Send API - Quick Start Examples

Copy-paste examples for the most common sending scenarios.

---

## 1. Minimal Python Example

```python
from opensynaptic.core import OpenSynaptic

node = OpenSynaptic()

# Send one pressure reading
sensors = [['V1', 'OK', 3.14, 'Pa']]
packet, aid, strategy = node.transmit(sensors=sensors)
success = node.dispatch(packet, medium='UDP')

print(f"Sent: {success}, size: {len(packet)} bytes, strategy: {strategy}")
```

**Required first:**
```bash
os-node ensure-id --host <server_ip> --port 8080
```

---

## 2. Full Workflow: Initialization → Transmit → Dispatch

```python
from opensynaptic.core import OpenSynaptic

def send_sensor_data():
    # Create node instance
    node = OpenSynaptic(config_path='~/.config/opensynaptic/Config.json')
    
    # Step 1: Ensure device has a physical ID from server
    if node._is_id_missing():
        print("Requesting device ID...")
        success = node.ensure_id(
            server_ip='192.168.1.100',
            server_port=8080,
            device_meta={
                'type': 'sensor_node',
                'hw': 'ESP32',
                'firmware': '1.0.0'
            },
            timeout=5.0
        )
        if not success:
            print("ERROR: Could not get device ID")
            return False
        print(f"✓ Got ID: {node.assigned_id}")
    
    # Step 2: Prepare sensor data in UCUM format
    sensors = [
        ['Temp', 'OK', 23.5, 'Cel'],          # Celsius
        ['Humidity', 'OK', 55.0, '%'],        # Percent
        ['Pressure', 'OK', 101325, 'Pa'],     # Pascals
    ]
    
    # Step 3: Standardize, compress, and fuse into binary packet
    try:
        packet, assigned_id, strategy = node.transmit(
            sensors=sensors,
            device_id='MyDevice',
            device_status='ONLINE',
        )
        print(f"✓ Packet created: {len(packet)} bytes, strategy={strategy}")
    except Exception as e:
        print(f"ERROR during transmit: {e}")
        return False
    
    # Step 4: Dispatch packet over network/serial/etc.
    try:
        sent = node.dispatch(packet, medium='UDP')
        if sent:
            print(f"✓ Sent via UDP")
            return True
        else:
            print(f"✗ UDP send failed, retrying with TCP...")
            sent = node.dispatch(packet, medium='TCP')
            if sent:
                print(f"✓ Sent via TCP")
                return True
            else:
                print("✗ All sends failed")
                return False
    except Exception as e:
        print(f"ERROR during dispatch: {e}")
        return False

if __name__ == '__main__':
    success = send_sensor_data()
    exit(0 if success else 1)
```

---

## 3. CLI One-Liners

**Single sensor (temperature):**
```bash
os-node transmit --sensor-id T1 --value 25.3 --unit Cel
```

**Multiple sensors (JSON):**
```bash
os-node transmit --sensors '[["T1","OK",25.3,"Cel"],["H1","OK",65.0,"%"],["P1","OK",101325,"Pa"]]'
```

**Via TCP instead of UDP:**
```bash
os-node transmit --value 3.14 --unit Pa --medium TCP
```

**With custom device ID:**
```bash
os-node transmit --value 42 --unit Pa --device-id HUB_01 --status ONLINE
```

**From JSON file:**
```bash
# sensors.json contains:
# [["V1","OK",3.14,"Pa"],["T1","OK",25.3,"Cel"]]

os-node transmit --sensors-file sensors.json
```

---

## 4. Multi-Sensor Batch Transmission

```python
from opensynaptic.core import OpenSynaptic

node = OpenSynaptic()

# Prepare multiple readings
batch = [
    {'sensors': [['V1', 'OK', 3.14, 'Pa']]},
    {'sensors': [['T1', 'OK', 25.3, 'Cel']]},
    {'sensors': [['H1', 'OK', 65.0, '%']]},
    {'sensors': [['Bat', 'OK', 3.7, 'V']]},
]

# Transmit and dispatch all
results = node.transmit_batch(batch, device_id='MultiSensor')

for i, (packet, aid, strategy) in enumerate(results):
    success = node.dispatch(packet, medium='UDP')
    print(f"[{i}] sent={success}, len={len(packet)} bytes")
```

---

## 5. Send with Timestamp Override

```python
import time
from opensynaptic.core import OpenSynaptic

node = OpenSynaptic()

# Send with 1-hour-old timestamp
one_hour_ago = int(time.time()) - 3600

packet, aid, strategy = node.transmit(
    sensors=[['V1', 'OK', 3.14, 'Pa']],
    t=one_hour_ago
)
success = node.dispatch(packet)
```

---

## 6. Try Multiple Transporters (Fallback Chain)

```python
from opensynaptic.core import OpenSynaptic

def send_with_fallback(node, packet):
    """Try UDP → TCP → MQTT."""
    
    for medium in ['UDP', 'TCP', 'MQTT']:
        try:
            print(f"Trying {medium}...")
            success = node.dispatch(packet, medium=medium)
            if success:
                print(f"✓ Success via {medium}")
                return True
        except Exception as e:
            print(f"  ✗ {medium} failed: {e}")
    
    print("✗ All transporters failed")
    return False

# Usage:
node = OpenSynaptic()
packet, aid, strategy = node.transmit([['V1', 'OK', 3.14, 'Pa']])
send_with_fallback(node, packet)
```

---

## 7. Receive and Echo Test

```python
import socket
from opensynaptic.core import OpenSynaptic

node = OpenSynaptic()

# Receive on UDP 8080
sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
sock.bind(('127.0.0.1', 8080))

print("Listening on UDP 127.0.0.1:8080...")
data, addr = sock.recvfrom(4096)

# Decode the packet
decoded = node.receive(data)

print(f"From {addr}:")
print(f"  Device: {decoded.get('id')}")
print(f"  Status: {decoded.get('s')}")
print(f"  Timestamp: {decoded.get('t')}")

# Extract sensors
i = 1
while f's{i}_id' in decoded:
    sensor_id = decoded[f's{i}_id']
    value = decoded[f's{i}_v']
    unit = decoded[f's{i}_u']
    print(f"  Sensor {i}: {sensor_id} = {value} {unit}")
    i += 1

sock.close()
```

---

## 8. Subprocess Call from Another Language

```python
import subprocess
import json
import sys

def send_via_cli(value, unit):
    """Call 'os-node transmit' and parse result."""
    
    result = subprocess.run([
        sys.executable, '-u', 'src/main.py', 'transmit',
        '--value', str(value),
        '--unit', unit,
    ], capture_output=True, text=True)
    
    if result.returncode != 0:
        print(f"ERROR: {result.stderr}")
        return False
    
    output = json.loads(result.stdout)
    return output['sent']

# Usage:
if send_via_cli(3.14, 'Pa'):
    print("✓ Sent successfully")
else:
    print("✗ Send failed")
```

---

## 9. HTTP-based Transmission (Via web_user Service)

```python
import requests
import json
import time

# Start service: os-web --cmd start -- --host 127.0.0.1 --port 8765 --block

def send_via_http(value, unit, transporter='UDP'):
    """Execute 'os-node transmit' via REST API."""
    
    command = f'transmit --value {value} --unit {unit} --medium {transporter}'
    
    response = requests.post(
        'http://127.0.0.1:8765/api/oscli/execute',
        json={
            'command': command,
            'background': False
        },
        timeout=10
    )
    
    result = response.json()
    if result['ok']:
        output = json.loads(result['stdout'])
        return output.get('sent', False)
    else:
        print(f"ERROR: {result}")
        return False

# Usage:
if send_via_http(3.14, 'Pa', 'UDP'):
    print("✓ HTTP-based send successful")
```

---

## 10. Poll-based Continuous Sending

```python
import time
from opensynaptic.core import OpenSynaptic

def continuous_polling(interval=5, duration=60):
    """Send temperature readings every N seconds."""
    
    node = OpenSynaptic()
    
    if node._is_id_missing():
        print("ERROR: Device ID not set")
        return
    
    start_time = time.time()
    count = 0
    
    while time.time() - start_time < duration:
        try:
            # Simulate sensor reading
            temp = 20.0 + (count % 10) * 0.5
            
            # Send
            sensors = [['T1', 'OK', temp, 'Cel']]
            packet, aid, strategy = node.transmit(sensors=sensors)
            success = node.dispatch(packet, medium='UDP')
            
            print(f"[{count}] T={temp}°C, sent={success}")
            count += 1
            
            # Wait for next interval
            time.sleep(interval)
            
        except KeyboardInterrupt:
            print("\nStopped by user")
            break
        except Exception as e:
            print(f"ERROR: {e}")
            time.sleep(interval)

# Usage:
continuous_polling(interval=2, duration=30)  # Send every 2 sec for 30 sec total
```

---

## 11. Sensor Data from File

```python
import json
from opensynaptic.core import OpenSynaptic

# File: sensors.json
# [
#   ["T1", "OK", 25.3, "Cel"],
#   ["H1", "OK", 65.0, "%"],
#   ["P1", "OK", 101325, "Pa"]
# ]

def send_from_file(filepath):
    """Load sensors from JSON file and send."""
    
    with open(filepath, 'r') as f:
        sensors = json.load(f)
    
    node = OpenSynaptic()
    packet, aid, strategy = node.transmit(sensors=sensors)
    success = node.dispatch(packet, medium='UDP')
    
    print(f"Sent {len(sensors)} sensors, success={success}")
    return success

# Usage:
send_from_file('sensors.json')
```

---

## 12. Error Handling and Retry

```python
import time
from opensynaptic.core import OpenSynaptic

def send_with_retry(sensors, max_retries=3, retry_delay=1.0):
    """Send with automatic retry on failure."""
    
    node = OpenSynaptic()
    
    try:
        packet, aid, strategy = node.transmit(sensors=sensors)
    except Exception as e:
        print(f"ERROR during transmit: {e}")
        return False
    
    for attempt in range(1, max_retries + 1):
        try:
            success = node.dispatch(packet, medium='UDP')
            if success:
                print(f"✓ Success on attempt {attempt}")
                return True
            else:
                print(f"Attempt {attempt}: dispatch returned False")
        except Exception as e:
            print(f"Attempt {attempt}: {e}")
        
        if attempt < max_retries:
            print(f"Retrying in {retry_delay}s...")
            time.sleep(retry_delay)
    
    print(f"✗ Failed after {max_retries} attempts")
    return False

# Usage:
sensors = [['V1', 'OK', 3.14, 'Pa']]
send_with_retry(sensors, max_retries=3, retry_delay=2.0)
```

---

## 13. Real-time Dashboard via CLI

```bash
# Start interactive TUI with live updates
os-node tui --interactive

# Or: watch pipeline state
os-node watch --module pipeline --interval 1

# Or: poll dashboard API
while true; do
    os-node snapshot | jq '.device_status'
    sleep 5
done
```

---

## 14. Integration with External IoT Platform

```python
import requests
import json
from opensynaptic.core import OpenSynaptic

def forward_to_cloud(node, sensors):
    """Send locally, then forward to cloud."""
    
    # Local send
    packet, aid, strategy = node.transmit(sensors=sensors)
    local_ok = node.dispatch(packet, medium='UDP')
    
    # Cloud send (example: Azure IoT Hub)
    cloud_payload = {
        'deviceId': node.device_id,
        'assignedId': aid,
        'sensors': sensors,
        'strategy': strategy,
        'timestamp': int(time.time())
    }
    
    try:
        response = requests.post(
            'https://my-iot-hub.azure-devices.net/api/v1/telemetry',
            json=cloud_payload,
            headers={'Authorization': 'Bearer <token>'},
            timeout=5
        )
        cloud_ok = response.status_code == 200
    except Exception as e:
        print(f"Cloud send failed: {e}")
        cloud_ok = False
    
    return local_ok and cloud_ok

# Usage:
import time
node = OpenSynaptic()
sensors = [['T1', 'OK', 25.3, 'Cel']]
if forward_to_cloud(node, sensors):
    print("✓ Local and cloud transmission successful")
```

---

## 15. Config and State Inspection

```bash
# Show current device status
os-node status

# Show assigned ID
os-node id-info

# Show all transporters
os-node transport-status

# Show full config
os-node config-show

# Get specific config value
os-node config-get --key engine_settings.precision

# Set config value
os-node config-set --key engine_settings.precision --value 6 --type int

# Snapshot all state (JSON)
os-node snapshot | jq .
```

---

## Common UCUM Units

```
Pressure:    Pa, hPa, bar, mmHg, inHg
Temperature: Cel, K, [degF] (note Fahrenheit syntax)
Humidity:    %, [1], (dimensionless)
Length:      m, mm, cm, km, mi
Mass:        kg, g, mg, lb
Voltage:     V, mV
Current:     A, mA
Power:       W, mW, kW
Energy:      J, Wh, kWh
Frequency:   Hz, kHz, MHz
Time:        s, min, h, day, year
```

Full reference: `libraries/Units/*.json`

---

## Debugging Commands

```bash
# Check if native libraries are available
os-node native-check

# Test compression pipeline
os-node inject --module compress --value 25.3 --unit Cel

# Full pipeline test
os-node inject --module full --sensors '[["V1","OK",3.14,"Pa"],["T1","OK",25.3,"Cel"]]'

# Decode a hex packet
os-node decode --hex 1001f042a8c0

# Plugin test suite
os-node plugin-test --suite component

# Stress test with 1000 transmissions
os-node plugin-test --suite stress --total 1000

# Run diagnostic
os-node diagnose
```

---

## See Also

- Full API reference: [SEND_API_REFERENCE.md](../api/api-SEND_API_REFERENCE)
- Configuration details: [docs/CONFIG_SCHEMA.md](./docs/CONFIG_SCHEMA.md)
- CLI help: `os-node help`
- Example code in tests: [tests/integration/](./tests/integration/)
