/**
 * 请求历史相关类型定义
 */

/**
 * 请求历史记录条目
 * 存储在 localStorage: tushare-sdk-docs:history
 */
export interface RequestHistoryEntry {
  /** 记录唯一 ID(UUID) */
  id: string

  /** API 接口名称 */
  apiName: string

  /** 请求参数 */
  parameters: Record<string, any>

  /** 请求时间戳(毫秒) */
  timestamp: number

  /** 是否成功 */
  success: boolean

  /** 响应摘要(成功时为数据摘要,失败时为错误信息) */
  responseSummary: string

  /** 响应时间(毫秒) */
  responseTime?: number

  /** HTTP 状态码 */
  statusCode?: number
}

/**
 * 请求历史记录集合
 */
export type RequestHistory = RequestHistoryEntry[]