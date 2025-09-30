# Tasks: SDK 文档站与 API 测试平台

**Feature**: 004-sdk-api
**Input**: Design documents from `/specs/004-sdk-api/`
**Prerequisites**: plan.md, research.md, data-model.md, contracts/, quickstart.md

## Execution Flow (main)
```
1. Load plan.md from feature directory
   → Extract: VitePress, TypeDoc, Vue 3, tsdown, Vitest
2. Load design documents:
   → data-model.md: 11 entities extracted
   → contracts/: 3 contract files found
   → research.md: Technical decisions loaded
   → quickstart.md: Validation scenarios extracted
3. Generate tasks by category:
   → Setup: VitePress, TypeDoc, dependencies
   → Tests: 3 contract tests, storage tests, component tests
   → Core: Types, composables, components, docs generator
   → Integration: SDK build, docs generation, VitePress theme
   → Polish: Manual testing, performance validation
4. Apply TDD ordering: Tests → Implementation
5. Mark [P] for independent files
6. Total: 35 tasks generated
```

---

## Format: `[ID] [P?] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- Tasks are numbered sequentially T001-T035
- File paths are absolute where possible

---

## Phase 3.1: 环境准备与配置

### T001: 创建文档站项目结构
**Description**: 创建 VitePress 文档站的目录结构
**Files**:
- `docs/.vitepress/config.ts`
- `docs/.vitepress/theme/index.ts`
- `docs/index.md`
- `docs/guide/` (目录)
- `docs/api/` (目录)
- `docs/public/` (目录)

**Actions**:
1. 创建 `docs` 目录和子目录结构
2. 创建占位符文件(空配置)
3. 添加 `.gitignore` 条目

**Validation**: 所有目录和占位符文件存在

---

### T002: 安装 VitePress 和相关依赖
**Description**: 安装 VitePress, TypeDoc, Vue 相关依赖
**Files**:
- `package.json` (更新 devDependencies)
- `package-lock.json` (生成)

**Actions**:
```bash
npm install -D vitepress@^1.6.4
npm install -D typedoc@latest typedoc-plugin-markdown@latest
npm install -D @vitejs/plugin-vue@latest
npm install -D vue@^3.4.0
```

**Validation**: `node_modules` 包含所有依赖,`package.json` 已更新

---

### T003 [P]: 创建文档生成工具项目结构
**Description**: 创建文档生成工具的目录和配置
**Files**:
- `tools/docs-generator/src/` (目录)
- `tools/docs-generator/tests/` (目录)
- `tools/docs-generator/templates/` (目录)
- `tools/docs-generator/tsconfig.json`
- `tools/docs-generator/package.json`

**Actions**:
1. 创建目录结构
2. 配置独立的 `tsconfig.json`
3. 可选:添加独立的 `package.json` (或共享根 package.json)

**Validation**: 目录结构创建完成

---

### T004: 配置 TypeDoc
**Description**: 创建 TypeDoc 配置文件
**Files**:
- `/Users/hestudy/Documents/project/tushare-typescript-sdk/typedoc.json`

**Actions**:
1. 创建 `typedoc.json` 配置文件
2. 配置:
   - `entryPoints`: `["src/index.ts"]`
   - `out`: `"docs/api-temp"` (临时输出,后续由生成器处理)
   - `plugin`: `["typedoc-plugin-markdown"]`
   - `categorizeByGroup`: `true`
   - 分类配置: Market Data, Financial Data, Basic Data

**Validation**: 运行 `npx typedoc` 无错误

---

### T005 [P]: 配置 VitePress 基础配置
**Description**: 配置 VitePress 站点基础设置
**Files**:
- `docs/.vitepress/config.ts`

**Actions**:
1. 定义站点元数据(title, description)
2. 配置主题(导航栏、侧边栏骨架)
3. 配置本地搜索
4. 配置 Markdown 选项

