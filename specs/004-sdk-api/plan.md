# Implementation Plan: SDK 文档站与 API 测试平台

**Branch**: `004-sdk-api` | **Date**: 2025-09-30 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/004-sdk-api/spec.md`

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

**IMPORTANT**: The /plan command STOPS at step 8. Phases 2-4 are executed by other commands:
- Phase 2: /tasks command creates tasks.md
- Phase 3-4: Implementation execution (manual or via tools)

## Summary

构建基于 VitePress 的 SDK 文档站,提供自动生成的 API 文档和在线测试功能。用户可以浏览按功能分类的 API 接口文档,直接在浏览器中使用 SDK 测试接口,查看返回结果,管理 API token 和请求历史记录(存储在 localStorage)。

核心功能:
1. 使用 VitePress 搭建文档站,支持 Markdown 编写内容
2. 从 TypeScript 代码自动生成 API 文档基础结构
3. 提供交互式 API 测试面板(集成打包后的 SDK)
4. Token 管理和请求历史记录(localStorage 存储)
5. 按功能分类的导航和搜索功能

## Technical Context

**Language/Version**: TypeScript 5.0+, Node.js 20.x+
**Primary Dependencies**: VitePress (文档站), TypeDoc (API 文档生成), Vite (构建工具)
**Storage**: 浏览器 localStorage (token 和历史记录)
**Testing**: Vitest (单元测试和组件测试)
**Target Platform**: 静态站点,支持现代浏览器(ES2020+)
**Project Type**: 文档站(单独项目),与主 SDK 仓库在同一 monorepo 或独立仓库
**Performance Goals**: 首屏加载 < 3s, API 测试响应展示 < 100ms(不含网络)
**Constraints**:
  - 静态站点,无后端服务
  - SDK 必须支持浏览器环境
  - localStorage 限制(通常 5-10MB)
  - 必须处理 CORS(Tushare API 支持跨域)
**Scale/Scope**:
  - 约 50-100 个 API 接口文档
  - 历史记录保存最近 50 条
  - 支持搜索和分类浏览

**用户提供的实现细节**: 使用 vitepress 进行文档站的搭建

## Constitution Check
*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

基于宪章文件(`/memory/constitution.md`)的检查:

### I. 测试优先 (Test-First) - 不可妥协
- ✅ **符合**: 将为文档生成工具、API 测试组件编写单元测试
- ✅ **符合**: 为 localStorage 管理、历史记录功能编写测试
- ⚠️ **部分符合**: VitePress 主题和布局的测试覆盖较难实现,可接受手动测试

### II. 注释清晰明了 (Clear Documentation)
- ✅ **符合**: 文档生成工具需要完整的 JSDoc/TSDoc 注释
- ✅ **符合**: API 测试组件需要清晰的使用说明

### III. 代码结构清晰 (Clean Code Structure)
- ✅ **符合**: 文档站独立目录结构
```
docs/                    # VitePress 文档站
├── .vitepress/         # VitePress 配置
│   ├── config.ts       # 站点配置
│   ├── theme/          # 自定义主题
│   └── components/     # Vue 组件(API 测试面板)
├── api/                # 自动生成的 API 文档
├── guide/              # 手动编写的指南
└── examples/           # 示例代码

