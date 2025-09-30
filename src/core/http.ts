import { TushareRequest, TushareRawResponse } from '../types/api'
import {
  createNetworkError,
  createTimeoutError,
  createServerError
} from '../models/error'

/**
 * HTTP客户端类,封装HTTP请求逻辑
 */
export class HttpClient {
  private baseUrl: string
  private timeout: number
  private debug: boolean

  constructor(baseUrl: string = 'http://api.tushare.pro', timeout: number = 5000, debug: boolean = false) {
    this.baseUrl = baseUrl
    this.timeout = timeout
    this.debug = debug
  }

  /**
   * 发送POST请求
   */
  async post<T = TushareRawResponse>(body: TushareRequest): Promise<T> {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.timeout)

    try {
      if (this.debug) {
        console.log('[Tushare SDK] 发送请求:', JSON.stringify(body, null, 2))
      }

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body),
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      // 检查HTTP状态码
      if (!response.ok) {
        if (response.status >= 500) {
          throw createServerError(response.status, response.statusText)
        }
      }

      const data = await response.json()

      if (this.debug) {
        console.log('[Tushare SDK] 收到响应:', JSON.stringify(data, null, 2))
      }

      return data as T
    } catch (error) {
      clearTimeout(timeoutId)

      if (error instanceof Error) {
        // 检查是否是超时错误
        if (error.name === 'AbortError') {
          throw createTimeoutError(this.timeout)
        }

        // 如果已经是TushareError,直接抛出
        if (error.constructor.name === 'TushareError') {
          throw error
        }

        // 其他网络错误
        throw createNetworkError(error)
      }

      throw error
    }
  }
}