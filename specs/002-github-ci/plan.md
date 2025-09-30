
# Implementation Plan: GitHub CI 集成

**Branch**: `002-github-ci` | **Date**: 2025-09-30 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/Users/hestudy/Documents/project/tushare-typescript-sdk/specs/002-github-ci/spec.md`

## Execution Flow (/plan command scope)
```
1. Load feature spec from Input path
   → If not found: ERROR "No feature spec at {path}"
2. Fill Technical Context (scan for NEEDS CLARIFICATION)
   → Detect Project Type from file system structure or context (web=frontend+backend, mobile=app+api)
   → Set Structure Decision based on project type
3. Fill the Constitution Check section based on the content of the constitution document.
4. Evaluate Constitution Check section below
   → If violations exist: Document in Complexity Tracking
   → If no justification possible: ERROR "Simplify approach first"
   → Update Progress Tracking: Initial Constitution Check
5. Execute Phase 0 → research.md
   → If NEEDS CLARIFICATION remain: ERROR "Resolve unknowns"
6. Execute Phase 1 → contracts, data-model.md, quickstart.md, agent-specific template file (e.g., `CLAUDE.md` for Claude Code, `.github/copilot-instructions.md` for GitHub Copilot, `GEMINI.md` for Gemini CLI, `QWEN.md` for Qwen Code or `AGENTS.md` for opencode).
7. Re-evaluate Constitution Check section
   → If new violations: Refactor design, return to Phase 1
   → Update Progress Tracking: Post-Design Constitution Check