tools/                   # 文档生成工具
├── generate-docs.ts    # 主生成器
├── extract-api.ts      # API 信息提取
└── templates/          # 文档模板
```

### IV. 类型安全 (Type Safety)
- ✅ **符合**: 使用 TypeScript strict 模式
- ✅ **符合**: 所有组件和工具函数都有类型定义

### V. 契约测试 (Contract Testing)
- ✅ **符合**: API 测试面板的测试需验证与 SDK 的集成
- ✅ **符合**: localStorage 存储格式需要契约测试

**初始评估**: ✅ PASS - 无重大宪章违规

## Project Structure

### Documentation (this feature)
```
specs/004-sdk-api/
├── plan.md              # 本文件 (/plan 命令输出)
├── research.md          # Phase 0 输出 (/plan 命令)
├── data-model.md        # Phase 1 输出 (/plan 命令)
├── quickstart.md        # Phase 1 输出 (/plan 命令)
├── contracts/           # Phase 1 输出 (/plan 命令)
└── tasks.md             # Phase 2 输出 (/tasks 命令 - 不由 /plan 创建)
```

### Source Code (repository root)

```
# 文档站项目(新增)
docs/
├── .vitepress/
│   ├── config.ts                # VitePress 配置
│   ├── theme/
│   │   ├── index.ts            # 主题入口
│   │   ├── Layout.vue          # 布局组件
│   │   └── components/
│   │       ├── ApiTester.vue   # API 测试面板
│   │       ├── TokenManager.vue # Token 管理
│   │       └── RequestHistory.vue # 请求历史
│   └── composables/
│       ├── useLocalStorage.ts  # localStorage 封装
│       ├── useSdkClient.ts     # SDK 客户端实例
│       └── useRequestHistory.ts # 历史记录管理
├── api/                         # 自动生成的 API 文档目录
│   └── (generated files)
├── guide/                       # 手动编写的指南
│   ├── getting-started.md
│   ├── authentication.md
│   └── api-reference.md
├── examples/                    # 示例代码
│   └── basic-usage.md
└── public/                      # 静态资源
    └── sdk/
        └── tushare-sdk.iife.js # 打包的 SDK(IIFE 格式)

# 文档生成工具(新增)
tools/docs-generator/
├── src/
│   ├── generate-docs.ts        # 主生成器
│   ├── extract-api.ts          # 从 TypeScript 提取 API 信息
│   ├── format-markdown.ts      # Markdown 格式化
│   └── templates/
│       ├── api-page.md.hbs     # API 页面模板(Handlebars)
│       └── index.md.hbs        # 索引页模板
└── tests/
    ├── extract-api.test.ts
    └── format-markdown.test.ts

# 主 SDK 项目(已存在,需调整构建配置)
src/
├── core/
├── api/
├── models/
├── utils/
└── index.ts

# 添加浏览器构建配置
tsdown.config.ts                 # 需添加 IIFE 格式输出

