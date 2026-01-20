# GitHub 部署认证指南

## 问题

GitHub CLI 的 OAuth App 没有 `workflow` 权限，无法推送 `.github/workflows/` 文件。

## 解决方案：创建 Personal Access Token

### 步骤 1：生成 Token

1. 访问 https://github.com/settings/tokens
2. 点击 "Generate new token" → "Generate new token (classic)"
3. Token 名称填写：`ai-twitter-daily-deploy`
4. 选择权限（勾选）：
   - ✅ `repo`（完整仓库控制）
   - ✅ `workflow`（工作流权限）
5. 点击 "Generate token"
6. **复制 Token**（只显示一次，务必保存）

### 步骤 2：使用 Token 推送

在项目目录执行：

```bash
cd ~/Documents/ai-twitter-daily

# 添加 remote
git remote set-url origin https://YOUR_TOKEN@github.com/zzl7690/ai-twitter-daily.git

# 推送代码
git push -u origin main
```

**替换 `YOUR_TOKEN` 为刚才复制的 Token。**

### 步骤 3：启用 GitHub Pages

1. 访问 https://github.com/zzl7690/ai-twitter-daily
2. 进入 "Settings" → "Pages"
3. "Source" 选择 "GitHub Actions"
4. 点击 "Save"

## 注意事项

⚠️ **安全提示**：
- Token 相当于密码，不要分享给他人
- 可以在 GitHub 随时撤销
- 建议定期更新 Token

✅ 完成后，访问网站：
```
https://zzl7690.github.io/ai-twitter-daily/
```
