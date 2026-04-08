---
id: 10-examples
title: 示例
sidebar_label: 示例
---

# 示例

所有示例均位于 [examples 文件夹](https://github.com/OpenSynaptic/OSynaptic-TX/tree/main/examples)。

## 示例索引

| 示例 | API 等级 | 传输方式 | 目标平台 |
|---|---|---|---|
| `BasicTX` | C（流式）| UART | 任意 Arduino |
| `MultiSensorTX` | C（流式）| UART | 任意 Arduino — 3 个传感器 |
| `ESP32UdpTX` | B（静态）| WiFi UDP | ESP32 / ESP8266 |
| `LoRaTX` | B（静态）| LoRa SX1276 | Heltec / TTGO / Uno + 扩展板 |
| `BareMetalUARTTX` | C（流式）| USART0 寄存器 | ATmega328P |

---

## BasicTX

最小可用发送器：一个温度传感器，等级 C，Serial 输出。

```c
#include <OSynaptic-TX.h>

OSTX_STATIC_DEFINE(s_temp, 0x00000001UL, "T1", "Cel");

static void emit(ostx_u8 b, void*) { Serial.write(b); }
static ostx_u8 tid = 0;

void setup() { Serial.begin(115200); }

void loop() {
    ostx_stream_pack(&s_temp, tid++,
                     (ostx_u32)(millis()/1000UL),
                     215000L,  /* 21.5000 °C */
                     emit, NULL);
    delay(1000);
}
```

[查看源码 →](https://github.com/OpenSynaptic/OSynaptic-TX/tree/main/examples/BasicTX)

---

## MultiSensorTX

在一个循环中发送三个传感器数据，演示多传感器描述符共用一个 `tid` 计数器。

```c
#include <OSynaptic-TX.h>

OSTX_STATIC_DEFINE(s_temp, 0x00000001UL, "T1",  "Cel");
OSTX_STATIC_DEFINE(s_hum,  0x00000001UL, "H1",  "Pct");
OSTX_STATIC_DEFINE(s_co2,  0x00000001UL, "CO2", "ppm");

static void emit(ostx_u8 b, void*) { Serial.write(b); }
static ostx_u8 tid = 0;

void loop() {
    ostx_u32 ts = (ostx_u32)(millis()/1000UL);
    ostx_stream_pack(&s_temp, tid++, ts, 215000L,  emit, NULL);
    ostx_stream_pack(&s_hum,  tid++, ts, 650000L,  emit, NULL);
    ostx_stream_pack(&s_co2,  tid++, ts, 8500000L, emit, NULL);
    delay(2000);
}
```

[查看源码 →](https://github.com/OpenSynaptic/OSynaptic-TX/tree/main/examples/MultiSensorTX)

---

## ESP32UdpTX

WiFi UDP 发送器。将完整帧构建到缓冲区后作为数据报发送。

[查看源码 →](https://github.com/OpenSynaptic/OSynaptic-TX/tree/main/examples/ESP32UdpTX)

---

## LoRaTX

LoRa SX1276 发送器。使用等级 B 构建帧，通过 `LoRa.write()` 发送。

[查看源码 →](https://github.com/OpenSynaptic/OSynaptic-TX/tree/main/examples/LoRaTX)

---

## BareMetalUARTTX

直接写入 AVR USART0 寄存器（无 Arduino Serial 开销），ATmega328P 上可实现最低发送延迟。

[查看源码 →](https://github.com/OpenSynaptic/OSynaptic-TX/tree/main/examples/BareMetalUARTTX)
