import { TushareError, TushareErrorType } from '../types/error'
import { TushareRawResponse } from '../types/api'

/**
 * 将API错误响应映射为TushareError
 */
export function mapApiErrorToTushareError(
  response: TushareRawResponse,
  requestParams?: Record<string, unknown>
): TushareError {
  const { code, msg } = response
  const message = msg || '未知错误'

  // 根据错误代码和消息内容判断错误类型并返回对应的错误实例
  if (code === 40001) {
    // 40001: 认证失败
    return new AuthenticationError(message, code)
  } else if (code === 40002) {
    // 40002: 限流错误
    return new RateLimitError()
  } else if (code === 2002) {
    // 2002: 认证或权限错误
    if (
      message.includes('token无效') ||
      message.includes('token过期') ||
      message.includes('token')
    ) {
      return new AuthenticationError(message, code)
    } else if (message.includes('积分不足') || message.includes('无权限')) {
      return new TushareError(
        TushareErrorType.PERMISSION_ERROR,
        message,
        code,
        response,
        requestParams
      )
    } else {
      return new AuthenticationError(message, code)
    }
  } else if (code === -1) {
    // -1: 可能是参数错误或频率限制
    if (message.includes('超过') || message.includes('频率') || message.includes('rate limit')) {
      return new RateLimitError()
    } else if (message.includes('参数错误') || message.includes('parameter')) {
      return new TushareError(
        TushareErrorType.PARAMETER_ERROR,
        message,
        code,
        response,
        requestParams
      )
    } else {
      return new TushareError(
        TushareErrorType.PARAMETER_ERROR,
        message,
        code,
        response,
        requestParams
      )
    }
  } else {
    return new TushareError(TushareErrorType.UNKNOWN_ERROR, message, code, response, requestParams)
  }
}

/**
 * 创建网络错误
 */
export function createNetworkError(error: Error): TushareError {
  return new TushareError(
    TushareErrorType.NETWORK_ERROR,
    `网络错误: ${error.message}`,
    undefined,
    undefined,
    { originalError: error.message }
  )
}

/**
 * 创建超时错误
 */
export function createTimeoutError(timeout: number): TushareError {
  return new TushareError(
    TushareErrorType.TIMEOUT_ERROR,
    `请求超时(${timeout}ms)`,
    undefined,
    undefined,
    { timeout }
  )
}

/**
 * 创建服务器错误
 */
export function createServerError(statusCode: number, statusText: string): TushareError {
  return new TushareError(
    TushareErrorType.SERVER_ERROR,
    `服务器错误: ${statusCode} ${statusText}`,
    statusCode,
    undefined,
    { statusCode, statusText }
  )
}

/**
 * 创建参数错误
 */
export function createParameterError(message: string): TushareError {
  return new TushareError(TushareErrorType.PARAMETER_ERROR, message, -1)
}

/**
 * 数据未披露错误类
 *
 * 表示请求的报告期数据未披露
 *
 * @example
 * ```typescript
 * throw new DataNotDisclosedError({
 *   tsCode: '000001.SZ',
 *   endDate: '20231231',
 *   status: DataStatus.NOT_DISCLOSED
 * })
 * ```
 */
export class DataNotDisclosedError extends TushareError {
  /**
   * 股票代码
   */
  tsCode: string

  /**
   * 请求的报告期
   */
  endDate: string

  /**
   * 数据状态
   */
  status: import('../types/financial').DataStatus

  constructor(options: import('../types/error').DataNotDisclosedErrorOptions) {
    super(
      TushareErrorType.DATA_NOT_DISCLOSED,
      `数据未披露: ${options.tsCode} 在报告期 ${options.endDate} 的数据未披露`,
      undefined,
      undefined,
      { tsCode: options.tsCode, endDate: options.endDate, status: options.status }
    )
    this.name = 'DataNotDisclosedError'
    this.tsCode = options.tsCode
    this.endDate = options.endDate
    this.status = options.status

    // 维护正确的原型链
    Object.setPrototypeOf(this, DataNotDisclosedError.prototype)
  }
}

/**
 * 限流错误类
 *
 * 表示超出 API 调用频率限制
 *
 * @example
 * ```typescript
 * throw new RateLimitError({ retryAfter: 60 })
 * ```
 */
export class RateLimitError extends TushareError {
  /**
   * 建议的重试等待时间(秒)
   */
  retryAfter?: number

  constructor(options?: import('../types/error').RateLimitErrorOptions) {
    const message = options?.retryAfter
      ? `超出调用频率限制,请在 ${options.retryAfter} 秒后重试`
      : '超出调用频率限制,请稍后重试'

    super(
      TushareErrorType.RATE_LIMIT_ERROR,
      message,
      40002,
      undefined,
      options ? { retryAfter: options.retryAfter } : undefined
    )
    this.name = 'RateLimitError'
    this.retryAfter = options?.retryAfter

    // 维护正确的原型链
    Object.setPrototypeOf(this, RateLimitError.prototype)
  }
}

/**
 * 认证错误类
 *
 * 表示 token 无效或过期
 *
 * @example
 * ```typescript
 * throw new AuthenticationError('token认证失败', 40001)
 * ```
 */
export class AuthenticationError extends TushareError {
  constructor(message: string, code?: number) {
    super(TushareErrorType.AUTHENTICATION_ERROR, message, code || 40001, undefined, undefined)
    this.name = 'AuthenticationError'

    // 维护正确的原型链
    Object.setPrototypeOf(this, AuthenticationError.prototype)
  }
}