tests/
├── contract/
├── integration/
└── unit/
```

**Structure Decision**:
- **文档站**: 独立的 `docs/` 目录,使用 VitePress 构建
- **文档生成工具**: 独立的 `tools/docs-generator/` 目录
- **SDK**: 现有的 `src/` 结构保持不变,但需要添加浏览器构建配置(IIFE 格式)
- 原因: 文档站是独立的发布产物,与 SDK npm 包分离部署

## Phase 0: Outline & Research

### 研究任务

1. **VitePress 配置和最佳实践**
   - 研究 VitePress 的配置选项(主题、插件、构建)
   - 了解如何自定义主题和组件
   - 研究侧边栏导航和搜索功能的配置

2. **TypeDoc vs 自定义文档生成器**
   - 评估 TypeDoc 是否满足需求
   - 研究如何从 TypeScript AST 提取 API 信息
   - 确定文档生成的自动化程度(完全自动 vs 半自动)

3. **SDK 浏览器打包方案**
   - 研究 tsdown 是否支持 IIFE 格式输出
   - 评估其他打包工具(Vite library mode, Rollup)
   - 确定如何处理 Node.js 依赖(如 http)

4. **Vue 3 组件开发(VitePress 主题)**
   - 研究 VitePress 主题开发规范
   - 了解如何在 VitePress 中使用 Vue 组件
   - 研究组件的状态管理(Composition API)

5. **localStorage 最佳实践**
   - 研究存储容量限制和错误处理
   - 确定数据序列化格式(JSON)
   - 研究过期策略和数据迁移

6. **API 文档分类方案**
   - 研究 Tushare API 的分类结构
   - 确定如何从代码中提取分类信息(JSDoc 标签?)
   - 设计导航结构

**输出**: research.md 包含以上所有研究结果和技术决策

## Phase 1: Design & Contracts

### 数据模型 (data-model.md)

基于功能需求的实体设计:

1. **ApiDocEntry** (API 文档条目)
   - `id`: string - 接口唯一标识
   - `name`: string - 接口名称
   - `category`: string - 功能分类
   - `description`: string - 功能描述
   - `parameters`: ApiParameter[] - 参数列表
   - `returns`: ApiReturn - 返回值定义
   - `examples`: CodeExample[] - 示例代码

2. **ApiParameter** (API 参数)
   - `name`: string - 参数名
   - `type`: string - 类型
   - `required`: boolean - 是否必填
   - `description`: string - 参数说明
   - `defaultValue?`: string - 默认值

3. **TokenConfig** (认证配置)
   - `token`: string - API token
   - `lastUpdated`: number - 最后更新时间戳

4. **RequestHistoryEntry** (请求历史记录)
   - `id`: string - 记录 ID
   - `apiName`: string - 接口名称
   - `parameters`: Record<string, any> - 请求参数
   - `timestamp`: number - 时间戳
   - `success`: boolean - 是否成功
   - `responseSummary`: string - 响应摘要(前 100 字符)

5. **TestResult** (测试结果)
   - `statusCode`: number - HTTP 状态码
   - `responseTime`: number - 响应时间(ms)
   - `data`: any - 响应数据
   - `error?`: Error - 错误信息

### API 契约 (contracts/)

#### 1. 文档生成工具契约

**输入**: TypeScript 源代码 + JSDoc 注释
**输出**: Markdown 文件

```typescript
// contracts/docs-generator.contract.ts
interface DocsGeneratorInput {
  sourceFiles: string[];        // TS 源文件路径
  outputDir: string;             // 输出目录
  categorization: {
    [category: string]: string[]; // 分类映射
  };
}

interface GeneratedDocs {
  apiPages: {
    path: string;                // 文件路径
    frontmatter: {
      title: string;
      category: string;
    };
    content: string;             // Markdown 内容
  }[];
  indexPage: {
    path: string;
    content: string;
  };
}
```

#### 2. API 测试组件契约

```typescript
// contracts/api-tester.contract.ts
interface ApiTesterProps {
  apiName: string;
  apiSpec: ApiDocEntry;
}

interface ApiTesterEmits {
  'test-start': void;
  'test-complete': (result: TestResult) => void;
  'test-error': (error: Error) => void;
}
```

#### 3. localStorage 存储契约

```typescript
// contracts/storage.contract.ts
interface StorageSchema {
  'tushare-token': TokenConfig;
  'tushare-history': RequestHistoryEntry[];
}

