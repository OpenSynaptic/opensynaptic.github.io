---
id: 10-examples
title: Examples
sidebar_label: Examples
---

# Examples

All examples are in the [examples folder](https://github.com/OpenSynaptic/OSynaptic-TX/tree/main/examples).

## Example Index

| Example | API Tier | Transport | Target |
|---|---|---|---|
| `BasicTX` | C (stream) | UART | Any Arduino |
| `MultiSensorTX` | C (stream) | UART | Any Arduino — 3 sensors |
| `ESP32UdpTX` | B (static) | WiFi UDP | ESP32 / ESP8266 |
| `LoRaTX` | B (static) | LoRa SX1276 | Heltec / TTGO / Uno + shield |
| `BareMetalUARTTX` | C (stream) | USART0 registers | ATmega328P |

---

## BasicTX

Minimum viable sender: one temperature sensor, Tier C, Serial output.

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

[View source →](https://github.com/OpenSynaptic/OSynaptic-TX/tree/main/examples/BasicTX)

---

## MultiSensorTX

Three sensors in one loop. Demonstrates sharing a single `tid` counter across multiple sensor descriptors.

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

[View source →](https://github.com/OpenSynaptic/OSynaptic-TX/tree/main/examples/MultiSensorTX)

---

## ESP32UdpTX

WiFi UDP transmitter. Builds a complete frame into a buffer then sends as a datagram.

```c
#include <WiFiUdp.h>
#include <OSynaptic-TX.h>

OSTX_STATIC_DEFINE(s_temp, 0x00000002UL, "T1", "Cel");

WiFiUDP udp;
static ostx_u8 buf[OSTX_PACKET_MAX];
static ostx_u8 tid = 0;

void setup() {
    WiFi.begin("SSID", "PASSWORD");
    while (WiFi.status() != WL_CONNECTED) delay(500);
}

void loop() {
    int n = ostx_static_pack(&s_temp, tid++,
                              (ostx_u32)(millis()/1000), 215000L, buf);
    if (n > 0) {
        udp.beginPacket("192.168.1.100", 9000);
        udp.write(buf, (size_t)n);
        udp.endPacket();
    }
    delay(1000);
}
```

[View source →](https://github.com/OpenSynaptic/OSynaptic-TX/tree/main/examples/ESP32UdpTX)

---

## LoRaTX

LoRa SX1276 transmitter (Heltec WiFi LoRa 32 / TTGO LoRa32).

```c
#include <LoRa.h>
#include <OSynaptic-TX.h>

OSTX_STATIC_DEFINE(s_temp, 0x00000003UL, "T1", "Cel");

static ostx_u8 buf[OSTX_PACKET_MAX];
static ostx_u8 tid = 0;

void setup() { LoRa.begin(915E6); }

void loop() {
    int n = ostx_static_pack(&s_temp, tid++,
                              (ostx_u32)(millis()/1000), 215000L, buf);
    if (n > 0 && LoRa.beginPacket()) {
        LoRa.write(buf, (size_t)n);
        LoRa.endPacket();
    }
    delay(5000);
}
```

[View source →](https://github.com/OpenSynaptic/OSynaptic-TX/tree/main/examples/LoRaTX)

---

## BareMetalUARTTX

No Arduino overhead — feeds bytes directly from USART0 registers on ATmega328P.

```c
#include <avr/io.h>
#include <OSynaptic-TX.h>

OSTX_STATIC_DEFINE(s_temp, 0x00000001UL, "T1", "Cel");

static void emit(ostx_u8 b, void*) {
    while (!(UCSR0A & (1 << UDRE0)));
    UDR0 = b;
}

static ostx_u8 tid = 0;

int main(void) {
    UBRR0H = 0; UBRR0L = 8;  /* 115200 at 16 MHz */
    UCSR0B = (1 << TXEN0);
    while (1) {
        ostx_stream_pack(&s_temp, tid++, 0, 215000L, emit, NULL);
        _delay_ms(1000);
    }
}
```

[View source →](https://github.com/OpenSynaptic/OSynaptic-TX/tree/main/examples/BareMetalUARTTX)
