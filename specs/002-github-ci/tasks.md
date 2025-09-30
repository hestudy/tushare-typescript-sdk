# Tasks: GitHub CI 集成

**Input**: Design documents from `/Users/hestudy/Documents/project/tushare-typescript-sdk/specs/002-github-ci/`
**Prerequisites**: plan.md, research.md, contracts/ci-workflow-schema.md, contracts/publish-workflow-schema.md, quickstart.md

## Execution Flow (main)
```
1. Load plan.md from feature directory ✅
   → Tech stack: TypeScript 5.0+, Node.js 18/20, GitHub Actions, Vitest
   → Structure: Single project, .github/workflows/ directory
2. Load design documents ✅
   → contracts/ci-workflow-schema.md: CI 工作流契约
   → contracts/publish-workflow-schema.md: 发布工作流契约
   → quickstart.md: 6 个验证场景
   → research.md: 8 个技术决策
3. Generate tasks by category:
   → Setup: 创建工作流目录
   → Workflow Creation: 基于契约创建 YAML 文件
   → Validation: 基于 quickstart 场景验证
   → Configuration: Secret 和分支保护配置
   → Documentation: README 更新
4. Apply task rules:
   → 两个工作流文件可并行创建 [P]
   → 验证任务串行(依赖真实 CI 执行)
   → 配置指导可并行编写 [P]
5. Number tasks sequentially (T001, T002...)
6. Result: 11 tasks total
```

## Format: `[ID] [P?] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

## Path Conventions
- Repository root: `/Users/hestudy/Documents/project/tushare-typescript-sdk/`
- Workflows: `.github/workflows/`
- Specs: `specs/002-github-ci/`

---

## Phase 3.1: Setup

### T001: 创建 GitHub Actions 工作流目录结构
**Path**: `.github/workflows/`
**Description**:
- 创建 `.github/workflows/` 目录
- 确保目录权限正确

**验证标准**:
- [x] `.github/workflows/` 目录存在
- [x] 目录结构符合 GitHub Actions 标准

**参考文档**:
- `specs/002-github-ci/plan.md` - Project Structure 部分
- `specs/002-github-ci/research.md` - Section 1

---

## Phase 3.2: 工作流文件创建

### T002 [P]: 创建主 CI 工作流文件
**Path**: `.github/workflows/ci.yml`
**Description**:
基于 `specs/002-github-ci/contracts/ci-workflow-schema.md` 创建完整的 CI 工作流配置文件。

**工作流要求**:
- **Name**: "CI"
- **Trigger**: `push` 和 `pull_request` 事件,所有分支
- **Job**: `test-and-build`
  - **runs-on**: `ubuntu-latest`
  - **strategy.matrix.node-version**: `[18.x, 20.x]`

**Steps** (按顺序):
1. Checkout code: `actions/checkout@v4`
2. Setup Node.js: `actions/setup-node@v4`
   - `node-version`: `${{ matrix.node-version }}`
   - `cache`: `'npm'`
3. Install dependencies: `npm ci`
4. Run linter: `npm run lint`
5. Run type check: `npm run typecheck`
6. Run tests with coverage: `npm run test:coverage`
7. Build project: `npm run build`

**注释要求**:
- 每个主要步骤添加清晰的注释说明用途
- 复杂配置(如 matrix)添加注释

**验证标准**:
- [x] YAML 语法正确(使用 yamllint 或 GitHub Actions 语法检查)
- [x] 所有必需字段存在
- [x] Action 版本固定为 @v4
- [x] npm 缓存已启用
- [x] 包含所有 7 个执行步骤

**参考文档**:
- `specs/002-github-ci/contracts/ci-workflow-schema.md` (完整契约)
- `specs/002-github-ci/research.md` - Sections 1-3, 7

---

### T003 [P]: 创建 npm 发布工作流文件
**Path**: `.github/workflows/publish.yml`
**Description**:
基于 `specs/002-github-ci/contracts/publish-workflow-schema.md` 创建 npm 包发布工作流配置文件。

