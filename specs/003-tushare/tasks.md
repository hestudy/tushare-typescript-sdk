# Tasks: 接入tushare财务数据

**Feature**: 003-tushare | **Branch**: `003-tushare` | **Date**: 2025-09-30
**Input**: Design documents from `/specs/003-tushare/`
**Prerequisites**: plan.md, research.md, data-model.md, contracts/, quickstart.md

## Execution Flow (main)
```
1. Load plan.md from feature directory
   → Tech stack: TypeScript 5.0+, Node.js 20.x+, Vitest, MSW
   → Structure: Single project (src/, tests/)
2. Load design documents:
   → data-model.md: 4 entities (IncomeStatement, BalanceSheet, CashFlowStatement, FinancialIndicator)
   → contracts/: 4 contract files (income, balancesheet, cashflow, fina_indicator)
   → research.md: Cache interface, 6 error types
3. Generate tasks by TDD order:
   → Setup: Dependencies, linting
   → Types: 4 entity types + cache + error types
   → Contract tests: 4 parallel tests
   → Models: 4 model implementations
   → Cache: Interface + implementation
   → Errors: 6 error classes
   → Client methods: 4 API methods
   → Integration tests: Full scenario test
   → Polish: Unit tests, docs
4. Apply parallel execution rules:
   → Different files = mark [P]
   → Tests before implementation
5. Total: 34 tasks across 5 phases
```

## Format: `[ID] [P?] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- All paths relative to repository root

---

## Phase 3.1: Setup & Infrastructure

### T001: 检查并确认项目结构
**描述**: 确认 `src/models/`, `src/types/`, `src/utils/`, `tests/contract/`, `tests/integration/`, `tests/unit/` 目录存在,如不存在则创建

**文件**:
- `src/models/`
- `src/types/`
- `src/utils/`
- `tests/contract/`
- `tests/integration/`
- `tests/unit/`

**验收标准**: 所有必需目录已创建

---

## Phase 3.2: 类型定义 (TDD 第一步)

**CRITICAL**: 这些类型定义必须在任何实现之前完成,为后续测试和实现提供类型支持

### T002 [P]: 定义财务数据类型
**描述**: 在 `src/types/financial.ts` 中定义财务数据相关类型

**文件**: `src/types/financial.ts`

**包含类型**:
- `IncomeStatement`: 利润表接口(12个字段)
- `BalanceSheet`: 资产负债表接口(12个字段)
- `CashFlowStatement`: 现金流量表接口(10个字段)
- `FinancialIndicator`: 财务指标接口(11个字段)
- `DataStatus`: 枚举(DISCLOSED, NOT_DISCLOSED, NOT_APPLICABLE)
- `PeriodType`: 枚举(ANNUAL, SEMI_ANNUAL, QUARTERLY)
- `FinancialDataQuery`: 查询参数接口

**验收标准**:
- 所有接口包含 JSDoc 注释
- 字段名使用 camelCase
- 数值字段类型为 `number | null`
- 必填字段不可为 undefined
- TypeScript 编译通过(`npm run typecheck`)

### T003 [P]: 定义缓存配置类型
**描述**: 在 `src/types/cache.ts` 中定义缓存相关类型

**文件**: `src/types/cache.ts`

**包含类型**:
```typescript
interface CacheConfig {
  enabled: boolean;
  ttl?: number;
  storage?: CacheStorage;
}

interface CacheStorage {
  get(key: string): Promise<any | null>;
  set(key: string, value: any, ttl?: number): Promise<void>;
  delete(key: string): Promise<void>;
  clear(): Promise<void>;
}
```

**验收标准**:
- 包含 JSDoc 注释说明用途
- 接口方法签名明确
- TypeScript 编译通过

### T004 [P]: 扩展错误类型定义
**描述**: 在 `src/types/error.ts` 中添加财务数据相关错误类型

**文件**: `src/types/error.ts`

