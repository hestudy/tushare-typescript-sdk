import { ClientConfig } from '../types/config'
import { TushareRequest, TushareResponse, DailyParams, RealtimeParams } from '../types/api'
import { DailyQuote, RealtimeQuote } from '../types/quote'
import {
  IncomeStatement,
  BalanceSheet,
  CashFlowStatement,
  FinancialIndicator
} from '../types/financial'
import { CacheStorage } from '../types/cache'
import { HttpClient } from './http'
import { AuthManager } from './auth'
import { transformResponse } from '../models/response'
import { mapApiErrorToTushareError } from '../models/error'
import { MemoryCache } from '../utils/cache'
import * as incomeModel from '../models/income'
import * as balanceModel from '../models/balance'
import * as cashflowModel from '../models/cashflow'
import * as indicatorsModel from '../models/indicators'

/**
 * Tushare SDK 主客户端类
 */
export class TushareClient {
  private config: ClientConfig
  private httpClient: HttpClient
  private authManager: AuthManager
  private cache?: CacheStorage
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

    // 初始化缓存
    if (this.config.cache?.enabled) {
      this.cache = this.config.cache.storage || new MemoryCache()
    }

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

  /**
   * 查询利润表数据
   *
   * @param tsCode - 股票代码 (格式: XXXXXX.SZ/SH/BJ)
   * @param params - 可选查询参数
   * @param params.startDate - 起始报告期 (格式: YYYYMMDD)
   * @param params.endDate - 结束报告期 (格式: YYYYMMDD)
   * @param params.period - 报告期类型
   * @returns 利润表数据数组
   *
   * @throws {AuthenticationError} token 无效或过期
   * @throws {RateLimitError} 超出调用频率限制
   * @throws {DataNotDisclosedError} 数据未披露
   *
   * @example
   * ```typescript
   * const client = new TushareClient({ token: 'your_token' })
   *
   * // 查询指定股票的所有利润表数据
   * const statements = await client.getIncomeStatement('000001.SZ')
   *
   * // 查询指定日期范围的利润表数据
   * const statements2 = await client.getIncomeStatement('000001.SZ', {
   *   startDate: '20230101',
   *   endDate: '20231231'
   * })
   * ```
   */
  async getIncomeStatement(
    tsCode: string,
    params?: { startDate?: string; endDate?: string; period?: string }
  ): Promise<IncomeStatement[]> {
    // 生成缓存键
    const cacheKey = `income:${tsCode}:${params?.startDate || ''}:${params?.endDate || ''}:${params?.period || ''}`

    // 尝试从缓存获取
    if (this.cache) {
      const cached = await this.cache.get(cacheKey)
      if (cached) {
        return cached
      }
    }

    // 构建请求参数
    const requestParams: any = { ts_code: tsCode }
    if (params?.startDate) requestParams.start_date = params.startDate
    if (params?.endDate) requestParams.end_date = params.endDate
    if (params?.period) requestParams.period = params.period

    // 调用 API
    const fullRequest: TushareRequest = {
      api_name: 'income',
      token: this.authManager.getToken(),
      params: requestParams
    }

    const rawResponse = await this.httpClient.post(fullRequest)

    // 检查 API 错误
    if (rawResponse.code !== 0) {
      throw mapApiErrorToTushareError(rawResponse, requestParams)
    }

    // 检查数据是否存在
    if (!rawResponse.data) {
      return []
    }

    // 转换响应数据
    const result = incomeModel.fromApiResponse(rawResponse.data.fields, rawResponse.data.items)

    // 缓存结果
    if (this.cache && result.length > 0) {
      const ttl = this.config.cache?.ttl || 3600
      await this.cache.set(cacheKey, result, ttl)
    }

    return result
  }

  /**
   * 查询资产负债表数据
   *
   * @param tsCode - 股票代码 (格式: XXXXXX.SZ/SH/BJ)
   * @param params - 可选查询参数
   * @param params.startDate - 起始报告期 (格式: YYYYMMDD)
   * @param params.endDate - 结束报告期 (格式: YYYYMMDD)
   * @param params.period - 报告期类型
   * @returns 资产负债表数据数组
   *
   * @throws {AuthenticationError} token 无效或过期
   * @throws {RateLimitError} 超出调用频率限制
   * @throws {DataNotDisclosedError} 数据未披露
   *
   * @example
   * ```typescript
   * const client = new TushareClient({ token: 'your_token' })
   * const statements = await client.getBalanceSheet('000001.SZ')
   * ```
   */
  async getBalanceSheet(
    tsCode: string,
    params?: { startDate?: string; endDate?: string; period?: string }
  ): Promise<BalanceSheet[]> {
    // 生成缓存键
    const cacheKey = `balance:${tsCode}:${params?.startDate || ''}:${params?.endDate || ''}:${params?.period || ''}`

    // 尝试从缓存获取
    if (this.cache) {
      const cached = await this.cache.get(cacheKey)
      if (cached) {
        return cached
      }
    }

    // 构建请求参数
    const requestParams: any = { ts_code: tsCode }
    if (params?.startDate) requestParams.start_date = params.startDate
    if (params?.endDate) requestParams.end_date = params.endDate
    if (params?.period) requestParams.period = params.period

    // 调用 API
    const fullRequest: TushareRequest = {
      api_name: 'balancesheet',
      token: this.authManager.getToken(),
      params: requestParams
    }

    const rawResponse = await this.httpClient.post(fullRequest)

    // 检查 API 错误
    if (rawResponse.code !== 0) {
      throw mapApiErrorToTushareError(rawResponse, requestParams)
    }

    // 检查数据是否存在
    if (!rawResponse.data) {
      return []
    }

    // 转换响应数据
    const result = balanceModel.fromApiResponse(rawResponse.data.fields, rawResponse.data.items)

    // 缓存结果
    if (this.cache && result.length > 0) {
      const ttl = this.config.cache?.ttl || 3600
      await this.cache.set(cacheKey, result, ttl)
    }

    return result
  }

