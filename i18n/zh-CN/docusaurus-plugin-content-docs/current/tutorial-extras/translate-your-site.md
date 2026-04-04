---
sidebar_position: 2
title: 翻译你的站点
---

# 翻译你的站点

通过 Docusaurus i18n 可以为文档添加多语言支持。

- 在 `docusaurus.config.ts` 中配置 `i18n.locales`
- 将文档复制到 `i18n/<locale>/docusaurus-plugin-content-docs/current/`
- 使用对应 locale 启动或构建站点

```bash
npm run start -- --locale zh-CN
npm run build
```

