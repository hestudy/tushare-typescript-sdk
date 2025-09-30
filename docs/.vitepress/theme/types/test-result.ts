/**
 * 测试结果相关类型定义
 */

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