8. Plan Phase 2 → Describe task generation approach (DO NOT create tasks.md)
9. STOP - Ready for /tasks command
```

**IMPORTANT**: The /plan command STOPS at step 7. Phases 2-4 are executed by other commands:
- Phase 2: /tasks command creates tasks.md
- Phase 3-4: Implementation execution (manual or via tools)

## Summary
为 tushare-typescript-sdk 项目集成 GitHub Actions CI/CD 流程,实现自动化测试、代码质量检查、构建验证和 npm 包发布。CI 流程将在代码推送和 PR 创建时自动触发,支持 Node.js 18.x 和 20.x 多版本测试,并在版本标签推送时自动发布包到 npm。

## Technical Context
**Language/Version**: TypeScript 5.0+, Node.js 20.x (测试支持 18.x 和 20.x)
**Primary Dependencies**: GitHub Actions, tsdown (构建), vitest (测试), ESLint (代码质量)
**Storage**: N/A (CI/CD 配置为 YAML 文件)
**Testing**: Vitest 用于单元测试和覆盖率报告
**Target Platform**: Linux (ubuntu-latest), Node.js 运行时
**Project Type**: single (TypeScript SDK 库项目)
**Performance Goals**: CI 执行时间 < 10 分钟,npm 依赖缓存加速后续构建
**Constraints**: 仅 Linux 环境测试,覆盖率报告仅在 CI 日志显示,主分支保护要求所有检查通过
**Scale/Scope**: 单一仓库,多工作流文件 (测试、构建、发布),支持并发 PR 的 CI 执行

## Constitution Check
*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### I. 测试优先 (Test-First)
- ✅ **PASS**: CI 工作流本身不涉及业务逻辑代码,无需 TDD
- ✅ **PASS**: 工作流配置将执行现有的 Vitest 测试套件,确保代码合并前测试通过
- ✅ **PASS**: 通过 PR 检查强制要求所有测试通过后才能合并

### II. 注释清晰明了 (Clear Documentation)
- ✅ **PASS**: GitHub Actions 工作流 YAML 文件将包含注释说明每个步骤的用途
- ✅ **PASS**: 复杂的工作流步骤(如条件执行、npm 发布)将有清晰的说明

### III. 代码结构清晰 (Clean Code Structure)
- ✅ **PASS**: 工作流文件按功能拆分为独立文件(测试、构建、发布)
- ✅ **PASS**: 遵循 GitHub Actions 最佳实践,使用可复用的 actions
- ✅ **PASS**: 配置文件放置在标准位置 `.github/workflows/`

### IV. 类型安全 (Type Safety)
- ✅ **PASS**: CI 流程将执行 `npm run typecheck` 确保 TypeScript 类型检查通过
- ✅ **PASS**: 构建步骤验证类型定义文件正确生成

### V. 契约测试 (Contract Testing)
- ✅ **PASS**: CI 流程将执行现有的契约测试,覆盖与 Tushare API 的交互

### 质量标准检查
- ✅ **测试覆盖率**: CI 将生成覆盖率报告,确保 ≥ 90% 目标
- ✅ **代码质量**: CI 将执行 ESLint 检查,确保无 linting 错误
- ✅ **性能要求**: 通过 npm 依赖缓存优化 CI 执行时间

**初始评估结果**: PASS - 无宪章违规,无需复杂度追踪

## Project Structure

### Documentation (this feature)
```
specs/[###-feature]/
├── plan.md              # This file (/plan command output)
├── research.md          # Phase 0 output (/plan command)
├── data-model.md        # Phase 1 output (/plan command)
├── quickstart.md        # Phase 1 output (/plan command)
├── contracts/           # Phase 1 output (/plan command)
└── tasks.md             # Phase 2 output (/tasks command - NOT created by /plan)
```

### Source Code (repository root)
```
.github/
└── workflows/
    ├── ci.yml           # 主 CI 工作流:测试、lint、类型检查、构建
    └── publish.yml      # 发布工作流:版本标签触发,发布到 npm

src/                     # 现有项目源代码(不修改)
└── ...

tests/                   # 现有测试代码(不修改)
└── ...

package.json             # 现有配置(不修改,已包含所需脚本)
tsconfig.json            # 现有配置(不修改)
```

**Structure Decision**: 单一项目结构,新增 `.github/workflows/` 目录用于存放 GitHub Actions 工作流配置文件。不修改现有的 src 和 tests 目录结构。工作流文件按功能职责拆分为两个独立文件:
- `ci.yml`: 处理推送和 PR 的持续集成检查
- `publish.yml`: 处理版本标签触发的 npm 包发布

## Phase 0: Outline & Research
1. **Extract unknowns from Technical Context** above:
   - For each NEEDS CLARIFICATION → research task
   - For each dependency → best practices task
   - For each integration → patterns task

2. **Generate and dispatch research agents**:
   ```
   For each unknown in Technical Context:
     Task: "Research {unknown} for {feature context}"
   For each technology choice:
     Task: "Find best practices for {tech} in {domain}"
   ```

3. **Consolidate findings** in `research.md` using format:
   - Decision: [what was chosen]
   - Rationale: [why chosen]
   - Alternatives considered: [what else evaluated]

**Output**: research.md with all NEEDS CLARIFICATION resolved

## Phase 1: Design & Contracts
*Prerequisites: research.md complete*

1. **Extract entities from feature spec** → `data-model.md`:
   - Entity name, fields, relationships
   - Validation rules from requirements
   - State transitions if applicable

2. **Generate API contracts** from functional requirements:
   - For each user action → endpoint
   - Use standard REST/GraphQL patterns
   - Output OpenAPI/GraphQL schema to `/contracts/`

3. **Generate contract tests** from contracts:
   - One test file per endpoint
   - Assert request/response schemas
   - Tests must fail (no implementation yet)

4. **Extract test scenarios** from user stories:
   - Each story → integration test scenario
   - Quickstart test = story validation steps

5. **Update agent file incrementally** (O(1) operation):
   - Run `.specify/scripts/bash/update-agent-context.sh claude`
     **IMPORTANT**: Execute it exactly as specified above. Do not add or remove any arguments.
   - If exists: Add only NEW tech from current plan
   - Preserve manual additions between markers
   - Update recent changes (keep last 3)
   - Keep under 150 lines for token efficiency
   - Output to repository root

**Output**: data-model.md, /contracts/*, failing tests, quickstart.md, agent-specific file

## Phase 2: Task Planning Approach
*This section describes what the /tasks command will do - DO NOT execute during /plan*

**Task Generation Strategy**:
- Load `.specify/templates/tasks-template.md` as base
- Generate tasks from Phase 1 design docs (contracts, quickstart, research)
- 基于契约文档生成工作流配置文件创建任务
- 基于 quickstart 场景生成验证任务
- 基于分支保护配置需求生成文档任务

**Specific Task Categories**:

1. **工作流文件创建任务**
   - 创建 `.github/workflows/ci.yml` - 主 CI 工作流
   - 创建 `.github/workflows/publish.yml` - npm 发布工作流
   - 每个任务基于对应的契约文档(contracts/ci-workflow-schema.md, contracts/publish-workflow-schema.md)

2. **验证任务**
   - 本地验证工作流语法
   - 测试推送触发 CI
   - 测试 PR 触发 CI
   - 验证 Node.js matrix 策略
   - 验证依赖缓存
   - 测试版本标签触发发布

3. **配置任务**
   - 配置 NPM_TOKEN secret 指导文档
   - 配置分支保护规则指导文档

4. **文档任务**
   - 更新项目 README 说明 CI/CD 状态徽章
   - 创建发布流程文档(可选)

**Ordering Strategy**:
1. 创建 CI 工作流文件(优先,最核心)
2. 本地验证语法
3. 创建发布工作流文件
4. 推送到远程触发真实 CI 测试
5. 配置 secret 和分支保护
6. 完整的端到端验证
7. 文档更新

**Dependency Relationships**:
- CI 工作流文件 → 本地验证 → 远程测试
- 发布工作流文件 → secret 配置 → 发布测试
- 所有工作流测试通过 → 分支保护配置
- 功能完整 → 文档更新

**Parallel Execution Opportunities**:
- [P] 创建两个工作流文件可以独立进行
- [P] 编写配置指导文档可以与工作流创建并行
- 验证任务必须串行(依赖真实 GitHub Actions 执行结果)

**Estimated Output**: 约 10-12 个任务,包括:
- 2 个工作流文件创建任务
- 1 个本地验证任务
- 4-5 个远程验证任务
- 2 个配置指导任务
- 1-2 个文档更新任务

**Testing Approach**:
由于 CI/CD 是基础设施配置,测试方法不同于业务代码:
- 使用 GitHub Actions 官方工具验证 YAML 语法
- 通过实际推送代码触发工作流进行端到端测试
- 使用 quickstart.md 中定义的验证场景
- 不需要编写传统的单元测试

**IMPORTANT**: This phase is executed by the /tasks command, NOT by /plan

## Phase 3+: Future Implementation
*These phases are beyond the scope of the /plan command*

**Phase 3**: Task execution (/tasks command creates tasks.md)  
**Phase 4**: Implementation (execute tasks.md following constitutional principles)  
**Phase 5**: Validation (run tests, execute quickstart.md, performance validation)

## Complexity Tracking
*Fill ONLY if Constitution Check has violations that must be justified*

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |


## Progress Tracking
*This checklist is updated during execution flow*

**Phase Status**:
- [x] Phase 0: Research complete (/plan command)
- [x] Phase 1: Design complete (/plan command)
- [x] Phase 2: Task planning complete (/plan command - describe approach only)
- [ ] Phase 3: Tasks generated (/tasks command)
- [ ] Phase 4: Implementation complete
- [ ] Phase 5: Validation passed

**Gate Status**:
- [x] Initial Constitution Check: PASS
- [x] Post-Design Constitution Check: PASS
- [x] All NEEDS CLARIFICATION resolved
- [x] Complexity deviations documented (N/A - no deviations)

---
*Based on Constitution v2.1.1 - See `/memory/constitution.md`*
