---
id: 03-decode-paths
title: 解码路径
sidebar_label: 解码路径
---

# 解码路径

OSynaptic-RX 提供两条独立的解码路径，根据传输方式选择其一。

## 路径 A — 流式解析器

适用于传输层逐字节交付、无自然帧边界的场合（UART、RS-485、USB-CDC）。

**工作原理：**
1. 每收到一个字节调用 `osrx_feed_byte(&parser, b)`
2. 通过 **15 ms 空闲间隔**（无字节到达）检测帧结束
3. 调用 `osrx_feed_done(&parser)` 触发解析与回调

**内存开销：** OSRXParser = 102 B RAM + ~316 B Flash

```c
static OSRXParser parser;
// 在 setup() 中：
osrx_parser_init(&parser, my_callback, NULL);
// 在 ISR 或轮询中：
osrx_feed_byte(&parser, incoming_byte);
// 检测到空闲间隔后：
osrx_feed_done(&parser);
```

## 路径 B — 直接帧解码

适用于传输层提供完整帧的场合（UDP 数据报、LoRa 数据包、SPI 帧）。

**工作原理：**
- 每收到一个数据报调用一次 `osrx_sensor_recv(buf, len, &meta, &field)`
- 成功返回 1；meta 和 field 立即填充

**内存开销：** 0 B RAM（无需 OSRXParser）。设置 `OSRX_NO_PARSER=1` 可从编译中排除解析器代码。

```c
// 收到 UDP 数据报时：
osrx_packet_meta  meta;
osrx_sensor_field field;
if (osrx_sensor_recv(udp_buf, udp_len, &meta, &field)) {
    // 使用 field.sensor_id, field.unit, field.scaled
}
```

## 对比

| | 流式模式 | 直接模式 |
|---|---|---|
| RAM | 102 B（OSRXParser）| 0 B |
| Flash | ~616 B（完整）| ~442 B |
| 传输介质 | UART、RS-485 | UDP、LoRa、SPI |
| 帧边界检测 | 15 ms 空闲间隔 | 自然边界（数据报/片选信号）|
| 多通道 | 每通道一个解析器 | 不适用 |
