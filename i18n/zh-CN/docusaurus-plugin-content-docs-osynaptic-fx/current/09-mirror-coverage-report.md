---
id: mirror-coverage-report
title: 镜像覆盖率报告
sidebar_label: 镜像覆盖率
---

# 09 镜像覆盖率报告

## 对比基准

- 源平台：`OpenSynaptic`
- 目标运行时：`OSynaptic-FX`

## 镜像覆盖结论

### 已覆盖（核心）

- 协议核心链路：标准化、编码、融合、打包、解包。
- 安全面关键机制：会话状态、时间戳防重放、防乱序。
- 运行时核心：transporter / protocol matrix / service runtime。
- 插件控制面核心：list / load / cmd。

### 受控收敛（按当前策略）

- `transport`：轻量实现。
- `test_plugin`：轻量实现。
- `port_forwarder`：全量规则与统计、持久化实现。

### 明确不纳入

- `web`
- `sql`
- `dependency_manager`
- `env_guard`
- 其他服务生态插件

## 覆盖等级（当前发布口径）

| 能力域 | 等级 |
|---|---|
| Protocol Core | High |
| Security Control Plane | High |
| Runtime Control Plane | High |
| Full Platform Service Ecosystem | Scoped / Out of Scope |

## 备注

本报告用于说明"能力边界一致性"，不要求实现细节逐行相同。