  /**
   * 查询现金流量表数据
   *
   * @param tsCode - 股票代码 (格式: XXXXXX.SZ/SH/BJ)
   * @param params - 可选查询参数
   * @param params.startDate - 起始报告期 (格式: YYYYMMDD)
   * @param params.endDate - 结束报告期 (格式: YYYYMMDD)
   * @param params.period - 报告期类型
   * @returns 现金流量表数据数组
   *
   * @throws {AuthenticationError} token 无效或过期
   * @throws {RateLimitError} 超出调用频率限制
   * @throws {DataNotDisclosedError} 数据未披露
   *
   * @example
   * ```typescript
   * const client = new TushareClient({ token: 'your_token' })
   * const statements = await client.getCashFlowStatement('000001.SZ')
   * ```
   */
  async getCashFlowStatement(
    tsCode: string,
    params?: { startDate?: string; endDate?: string; period?: string }
  ): Promise<CashFlowStatement[]> {
    // 生成缓存键
    const cacheKey = `cashflow:${tsCode}:${params?.startDate || ''}:${params?.endDate || ''}:${params?.period || ''}`

    // 尝试从缓存获取
    if (this.cache) {
      const cached = await this.cache.get(cacheKey)
      if (cached) {
        return cached
      }
    }

    // 构建请求参数
    const requestParams: any = { ts_code: tsCode }
    if (params?.startDate) requestParams.start_date = params.startDate
    if (params?.endDate) requestParams.end_date = params.endDate
    if (params?.period) requestParams.period = params.period

    // 调用 API
    const fullRequest: TushareRequest = {
      api_name: 'cashflow',
      token: this.authManager.getToken(),
      params: requestParams
    }

    const rawResponse = await this.httpClient.post(fullRequest)

    // 检查 API 错误
    if (rawResponse.code !== 0) {
      throw mapApiErrorToTushareError(rawResponse, requestParams)
    }

    // 检查数据是否存在
    if (!rawResponse.data) {
      return []
    }

    // 转换响应数据
    const result = cashflowModel.fromApiResponse(rawResponse.data.fields, rawResponse.data.items)

    // 缓存结果
    if (this.cache && result.length > 0) {
      const ttl = this.config.cache?.ttl || 3600
      await this.cache.set(cacheKey, result, ttl)
    }

    return result
  }

  /**
   * 查询财务指标数据
   *
   * @param tsCode - 股票代码 (格式: XXXXXX.SZ/SH/BJ)
   * @param params - 可选查询参数
   * @param params.startDate - 起始报告期 (格式: YYYYMMDD)
   * @param params.endDate - 结束报告期 (格式: YYYYMMDD)
   * @param params.period - 报告期类型
   * @returns 财务指标数据数组
   *
   * @throws {AuthenticationError} token 无效或过期
   * @throws {RateLimitError} 超出调用频率限制
   * @throws {DataNotDisclosedError} 数据未披露
   *
   * @example
   * ```typescript
   * const client = new TushareClient({ token: 'your_token' })
   * const indicators = await client.getFinancialIndicators('000001.SZ')
   * ```
   */
  async getFinancialIndicators(
    tsCode: string,
    params?: { startDate?: string; endDate?: string; period?: string }
  ): Promise<FinancialIndicator[]> {
    // 生成缓存键
    const cacheKey = `indicators:${tsCode}:${params?.startDate || ''}:${params?.endDate || ''}:${params?.period || ''}`

    // 尝试从缓存获取
    if (this.cache) {
      const cached = await this.cache.get(cacheKey)
      if (cached) {
        return cached
      }
    }

    // 构建请求参数
    const requestParams: any = { ts_code: tsCode }
    if (params?.startDate) requestParams.start_date = params.startDate
    if (params?.endDate) requestParams.end_date = params.endDate
    if (params?.period) requestParams.period = params.period

    // 调用 API
    const fullRequest: TushareRequest = {
      api_name: 'fina_indicator',
      token: this.authManager.getToken(),
      params: requestParams
    }

    const rawResponse = await this.httpClient.post(fullRequest)

    // 检查 API 错误
    if (rawResponse.code !== 0) {
      throw mapApiErrorToTushareError(rawResponse, requestParams)
    }

    // 检查数据是否存在
    if (!rawResponse.data) {
      return []
    }

    // 转换响应数据
    const result = indicatorsModel.fromApiResponse(rawResponse.data.fields, rawResponse.data.items)

    // 缓存结果
    if (this.cache && result.length > 0) {
      const ttl = this.config.cache?.ttl || 3600
      await this.cache.set(cacheKey, result, ttl)
    }

    return result
  }
}
