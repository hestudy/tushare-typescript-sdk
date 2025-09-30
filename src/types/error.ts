import { TushareRawResponse } from './api'

/**
 * Tushare错误类型枚举
 */
export enum TushareErrorType {
  /** Token无效或过期 */
  AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
  /** 积分不足或无权限 */
  PERMISSION_ERROR = 'PERMISSION_ERROR',
  /** 超过调用频率限制 */
  RATE_LIMIT_ERROR = 'RATE_LIMIT_ERROR',
  /** 参数错误 */
  PARAMETER_ERROR = 'PARAMETER_ERROR',
  /** 网络错误 */
  NETWORK_ERROR = 'NETWORK_ERROR',
  /** 请求超时 */
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',
  /** 服务器内部错误 */
  SERVER_ERROR = 'SERVER_ERROR',
  /** 未知错误 */
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

/**
 * Tushare错误类
 */
export class TushareError extends Error {
  /**
   * 错误类型
   */
  type: TushareErrorType

  /**
   * 错误代码
   */
  code?: number

  /**
   * 原始响应(如有)
   */
  rawResponse?: TushareRawResponse

  /**
   * 请求参数(用于调试)
   */
  requestParams?: Record<string, unknown>

  constructor(
    type: TushareErrorType,
    message: string,
    code?: number,
    rawResponse?: TushareRawResponse,
    requestParams?: Record<string, unknown>
  ) {
    super(message)
    this.name = 'TushareError'
    this.type = type
    this.code = code
    this.rawResponse = rawResponse
    this.requestParams = requestParams

    // 维护正确的原型链
    Object.setPrototypeOf(this, TushareError.prototype)
  }
}
