# Quickstart: GitHub CI 集成验证

**Feature**: 002-github-ci
**Date**: 2025-09-30
**Purpose**: 验证 GitHub Actions CI/CD 集成正确配置并正常工作

## Prerequisites

- GitHub 仓库已启用 GitHub Actions
- 仓库已配置 NPM_TOKEN secret(用于发布)
- 本地安装 Git 和 GitHub CLI(可选)

## Scenario 1: 验证主 CI 工作流

### 目标
确认代码推送触发 CI 工作流,并成功执行所有检查。

### Steps

1. **创建测试分支**
   ```bash
   git checkout -b test-ci-integration
   ```

2. **修改任意源文件**(触发 CI)
   ```bash
   # 示例:在 README.md 添加一行注释
   echo "# Test CI integration" >> README.md
   git add README.md
   git commit -m "test: trigger CI workflow"
   ```

3. **推送到远程仓库**
   ```bash
   git push origin test-ci-integration
   ```

4. **验证工作流触发**
   - 访问 GitHub 仓库的 Actions 页面
   - 应看到名为 "CI" 的工作流正在运行
   - 工作流应显示两个并行的 job(Node.js 18.x 和 20.x)

5. **检查执行步骤**
   工作流应包含以下步骤,且全部成功:
   - ✅ Checkout code
   - ✅ Setup Node.js (18.x)
   - ✅ Setup Node.js (20.x)
   - ✅ Install dependencies
   - ✅ Run linter
   - ✅ Run type check
   - ✅ Run tests with coverage
   - ✅ Build project

6. **验证覆盖率报告**
   - 展开 "Run tests with coverage" 步骤
   - 日志应显示测试覆盖率统计(如: "Statements: 90.5%")

7. **验证构建产物**
   - 展开 "Build project" 步骤
   - 日志应显示 dist 目录生成成功

### Expected Results
- ✅ 工作流状态为绿色 Success
- ✅ 所有步骤均成功
- ✅ 两个 Node.js 版本的 job 都通过
- ✅ 执行时间 < 5 分钟

### Troubleshooting
- **依赖安装失败**: 检查 package-lock.json 是否提交到仓库
- **Lint 失败**: 运行 `npm run lint:fix` 修复代码风格问题
- **类型检查失败**: 运行 `npm run typecheck` 查看具体类型错误
- **测试失败**: 运行 `npm test` 本地调试失败的测试

## Scenario 2: 验证 PR 检查集成

### 目标
确认创建 Pull Request 触发 CI 检查,且 PR 页面正确显示检查状态。

### Steps

1. **使用测试分支创建 PR**
   ```bash
   # 使用 GitHub CLI
   gh pr create --base main --head test-ci-integration \
     --title "Test: CI Integration" \
     --body "Testing GitHub Actions CI integration"

   # 或手动在 GitHub 网页创建 PR
   ```

2. **验证 PR 页面显示检查**
   - 打开刚创建的 PR
   - 页面底部应显示 "Some checks haven't completed yet" 或 "All checks have passed"
   - 应看到 "CI / test-and-build (18.x)" 和 "CI / test-and-build (20.x)" 两个检查项

3. **等待检查完成**
   - 检查项状态从黄色(进行中)变为绿色(成功)或红色(失败)
   - 每个检查项可点击查看详细日志

4. **修改代码触发重新检查**
   ```bash
   # 在测试分支添加另一个修改
   echo "# Another test" >> README.md
   git add README.md
   git commit -m "test: trigger CI re-run"
   git push origin test-ci-integration
   ```

5. **验证自动重新运行**
   - PR 页面应显示新的检查正在运行
   - 旧的检查结果被新的替代

### Expected Results
- ✅ PR 页面显示所有检查项
- ✅ 检查项状态实时更新
- ✅ 推送新提交自动触发重新检查
- ✅ 可点击检查项查看详细日志

## Scenario 3: 验证分支保护规则(可选但推荐)

### 目标
确认主分支配置了正确的保护规则,要求 CI 检查通过才能合并。

### Steps

1. **配置分支保护规则**
   - 访问仓库 Settings > Branches
   - 为 `main` 分支添加保护规则
   - 启用 "Require status checks to pass before merging"
   - 选择必需的检查: `test-and-build (18.x)` 和 `test-and-build (20.x)`
   - 保存规则

2. **尝试合并未通过检查的 PR**
   - 如果 CI 检查失败,PR 合并按钮应被禁用
   - 显示消息: "Required statuses must pass before merging"

3. **验证检查通过后可合并**
   - CI 检查全部通过后,合并按钮变为可用
   - 显示绿色 "Merge pull request" 按钮

### Expected Results
- ✅ 分支保护规则正确配置
- ✅ CI 失败阻止合并
- ✅ CI 成功允许合并

## Scenario 4: 验证 CI 失败场景

### 目标
确认 CI 能够正确检测代码问题并失败。

### Steps

1. **引入 Lint 错误**
   ```bash
   # 创建一个有 linting 问题的文件
   echo "const x = 1  // 故意遗漏分号" > src/test-lint-error.ts
   git add src/test-lint-error.ts
   git commit -m "test: introduce lint error"
   git push origin test-ci-integration
   ```

2. **验证 CI 失败**
   - GitHub Actions 页面应显示工作流失败(红色 X)
   - "Run linter" 步骤应标记为失败
   - 日志应显示具体的 linting 错误

3. **修复错误并验证恢复**
   ```bash
   # 删除测试文件
   git rm src/test-lint-error.ts
   git commit -m "test: fix lint error"
   git push origin test-ci-integration
   ```

