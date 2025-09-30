/**
 * API 测试组件契约
 *
 * 定义 ApiTester 组件的 Props 和 Emits
 */

/**
 * API 文档条目(简化版,完整定义见 data-model.md)
 */
export interface ApiDocEntry {
  id: string
  name: string
  category: string
  description: string
  parameters: ApiParameter[]
  returns: ApiReturn
  examples: CodeExample[]
  requiresAuth: boolean
}

export interface ApiParameter {
  name: string
  type: string
  required: boolean
  description: string
  defaultValue?: string
  example?: string
}

export interface ApiReturn {
  type: string
  description: string
  fields?: Array<{
    name: string
    type: string
    description: string
  }>
}

export interface CodeExample {
  title: string
  language: string
  code: string
}

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
  error?: {
    name: string
    message: string
    code?: string
  }

  /** 请求元数据 */
  metadata: {
    apiName: string
    parameters: Record<string, any>
    startTime: number
    endTime: number
  }
}

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
  /** 测试开始事件 */
  'test-start': () => void

  /** 测试完成事件 */
  'test-complete': (result: TestResult) => void

  /** 测试错误事件 */
  'test-error': (error: TestResult['error']) => void
}

/**
 * 参数验证结果
 */
export interface ValidationResult {
  /** 是否有效 */
  valid: boolean

  /** 验证错误列表 */
  errors: Array<{
    field: string
    type: 'required' | 'type' | 'format'
    message: string
  }>
}