# Research: GitHub CI 集成

**Feature**: 002-github-ci
**Date**: 2025-09-30
**Status**: Complete

## Research Overview
本文档记录了为 tushare-typescript-sdk 项目集成 GitHub Actions CI/CD 流程的技术研究结果。

## 1. GitHub Actions 工作流结构

### Decision
采用多工作流文件策略,按职责分离:
- `ci.yml`: 主 CI 流程(测试、lint、类型检查、构建)
- `publish.yml`: npm 发布流程(仅在版本标签触发)

### Rationale
- **职责分离**: 每个工作流文件专注单一职责,易于维护和调试
- **触发条件独立**: CI 检查和发布流程有不同的触发条件和执行上下文
- **安全性**: 发布流程使用更严格的权限控制,与日常 CI 检查分离
- **可读性**: 较小的工作流文件更容易理解和修改

### Alternatives Considered
- **单一工作流文件**: 使用条件判断在一个文件中处理所有场景
  - 拒绝原因: 文件会变得复杂,条件逻辑难以维护
- **更细粒度拆分**: 为每个检查项(测试、lint、构建)创建独立工作流
  - 拒绝原因: 过度拆分导致配置重复,并发执行控制复杂

## 2. Node.js 版本策略

### Decision
使用 Node.js 20.x 作为唯一测试和构建环境:
```yaml
strategy:
  matrix:
    node-version: [20.x]
```

### Rationale
- **简化构建**: 单一版本减少 CI 复杂度和执行时间
- **项目要求**: package.json 要求 Node.js >= 20.0.0
- **tsdown 兼容性**: tsdown 及其依赖 rolldown 在 Node.js 20.x 上最稳定
- **目标环境**: 项目主要面向使用最新 Node.js LTS 的开发者

### Alternatives Considered
- **测试 Node.js 18.x 和 20.x**: 使用 matrix 策略测试多版本
  - 拒绝原因: tsdown/rolldown 在 Node.js 18.x 上存在原生绑定问题,项目 engines 已限制 >= 20.0.0
- **测试更多版本**: 包含 Node.js 22.x
  - 拒绝原因: 22.x 尚未广泛采用,20.x 是当前稳定 LTS

## 3. npm 依赖缓存策略

### Decision
使用 GitHub Actions 官方的 `actions/setup-node` 的内置缓存功能:
```yaml
- uses: actions/setup-node@v4
  with:
    node-version: ${{ matrix.node-version }}
    cache: 'npm'
```

### Rationale
- **官方支持**: GitHub 维护,与 npm 生态系统深度集成
- **自动化**: 自动检测 `package-lock.json` 并管理缓存键
- **性能优化**: 典型场景下可将依赖安装时间从 30-60 秒减少到 5-10 秒
- **零配置**: 不需要手动管理缓存键和路径

### Alternatives Considered
- **手动缓存配置**: 使用 `actions/cache` 手动配置 node_modules
  - 拒绝原因: 需要维护缓存键逻辑,容易出错
- **不使用缓存**: 每次都重新安装依赖
  - 拒绝原因: 浪费 CI 执行时间,不符合性能目标

## 4. 测试覆盖率报告

### Decision
使用 Vitest 的内置覆盖率功能,仅在 CI 日志中显示:
```yaml
- run: npm run test:coverage
```

### Rationale
- **已集成**: 项目已配置 `@vitest/coverage-v8`,无需额外依赖
- **满足规格**: FR-013 要求在日志显示,不需要上传到第三方服务
- **简化流程**: 避免配置 Codecov/Coveralls 等外部服务
- **成本考虑**: 开源项目,减少外部服务依赖

### Alternatives Considered
- **Codecov 集成**: 上传覆盖率到 Codecov.io
  - 拒绝原因: 规格明确不需要第三方服务,增加复杂度
- **生成 HTML 报告**: 保存覆盖率 HTML 报告为 artifacts
  - 拒绝原因: 增加存储开销,日志显示已满足需求

## 5. npm 包发布策略

### Decision
使用版本标签触发的独立工作流进行 npm 发布:
```yaml
on:
  push:
    tags:
      - 'v*'
```

