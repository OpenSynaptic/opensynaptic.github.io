---
id: 04-wire-format
title: 线路格式
sidebar_label: 线路格式
---

# 线路格式

每帧遵循 OpenSynaptic FULL 数据包布局（C89，大端序）：

```
[cmd:1][route:1][aid:4BE][tid:1][ts:6BE][body...][crc8:1][crc16:2]
 ─────────────── 13 字节头部 ─────────────── ─body─ ──3字节CRC──
```

---

## 字段定义

| 字段 | 大小 | C89 类型 | 描述 |
|---|---|---|---|
| `cmd` | 1 B | `osrx_u8` | `0x3F`（63）= DATA_FULL 明文。`0x40`（64）= 加密（RX 不解码）。|
| `route` | 1 B | `osrx_u8` | 路由/跳数标志 |
| `aid` | 4 B | `osrx_u32` | 源节点 ID，大端序 |
| `tid` | 1 B | `osrx_u8` | 事务 ID（循环 0–255）|
| `ts` | 6 B | `osrx_u64` | Unix 时间戳（秒），48 位大端序 |
| `body` | 可变 | — | `sensor_id\|unit\|b62value` |
| `crc8` | 1 B | `osrx_u8` | CRC-8/SMBUS（多项式 0x07，初值 0x00），仅覆盖 body |
| `crc16` | 2 B | `osrx_u16` | CRC-16/CCITT-FALSE（多项式 0x1021，初值 0xFFFF），覆盖整帧 |

最小帧长度：**19 字节**（2 字符 sid、1 字符 unit、1 字符 Base62 值）。

---

## Body 格式

Body 包含竖线分隔的 ASCII 字段：

```
<sensor_id> '|' <unit> '|' <b62_value>
```

| 子字段 | 最大长度（默认）| 描述 |
|---|---|---|
| `sensor_id` | 8 字符 + NUL（`OSRX_ID_MAX=9`）| 短字母数字传感器标识符，如 `T1`、`HUMID` |
| `unit` | 8 字符 + NUL（`OSRX_UNIT_MAX=9`）| UCUM 风格单位字符串，如 `Cel`、`Pct`、`m/s2` |
| `b62_value` | 13 字符 + NUL（`OSRX_B62_MAX=14`）| Base62 编码的定点整数（缩放因子 10000）|

Body 示例（十六进制，含 ASCII 对照）：

```
54 31 7C 43 65 6C 7C 4E 41 31
T  1  |  C  e  l  |  N  A  1
```

解码结果：`T1 | Cel | NA1` → 传感器 T1，单位摄氏度，值 = Base62 解码 "NA1"。

---

## CRC 算法

### CRC-8/SMBUS

- 多项式：`0x07`
- 初始值：`0x00`
- 输入/输出反转：否
- 覆盖范围：仅 body 字节（头部之后到 CRC-8 之前）

标准校验值：ASCII 字符串 `"123456789"` → `0xF4`。

```c
/* 逐位 CRC-8 — 无查找表，0 B RAM */
osrx_u8 osrx_crc8(const osrx_u8 *data, int len, osrx_u8 poly, osrx_u8 init);
```

### CRC-16/CCITT-FALSE

- 多项式：`0x1021`
- 初始值：`0xFFFF`
- 输入/输出反转：否
- 覆盖范围：从 `cmd` 到 `crc8`（含）的**整帧**

标准校验值：ASCII 字符串 `"123456789"` → `0x29B1`。

```c
/* 逐位 CRC-16 — 无查找表，0 B RAM */
osrx_u16 osrx_crc16(const osrx_u8 *data, int len, osrx_u16 poly, osrx_u16 init);
```

---

## Base62 解码算法

`b62_value` 字段使用 Base62（字母表 `0–9A–Za–z`）编码一个有符号 32 位整数，大端位序，最高有效位在前。

```
字母表：0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz
```

解码公式（`N` 个字符）：`value = Σᵢ digit[i] × 62^(N-1-i)`，其中 `i` 从 0 到 `N-1`。

```c
/* 返回 0 表示无效输入 */
int osrx_b62_decode(const char *s, osrx_i32 *out);
```
