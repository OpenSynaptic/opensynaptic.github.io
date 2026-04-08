---
id: standardized-units
title: 标准化单位表
sidebar_label: 标准化单位表
---

# 18 标准化单位表

本文档定义用户输入单位与标准化输出单位之间的映射规则（发送前标定）。

## 1. 范围与来源

- 标准化函数：`osfx_standardize_value(...)`
- 数据来源：`OpenSynaptic/libraries` 镜像（`osfx_library_catalog`）
- 本表为**常用单位子集**，非完整字典。

## 2. 用户输入字段（单位相关）

在传输接口 `osfx_glue_encode_sensor_auto(...)` 中：

- 用户提供：`input_unit`
- 系统输出：`out_unit`（标准单位）

> `cmd` 不是用户定义的字段（自动路径由 `fusion_state` 自动决定）。

## 3. 常用单位映射表

| 用户输入单位 | 含义 | 标准输出单位 | 换算规则 |
|---|---|---|---|
| `kPa` | 千帕 | `Pa` | `value × 1000` |
| `Pa` | 帕斯卡 | `Pa` | 恒等变换 |
| `psi` | 磅力/平方英寸 | `Pa` | 库换算 |
| `mm[Hg]` | 毫米汞柱 | `Pa` | 库换算 |
| `cel` | 摄氏度 | `K` | `value + 273.15` |
| `degF` | 华氏度 | `K` | `(value - 32) × 5/9 + 273.15` |
| `%` | 百分比 | `%` | 恒等变换 |

> `库换算` 指系数/偏移来自库数据，不建议在业务侧硬编码。

## 4. 前缀规则

如果单位支持前缀且库中标记为可加前缀，则前缀将被自动解析：

- 示例：`k` + 基础单位（如 `kPa`）
- 是否实际支持前缀取决于单位元数据的 `can_take_prefix` 字段

## 5. 输入约束与建议

- `input_unit` 必须是可识别的字符串。
- 建议业务侧统一使用标准缩写（例如 `kPa`、`cel`、`%`）。
- 如果单位无法识别，当前实现将原样透传单位不进行换算；生产场景建议在上层添加白名单校验。

## 6. 发送前检查（单位维度）

1. 检查 `input_unit` 是否在允许集合中（建议白名单）。
2. 调用 `osfx_standardize_value(...)` 验证可换算性。
3. 比对输出 `out_unit` 是否满足业务预期（例如压力统一为 `Pa`）。
4. 验证标准化后的值是否在业务合法范围内。

## 7. 参考代码片段

```c
double out_value = 0.0;
char out_unit[16];
if (!osfx_standardize_value(input_value, input_unit, &out_value, out_unit, sizeof(out_unit))) {
    /* 拒绝无效输入 */
}
```

## 8. 相关文档

- 传输字段规范：[17-glue-step-by-step.md](17-glue-step-by-step.md)
- 示例食谱：[16-examples-cookbook.md](16-examples-cookbook.md)
- 架构说明：[02-architecture.md](02-architecture.md)
