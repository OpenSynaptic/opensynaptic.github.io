---
id: examples-cookbook
title: 示例食谱
sidebar_label: 示例食谱
---

# 16 示例食谱

本文档提供发布级"可复制端到端示例"。

当前以 Arduino 示例为主路径，每个场景都对应 `examples/` 下可直接编译的 Sketch；CLI 场景保留为维护者回归与诊断路径。

## Arduino 实战示例（主路径）

### 统一编译命令模板

```powershell
arduino-cli compile --fqbn arduino:avr:uno .\examples\<ExampleFolder>
```

### 场景 A：单传感器编码上报

- 示例：`examples/BasicEncode/BasicEncode.ino`
- 适用：温度/压力等单传感器定时上报
- 关键 API：`osfx_core_encode_sensor_packet`
- 预期：串口输出 `osfx encode ok=1` 与有效 packet 长度

### 场景 B：包元数据解包与业务字段还原

- 示例：`examples/PacketMetaDecode/PacketMetaDecode.ino`
- 适用：网关侧对上行包做审计与追踪
- 关键 API：`osfx_packet_decode_meta` + `osfx_packet_extract_body`
- 预期：可打印 `source_aid/tid`，并还原 `sensor_id/value/unit`

### 场景 C：融合自动模式（FULL/DIFF）

- 示例：`examples/FusionAutoMode/FusionAutoMode.ino`
- 适用：连续采样场景下减少重复传输开销
- 关键 API：`osfx_core_encode_sensor_packet_auto` + `osfx_core_decode_sensor_packet_auto`
- 预期：两次发送的命令字可能不同（取决于状态机），均可正确解码

### 场景 D：安全会话加密回环

- 示例：`examples/SecureSessionRoundtrip/SecureSessionRoundtrip.ino`
- 适用：边缘节点与网关建立受控加密数据链路
- 关键 API：`osfx_secure_note_plaintext_sent` / `osfx_secure_confirm_dict` / `osfx_core_encode_sensor_packet_secure`
- 预期：`should_encrypt=1`，解密后业务值与明文一致

### 场景 E：多传感器节点聚合包

- 示例：`examples/MultiSensorNodePacket/MultiSensorNodePacket.ino`
- 适用：一个节点聚合多个采样点后批量发送
- 关键 API：`osfx_core_encode_multi_sensor_packet_auto` + `osfx_core_decode_multi_sensor_packet_auto`
- 预期：可打印节点信息与多条传感器解析结果

### 场景 F：Easy API 最小上手路径

- 示例：`examples/EasyQuickStart/EasyQuickStart.ino`
- 适用：希望以最少步骤完成 `setup/loop` 编码流程的 Arduino 用户
- 关键 API：`osfx_easy_init` + `osfx_easy_allocate_aid` + `osfx_easy_encode_sensor_auto`
- 预期：串口周期输出 `cmd=<FULL/DIFF/HEART> len=<N> aid=<id>`

### 场景 G：融合状态序列回归（FULL/DIFF/HEART）

- 示例：`examples/FusionModeTest/FusionModeTest.ino`
- 适用：验证融合状态机在固定输入下的命令序列稳定性
- 关键 API：`osfx_core_encode_multi_sensor_packet_auto` + `osfx_packet_decode_meta`
- 预期：`CASE-1/2/3` 分别命中 `FULL/DIFF/HEART`

### 场景 H：启动窗口 CLI + 持久运行模式

- 示例：`examples/BootCliOrRun/BootCliOrRun.ino`
- 适用：需要运行时插件控制、ID 持久化和诊断命令的节点
- 关键 API：`osfx_platform_runtime_*` + `osfx_id_save/load` + `osfx_storage_use_littlefs`
- 预期：10 秒内输入 `cli` 进入命令模式，否则进入持续发送模式

### 场景 I：双核编码吞吐压测（ESP32）

- 示例：`examples/QuickBench/QuickBench.ino`
- 适用：维护者做性能基线对比、改动前后吞吐回归检查
- 关键 API：`osfx_packet_encode_full`（双核并行任务）
- 预期：输出双核吞吐、错误数与堆使用统计

---

## 维护者原生回归场景（辅助路径）

### 通用前置

```powershell
# 1) 先构建
powershell -ExecutionPolicy Bypass -File .\scripts\build.ps1 -Compiler auto

# 2) 再跑测试
powershell -ExecutionPolicy Bypass -File .\scripts\test.ps1 -Compiler auto
```

可执行文件（按编译器）：`build/osfx_cli_cl.exe` / `build/osfx_cli_clang.exe` / `build/osfx_cli_gcc.exe`

---

### 场景 1：插件范围校验（纳入与排除）

**目标：** 验证当前构建仅包含 `transport`、`test_plugin`、`port_forwarder`。

```powershell
.\build\osfx_cli_cl.exe plugin-list
.\build\osfx_cli_cl.exe plugin-load web
```

**预期结果：**

- `plugin-list` 包含：`transport, test_plugin, port_forwarder`
- 不包含：`web/sql/dependency_manager/env_guard`
- `plugin-load web` 返回失败（例如 `error=load_failed name=web`）

**失败分支：**

- 若 `plugin-list` 缺少 `port_forwarder`：说明运行时注册路径异常。
- 若 `web` 可加载：说明范围收敛策略被破坏。
