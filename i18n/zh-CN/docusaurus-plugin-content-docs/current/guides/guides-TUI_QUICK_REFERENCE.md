---
title: TUI 快速参考
---

# TUI 快速参考

OpenSynaptic 终端用户界面（TUI）速查指南。

---

## 启动 TUI

```powershell
# 使用默认配置文件
python -u src/main.py tui --config Config.json

# 或者 os-node 命令
os-node tui --config Config.json
```

---

## 键盘快捷键

| 快捷键 | 动作 |
|---|---|
| `q` / `Ctrl+C` | 退出 TUI |
| `r` | 手动刷新所有面板 |
| `Tab` | 切换到下一个面板 |
| `Shift+Tab` | 切换到上一个面板 |
| `↑` / `↓` | 在面板内滚动 |
| `Enter` | 展开/折叠选中项 |
| `?` | 显示帮助信息 |
| `p` | 显示插件状态面板 |

---

## 在 TUI 外查看单个面板

```powershell
# 查看指定 section（JSON 格式）
os-node display --config Config.json --section transport --format json

# 查看指定 section（表格格式）
os-node display --config Config.json --section pipeline --format table

# 查看全部面板
os-node display --config Config.json
```

---

## 常用 CLI 命令速查

### 节点管理

```powershell
# 启动节点（后台运行）
os-node start --config Config.json --background

# 停止节点
os-node stop --config Config.json

# 查看节点状态
os-node status --config Config.json

# 重启节点
os-node restart --config Config.json
```

### 传感器数据

```powershell
# 查看最新传感器读数
os-node sensors --config Config.json

# 查看指定传感器
os-node sensors --config Config.json --id T1

# 导出传感器数据（JSON）
os-node sensors --config Config.json --format json --output data.json
```

### 日志

```powershell
# 查看实时日志
os-node logs --config Config.json --follow

# 查看最近 50 条
os-node logs --config Config.json --tail 50

# 按级别过滤
os-node logs --config Config.json --level ERROR
```

### 配置管理

```powershell
# 显示当前配置
os-node config show --config Config.json

# 验证配置文件
os-node config validate --config Config.json

# 设置配置值
os-node config set --config Config.json --key TRANSPORT.port --value 9000
```

---

## 面板说明

| Section | plugin_name | 描述 |
|---|---|---|
| `identity` | `opensynaptic_core` | 设备标识、版本、启动时间 |
| `config` | `opensynaptic_core` | 当前运行配置摘要 |
| `transport` | `opensynaptic_core` | 传输端口状态、连接数 |
| `pipeline` | `opensynaptic_core` | 数据流量、处理延迟 |
| `plugins` | `opensynaptic_core` | 已加载插件列表与状态 |
| `db` | `opensynaptic_core` | 数据库连接与写入速率 |

---

## 插件相关命令

```powershell
# 列出所有已注册插件
os-node plugin-list --config Config.json

# 加载插件
os-node plugin-load --config Config.json --plugin my_plugin

# 卸载插件
os-node plugin-unload --config Config.json --plugin my_plugin

# 执行插件子命令
os-node plugin-cmd --config Config.json --plugin my_plugin --cmd status
```

---

## 故障排查

| 症状 | 命令 |
|---|---|
| TUI 空白/无数据 | `os-node status --config Config.json` 确认节点在运行 |
| 面板显示 error | `os-node logs --config Config.json --level ERROR` |
| 插件面板不显示 | `os-node plugin-list --config Config.json` 确认插件已加载 |
| 连接拒绝 | 检查 `Config.json` 中端口与防火墙设置 |

---

## 参见

- [Web 命令参考](guides-WEB_COMMANDS_REFERENCE) — HTTP API 速查
- [插件开发规范](../plugins/plugins-PLUGIN_DEVELOPMENT_SPECIFICATION) — 自定义面板开发
