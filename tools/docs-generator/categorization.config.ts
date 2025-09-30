/**
 * API 分类配置
 */

export const API_CATEGORIES = {
  'Market Data': ['daily', 'weekly', 'minute', 'moneyflow'],
  'Financial Data': ['income', 'balance', 'cashflow', 'fina_indicator'],
  'Basic Data': ['stock_basic', 'trade_cal', 'stock_company', 'hs_const'],
  'Index Data': ['index_basic', 'index_daily', 'index_weekly'],
  'Fund Data': ['fund_basic', 'fund_nav'],
  'Others': []
} as const

export type CategoryName = keyof typeof API_CATEGORIES