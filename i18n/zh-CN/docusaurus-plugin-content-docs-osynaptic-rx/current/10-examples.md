---
id: 10-examples
title: 示例
sidebar_label: 示例
---

# 示例

所有示例均可使用 Arduino IDE 和 CMake 编译。参见仓库中的 [examples 文件夹](https://github.com/OpenSynaptic/OSynaptic-RX/tree/main/examples)。

## 示例索引

| 示例 | 传输方式 | 模式 | 目标平台 |
|---|---|---|---|
| BasicRX | UART（空闲间隔）| 流式 | 任意 Arduino |
| MultiSensorRX | UART（空闲间隔）| 流式 | 任意 Arduino — AID + 传感器分发 |
| ESP32UdpRX | WiFi UDP | osrx_feed_bytes | ESP32 / ESP8266 |
| LoRaRX | LoRa SX1276 | 直接（osrx_sensor_recv）| Heltec / TTGO / Uno + 扩展板 |
| BareMetalUARTRX | USART0 寄存器 | 流式，无 Serial 开销 | ATmega328P |

## BasicRX

最小可用接收器：流式 UART，单解析器，通过 Serial 打印解码值。

[查看源码 →](https://github.com/OpenSynaptic/OSynaptic-RX/tree/main/examples/BasicRX)

## MultiSensorRX

按 AID（节点 ID）将解码帧分发到各自的处理函数，演示多传感器节点接收。

[查看源码 →](https://github.com/OpenSynaptic/OSynaptic-RX/tree/main/examples/MultiSensorRX)

## ESP32UdpRX

ESP32/ESP8266 完整 Wi-Fi UDP 接收器。使用 `osrx_feed_bytes()`——无需解析器实例。

[查看源码 →](https://github.com/OpenSynaptic/OSynaptic-RX/tree/main/examples/ESP32UdpRX)

## LoRaRX

LoRa SX1276 接收器。在 `onReceive` 回调中直接调用 `osrx_sensor_recv()`，记录 RSSI 和 SNR。

[查看源码 →](https://github.com/OpenSynaptic/OSynaptic-RX/tree/main/examples/LoRaRX)

## BareMetalUARTRX

直接从 AVR USART0 寄存器喂入字节（无 Arduino Serial 开销），ATmega328P 上可实现最低延迟。

[查看源码 →](https://github.com/OpenSynaptic/OSynaptic-RX/tree/main/examples/BareMetalUARTRX)