4. **验证 CI 恢复成功**
   - 新的工作流运行应该成功
   - PR 检查状态变为绿色

### Expected Results
- ✅ CI 正确检测 linting 错误
- ✅ 工作流失败并显示清晰错误信息
- ✅ 修复后 CI 恢复正常

## Scenario 5: 验证 npm 发布工作流

### 目标
确认版本标签触发发布工作流,成功发布包到 npm。

### Steps

1. **配置 NPM_TOKEN Secret**
   - 访问 https://www.npmjs.com/settings/{username}/tokens
   - 创建 Automation 类型的 token
   - 访问 GitHub 仓库 Settings > Secrets and variables > Actions
   - 添加 secret: Name = `NPM_TOKEN`, Value = 你的 npm token

2. **更新版本号**
   ```bash
   # 切换到主分支
   git checkout main
   git pull origin main

   # 更新版本(使用 npm version 自动创建 commit 和 tag)
   npm version patch -m "chore: release v%s"
   ```

3. **推送标签触发发布**
   ```bash
   # 推送 commit 和标签
   git push origin main --follow-tags
   ```

4. **验证发布工作流执行**
   - 访问 GitHub Actions 页面
   - 应看到名为 "Publish to npm" 的工作流正在运行
   - 工作流由标签(如 v1.0.1)触发

5. **检查发布步骤**
   工作流应包含以下步骤:
   - ✅ Checkout code
   - ✅ Setup Node.js
   - ✅ Install dependencies
   - ✅ Run tests
   - ✅ Build project
   - ✅ Publish to npm

6. **验证包已发布**
   ```bash
   # 检查 npm 上的最新版本
   npm view tushare-typescript-sdk version

   # 应该显示刚发布的版本号
   ```

7. **验证包内容**
   ```bash
   # 下载并检查发布的包
   npm pack tushare-typescript-sdk
   tar -tzf tushare-typescript-sdk-*.tgz

   # 应该包含:
   # - package/dist/index.js
   # - package/dist/index.cjs
   # - package/dist/index.d.ts
   # - package/package.json
   ```

### Expected Results
- ✅ 发布工作流成功执行
- ✅ 包成功发布到 npm
- ✅ 版本号与标签一致
- ✅ 包内容包含编译后的代码和类型定义

### Troubleshooting
- **NPM_TOKEN 认证失败**: 检查 token 是否正确配置,是否有发布权限
- **版本已存在**: 确保 package.json 版本号递增,不与现有版本冲突
- **包名冲突**: 如果首次发布,确保包名在 npm 上可用

## Scenario 6: 验证依赖缓存效果

### 目标
确认 npm 依赖缓存正常工作,加速后续 CI 执行。

### Steps

1. **首次运行 CI**
   - 推送代码触发 CI
   - 记录 "Install dependencies" 步骤的执行时间(应该 30-60 秒)
   - 日志应显示: "Cache not found" 或 "Post job cleanup"

2. **第二次运行 CI**(无 package.json 修改)
   ```bash
   # 修改非依赖文件
   echo "# Cache test" >> README.md
   git add README.md
   git commit -m "test: verify cache"
   git push origin test-ci-integration
   ```

3. **对比执行时间**
   - "Install dependencies" 步骤应显著加速(5-10 秒)
   - 日志应显示: "Cache restored from key: ..."

4. **修改依赖后验证缓存失效**
   ```bash
   # 修改 package.json(如添加新依赖)
   npm install lodash
   git add package.json package-lock.json
   git commit -m "test: add dependency"
   git push origin test-ci-integration
   ```

5. **验证缓存重建**
   - "Install dependencies" 步骤耗时恢复到 30-60 秒
   - 日志应显示: "Cache restored from key: ..." 但会重新安装

### Expected Results
- ✅ 首次运行建立缓存
- ✅ 后续运行使用缓存,加速依赖安装
- ✅ 依赖变更时缓存失效并重建

## Cleanup

完成验证后,清理测试资源:

```bash
# 删除测试分支
git checkout main
git branch -D test-ci-integration
git push origin --delete test-ci-integration

# 关闭测试 PR(如果已创建)
gh pr close {PR_NUMBER}

# 删除测试标签(如果创建)
git tag -d v1.0.1
git push origin --delete v1.0.1

# 取消发布测试版本(如果发布)
npm unpublish tushare-typescript-sdk@1.0.1
# 注意: npm unpublish 只能在发布后 72 小时内执行
```

## Success Criteria

完成以上所有场景后,CI/CD 集成应满足以下标准:

- ✅ 代码推送自动触发 CI 检查
- ✅ PR 创建/更新自动触发 CI 检查
- ✅ CI 在 Node.js 18.x 和 20.x 上并行测试
- ✅ 所有代码质量检查(lint, typecheck, test, build)正常执行
- ✅ 测试覆盖率报告显示在日志中
- ✅ npm 依赖缓存正常工作
- ✅ 版本标签触发 npm 发布流程
- ✅ 分支保护规则强制要求 CI 通过
- ✅ 执行时间符合性能目标(< 5 分钟)

## Continuous Validation

CI/CD 集成后,定期检查:
- [ ] CI 工作流成功率(应 > 95%,排除代码问题导致的失败)
- [ ] 平均执行时间(应保持在 5 分钟内)
- [ ] 缓存命中率(应 > 80%)
- [ ] npm 发布流程无人工干预

---
**Last Updated**: 2025-09-30
**Next Review**: 每季度或发布新版本时