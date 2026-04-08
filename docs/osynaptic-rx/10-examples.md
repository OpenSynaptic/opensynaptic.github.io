---
id: 10-examples
title: Examples
sidebar_label: Examples
---

# Examples

All examples compile with the Arduino IDE and CMake. See the [examples folder](https://github.com/OpenSynaptic/OSynaptic-RX/tree/main/examples) in the repository.

## Example Index

| Example | Transport | Mode | Target |
|---|---|---|---|
| BasicRX | UART (idle-gap) | Streaming | Any Arduino |
| MultiSensorRX | UART (idle-gap) | Streaming | Any Arduino — AID+sensor dispatch |
| ESP32UdpRX | WiFi UDP | osrx_feed_bytes | ESP32 / ESP8266 |
| LoRaRX | LoRa SX1276 | Direct (osrx_sensor_recv) | Heltec / TTGO / Uno + shield |
| BareMetalUARTRX | USART0 registers | Streaming, no Serial overhead | ATmega328P |

## BasicRX

Minimum viable receiver: streaming UART, single parser, print decoded values over Serial.

[View source →](https://github.com/OpenSynaptic/OSynaptic-RX/tree/main/examples/BasicRX)

## MultiSensorRX

Dispatches decoded frames by AID (agent ID) to separate handlers. Demonstrates multi-sensor node reception.

[View source →](https://github.com/OpenSynaptic/OSynaptic-RX/tree/main/examples/MultiSensorRX)

## ESP32UdpRX

Full Wi-Fi UDP receiver for ESP32/ESP8266. Uses osrx_feed_bytes() — no parser instance needed.

[View source →](https://github.com/OpenSynaptic/OSynaptic-RX/tree/main/examples/ESP32UdpRX)

## LoRaRX

LoRa SX1276 receiver. Calls osrx_sensor_recv() directly inside the onReceive callback. Logs RSSI and SNR.

[View source →](https://github.com/OpenSynaptic/OSynaptic-RX/tree/main/examples/LoRaRX)

## BareMetalUARTRX

Feeds bytes from AVR USART0 register directly (no Arduino Serial overhead). Lowest possible latency on ATmega328P.

[View source →](https://github.com/OpenSynaptic/OSynaptic-RX/tree/main/examples/BareMetalUARTRX)