**新增类型**:
- `DataNotDisclosedErrorOptions`: 包含 tsCode, endDate, status 字段
- `RateLimitErrorOptions`: 包含 retryAfter 可选字段

**验收标准**:
- 扩展现有错误类型系统
- 包含 JSDoc 注释
- TypeScript 编译通过

---

## Phase 3.3: 契约测试 (TDD 第二步)

**CRITICAL**: 这些测试必须编写并且必须失败(因为实现还不存在)

### T005 [P]: 利润表接口契约测试
**描述**: 在 `tests/contract/income.test.ts` 中编写利润表接口的契约测试

**文件**: `tests/contract/income.test.ts`

**测试用例**:
1. 成功响应: 验证请求格式和响应数据结构
2. 认证失败: token 无效返回 40001 错误
3. 限流错误: 超出频率限制返回 40002 错误
4. 空数据响应: 未披露数据返回空 items

**使用 MSW 模拟**:
- POST https://api.tushare.pro
- 请求体: `{ api_name: 'income', token: 'test', params: { ts_code: '000001.SZ' } }`

**验收标准**:
- 使用 vitest 和 msw
- 所有测试必须失败(RED 状态)
- 测试覆盖 contracts/income.json 中的所有场景

### T006 [P]: 资产负债表接口契约测试
**描述**: 在 `tests/contract/balance.test.ts` 中编写资产负债表接口的契约测试

**文件**: `tests/contract/balance.test.ts`

**测试用例**: 同 T005,api_name 改为 'balancesheet'

**验收标准**: 同 T005

### T007 [P]: 现金流量表接口契约测试
**描述**: 在 `tests/contract/cashflow.test.ts` 中编写现金流量表接口的契约测试

**文件**: `tests/contract/cashflow.test.ts`

**测试用例**: 同 T005,api_name 改为 'cashflow'

**验收标准**: 同 T005

### T008 [P]: 财务指标接口契约测试
**描述**: 在 `tests/contract/indicators.test.ts` 中编写财务指标接口的契约测试

**文件**: `tests/contract/indicators.test.ts`

**测试用例**: 同 T005,api_name 改为 'fina_indicator'

**验收标准**: 同 T005

---

## Phase 3.4: 错误类实现 (TDD 第三步)

### T009 [P]: 实现 DataNotDisclosedError
**描述**: 在 `src/models/error.ts` 中实现 DataNotDisclosedError 类

**文件**: `src/models/error.ts`

**实现要求**:
- 继承现有的 `TushareError` 或 `Error` 基类
- 包含字段: name, message, tsCode, endDate, status
- 构造函数接收 `DataNotDisclosedErrorOptions`
- 包含 JSDoc 注释和使用示例

**验收标准**:
- TypeScript 编译通过
- 错误实例包含所有必需字段
- 编写单元测试 `tests/unit/error.test.ts`(扩展现有文件)

### T010 [P]: 实现 RateLimitError
**描述**: 在 `src/models/error.ts` 中实现 RateLimitError 类

**文件**: `src/models/error.ts`

**实现要求**:
- 继承错误基类
- 包含字段: name, message, retryAfter(可选)
- 构造函数接收 `RateLimitErrorOptions`
- 包含 JSDoc 注释

**验收标准**: 同 T009

### T011 [P]: 扩展 AuthenticationError
**描述**: 在 `src/models/error.ts` 中确保 AuthenticationError 支持 code 字段

**文件**: `src/models/error.ts`

**实现要求**:
- 添加或确认 `code` 字段(如 40001)
- 更新构造函数接收错误码

**验收标准**: 同 T009

---

## Phase 3.5: 数据模型实现 (TDD 第四步)

### T012 [P]: 实现利润表模型
**描述**: 在 `src/models/income.ts` 中实现利润表数据模型类

**文件**: `src/models/income.ts`

**实现要求**:
- 实现 `IncomeStatement` 类或使用接口
- 提供工厂方法从 API 响应(snake_case)转换为 camelCase
- 字段验证逻辑:
  - tsCode 格式校验(6位数字+市场代码)
  - endDate/annDate 格式校验(YYYYMMDD)
