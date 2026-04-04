# 📤 Git 部署命令 - 复制即用

## ✅ 一键部署脚本

### PowerShell (Windows)

复制以下代码到 PowerShell:

```powershell
# 进入项目目录
cd E:\opensynaptic.github.io

# 检查状态
Write-Host "📊 检查 Git 状态..." -ForegroundColor Cyan
git status

# 暂存所有文件
Write-Host "📦 暂存文件..." -ForegroundColor Cyan
git add .

# 提交更改
Write-Host "💾 提交更改..." -ForegroundColor Cyan
git commit -m "feat: 初始化 Docusaurus 文档网站"

# 推送到 main 分支
Write-Host "🚀 推送到 GitHub..." -ForegroundColor Cyan
git push origin main

Write-Host "✅ 部署完成! 请访问: https://github.com/opensynaptic/opensynaptic.github.io/settings/pages 配置 GitHub Pages" -ForegroundColor Green
```

### 简化版本

```powershell
cd E:\opensynaptic.github.io
git add .
git commit -m "feat: 初始化 Docusaurus 文档网站"
git push origin main
```

---

## 🔍 检查部署状态

```powershell
# 查看 Git 日志
git log --oneline -10

# 查看远程分支
git branch -a

# 查看待推送的提交
git log origin/main..main
```

---

## 🔄 常用 Git 操作

### 查看状态
```bash
git status
```

### 查看更改内容
```bash
git diff
```

### 撤销所有更改
```bash
git reset --hard HEAD
```

### 查看日志
```bash
git log --oneline
```

### 修改最后一次提交
```bash
git commit --amend
```

### 删除本地分支
```bash
git branch -d branch-name
```

---

## 📝 提交信息示例

使用这些提交信息可以使历史更清晰:

```bash
# 初始化项目
git commit -m "feat: 初始化 Docusaurus 文档网站"

# 添加文档
git commit -m "docs: 添加 API 文档"

# 修改配置
git commit -m "config: 更新网站配置"

# 更新依赖
git commit -m "chore: 更新依赖包"

# 修复 bug
git commit -m "fix: 修复导航栏显示问题"

# 改进功能
git commit -m "improve: 优化搜索功能"
```

---

## 🚨 重要提醒

### 推送前检查清单

- [ ] `npm run build` 构建成功
- [ ] `npm run typecheck` 无错误
- [ ] `git status` 显示正确的文件
- [ ] 提交信息清晰明了
- [ ] 没有不必要的文件被提交

### 避免的操作

❌ 不要推送 node_modules/
❌ 不要推送 .env 文件
❌ 不要推送 build/ 目录
❌ 不要直接修改 gh-pages 分支

---

## 🆘 常见错误解决

### 错误: "changes not staged for commit"

解决:
```bash
git add .
git commit -m "你的提交信息"
```

### 错误: "Permission denied (publickey)"

解决:
```bash
# 检查 SSH 密钥
ssh -T git@github.com

# 如果没有密钥，使用 HTTPS
git remote set-url origin https://github.com/opensynaptic/opensynaptic.github.io.git
```

### 错误: "cannot push"

解决:
```bash
# 先拉取最新代码
git pull origin main

# 然后推送
git push origin main
```

---

## 📊 查看部署进度

推送后，可以在这里查看 GitHub Actions 运行状态:

https://github.com/opensynaptic/opensynaptic.github.io/actions

---

## ✨ 部署完成后

1. 访问网站: https://opensynaptic.github.io
2. 享受自动化部署的便利! 🎉

---

**现在就运行上面的命令开始部署吧!** 🚀