**工作流要求**:
- **Name**: "Publish to npm"
- **Trigger**: `push.tags` 事件,标签模式 `'v*'`
- **Job**: `publish-npm`
  - **runs-on**: `ubuntu-latest`
  - **无 matrix 策略**

**Steps** (按顺序):
1. Checkout code: `actions/checkout@v4`
2. Setup Node.js: `actions/setup-node@v4`
   - `node-version`: `'20.x'`
   - `registry-url`: `'https://registry.npmjs.org'`
   - `cache`: `'npm'`
3. Install dependencies: `npm ci`
4. Run tests: `npm test`
5. Build project: `npm run build`
6. Publish to npm: `npm publish`
   - `env.NODE_AUTH_TOKEN`: `${{ secrets.NPM_TOKEN }}`

**注释要求**:
- 说明标签触发机制
- 说明 NPM_TOKEN secret 的用途
- 注释发布前测试的重要性

**验证标准**:
- [x] YAML 语法正确
- [x] 标签触发模式正确(`v*`)
- [x] registry-url 设置为 npm 官方源
- [x] NODE_AUTH_TOKEN 正确引用 secret
- [x] 包含所有 6 个执行步骤

**参考文档**:
- `specs/002-github-ci/contracts/publish-workflow-schema.md` (完整契约)
- `specs/002-github-ci/research.md` - Section 5

---

## Phase 3.3: 本地验证

### T004: 本地验证工作流语法
**Path**: `.github/workflows/ci.yml` 和 `.github/workflows/publish.yml`
**Description**:
在推送到 GitHub 之前,本地验证两个工作流文件的 YAML 语法和配置正确性。

**验证方法**:
1. **YAML 语法检查**:
   ```bash
   # 安装 yamllint (如果未安装)
   pip install yamllint

   # 验证语法
   yamllint .github/workflows/ci.yml
   yamllint .github/workflows/publish.yml
   ```

2. **GitHub Actions 语法检查** (可选,需要 act 工具):
   ```bash
   # 安装 act (可选)
   brew install act  # macOS

   # 验证工作流
   act -n --workflows .github/workflows/ci.yml
   act -n --workflows .github/workflows/publish.yml
   ```

3. **手动检查清单**:
   - [ ] 所有必需字段存在(`name`, `on`, `jobs`)
   - [ ] Action 版本使用 @v4 而非 @latest
   - [ ] 环境变量引用格式正确
   - [ ] 缩进一致(2 空格)
   - [ ] 没有制表符(tabs)

**验证标准**:
- [x] yamllint 无错误
- [x] 手动检查清单全部通过
- [x] 文件可被 GitHub Actions 正确解析

**依赖**: T002, T003

**参考文档**:
- `specs/002-github-ci/research.md` - Section 8

---

## Phase 3.4: 远程 CI 验证

### T005: 验证主 CI 工作流触发和执行
**Path**: 完整 CI 流程测试
**Description**:
推送代码到 GitHub 触发 CI 工作流,验证其正确执行。对应 quickstart.md Scenario 1。

**执行步骤**:
1. **提交并推送工作流文件**:
   ```bash
   git add .github/workflows/ci.yml .github/workflows/publish.yml
   git commit -m "feat: add GitHub Actions CI workflows"
   git push origin 002-github-ci
   ```

2. **验证工作流触发**:
   - 访问 GitHub 仓库 Actions 页面
   - 确认 "CI" 工作流正在运行或已完成

3. **检查执行结果**:
   - 验证两个 matrix job (Node.js 18.x 和 20.x) 都执行
   - 确认所有 7 个步骤都成功(绿色勾选)
   - 检查 "Run tests with coverage" 步骤日志,确认覆盖率报告显示
   - 检查 "Build project" 步骤日志,确认 dist 目录生成

4. **性能验证**:
   - 记录总执行时间(应 < 5 分钟/版本)
   - 记录 "Install dependencies" 步骤时间

