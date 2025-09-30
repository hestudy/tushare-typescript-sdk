/**
 * API 文档相关类型定义
 */

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