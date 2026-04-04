# 🎯 Docusaurus 部署流程图

## 完整的部署流程

```
┌─────────────────────────────────────────────────────────────────┐
│                    Docusaurus 部署完整流程                       │
└─────────────────────────────────────────────────────────────────┘

┌──────────────┐
│  1. 本地开发  │
│  npm start   │
└────────┬─────┘
         │
         ▼
┌──────────────────────┐
│  2. 修改或添加文件     │
│  ├─ docs/           │
│  ├─ blog/           │
│  ├─ src/            │
│  └─ static/         │
└────────┬─────────────┘
         │
         ▼
┌──────────────────────────┐
│  3. 本地验证 & 构建      │
│  npm run typecheck       │
│  npm run build           │
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────┐
│  4. 提交到本地仓库       │
│  git add .               │
│  git commit -m "..."     │
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────┐
│  5. 推送到 GitHub        │
│  git push origin main    │
└────────┬─────────────────┘
         │
         ▼
    ┌────────────────────────────────────────────────┐
    │  🔄 GitHub Actions 自动触发 (.github/workflows/) │
    └────────┬───────────────────────────────────────┘
             │
             ├─► [安装依赖] npm ci
             │
             ├─► [构建网站] npm run build
             │
             ├─► [部署代码] peaceiris/actions-gh-pages
             │
             └─► [完成] 推送到 gh-pages 分支
                 │
                 ▼
         ┌───────────────────────────┐
         │  📡 GitHub Pages 自动发布 │
         │  更新到生产环境            │
         └───────┬───────────────────┘
                 │
                 ▼
         ┌─────────────────────────────────┐
         │  ✅ 网站上线!                  │
         │  https://opensynaptic.github.io │
         └─────────────────────────────────┘
```

---

## 各阶段详解

### 📍 第 1 步: 本地开发
```bash
npm start
# ↓
# 启动开发服务器在 http://localhost:3000
# 实时查看更改，热重载
```

### 📍 第 2 步: 修改文件
```
docs/         → 添加或修改文档
blog/         → 发布博客文章
src/          → 修改自定义组件
static/       → 添加静态资源
```

### 📍 第 3 步: 验证和构建
```bash
npm run typecheck  # ← 检查 TypeScript 错误
npm run build      # ← 构建生产版本
# ↓
# 生成 build/ 目录（包含静态文件）
```

### 📍 第 4 步: Git 提交
```bash
git add .
git commit -m "feat: 初始化 Docusaurus"
```

### 📍 第 5 步: 推送到 GitHub
```bash
git push origin main
# ↓
# 代码推送到 main 分支
```

### 🔄 第 6 步: GitHub Actions 自动化
```
GitHub Actions 检测到 main 分支更新
  ↓
运行工作流 (.github/workflows/deploy.yml)
  ├─ 检出代码
  ├─ 设置 Node.js 环境
  ├─ npm install 安装依赖
  ├─ npm run build 构建
  └─ 部署到 gh-pages 分支
```

### 📡 第 7 步: GitHub Pages 发布
```
GitHub Pages 检测到 gh-pages 分支更新
  ↓
自动发布到生产环境
  ↓
网站在线!
```

---

## 时间预估

| 步骤 | 耗时 | 操作 |
|------|------|------|
| **1-3** | 2-5 分钟 | 本地开发和验证 |
| **4-5** | 1 分钟 | 提交和推送 |
| **6** | 2-5 分钟 | GitHub Actions 运行 |
| **7** | 1 分钟 | GitHub Pages 发布 |
| **总计** | ~5-10 分钟 | 从推送到网站上线 |

---

## 关键文件位置

```
opensynaptic.github.io/
│
├─ 📄 docusaurus.config.ts      ← 网站配置
├─ 📄 package.json              ← 依赖声明
├─ 📄 sidebars.ts               ← 侧边栏配置
│
├─ 📁 .github/
│  └─ 📁 workflows/
│     └─ 📄 deploy.yml           ← 自动部署配置
│
├─ 📁 docs/                     ← 文档页面
├─ 📁 blog/                     ← 博客文章
├─ 📁 src/                      ← 自定义组件
├─ 📁 static/                   ← 静态资源
│
└─ 📁 build/                    ← 构建输出（git 忽略）
```

---

## 自动化工作流详解

### `.github/workflows/deploy.yml` 做了什么？

```yaml
1️⃣  监听: main 分支的 push 事件

2️⃣  环境: Ubuntu 最新版本

3️⃣  步骤:
    - 检出源代码
    - 安装 Node.js (v18)
    - npm ci (清洁安装依赖)
    - npm run build (生产构建)
    - 部署到 gh-pages 分支

4️⃣  触发: GitHub Pages 自动部署
```

---

## 部署状态查看

### 方式 1: GitHub 网页界面
```
访问: https://github.com/opensynaptic/opensynaptic.github.io
选项卡: Actions → 查看最新运行
```

### 方式 2: 本地检查
```bash
# 查看最新提交
git log --oneline -5

# 查看远程状态
git status
```

---

## 快速参考卡片

### 推送命令
```bash
cd E:\opensynaptic.github.io
git add .
git commit -m "feat: 初始化 Docusaurus"
git push origin main
```

### 本地测试
```bash
npm start          # 开发服务器
npm run build      # 构建
npm run serve      # 预览
```

### 常用操作
```bash
git status         # 查看状态
git diff           # 查看更改
git log            # 查看历史
```

---

## ⚠️ 注意事项

### ✅ 应该做的事
- ✅ 定期提交代码
- ✅ 清晰的提交信息
- ✅ 本地测试后再推送
- ✅ 定期更新依赖

### ❌ 不要做的事
- ❌ 推送 node_modules/
- ❌ 直接编辑 gh-pages 分支
- ❌ 推送未测试的代码
- ❌ 在 Actions 运行时推送

---

## 🎨 自定义网站的工作流

```
1. 编辑 docs/intro.md
   ↓
2. npm start 预览
   ↓
3. 本地验证完成
   ↓
4. git add . && git commit -m "docs: 更新"
   ↓
5. git push origin main
   ↓
6. GitHub Actions 自动构建和部署
   ↓
7. 在 https://opensynaptic.github.io 查看更新
```

---

## 🚀 立即开始

```bash
# 复制此命令到 PowerShell

cd E:\opensynaptic.github.io
npm start

# 然后在浏览器打开: http://localhost:3000
# 开始编辑内容吧!
```

---

## 📞 需要帮助?

- 📖 查看 DEPLOYMENT.md (详细指南)
- 📖 查看 QUICK_REFERENCE.md (命令参考)
- 📖 查看 GIT_DEPLOYMENT.md (Git 操作)
- 🔗 访问 [Docusaurus 官方文档](https://docusaurus.io)

---

**部署流程完全自动化，让你专注于内容!** ✨

