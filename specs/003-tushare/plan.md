
# Implementation Plan: 接入tushare财务数据

**Branch**: `003-tushare` | **Date**: 2025-09-30 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/003-tushare/spec.md`

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
为 Tushare TypeScript SDK 添加财务数据接口支持,包括三张核心财务报表(利润表、资产负债表、现金流量表)和主要财务指标(ROE、毛利率、负债率等)。用户可通过股票代码和报告期查询财务数据,支持可选的缓存机制,遵循 TDD 开发流程。

## Technical Context
**Language/Version**: TypeScript 5.0+, Node.js 20.x+
**Primary Dependencies**: 无额外运行时依赖(开发依赖: vitest, msw, eslint, prettier, tsdown)
**Storage**: 可选缓存机制(由用户配置,不强制依赖特定存储)
**Testing**: Vitest (单元测试、集成测试、契约测试)
**Target Platform**: Node.js 20.x+, 支持 ESM 和 CommonJS
**Project Type**: single (SDK 项目)
**Performance Goals**: API 调用响应时间 < 5秒(含网络延迟), 包体积压缩后 < 100KB
**Constraints**: 单次仅查询单只股票, 限流错误由用户处理, 严格类型安全(strict mode)
**Scale/Scope**: 支持 4 个财务数据接口(利润表、资产负债表、现金流量表、主要财务指标)

## Constitution Check
*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### 测试优先 (Test-First) - 不可妥协
- [x] 严格遵循 TDD 流程:编写测试 → 测试失败 → 实现功能
- [x] 财务数据接口的契约测试必须先于实现编写
- [x] 每个数据模型必须有对应的单元测试
- [x] 集成测试覆盖所有用户场景

### 注释清晰明了 (Clear Documentation)
- [x] 所有新增公共 API 必须包含 JSDoc/TSDoc 注释
- [x] 财务数据类型定义需要清晰的语义说明
- [x] 缓存配置选项需要使用示例

### 代码结构清晰 (Clean Code Structure)
- [x] 财务数据模型放在 `src/models/` 目录
- [x] 财务数据类型定义放在 `src/types/` 目录
- [x] 契约测试放在 `tests/contract/` 目录
- [x] 遵循单一职责原则,每个财务报表一个独立模块

### 类型安全 (Type Safety)
- [x] TypeScript 严格模式已启用
- [x] 所有财务数据响应必须有明确的类型定义
- [x] 禁止使用 `any` 类型

### 契约测试 (Contract Testing)
- [x] 每个财务数据接口必须有契约测试
- [x] 使用 MSW 模拟 Tushare API 响应
- [x] 验证请求格式和响应数据结构

**初始评估结果**: ✅ PASS - 无宪章违规,符合所有核心原则

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
src/
├── core/              # 现有核心功能
│   ├── auth.ts
│   ├── client.ts
│   └── http.ts
├── models/            # 数据模型(新增财务数据模型)
│   ├── error.ts
│   ├── response.ts
│   ├── income.ts      # [新增] 利润表模型
│   ├── balance.ts     # [新增] 资产负债表模型
│   ├── cashflow.ts    # [新增] 现金流量表模型
│   └── indicators.ts  # [新增] 财务指标模型
├── types/             # TypeScript 类型定义
│   ├── api.ts
│   ├── config.ts
│   ├── error.ts
│   ├── quote.ts
│   ├── financial.ts   # [新增] 财务数据类型
│   └── cache.ts       # [新增] 缓存配置类型
├── utils/             # 工具函数
│   ├── formatter.ts
│   ├── validator.ts
│   └── cache.ts       # [新增] 缓存工具(可选)
└── index.ts           # 入口文件

tests/
├── contract/          # 契约测试
│   ├── daily.test.ts
│   ├── realtime.test.ts
│   ├── income.test.ts     # [新增]
│   ├── balance.test.ts    # [新增]
│   ├── cashflow.test.ts   # [新增]
│   └── indicators.test.ts # [新增]
├── integration/       # 集成测试
│   ├── client.test.ts
│   ├── error-handling.test.ts
│   └── financial.test.ts  # [新增]
└── unit/              # 单元测试
    ├── error.test.ts
    ├── formatter.test.ts
    ├── validator.test.ts
    ├── response.test.ts
    ├── index.test.ts
    └── cache.test.ts      # [新增]
```

