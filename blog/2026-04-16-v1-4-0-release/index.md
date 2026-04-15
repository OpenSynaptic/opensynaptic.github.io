---
slug: opensynaptic-v1-4-0
title: "OpenSynaptic v1.4.0 发布 — EnhancedPortForwarder 正式集成"
authors: [opensynaptic]
tags: [release, opensynaptic]
date: 2026-04-16
---

OpenSynaptic **v1.4.0** 正式发布。本版本完成了 `EnhancedPortForwarder` 组件的全面集成，修复了三个阻塞性缺陷，并将其并入继承体系，成为 `PortForwarder` 的完整功能超集。

<!-- truncate -->

## 背景

`EnhancedPortForwarder` 最初以独立草稿形式存在于 `enhanced.py`，从未被任何生产代码引用。v1.4.0 对其进行了完整重写，修复了三个阻塞性缺陷，并通过正式继承将其并入 `PortForwarder` 体系。

## 7 步数据包处理流水线

`EnhancedPortForwarder` 继承自 `PortForwarder`，在父类规则集路由的基础上新增完整的处理流水线：

```
1. Middleware before_dispatch   前置钩子（可修改 packet）
2. FirewallRule                 防火墙检查（阻断 denied 包）
3. TrafficShaper                令牌桶限速（超限立即 drop，非阻塞）
4. ProtocolConverter            协议转换（可选的 bytes 变换）
5. ProxyRule                    代理转发（真实 UDP/TCP socket）
6. _route_and_dispatch          父类路由（规则集匹配 + transport 分发）
7. Middleware after_dispatch    后置钩子（接收分发结果）
```

所有阶段均支持**热切换**（无需重启），通过 `feature-enable / feature-disable` 命令即可控制。

## 新增组件类

| 类 | 说明 |
|----|------|
| `FirewallRule` | 基于协议/IP/端口范围/包大小的有状态规则，支持 allow/deny，带优先级 |
| `TrafficShaper` | 令牌桶算法，`can_send()` 完全非阻塞，超限直接计数丢弃 |
| `ProtocolConverter` | 可插拔 `transform_func` 字节变换，无匹配时原包透传 |
| `Middleware` | before/after 双钩子，disabled 时自动跳过，支持链式挂载 |
| `ProxyRule` | 真实 UDP/TCP socket 转发，含 `backup_hosts` 容错回退 |

## 修复的缺陷

**BUG-1 — 阻塞 `time.sleep`**  
`TrafficShaper` 触发限速时旧代码在转发线程中调用 `time.sleep(wait_time)`，阻塞整个线程。现改为立即返回并计入 `shaped_dropped_packets`。

**BUG-2 — 占位符代理实现**  
`ProxyRule.forward()` 原仅含 `response = packet  # 占位符`，从未建立网络连接。现实现真实的 `_forward_udp()` / `_forward_tcp()`，失败时依次尝试 `backup_hosts`，全部失败才回退原包。

**BUG-3 — 未继承 `PortForwarder`**  
原 `class EnhancedPortForwarder:` 为独立类，重复实现了 `_lock`、`rule_sets`、`stats` 等字段，无法接入真实节点。现改为 `class EnhancedPortForwarder(PortForwarder):`，完全复用父类生命周期与路由逻辑。

**BUG-4 — `from_ip=None` 被错误过滤**  
`FirewallRule.matches()` 收到 `from_ip=None` 时（表示"无 IP 信息"）却将其视为"IP 不匹配"而返回 `False`。现增加 `from_ip is not None` guard，仅在 IP 信息明确时才做匹配过滤。

## 新增导出

```python
from opensynaptic.services.port_forwarder import (
    EnhancedPortForwarder,  # 新增
    FirewallRule,            # 新增
    TrafficShaper,           # 新增
    ProtocolConverter,       # 新增
    Middleware,              # 新增
    ProxyRule,               # 新增
    # 原有（不变）
    PortForwarder, ForwardingRule, ForwardingRuleSet,
)
```

## 测试覆盖

| Suite | 项数 | 说明 |
|-------|------|------|
| A DatabaseManager | 15 | SQLite 持久化 |
| B PortForwarder | 110 | 规则集 + 生命周期 |
| C TestPlugin | 4 | 组件套件 |
| D DisplayAPI | 40 | 全格式穷举 |
| E Plugin 注册表 | 36 | 发现 + 注册 |
| **G EnhancedPortForwarder** | **40** | **新增（本版本）** |
| **合计** | **245** | **245/245 PASS（100%）** |

新增冒烟测试脚本 `scripts/enhanced_port_forwarder_check.py`（10 项），可在完整套件之前单独验证核心路径。

## 升级说明

本版本**完全向后兼容**，原有 `PortForwarder` 代码无需任何修改。如需使用增强功能，将实例化替换为 `EnhancedPortForwarder` 即可：

```python
# 升级前
from opensynaptic.services.port_forwarder import PortForwarder
pf = PortForwarder(node=my_node)

# 升级后（直接替换，API 完全兼容）
from opensynaptic.services.port_forwarder import EnhancedPortForwarder
pf = EnhancedPortForwarder(node=my_node)
```

---

完整发布说明请参阅 [RELEASE_NOTES_v1.4.0.md](https://github.com/OpenSynaptic/OpenSynaptic/blob/main/RELEASE_NOTES_v1.4.0.md)，代码下载请访问 [GitHub Release v1.4.0](https://github.com/OpenSynaptic/OpenSynaptic/releases/tag/v1.4.0)。
