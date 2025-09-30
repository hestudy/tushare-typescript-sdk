<!--
Sync Impact Report:
Version: 1.0.0 (initial creation)
Modified principles: N/A (initial constitution)
Added sections: All sections (initial creation)
Removed sections: N/A
Templates status:
  ✅ plan-template.md - reviewed, Constitution Check section aligns
  ✅ spec-template.md - reviewed, requirements alignment confirmed
  ✅ tasks-template.md - reviewed, TDD ordering matches test-first principle
Follow-up TODOs: None
-->

# Tushare TypeScript SDK Constitution

## Core Principles

### I. 测试优先 (Test-First) - 不可妥协

**规则**:
- 必须严格遵循 TDD (测试驱动开发) 流程:编写测试 → 用户审核 → 测试失败 → 然后实现
- 红-绿-重构循环必须严格执行
- 任何新功能或 bug 修复必须先有失败的测试用例
- 禁止在没有测试覆盖的情况下合并代码

**理由**: 测试优先确保代码质量、可维护性和回归保护。它强制开发者在编码前思考 API 设计和边界条件,减少生产环境问题。

### II. 注释清晰明了 (Clear Documentation)

**规则**:
- 所有公共 API 必须包含 JSDoc/TSDoc 注释,说明:
  - 函数/方法的用途
  - 参数类型和含义
  - 返回值说明
  - 可能抛出的异常
  - 使用示例(对于复杂 API)
- 复杂业务逻辑必须有行内注释说明设计意图
- 类型定义必须有清晰的语义说明
- 注释必须与代码保持同步,过时注释视为技术债务

**理由**: 清晰的注释降低维护成本、提高协作效率、帮助新成员快速上手。对于 SDK 项目,良好的文档是用户体验的核心部分。

### III. 代码结构清晰 (Clean Code Structure)

**规则**:
- 遵循单一职责原则:每个模块/类/函数只做一件事
- 保持浅层次的嵌套(最多 3 层)
- 函数长度不超过 50 行(复杂算法除外,需注释说明)
- 文件按功能模块组织,避免巨型文件(>500 行需拆分)
- 使用清晰的命名:变量、函数、类名应自解释
- 目录结构遵循约定:
  ```
  src/
  ├── core/          # 核心功能
  ├── api/           # API 接口
  ├── models/        # 数据模型
  ├── utils/         # 工具函数
  └── types/         # TypeScript 类型定义

  tests/
  ├── unit/          # 单元测试
  ├── integration/   # 集成测试
  └── contract/      # 契约测试
  ```

**理由**: 清晰的结构降低认知负担,提高代码可读性和可维护性。模块化设计支持并行开发和独立测试。

### IV. 类型安全 (Type Safety)

**规则**:
- TypeScript 严格模式必须启用(`strict: true`)
- 禁止使用 `any` 类型(特殊情况需注释说明)
- 优先使用接口和类型别名定义数据结构
- API 响应数据必须有明确的类型定义
- 使用泛型提升代码复用性

**理由**: TypeScript 的类型系统可以在编译时捕获大量错误,减少运行时问题。对于 SDK,类型定义提供了最好的 IDE 支持和开发体验。

### V. 契约测试 (Contract Testing)

**规则**:
- 每个与 Tushare API 的交互点必须有契约测试
- 契约测试验证:
  - 请求格式正确性
  - 响应数据结构匹配
  - 错误处理覆盖
- API 变更必须先更新契约测试
- 使用 mock 数据避免频繁调用真实 API

**理由**: 作为 SDK 项目,与外部 API 的交互是核心功能。契约测试确保 SDK 与 Tushare API 的兼容性,在 API 变更时快速发现问题。

## 质量标准

### 测试覆盖率
- 单元测试覆盖率目标: ≥ 90%
- 集成测试必须覆盖所有主要用户场景
- 契约测试必须覆盖所有 API 端点

### 性能要求
- API 调用响应时间: < 5 秒(包含网络延迟)
- 内存占用: 合理的资源使用,避免内存泄漏
- 包体积: 保持最小依赖,压缩后 < 100KB

### 代码质量
- 使用 ESLint 和 Prettier 保持代码风格一致
- 代码审查必须通过才能合并
- 禁止提交包含 linting 错误的代码

## 开发流程

### 功能开发流程
1. 编写功能规格说明(`spec.md`)
2. 设计 API 契约和数据模型
3. 编写失败的测试用例
4. 实现功能使测试通过
5. 重构优化代码结构
6. 更新文档和示例

### 代码审查要求
- 所有 PR 必须经过代码审查
- 审查检查点:
  - [ ] 测试优先原则遵守
  - [ ] 注释完整清晰
  - [ ] 代码结构合理
  - [ ] 类型安全
  - [ ] 测试覆盖充分
- 必须通过所有自动化检查(测试、linting、类型检查)

### 版本控制
- 使用语义化版本: MAJOR.MINOR.PATCH
  - MAJOR: 破坏性 API 变更
  - MINOR: 向后兼容的功能新增
  - PATCH: 向后兼容的 bug 修复
- 每次发版必须更新 CHANGELOG.md
- 标记弃用功能并提供迁移指南

## Governance

### 宪章权威性
本宪章优先于其他所有开发实践文档。任何与宪章冲突的做法必须修正或获得明确的例外批准。

### 修订流程
- 宪章修订需要团队讨论和一致同意
- 修订必须记录:
  - 变更内容和原因
  - 影响范围评估
  - 迁移计划(如适用)
- 重大修订(MAJOR 版本)需要更新所有依赖文档和模板

### 合规性审查
- 每个 PR 审查必须验证宪章合规性
- 例外情况必须在代码中明确标注并说明理由
- 定期审查现有代码的合规性(每季度)

### 复杂度控制
- 新增复杂度(如新依赖、新架构层)必须提供充分理由
- 优先选择简单方案,遵循 YAGNI (You Aren't Gonna Need It) 原则
- 使用 `.specify/templates/plan-template.md` 中的复杂度跟踪表评估必要性

**Version**: 1.0.0 | **Ratified**: 2025-09-30 | **Last Amended**: 2025-09-30