# 部署到 GitHub Pages 指南

## 前置要求

- GitHub 账号
- 本地已安装 Node.js
- 本地项目已构建成功

## 步骤 1: 创建 GitHub 仓库

1. 登录 [GitHub](https://github.com)
2. 点击右上角 "+"，选择 "New repository"
3. 仓库名填写：`ai-twitter-daily`（或其他名称）
4. 设置为 Public（公开）
5. 点击 "Create repository"

## 步骤 2: 推送代码到 GitHub

在项目目录执行：

```bash
cd ~/Documents/ai-twitter-daily

# 关联远程仓库（替换 YOUR_USERNAME 为你的 GitHub 用户名）
git remote add origin https://github.com/YOUR_USERNAME/ai-twitter-daily.git

# 推送代码
git push -u origin main
```

## 步骤 3: 启用 GitHub Pages

1. 进入仓库页面
2. 点击 "Settings" 标签页
3. 左侧菜单点击 "Pages"
4. "Source" 选择 "GitHub Actions"
5. 点击 "Save"

## 步骤 4: 首次部署

推送代码后，GitHub Actions 会自动运行：

1. 进入 "Actions" 标签页
2. 等待工作流运行完成（约 3-5 分钟）
3. 成功后会显示绿色勾号

## 步骤 5: 访问网站

部署成功后，访问：

```
https://YOUR_USERNAME.github.io/ai-twitter-daily/
```

替换 `YOUR_USERNAME` 为你的 GitHub 用户名。

## 步骤 6: 更新数据

由于 X (Twitter) 需要登录，GitHub Actions 默认使用手动模式：

### 方式一：本地爬取并推送

```bash
# 1. 运行爬虫
cd ~/Documents/ai-twitter-daily
npm run crawler

# 2. 浏览器会自动打开，在 120 秒内登录 X

# 3. 爬取完成后提交数据
git add public/data/tweets.json
git commit -m "Update tweets data"
git push
```

GitHub Actions 会自动重新构建并部署。

### 方式二：设置定时任务（高级）

在本地机器设置定时任务，每日自动爬取并推送：

**macOS/Linux (Cron):**

```bash
# 编辑 crontab
crontab -e

# 添加以下行（每天凌晨 2 点执行）
0 2 * * * cd ~/Documents/ai-twitter-daily && npm run crawler && git add public/data/tweets.json && git commit -m "Auto update tweets data" && git push
```

**macOS (Launchd):**

创建文件 `~/Library/LaunchAgents/com.ai-twitter-daily.plist`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.ai-twitter-daily</string>
    <key>ProgramArguments</key>
    <array>
        <string>/bin/zsh</string>
        <string>-c</string>
        <string>cd ~/Documents/ai-twitter-daily && npm run crawler && git add public/data/tweets.json && git commit -m "Auto update tweets data" && git push</string>
    </array>
    <key>StartCalendarInterval</key>
    <dict>
        <key>Hour</key>
        <integer>2</integer>
        <key>Minute</key>
        <integer>0</integer>
    </dict>
    <key>StandardOutPath</key>
    <string>/tmp/ai-twitter-daily.log</string>
    <key>StandardErrorPath</key>
    <string>/tmp/ai-twitter-daily.err</string>
</dict>
</plist>
```

加载定时任务：

```bash
launchctl load ~/Library/LaunchAgents/com.ai-twitter-daily.plist
```

### 方式三：使用 X API（需要申请）

如果需要完全自动化，可以申请 X API：

1. 访问 [X Developer Portal](https://developer.twitter.com/)
2. 创建应用，获取 API Key
3. 在 GitHub 仓库设置 Secrets:
   - `X_API_TOKEN`: 你的 API Token
   - `X_AUTHORIZATION`: 你的 Authorization header
4. 修改 `.github/workflows/scrape.yml` 使用 API 而非 Playwright

## 常见问题

### Q: 网站显示 404 错误

A:
1. 检查 GitHub Pages 设置是否选择 "GitHub Actions"
2. 等待几分钟让 Actions 完成
3. 检查 Actions 是否有错误日志

### Q: 网站显示"暂无数据"

A:
1. 本地运行 `npm run crawler` 爬取数据
2. 确认 `public/data/tweets.json` 文件存在且有内容
3. 提交并推送代码

### Q: GitHub Actions 构建失败

A:
1. 进入 "Actions" 查看错误日志
2. 常见问题：
   - 依赖安装失败 → 删除 `node_modules` 重新安装
   - 构建超时 → 简化页面或优化图片
   - TypeScript 错误 → 运行 `npm run lint` 检查

### Q: 如何修改网站样式？

A:
1. 编辑 `src/app/page.tsx` 中的 Tailwind 类名
2. 或编辑 `src/app/globals.css` 添加自定义样式
3. 本地测试：`npm run dev`
4. 提交并推送代码

### Q: 如何修改搜索关键词？

A:
编辑 `scripts/crawler.js` 中的搜索 URL:

```javascript
await page.goto('https://x.com/search?q=%23AI%20lang%3Aen&src=typed_query&f=live')
```

修改 `%23AI` 为其他关键词，例如：
- `%23MachineLearning` - 机器学习
- `%23LLM` - 大语言模型
- `OpenAI` - OpenAI 相关

## 维护和监控

### 查看访问统计

GitHub Pages 本身不提供访问统计，可使用：
- [Google Analytics](https://analytics.google.com/)
- [Cloudflare Analytics](https://www.cloudflare.com/analytics/)

### 定期更新依赖

```bash
# 检查过期依赖
npm outdated

# 更新依赖
npm update

# 测试构建
npm run build
```

## 安全建议

1. **不要提交敏感信息**：API Token、Cookie 等应存储在 GitHub Secrets
2. **定期更新依赖**：修复安全漏洞
3. **限制爬虫频率**：避免被封禁

## 下一步

- 添加深色模式切换按钮
- 支持更多数据源（Reddit、Hacker News）
- 添加评论和点赞功能
- 创建移动端优化

---

如有问题，请查看 [README.md](./README.md) 或提交 GitHub Issue。
