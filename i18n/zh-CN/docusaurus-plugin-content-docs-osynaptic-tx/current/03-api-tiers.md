---
id: 03-api-tiers
title: API 等级
sidebar_label: API 等级
---

# API 等级

OSynaptic-TX 提供三个独立的 API 等级。所有等级产生完全相同的帧——选择纯粹取决于 RAM 和代码大小预算。

## 等级对比

| 等级 | 函数 | 栈峰值 | 静态 RAM | Flash（约 1 个传感器）|
|---|---|---|---|---|
| **A** | `ostx_sensor_pack()` | ~137 B | 96 B | ~600 B |
| **B** | `ostx_static_pack()` | ~51 B | 96 B | ~430 B |
| **C** | `ostx_stream_pack()` | ~21 B | 0 B | ~760 B |

## 各等级适用场景

### 等级 A — 动态字符串

适用于传感器 ID 或单位在运行时确定的场景（如从 EEPROM 读取、从配置包接收、或在循环中生成）。

```c
int len = ostx_sensor_pack(aid, "T1", "Cel", tid, ts_sec, value, out_buf);
```

### 等级 B — 静态描述符

适用于所有传感器属性在编译时已知的场景。`OSTX_STATIC_DEFINE` 宏将描述符存储在 Flash（程序存储器），避免占用 SRAM。等级 B 的栈开销低于 A，是大多数项目的推荐默认选择。

```c
OSTX_STATIC_DEFINE(s_temp, aid, "T1", "Cel");
int len = ostx_static_pack(&s_temp, tid, ts_sec, value, out_buf);
```

### 等级 C — 流式回调

适用于 SRAM 极度紧张的设备。无需输出缓冲区——你提供一个字节发送回调。等级 C 在所有等级中 Flash 消耗最多（逐字节写入开销），但 RAM 最少。

```c
OSTX_STATIC_DEFINE(s_temp, aid, "T1", "Cel");
ostx_stream_pack(&s_temp, tid, ts_sec, value, emit_fn, ctx);
```

## 混合使用多个等级

同一项目中可以混合使用多个等级。链接器会丢弃未被引用的等级编译对象，未使用的等级不产生 Flash 开销。

```c
/* 温度传感器使用等级 C（RAM 预算紧张）*/
ostx_stream_pack(&s_temp, tid++, ts, temp_scaled, emit, NULL);

/* 从 EEPROM 读取动态传感器 ID 使用等级 A */
char id[OSTX_ID_MAX];
eeprom_read_block(id, EE_SENSOR_ID, sizeof(id));
ostx_sensor_pack(aid, id, "Cel", tid++, ts, temp_scaled, out_buf);
```