**Structure Decision**: 采用单项目结构(Option 1)。这是一个 TypeScript SDK 项目,遵循现有的目录组织方式:
- `src/models/` 存放业务数据模型
- `src/types/` 存放 TypeScript 类型定义
- `src/utils/` 存放通用工具函数
- `tests/` 按测试类型分类(contract/integration/unit)

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

**Output**: data-model.md, /contracts/*, quickstart.md, CLAUDE.md

**Post-Design Constitution Re-Check**:
- [x] 测试优先: 契约文件已定义,准备好编写失败测试
- [x] 注释清晰: data-model.md 中类型定义包含详细说明
- [x] 代码结构: 4个独立的财务数据模块,遵循单一职责
- [x] 类型安全: 所有实体已定义明确的 TypeScript 类型
- [x] 契约测试: 4个契约文件已生成(income/balancesheet/cashflow/fina_indicator)

**重新评估结果**: ✅ PASS - 设计阶段仍符合宪章要求,无新增违规

## Phase 2: Task Planning Approach
*This section describes what the /tasks command will do - DO NOT execute during /plan*

**Task Generation Strategy**:
1. 从 Phase 1 设计文档生成任务:
   - 4个契约文件 → 4个契约测试任务 [P]
   - 4个实体模型 → 4个类型定义任务 [P] + 4个模型类任务 [P]
   - 缓存配置 → 1个缓存接口定义任务 + 1个内存缓存实现任务
   - 错误类型 → 6个错误类任务 [P]
   - 客户端方法 → 4个 API 方法任务(依赖模型完成)
   - 集成测试 → 1个完整场景测试任务
   - quickstart.md → 1个示例验证任务

2. 任务依赖分析:
   - 第一层(并行): 类型定义 + 错误类
   - 第二层(并行): 契约测试
   - 第三层(并行): 模型类 + 缓存接口
   - 第四层(并行): 客户端 API 方法
   - 第五层(串行): 集成测试 → 示例验证

**Ordering Strategy**:
- 严格 TDD 顺序: 契约测试 → 类型定义 → 模型实现 → 客户端方法 → 集成测试
- 依赖顺序: types → models → client methods → tests
- 并行标记 [P]: 同一层次的独立任务可并行执行
- 测试优先: 每个实现任务前必须有对应的测试任务

**Estimated Output**: 约 28-32 个任务,分5层执行

**任务分类预估**:
- 契约测试: 4个任务
- 类型定义: 6个任务(4个实体 + 1个缓存 + 1个错误)
- 模型实现: 4个任务
- 缓存实现: 2个任务
- 错误实现: 6个任务
- 客户端方法: 4个任务
- 单元测试: 4个任务
- 集成测试: 2个任务
- 文档/示例: 2个任务

**IMPORTANT**: 本阶段由 /tasks 命令执行,不在 /plan 中创建 tasks.md

## Phase 3+: Future Implementation
*These phases are beyond the scope of the /plan command*

**Phase 3**: Task execution (/tasks command creates tasks.md)  
**Phase 4**: Implementation (execute tasks.md following constitutional principles)  
**Phase 5**: Validation (run tests, execute quickstart.md, performance validation)

## Complexity Tracking
*Fill ONLY if Constitution Check has violations that must be justified*

**无复杂度违规** - 本功能设计简单,完全符合宪章要求,无需额外的复杂度引入。


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
- [x] All NEEDS CLARIFICATION resolved (通过 Clarifications 已解决)
- [x] Complexity deviations documented (无违规,无需文档)

---
*Based on Constitution v2.1.1 - See `/memory/constitution.md`*