**Validation**: 运行 `npm run docs:dev` 可启动(即使页面为空)

---

### T006: 配置 tsdown 生成 IIFE 格式
**Description**: 修改 tsdown 配置,添加浏览器 IIFE 格式输出
**Files**:
- `/Users/hestudy/Documents/project/tushare-typescript-sdk/tsdown.config.ts`

**Actions**:
1. 在 `format` 数组中添加 `'iife'`
2. 添加 `globalName: 'Tushare'`
3. 添加 `platform: 'browser'`

**Example**:
```typescript
export default defineConfig({
  format: ['esm', 'cjs', 'iife'],
  globalName: 'Tushare',
  platform: 'browser'
})
```

**Validation**: 运行 `npm run build`,验证 `dist/index.iife.js` 生成

---

### T007 [P]: 添加 npm 脚本
**Description**: 在 `package.json` 中添加文档相关脚本
**Files**:
- `/Users/hestudy/Documents/project/tushare-typescript-sdk/package.json`

**Actions**:
添加以下脚本:
```json
{
  "scripts": {
    "docs:dev": "vitepress dev docs",
    "docs:build": "vitepress build docs",
    "docs:preview": "vitepress preview docs",
    "docs:generate": "tsx tools/docs-generator/src/generate-docs.ts"
  }
}
```

**Validation**: 所有脚本可执行(即使功能未完成)

---

## Phase 3.2: 测试优先(TDD) ⚠️ 必须在实现前完成

### T008 [P]: 契约测试 - 文档生成器
**Description**: 为文档生成器编写契约测试(必须失败)
**Files**:
- `tests/contract/docs-generator.contract.test.ts`

**Actions**:
1. 导入契约类型: `DocsGeneratorInput`, `GeneratedDocs`
2. 测试用例:
   - ✅ 验证输入格式: `sourceFiles` 数组非空
   - ✅ 验证输出格式: `apiPages` 包含正确的 frontmatter
   - ✅ 验证分类: 每个 API 正确分类
   - ✅ 验证 Markdown 结构: 包含必要的标题和段落

**Validation**: 测试运行失败(功能未实现)

---

### T009 [P]: 契约测试 - localStorage 存储
**Description**: 为 localStorage 存储操作编写契约测试(必须失败)
**Files**:
- `tests/contract/storage.contract.test.ts`

**Actions**:
1. 导入契约类型: `TokenConfig`, `RequestHistoryEntry`, `StorageOperations`
2. 测试用例:
   - ✅ `getToken()` 返回正确格式的 `TokenConfig` 或 `null`
   - ✅ `setToken()` 正确序列化并存储
   - ✅ `addHistoryEntry()` 自动生成 `id` 和 `timestamp`
   - ✅ 历史记录限制在 50 条,自动清理最旧记录
   - ✅ 错误处理: 存储满时的行为

**Validation**: 测试运行失败(功能未实现)

---

### T010 [P]: 契约测试 - API 测试组件
**Description**: 为 ApiTester 组件编写契约测试(必须失败)
**Files**:
- `tests/unit/components/ApiTester.test.ts`

**Actions**:
1. 使用 Vitest + @vue/test-utils
2. 测试用例:
   - ✅ 组件接受正确的 props (`apiName`, `apiSpec`)
   - ✅ 渲染参数输入表单(基于 `apiSpec.parameters`)
   - ✅ 必填参数显示 `*` 标记
   - ✅ 点击"发送请求"触发 `test-start` 事件
   - ✅ 成功时触发 `test-complete` 事件
   - ✅ 失败时触发 `test-error` 事件

**Validation**: 测试运行失败(组件未实现)

---

### T011 [P]: 集成测试 - 完整 API 测试流程
**Description**: 端到端测试: Token 配置 → API 调用 → 历史记录
**Files**:
- `tests/integration/api-test-flow.test.ts`