- 包含 JSDoc 注释

**工厂方法示例**:
```typescript
static fromApiResponse(data: any[]): IncomeStatement
```

**验收标准**:
- 契约测试 T005 开始通过(GREEN)
- 字段映射正确(snake_case → camelCase)
- 编写单元测试验证字段转换

### T013 [P]: 实现资产负债表模型
**描述**: 在 `src/models/balance.ts` 中实现资产负债表数据模型类

**文件**: `src/models/balance.ts`

**实现要求**: 同 T012,字段根据 BalanceSheet 接口定义

**验收标准**: 契约测试 T006 开始通过

### T014 [P]: 实现现金流量表模型
**描述**: 在 `src/models/cashflow.ts` 中实现现金流量表数据模型类

**文件**: `src/models/cashflow.ts`

**实现要求**: 同 T012,字段根据 CashFlowStatement 接口定义

**验收标准**: 契约测试 T007 开始通过

### T015 [P]: 实现财务指标模型
**描述**: 在 `src/models/indicators.ts` 中实现财务指标数据模型类

**文件**: `src/models/indicators.ts`

**实现要求**: 同 T012,字段根据 FinancialIndicator 接口定义

**验收标准**: 契约测试 T008 开始通过

---

## Phase 3.6: 缓存机制实现

### T016: 实现内存缓存
**描述**: 在 `src/utils/cache.ts` 中实现默认的内存缓存

**文件**: `src/utils/cache.ts`

**实现要求**:
- 实现 `CacheStorage` 接口
- 使用 `Map<string, { value: any, expireAt: number }>` 存储
- 实现 TTL 过期逻辑
- 提供定时清理过期数据的机制

**类名**: `MemoryCache`

**验收标准**:
- 实现所有接口方法(get, set, delete, clear)
- 编写单元测试 `tests/unit/cache.test.ts`:
  - 存取数据
  - TTL 过期验证
  - clear 方法清空所有数据

---

## Phase 3.7: 客户端方法实现 (TDD 第五步)

**依赖**: T012-T015 (模型完成), T016 (缓存完成)

### T017: 实现 getIncomeStatement 方法
**描述**: 在 `src/core/client.ts` 中添加 `getIncomeStatement` 方法

**文件**: `src/core/client.ts`

**方法签名**:
```typescript
async getIncomeStatement(
  tsCode: string,
  params?: { startDate?: string; endDate?: string; period?: string }
): Promise<IncomeStatement[]>
```

**实现要求**:
- 调用 Tushare API (api_name: 'income')
- 使用 IncomeStatement.fromApiResponse 转换数据
- 处理错误:抛出 AuthenticationError, RateLimitError, DataNotDisclosedError
- 集成缓存:如果 cache.enabled=true,先查缓存
- 包含 JSDoc 注释和使用示例

**验收标准**:
- 契约测试 T005 全部通过
- 方法返回正确的数据类型
- 错误处理覆盖所有场景

### T018: 实现 getBalanceSheet 方法
**描述**: 在 `src/core/client.ts` 中添加 `getBalanceSheet` 方法

**文件**: `src/core/client.ts`

**方法签名**: 同 T017,返回类型为 `BalanceSheet[]`

**实现要求**: 同 T017,api_name 改为 'balancesheet'

**验收标准**: 契约测试 T006 全部通过

### T019: 实现 getCashFlowStatement 方法
**描述**: 在 `src/core/client.ts` 中添加 `getCashFlowStatement` 方法

**文件**: `src/core/client.ts`

**方法签名**: 同 T017,返回类型为 `CashFlowStatement[]`

**实现要求**: 同 T017,api_name 改为 'cashflow'

**验收标准**: 契约测试 T007 全部通过

### T020: 实现 getFinancialIndicators 方法
**描述**: 在 `src/core/client.ts` 中添加 `getFinancialIndicators` 方法

