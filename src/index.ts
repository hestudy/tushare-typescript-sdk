/**
 * Tushare TypeScript SDK
 * 为Tushare Pro API提供TypeScript类型安全的SDK
 */

// 导出主客户端类
export { TushareClient } from './core/client'

// 导出配置类型
export type { ClientConfig } from './types/config'

// 导出API类型
export type {
  TushareRequest,
  TushareRawResponse,
  TushareResponse,
  DailyParams,
  RealtimeParams
} from './types/api'

// 导出数据类型
export type { DailyQuote, RealtimeQuote } from './types/quote'

// 导出财务数据类型
export type {
  IncomeStatement,
  BalanceSheet,
  CashFlowStatement,
  FinancialIndicator,
  FinancialDataQuery,
  DataStatus,
  PeriodType
} from './types/financial'

// 导出缓存类型
export type { CacheConfig, CacheStorage } from './types/cache'
export { MemoryCache } from './utils/cache'

// 导出错误类和错误类型
export { TushareError, TushareErrorType } from './types/error'
export { DataNotDisclosedError, RateLimitError, AuthenticationError } from './models/error'