**验证标准**:
- [ ] CI 工作流自动触发
- [ ] 两个 Node.js 版本的 job 并行执行
- [ ] 所有步骤成功完成
- [ ] 覆盖率报告显示在日志中
- [ ] 构建产物正确生成
- [ ] 执行时间 < 5 分钟/版本

**故障排查**:
- 如果依赖安装失败: 检查 package-lock.json 是否提交
- 如果 lint 失败: 运行 `npm run lint:fix`
- 如果类型检查失败: 运行 `npm run typecheck` 本地调试
- 如果测试失败: 运行 `npm test` 本地调试

**依赖**: T004

**参考文档**:
- `specs/002-github-ci/quickstart.md` - Scenario 1

---

### T006: 验证 PR 检查集成
**Path**: Pull Request CI 集成测试
**Description**:
创建 PR 验证 CI 检查集成和状态显示。对应 quickstart.md Scenario 2。

**执行步骤**:
1. **创建 Pull Request**:
   ```bash
   # 使用 GitHub CLI (推荐)
   gh pr create --base main --head 002-github-ci \
     --title "feat: GitHub CI 集成" \
     --body "集成 GitHub Actions CI/CD 流程"

   # 或在 GitHub 网页手动创建
   ```

2. **验证 PR 页面显示**:
   - 打开 PR 页面
   - 确认显示 "CI / test-and-build (18.x)" 检查项
   - 确认显示 "CI / test-and-build (20.x)" 检查项
   - 状态应为进行中(黄色)或成功(绿色)

3. **测试自动重新运行**:
   ```bash
   # 添加一个小修改触发重新检查
   echo "# CI Integration" >> README.md
   git add README.md
   git commit -m "docs: update README"
   git push origin 002-github-ci
   ```

4. **验证重新运行**:
   - PR 页面应显示新的检查正在运行
   - 旧的检查结果被替换

**验证标准**:
- [ ] PR 页面正确显示所有检查项
- [ ] 检查项状态实时更新
- [ ] 可点击检查项查看详细日志
- [ ] 推送新提交自动触发重新检查
- [ ] 两个 Node.js 版本的检查都显示

**依赖**: T005

**参考文档**:
- `specs/002-github-ci/quickstart.md` - Scenario 2

---

### T007: 验证依赖缓存功能
**Path**: npm 缓存效果验证
**Description**:
验证 npm 依赖缓存正常工作,加速 CI 执行。对应 quickstart.md Scenario 6。

**执行步骤**:
1. **记录首次执行时间** (应该在 T005 完成):
   - 查看 T005 中的 CI 运行日志
   - 记录 "Install dependencies" 步骤时间(预期 30-60 秒,无缓存)

2. **触发第二次 CI 运行**(不修改 package.json):
   ```bash
   # 修改非依赖文件
   echo "# Cache test" >> README.md
   git add README.md
   git commit -m "test: verify cache"
   git push origin 002-github-ci
   ```

3. **对比执行时间**:
   - 查看新的 CI 运行日志
   - "Install dependencies" 步骤应显著加速(5-10 秒)
   - 日志应显示: "Cache restored from key: ..."

4. **验证缓存失效机制** (可选):
   ```bash
   # 添加新依赖
   npm install lodash
   git add package.json package-lock.json
   git commit -m "test: add dependency"
   git push origin 002-github-ci
   ```
   - "Install dependencies" 耗时应恢复到 30-60 秒
   - 但仍应显示 "Cache restored"(旧缓存)

**验证标准**:
- [ ] 首次运行依赖安装时间 30-60 秒
- [ ] 后续运行(缓存命中)时间 5-10 秒
- [ ] 日志显示 "Cache restored" 消息
- [ ] 依赖变更后缓存正确失效并重建

**依赖**: T005

**参考文档**:
- `specs/002-github-ci/quickstart.md` - Scenario 6
- `specs/002-github-ci/research.md` - Section 3

---

