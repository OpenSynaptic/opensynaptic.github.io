---
id: 04-wire-format
title: 线路格式
sidebar_label: 线路格式
---

# 线路格式

OSynaptic-TX 发出的 **FULL** 类型 OpenSynaptic 帧与 OSynaptic-RX 消费的帧完全相同。

## 数据包结构

```
字节：  0        1-4     5       6-9         10       11      12     13..N   N+1     N+2-N+3
       MAGIC   AID[4]  TID   TS_SEC[4]   TYPE    CRC8_H  HDR_END  BODY  CRC8_B  CRC16[2]
       0x53   大端u32  0-255  大端u32    0x46     —       0x7C     —       —       大端
```

| 字段 | 字节数 | 描述 |
|---|---|---|
| MAGIC | 1 | `0x53` — 同步字节 |
| AID | 4 | 节点 ID，大端序 uint32 |
| TID | 1 | 事务 ID 0–255，循环递增 |
| TS_SEC | 4 | Unix 时间戳（秒），大端序 uint32 |
| TYPE | 1 | `0x46` = `'F'` = FULL 传感器帧 |
| CRC8 头部 | 1 | CRC-8/SMBUS 覆盖字节 0–9 |
| HDR_END | 1 | `0x7C` = `'|'` |
| BODY | 可变 | ASCII：`sid\|unit\|b62value` |
| CRC8 body | 1 | CRC-8/SMBUS 仅覆盖 body 字节 |
| CRC16 | 2 | CRC-16/CCITT-FALSE 覆盖完整数据包（0..N+1），大端序 |

## BODY 格式

```
T1|Cel|2vBM
^  ^   ^
|  |   +-- Base62 编码的有符号 32 位值
|  +------ UCUM 单位字符串（最多 8 字符）
+--------- 传感器 ID（最多 8 个字母数字 ASCII 字符）
```

**Base62 字母表：** `0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz`

负值：Base62 数字前加 `-` 字符。

## 示例解析

值：**21.5 °C** → scaled = `215000`（使用 `OSTX_VALUE_SCALE=10000`）

1. `ostx_b62_encode(215000)` → `"2vBM"`
2. Body → `"T1|Cel|2vBM"`（11 字节）
3. 头部：AID=`0x00000001`，TID=`1`，TS=`0x661C3A00`，TYPE=`'F'`
4. CRC-8/SMBUS 覆盖头部字节 → `0xNN`
5. 依次追加 `'|'`、body、body CRC-8、完整数据包 CRC-16

CRC 算法与 OSynaptic-RX 中完全相同。多项式规格详见 [OSynaptic-RX 线路格式](../osynaptic-rx/04-wire-format)。
