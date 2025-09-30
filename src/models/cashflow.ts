/**
 * 现金流量表数据模型
 */
import { CashFlowStatement } from '../types/financial'

/**
 * 从 Tushare API 响应转换为 CashFlowStatement 对象
 *
 * @param fields - 字段名数组 (snake_case)
 * @param items - 数据行数组
 * @returns CashFlowStatement 对象数组
 *
 * @example
 * ```typescript
 * const fields = ['ts_code', 'end_date', 'ann_date', 'report_type', 'n_cashflow_act']
 * const items = [['000001.SZ', '20231231', '20240328', '1', 15000000000]]
 * const statements = fromApiResponse(fields, items)
 * ```
 */
export function fromApiResponse(fields: string[], items: any[][]): CashFlowStatement[] {
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
      reportType: data.report_type || '',
      nCashflowAct: parseNumber(data.n_cashflow_act),
      nCashflowInvAct: parseNumber(data.n_cashflow_inv_act),
      nCashFlowsFncAct: parseNumber(data.n_cash_flows_fnc_act),
      cCashEquEndPeriod: parseNumber(data.c_cash_equ_end_period),
      cCashEquBegPeriod: parseNumber(data.c_cash_equ_beg_period),
      nIncrCashCashEqu: parseNumber(data.n_incr_cash_cash_equ)
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
