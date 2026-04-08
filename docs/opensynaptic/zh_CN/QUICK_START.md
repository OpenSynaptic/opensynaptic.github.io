---
layout: default
title: 快速开始指南
language: zh
---

# 快速开始

5 分钟内启动一个 OpenSynaptic 节点。

---

## 前置条件

| 要求 | 版本 |
|---|---|
| Python | 3.10 或更高 |
| 操作系统 | Windows 10/11、Linux、macOS |
| 磁盘空间 | ~50 MB |

---

## 第 1 步 — 克隆并安装

```powershell
git clone https://github.com/OpenSynaptic/OpenSynaptic.git
cd OpenSynaptic
pip install -e .
```

验证安装：
```powershell
os-node --help
```

---

## 第 2 步 — 一键运行演示

`demo` 命令启动一个本地虚拟传感器循环，并自动打开 Web 管理面板：

```powershell
os-node demo --open-browser
```

此命令将：
1. 在内存中创建临时 `Config.json`（不写入任何文件）
2. 在 `http://127.0.0.1:8765/` 启动 `web_user` 插件
3. 每 2 秒生成一次虚拟传感器数据包（温度、压力、电压）
4. 在浏览器中打开管理面板

面板包含设备标识、传输状态、管道指标和插件状态等实时数据。

按 `Ctrl+C` 停止。

---

## 第 3 步 — 创建持久化配置

使用向导生成真实节点的 `Config.json`：

```powershell
os-node wizard
```

或立即使用默认值：
```powershell
os-node init --default
```

这将在当前目录创建包含安全默认值的 `Config.json`：

```json
{
  "device_id": "MY_NODE_01",
  "VERSION": "1.3.1",
  "engine_settings": { "precision": 6 },
  "RESOURCES": {
    "transporters_status": { "udp": true },
    "service_plugins": {
      "web_user": { "enabled": true, "port": 8765 }
    }
  }
}
```

---

## 第 4 步 — 启动节点

```powershell
os-node run --config Config.json
```

节点会持续运行，发送心跳包并处理传感器数据。

一次性测试运行：
```powershell
os-node run --config Config.json --once
```

---

## 第 5 步 — 启动 Web 面板

```powershell
os-node web-user --cmd start -- --host 127.0.0.1 --port 8765 --block
```

然后在浏览器中打开 **`http://127.0.0.1:8765/`**。

也可以使用独立别名：
```powershell
os-web --cmd start -- --host 127.0.0.1 --port 8765 --block
```

---

## 第 6 步 — 发送传感器读数

```powershell
os-node transmit --config Config.json --sensor-id V1 --value 3.14 --unit Pa --medium UDP
```

读数经过完整管道处理（标准化→压缩→融合→发送），通过 UDP 分发。

---

## 第 7 步 — 在终端查看节点状态

```powershell
# 所有分区的完整快照
os-node tui --config Config.json

# 单个分区（identity、config、transport、pipeline、plugins、db）
os-node tui --config Config.json --section transport

# 实时交互模式（Ctrl+C 停止）
os-node tui --config Config.json --interactive --interval 2.0
```

---

## 第 8 步 — 查看和编辑配置

```powershell
# 查看全部配置
os-node config-show --config Config.json

# 读取单个键
os-node config-get --config Config.json --key engine_settings.precision

# 写入值
os-node config-set --config Config.json --key engine_settings.precision --value 8 --type int
```

---

## 常用命令速查

| 目标 | 命令 |
|---|---|
| 一键演示（含浏览器） | `os-node demo --open-browser` |
| 使用向导生成配置 | `os-node wizard` |
| 使用默认值生成配置 | `os-node init --default` |
| 运行节点循环 | `os-node run --config Config.json` |
| 单次测试运行 | `os-node run --config Config.json --once` |
| TUI 快照 | `os-node tui --config Config.json` |
| TUI 实时模式 | `os-node tui --config Config.json --interactive` |
| 启动 Web 面板 | `os-web --cmd start -- --host 0.0.0.0 --port 8765 --block` |
| 发送传感器值 | `os-node transmit --config Config.json --sensor-id S1 --value 1.0 --unit Pa --medium UDP` |
| 启用传输器 | `os-node transporter-toggle --config Config.json --name udp --enable` |
| 列出插件 | `os-node plugin-list --config Config.json` |
| 检查本机库 | `os-node native-check` |
| 构建本机库 | `os-node native-build` |

---

## 如果缺少本机库

首次运行时，节点会自动尝试构建本机 C 绑定。如果构建失败（例如没有 C 编译器），会显示结构化错误，节点回退到纯 Python 模式。

手动回退：
```powershell
os-node native-check   # 诊断环境
os-node native-build   # 显示进度并尝试构建
```

---

## 接下来做什么

| 我想... | 前往... |
|---|---|
| 了解完整 CLI | [internal/CLI 参考](internal/internal-CLI_README) |
| 在脚本中使用 Web API | [guides/Web API 参考](guides/guides-WEB_COMMANDS_REFERENCE) |
| 了解 TUI 各分区含义 | [guides/TUI 快速参考](guides/guides-TUI_QUICK_REFERENCE) |
| 开发插件 | [plugins/插件入门套件](plugins/plugins-PLUGIN_STARTER_KIT) |
| 添加新传输协议 | [TRANSPORTER_PLUGIN.md](TRANSPORTER_PLUGIN) |
| 理解系统架构 | [ARCHITECTURE.md](ARCHITECTURE) |
| 查看 API 参考 | [API.md](API) |