**Actions**:
1. 模拟场景(基于 quickstart.md 步骤 7-9):
   - ✅ 用户配置 token
   - ✅ 用户填写参数并发送请求
   - ✅ 显示测试结果
   - ✅ 历史记录中出现该请求
   - ✅ 可从历史记录重放请求

2. 使用 MSW (Mock Service Worker) 模拟 Tushare API 响应

**Validation**: 测试运行失败(功能未实现)

---

### T012 [P]: 集成测试 - 文档生成和 VitePress 集成
**Description**: 测试文档生成器输出与 VitePress 的集成
**Files**:
- `tests/integration/docs-generation.test.ts`

**Actions**:
1. 测试场景:
   - ✅ 运行文档生成器
   - ✅ 验证 `docs/api/` 下生成 Markdown 文件
   - ✅ Frontmatter 包含 `api` 字段(用于 ApiTester)
   - ✅ VitePress 可正确解析 frontmatter
   - ✅ 侧边栏自动生成正确的分类结构

**Validation**: 测试运行失败(功能未实现)

---

## Phase 3.3: 核心实现(仅在测试失败后)

### 3.3.1: 数据模型和类型定义

### T013 [P]: 创建 API 文档相关类型
**Description**: 创建 `ApiDocEntry`, `ApiParameter`, `ApiReturn` 等类型
**Files**:
- `docs/.vitepress/theme/types/api-doc.ts`

**Actions**:
1. 从 `data-model.md` 复制类型定义
2. 导出所有接口:
   - `ApiDocEntry`
   - `ApiParameter`
   - `ApiReturn`
   - `ReturnField`
   - `CodeExample`
   - `RelatedLink`
   - `DeprecationInfo`

**Validation**: TypeScript 编译通过,无类型错误

---

### T014 [P]: 创建认证相关类型
**Description**: 创建 `TokenConfig`, `AuthStatus` 类型
**Files**:
- `docs/.vitepress/theme/types/auth.ts`

**Actions**:
1. 定义 `TokenConfig` 接口
2. 定义 `AuthStatus` 接口

**Validation**: TypeScript 编译通过

---

### T015 [P]: 创建历史记录相关类型
**Description**: 创建 `RequestHistoryEntry`, `RequestHistory` 类型
**Files**:
- `docs/.vitepress/theme/types/history.ts`

**Actions**:
1. 定义 `RequestHistoryEntry` 接口
2. 定义 `RequestHistory` 类型别名

**Validation**: TypeScript 编译通过

---

### T016 [P]: 创建测试结果相关类型
**Description**: 创建 `TestResult`, `TestError`, `TestMetadata` 类型
**Files**:
- `docs/.vitepress/theme/types/test-result.ts`

**Actions**:
1. 定义 `TestResult` 接口
2. 定义 `TestError` 接口
3. 定义 `TestMetadata` 接口

**Validation**: TypeScript 编译通过

---

### T017 [P]: 创建存储契约常量
**Description**: 创建 localStorage 存储键常量
**Files**:
- `docs/.vitepress/theme/types/storage.ts`

**Actions**:
1. 定义 `STORAGE_PREFIX` 常量
2. 定义 `STORAGE_KEYS` 对象
3. 定义 `StorageSchema` 接口

**Validation**: TypeScript 编译通过

---

### T018: 创建类型导出索引
**Description**: 创建统一的类型导出文件
**Files**:
- `docs/.vitepress/theme/types/index.ts`

**Actions**:
导出所有类型:
```typescript
export * from './api-doc'
export * from './auth'
export * from './history'
export * from './test-result'
export * from './storage'
```

**Validation**: 可从单一入口导入所有类型

---

### 3.3.2: Composables 实现

### T019 [P]: 实现 useLocalStorage composable
**Description**: 实现 localStorage 封装 composable
**Files**:
- `docs/.vitepress/theme/composables/useLocalStorage.ts`

