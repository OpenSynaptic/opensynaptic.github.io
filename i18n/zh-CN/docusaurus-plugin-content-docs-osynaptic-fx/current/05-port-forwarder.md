---
id: port-forwarder
title: 端口转发器（完整版）
sidebar_label: 端口转发器
---

# 05 端口转发器（完整版）

## 能力边界

`port_forwarder` 是当前范围内的完整实现，涵盖规则创建/删除/修改/查询、命中统计、转发执行、规则持久化与加载。

## 规则模型

- 规则字段：`name`、`from_proto`、`from_port|*`、`to_proto`、`to_port`、`enabled`、`hit_count`。
- 匹配逻辑：按注册顺序扫描，首次匹配即执行转发。
- 端口策略：`*` 表示源端口通配。

## 运行时统计

- 插件级：`total_forwarded`、`total_dropped`
- 规则级：`hit_count`

## 命令说明

- `status`：返回初始化状态及总转发/丢弃统计。
- `stats`：返回统计摘要。
- `list`：返回规则列表。
- `add-rule`：添加或覆盖同名规则。
- `remove-rule`：删除规则。
- `enable-rule`：启用/禁用规则。
- `forward`：输入源协议+端口+十六进制数据，执行基于规则的转发。
- `save/load`：规则持久化与加载。

## 持久化格式

- 文件为逐行文本记录，字段以逗号分隔。
- 建议发布目录中路径固定，并纳入备份策略。

## 典型工作流

1. `plugin-load port_forwarder`
2. `port-forwarder add-rule r1 udp 8080 tcp 9000`
3. `port-forwarder forward udp 8080 A1B2C3`
4. `port-forwarder stats`
5. `port-forwarder save <path>`

## 端到端示例（可直接复制执行）

```powershell
# 初始化并加载
.\build\osfx_cli_cl.exe plugin-load port_forwarder

# 添加规则：udp:8080 -> tcp:9000
.\build\osfx_cli_cl.exe port-forwarder add-rule r1 udp 8080 tcp 9000

# 查看规则
.\build\osfx_cli_cl.exe port-forwarder list

# 触发转发（十六进制负载）
.\build\osfx_cli_cl.exe port-forwarder forward udp 8080 A1B2C3D4

# 查看统计
.\build\osfx_cli_cl.exe port-forwarder stats
```

## 通配端口示例

```powershell
# 将任意源端口的 UDP 数据转发到 tcp:9100
.\build\osfx_cli_cl.exe port-forwarder add-rule any_udp udp * tcp 9100
.\build\osfx_cli_cl.exe port-forwarder forward udp 5001 AABB
```

## 持久化示例

```powershell
# 保存规则
.\build\osfx_cli_cl.exe port-forwarder save E:\OSynaptic-FX\build\pf_rules.txt

# 重新加载规则
.\build\osfx_cli_cl.exe port-forwarder load E:\OSynaptic-FX\build\pf_rules.txt
```

## 常见故障与处理

| 症状 | 处理方法 |
|---|---|
| `add-rule` 返回错误 | 检查规则名称是否含非法字符；检查协议字符串是否为 `udp/tcp` |
| `forward` 无命中 | 检查 from_proto/from_port 与现有规则是否匹配 |
| `load` 失败 | 验证文件路径存在；检查文件格式是否为逗号分隔 |
