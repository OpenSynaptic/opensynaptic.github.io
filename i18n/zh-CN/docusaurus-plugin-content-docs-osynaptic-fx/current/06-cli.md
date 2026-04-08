---
id: cli
title: CLI 轻量版指南
sidebar_label: CLI 轻量版
---

# 06 CLI 轻量版指南

> 本指南面向维护者。Arduino 库用户建议先从 `examples/` 入手。

## 入口点

- 独立入口源码：`tools/osfx_cli_main.c`
- 路由实现：`src/osfx_cli_lite.c`

## 命令概览

- `plugin-list`
- `plugin-load <name> [config]`
- `plugin-cmd <name> <cmd> [args...]`
- `transport-status`
- `test-plugin <subcmd> [args...]`
- `port-forwarder <subcmd> [args...]`

## 常用示例

```powershell
# 列出插件
.\build\osfx_cli_cl.exe plugin-list

# 加载 transport 并查看状态
.\build\osfx_cli_cl.exe plugin-load transport
.\build\osfx_cli_cl.exe transport-status

# 运行 test_plugin 轻量套件
.\build\osfx_cli_cl.exe test-plugin run component

# 添加并触发端口转发规则
.\build\osfx_cli_cl.exe port-forwarder add-rule r1 udp 8080 tcp 9000
.\build\osfx_cli_cl.exe port-forwarder forward udp 8080 A1B2
```

## 多编译器可执行文件示例

测试脚本根据编译器生成不同的 CLI 可执行文件：

- `clang`：`build/osfx_cli_clang.exe`
- `gcc`：`build/osfx_cli_gcc.exe`
- `cl`：`build/osfx_cli_cl.exe`

```powershell
# clang 产物示例
.\build\osfx_cli_clang.exe plugin-list

# gcc 产物示例
.\build\osfx_cli_gcc.exe transport-status
```

## 推荐工作流示例

```powershell
# 1) 查看插件
.\build\osfx_cli_cl.exe plugin-list

# 2) 加载插件
.\build\osfx_cli_cl.exe plugin-load transport
.\build\osfx_cli_cl.exe plugin-load test_plugin

# 3) 执行检查
.\build\osfx_cli_cl.exe transport-status
.\build\osfx_cli_cl.exe test-plugin run component

# 4) 添加转发规则并触发
.\build\osfx_cli_cl.exe plugin-load port_forwarder
.\build\osfx_cli_cl.exe port-forwarder add-rule r1 udp 8080 tcp 9000
.\build\osfx_cli_cl.exe port-forwarder forward udp 8080 A1B2C3
```

## 输出约定

- 成功通常包含 `ok=1` 或状态摘要。
- 失败返回 `error=...` 并以非零退出码退出。

示例：

- 成功：`ok=1 loaded=transport`
- 失败：`error=plugin_not_found name=unknown`