**Actions**:
1. 实现 `useLocalStorage<T>()` 函数
2. 功能:
   - 返回响应式 `Ref<T>`
   - 自动 JSON 序列化/反序列化
   - 错误处理(存储满、数据损坏)
   - `set()`, `remove()`, `reload()` 方法

**Validation**: T009 契约测试中相关测试通过

---

### T020: 实现 useSdkClient composable
**Description**: 实现 SDK 客户端单例管理
**Files**:
- `docs/.vitepress/theme/composables/useSdkClient.ts`

**Actions**:
1. 导入打包的 SDK (通过 `<script>` 标签加载 IIFE)
2. 实现单例模式
3. 功能:
   - `client`: ComputedRef<TushareClient | null>
   - `setToken()`: 设置 token 并重新创建客户端
   - `clearToken()`: 清除 token
   - `isReady`: Ref<boolean>
   - `callApi()`: 调用 API 并返回 `TestResult`

**Dependencies**: T019 (useLocalStorage)

**Validation**: T011 集成测试中相关测试通过

---

### T021 [P]: 实现 useRequestHistory composable
**Description**: 实现请求历史记录管理
**Files**:
- `docs/.vitepress/theme/composables/useRequestHistory.ts`

**Actions**:
1. 实现历史记录管理逻辑
2. 功能:
   - `history`: Ref<RequestHistory>
   - `addEntry()`: 添加记录,自动生成 ID 和时间戳
   - `clear()`: 清空历史
   - `removeEntry()`: 删除单条记录
   - `getByApiName()`: 按 API 名称过滤
   - 自动限制最大 50 条,删除最旧记录

**Dependencies**: T019 (useLocalStorage)

**Validation**: T009 契约测试中相关测试通过

---

### T022: 创建 Composables 导出索引
**Description**: 创建统一的 composables 导出文件
**Files**:
- `docs/.vitepress/theme/composables/index.ts`

**Actions**:
```typescript
export * from './useLocalStorage'
export * from './useSdkClient'
export * from './useRequestHistory'
```

**Validation**: 可从单一入口导入所有 composables

---

### 3.3.3: Vue 组件实现

### T023: 实现 TokenManager 组件
**Description**: 实现 Token 管理组件
**Files**:
- `docs/.vitepress/theme/components/TokenManager.vue`

**Actions**:
1. 创建 Vue 3 SFC (Composition API)
2. Props: `initialToken?`, `showValidation?`
3. Emits: `token-updated`, `token-cleared`, `validation-complete`
4. 功能:
   - Token 输入框(密码类型,可切换显示/隐藏)
   - 保存按钮
   - 清除按钮
   - 使用 `useLocalStorage` 持久化

**Dependencies**: T019, T014

**Validation**: 组件可渲染,token 保存到 localStorage

---

### T024: 实现 RequestHistory 组件
**Description**: 实现请求历史记录组件
**Files**:
- `docs/.vitepress/theme/components/RequestHistory.vue`

**Actions**:
1. 创建 Vue 3 SFC
2. Props: `maxEntries?`, `showDetails?`
3. Emits: `replay-request`, `clear-history`
4. 功能:
   - 显示历史记录列表(API 名称、时间、状态)
   - 点击记录触发 `replay-request` 事件
   - 清空历史按钮(带确认)
   - 使用 `useRequestHistory`

**Dependencies**: T021, T015

**Validation**: 组件可渲染,历史记录正确显示

---

### T025: 实现 ApiTester 组件
**Description**: 实现 API 测试面板组件
**Files**:
- `docs/.vitepress/theme/components/ApiTester.vue`

**Actions**:
1. 创建 Vue 3 SFC
2. Props: `apiName`, `apiSpec`
3. Emits: `test-start`, `test-complete`, `test-error`
4. 功能:
   - 动态生成参数输入表单(基于 `apiSpec.parameters`)
   - 必填参数验证
   - 调用 `useSdkClient.callApi()`
   - 显示加载状态
   - 显示测试结果(JSON 格式化)
   - 显示响应时间、状态码
   - 错误处理和友好提示

