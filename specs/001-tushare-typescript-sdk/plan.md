
# Implementation Plan: Tushare TypeScript SDK

**Branch**: `001-tushare-typescript-sdk` | **Date**: 2025-09-30 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/Users/hestudy/Documents/project/tushare-typescript-sdk/specs/001-tushare-typescript-sdk/spec.md`

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
为Tushare财务数据服务构建TypeScript SDK,目前官方仅提供Python SDK。本SDK将使Node.js和TypeScript开发者能够以类型安全、符合JavaScript生态习惯的方式访问Tushare的股票行情数据API(日线、分钟线、实时行情等)。初始版本仅支持股票行情接口,使用Promise/async-await异步模式,要求Node.js 20.x+和TypeScript 5.0+,不提供自动重试机制。

## Technical Context
**Language/Version**: TypeScript 5.0+, Node.js 20.x+
**Primary Dependencies**: 使用tsdown进行编译构建, 使用vitest进行测试
**Storage**: N/A (SDK不涉及持久化存储)
**Testing**: vitest (单元测试、集成测试、契约测试)
**Target Platform**: Node.js 20.x+运行环境
**Project Type**: single (SDK库项目)
**Performance Goals**: API调用响应时间<5秒(含网络延迟), 包体积压缩后<100KB
**Constraints**: 不提供自动重试机制, 所有错误由用户处理, 内存占用合理避免泄漏
**Scale/Scope**: 初始版本仅支持股票行情相关API接口(日线、分钟线、实时行情)

## Constitution Check
*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### 核心原则合规性

**I. 测试优先 (Test-First)**: ✅ 通过
- 计划遵循TDD流程: 先生成契约测试 → 用户审核 → 测试失败 → 然后实现
- 所有API接口将先编写契约测试,再实现功能

**II. 注释清晰明了 (Clear Documentation)**: ✅ 通过
- 所有公共API将包含JSDoc/TSDoc注释
- 计划生成quickstart.md作为快速上手指南
- 类型定义将包含清晰的语义说明

**III. 代码结构清晰 (Clean Code Structure)**: ✅ 通过
- 采用单一项目结构,按功能模块组织:
  - src/core/ (核心功能)
  - src/api/ (API接口)
  - src/models/ (数据模型)
  - src/utils/ (工具函数)
  - src/types/ (TypeScript类型定义)
- tests/目录按测试类型组织(unit/, integration/, contract/)

**IV. 类型安全 (Type Safety)**: ✅ 通过
- TypeScript严格模式启用
- 所有API响应数据将有明确的类型定义
- 避免使用any类型

**V. 契约测试 (Contract Testing)**: ✅ 通过
- 每个Tushare API交互点将有契约测试
- 验证请求格式和响应数据结构
- 使用mock数据避免频繁调用真实API

**质量标准**: ✅ 通过
- 单元测试覆盖率目标≥90%
- API调用响应时间<5秒
- 包体积压缩后<100KB
- 使用ESLint和Prettier保持代码风格一致

**结论**: 无宪章违规,无需记录复杂度跟踪表

## Project Structure

### Documentation (this feature)
```
specs/001-tushare-typescript-sdk/
├── plan.md              # 本文件 (/plan命令输出)
├── research.md          # Phase 0 输出 (/plan命令)
├── data-model.md        # Phase 1 输出 (/plan命令)
├── quickstart.md        # Phase 1 输出 (/plan命令)
├── contracts/           # Phase 1 输出 (/plan命令)
│   ├── daily.json       # 日线行情API契约
│   ├── minute.json      # 分钟线行情API契约
│   └── realtime.json    # 实时行情API契约
└── tasks.md             # Phase 2 输出 (/tasks命令 - 不由/plan创建)
```

### Source Code (repository root)
```
src/
├── core/              # 核心功能模块
│   ├── client.ts      # TushareClient主类
│   ├── http.ts        # HTTP请求封装
│   └── auth.ts        # 认证管理
├── api/               # API接口定义
│   ├── daily.ts       # 日线行情API
│   ├── minute.ts      # 分钟线行情API
│   └── realtime.ts    # 实时行情API
├── models/            # 数据模型
│   ├── request.ts     # 请求数据模型
│   ├── response.ts    # 响应数据模型
│   └── error.ts       # 错误对象模型
├── utils/             # 工具函数
│   ├── validator.ts   # 参数验证器
│   └── formatter.ts   # 数据格式化器
├── types/             # TypeScript类型定义
│   ├── api.ts         # API类型定义
│   └── config.ts      # 配置类型定义
└── index.ts           # 主入口文件