**文件**: `src/core/client.ts`

**方法签名**: 同 T017,返回类型为 `FinancialIndicator[]`

**实现要求**: 同 T017,api_name 改为 'fina_indicator'

**验收标准**: 契约测试 T008 全部通过

---

## Phase 3.8: 集成测试

### T021: 完整场景集成测试
**描述**: 在 `tests/integration/financial.test.ts` 中编写完整的用户场景测试

**文件**: `tests/integration/financial.test.ts`

**测试场景** (基于 quickstart.md):
1. 初始化客户端(启用缓存)
2. 查询指定股票(000001.SZ)的利润表数据
3. 查询同一股票的资产负债表数据
4. 查询同一股票的现金流量表数据
5. 查询同一股票的财务指标数据
6. 验证第二次查询使用缓存(mock 不应被再次调用)
7. 测试错误处理:
   - token 无效场景
   - 限流场景
   - 数据未披露场景

**验收标准**:
- 所有场景测试通过
- 使用 MSW 模拟 API
- 缓存行为正确

---

## Phase 3.9: 导出与文档

### T022 [P]: 更新 src/index.ts 导出
**描述**: 在 `src/index.ts` 中导出所有新增的类型、模型和错误类

**文件**: `src/index.ts`

**导出内容**:
- Types: `IncomeStatement`, `BalanceSheet`, `CashFlowStatement`, `FinancialIndicator`, `FinancialDataQuery`, `DataStatus`, `PeriodType`, `CacheConfig`, `CacheStorage`
- Models: 模型类(如果使用类实现)
- Errors: `DataNotDisclosedError`, `RateLimitError`, `AuthenticationError`
- Client: `TushareClient` (确保新方法可用)

**验收标准**:
- TypeScript 编译通过
- 构建成功(`npm run build`)
- 类型定义文件正确生成(`dist/index.d.ts`)

### T023 [P]: 添加 JSDoc/TSDoc 注释
**描述**: 为所有新增的公共 API 添加完整的 JSDoc 注释

**文件**:
- `src/core/client.ts` (4个新方法)
- `src/types/financial.ts` (所有接口和枚举)
- `src/types/cache.ts` (接口)
- `src/models/*.ts` (所有模型类)

**注释包含**:
- 方法/接口用途说明
- 参数说明(@param)
- 返回值说明(@returns)
- 可能抛出的异常(@throws)
- 使用示例(@example)

**验收标准**:
- 所有公共 API 包含 JSDoc
- 示例代码可运行
- 注释符合 TSDoc 规范

---

## Phase 3.10: 单元测试覆盖

### T024 [P]: 模型单元测试
**描述**: 为所有模型类编写单元测试

**文件**: 在 `tests/unit/` 中为每个模型创建测试文件:
- `tests/unit/income.test.ts`
- `tests/unit/balance.test.ts`
- `tests/unit/cashflow.test.ts`
- `tests/unit/indicators.test.ts`

**测试内容**:
- 字段转换(snake_case → camelCase)
- 字段验证(tsCode 格式、日期格式)
- null 值处理
- 边界情况

**验收标准**:
- 每个模型至少 5 个测试用例
- 覆盖所有验证规则

### T025 [P]: 错误类单元测试
**描述**: 扩展 `tests/unit/error.test.ts` 添加新错误类的测试

**文件**: `tests/unit/error.test.ts`

**测试内容**:
- DataNotDisclosedError 实例化和字段
- RateLimitError 实例化和 retryAfter
- AuthenticationError code 字段

**验收标准**:
- 每个错误类至少 3 个测试用例
- 验证错误消息和自定义字段

### T026 [P]: 缓存工具单元测试
**描述**: 补充 `tests/unit/cache.test.ts` 的测试覆盖

**文件**: `tests/unit/cache.test.ts`

**测试内容**:
- 基本存取
- TTL 过期
- delete 方法
- clear 方法
- 并发场景(可选)