**Dependencies**: T020, T013, T016

**Validation**: T010 契约测试通过

---

### T026: 创建组件导出索引
**Description**: 创建统一的组件导出文件
**Files**:
- `docs/.vitepress/theme/components/index.ts`

**Actions**:
```typescript
export { default as TokenManager } from './TokenManager.vue'
export { default as RequestHistory } from './RequestHistory.vue'
export { default as ApiTester } from './ApiTester.vue'
```

**Validation**: 可从单一入口导入所有组件

---

### 3.3.4: VitePress 主题集成

### T027: 创建自定义主题入口
**Description**: 创建扩展默认主题的主题入口文件
**Files**:
- `docs/.vitepress/theme/index.ts`

**Actions**:
1. 导入 VitePress 默认主题
2. 导入自定义组件
3. 全局注册组件
4. 导入自定义样式(可选)

**Example**:
```typescript
import DefaultTheme from 'vitepress/theme'
import { ApiTester, TokenManager, RequestHistory } from './components'
import './styles/custom.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('ApiTester', ApiTester)
    app.component('TokenManager', TokenManager)
    app.component('RequestHistory', RequestHistory)
  }
}
```

**Dependencies**: T023, T024, T025

**Validation**: VitePress 可加载自定义主题,组件可用

---

### T028: 创建自定义布局组件(可选)
**Description**: 创建自定义布局,插入 Token 管理器和历史记录
**Files**:
- `docs/.vitepress/theme/Layout.vue`

**Actions**:
1. 创建布局组件,使用 `<DefaultTheme.Layout>`
2. 在 `sidebar-nav-before` 插槽插入 `<TokenManager />`
3. 在 `doc-after` 插槽插入 `<ApiTester>` (基于 frontmatter)

**Optional**: 如果不需要自定义布局,可跳过此任务,直接在 Markdown 中使用组件

**Dependencies**: T027

**Validation**: 布局正确显示,组件位置合理

---

### 3.3.5: 文档生成工具实现

### T029 [P]: 实现 API 信息提取器
**Description**: 从 TypeScript 源代码提取 API 信息
**Files**:
- `tools/docs-generator/src/extract-api.ts`

**Actions**:
1. 使用 TypeDoc API 或 TypeScript Compiler API
2. 提取信息:
   - 类、方法名称
   - JSDoc 注释
   - 参数类型和描述
   - 返回值类型
   - `@category` 标签(用于分类)
3. 返回 `ApiDocEntry[]`

**Validation**: 可从 `src/index.ts` 提取至少 1 个 API

---

### T030: 实现 Markdown 生成器
**Description**: 将 `ApiDocEntry` 转换为 Markdown
**Files**:
- `tools/docs-generator/src/format-markdown.ts`

**Actions**:
1. 生成 Markdown 格式:
   - Frontmatter (title, category, api)
   - 标题和描述
   - 参数表格
   - 返回值说明
   - 代码示例(语法高亮)
2. 使用模板引擎(如 Handlebars)或字符串拼接

**Dependencies**: T029

**Validation**: 生成的 Markdown 符合 VitePress 格式

---

### T031: 实现主文档生成器
**Description**: 实现主生成器逻辑,整合提取和格式化
**Files**:
- `tools/docs-generator/src/generate-docs.ts`

**Actions**:
1. 读取 `DocsGeneratorInput` 配置
2. 调用 `extract-api.ts` 提取 API
3. 应用分类映射
4. 调用 `format-markdown.ts` 生成 Markdown
5. 写入文件到 `docs/api/`
6. 生成索引页面
7. 返回 `GeneratedDocs` 统计信息

**Dependencies**: T029, T030

**Validation**: T008, T012 契约测试通过

---

