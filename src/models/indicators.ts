/**
 * 财务指标数据模型
 */
import { FinancialIndicator } from '../types/financial'

/**
 * 从 Tushare API 响应转换为 FinancialIndicator 对象
 *
 * @param fields - 字段名数组 (snake_case)
 * @param items - 数据行数组
 * @returns FinancialIndicator 对象数组
 *
 * @example
 * ```typescript
 * const fields = ['ts_code', 'end_date', 'ann_date', 'roe', 'roe_waa']
 * const items = [['000001.SZ', '20231231', '20240328', 15.2, 14.8]]
 * const indicators = fromApiResponse(fields, items)
 * ```
 */
export function fromApiResponse(fields: string[], items: any[][]): FinancialIndicator[] {
  if (!items || items.length === 0) {
    return []
  }

  return items.map((item) => {
    const data: any = {}

    // 将字段名和值映射到对象
    fields.forEach((field, index) => {
      data[field] = item[index]
    })

    // 转换为 camelCase 并验证
    return {
      tsCode: validateTsCode(data.ts_code),
      endDate: validateDate(data.end_date),
      annDate: validateDate(data.ann_date),
      roe: parseNumber(data.roe),
      roeWaa: parseNumber(data.roe_waa),
      grossprofitMargin: parseNumber(data.grossprofit_margin),
      netprofitMargin: parseNumber(data.netprofit_margin),
      debtToAssets: parseNumber(data.debt_to_assets),
      currentRatio: parseNumber(data.current_ratio),
      quickRatio: parseNumber(data.quick_ratio),
      eps: parseNumber(data.eps),
      bps: parseNumber(data.bps)
    }
  })
}

/**
 * 验证股票代码格式
 *
 * @param tsCode - 股票代码
 * @returns 验证后的股票代码
 * @throws Error 如果格式不正确
 */
function validateTsCode(tsCode: string): string {
  if (!tsCode) {
    throw new Error('tsCode 不能为空')
  }

  // 验证格式: 6位数字 + '.' + 市场代码 (SZ/SH/BJ)
  const pattern = /^\d{6}\.(SZ|SH|BJ)$/
  if (!pattern.test(tsCode)) {
    throw new Error(`tsCode 格式无效: ${tsCode}, 期望格式: XXXXXX.SZ/SH/BJ`)
  }

  return tsCode
}

/**
 * 验证日期格式
 *
 * @param date - 日期字符串
 * @returns 验证后的日期字符串
 * @throws Error 如果格式不正确
 */
function validateDate(date: string): string {
  if (!date) {
    throw new Error('日期不能为空')
  }

  // 验证格式: YYYYMMDD
  const pattern = /^\d{8}$/
  if (!pattern.test(date)) {
    throw new Error(`日期格式无效: ${date}, 期望格式: YYYYMMDD`)
  }

  return date
}

/**
 * 解析数值字段
 *
 * @param value - 值
 * @returns 数值或 null
 */
function parseNumber(value: any): number | null {
  if (value === null || value === undefined || value === '') {
    return null
  }

  const num = Number(value)
  return isNaN(num) ? null : num
}
