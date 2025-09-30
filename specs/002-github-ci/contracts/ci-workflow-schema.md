# CI Workflow Contract

**Feature**: 002-github-ci
**Date**: 2025-09-30
**Type**: GitHub Actions Workflow Configuration

## Overview
定义主 CI 工作流的配置契约,该工作流在代码推送和 PR 创建时自动触发,执行完整的代码质量检查。

## Workflow Configuration Contract

### Trigger Events
```yaml
on:
  push:
    branches: ['**']  # 所有分支的推送
  pull_request:
    branches: ['**']  # 所有分支的 PR
```

**契约要求**:
- 必须监听 `push` 和 `pull_request` 事件
- 必须应用于所有分支(不做分支限制)
- 不应监听其他事件(如 schedule, workflow_dispatch)

### Job: test-and-build

#### 运行环境
```yaml
runs-on: ubuntu-latest
```

**契约要求**:
- 必须使用 `ubuntu-latest`
- 不使用其他操作系统(如 windows, macos)

#### Matrix 策略
```yaml
strategy:
  matrix:
    node-version: [20.x]
```

**契约要求**:
- 必须使用 Node.js 20.x
- 不测试其他版本
- Matrix 策略保持结构一致性(便于将来扩展)

### Steps Contract

#### 1. Checkout Code
```yaml
- uses: actions/checkout@v4
```

**契约要求**:
- 使用 `actions/checkout@v4` (固定版本)
- 无需额外参数(默认检出当前分支)

#### 2. Setup Node.js
```yaml
- uses: actions/setup-node@v4
  with:
    node-version: ${{ matrix.node-version }}
    cache: 'npm'
```

**契约要求**:
- 使用 `actions/setup-node@v4`
- `node-version` 必须来自 matrix 变量
- 必须启用 npm 缓存(`cache: 'npm'`)

#### 3. Install Dependencies
```yaml
- run: npm ci
```

**契约要求**:
- 使用 `npm ci` 而非 `npm install`(确保确定性安装)
- 依赖 `package-lock.json` 存在

#### 4. Run Linter
```yaml
- run: npm run lint
```

**契约要求**:
- 执行 ESLint 检查
- 脚本定义于 `package.json`:`"lint": "eslint src --ext .ts"`
- 任何 linting 错误导致工作流失败

#### 5. Run Type Check
```yaml
- run: npm run typecheck
```

**契约要求**:
- 执行 TypeScript 类型检查
- 脚本定义于 `package.json`:`"typecheck": "tsc --noEmit"`
- 任何类型错误导致工作流失败

#### 6. Run Tests with Coverage
```yaml
- run: npm run test:coverage
```

**契约要求**:
- 执行所有测试并生成覆盖率报告
- 脚本定义于 `package.json`:`"test:coverage": "vitest run --coverage"`
- 测试失败导致工作流失败
- 覆盖率报告显示在日志中,不上传到外部服务

#### 7. Build Project
```yaml
- run: npm run build
```

**契约要求**:
- 执行项目构建
- 脚本定义于 `package.json`:`"build": "tsdown"`
- 构建失败导致工作流失败
- 验证生成的 dist 目录内容

## Expected Outputs

### 成功场景
- 所有步骤状态为 ✅ (成功)
- 工作流整体状态为 Success
- PR 页面显示绿色勾选标记
- 执行时间: 约 2-3 分钟

### 失败场景
- 任一步骤失败,后续步骤不执行
- 工作流整体状态为 Failure
- PR 页面显示红色 X 标记
- 失败步骤的日志展开显示错误详情

## Validation Rules

### Pre-execution Validation
- [ ] `package.json` 存在且包含所有必需脚本
- [ ] `package-lock.json` 存在
- [ ] `.github/workflows/ci.yml` 文件格式正确

### Post-execution Validation
- [ ] 所有 matrix 组合都执行
- [ ] 所有步骤按顺序执行
- [ ] 覆盖率报告显示在日志中
- [ ] 构建产物正确生成(dist 目录)

## Error Handling

### 常见错误及预期行为

1. **依赖安装失败**
   - 原因: `package-lock.json` 损坏或依赖不可用
   - 行为: 工作流在 "Install Dependencies" 步骤失败
   - 日志: 显示 npm ci 错误信息

2. **Linting 错误**
   - 原因: 代码不符合 ESLint 规则
   - 行为: 工作流在 "Run Linter" 步骤失败
   - 日志: 显示具体的 linting 错误位置

3. **类型检查失败**
   - 原因: TypeScript 类型错误
   - 行为: 工作流在 "Run Type Check" 步骤失败
   - 日志: 显示类型错误详情

4. **测试失败**
   - 原因: 单元测试或集成测试失败
   - 行为: 工作流在 "Run Tests" 步骤失败
   - 日志: 显示失败测试的详细信息

5. **构建失败**
   - 原因: tsdown 编译错误
   - 行为: 工作流在 "Build Project" 步骤失败
   - 日志: 显示编译错误

## Performance Contract

- **总执行时间**: < 5 分钟
- **依赖安装**: < 10 秒(有缓存)
- **单一版本**: Node.js 20.x

## Integration Points

- **GitHub PR**: 工作流状态显示在 PR checks 区域
- **Branch Protection**: 主分支保护规则引用此工作流的状态
- **Notifications**: 失败时 GitHub 发送通知给 PR 作者

---
**Contract Version**: 1.0.0
**Last Updated**: 2025-09-30