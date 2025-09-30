# Tasks: Tushare TypeScript SDK

**Feature**: 001-tushare-typescript-sdk
**Input**: Design documents from `/Users/hestudy/Documents/project/tushare-typescript-sdk/specs/001-tushare-typescript-sdk/`
**Prerequisites**: plan.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅, quickstart.md ✅

## Execution Flow (main)
```
1. ✅ Load plan.md from feature directory
   → Tech stack: TypeScript 5.0+, Node.js 20.x+, tsdown, vitest
   → Structure: Single project (src/, tests/)
2. ✅ Load optional design documents:
   → data-model.md: 7 entities identified
   → contracts/: 2 API contracts (daily.json, realtime.json)
   → research.md: Technical decisions loaded
3. ✅ Generate tasks by category
4. ✅ Apply task rules (TDD, parallel marking)
5. ✅ Number tasks sequentially
6. ✅ Generate dependency graph
7. ✅ Create parallel execution examples
8. ✅ Validate task completeness
9. ✅ Return: SUCCESS (tasks ready for execution)
```

## Format: `[ID] [P?] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

## Path Conventions
- Single project structure: `src/`, `tests/` at repository root

---

## Phase 3.1: Setup (项目初始化)

- [ ] **T001** 创建项目目录结构
  - **目标**: 按照plan.md创建完整的目录结构
  - **路径**:
    - `src/core/`
    - `src/api/`
    - `src/models/`
    - `src/utils/`
    - `src/types/`
    - `tests/contract/`
    - `tests/integration/`
    - `tests/unit/`
  - **验证**: 所有目录存在且可访问

- [ ] **T002** 初始化Node.js项目并安装依赖
  - **目标**: 创建package.json并安装所有必需依赖
  - **文件**: `package.json`
  - **依赖**:
    - 生产依赖: 无(纯SDK,无外部依赖)
    - 开发依赖: typescript@^5.0.0, tsdown, vitest, @vitest/coverage-v8, msw@^2.0.0
  - **脚本**: 添加build、test、lint命令
  - **验证**: `npm install` 成功执行

- [ ] **T003** [P] 配置TypeScript编译器
  - **目标**: 创建TypeScript配置,启用严格模式
  - **文件**: `tsconfig.json`
  - **配置**:
    - target: ES2020
    - module: ESNext
    - strict: true
    - noImplicitAny: true
    - esModuleInterop: true
    - skipLibCheck: true
  - **验证**: 配置符合TypeScript 5.0+规范

- [ ] **T004** [P] 配置tsdown构建工具
  - **目标**: 配置tsdown用于SDK打包构建
  - **文件**: `tsdown.config.ts`
  - **配置**:
    - entry: src/index.ts
    - format: esm, cjs
    - dts: true (生成类型声明)
    - minify: true
    - target: node20
  - **验证**: 构建产物<100KB

- [ ] **T005** [P] 配置vitest测试框架
  - **目标**: 配置vitest用于单元测试、集成测试和契约测试
  - **文件**: `vitest.config.ts`
  - **配置**:
    - environment: node
    - coverage: v8, threshold ≥90%
    - setupFiles: vitest.setup.ts
    - threads: true
  - **验证**: vitest命令可执行

- [ ] **T006** [P] 配置vitest测试环境和MSW
  - **目标**: 设置测试环境,配置MSW模拟Tushare API
  - **文件**: `vitest.setup.ts`
  - **配置**:
    - 初始化MSW server
    - 配置基础mock handlers
    - 设置beforeAll/afterAll钩子
  - **验证**: MSW可正常拦截HTTP请求

- [ ] **T007** [P] 配置ESLint和Prettier
  - **目标**: 配置代码检查和格式化工具
  - **文件**: `.eslintrc.js`, `.prettierrc`
  - **配置**:
    - ESLint: @typescript-eslint/recommended
    - Prettier: singleQuote, semi, trailingComma
  - **验证**: npm run lint无错误

---

## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3

**CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation**