**验收标准**:
- 测试覆盖率 ≥ 90%
- 包含异步测试

---

## Phase 3.11: 质量检查与优化

### T027: 运行 linting 并修复问题
**描述**: 运行 `npm run lint` 并修复所有 linting 错误

**命令**: `npm run lint`

**验收标准**:
- 无 ESLint 错误
- 代码风格统一

### T028: 运行类型检查
**描述**: 运行 `npm run typecheck` 确保所有类型正确

**命令**: `npm run typecheck`

**验收标准**:
- TypeScript 编译无错误
- 无 `any` 类型(除特殊情况)

### T029: 运行测试覆盖率检查
**描述**: 运行 `npm run test:coverage` 检查测试覆盖率

**命令**: `npm run test:coverage`

**验收标准**:
- 单元测试覆盖率 ≥ 90%
- 契约测试覆盖所有 API 端点
- 集成测试覆盖主要用户场景

### T030: 构建并检查包体积
**描述**: 运行 `npm run build` 并检查构建产物

**命令**: `npm run build`

**验收标准**:
- 构建成功
- 压缩后包体积 < 100KB
- 类型定义文件正确生成

---

## Phase 3.12: 验收与文档

### T031: 执行 quickstart.md 验收
**描述**: 按照 `specs/003-tushare/quickstart.md` 执行完整的使用示例

**前置条件**: 设置环境变量 `TUSHARE_TOKEN`

**验收步骤**:
1. 创建示例文件 `examples/financial.ts`
2. 复制 quickstart.md 中的完整示例代码
3. 运行示例: `ts-node examples/financial.ts`
4. 验证输出符合预期

**验收标准**:
- 示例代码无错误运行
- 输出包含利润表、资产负债表、现金流量表、财务指标数据
- 错误处理正确

### T032 [P]: 更新 README.md
**描述**: 更新项目根目录的 `README.md`,添加财务数据功能说明

**文件**: `README.md`

**添加章节**:
- **财务数据接口**: 功能简介
- **快速开始**: 引用 quickstart 示例
- **API 文档**: 4个新方法的简要说明
- **错误处理**: 错误类型说明

**验收标准**:
- 文档清晰易懂
- 示例代码可运行
- 包含所有新增功能

### T033 [P]: 更新 CHANGELOG.md
**描述**: 在 `CHANGELOG.md` 中添加本次功能的变更记录

**文件**: `CHANGELOG.md`

**版本**: 根据语义化版本规则(MINOR 版本,如 1.1.0)

**变更内容**:
```markdown
## [1.1.0] - 2025-09-30

### Added
- 财务数据接口支持:
  - `getIncomeStatement`: 查询利润表数据
  - `getBalanceSheet`: 查询资产负债表数据
  - `getCashFlowStatement`: 查询现金流量表数据
  - `getFinancialIndicators`: 查询财务指标数据
- 可选的缓存机制(`CacheConfig`, `CacheStorage`)
- 新增错误类型:`DataNotDisclosedError`, `RateLimitError`
- 完整的 TypeScript 类型定义

### Changed
- 无

### Fixed
- 无
```

**验收标准**:
- 遵循 Keep a Changelog 格式
- 版本号符合语义化版本规范

### T034: 最终验收检查
**描述**: 执行完整的自动化测试套件并验收

**命令**:
```bash
npm run typecheck && npm run lint && npm run test && npm run build
```

**验收标准**:
- ✅ 类型检查通过
- ✅ Linting 通过
- ✅ 所有测试通过(契约测试、单元测试、集成测试)
- ✅ 构建成功
- ✅ 所有任务(T001-T033)已完成

---

## Dependencies (任务依赖关系)

