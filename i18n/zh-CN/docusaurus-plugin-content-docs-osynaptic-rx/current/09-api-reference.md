---
id: 09-api-reference
title: API 参考
sidebar_label: API 参考
---

# API 参考

OSynaptic-RX 提供五个头文件模块。新项目推荐从 `osrx_sensor.h` 入手。

---

## `osrx_sensor.h` — 一体化解码（推荐）

### `osrx_sensor_recv()`

```c
int osrx_sensor_recv(const osrx_u8        *packet,
                     int                   len,
                     osrx_packet_meta     *meta,
                     osrx_sensor_field    *field);
```

一次调用完成头部 + body 解码并校验两个 CRC。

| 参数 | 方向 | 描述 |
|---|---|---|
| `packet` | 输入 | 来自传输层的原始帧字节 |
| `len` | 输入 | `packet` 的字节数 |
| `meta` | 输出 | 解码后的头部字段；始终在返回时填充 |
| `field` | 输出 | 解码后的传感器字段；仅返回值非零时填充 |

**返回值：** 完全成功（结构解析 + 两个 CRC 均通过）返回 `1`，否则返回 `0`。

`meta->crc8_ok` 和 `meta->crc16_ok` 独立设置。返回 `0` 时若仅 CRC-16 失败，CRC-8 仍可能有效（反之亦然）。

### `osrx_sensor_unpack()`

```c
int osrx_sensor_unpack(const osrx_u8     *body,
                       int                body_len,
                       osrx_sensor_field *out);
```

仅将 body 片段 `"sid|unit|b62"` 解析为 `osrx_sensor_field`（不解码头部，不校验 CRC）。

---

## `osrx_parser.h` — 流式字节累积器

### `OSRXParser` 结构体

```c
typedef struct {
    osrx_u8   buf[OSRX_PACKET_MAX]; /* 累积缓冲区 */
    int       len;                   /* 已累积字节数 */
    osrx_frame_cb fn;                /* 用户回调 */
    void     *ctx;                   /* 用户上下文指针 */
} OSRXParser;
```

默认 `OSRX_PACKET_MAX=96` 时 RAM 占用：**102 字节**。

### 函数列表

| 函数 | 签名 | 描述 |
|---|---|---|
| `osrx_parser_init` | `(OSRXParser *p, osrx_frame_cb cb, void *ctx)` | 初始化解析器，注册回调 |
| `osrx_feed_byte` | `(OSRXParser *p, osrx_u8 b) → int` | 推入一个字节。溢出/重置时返回 `0`，否则返回 `1` |
| `osrx_feed_done` | `(OSRXParser *p) → int` | 标志帧结束；解析并调用回调。结构有效返回 `1` |
| `osrx_feed_bytes` | `(OSRXParser *p, const osrx_u8 *data, int len) → int` | 一次性喂入所有字节并调用 `osrx_feed_done` |
| `osrx_parser_reset` | `(OSRXParser *p)` | 丢弃已累积字节，不解析 |

### 回调函数签名

```c
typedef void (*osrx_frame_cb)(
    const osrx_packet_meta  *meta,   /* 头部字段，始终有效 */
    const osrx_sensor_field *field,  /* 传感器字段；非传感器帧为 NULL */
    const osrx_u8           *raw,    /* 原始帧字节 */
    int                      raw_len,
    void                    *ctx     /* 来自 osrx_parser_init() 的用户上下文 */
);
```

---

## `osrx_packet.h` — 仅解码头部

```c
int osrx_packet_decode(const osrx_u8    *packet,
                       int               len,
                       osrx_packet_meta *out);
```

仅解码 13 字节头部。不解析 body，不校验 CRC。适用于仅需要 `aid`、`tid` 和 `ts_sec` 的场景。

---

## `osrx_b62.h` — Base62 解码器

```c
int osrx_b62_decode(const char *s, osrx_i32 *out);
```

将 Base62 字符串解码为有符号 32 位整数。成功返回 `1`，无效字符返回 `0`。

---

## `osrx_crc.h` — CRC 工具函数

```c
osrx_u8  osrx_crc8 (const osrx_u8 *data, int len, osrx_u8  poly, osrx_u8  init);
osrx_u16 osrx_crc16(const osrx_u8 *data, int len, osrx_u16 poly, osrx_u16 init);
```

通用逐位 CRC 计算。通常无需直接调用——`osrx_sensor_recv()` 内部已处理。
