/**
 * Tushare API 请求接口
 */
export interface TushareRequest {
  /**
   * API接口名称
   */
  api_name: string

  /**
   * 认证token
   */
  token: string

  /**
   * 查询参数
   */
  params: Record<string, unknown>

  /**
   * 返回字段列表(可选)
   * 逗号分隔的字符串或字符串数组
   */
  fields?: string | string[]
}

/**
 * Tushare API 原始响应接口
 */
export interface TushareRawResponse {
  /**
   * 响应代码
   * 0: 成功
   * 2002: 权限/认证错误
   * 其他非0值: 系统错误
   */
  code: number

  /**
   * 响应消息
   * 成功时为null,失败时包含错误信息
   */
  msg: string | null

  /**
   * 响应数据
   * 成功时包含fields和items,失败时为null
   */
  data: {
    fields: string[]
    items: unknown[][]
  } | null
}

/**
 * Tushare API 结构化响应接口
 */
export interface TushareResponse<T> {
  /**
   * 响应代码
   */
  code: number

  /**
   * 响应消息
   */
  msg: string | null

  /**
   * 原始数据(fields + items格式)
   */
  raw: {
    fields: string[]
    items: unknown[][]
  } | null

  /**
   * 结构化数据(对象数组)
   */
  data: T[] | null

  /**
   * 是否成功
   */
  success: boolean
}

/**
 * 日线行情查询参数
 */
export interface DailyParams {
  /**
   * 股票代码 (可选)
   * 格式: 000001.SZ 或 600000.SH
   */
  ts_code?: string

  /**
   * 交易日期 (可选)
   * 格式: YYYYMMDD
   */
  trade_date?: string

  /**
   * 开始日期 (可选)
   * 格式: YYYYMMDD
   */
  start_date?: string

  /**
   * 结束日期 (可选)
   * 格式: YYYYMMDD
   */
  end_date?: string
}

/**
 * 实时行情查询参数
 */
export interface RealtimeParams {
  /**
   * 股票代码 (必填)
   * 支持多个股票,逗号分隔
   * 格式: 000001.SZ 或 000001.SZ,600000.SH
   */
  ts_code: string
}
