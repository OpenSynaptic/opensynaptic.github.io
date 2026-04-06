# OpenSynaptic v1.2.0 发布说明

发布日期：2026-04-06  
发布类型：RSCore 性能深度优化 + 仓库清理 + CI 工作流优化

---

## 摘要

v1.2.0 确立了 OpenSynaptic 1.x 系列的**生产性能基线**。

- 为 `rscore` 实现 6 项 Rust 内存分配优化，在 AMD Ryzen 5 9600X 上达到约 1.32M pps。
- 明确识别 Python FFI 层为端到端瓶颈（约占每批次时间的 80%），确认 Rust 计算部分已不再是性能限制因素。
- 清理 1.1 GB 孤立构建产物及 33 个 Python 字节码缓存目录。
- 优化 GitHub Actions：添加 Rust 依赖缓存、将耗时工作流限制至集成分支、修复失效的构建任务。
- 同步 `OSynaptic-FX v1.0.1` 兼容性说明及缺失的 Arduino Easy API 文档。

---

## RSCore 性能优化

对 `src/opensynaptic/core/rscore/rust/src/lib.rs` 的 6 处针对性修改：

| # | 修改内容 | 效果 |
|---|---------|------|
| ① | `parse_apply_blob` 返回 `&[u8]`（零拷贝）| 每批次每 item 消除 1 次 `Vec<u8>` 分配 |
| ② | `decode_ts_token_to_6bytes` 使用 `decode_slice` 写入栈数组 | 消除时间戳解码的堆分配 |
| ③ | 新增 `u32_to_decimal_slice` 辅助函数，替代热路径中的 `format!("{};{}")` | 消除每 item 的堆字符串格式化 |
| ④ | `raw_vals` 使用 `SmallVec<[&'a [u8]; 16]>` | ≤16 传感器时完全栈内联 |
| ⑤ | `diff_body` / `body` 缓冲区使用 `SmallVec<[u8; 64/96]>` | DIFF 路径缓冲区栈内联 |
| ⑥ | 新增 `auto_decompose_fill_sig` + 每批次复用 `sig_buf` | 每批次节省 N-1 次 Vec 分配 |

**新增依赖：** `Cargo.toml` 中添加 `smallvec = { version = "1", features = ["union"] }`。

### 基准测试结果

| 配置 | 吞吐量 |
|-----|--------|
| AMD Ryzen 5 9600X（Zen 5），12 进程并行 | ~1.32M pps |
| 上版基线 | ~1.32M pps |
| 优化前基线 | ~1.067M pps |

> **为什么本版没有进一步提升？** Rust 计算层现在只占端到端时间的 ~17–20%。剩余 ~80% 是 Python FFI 开销（批量打包、`from_buffer_copy`、每 item 的 `struct.unpack`）。进一步提升吞吐量需要在 FFI 边界进行架构层面的改动，而非继续优化 Rust 内部逻辑。

---

## 架构分析（归档）

| 问题 | 结论 |
|------|------|
| Python FFI 开销是技术债吗？ | 不是——这是有意的设计选择。Python 驱动业务逻辑，Rust 负责计算。 |
| 识别到的唯一轻度技术债 | `_invoke_batch` 中的 `from_buffer_copy` 可改为 `from_buffer`（GIL 下该竞态不会发生）|
| Cython 评估 | 浅层改动：<10% 收益。深层 `typed memoryview` 重写：~50% 收益，工作量等同方案 C，不推荐。|
| per-item 阻塞 worker submit（方案 B）| 现有 API 为同步阻塞；640× FFI 开销放大后实际收益仅 ~10%，不值得改造。|
| Rust 驱动循环 ABI（方案 C）| 仅适用于天花板测量，不适用于生产路径。 |
| 决策 | 以本版作为生产基线，待部署目标和 pps SLA 明确后再评估进一步优化。|

---

## 仓库清理

| 删除内容 | 大小 | 原因 |
|---------|------|------|
| `dist/`（v1.1.0rc1 产物）| ~2 MB | 过期本地构建输出 |
| `target/rscore/`（根目录）| ~1.1 GB | 孤立 Rust 构建缓存 |
| 33 个 `__pycache__/` 目录 | — | Python 字节码缓存 |
| `.pytest_cache/` | — | 测试运行缓存 |
| `src/opensynaptic/utils/c/bin/os_rscore_new.dll.bak` | 68 B | 无引用的备份文件 |

---

## GitHub Actions 改进

| 文件 | 修改内容 |
|------|---------|
| `ci.yml` | 添加 `concurrency` 块（`cancel-in-progress: true`）；为 `test` 和 `build-rust-wheel` job 添加 Rust `actions/cache` 缓存步骤 |
| `scripts-comprehensive-ci.yml` | 推送触发从 `**`（所有分支）改为 `["main", "develop", "Beta"]`——防止 180 分钟任务在每次功能分支推送时触发 |
| `build.yml` | 修复失效的 `test` job：补充 Rust 扩展构建、原生 C 库构建步骤及 `CARGO_TARGET_DIR` 环境变量；添加 Rust 缓存 |

---

## OSynaptic-FX 兼容性

- **OSynaptic-FX v1.0.1** 同步发布——兼容性已确认，wire format 无变化。
- OSynaptic-FX `docs/20-arduino-easy-api.md`（Arduino Easy API 参考）新增并同步至本文档站。
- OSynaptic-FX `CHANGELOG.md` 已更新兼容性说明。

---

## 重大变更

无。ABI 向后兼容，应用层 API 无变化。

---

## 升级方式

```bash
pip install --upgrade opensynaptic
```
