# 📋 快速参考卡片

## 🚀 启动网站开发

```bash
cd E:\opensynaptic.github.io
npm start
```
访问: http://localhost:3000

## 📦 构建生产版本

```bash
npm run build
```
输出目录: `build/`

## 📤 推送到 GitHub Pages

```bash
git add .
git commit -m "你的提交信息"
git push origin main
```

GitHub Actions 会自动构建和部署 ✨

---

## 📚 文件位置

| 用途 | 位置 |
|------|------|
| 文档 | `docs/` |
| 博客 | `blog/` |
| 自定义页面 | `src/pages/` |
| 静态资源 | `static/` |
| 站点配置 | `docusaurus.config.ts` |
| 导航栏配置 | `docusaurus.config.ts` (navbar 部分) |
| 侧边栏配置 | `sidebars.ts` |

---

## 🔧 常用命令

```bash
npm start          # 开发服务器
npm run build      # 生产构建
npm run serve      # 预览构建
npm run clear      # 清除缓存
npm run typecheck  # 类型检查
```

---

## 📝 添加内容

### 添加文档
1. 在 `docs/` 创建 `.md` 文件
2. 在 `sidebars.ts` 中添加引用
3. 提交并推送

### 添加博客
1. 在 `blog/` 创建 `YYYY-MM-DD-title.md`
2. 提交并推送

### 修改首页
编辑 `src/pages/index.tsx`

---

## 🌐 网站信息

- **URL**: https://opensynaptic.github.io
- **仓库**: opensynaptic/opensynaptic.github.io
- **框架**: Docusaurus 3.9.2
- **语言**: TypeScript
- **部署**: GitHub Pages (自动)

---

## 💡 提示

- 开发时使用 `npm start` 可以实时看到更改
- 生产构建前使用 `npm run typecheck` 检查类型错误
- 查看 DEPLOYMENT.md 了解详细信息
- GitHub Actions 日志在 Settings → Actions 中可查看

---

**下一步**: 推送代码 → 等待部署 → 访问网站 🎉

