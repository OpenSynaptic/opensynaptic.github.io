---
id: 08-flash-optimization
title: Flash 优化
sidebar_label: Flash 优化
---

# Flash 优化

八种开关组合覆盖从超精简到功能完整的全范围需求。

## 配置矩阵（ATmega328P，avr-gcc -Os）

| 配置 | OSRX_NO_PARSER | OSRX_NO_TIMESTAMP | OSRX_VALIDATE_CRC8 | OSRX_VALIDATE_CRC16 | Flash | RAM |
|---|---|---|---|---|---|---|
| 完整默认 | 0 | 0 | 1 | 1 | ~616 B | 102 B |
| 无时间戳 | 0 | 1 | 1 | 1 | ~596 B | 98 B |
| 无 CRC8 | 0 | 0 | 0 | 1 | ~536 B | 102 B |
| 无 CRC8 + 无时间戳 | 0 | 1 | 0 | 1 | ~516 B | 98 B |
| 无解析器 | 1 | 0 | 1 | 1 | ~442 B | 0 B |
| 无解析器 + 无时间戳 | 1 | 1 | 1 | 1 | ~422 B | 0 B |
| 无解析器 + 无 CRC8 | 1 | 0 | 0 | 1 | ~362 B | 0 B |
| Ultra（全关闭）| 1 | 1 | 0 | 0 | ~280 B | 0 B |

## 各开关使用建议

**OSRX_NO_PARSER=1** — 收益最大。禁用 OSRXParser，节省 316 B Flash + 102 B RAM。ATtiny85 / ATmega48 必须启用。

**OSRX_NO_TIMESTAMP=1** — 风险低。从 meta 结构体中移除 `ts_sec`，节省 20 B Flash + 4 B RAM。不需要时间戳时可安全启用。

**OSRX_VALIDATE_CRC8=0** — 中等风险。跳过 body CRC-8 校验，接受损坏的 body。仅在无噪声链路上使用。

**OSRX_VALIDATE_CRC16=0** — 高风险。跳过整帧 CRC-16 校验。**任何生产环境均不推荐。**

## CRC 权衡

逐位 CRC 实现每种 CRC 算法耗费约 **80 B Flash 和 0 B RAM**。查找表实现速度更快，但 CRC-8 需要 256 B RAM，CRC-16 需要 512 B RAM——在 512 B–1 KB 总 RAM 的设备上完全不可接受。
