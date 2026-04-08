---
id: 09-api-reference
title: API 参考
sidebar_label: API 参考
---

# API 参考

OSynaptic-TX 提供三个头文件。推荐入口为 `ostx_sensor.h`。

---

## `ostx_sensor.h` — 等级 A（动态字符串）

### `ostx_sensor_pack()`

```c
int ostx_sensor_pack(
    ostx_u32        aid,        /* 节点 ID */
    const char     *sensor_id,  /* NUL 结尾，最多 8 字符 */
    const char     *unit,       /* NUL 结尾，最多 8 字符（UCUM）*/
    ostx_u8         tid,        /* 事务 ID 0–255 */
    ostx_u32        ts_sec,     /* Unix 时间戳（秒）*/
    ostx_i32        scaled,     /* 值 × OSTX_VALUE_SCALE */
    ostx_u8        *out         /* 输出缓冲区，至少 OSTX_PACKET_MAX 字节 */
);
```

**返回值：** 成功时返回数据包字节数，错误（sensor_id 或 unit 过长、输出缓冲区不足、单位验证失败）时返回 `0`。

---

## `ostx_static.h` — 等级 B（Flash 存储描述符）

### `OSTX_STATIC_DEFINE()` 宏

```c
OSTX_STATIC_DEFINE(name, aid, sensor_id_literal, unit_literal);
```

声明一个存储在程序存储器中的 `static const ostx_static_t name`。描述符本身不占用 SRAM。

### `ostx_static_pack()`

```c
int ostx_static_pack(
    const ostx_static_t *desc,  /* 由 OSTX_STATIC_DEFINE 创建的描述符 */
    ostx_u8              tid,
    ostx_u32             ts_sec,
    ostx_i32             scaled,
    ostx_u8             *out
);
```

**返回值：** 数据包字节数，或错误时返回 `0`。

---

## `ostx_stream.h` — 等级 C（流式回调）

### 发送回调类型

```c
typedef void (*ostx_emit_fn)(ostx_u8 byte, void *ctx);
```

### `ostx_stream_pack()`

```c
void ostx_stream_pack(
    const ostx_static_t *desc,
    ostx_u8              tid,
    ostx_u32             ts_sec,
    ostx_i32             scaled,
    ostx_emit_fn         emit,
    void                *ctx
);
```

无返回值——对每个输出字节调用一次 `emit` 回调。`emit` 为 `NULL` 时调用为空操作。

---

## `ostx_config.h` — 配置

完整表格见[配置宏](./05-configuration)。

---

## 数据类型

| 类型 | 底层类型 | 描述 |
|---|---|---|
| `ostx_u8` | `unsigned char` | 字节 |
| `ostx_u32` | `unsigned long` | 32 位无符号（16 位和 32 位平台均适用）|
| `ostx_i32` | `signed long` | 32 位有符号 |
| `ostx_static_t` | struct | Flash 存储的传感器描述符（不透明；使用 `OSTX_STATIC_DEFINE`）|
