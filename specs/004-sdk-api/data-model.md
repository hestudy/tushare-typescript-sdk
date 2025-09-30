# Data Model: SDK 文档站与 API 测试平台

**Feature**: 004-sdk-api
**Date**: 2025-09-30
**Status**: Complete

## 概述

本文档定义了文档站和 API 测试平台所需的所有数据模型和类型定义。这些模型将在 VitePress 主题组件和文档生成工具中使用。

---

## 1. API 文档相关模型

### 1.1 ApiDocEntry (API 文档条目)

代表单个 API 接口的完整文档信息。

```typescript
/**
 * API 文档条目
 * 包含一个 API 接口的完整元数据和文档
 */
export interface ApiDocEntry {
  /** 接口唯一标识符(如 'daily', 'stock_basic') */
  id: string

  /** 接口名称(显示用) */
  name: string

  /** 功能分类(如 'Market Data', 'Financial Data') */
  category: string

  /** 接口功能描述 */
  description: string

  /** 参数列表 */
  parameters: ApiParameter[]

  /** 返回值定义 */
  returns: ApiReturn

  /** 代码示例列表 */
  examples: CodeExample[]

  /** 相关链接(可选) */
  relatedLinks?: RelatedLink[]

  /** 备注说明(可选) */
  remarks?: string

  /** 是否需要认证 */
  requiresAuth: boolean

  /** API 版本(可选) */
  version?: string

  /** 废弃信息(如果已废弃) */
  deprecated?: DeprecationInfo
}
```

### 1.2 ApiParameter (API 参数)

定义接口的输入参数。

```typescript
/**
 * API 参数定义
 */
export interface ApiParameter {
  /** 参数名称 */
  name: string

  /** 参数类型(TypeScript 类型字符串) */
  type: string

  /** 是否必填 */
  required: boolean

  /** 参数说明 */
  description: string

  /** 默认值(可选) */
  defaultValue?: string

  /** 取值范围说明(可选) */
  constraints?: string

  /** 示例值 */
  example?: string
}
```

### 1.3 ApiReturn (返回值定义)

定义接口的返回值结构。

```typescript
/**
 * API 返回值定义
 */
export interface ApiReturn {
  /** 返回值类型 */
  type: string

  /** 返回值说明 */
  description: string

  /** 返回字段定义(如果是对象或数组) */
  fields?: ReturnField[]

  /** 示例数据 */
  example?: any
}

/**
 * 返回值字段定义
 */
export interface ReturnField {
  /** 字段名称 */
  name: string

  /** 字段类型 */
  type: string

  /** 字段说明 */
  description: string

  /** 是否可为空 */
  nullable?: boolean
}
```

### 1.4 CodeExample (代码示例)

表示一个代码使用示例。

```typescript
/**
 * 代码示例
 */
export interface CodeExample {
  /** 示例标题 */
  title: string

  /** 示例说明 */
  description?: string

  /** 编程语言(如 'typescript', 'javascript') */
  language: string

  /** 示例代码 */
  code: string

  /** 是否为完整可运行代码 */
  runnable?: boolean
}
```

### 1.5 辅助类型

```typescript
/**
 * 相关链接
 */
export interface RelatedLink {
  /** 链接文本 */
  text: string

  /** 链接 URL */
  url: string
}

/**
 * 废弃信息
 */
export interface DeprecationInfo {
  /** 废弃版本 */
  since: string

  /** 废弃原因 */
  reason: string

  /** 替代方案 */
  alternative?: string
}
```

---

## 2. 认证相关模型

### 2.1 TokenConfig (Token 配置)

存储在 localStorage 中的 token 配置。

```typescript
/**
 * Token 配置
 * 存储在 localStorage: tushare-sdk-docs:token
 */
export interface TokenConfig {
  /** API token 值 */
  token: string

  /** 最后更新时间戳(毫秒) */
  lastUpdated: number

  /** Token 备注(可选,用户自定义) */
  label?: string
}
```

### 2.2 AuthStatus (认证状态)

表示当前的认证状态。