### T032: 创建 API 分类配置
**Description**: 创建 API 分类映射配置文件
**Files**:
- `tools/docs-generator/categorization.config.ts`

**Actions**:
创建分类映射:
```typescript
export const API_CATEGORIES = {
  'Market Data': ['daily', 'weekly', 'minute'],
  'Financial Data': ['income', 'balance', 'cashflow'],
  'Basic Data': ['stock_basic', 'trade_cal', 'stock_company'],
  // ...根据实际 SDK 接口补充
}
```

**Validation**: 配置导出正确

---

## Phase 3.4: 集成和配置

### T033: 完善 VitePress 侧边栏配置
**Description**: 根据分类生成侧边栏配置
**Files**:
- `docs/.vitepress/config.ts`

**Actions**:
1. 更新侧边栏配置(手动或通过脚本):
   - 按分类组织 API 文档
   - 添加指南页面链接
2. 配置导航栏
3. 配置搜索选项(中文优化)

**Dependencies**: T031 (文档已生成)

**Validation**: 侧边栏正确显示分类和文档链接

---

### T034: 集成 SDK 浏览器构建到文档站
**Description**: 将打包的 SDK 复制到文档站 public 目录
**Files**:
- `docs/public/sdk/tushare-sdk.iife.js` (复制自 `dist/index.iife.js`)

**Actions**:
1. 在 `docs:build` 脚本前添加构建 SDK 步骤
2. 复制 `dist/index.iife.js` 到 `docs/public/sdk/`
3. 在 VitePress 配置或 Layout 中通过 `<script>` 标签加载

**Dependencies**: T006 (SDK IIFE 构建)

**Validation**: 浏览器可访问 `window.Tushare`

---

## Phase 3.5: 优化和验证

### T035 [P]: 运行完整验证流程
**Description**: 执行 quickstart.md 中的完整验证流程
**Files**:
- `/Users/hestudy/Documents/project/tushare-typescript-sdk/specs/004-sdk-api/quickstart.md`

**Actions**:
按照 quickstart.md 步骤 1-15 逐步验证:
1. ✅ 启动文档站开发服务器
2. ✅ 访问首页,验证导航
3. ✅ 查看 API 文档页面
4. ✅ 配置 API Token
5. ✅ 测试一个 API 接口
6. ✅ 验证请求历史功能
7. ✅ 验证搜索功能
8. ✅ 验证响应式布局(移动端)
9. ✅ 性能测试(Lighthouse)

**Validation**: 所有验收标准通过

---

## 依赖关系图

```
Setup (T001-T007)
  ↓
Types (T013-T018) [P]
  ↓
Composables (T019-T022)
  ├→ T019 (useLocalStorage) [P]
  ├→ T020 (useSdkClient) ← T019
  └→ T021 (useRequestHistory) [P] ← T019
  ↓
Components (T023-T026)
  ├→ T023 (TokenManager) [P] ← T019, T014
  ├→ T024 (RequestHistory) [P] ← T021, T015
  └→ T025 (ApiTester) ← T020, T013, T016
  ↓
Theme Integration (T027-T028)
  ↓
Docs Generator (T029-T032)
  ├→ T029 (extract-api) [P]
  ├→ T030 (format-markdown) ← T029
  ├→ T031 (main generator) ← T029, T030
  └→ T032 (categorization config) [P]
  ↓
Integration (T033-T034)
  ↓
Validation (T035)
```

**Tests (T008-T012)** 必须在 **Types (T013-T018)** 之前编写,但可以并行执行

---

## 并行执行示例

### 批次 1: 测试任务(在任何实现前)
```typescript
// 使用 Task 代理并行执行 T008-T012
Task: "Contract test - docs generator in tests/contract/docs-generator.contract.test.ts"
Task: "Contract test - localStorage in tests/contract/storage.contract.test.ts"
Task: "Contract test - ApiTester in tests/unit/components/ApiTester.test.ts"
Task: "Integration test - API test flow in tests/integration/api-test-flow.test.ts"
Task: "Integration test - docs generation in tests/integration/docs-generation.test.ts"
```