tests/
├── contract/          # 契约测试
│   ├── daily.test.ts
│   ├── minute.test.ts
│   └── realtime.test.ts
├── integration/       # 集成测试
│   ├── client.test.ts
│   └── error-handling.test.ts
└── unit/              # 单元测试
    ├── validator.test.ts
    └── formatter.test.ts
```

**Structure Decision**: 采用单一项目(Single project)结构,因为这是一个SDK库项目,不涉及前后端分离或移动应用。代码按功能模块清晰组织,测试按类型分类,符合宪章要求的代码结构清晰原则。

## Phase 0: Outline & Research ✅ 完成

**已完成的研究任务**:
1. ✅ tsdown构建工具研究 - 决策使用tsdown,性能优异且专为库开发设计
2. ✅ vitest测试框架研究 - 决策使用vitest,TypeScript原生支持,性能卓越
3. ✅ Tushare API技术规范研究 - 完成认证机制、请求格式、响应结构、错误处理和接口规范研究

**输出产物**:
- ✅ `research.md` - 包含所有技术决策、理由和替代方案
- ✅ 技术上下文已填写完整,无NEEDS CLARIFICATION项

**关键决策**:
- 构建工具: tsdown (基于Rolldown,性能优异)
- 测试框架: vitest (TypeScript原生支持,覆盖率≥90%)
- 初始接口: daily(日线行情) + realtime_quote(实时行情)
- 不实现: 分钟线接口(pro_bar,需600积分且暂无HTTP支持)

## Phase 1: Design & Contracts ✅ 完成

**已完成的设计任务**:
1. ✅ 提取实体并创建数据模型定义 - 识别7个核心实体(TushareClient, ClientConfig, TushareRequest, TushareResponse, TushareError, DailyQuote, RealtimeQuote)
2. ✅ 生成API契约 - 创建daily.json和realtime.json契约文件
3. ✅ 编写快速上手指南 - 创建quickstart.md,包含完整使用示例和验收测试
4. ✅ 更新代理配置 - 运行update-agent-context.sh更新CLAUDE.md

**输出产物**:
- ✅ `data-model.md` - 包含所有实体定义、关系图、验证规则和数据流
- ✅ `contracts/daily.json` - 日线行情API契约(请求/响应格式、字段定义、示例)
- ✅ `contracts/realtime.json` - 实时行情API契约(包含数据源说明和使用限制)
- ✅ `quickstart.md` - 快速上手指南,包含基础用法、错误处理、完整示例和验收测试清单
- ✅ `CLAUDE.md` - 更新的代理配置文件

**设计亮点**:
- 双数据格式支持: 原始(fields+items)和结构化(对象数组)
- 8种错误类型分类: 精确的错误识别和处理
- 完整的验证规则: 参数验证、格式验证、业务规则验证
- 清晰的数据流: 成功流程和错误流程完整定义

**契约测试计划**:
- Phase 2将基于contracts/生成契约测试(TDD方式,测试先行)
- 每个API接口对应一个契约测试文件
- 测试将验证请求格式、响应结构和错误处理

## Phase 2: Task Planning Approach
*This section describes what the /tasks command will do - DO NOT execute during /plan*

### 任务生成策略

/tasks命令将基于Phase 1的设计产物生成详细的任务列表:

#### 输入来源
1. **contracts/** - API契约文件(daily.json, realtime.json)
2. **data-model.md** - 数据模型定义(7个核心实体)
3. **quickstart.md** - 验收测试场景
4. **spec.md** - 功能需求和用户故事

#### 任务分类和生成规则

**1. 契约测试任务** (优先级: P0, 可并行 [P])
- `contracts/daily.json` → `tests/contract/daily.test.ts` [P]
- `contracts/realtime.json` → `tests/contract/realtime.test.ts` [P]
- 每个契约测试验证:
  - 请求格式正确性
  - 响应数据结构匹配
  - 错误响应处理
- 使用MSW模拟Tushare API

**2. 类型定义任务** (优先级: P1, 可并行 [P])
- `src/types/config.ts` - ClientConfig接口 [P]
- `src/types/api.ts` - TushareRequest, TushareResponse, DailyParams, RealtimeParams [P]
- `src/types/error.ts` - TushareErrorType枚举, TushareError类 [P]
- `src/types/quote.ts` - DailyQuote, RealtimeQuote接口 [P]

**3. 数据模型任务** (优先级: P2, 依赖类型定义)
- `src/models/error.ts` - TushareError类实现(依赖types/error.ts)
- `src/models/response.ts` - 响应转换逻辑(原始→结构化)

**4. 核心服务任务** (优先级: P3, 依赖模型)
- `src/core/http.ts` - HTTP客户端封装(依赖types/config.ts)
- `src/core/auth.ts` - 认证管理(依赖types/config.ts)
- `src/core/client.ts` - TushareClient主类(依赖http.ts, auth.ts, types/*)

**5. API接口任务** (优先级: P4, 依赖核心服务)
- `src/api/daily.ts` - 日线行情API实现(依赖client.ts, types/api.ts)
- `src/api/realtime.ts` - 实时行情API实现(依赖client.ts, types/api.ts)

**6. 工具函数任务** (优先级: P5, 可并行 [P])
- `src/utils/validator.ts` - 参数验证器(依赖types/*) [P]
- `src/utils/formatter.ts` - 数据格式化器 [P]

**7. 单元测试任务** (优先级: P6, 与实现并行)
- `tests/unit/validator.test.ts` - 验证器测试
- `tests/unit/formatter.test.ts` - 格式化器测试
- `tests/unit/error.test.ts` - 错误类测试

**8. 集成测试任务** (优先级: P7, 实现后执行)
- `tests/integration/client.test.ts` - 客户端完整工作流测试
- `tests/integration/error-handling.test.ts` - 错误处理集成测试

**9. 入口文件和配置** (优先级: P8, 最后完成)
- `src/index.ts` - 主入口,导出所有公共API
- `tsdown.config.ts` - tsdown构建配置
- `vitest.config.ts` - vitest测试配置
- `vitest.setup.ts` - 测试环境设置(MSW配置)
- `tsconfig.json` - TypeScript编译配置
- `package.json` - 项目配置和依赖

**10. 文档和工具** (优先级: P9, 可选)
- `.eslintrc.js` - ESLint配置
- `.prettierrc` - Prettier配置
- `README.md` - 项目README

#### 任务排序策略

**TDD顺序原则**:
1. 契约测试(失败) → 类型定义 → 实现(使测试通过)
2. 单元测试(失败) → 实现(使测试通过)
3. 集成测试(失败) → 端到端实现(使测试通过)

**依赖顺序**:
```
类型定义 → 数据模型 → 核心服务 → API接口 → 入口文件
    ↓          ↓           ↓           ↓