```typescript
/**
 * 认证状态
 */
export interface AuthStatus {
  /** 是否已配置 token */
  hasToken: boolean

  /** 是否已验证 token 有效性 */
  isValidated: boolean

  /** 验证结果(如果已验证) */
  validationResult?: {
    /** 是否有效 */
    valid: boolean

    /** 错误信息(如果验证失败) */
    error?: string

    /** 验证时间 */
    timestamp: number
  }
}
```

---

## 3. 请求历史模型

### 3.1 RequestHistoryEntry (请求历史记录)

单条请求历史记录。

```typescript
/**
 * 请求历史记录条目
 * 存储在 localStorage: tushare-sdk-docs:history
 */
export interface RequestHistoryEntry {
  /** 记录唯一 ID(UUID) */
  id: string

  /** API 接口名称 */
  apiName: string

  /** 请求参数 */
  parameters: Record<string, any>

  /** 请求时间戳(毫秒) */
  timestamp: number

  /** 是否成功 */
  success: boolean

  /** 响应摘要(成功时为数据摘要,失败时为错误信息) */
  responseSummary: string

  /** 响应时间(毫秒) */
  responseTime?: number

  /** HTTP 状态码 */
  statusCode?: number
}
```

### 3.2 RequestHistory (历史记录集合)

历史记录的集合类型。

```typescript
/**
 * 请求历史记录集合
 */
export type RequestHistory = RequestHistoryEntry[]
```

---

## 4. 测试结果模型

### 4.1 TestResult (测试结果)

API 测试的结果。

```typescript
/**
 * API 测试结果
 */
export interface TestResult {
  /** HTTP 状态码 */
  statusCode: number

  /** 响应时间(毫秒) */
  responseTime: number

  /** 响应数据 */
  data: any

  /** 错误信息(如果失败) */
  error?: TestError

  /** 请求元数据 */
  metadata: TestMetadata
}

/**
 * 测试错误
 */
export interface TestError {
  /** 错误名称 */
  name: string

  /** 错误消息 */
  message: string

  /** 错误代码(如果有) */
  code?: string

  /** 错误堆栈(开发环境) */
  stack?: string
}

/**
 * 测试元数据
 */
export interface TestMetadata {
  /** API 名称 */
  apiName: string

  /** 请求参数 */
  parameters: Record<string, any>

  /** 请求开始时间 */
  startTime: number

  /** 请求结束时间 */
  endTime: number

  /** 是否使用了缓存 */
  fromCache?: boolean
}
```

---

## 5. 文档生成工具模型

### 5.1 DocsGeneratorInput (文档生成器输入)

文档生成工具的输入配置。

```typescript
/**
 * 文档生成器输入配置
 */
export interface DocsGeneratorInput {
  /** TypeScript 源文件路径列表 */
  sourceFiles: string[]

  /** 输出目录路径 */
  outputDir: string

  /** API 分类映射 */
  categorization: {
    [category: string]: string[]
  }

  /** 模板目录路径(可选) */
  templateDir?: string

  /** 是否生成索引页 */
  generateIndex?: boolean
}
```

### 5.2 GeneratedDocs (生成的文档)

文档生成器的输出结果。

```typescript
/**
 * 生成的文档输出
 */
export interface GeneratedDocs {
  /** 生成的 API 文档页面 */
  apiPages: GeneratedPage[]

  /** 索引页面 */
  indexPage: GeneratedPage

  /** 生成统计信息 */
  stats: GenerationStats
}

/**
 * 生成的单个页面
 */
export interface GeneratedPage {
  /** 文件路径(相对于输出目录) */
  path: string

  /** Frontmatter 元数据 */
  frontmatter: PageFrontmatter

  /** Markdown 内容 */
  content: string
}

/**
 * 页面 Frontmatter
 */
export interface PageFrontmatter {
  /** 页面标题 */
  title: string

  /** 页面描述 */
  description?: string

  /** 功能分类 */
  category?: string

  /** API 规范(用于 API 测试组件) */
  api?: ApiDocEntry

  /** 是否显示侧边栏 */
  sidebar?: boolean

  /** 页面布局 */
  layout?: string
}

/**
 * 生成统计信息
 */
export interface GenerationStats {
  /** 处理的源文件数 */
  sourceFilesProcessed: number

  /** 生成的页面数 */
  pagesGenerated: number

  /** 提取的 API 数量 */
  apisExtracted: number

  /** 生成耗时(毫秒) */
  duration: number

  /** 错误列表 */
  errors: GenerationError[]
}

/**
 * 生成错误
 */
export interface GenerationError {
  /** 错误文件 */
  file: string

  /** 错误消息 */
  message: string

  /** 错误行号(可选) */
  line?: number
}
```

