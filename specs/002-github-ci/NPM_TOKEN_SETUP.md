# NPM_TOKEN 配置指导文档

**Feature**: 002-github-ci
**Date**: 2025-09-30
**Purpose**: 指导项目维护者配置 NPM_TOKEN secret,用于自动发布包到 npm

## 前置条件

1. **npm 账户要求**
   - 拥有有效的 npm 账户
   - 账户已通过邮箱验证
   - 登录地址: https://www.npmjs.com

2. **包发布权限验证**
   - 确认你是包 `tushare-typescript-sdk` 的所有者或维护者
   - 如果是首次发布,确保包名在 npm 上可用
   - 验证方法: 访问 https://www.npmjs.com/package/tushare-typescript-sdk

## 步骤 1: 创建 npm Access Token

### 1.1 登录 npm
访问 https://www.npmjs.com 并登录你的账户

### 1.2 进入 Access Tokens 页面
1. 点击右上角头像
2. 选择 **"Access Tokens"**
3. 或直接访问: https://www.npmjs.com/settings/{username}/tokens

### 1.3 创建新 Token
1. 点击 **"Generate New Token"** 按钮
2. 选择 Token 类型:
   - ✅ 选择 **"Automation"** (用于 CI/CD)
   - ❌ 不要选择 "Publish" 或 "Read-only"
3. 填写 Token 描述(推荐): `GitHub Actions - tushare-typescript-sdk`
4. 点击 **"Generate Token"**

### 1.4 复制 Token
⚠️ **重要**: Token 只会显示一次,请立即复制并保存

```
示例 token 格式:
npm_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

## 步骤 2: 配置 GitHub Secret

### 2.1 访问仓库设置
1. 打开 GitHub 仓库页面
2. 点击 **Settings** 选项卡
3. 在左侧菜单选择 **Secrets and variables** > **Actions**

### 2.2 添加新 Secret
1. 点击 **"New repository secret"** 按钮
2. 填写信息:
   - **Name**: `NPM_TOKEN` (必须完全一致,区分大小写)
   - **Value**: 粘贴步骤 1.4 复制的 token
3. 点击 **"Add secret"** 保存

### 2.3 验证配置
- 返回 Secrets 列表页面
- 应该看到 `NPM_TOKEN` 已添加
- Value 会显示为 `***` (加密隐藏)

## 步骤 3: 验证配置

### 3.1 查看现有工作流
确认 `.github/workflows/publish.yml` 正确引用了 secret:

```yaml
- name: Publish to npm
  run: npm publish
  env:
    NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

### 3.2 测试发布流程
⚠️ **注意**: 这将实际发布包到 npm,请谨慎操作

```bash
# 确保在主分支
git checkout main
git pull origin main

# 更新版本号
npm version patch -m "chore: release v%s"

# 推送标签触发发布
git push origin main --follow-tags
```

### 3.3 监控工作流执行
1. 访问 GitHub 仓库的 **Actions** 页面
2. 应该看到 "Publish to npm" 工作流正在运行
3. 等待所有步骤完成
4. 检查 "Publish to npm" 步骤是否成功

### 3.4 验证包已发布
```bash
# 检查 npm 上的最新版本
npm view tushare-typescript-sdk version

# 应该显示刚发布的版本号
```

## 故障排查

### 问题 1: 认证失败
**现象**: 工作流在 "Publish to npm" 步骤失败,日志显示 `401 Unauthorized`

**原因**:
- NPM_TOKEN 未配置或配置错误
- Token 已过期或被撤销
- Token 类型不正确(不是 Automation 类型)

**解决方法**:
1. 检查 GitHub Secret 名称是否为 `NPM_TOKEN`(区分大小写)
2. 重新生成 npm token(Automation 类型)
3. 更新 GitHub Secret 的值

### 问题 2: 权限不足
**现象**: 日志显示 `403 Forbidden` 或 `You do not have permission to publish`

**原因**:
- Token 对应的账户没有发布权限
- 包已被其他用户占用

**解决方法**:
1. 在 npm 网站确认你是包的维护者
2. 如果是首次发布,确保包名可用
3. 如果包被占用,考虑使用 scoped 包名(如 `@username/tushare-typescript-sdk`)

### 问题 3: 版本号已存在
**现象**: 日志显示 `You cannot publish over the previously published versions`

**原因**:
- 尝试发布的版本号已存在于 npm

**解决方法**:
```bash
# 更新 package.json 版本号
npm version patch  # 或 minor, major

# 重新推送标签
git push origin main --follow-tags
```

### 问题 4: package.json 配置错误
**现象**: npm publish 失败,日志显示配置验证错误

**解决方法**:
检查 `package.json` 必需字段:
- `name`: 包名称
- `version`: 版本号
- `main`: 主入口文件
- `files`: 包含的文件列表(应包含 `dist`)

## 安全建议

### 1. Token 权限最小化
- ✅ 使用 "Automation" 类型 token(仅发布权限)
- ❌ 不要使用具有更多权限的 token

### 2. 定期轮换 Token
- 建议每 90 天轮换一次 token
- 步骤:
  1. 在 npm 创建新 token
  2. 更新 GitHub Secret
  3. 撤销旧 token

### 3. 监控发布活动
- 定期检查 npm 发布历史
- 访问: https://www.npmjs.com/package/tushare-typescript-sdk
- 确认所有发布都是预期的

### 4. 不要在代码中暴露 Token
- ❌ 不要将 token 提交到代码仓库
- ❌ 不要在 GitHub Issues/PR 中粘贴 token
- ✅ 仅通过 GitHub Secrets 管理
- ✅ 定期扫描代码库检查敏感信息泄露

## 维护清单

定期检查(建议每季度):
- [ ] NPM_TOKEN 是否仍然有效
- [ ] Token 权限是否正确(Automation 类型)
- [ ] 最近的发布是否都是授权的
- [ ] 考虑是否需要轮换 token

## 相关资源

- [npm Access Tokens 文档](https://docs.npmjs.com/about-access-tokens)
- [GitHub Actions Secrets 文档](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [npm Publishing 最佳实践](https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry)

---
**Last Updated**: 2025-09-30
**Maintained By**: Project Maintainers