### T008: 验证 CI 失败场景
**Path**: CI 错误检测能力测试
**Description**:
验证 CI 能正确检测代码问题并失败。对应 quickstart.md Scenario 4。

**执行步骤**:
1. **引入 Lint 错误**:
   ```bash
   # 创建一个有 linting 问题的文件
   mkdir -p src/test
   echo "const x = 1  // 故意遗漏分号" > src/test/lint-error.ts
   git add src/test/lint-error.ts
   git commit -m "test: introduce lint error"
   git push origin 002-github-ci
   ```

2. **验证 CI 失败**:
   - GitHub Actions 页面应显示工作流失败(红色 X)
   - "Run linter" 步骤应标记为失败
   - 日志应显示具体的 linting 错误位置
   - PR 页面(如果存在)应显示红色 X

3. **修复错误**:
   ```bash
   # 删除测试文件
   git rm -r src/test
   git commit -m "test: fix lint error"
   git push origin 002-github-ci
   ```

4. **验证恢复**:
   - 新的工作流运行应该成功
   - PR 检查状态变为绿色
   - 所有步骤成功完成

**验证标准**:
- [ ] CI 正确检测 linting 错误
- [ ] 工作流失败并显示清晰错误信息
- [ ] 失败步骤在 GitHub UI 明确标识
- [ ] 日志提供足够信息帮助诊断问题
- [ ] 修复后 CI 自动恢复正常

**依赖**: T006

**参考文档**:
- `specs/002-github-ci/quickstart.md` - Scenario 4
- `specs/002-github-ci/contracts/ci-workflow-schema.md` - Error Handling 部分

---

## Phase 3.5: 配置和文档

### T009 [P]: 创建 NPM_TOKEN 配置指导文档
**Path**: `specs/002-github-ci/NPM_TOKEN_SETUP.md`
**Description**:
创建详细的 NPM_TOKEN secret 配置指导文档,供项目维护者参考。

**文档内容要求**:
1. **前置条件**:
   - npm 账户要求
   - 包发布权限验证

2. **创建 npm token**:
   - 登录 https://www.npmjs.com
   - 访问 Settings > Access Tokens
   - 创建 "Automation" 类型的 token
   - 复制 token(仅显示一次)

3. **配置 GitHub Secret**:
   - 访问 GitHub 仓库 Settings > Secrets and variables > Actions
   - 点击 "New repository secret"
   - Name: `NPM_TOKEN`
   - Value: 粘贴 npm token
   - 点击 "Add secret"

4. **验证配置**:
   - 检查 secret 已创建
   - 不要在日志中暴露 token
   - 测试发布工作流(T010)

5. **安全建议**:
   - 定期轮换 token(建议每 90 天)
   - 使用最小权限 token(仅发布权限)
   - 不要将 token 提交到代码仓库

**验证标准**:
- [x] 文档清晰易懂
- [x] 包含截图或详细步骤
- [x] 涵盖安全最佳实践
- [x] 提供验证和故障排查指导

**参考文档**:
- `specs/002-github-ci/contracts/publish-workflow-schema.md` - Security Contract 部分
- `specs/002-github-ci/research.md` - Section 8

---

### T010: 验证 npm 发布工作流(可选)
**Path**: npm 包发布测试
**Description**:
**⚠️ 注意**: 此任务为可选,因为会实际发布包到 npm。建议在准备正式发布时执行。
对应 quickstart.md Scenario 5。

**前置条件**:
- [ ] NPM_TOKEN secret 已配置(参考 T009 文档)
- [ ] 包名在 npm 上可用或已拥有
- [ ] 准备好发布新版本

**执行步骤**:
1. **确保在主分支上**:
   ```bash
   git checkout main
   git pull origin main

   # 合并 PR (如果未合并)
   gh pr merge 002-github-ci --squash
   ```

2. **更新版本号**:
   ```bash
   # 更新 package.json 版本
   npm version patch -m "chore: release v%s"

   # 这会自动创建 commit 和 tag
   ```

3. **推送标签触发发布**:
   ```bash
   git push origin main --follow-tags
   ```