### Rationale
- **明确的发布时机**: 只有创建版本标签(如 v1.0.0)时才触发发布
- **安全性**: 避免意外发布,发布需要显式的标签创建操作
- **语义化版本**: 标签名称遵循语义化版本规范
- **可追溯性**: Git 标签提供发布历史的清晰记录

### Alternatives Considered
- **主分支自动发布**: 合并到主分支自动触发发布
  - 拒绝原因: 每次合并都发布,无法控制发布节奏
- **手动触发**: 使用 workflow_dispatch 手动触发发布
  - 拒绝原因: 需要额外手动操作,标签触发更符合 Git 工作流

## 6. 分支保护规则

### Decision
通过 GitHub 仓库设置配置分支保护规则,要求所有 CI 检查通过:
- Require status checks to pass before merging
- Required checks: CI (所有 matrix 组合)

### Rationale
- **代码质量保证**: 强制执行测试和代码检查,防止有问题的代码合并
- **符合规格要求**: FR-015 明确要求主分支保护
- **团队协作**: 提供清晰的合并标准,减少代码审查负担
- **自动化治理**: GitHub 原生功能,无需额外工具

### Alternatives Considered
- **仅建议性检查**: 显示 CI 状态但不强制
  - 拒绝原因: 无法保证代码质量,与规格要求不符
- **使用 CODEOWNERS**: 结合代码所有者审批
  - 拒绝原因: 对单人或小团队项目过于复杂,CI 检查已足够

## 7. CI 执行时间优化

### Decision
采用以下策略优化 CI 执行时间:
1. npm 依赖缓存(见第 3 点)
2. 并行执行测试(Vitest 默认并行)
3. 仅在必要时执行完整检查

### Rationale
- **性能目标**: 目标执行时间 < 10 分钟
- **开发体验**: 快速反馈帮助开发者快速定位问题
- **资源效率**: 减少 GitHub Actions 使用分钟数

### Expected Performance
- 依赖安装: ~5-10 秒(有缓存)
- Lint: ~10-20 秒
- 类型检查: ~5-10 秒
- 测试执行: ~30-60 秒(视测试数量)
- 构建: ~10-20 秒
- **总计**: 约 2-3 分钟/版本,Matrix 策略下两个版本并行执行

### Alternatives Considered
- **跳过某些检查**: 仅在主分支运行完整检查
  - 拒绝原因: 规格要求所有推送和 PR 都运行完整检查套件
- **使用自托管 runner**: 使用自己的服务器运行 CI
  - 拒绝原因: 增加运维成本,GitHub hosted runner 已满足性能需求

## 8. 错误处理和日志

### Decision
遵循 GitHub Actions 默认行为:
- 任何步骤失败即停止工作流
- 使用 `run` 命令执行 npm scripts,输出自动捕获
- 失败时在 GitHub UI 显示完整错误日志

### Rationale
- **快速失败**: 第一个错误即停止,节省 CI 时间
- **清晰反馈**: GitHub UI 自动高亮失败步骤和错误信息
- **符合规格**: FR-009 要求提供足够的日志帮助诊断

### Alternatives Considered
- **continue-on-error**: 某些步骤失败后继续执行
  - 拒绝原因: 可能掩盖问题,影响问题诊断
- **自定义日志格式**: 使用特殊格式化输出日志
  - 拒绝原因: 增加复杂度,默认格式已足够清晰

## Implementation Notes

### GitHub Secrets 配置需求
发布工作流需要配置以下 secrets:
- `NPM_TOKEN`: npm 发布令牌,用于认证 npm publish

### 工作流文件命名规范
- 使用小写字母和连字符: `ci.yml`, `publish.yml`
- 避免使用空格或特殊字符
- 名称应清晰表达工作流用途

### 最佳实践清单
- ✅ 使用语义化的 job 和 step 名称
- ✅ 添加注释说明复杂的配置
- ✅ 固定 action 版本(使用 @v4 而非 @latest)
- ✅ 使用环境变量避免硬编码
- ✅ 合理设置工作流权限(最小权限原则)

## References
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [actions/setup-node](https://github.com/actions/setup-node)
- [Vitest Coverage](https://vitest.dev/guide/coverage.html)
- [npm Publishing with GitHub Actions](https://docs.npmjs.com/using-private-packages-in-a-ci-cd-workflow)

---
**Research Complete** - Ready for Phase 1 design