# 分支保护规则配置指导文档

**Feature**: 002-github-ci
**Date**: 2025-09-30
**Purpose**: 指导项目维护者配置 GitHub 分支保护规则,确保代码质量

## 概述

分支保护规则通过强制要求 CI 检查通过才能合并代码,保证主分支代码质量。本文档指导如何为 `main` 分支配置保护规则。

## 前置条件

- 拥有仓库的管理员(Admin)或维护者(Maintainer)权限
- CI 工作流已配置并成功运行至少一次
- 确认 CI 工作流名称为 "CI",job 名称为 "test-and-build"

## 步骤 1: 访问分支保护设置

### 1.1 进入仓库设置
1. 打开 GitHub 仓库页面
2. 点击 **Settings** 选项卡
3. 在左侧菜单选择 **Branches**

### 1.2 添加分支保护规则
1. 在 "Branch protection rules" 部分
2. 点击 **"Add branch protection rule"** 按钮

## 步骤 2: 配置主分支保护规则

### 2.1 指定分支模式
- **Branch name pattern**: 输入 `main`
- 这将保护名为 "main" 的分支

### 2.2 启用状态检查要求

#### 必需配置
勾选以下选项:
- ✅ **Require status checks to pass before merging**
  - 强制要求所有指定的状态检查通过
- ✅ **Require branches to be up to date before merging**
  - 确保合并前分支是最新的,避免冲突

#### 选择必需的状态检查
在 "Status checks that are required" 搜索框中搜索并添加:
- `test-and-build (18.x)` - Node.js 18.x 的 CI 检查
- `test-and-build (20.x)` - Node.js 20.x 的 CI 检查

⚠️ **注意**: 状态检查名称必须与 CI 工作流中的 job 名称和 matrix 组合完全一致

### 2.3 可选配置

根据团队规模和协作方式,可以选择性启用:

#### Pull Request 要求(推荐小团队启用)
- ⬜ **Require a pull request before merging**
  - 强制通过 PR 合并(不能直接推送到主分支)
- ⬜ **Require approvals**: 1
  - 要求至少 1 人审批 PR

#### 其他可选配置
- ⬜ **Require conversation resolution before merging**
  - 要求解决所有 PR 讨论
- ⬜ **Require signed commits**
  - 要求所有提交使用 GPG 签名
- ⬜ **Require linear history**
  - 要求线性历史(禁止 merge commits)

### 2.4 保存规则
1. 滚动到页面底部
2. 点击 **"Create"** 按钮
3. 规则立即生效

## 步骤 3: 验证配置

### 3.1 检查规则已应用
1. 返回 Branches 设置页面
2. 应该看到 `main` 分支的保护规则
3. 规则状态显示为 "Active"

### 3.2 测试保护规则

#### 测试场景 1: 阻止未通过 CI 的合并
1. 创建一个测试 PR,引入代码问题(如 lint 错误)
2. 等待 CI 失败
3. 尝试合并 PR
4. **预期结果**: 合并按钮被禁用,显示 "Required statuses must pass"

#### 测试场景 2: 允许通过 CI 的合并
1. 修复代码问题
2. 等待 CI 通过(所有检查项显示绿色 ✅)
3. 尝试合并 PR
4. **预期结果**: 合并按钮可用,显示 "Merge pull request"

### 3.3 验证分支最新要求
1. 在一个 PR 通过 CI 后
2. 向 main 分支合并另一个 PR(或直接推送新提交)
3. 返回第一个 PR
4. **预期结果**: 显示 "This branch is out-of-date with the base branch",需要更新后重新运行 CI

## 配置示例

### 小型项目/个人项目(最小配置)
```
Branch name pattern: main
✅ Require status checks to pass before merging
✅ Require branches to be up to date before merging
   Required checks:
   - test-and-build (18.x)
   - test-and-build (20.x)
```

### 小团队项目(推荐配置)
```
Branch name pattern: main
✅ Require status checks to pass before merging
✅ Require branches to be up to date before merging
   Required checks:
   - test-and-build (18.x)
   - test-and-build (20.x)
✅ Require a pull request before merging
   Required approvals: 1
✅ Require conversation resolution before merging
```