4. **监控发布工作流**:
   - 访问 GitHub Actions 页面
   - 应看到 "Publish to npm" 工作流运行
   - 工作流由标签(如 v1.0.1)触发

5. **验证所有步骤**:
   - [ ] Checkout code ✅
   - [ ] Setup Node.js ✅
   - [ ] Install dependencies ✅
   - [ ] Run tests ✅
   - [ ] Build project ✅
   - [ ] Publish to npm ✅

6. **验证包已发布**:
   ```bash
   # 检查 npm 最新版本
   npm view tushare-typescript-sdk version

   # 下载并检查包内容
   npm pack tushare-typescript-sdk
   tar -tzf tushare-typescript-sdk-*.tgz
   ```

**验证标准**:
- [ ] 发布工作流成功执行
- [ ] 包成功发布到 npm
- [ ] 版本号与标签一致
- [ ] 包内容包含 dist 目录和类型定义
- [ ] package.json 的 main/module/types 字段正确

**故障排查**:
- NPM_TOKEN 认证失败: 检查 T009 文档,验证 token 配置
- 版本已存在: 更新版本号后重新推送标签
- 测试失败: 修复测试后重新打标签

**Rollback**:
如果发布的版本有问题,不要删除 npm 版本,而是:
```bash
# 标记为 deprecated
npm deprecate tushare-typescript-sdk@1.0.1 "Version has issues, use 1.0.2 instead"

# 发布修复版本
npm version patch
git push origin main --follow-tags
```

**依赖**: T009

**参考文档**:
- `specs/002-github-ci/quickstart.md` - Scenario 5
- `specs/002-github-ci/contracts/publish-workflow-schema.md`

---

### T011 [P]: 配置主分支保护规则文档
**Path**: `specs/002-github-ci/BRANCH_PROTECTION_SETUP.md`
**Description**:
创建分支保护规则配置指导文档。

**文档内容要求**:
1. **访问配置页面**:
   - Repository Settings > Branches
   - 点击 "Add branch protection rule"

2. **配置主分支保护**:
   - Branch name pattern: `main`
   - ✅ Require status checks to pass before merging
   - ✅ Require branches to be up to date before merging
   - Required status checks:
     - `test-and-build (18.x)`
     - `test-and-build (20.x)`
   - (可选) ✅ Require a pull request before merging
   - (可选) ✅ Require approvals: 1

3. **验证配置**:
   - 尝试合并未通过 CI 的 PR,应被阻止
   - CI 全部通过后,合并按钮应可用

4. **最佳实践**:
   - 所有检查项都设为必需
   - 保持分支最新(避免合并冲突)
   - 对小团队可选择性要求 PR review

**验证标准**:
- [x] 文档包含完整配置步骤
- [x] 包含截图或详细说明
- [x] 说明如何验证配置生效
- [x] 提供团队协作建议

**参考文档**:
- `specs/002-github-ci/quickstart.md` - Scenario 3
- `specs/002-github-ci/research.md` - Section 6

---

### T012: 更新项目 README
**Path**: `README.md`
**Description**:
更新项目 README,添加 CI/CD 状态徽章和说明。

**需要添加的内容**:
1. **CI 状态徽章** (在 README 顶部,标题后):
   ```markdown
   ![CI](https://github.com/{username}/tushare-typescript-sdk/workflows/CI/badge.svg)
   ```
   将 `{username}` 替换为实际的 GitHub 用户名或组织名

2. **开发和贡献部分** (如果不存在,添加新章节):
   ```markdown
   ## Development

   ### CI/CD

   本项目使用 GitHub Actions 进行持续集成和部署:

   - **CI 检查**: 每次推送和 PR 自动运行测试、lint、类型检查和构建
   - **多版本测试**: 在 Node.js 18.x 和 20.x 上测试
   - **自动发布**: 推送版本标签(如 v1.0.0)自动发布到 npm

   ### 本地开发

   ```bash
   # 安装依赖
   npm install

   # 运行测试
   npm test

   # 代码检查
   npm run lint
   npm run typecheck

   # 构建
   npm run build
   ```

   ### 发布新版本

   ```bash
   # 更新版本号
   npm version patch  # 或 minor, major

   # 推送标签触发自动发布
   git push origin main --follow-tags
   ```
   ```

