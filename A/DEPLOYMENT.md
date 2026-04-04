# OpenSynaptic - Docusaurus 部署指南

## 项目设置完成 ✅

Docusaurus 已经成功配置并准备部署。本项目已经配置为自动部署到 GitHub Pages。

## 快速开始

### 本地开发

启动开发服务器：
```bash
npm start
```

这将在 `http://localhost:3000` 启动本地开发服务器，代码更改会实时反映。

### 构建网站

构建生产版本：
```bash
npm run build
```

这将在 `build/` 目录中生成静态文件。

### 本地预览构建结果

```bash
npm run serve
```

## 自动部署到 GitHub Pages

### 配置步骤

1. **GitHub 仓库设置**
   - 进入仓库设置 → Pages
   - 将 Source 设置为 "Deploy from a branch"
   - 将 Branch 设置为 `gh-pages` （这是工作流自动创建的）
   - 确保 URL 为 `https://opensynaptic.github.io`

2. **工作流已配置**
   - 文件位置：`.github/workflows/deploy.yml`
   - 自动触发条件：每次推送到 `main` 分支
   - 工作流会自动构建并部署到 GitHub Pages

### 部署流程

1. 在本地提交更改：
   ```bash
   git add .
   git commit -m "更新文档"
   git push origin main
   ```

2. GitHub Actions 会自动：
   - 安装依赖
   - 构建网站
   - 部署到 `gh-pages` 分支
   - GitHub Pages 会自动部署最新版本

3. 等待几分钟后，访问 `https://opensynaptic.github.io` 即可看到更新

## 配置文件说明

### docusaurus.config.ts
主配置文件，包含：
- 网站标题、描述和 URL
- GitHub 仓库信息（用于自动部署）
- 导航栏、页脚配置
- 编辑链接指向源代码

### 核心目录结构

```
.
├── docs/              # 文档页面
├── blog/              # 博客文章
├── src/               # 自定义组件和页面
├── static/            # 静态文件（图片等）
├── docusaurus.config.ts  # 主配置文件
├── package.json       # 项目依赖
└── .github/workflows/ # GitHub Actions 工作流
```

## 编辑内容

### 添加文档

在 `docs/` 目录下创建 Markdown 文件。文件会根据 `sidebars.ts` 自动组织。

### 添加博客文章

在 `blog/` 目录下创建文件，命名规则：`YYYY-MM-DD-title.md`

### 自定义页面

在 `src/pages/` 下创建 React 组件或 Markdown 文件。

## 常见问题

### 如何修改网站标题？
编辑 `docusaurus.config.ts` 中的 `title` 字段。

### 如何修改导航栏？
编辑 `docusaurus.config.ts` 中的 `navbar` 配置。

### 部署失败怎么办？
1. 检查 GitHub Actions 工作流日志
2. 确保 `main` 分支有最新代码
3. 检查 `package.json` 依赖是否正确

### 如何禁用博客？
在 `docusaurus.config.ts` 的 preset 配置中移除 blog 部分。

## 有用的命令

```bash
# 启动开发服务器
npm start

# 构建生产版本
npm run build

# 本地预览构建结果
npm run serve

# 清除缓存
npm run clear

# 类型检查
npm run typecheck

# 生成翻译文件
npm write-translations
```

## 更多信息

- [Docusaurus 官方文档](https://docusaurus.io)
- [GitHub Pages 帮助](https://docs.github.com/en/pages)
- [GitHub Actions 文档](https://docs.github.com/en/actions)

---

**部署时间**: 2026-04-04
**Docusaurus 版本**: 3.9.2
**Node.js 版本**: 18.0+