契约测试 → 单元测试 → 集成测试 → 验收测试
```

**并行执行标记 [P]**:
- 独立文件且无依赖关系的任务标记[P]
- 契约测试、类型定义、工具函数可并行开发

#### 估算输出

**任务总数**: 约30-35个编号任务

**任务分布**:
- 契约测试: 2个任务
- 类型定义: 4个任务
- 数据模型: 2个任务
- 核心服务: 3个任务
- API接口: 2个任务
- 工具函数: 2个任务
- 单元测试: 3个任务
- 集成测试: 2个任务
- 配置文件: 8-10个任务
- 文档: 1-2个任务

**关键里程碑**:
1. M1: 契约测试和类型定义完成(任务1-6)
2. M2: 核心功能实现完成(任务7-15)
3. M3: 所有测试通过(任务16-25)
4. M4: 构建和文档完成(任务26-35)

### 重要提醒

**本阶段(Phase 2)由/plan命令完成,仅描述任务生成方法**

下一步:
- 用户运行 `/tasks` 命令
- /tasks命令将加载本计划和Phase 1产物
- 自动生成 `tasks.md` 文件
- 包含详细的、可执行的任务列表

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
- [x] Phase 0: Research complete (/plan command) - 2025-09-30
- [x] Phase 1: Design complete (/plan command) - 2025-09-30
- [x] Phase 2: Task planning complete (/plan command - describe approach only) - 2025-09-30
- [ ] Phase 3: Tasks generated (/tasks command) - 待执行
- [ ] Phase 4: Implementation complete - 待执行
- [ ] Phase 5: Validation passed - 待执行

**Gate Status**:
- [x] Initial Constitution Check: PASS - 无违规项
- [x] Post-Design Constitution Check: PASS - 设计符合所有宪章原则
- [x] All NEEDS CLARIFICATION resolved - 技术上下文完整
- [x] Complexity deviations documented - 无复杂度偏差

**Execution Summary**:
- ✅ Phase 0完成: 研究tsdown、vitest和Tushare API,生成research.md
- ✅ Phase 1完成: 创建data-model.md、contracts/、quickstart.md,更新CLAUDE.md
- ✅ Phase 2完成: 描述详细的任务生成策略,估算30-35个任务
- ⏭️ 下一步: 用户运行`/tasks`命令生成tasks.md

---
*Based on Constitution v1.0.0 - See `.specify/memory/constitution.md`*
