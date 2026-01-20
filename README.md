# AI Twitter Daily

每日自动抓取并展示 X (Twitter) 上 AI 相关话题的最热 Top 10 推文。

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![Playwright](https://img.shields.io/badge/Playwright-1.57-green)

## 特性

- 🔥 每日自动抓取 X 上 AI 话题最热 Top 10
- 📊 按互动量排序（点赞、转发、评论）
- 🎨 现代化 UI 设计（支持深色模式）
- ⚡ 基于 Next.js + Tailwind CSS 构建
- 🤖 使用 Playwright 自动化爬取
- 🚀 部署到 GitHub Pages（完全免费）

## 技术栈

- **前端框架**: Next.js 15 (App Router)
- **样式**: Tailwind CSS
- **爬虫**: Playwright (Chromium)
- **部署**: GitHub Actions + GitHub Pages
- **图标**: Lucide React

## 本地开发

### 环境要求

- Node.js 18+
- npm 或 yarn

### 安装依赖

```bash
npm install
```

### 运行开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

### 手动爬取推文

由于 X (Twitter) 需要登录，爬虫需要手动操作：

```bash
npm run crawler
```

**注意**:
1. 脚本会打开浏览器窗口
2. 在 120 秒内手动登录 X
3. 登录后脚本会自动爬取数据
4. 数据保存在 `public/data/tweets.json`

### 构建生产版本

```bash
npm run build
npm run start
```

## GitHub 部署

### 1. 创建 GitHub 仓库

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/ai-twitter-daily.git
git push -u origin main
```

### 2. 启用 GitHub Pages

1. 进入仓库 Settings → Pages
2. Source 选择 "GitHub Actions"
3. 保存

### 3. 配置 GitHub Actions

当前工作流使用手动模式（由于 X 需要登录）。

**自动爬取（可选）**:

如果需要自动化爬取，可以：

1. 使用 X API (需要申请 API Key)
2. 使用第三方服务（如 nitter.net）
3. 在本地运行爬虫并提交数据

## 项目结构

```
ai-twitter-daily/
├── .github/
│   └── workflows/
│       └── scrape.yml          # GitHub Actions 工作流
├── public/
│   └── data/
│       └── tweets.json        # 推文数据（自动生成）
├── scripts/
│   └── crawler.js            # Playwright 爬虫脚本
├── src/
│   ├── app/
│   │   ├── globals.css       # 全局样式
│   │   ├── layout.tsx        # 根布局
│   │   └── page.tsx          # 主页面
│   └── components/           # 可复用组件
├── .gitignore
├── next.config.ts           # Next.js 配置
├── package.json
├── tailwind.config.ts      # Tailwind 配置
└── tsconfig.json           # TypeScript 配置
```

## 数据格式

`public/data/tweets.json` 格式：

```json
{
  "date": "2026-01-20T12:00:00.000Z",
  "tweets": [
    {
      "id": "1234567890",
      "text": "推文内容",
      "author": "作者名",
      "handle": "username",
      "likes": 1000,
      "retweets": 500,
      "replies": 100,
      "url": "https://x.com/username/status/1234567890",
      "timestamp": "2026-01-20T11:00:00.000Z"
    }
  ]
}
```

## 自定义配置

### 修改搜索关键词

编辑 `scripts/crawler.js`：

```javascript
await page.goto('https://x.com/search?q=%23AI%20lang%3Aen&src=typed_query&f=live')
```

修改 `%23AI` 为其他关键词。

### 修改爬取数量

编辑 `scripts/crawler.js`：

```javascript
const topTweets = tweets
  .sort((a, b) => b.engagementScore - a.engagementScore)
  .slice(0, 10)  // 修改这里改变数量
```

### 修改更新频率

编辑 `.github/workflows/scrape.yml`：

```yaml
schedule:
  - cron: '0 0 * * *'  # 每天 UTC 00:00 执行
```

## 常见问题

### Q: 为什么 GitHub Actions 不自动爬取？

A: X (Twitter) 需要登录才能访问，GitHub Actions 无法自动登录。需要：
1. 本地运行 `npm run crawler`
2. 提交数据到仓库
3. GitHub Actions 自动部署

### Q: 如何完全自动化？

A: 可以使用：
- X 官方 API（需要申请）
- 第三方 API（如 TweetCatcher、Nitter）
- 使用代理 + cookie 存储

### Q: 数据显示"暂无数据"？

A: 确保运行过爬虫脚本并生成了 `public/data/tweets.json` 文件。

### Q: 如何修改主题颜色？

A: 编辑 `tailwind.config.ts` 或直接修改 `src/app/page.tsx` 中的 Tailwind 类名。

## 许可证

MIT License

## 贡献

欢迎提交 Issue 和 Pull Request！

## 联系方式

如有问题，请在 GitHub 上提交 Issue。

---

**免责声明**: 本项目仅用于学习和研究目的。使用时请遵守 X (Twitter) 的服务条款和相关法律法规。