### 契约测试 (基于contracts/)

- [ ] **T008** [P] 日线行情API契约测试
  - **目标**: 验证daily API的请求格式和响应结构
  - **文件**: `tests/contract/daily.test.ts`
  - **契约来源**: `contracts/daily.json`
  - **测试场景**:
    - ✅ 成功响应: code=0, data.fields和data.items格式正确
    - ✅ 认证错误: code=2002, msg="token无效或过期"
    - ✅ 权限错误: code=2002, msg="积分不足或无权限"
    - ✅ 参数错误: code=-1, msg包含"参数错误"
    - ✅ 请求格式验证: api_name="daily", token存在, params结构正确
    - ✅ 响应字段验证: 11个字段(ts_code, trade_date, open, high, low, close, pre_close, change, pct_chg, vol, amount)
  - **MSW Mock**: 模拟http://api.tushare.pro的POST请求
  - **验证**: 测试运行但全部失败(因为尚未实现)

- [ ] **T009** [P] 实时行情API契约测试
  - **目标**: 验证realtime_quote API的请求格式和响应结构
  - **文件**: `tests/contract/realtime.test.ts`
  - **契约来源**: `contracts/realtime.json`
  - **测试场景**:
    - ✅ 成功响应: code=0, data.fields和data.items格式正确
    - ✅ 认证错误: code=2002, msg="token无效或过期"
    - ✅ 参数错误: code=-1, msg="参数错误:ts_code为必填项"
    - ✅ 频率限制错误: code=-1, msg="超过调用频率限制"
    - ✅ 单个股票查询: ts_code="000001.SZ"
    - ✅ 多个股票查询: ts_code="000001.SZ,600000.SH,600519.SH"
    - ✅ 响应字段验证: 9个字段(ts_code, name, price, open, high, low, pre_close, volume, amount)
  - **MSW Mock**: 模拟http://api.tushare.pro的POST请求
  - **验证**: 测试运行但全部失败(因为尚未实现)

### 集成测试 (基于quickstart.md验收场景)

- [ ] **T010** [P] 客户端初始化和基础查询集成测试
  - **目标**: 测试TushareClient的完整工作流程
  - **文件**: `tests/integration/client.test.ts`
  - **测试场景**:
    - ✅ 客户端初始化: 配置token, timeout, debug
    - ✅ 查询单个股票日线数据: ts_code="000001.SZ"
    - ✅ 查询日期范围的日线数据: start_date + end_date
    - ✅ 查询单个股票实时行情
    - ✅ 批量查询实时行情(多个股票代码)
    - ✅ 响应数据结构化转换: raw → data[]
    - ✅ isReady()状态检查
  - **MSW Mock**: 模拟成功响应
  - **验证**: 测试运行但全部失败(因为尚未实现)

- [ ] **T011** [P] 错误处理集成测试
  - **目标**: 测试所有错误类型的处理流程
  - **文件**: `tests/integration/error-handling.test.ts`
  - **测试场景**:
    - ✅ AUTHENTICATION_ERROR: 无效token
    - ✅ PERMISSION_ERROR: 积分不足
    - ✅ RATE_LIMIT_ERROR: 超频率限制
    - ✅ PARAMETER_ERROR: 缺少必填参数
    - ✅ TIMEOUT_ERROR: 请求超时(timeout=1ms)
    - ✅ NETWORK_ERROR: 网络连接失败
    - ✅ SERVER_ERROR: 服务器内部错误
    - ✅ UNKNOWN_ERROR: 未知错误
    - ✅ 错误对象包含正确的type、code、message
  - **MSW Mock**: 模拟各种错误响应
  - **验证**: 测试运行但全部失败(因为尚未实现)

---

## Phase 3.3: Core Implementation (ONLY after tests are failing)

### 类型定义 (基于data-model.md)