### 批次 2: 类型定义
```typescript
// T013-T017 可并行
Task: "Create API doc types in docs/.vitepress/theme/types/api-doc.ts"
Task: "Create auth types in docs/.vitepress/theme/types/auth.ts"
Task: "Create history types in docs/.vitepress/theme/types/history.ts"
Task: "Create test result types in docs/.vitepress/theme/types/test-result.ts"
Task: "Create storage constants in docs/.vitepress/theme/types/storage.ts"
```

### 批次 3: Composables(独立部分)
```typescript
// T019 和 T021 可并行(T020 依赖 T019)
Task: "Implement useLocalStorage in docs/.vitepress/theme/composables/useLocalStorage.ts"
Task: "Implement useRequestHistory in docs/.vitepress/theme/composables/useRequestHistory.ts"
```

### 批次 4: 组件(独立部分)
```typescript
// T023 和 T024 可并行(T025 依赖更多)
Task: "Implement TokenManager in docs/.vitepress/theme/components/TokenManager.vue"
Task: "Implement RequestHistory in docs/.vitepress/theme/components/RequestHistory.vue"
```

---

## 验证检查清单

### 契约覆盖
- [x] `docs-generator.contract.ts` → T008
- [x] `storage.contract.ts` → T009
- [x] `api-tester.contract.ts` → T010

### 数据模型覆盖
- [x] ApiDocEntry → T013
- [x] TokenConfig → T014
- [x] RequestHistoryEntry → T015
- [x] TestResult → T016
- [x] Storage keys → T017

### 用户场景覆盖(来自 quickstart.md)
- [x] 步骤 1-7: 环境准备 → T001-T007
- [x] 步骤 8-10: API 测试 → T025, T020
- [x] 步骤 11-12: 历史记录 → T021, T024
- [x] 步骤 13-14: 搜索和响应式 → T033, T005
- [x] 步骤 15: 完整验证 → T035

### TDD 顺序验证
- [x] 所有测试任务(T008-T012)在实现任务(T013+)之前
- [x] 测试必须先失败,然后实现使其通过

---

## 实施注意事项

1. **TDD 严格执行**:
   - 必须先运行 T008-T012,验证测试失败
   - 禁止在测试失败前开始实现

2. **并行执行**:
   - 标记 `[P]` 的任务可同时执行
   - 未标记的任务可能修改相同文件,必须串行

3. **提交策略**:
   - 每完成一个任务提交一次
   - 测试和实现分开提交

4. **错误处理**:
   - 所有 composables 和组件必须有错误处理
   - localStorage 操作必须捕获 `QuotaExceededError`

5. **性能要求**:
   - 首屏加载 < 3s
   - API 测试响应展示 < 100ms(不含网络)

---

## 预计完成时间

| 阶段 | 任务数 | 预计时间 |
|------|--------|----------|
| Phase 3.1: 环境准备 | 7 | 4-6 小时 |
| Phase 3.2: 测试优先 | 5 | 6-8 小时 |
| Phase 3.3.1: 类型定义 | 6 | 2-3 小时 |
| Phase 3.3.2: Composables | 4 | 6-8 小时 |
| Phase 3.3.3: 组件 | 4 | 12-16 小时 |
| Phase 3.3.4: 主题集成 | 2 | 2-4 小时 |
| Phase 3.3.5: 文档生成器 | 4 | 8-12 小时 |
| Phase 3.4: 集成配置 | 2 | 2-3 小时 |
| Phase 3.5: 验证优化 | 1 | 4-6 小时 |
| **总计** | **35** | **46-66 小时** |

---

**任务列表生成日期**: 2025-09-30
**下一步**: 开始执行 T001,创建文档站项目结构