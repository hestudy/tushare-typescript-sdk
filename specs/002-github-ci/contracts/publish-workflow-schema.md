# Publish Workflow Contract

**Feature**: 002-github-ci
**Date**: 2025-09-30
**Type**: GitHub Actions Workflow Configuration

## Overview
定义 npm 发布工作流的配置契约,该工作流在版本标签推送时自动触发,构建并发布包到 npm。

## Workflow Configuration Contract

### Trigger Events
```yaml
on:
  push:
    tags:
      - 'v*'  # 匹配所有以 v 开头的标签,如 v1.0.0, v2.1.3
```

**契约要求**:
- 必须仅监听 `push.tags` 事件
- 标签模式必须为 `v*`(语义化版本标签)
- 不应监听其他事件(如 push.branches, pull_request)

### Job: publish-npm

#### 运行环境
```yaml
runs-on: ubuntu-latest
```

**契约要求**:
- 必须使用 `ubuntu-latest`
- 不使用 matrix 策略(发布仅需单一环境)

### Steps Contract

#### 1. Checkout Code
```yaml
- uses: actions/checkout@v4
```

**契约要求**:
- 使用 `actions/checkout@v4`
- 检出标签对应的代码

#### 2. Setup Node.js
```yaml
- uses: actions/setup-node@v4
  with:
    node-version: '20.x'
    registry-url: 'https://registry.npmjs.org'
    cache: 'npm'
```

**契约要求**:
- 使用 `actions/setup-node@v4`
- `node-version` 固定为 `20.x`(项目主要版本)
- 必须设置 `registry-url` 为 npm 官方源
- 必须启用 npm 缓存

#### 3. Install Dependencies
```yaml
- run: npm ci
```

**契约要求**:
- 使用 `npm ci` 确保确定性安装
- 依赖 `package-lock.json` 存在

#### 4. Run Tests
```yaml
- run: npm test
```

**契约要求**:
- 发布前必须执行测试
- 脚本定义于 `package.json`:`"test": "vitest run"`
- 测试失败阻止发布

#### 5. Build Project
```yaml
- run: npm run build
```

**契约要求**:
- 执行生产构建
- 脚本定义于 `package.json`:`"build": "tsdown"`
- 构建失败阻止发布
- 验证 dist 目录生成

#### 6. Publish to npm
```yaml
- run: npm publish
  env:
    NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

**契约要求**:
- 使用 `npm publish` 发布包
- 必须通过 `NODE_AUTH_TOKEN` 环境变量提供认证
- `NPM_TOKEN` 必须在 GitHub Secrets 中配置
- 发布失败导致工作流失败

## Expected Outputs

### 成功场景
- 所有步骤状态为 ✅ (成功)
- 包成功发布到 npm: `https://www.npmjs.com/package/tushare-typescript-sdk`
- 版本号与标签一致(package.json 中的 version)
- 工作流整体状态为 Success

### 失败场景
- 任一步骤失败,后续步骤不执行
- 包未发布到 npm
- 工作流整体状态为 Failure
- GitHub 发送失败通知

## Validation Rules

### Pre-execution Validation
- [ ] Git 标签格式正确(v*.*.*,符合语义化版本)
- [ ] `package.json` 中的 version 与标签匹配(去掉 v 前缀)
- [ ] `NPM_TOKEN` secret 已配置且有效
- [ ] `package.json` 包含正确的 `name`, `version`, `files` 字段

### Post-execution Validation
- [ ] npm 上的包版本更新
- [ ] 发布的包内容包含 dist 目录
- [ ] 包的 types 字段正确指向类型定义
- [ ] 包的 main/module 字段正确

## Error Handling

### 常见错误及预期行为

1. **NPM_TOKEN 未配置或无效**
   - 原因: GitHub Secret 未设置或令牌过期
   - 行为: 工作流在 "Publish to npm" 步骤失败
   - 日志: 显示 npm 认证错误
   - 解决: 在 GitHub 仓库设置中配置有效的 NPM_TOKEN

2. **版本号已存在**
   - 原因: 尝试发布已存在的版本
   - 行为: npm publish 失败,返回 403 错误
   - 日志: "You cannot publish over the previously published versions"
   - 解决: 更新 package.json 版本号并推送新标签

3. **测试失败**
   - 原因: 代码问题导致测试失败
   - 行为: 工作流在 "Run Tests" 步骤失败
   - 日志: 显示失败测试详情
   - 解决: 修复测试问题后重新打标签

4. **构建失败**
   - 原因: 编译错误
   - 行为: 工作流在 "Build Project" 步骤失败
   - 日志: 显示编译错误
   - 解决: 修复代码后重新打标签

5. **package.json 配置错误**
   - 原因: 缺少必需字段或配置不正确
   - 行为: npm publish 失败
   - 日志: 显示配置验证错误
   - 解决: 修正 package.json 配置

## Security Contract

### Secrets Management
- `NPM_TOKEN` 必须存储在 GitHub Secrets
- 令牌具有发布权限但不应有其他敏感权限
- 令牌应定期轮换(建议每 90 天)

### Access Control
- 仅标签推送触发发布
- 标签推送通常需要仓库维护者权限
- 发布操作不应由 PR 或普通推送触发

### Audit Trail
- 每次发布都有对应的 Git 标签
- GitHub Actions 日志保留发布记录
- npm 发布历史可追溯

## Performance Contract

- **总执行时间**: < 3 分钟
- **依赖安装**: < 10 秒(有缓存)
- **构建时间**: < 20 秒
- **发布时间**: < 10 秒

## Integration Points

- **npm Registry**: 包发布到 https://registry.npmjs.org
- **GitHub Releases**: 可选,后续可添加 GitHub Release 创建
- **Notifications**: 发布成功或失败通知仓库管理员

## Usage Example

### 发布新版本的完整流程

1. **更新版本号**
   ```bash
   # 更新 package.json 中的 version 字段
   npm version patch  # 或 minor, major
   ```

2. **推送标签**
   ```bash
   git push origin v1.0.1
   ```

3. **验证发布**
   - 查看 GitHub Actions 工作流执行
   - 确认 npm 上的新版本: `npm view tushare-typescript-sdk version`

## Rollback Strategy

如果发布的版本有问题:
1. **不要删除 npm 版本**(npm 不允许重新发布相同版本号)
2. 发布新的 patch 版本修复问题
3. 使用 `npm deprecate` 标记有问题的版本:
   ```bash
   npm deprecate tushare-typescript-sdk@1.0.1 "Version has critical bug, use 1.0.2 instead"
   ```

---
**Contract Version**: 1.0.0
**Last Updated**: 2025-09-30