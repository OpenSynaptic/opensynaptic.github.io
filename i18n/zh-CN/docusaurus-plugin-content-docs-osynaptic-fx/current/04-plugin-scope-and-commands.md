---
id: plugin-scope-and-commands
title: 插件范围与命令
sidebar_label: 插件范围与命令
---

# 04 插件范围与命令

## 范围策略

### 纳入插件

- `transport`（轻量版）
- `test_plugin`（轻量版）
- `port_forwarder`（完整版）

### 排除插件

- `web`
- `sql`
- `dependency_manager`
- `env_guard`
- 其他非目标服务插件

## 命令矩阵

| 命令 | 描述 |
|---|---|
| `plugin-list` | 列出当前注册的插件 |
| `plugin-load <name> [config]` | 加载插件 |
| `plugin-cmd <name> <cmd> [args...]` | 向指定插件发出命令 |
| `transport-status` | 快速查看传输状态 |
| `test-plugin ...` | 执行 test_plugin 命令 |
| `port-forwarder ...` | 执行 port_forwarder 命令 |

## 插件级命令

### transport

- `status`
- `dispatch <proto|auto> <hex_payload>`

### test_plugin

- `status`
- `run [suite]`

### port_forwarder

- `status`
- `stats`
- `list`
- `add-rule <name> <from_proto> <from_port|*> <to_proto> <to_port>`
- `remove-rule <name>`
- `enable-rule <name> <0|1>`
- `forward <from_proto> <from_port> <hex_payload>`
- `save [path]`
- `load [path]`

## 插件应用映射（具体用途）

| 插件 | 典型用途 | 示例 |
|---|---|---|
| `transport` | 设备侧发包与链路 fallback | `plugin-cmd transport dispatch auto A1B2C3` |
| `test_plugin` | 现场健康检查、OTA 后快速验证 | `plugin-cmd test_plugin run component` |
| `port_forwarder` | 网关协议/端口转发桥接 | `port-forwarder add-rule r1 udp 8080 tcp 9000` |

说明：

- `transport` 更偏"发包执行面"。
- `test_plugin` 更偏"运行时自检面"。
- `port_forwarder` 更偏"网关转发策略面"。

## 快速示例

```powershell
# 1) 查看当前纳入的插件
.\build\osfx_cli_cl.exe plugin-list

# 2) 加载作用域插件
.\build\osfx_cli_cl.exe plugin-load transport
.\build\osfx_cli_cl.exe plugin-load test_plugin
.\build\osfx_cli_cl.exe plugin-load port_forwarder

# 3) 通过 plugin-cmd 访问 transport
.\build\osfx_cli_cl.exe plugin-cmd transport status
```