---

## 6. 组件 Props/Emits 类型

### 6.1 ApiTester 组件

```typescript
/**
 * ApiTester 组件 Props
 */
export interface ApiTesterProps {
  /** API 接口名称 */
  apiName: string

  /** API 规范定义 */
  apiSpec: ApiDocEntry
}

/**
 * ApiTester 组件 Emits
 */
export interface ApiTesterEmits {
  /** 测试开始 */
  'test-start': () => void

  /** 测试完成 */
  'test-complete': (result: TestResult) => void

  /** 测试错误 */
  'test-error': (error: TestError) => void
}
```

### 6.2 TokenManager 组件

```typescript
/**
 * TokenManager 组件 Props
 */
export interface TokenManagerProps {
  /** 初始 token(可选) */
  initialToken?: string

  /** 是否显示验证按钮 */
  showValidation?: boolean
}

/**
 * TokenManager 组件 Emits
 */
export interface TokenManagerEmits {
  /** Token 更新 */
  'token-updated': (token: string) => void

  /** Token 清除 */
  'token-cleared': () => void

  /** Token 验证结果 */
  'validation-complete': (result: AuthStatus['validationResult']) => void
}
```

### 6.3 RequestHistory 组件

```typescript
/**
 * RequestHistory 组件 Props
 */
export interface RequestHistoryProps {
  /** 最大显示记录数 */
  maxEntries?: number

  /** 是否显示详细信息 */
  showDetails?: boolean
}

/**
 * RequestHistory 组件 Emits
 */
export interface RequestHistoryEmits {
  /** 重放请求 */
  'replay-request': (entry: RequestHistoryEntry) => void

  /** 清空历史 */
  'clear-history': () => void
}
```

---

## 7. Composables 类型定义

### 7.1 useLocalStorage

```typescript
/**
 * useLocalStorage 返回类型
 */
export interface UseLocalStorageReturn<T> {
  /** 响应式值 */
  value: Ref<T>

  /** 设置值 */
  set: (val: T) => void

  /** 移除值 */
  remove: () => void

  /** 重新加载值(从 localStorage) */
  reload: () => void
}
```

### 7.2 useSdkClient

```typescript
/**
 * useSdkClient 返回类型
 */
export interface UseSdkClientReturn {
  /** SDK 客户端实例(计算属性) */
  client: ComputedRef<TushareClient | null>

  /** 设置 token */
  setToken: (token: string) => void

  /** 清除 token */
  clearToken: () => void

  /** 客户端是否就绪 */
  isReady: Ref<boolean>

  /** 调用 API */
  callApi: <T>(
    apiName: string,
    params: Record<string, any>
  ) => Promise<TestResult>
}
```

### 7.3 useRequestHistory

```typescript
/**
 * useRequestHistory 返回类型
 */
export interface UseRequestHistoryReturn {
  /** 历史记录列表(响应式) */
  history: Ref<RequestHistory>

  /** 添加记录 */
  addEntry: (entry: Omit<RequestHistoryEntry, 'id' | 'timestamp'>) => void

  /** 清空历史 */
  clear: () => void

  /** 删除单条记录 */
  removeEntry: (id: string) => void

  /** 获取指定 API 的历史 */
  getByApiName: (apiName: string) => RequestHistoryEntry[]
}
```

---

## 8. localStorage 存储格式

### 8.1 存储键定义

