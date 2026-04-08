---
id: overview
title: 概述
sidebar_label: 概述
---

# 01 概述

## 项目定位

`OSynaptic-FX` 是 OpenSynaptic 协议核心的 C99 嵌入式实现。主要以 Arduino 库管理器软件包分发，同时保留可移植 C99 内部实现，供维护者和跨平台验证使用。

## 实现范围

- **编解码与校验和**：Base62、CRC8、CRC16/CCITT。
- **数据包处理**：FULL/DIFF/HEART 编码及最小元数据解码。
- **融合状态机**：自动策略切换与回放路径。
- **安全层**：会话状态、密钥派生、时间戳单调性保护、持久化。
- **运行时**：传输器运行时、协议矩阵、服务运行时。
- **插件系统（当前阶段）**：`transport` 轻量版、`test_plugin` 轻量版、`port_forwarder` 完整版。
- **Arduino 交付**：`library.properties` + `src/OSynapticFX.h` + `examples/` 实战草图。
- **CLI（维护者路径）**：轻量命令路由与独立入口 `tools/osfx_cli_main.c`。

## 阶段状态

- `P0`：核心闭环完成。
- `P1`：库数据驱动镜像完成（Units/Prefixes/Symbols）。
- `P2`：插件/服务运行时镜像完成。
- `P3`：安全控制面边界处理完成。
- `P4`：ID 租约策略增强完成。
- 当前收敛方向：发布文档、镜像覆盖率和持续优化。

## 非目标（当前）

- 排除 `web/sql/dependency_manager/env_guard`。
- 不实现完整的 OpenSynaptic 服务生态和复杂运营面。