### 大团队/企业项目(严格配置)
```
Branch name pattern: main
✅ Require status checks to pass before merging
✅ Require branches to be up to date before merging
   Required checks:
   - test-and-build (18.x)
   - test-and-build (20.x)
✅ Require a pull request before merging
   Required approvals: 2
✅ Require conversation resolution before merging
✅ Require signed commits
✅ Require linear history
✅ Include administrators (规则对管理员也生效)
```

## 故障排查

### 问题 1: 找不到状态检查选项
**现象**: 搜索框中找不到 `test-and-build (18.x)` 等选项

**原因**:
- CI 工作流尚未成功运行过
- Job 名称或 matrix 配置不匹配

**解决方法**:
1. 推送代码触发 CI,确保工作流成功运行一次
2. 等待 1-2 分钟后刷新分支保护设置页面
3. 检查 `.github/workflows/ci.yml` 中的 job 名称是否为 `test-and-build`
4. 检查 matrix 策略是否为 `[18.x, 20.x]`

### 问题 2: 合并按钮始终被禁用
**现象**: 即使 CI 通过,合并按钮仍然禁用

**原因**:
- 分支不是最新的(启用了 "Require branches to be up to date")
- 有其他保护规则未满足(如缺少审批)

**解决方法**:
1. 点击 PR 页面的 "Update branch" 按钮
2. 等待 CI 重新运行并通过
3. 检查所有保护规则是否满足

### 问题 3: 管理员无法直接推送
**现象**: 即使是管理员,也无法直接推送到 main 分支

**原因**:
- 启用了 "Do not allow bypassing the above settings" 或 "Include administrators"

**解决方法**:
1. 如果需要管理员有特权,取消勾选 "Include administrators"
2. 或者管理员也通过 PR 流程合并代码(推荐)

## 最佳实践

### 1. 分阶段启用保护规则
对新项目或团队:
1. 第一周: 仅启用 CI 检查要求
2. 第二周: 添加 PR 要求
3. 第三周: 添加审批要求
4. 逐步适应,避免阻碍开发流程

### 2. 保持检查项最小化
- ✅ 仅添加关键的 CI 检查(lint, test, build)
- ❌ 不要添加可选或不稳定的检查
- 原因: 任何一个检查失败都会阻止合并

### 3. 为开发分支使用不同规则
- `main` 分支: 严格保护
- `dev` 或 `staging` 分支: 较宽松的保护
- 功能分支: 无保护规则

### 4. 定期审查规则
每季度检查:
- [ ] 保护规则是否仍然适合当前团队
- [ ] CI 检查是否稳定(成功率 > 95%)
- [ ] 是否需要调整审批人数
- [ ] 新加入的 CI 检查是否需要设为必需

### 5. 处理紧急情况
如果需要紧急修复:
1. 临时禁用特定检查(不推荐)
2. 或创建临时分支保护规则例外
3. 修复后立即恢复保护规则
4. 记录例外情况和原因

## 团队协作建议

### 单人项目
```
✅ Require status checks (CI)
⬜ Require pull requests
⬜ Require approvals
```
理由: CI 足够保证代码质量,PR 对单人开发不必要

### 2-5 人小团队
```
✅ Require status checks (CI)
✅ Require pull requests
✅ Require 1 approval
```
理由: PR 和审批促进代码审查和知识共享

### 5+ 人团队
```
✅ Require status checks (CI)
✅ Require pull requests
✅ Require 2 approvals
✅ Require conversation resolution
✅ Include administrators
```
理由: 更严格的规则确保代码质量和团队协作规范

## 相关资源

- [GitHub Branch Protection 文档](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)
- [Status Checks 文档](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/collaborating-on-repositories-with-code-quality-features/about-status-checks)
- [Pull Request Reviews 文档](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/reviewing-changes-in-pull-requests/about-pull-request-reviews)

---
**Last Updated**: 2025-09-30
**Maintained By**: Project Maintainers