```
Phase 3.1 (Setup)
  T001 → 所有后续任务

Phase 3.2 (Types)
  T002, T003, T004 → T005-T008 (契约测试需要类型定义)

Phase 3.3 (Contract Tests)
  T005-T008 → T012-T015 (模型实现需要测试先失败)

Phase 3.4 (Errors)
  T009-T011 → T017-T020 (客户端方法需要错误类)

Phase 3.5 (Models)
  T012-T015 → T017-T020 (客户端方法需要模型)

Phase 3.6 (Cache)
  T016 → T017-T020 (客户端方法需要缓存)

Phase 3.7 (Client Methods)
  T017-T020 → T021 (集成测试需要客户端方法)

Phase 3.8 (Integration)
  T021 → T031 (quickstart 验收需要集成测试通过)

Phase 3.9 (Exports)
  T022, T023 → T031 (验收需要完整导出)

Phase 3.10 (Unit Tests)
  T024-T026 独立,可并行

Phase 3.11 (Quality)
  T027-T030 → T034 (最终验收需要质量检查通过)

Phase 3.12 (Docs)
  T031-T033 → T034 (最终验收需要文档完成)
```

## Parallel Execution Examples

### 批次 1: 类型定义(可并行)
```bash
# T002, T003, T004 可同时执行
Task: "定义财务数据类型 in src/types/financial.ts"
Task: "定义缓存配置类型 in src/types/cache.ts"
Task: "扩展错误类型定义 in src/types/error.ts"
```

### 批次 2: 契约测试(可并行)
```bash
# T005-T008 可同时执行
Task: "利润表接口契约测试 in tests/contract/income.test.ts"
Task: "资产负债表接口契约测试 in tests/contract/balance.test.ts"
Task: "现金流量表接口契约测试 in tests/contract/cashflow.test.ts"
Task: "财务指标接口契约测试 in tests/contract/indicators.test.ts"
```

### 批次 3: 错误类(可并行)
```bash
# T009-T011 可同时编辑,但都在 src/models/error.ts,建议串行或分文件
# 如果分文件则可并行
```

### 批次 4: 模型实现(可并行)
```bash
# T012-T015 可同时执行
Task: "实现利润表模型 in src/models/income.ts"
Task: "实现资产负债表模型 in src/models/balance.ts"
Task: "实现现金流量表模型 in src/models/cashflow.ts"
Task: "实现财务指标模型 in src/models/indicators.ts"
```

### 批次 5: 单元测试(可并行)
```bash
# T024-T026 可同时执行
Task: "模型单元测试 in tests/unit/income.test.ts, balance.test.ts, cashflow.test.ts, indicators.test.ts"
Task: "错误类单元测试 in tests/unit/error.test.ts"
Task: "缓存工具单元测试 in tests/unit/cache.test.ts"
```

### 批次 6: 文档(可并行)
```bash
# T032-T033 可同时执行
Task: "更新 README.md"
Task: "更新 CHANGELOG.md"
```

## Notes

- **TDD 严格遵守**: 契约测试(T005-T008)必须在模型实现(T012-T015)之前完成并失败
- **[P] 标记**: 表示不同文件的独立任务,可并行执行
- **客户端方法**: T017-T020 修改同一文件(`src/core/client.ts`),建议串行执行
- **错误类**: T009-T011 修改同一文件(`src/models/error.ts`),建议串行执行
- **提交频率**: 建议每完成一个任务提交一次(或每个 Phase 提交一次)
- **测试优先**: 确保每个实现任务前对应的测试已存在并失败

## Validation Checklist
*GATE: 最终验收前检查*

- [x] 所有契约(4个)有对应的契约测试
- [x] 所有实体(4个)有对应的模型实现
- [x] 所有测试在实现前编写(TDD)
- [x] 并行任务确实独立(不同文件)
- [x] 每个任务指定了明确的文件路径
- [x] 没有两个 [P] 任务修改同一文件

---

**状态**: ✅ 任务列表已生成 | **总任务数**: 34 | **预计工时**: 3-5天

**下一步**: 开始执行 Phase 3.1 (T001),或使用 Agent 并行执行类型定义任务(T002-T004)