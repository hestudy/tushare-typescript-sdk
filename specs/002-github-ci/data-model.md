# Data Model: GitHub CI 集成

**Feature**: 002-github-ci
**Date**: 2025-09-30
**Status**: N/A

## Note
此特性为 CI/CD 基础设施配置,不涉及业务数据模型。本文档保留用于流程完整性,但无实际数据模型内容。

## CI/CD 配置实体

虽然不是传统的数据模型,但 CI/CD 配置有以下关键实体:

### 1. GitHub Actions 工作流 (Workflow)
**描述**: YAML 格式的工作流定义文件

**属性**:
- `name`: 工作流名称(字符串)
- `on`: 触发条件(对象,包含事件类型和过滤器)
- `jobs`: 任务定义(对象,包含一个或多个 job)
- `permissions`: 权限设置(对象,可选)

**验证规则**:
- 文件必须是有效的 YAML 格式
- 必须包含 `name` 和 `on` 字段
- 至少定义一个 job

### 2. GitHub Actions 任务 (Job)
**描述**: 工作流中的独立执行单元

**属性**:
- `runs-on`: 运行环境(字符串,如 ubuntu-latest)
- `strategy`: 执行策略(对象,可选,支持 matrix)
- `steps`: 执行步骤(数组)
- `needs`: 依赖的其他 job(数组,可选)

**验证规则**:
- `runs-on` 必须是有效的 GitHub runner 标签
- `steps` 数组不能为空
- 每个 step 必须有 `uses` 或 `run` 其中之一

### 3. GitHub Actions 步骤 (Step)
**描述**: Job 中的单个操作

**属性**:
- `name`: 步骤名称(字符串,可选但推荐)
- `uses`: 使用的 action(字符串,与 run 互斥)
- `run`: 执行的命令(字符串,与 uses 互斥)
- `with`: action 的输入参数(对象,可选)
- `env`: 环境变量(对象,可选)

**验证规则**:
- 必须指定 `uses` 或 `run` 其中之一
- 使用 `uses` 时,action 必须存在且版本有效

### 4. GitHub Secret
**描述**: 存储在 GitHub 仓库中的敏感信息

**属性**:
- `name`: Secret 名称(字符串,如 NPM_TOKEN)
- `value`: Secret 值(字符串,加密存储)

**验证规则**:
- 名称必须为大写字母和下划线
- 不能在日志中泄露 secret 值

## 状态转换

### CI 工作流执行状态
```
待触发 (Idle)
  ↓ (push/PR 事件)
排队中 (Queued)
  ↓
执行中 (In Progress)
  ↓ (所有 job 完成)
成功 (Success) / 失败 (Failure) / 取消 (Cancelled)
```

### 发布工作流执行状态
```
待触发 (Idle)
  ↓ (标签推送)
排队中 (Queued)
  ↓
执行中 (In Progress)
  ↓ (构建和发布完成)
成功 (Published) / 失败 (Failed)
```

## 关系图

```
Repository
  ├── .github/workflows/
  │   ├── ci.yml (Workflow)
  │   │   └── test-and-build (Job)
  │   │       ├── Setup Node.js (Step)
  │   │       ├── Install Dependencies (Step)
  │   │       ├── Run Tests (Step)
  │   │       └── Build (Step)
  │   └── publish.yml (Workflow)
  │       └── publish-npm (Job)
  │           ├── Setup Node.js (Step)
  │           ├── Install Dependencies (Step)
  │           ├── Build (Step)
  │           └── Publish to npm (Step)
  └── Secrets
      └── NPM_TOKEN (Secret)
```

---
**Note**: 本数据模型描述配置结构而非运行时数据。实际执行由 GitHub Actions 平台管理。