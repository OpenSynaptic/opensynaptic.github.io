# 🚀 快速部署指南

## ⚡ 3 步，5 分钟上线

### 步骤 1: 推送代码到 GitHub (1 分钟)

在 PowerShell 中运行：

```powershell
cd E:\opensynaptic.github.io
git add .
git commit -m "feat: 迁移 Wiki 到 Docusaurus - docs/opensynaptic/en_GB + zh_CN"
git push origin main
```

### 步骤 2: 配置 GitHub Pages (2 分钟)

1. 打开: https://github.com/opensynaptic/opensynaptic.github.io/settings/pages

2. 在 "Build and deployment" 部分设置：
   - **Source**: "Deploy from a branch"
   - **Branch**: `gh-pages`
   - **Folder**: `/`

3. 点击 **Save**

### 步骤 3: 等待部署 (2-3 分钟)

- GitHub Actions 会自动构建
- GitHub Pages 会自动发布
- 访问 **https://opensynaptic.github.io** ✅

---

## ✅ 验证部署

部署完成后，你应该看到：

```
✅ 网站在线
✅ 左侧侧边栏显示所有文档
✅ 搜索框可用
✅ 响应式设计正常
✅ 暗黑模式可用
```

---

## 📊 当前状态

- **英文文档**: 23 个 ✅
- **中文文档**: 86 个 ✅
- **总计**: 109 个文档 ✅
- **构建状态**: 成功 ✅
- **部署就绪**: 是 ✅

---

**就这么简单！🎉**

现在就推送你的代码吧！

