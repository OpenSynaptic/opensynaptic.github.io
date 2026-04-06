# OpenSynaptic v1.2.0 Release Notes

> 发布日期 / Release Date: 2026-04-06

---

## 中文版

### v1.2.0 — RSCore 高性能优化版

本次更新专注于 `rscore`（Rust 计算引擎）的性能深度优化，是 OpenSynaptic 1.x 系列的最终生产级基线版本。

---

### 🚀 性能优化（RSCore）

经过对热路径的逐层分析与多轮基准测试，本版本完成了 6 项 Rust 内存分配优化，并明确识别出性能瓶颈所在：

| 优化项 | 说明 |
|--------|------|
| **① `parse_apply_blob` 零拷贝** | 返回类型从 `Vec<u8>` 改为 `&[u8]`，消除批处理循环中的堆分配 |
| **② `decode_ts_token_to_6bytes` 栈解码** | 改用 `decode_slice` 写入 6 字节栈数组，去除 heap alloc |
| **③ 消除 `format!` 热路径** | 新增 `u32_to_decimal_slice` 辅助函数，批处理循环中不再调用 `format!("{};{}")` |
| **④ SmallVec 传感器列表** | `raw_vals` 使用 `SmallVec<[&'a [u8]; 16]>`，≤16 传感器时完全避免堆分配 |
| **⑤ SmallVec 包体缓冲** | `diff_body`（64B）和 `body`（96B）改用 SmallVec 栈内联，减少 DIFF 路径 alloc |
| **⑥ sig_buf 跨 item 复用** | 新增 `auto_decompose_fill_sig`，每批次只分配一次 `sig_buf` 并复用，节省 N-1 次 Vec 分配 |

**基准测试结果（AMD Ryzen 5 9600X，12 进程并行）：**
- 优化前：~1.067M pps
- 优化前（上版基线）：~1.32M pps
- 本版：~1.32M pps（alloc 优化已达边际，瓶颈转移至 Python FFI 层）

**结论：** Rust 计算部分已占端到端时间的 ~17–20%，Python FFI 层（批量打包/memcpy/解包）占 ~80%。本版本作为当前架构下的最终优化基线，后续性能提升需要架构层面调整（ABI 瘦身或 Rust 驱动循环）。

---

### 🏗️ 架构分析（记录在案）

本版本完成了详细的架构分析，结论归档如下：

- **当前架构合理，不是技术债**：Python 作为业务逻辑驱动层 + Rust 作为计算引擎是有意的设计选择
- **唯一的轻度技术债**：`_invoke_batch` 中的 `from_buffer_copy` 可改为 `from_buffer`（防御性拷贝已无必要）
- **评估了 3 条进一步优化路径**：
  - 方案 A（Cython）：收益 <10%，不值得引入第三工具链
  - 方案 B（per-item worker submit）：现有 API 为阻塞同步，实际收益仅 ~10%
  - 方案 C（`os_bench_run_v1`，Rust 驱动循环）：仅适用于基准测量，不适用于生产路径
- **在部署目标和 pps 需求明确前，以本版作为生产基线**

---

### 🧹 目录清理

| 删除内容 | 原因 |
|---------|------|
| `dist/` (v1.1.0rc1 旧产物, ~2MB) | 已过期的本地构建产物 |
| `target/rscore/` 根目录 (~1.1GB) | 孤立的 Rust 编译缓存 |
| 33 个 `__pycache__` 目录 | Python 字节码缓存 |
| `.pytest_cache/` | pytest 运行缓存 |
| `src/opensynaptic/utils/c/bin/os_rscore_new.dll.bak` | 无引用的 .bak 备份文件 |

---

### 📦 依赖变更

`Cargo.toml` 新增：
```toml
smallvec = { version = "1", features = ["union"] }
```

---

### ⚠️ 重大变更 / Breaking Changes

无。ABI 保持向后兼容，应用层 API 无变化。

---

### 升级指南

```bash
pip install --upgrade opensynaptic
```

---

---

## English Version

### v1.2.0 — RSCore Performance Hardening

This release focuses on deep performance optimization of the `rscore` (Rust compute engine), establishing the final production baseline for the OpenSynaptic 1.x series.

---

### 🚀 Performance Optimizations (RSCore)

Following systematic hot-path analysis and multiple benchmark iterations, this release delivers 6 Rust allocation-reduction optimizations and conclusively identifies the performance bottleneck:

| Optimization | Description |
|-------------|-------------|
| **① `parse_apply_blob` zero-copy** | Return type changed from `Vec<u8>` to `&[u8]`, eliminating heap allocation per batch iteration |
| **② `decode_ts_token_to_6bytes` stack decode** | Switched to `decode_slice` writing into a 6-byte stack array, removing heap alloc |
| **③ Eliminate `format!` in hot path** | New `u32_to_decimal_slice` helper replaces `format!("{};{}")` in batch loop |
| **④ SmallVec for sensor list** | `raw_vals` now uses `SmallVec<[&'a [u8]; 16]>`, avoiding heap allocation for ≤16 sensors |
| **⑤ SmallVec for packet body buffers** | `diff_body` (64B) and `body` (96B) use SmallVec inline storage, reducing DIFF path allocs |
| **⑥ sig_buf reuse across items** | New `auto_decompose_fill_sig` allocates `sig_buf` once per batch and reuses it, saving N-1 Vec allocations |

**Benchmark results (AMD Ryzen 5 9600X, 12 parallel processes):**
- Pre-optimization baseline: ~1.067M pps
- Prior session baseline: ~1.32M pps
- This release: ~1.32M pps (alloc optimization at diminishing returns; bottleneck has shifted to Python FFI layer)

**Conclusion:** The Rust compute layer now accounts for only ~17–20% of end-to-end time, with the Python FFI layer (batch packing / memcpy / unpacking) consuming ~80%. This release serves as the final optimization baseline under the current architecture; further throughput gains require architectural changes (thinner ABI or Rust-driven loops).

---

### 🏗️ Architecture Analysis (Logged for Record)

This release includes a thorough architectural analysis with the following conclusions:

- **Current architecture is sound, not technical debt**: Python as business-logic driver + Rust as compute engine is an intentional design choice
- **Only minor technical debt identified**: `from_buffer_copy` in `_invoke_batch` can be replaced with `from_buffer` (defensive copy is unnecessary under the GIL)
- **Three further optimization paths evaluated**:
  - Option A (Cython deep rewrite): ~50% gain possible but equivalent effort to Option C with less reward; adds third toolchain
  - Option B (per-item blocking worker submit): Existing API is synchronous; real gain only ~10%, not worth the refactor
  - Option C (`os_bench_run_v1`, Rust-driven loop): Suitable for benchmarking only; not applicable as production path
- **Current version adopted as production baseline pending deployment target and pps requirement definition**

---

### 🧹 Repository Cleanup

| Removed | Reason |
|---------|--------|
| `dist/` (v1.1.0rc1 artifacts, ~2MB) | Stale local build artifacts |
| `target/rscore/` at repo root (~1.1GB) | Orphaned Rust build cache |
| 33 × `__pycache__` directories | Python bytecode caches |
| `.pytest_cache/` | pytest run cache |
| `src/opensynaptic/utils/c/bin/os_rscore_new.dll.bak` | Unreferenced backup file |

---

### 📦 Dependency Changes

Added to `Cargo.toml`:
```toml
smallvec = { version = "1", features = ["union"] }
```

---

### ⚠️ Breaking Changes

None. ABI remains backward compatible; application-layer API is unchanged.

---

### Upgrade

```bash
pip install --upgrade opensynaptic
```