```typescript
/**
 * localStorage 存储键
 */
export const STORAGE_KEYS = {
  /** Token 配置 */
  TOKEN: 'tushare-sdk-docs:token',

  /** 请求历史 */
  HISTORY: 'tushare-sdk-docs:history',

  /** 用户偏好设置(可选扩展) */
  PREFERENCES: 'tushare-sdk-docs:preferences'
} as const
```

### 8.2 存储架构

```typescript
/**
 * localStorage 存储架构定义
 */
export interface StorageSchema {
  [STORAGE_KEYS.TOKEN]: TokenConfig

  [STORAGE_KEYS.HISTORY]: RequestHistory

  [STORAGE_KEYS.PREFERENCES]?: UserPreferences
}

/**
 * 用户偏好设置(可选)
 */
export interface UserPreferences {
  /** 主题(亮色/暗色) */
  theme?: 'light' | 'dark'

  /** 默认折叠侧边栏分类 */
  collapsedCategories?: string[]

  /** 最后访问的页面 */
  lastVisitedPage?: string
}
```

---

## 9. 验证和转换

### 9.1 参数验证

```typescript
/**
 * 参数验证结果
 */
export interface ValidationResult {
  /** 是否有效 */
  valid: boolean

  /** 验证错误列表 */
  errors: ValidationError[]
}

/**
 * 单个验证错误
 */
export interface ValidationError {
  /** 参数名称 */
  field: string

  /** 错误类型 */
  type: 'required' | 'type' | 'format' | 'constraint'

  /** 错误消息 */
  message: string
}
```

### 9.2 数据转换

```typescript
/**
 * API 参数值转换器
 */
export type ParamConverter = (value: any, param: ApiParameter) => any

/**
 * 响应数据格式化器
 */
export type ResponseFormatter = (data: any) => string
```

---

## 10. 数据流说明

### 10.1 API 测试流程

```
用户输入参数
    ↓
参数验证 (ValidationResult)
    ↓
调用 SDK (useSdkClient.callApi)
    ↓
返回结果 (TestResult)
    ↓
保存历史 (useRequestHistory.addEntry)
    ↓
显示结果 (ApiTester 组件)
```

### 10.2 文档生成流程

```
TypeScript 源代码
    ↓
TypeDoc 提取 (或自定义提取器)
    ↓
转换为 ApiDocEntry
    ↓
应用分类 (DocsGeneratorInput.categorization)
    ↓
生成 Markdown (GeneratedPage)
    ↓
输出文件
```

---

## 11. 类型导出索引

所有类型定义应集中导出:

```typescript
// types/index.ts
export type * from './api-doc'
export type * from './auth'
export type * from './history'
export type * from './test-result'
export type * from './docs-generator'
export type * from './components'
export type * from './composables'
export type * from './storage'
```

---

## 附录: 数据示例

### ApiDocEntry 示例

```json
{
  "id": "daily",
  "name": "日线行情",
  "category": "Market Data",
  "description": "获取股票日线行情数据,包括开盘价、收盘价、最高价、最低价等",
  "requiresAuth": true,
  "parameters": [
    {
      "name": "ts_code",
      "type": "string",
      "required": false,
      "description": "股票代码(支持多个,逗号分隔)",
      "example": "000001.SZ"
    },
    {
      "name": "trade_date",
      "type": "string",
      "required": false,
      "description": "交易日期(YYYYMMDD)",
      "example": "20250101"
    }
  ],
  "returns": {
    "type": "DailyData[]",
    "description": "日线行情数据数组",
    "fields": [
      {
        "name": "ts_code",
        "type": "string",
        "description": "股票代码"
      },
      {
        "name": "trade_date",
        "type": "string",
        "description": "交易日期"
      },
      {
        "name": "close",
        "type": "number",
        "description": "收盘价"
      }
    ]
  },
  "examples": [
    {
      "title": "基本用法",
      "language": "typescript",
      "code": "const data = await client.daily({ ts_code: '000001.SZ' })"
    }
  ]
}
```

---

**数据模型版本**: 1.0
**最后更新**: 2025-09-30