// 存储键前缀
const STORAGE_PREFIX = 'tushare-sdk-docs:';
```

### 快速开始指南 (quickstart.md)

包含以下验证步骤:
1. 启动文档站开发服务器
2. 访问首页,验证导航和分类显示
3. 打开任意 API 文档页,验证文档内容完整
4. 配置 API token
5. 测试一个简单接口(如获取股票列表)
6. 验证历史记录功能
7. 验证搜索功能

### Agent 上下文更新

将运行 `.specify/scripts/bash/update-agent-context.sh claude` 更新 CLAUDE.md,添加:
- VitePress 文档站技术栈
- Vue 3 组件开发规范
- 文档生成工具使用方法

### 契约测试

将生成以下测试文件(失败状态):

1. `tests/contract/docs-generator.contract.test.ts`
   - 验证文档生成器输入输出格式
   - 验证生成的 Markdown 结构

2. `tests/contract/storage.contract.test.ts`
   - 验证 localStorage 数据格式
   - 验证存储和读取操作

3. `tests/unit/components/ApiTester.test.ts`
   - 验证组件 props 和 emits
   - 验证表单验证逻辑

**输出**: data-model.md, contracts/, quickstart.md, 失败的契约测试, 更新的 CLAUDE.md

## Phase 2: Task Planning Approach
*This section describes what the /tasks command will do - DO NOT execute during /plan*

**Task Generation Strategy**:

从 Phase 1 设计文档生成任务:

1. **环境准备任务** (来自 research.md)
   - 安装 VitePress 和依赖
   - 初始化 VitePress 项目结构
   - 配置 TypeScript 和 Vitest

2. **契约测试任务** (来自 contracts/)
   - 为每个契约创建失败的测试 [P]
   - 文档生成器契约测试
   - 存储契约测试
   - API 测试组件契约测试

3. **数据模型任务** (来自 data-model.md)
   - 创建 TypeScript 类型定义 [P]
   - `ApiDocEntry` 和相关类型
   - `TokenConfig` 类型
   - `RequestHistoryEntry` 类型

4. **文档生成工具任务**
   - 实现 API 提取逻辑(从 TS/JSDoc)
   - 实现 Markdown 生成器
   - 实现分类和导航生成
   - 使契约测试通过

5. **SDK 浏览器构建任务**
   - 配置 tsdown/Vite 生成 IIFE 格式
   - 测试浏览器环境兼容性
   - 优化打包体积

6. **VitePress 主题任务**
   - 创建自定义主题布局
   - 实现 API 测试面板组件
   - 实现 Token 管理组件
   - 实现历史记录组件
   - 实现 localStorage composables

7. **集成测试任务** (来自 user stories)
   - 端到端测试:首页导航
   - 端到端测试:API 文档查看
   - 端到端测试:接口测试流程
   - 端到端测试:历史记录管理

8. **文档内容任务**
   - 运行文档生成器生成 API 文档
   - 编写快速开始指南
   - 编写认证说明
   - 编写示例代码

**Ordering Strategy**:
- TDD 顺序: 契约测试 → 数据模型 → 实现 → 集成测试
- 依赖顺序:
  1. 环境准备
  2. 数据模型和契约测试 [可并行]
  3. 文档生成工具和 SDK 浏览器构建 [可并行]
  4. VitePress 主题组件
  5. 集成测试
  6. 文档内容生成

**Estimated Output**: 约 30-35 个任务,包含:
- 5 个环境准备任务
- 8 个契约测试任务 [P]
- 5 个数据模型任务 [P]
- 6 个实现任务
- 4 个集成测试任务
- 4 个文档内容任务

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
| 手动测试主题布局 | VitePress 主题的视觉效果难以自动化测试 | E2E 测试成本过高,手动测试对于布局验证更高效 |

## Progress Tracking
*This checklist is updated during execution flow*

**Phase Status**:
- [x] Phase 0: Research complete (/plan command)
- [x] Phase 1: Design complete (/plan command)
- [x] Phase 2: Task planning complete (/plan command - describe approach only)
- [x] Phase 3: Tasks generated (/tasks command) - 35 tasks created
- [ ] Phase 4: Implementation complete
- [ ] Phase 5: Validation passed

**Gate Status**:
- [x] Initial Constitution Check: PASS
- [x] Post-Design Constitution Check: PASS
- [x] All NEEDS CLARIFICATION resolved (handled in /clarify phase)
- [x] Complexity deviations documented

**Generated Artifacts**:
- [x] research.md - 技术研究和决策记录
- [x] data-model.md - 数据模型定义
- [x] contracts/ - 契约定义
  - [x] docs-generator.contract.ts
  - [x] storage.contract.ts
  - [x] api-tester.contract.ts
- [x] quickstart.md - 快速开始验证指南
- [x] CLAUDE.md - 更新的代理上下文

---
*Based on Constitution v1.0.0 - See `.specify/memory/constitution.md`*