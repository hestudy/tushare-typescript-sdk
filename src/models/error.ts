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

  // 根据错误代码和消息内容判断错误类型
  let errorType: TushareErrorType

  if (code === 2002) {
    // 2002: 认证或权限错误
    if (
      message.includes('token无效') ||
      message.includes('token过期') ||
      message.includes('token')
    ) {
      errorType = TushareErrorType.AUTHENTICATION_ERROR
    } else if (message.includes('积分不足') || message.includes('无权限')) {
      errorType = TushareErrorType.PERMISSION_ERROR
    } else {
      errorType = TushareErrorType.AUTHENTICATION_ERROR // 默认为认证错误
    }
  } else if (code === -1) {
    // -1: 可能是参数错误或频率限制
    // 优先检查频率限制(关键词更具体)
    if (message.includes('超过') || message.includes('频率') || message.includes('rate limit')) {
      errorType = TushareErrorType.RATE_LIMIT_ERROR
    } else if (message.includes('参数错误') || message.includes('parameter')) {
      errorType = TushareErrorType.PARAMETER_ERROR
    } else {
      errorType = TushareErrorType.PARAMETER_ERROR // 默认为参数错误
    }
  } else {
    errorType = TushareErrorType.UNKNOWN_ERROR
  }

  return new TushareError(errorType, message, code, response, requestParams)
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