- [ ] **T012** [P] 配置和认证类型定义
  - **目标**: 定义ClientConfig接口
  - **文件**: `src/types/config.ts`
  - **实体**: ClientConfig (data-model.md #2)
  - **接口**:
    ```typescript
    interface ClientConfig {
      token: string
      baseUrl?: string
      timeout?: number
      debug?: boolean
    }
    ```
  - **验证**: 类型通过TypeScript编译

- [ ] **T013** [P] API请求和响应类型定义
  - **目标**: 定义TushareRequest、TushareResponse、DailyParams、RealtimeParams
  - **文件**: `src/types/api.ts`
  - **实体**: TushareRequest (#3), TushareResponse (#4), DailyParams, RealtimeParams
  - **接口**:
    ```typescript
    interface TushareRequest { api_name, token, params, fields? }
    interface TushareRawResponse { code, msg, data }
    interface TushareResponse<T> { code, msg, raw, data, success }
    interface DailyParams { ts_code?, trade_date?, start_date?, end_date? }
    interface RealtimeParams { ts_code: string }
    ```
  - **验证**: 类型通过TypeScript编译

- [ ] **T014** [P] 错误类型定义
  - **目标**: 定义TushareErrorType枚举和TushareError类
  - **文件**: `src/types/error.ts`
  - **实体**: TushareError (#5), TushareErrorType
  - **类型**:
    ```typescript
    enum TushareErrorType { AUTHENTICATION_ERROR, PERMISSION_ERROR, ... }
    class TushareError extends Error { type, code, message, rawResponse?, requestParams? }
    ```
  - **验证**: 类型通过TypeScript编译

- [ ] **T015** [P] 行情数据类型定义
  - **目标**: 定义DailyQuote和RealtimeQuote接口
  - **文件**: `src/types/quote.ts`
  - **实体**: DailyQuote (#6), RealtimeQuote (#7)
  - **接口**:
    ```typescript
    interface DailyQuote { ts_code, trade_date, open, high, low, close, pre_close, change, pct_chg, vol, amount }
    interface RealtimeQuote { ts_code, name, price, open, high, low, pre_close, volume, amount }
    ```
  - **验证**: 类型通过TypeScript编译

### 数据模型实现

- [ ] **T016** 错误类实现
  - **目标**: 实现TushareError类和错误映射逻辑
  - **文件**: `src/models/error.ts`
  - **依赖**: T014 (src/types/error.ts)
  - **实现**:
    - TushareError类构造函数
    - 错误代码到错误类型的映射函数
    - 错误消息关键词识别逻辑
  - **验证**: 错误映射规则符合data-model.md表格

- [ ] **T017** 响应数据转换器
  - **目标**: 实现原始响应数据转换为结构化数据
  - **文件**: `src/models/response.ts`
  - **依赖**: T013 (src/types/api.ts)
  - **实现**:
    - transformResponse<T>函数: {fields, items} → T[]
    - 类型安全的数据转换
    - 处理null和空数据情况
  - **验证**: fields和items正确映射为对象数组

### 核心服务

- [ ] **T018** HTTP客户端封装
  - **目标**: 封装HTTP请求逻辑,支持超时和错误处理
  - **文件**: `src/core/http.ts`
  - **依赖**: T012 (src/types/config.ts), T013 (src/types/api.ts), T016 (src/models/error.ts)
  - **实现**:
    - HttpClient类
    - post<T>(url, body, timeout)方法
    - 网络错误捕获和转换为TushareError
    - 超时处理
  - **验证**: HTTP请求可发送且正确处理错误

- [ ] **T019** 认证管理器
  - **目标**: 管理Token和请求认证
  - **文件**: `src/core/auth.ts`
  - **依赖**: T012 (src/types/config.ts)
  - **实现**:
    - AuthManager类
    - getToken()方法
    - validateToken()方法(基础格式验证)
  - **验证**: Token验证规则正确(length >= 32)

- [ ] **T020** TushareClient主类
  - **目标**: 实现SDK的主客户端类
  - **文件**: `src/core/client.ts`
  - **依赖**: T018 (src/core/http.ts), T019 (src/core/auth.ts), T013 (src/types/api.ts), T017 (src/models/response.ts)
  - **实现**:
    - TushareClient类
    - 构造函数(config: ClientConfig)
    - query<T>(request: TushareRequest)通用查询方法
    - isReady()状态检查
    - 配置管理方法(getConfig, updateTimeout)
  - **验证**: 客户端可初始化并管理配置

### API接口实现

- [ ] **T021** 日线行情API
  - **目标**: 实现daily()方法
  - **文件**: `src/api/daily.ts`
  - **依赖**: T020 (src/core/client.ts), T013 (src/types/api.ts), T015 (src/types/quote.ts)
  - **实现**:
    - daily(params: DailyParams)方法
    - 参数验证(至少一个查询条件)
    - 调用client.query<DailyQuote>
    - 返回TushareResponse<DailyQuote>
  - **验证**: T008契约测试开始通过

- [ ] **T022** 实时行情API
  - **目标**: 实现realtimeQuote()方法
  - **文件**: `src/api/realtime.ts`
  - **依赖**: T020 (src/core/client.ts), T013 (src/types/api.ts), T015 (src/types/quote.ts)
  - **实现**:
    - realtimeQuote(params: RealtimeParams)方法
    - 参数验证(ts_code必填)
    - 调用client.query<RealtimeQuote>
    - 返回TushareResponse<RealtimeQuote>
  - **验证**: T009契约测试开始通过

### 工具函数

- [ ] **T023** [P] 参数验证器
  - **目标**: 实现参数验证逻辑
  - **文件**: `src/utils/validator.ts`
  - **依赖**: T013 (src/types/api.ts), T014 (src/types/error.ts)
  - **实现**:
    - validateDailyParams(params)
    - validateRealtimeParams(params)
    - validateDateFormat(date: string)
    - validateStockCode(code: string)
  - **验证规则**: data-model.md验证规则汇总
  - **验证**: 参数验证逻辑符合规范

- [ ] **T024** [P] 数据格式化器
  - **目标**: 实现数据格式化和转换工具
  - **文件**: `src/utils/formatter.ts`
  - **实现**:
    - formatDate(date: string)
    - formatStockCode(code: string)
    - parseStockCodes(codes: string): string[]
  - **验证**: 格式化函数输出正确

---

## Phase 3.4: Integration (集成和入口)

- [ ] **T025** 将API方法集成到TushareClient
  - **目标**: 在TushareClient中集成daily和realtimeQuote方法
  - **文件**: `src/core/client.ts` (修改)
  - **依赖**: T021 (src/api/daily.ts), T022 (src/api/realtime.ts), T023 (src/utils/validator.ts)
  - **实现**:
    - 在TushareClient中添加daily(params)方法
    - 在TushareClient中添加realtimeQuote(params)方法
    - 调用validator验证参数
    - 调用对应API模块
  - **验证**: T010集成测试开始通过

- [ ] **T026** 错误处理集成
  - **目标**: 完善错误处理和错误映射
  - **文件**: `src/core/client.ts` (修改)
  - **依赖**: T016 (src/models/error.ts)
  - **实现**:
    - 捕获HTTP错误并转换为TushareError
    - 解析API错误响应(code !== 0)
    - 应用错误映射规则
    - 附加requestParams到错误对象
  - **验证**: T011错误处理测试开始通过

- [ ] **T027** 主入口文件
  - **目标**: 创建SDK的主入口,导出所有公共API
  - **文件**: `src/index.ts`
  - **依赖**: T020 (src/core/client.ts), T012-T015 (所有类型), T016 (src/models/error.ts)
  - **导出**:
    ```typescript
    export { TushareClient } from './core/client'
    export type { ClientConfig, DailyParams, RealtimeParams, TushareResponse, DailyQuote, RealtimeQuote } from './types'
    export { TushareError, TushareErrorType } from './models/error'
    ```
  - **验证**: 导出的API在外部可用

---

## Phase 3.5: Polish (完善和优化)

### 单元测试

- [ ] **T028** [P] 参数验证器单元测试
  - **目标**: 测试validator.ts的所有验证规则
  - **文件**: `tests/unit/validator.test.ts`
  - **依赖**: T023 (src/utils/validator.ts)
  - **测试场景**:
    - ✅ validateDailyParams: 各种参数组合的验证
    - ✅ validateRealtimeParams: ts_code验证
    - ✅ validateDateFormat: YYYYMMDD格式验证
    - ✅ validateStockCode: 股票代码格式验证
    - ✅ 边界条件和异常情况
  - **验证**: 单元测试覆盖率≥90%

- [ ] **T029** [P] 数据格式化器单元测试
  - **目标**: 测试formatter.ts的所有格式化函数
  - **文件**: `tests/unit/formatter.test.ts`
  - **依赖**: T024 (src/utils/formatter.ts)
  - **测试场景**:
    - ✅ formatDate: 日期格式化
    - ✅ formatStockCode: 股票代码格式化
    - ✅ parseStockCodes: 多代码解析
    - ✅ 边界条件和异常情况
  - **验证**: 单元测试覆盖率≥90%

- [ ] **T030** [P] 错误类单元测试
  - **目标**: 测试TushareError类和错误映射逻辑
  - **文件**: `tests/unit/error.test.ts`
  - **依赖**: T016 (src/models/error.ts)
  - **测试场景**:
    - ✅ TushareError构造函数
    - ✅ 错误代码到错误类型映射
    - ✅ 错误消息关键词识别
    - ✅ 所有8种错误类型
  - **验证**: 单元测试覆盖率≥90%

- [ ] **T031** [P] 响应转换器单元测试
  - **目标**: 测试response.ts的数据转换逻辑
  - **文件**: `tests/unit/response.test.ts`
  - **依赖**: T017 (src/models/response.ts)
  - **测试场景**:
    - ✅ transformResponse: fields+items → 对象数组
    - ✅ 空数据处理
    - ✅ null值处理
    - ✅ 类型转换正确性
  - **验证**: 单元测试覆盖率≥90%

### 性能和质量

- [ ] **T032** 性能测试
  - **目标**: 验证API调用响应时间和包体积
  - **文件**: `tests/performance/api-performance.test.ts`
  - **性能目标**:
    - ✅ API调用响应时间<5秒(含网络延迟)
    - ✅ 构建后包体积<100KB(压缩后)
    - ✅ 内存占用合理(无明显泄漏)
  - **验证**: 性能指标符合plan.md要求

- [ ] **T033** 代码质量检查
  - **目标**: 确保代码符合宪章要求
  - **检查项**:
    - ✅ ESLint无错误
    - ✅ Prettier格式化一致
    - ✅ TypeScript严格模式通过
    - ✅ 无any类型(除非必要)
    - ✅ 所有公共API有JSDoc注释
    - ✅ 测试覆盖率≥90%
  - **验证**: npm run lint && npm run test通过

### 文档和示例

- [ ] **T034** [P] 添加JSDoc注释
  - **目标**: 为所有公共API添加JSDoc/TSDoc注释
  - **文件**:
    - `src/core/client.ts`
    - `src/types/*.ts`
    - `src/models/error.ts`
  - **内容**: 清晰的方法说明、参数说明、返回值说明、使用示例
  - **验证**: 注释完整且准确

- [ ] **T035** [P] 生成类型声明文件
  - **目标**: 运行tsdown构建生成.d.ts文件
  - **命令**: `npm run build`
  - **输出**: `dist/index.d.ts`
  - **验证**: 类型声明文件完整且可用

- [ ] **T036** [P] 运行quickstart.md验收测试
  - **目标**: 手动执行quickstart.md中的所有示例代码
  - **文件**: `specs/001-tushare-typescript-sdk/quickstart.md`
  - **测试场景**: 按照quickstart.md的"测试验证步骤"清单逐项执行
  - **验证**: 所有示例代码可运行且结果正确

---

## Dependencies (依赖关系图)

### 关键依赖链

```
Setup (T001-T007)
  ↓
Tests (T008-T011) [必须失败] ⚠️
  ↓
Types (T012-T015) [可并行P]
  ↓
Models (T016-T017)
  ↓
Core Services (T018-T020)
  ↓
API Implementation (T021-T022)
  ↓
Integration (T025-T027)
  ↓
Polish (T028-T036) [部分可并行P]
```

### 详细依赖关系

**Setup阶段**:
- T001 → T002 → 所有其他任务
- T003, T004, T005, T006, T007 可并行(不同文件)

**Tests阶段** (TDD关键):
- T008, T009, T010, T011 可并行(不同文件)
- 所有测试必须在实现前完成

**Types阶段**:
- T012, T013, T014, T015 可并行(不同文件)

**Models阶段**:
- T016 依赖 T014
- T017 依赖 T013

**Core阶段**:
- T018 依赖 T012, T013, T016
- T019 依赖 T012
- T020 依赖 T018, T019, T013, T017

**API阶段**:
- T021 依赖 T020, T013, T015
- T022 依赖 T020, T013, T015

**Utils阶段** (可提前并行):
- T023 依赖 T013, T014
- T024 无前置依赖

**Integration阶段**:
- T025 依赖 T021, T022, T023
- T026 依赖 T016
- T027 依赖 T020, T012-T015, T016

**Polish阶段**:
- T028 依赖 T023
- T029 依赖 T024
- T030 依赖 T016
- T031 依赖 T017
- T028-T031 可并行(不同文件)
- T032 依赖 T025-T027
- T033 依赖所有实现完成
- T034, T035, T036 可并行

---

## Parallel Execution Examples (并行执行示例)

### 示例1: Setup阶段并行配置

```bash
# 在完成T001-T002后,并行执行配置任务
Task T003: "配置TypeScript编译器 - tsconfig.json"
Task T004: "配置tsdown构建工具 - tsdown.config.ts"
Task T005: "配置vitest测试框架 - vitest.config.ts"
Task T006: "配置vitest测试环境和MSW - vitest.setup.ts"
Task T007: "配置ESLint和Prettier - .eslintrc.js, .prettierrc"
```

### 示例2: Tests阶段并行创建所有测试

```bash
# TDD关键: 所有测试必须并行创建并失败
Task T008: "日线行情API契约测试 - tests/contract/daily.test.ts"
Task T009: "实时行情API契约测试 - tests/contract/realtime.test.ts"
Task T010: "客户端初始化和基础查询集成测试 - tests/integration/client.test.ts"
Task T011: "错误处理集成测试 - tests/integration/error-handling.test.ts"
```

### 示例3: Types阶段并行定义所有类型

```bash
# 类型定义互不依赖,可并行创建
Task T012: "配置和认证类型定义 - src/types/config.ts"
Task T013: "API请求和响应类型定义 - src/types/api.ts"
Task T014: "错误类型定义 - src/types/error.ts"
Task T015: "行情数据类型定义 - src/types/quote.ts"
```

### 示例4: Polish阶段并行单元测试

```bash
# 单元测试可并行创建
Task T028: "参数验证器单元测试 - tests/unit/validator.test.ts"
Task T029: "数据格式化器单元测试 - tests/unit/formatter.test.ts"
Task T030: "错误类单元测试 - tests/unit/error.test.ts"
Task T031: "响应转换器单元测试 - tests/unit/response.test.ts"
```

### 示例5: 最终文档并行处理

```bash
# 文档和构建可并行
Task T034: "添加JSDoc注释 - src/core/client.ts, src/types/*.ts, src/models/error.ts"
Task T035: "生成类型声明文件 - npm run build"
Task T036: "运行quickstart.md验收测试"
```

---

## Milestones (里程碑)

### M1: 环境就绪 (T001-T007)
- ✅ 项目结构创建完成
- ✅ 所有依赖安装完成
- ✅ 构建和测试工具配置完成
- ✅ npm run build 和 npm run test 命令可执行

### M2: 测试先行 (T008-T011) ⚠️ TDD关键
- ✅ 所有契约测试编写完成
- ✅ 所有集成测试编写完成
- ✅ 测试运行但全部失败(符合TDD预期)
- ✅ MSW mock配置正确

### M3: 核心实现 (T012-T024)
- ✅ 所有类型定义完成
- ✅ 数据模型实现完成
- ✅ 核心服务实现完成
- ✅ API接口实现完成
- ✅ 工具函数实现完成

### M4: 集成完成 (T025-T027)
- ✅ 客户端集成所有API
- ✅ 错误处理集成完成
- ✅ 主入口文件创建
- ✅ T008-T011所有测试通过 ✅

### M5: 发布就绪 (T028-T036)
- ✅ 单元测试覆盖率≥90%
- ✅ 性能指标达标
- ✅ 代码质量检查通过
- ✅ 文档和注释完整
- ✅ quickstart.md验收通过

---

## Validation Checklist (验证清单)

**GATE: Checked before marking tasks complete**

### 契约覆盖
- [x] contracts/daily.json → tests/contract/daily.test.ts (T008)
- [x] contracts/realtime.json → tests/contract/realtime.test.ts (T009)

### 实体覆盖
- [x] ClientConfig → src/types/config.ts (T012)
- [x] TushareRequest, TushareResponse → src/types/api.ts (T013)
- [x] TushareError → src/types/error.ts (T014)
- [x] DailyQuote, RealtimeQuote → src/types/quote.ts (T015)
- [x] TushareError类 → src/models/error.ts (T016)
- [x] 响应转换 → src/models/response.ts (T017)
- [x] TushareClient → src/core/client.ts (T020)

### TDD验证
- [x] 所有测试在实现前创建
- [x] 测试先失败,实现后通过
- [x] 契约测试覆盖所有API

### 并行任务验证
- [x] 所有[P]任务操作不同文件
- [x] 无[P]任务有共同依赖导致冲突
- [x] 依赖链清晰无循环

### 文件路径验证
- [x] 所有任务指定了明确的文件路径
- [x] 路径符合plan.md的项目结构
- [x] 无重复文件修改冲突

### 宪章合规
- [x] 测试优先(TDD): T008-T011在T012之前
- [x] 类型安全: 所有类型明确定义
- [x] 注释清晰: T034添加JSDoc
- [x] 代码结构清晰: 按模块组织
- [x] 契约测试: T008-T009覆盖所有API

---

## Notes (注意事项)

### TDD流程要求
1. **必须**: T008-T011在任何实现之前完成
2. **必须**: 测试首次运行时全部失败
3. **必须**: 实现后测试逐步通过
4. **禁止**: 跳过测试直接实现

### 并行执行建议
- Setup阶段(T003-T007): 5个任务并行
- Tests阶段(T008-T011): 4个任务并行
- Types阶段(T012-T015): 4个任务并行
- Polish阶段(T028-T031): 4个任务并行

### 常见陷阱避免
- ❌ 不要在测试通过前开始实现
- ❌ 不要让多个[P]任务修改同一文件
- ❌ 不要跳过参数验证
- ❌ 不要使用any类型(除非绝对必要)
- ❌ 不要忽略错误处理

### 提交策略
- 每个任务完成后创建一次提交
- 提交消息格式: `[T###] 任务描述`
- Milestone完成后创建标签

---

**任务总数**: 36个任务
**估计工时**: 约40-50小时
**关键路径**: T001 → T002 → T008-T011 → T012-T015 → T020 → T021-T022 → T025 → T027 → T033

**状态**: ✅ 任务列表已生成,可开始执行
**下一步**: 执行 `/implement` 命令或手动按顺序执行任务

---

*基于 Constitution v1.0.0 - 见 `.specify/memory/constitution.md`*
*生成日期: 2025-09-30*
*特性分支: 001-tushare-typescript-sdk*