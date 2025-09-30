import { ClientConfig } from '../types/config'
import { TushareRequest, TushareResponse, DailyParams, RealtimeParams } from '../types/api'
import { DailyQuote, RealtimeQuote } from '../types/quote'
import { HttpClient } from './http'
import { AuthManager } from './auth'
import { transformResponse } from '../models/response'
import { mapApiErrorToTushareError } from '../models/error'

/**
 * Tushare SDK 主客户端类
 */
export class TushareClient {
  private config: ClientConfig
  private httpClient: HttpClient
  private authManager: AuthManager
  private initialized: boolean = false

  /**
   * 创建Tushare客户端实例
   */
  constructor(config: ClientConfig) {
    // 设置默认配置
    this.config = {
      baseUrl: 'http://api.tushare.pro',
      timeout: 5000,
      debug: false,
      ...config
    }

    // 初始化HTTP客户端和认证管理器
    this.httpClient = new HttpClient(this.config.baseUrl, this.config.timeout, this.config.debug)
    this.authManager = new AuthManager(this.config)
    this.initialized = true
  }

  /**
   * 检查客户端是否就绪
   */
  isReady(): boolean {
    return this.initialized
  }

  /**
   * 获取客户端配置
   */
  getConfig(): ClientConfig {
    return { ...this.config }
  }

  /**
   * 更新超时时间
   */
  updateTimeout(timeout: number): void {
    this.config.timeout = timeout
    this.httpClient = new HttpClient(this.config.baseUrl, this.config.timeout, this.config.debug)
  }

  /**
   * 通用查询方法
   */
  async query<T>(request: Omit<TushareRequest, 'token'>): Promise<TushareResponse<T>> {
    // 添加token到请求
    const fullRequest: TushareRequest = {
      ...request,
      token: this.authManager.getToken()
    }

    try {
      // 发送HTTP请求
      const rawResponse = await this.httpClient.post(fullRequest)

      // 检查API错误
      if (rawResponse.code !== 0) {
        throw mapApiErrorToTushareError(rawResponse, request.params)
      }

      // 转换响应数据
      return transformResponse<T>(rawResponse)
    } catch (error) {
      // 如果已经是TushareError,直接抛出
      if (error instanceof Error && error.constructor.name === 'TushareError') {
        throw error
      }

      // 其他错误
      throw error
    }
  }

  /**
   * 查询日线行情
   */
  async daily(params: DailyParams): Promise<TushareResponse<DailyQuote>> {
    return this.query<DailyQuote>({
      api_name: 'daily',
      params: { ...params }
    })
  }

  /**
   * 查询实时行情
   */
  async realtimeQuote(params: RealtimeParams): Promise<TushareResponse<RealtimeQuote>> {
    return this.query<RealtimeQuote>({
      api_name: 'realtime_quote',
      params: { ...params }
    })
  }
}