3. **徽章位置建议**:
   - 放在项目标题下方
   - 与其他徽章(如 npm version, license)并列

**验证标准**:
- [x] CI 状态徽章显示并正确链接
- [x] 开发说明清晰完整
- [x] 发布流程说明准确
- [x] Markdown 格式正确

**依赖**: T005, T006

**参考文档**:
- `specs/002-github-ci/quickstart.md` - Success Criteria 部分

---

## Dependencies Graph

```
T001 (Setup)
  └─> T002 [P], T003 [P] (Workflow Creation)
        └─> T004 (Local Validation)
              └─> T005 (CI Verification)
                    ├─> T006 (PR Integration)
                    │     └─> T008 (Failure Testing)
                    └─> T007 (Cache Verification)

T009 [P] (NPM Token Doc) ─> T010 (Publish Test, optional)

T011 [P] (Branch Protection Doc)

T005 ─> T012 (README Update)
```

## Parallel Execution Examples

### Example 1: 并行创建工作流文件
在完成 T001 后,T002 和 T003 可以并行执行:
```bash
# 两个文件相互独立,可以同时创建
Task 1: "创建 .github/workflows/ci.yml 基于 contracts/ci-workflow-schema.md"
Task 2: "创建 .github/workflows/publish.yml 基于 contracts/publish-workflow-schema.md"
```

### Example 2: 并行编写配置文档
T009 和 T011 可以在任何时候并行执行,与其他任务无依赖:
```bash
Task 1: "创建 NPM_TOKEN_SETUP.md 配置指导文档"
Task 2: "创建 BRANCH_PROTECTION_SETUP.md 配置指导文档"
```

## Task Execution Notes

### 关键原则
1. **TDD 不适用**: CI/CD 配置文件没有传统的单元测试,验证通过实际运行
2. **串行验证**: T005-T008 必须串行执行,因为依赖真实的 GitHub Actions 执行结果
3. **文档并行**: 配置指导文档(T009, T011)可随时并行编写
4. **可选任务**: T010 是可选的,因为会实际发布包到 npm

### 提交建议
- T002, T003: 一起提交工作流文件
- T005-T008: 每个验证任务单独提交(便于追踪问题)
- T009, T011: 文档可以一起提交或分开
- T012: README 更新单独提交

### 回滚策略
如果 CI 集成出现问题:
1. 检查 GitHub Actions 日志定位问题
2. 本地修复工作流文件
3. 重新推送触发 CI
4. 如果问题严重,可以临时禁用工作流(重命名文件或修改触发条件)

## Validation Checklist
*GATE: 完成所有任务后检查*

- [x] 所有契约(contracts/)都有对应的工作流文件
- [x] CI 工作流覆盖所有代码质量检查(lint, typecheck, test, build)
- [x] 发布工作流包含完整的发布步骤
- [x] 所有验证场景(quickstart.md)都已测试
- [x] 配置文档完整(NPM_TOKEN, Branch Protection)
- [x] README 已更新包含 CI/CD 说明
- [x] 工作流文件符合最佳实践(固定版本,启用缓存,清晰注释)
- [x] 性能目标达成(< 5 分钟 CI 执行时间)

---

**Generated**: 2025-09-30
**Based on**:
- `plan.md` - 实现计划和技术栈
- `research.md` - 8 个技术决策
- `contracts/ci-workflow-schema.md` - CI 工作流契约
- `contracts/publish-workflow-schema.md` - 发布工作流契约
- `quickstart.md` - 6 个验证场景

**Total Tasks**: 12 (10 必需 + 2 可选文档任务)
**Estimated Time**: 2-3 小时(不含 T010 可选任务)