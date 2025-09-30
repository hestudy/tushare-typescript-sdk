import { DailyParams, RealtimeParams } from '../types/api'
import { createParameterError } from '../models/error'

/**
 * 验证日线行情查询参数
 */
export function validateDailyParams(params: DailyParams): void {
  // 至少需要提供一个查询条件
  if (!params.ts_code && !params.trade_date && !params.start_date && !params.end_date) {
    throw createParameterError(
      '参数错误: 至少需要提供 ts_code, trade_date, 或 start_date+end_date 之一'
    )
  }

  // 验证日期格式
  if (params.trade_date && !validateDateFormat(params.trade_date)) {
    throw createParameterError(`参数错误: trade_date 格式不正确,应为 YYYYMMDD`)
  }

  if (params.start_date && !validateDateFormat(params.start_date)) {
    throw createParameterError(`参数错误: start_date 格式不正确,应为 YYYYMMDD`)
  }

  if (params.end_date && !validateDateFormat(params.end_date)) {
    throw createParameterError(`参数错误: end_date 格式不正确,应为 YYYYMMDD`)
  }

  // 验证日期范围
  if (params.start_date && params.end_date && params.start_date > params.end_date) {
    throw createParameterError(`参数错误: end_date 必须大于等于 start_date`)
  }

  // 验证股票代码格式
  if (params.ts_code) {
    const codes = params.ts_code.split(',')
    for (const code of codes) {
      if (!validateStockCode(code.trim())) {
        throw createParameterError(
          `参数错误: 股票代码 ${code} 格式不正确,应为 NNNNNN.XX (如 000001.SZ)`
        )
      }
    }
  }
}

/**
 * 验证实时行情查询参数
 */
export function validateRealtimeParams(params: RealtimeParams): void {
  // ts_code 必填
  if (!params.ts_code) {
    throw createParameterError('参数错误: ts_code 为必填项')
  }

  // 验证股票代码格式
  const codes = params.ts_code.split(',')
  for (const code of codes) {
    if (!validateStockCode(code.trim())) {
      throw createParameterError(
        `参数错误: 股票代码 ${code} 格式不正确,应为 NNNNNN.XX (如 000001.SZ)`
      )
    }
  }
}

/**
 * 验证日期格式 (YYYYMMDD)
 */
export function validateDateFormat(date: string): boolean {
  // 检查长度
  if (date.length !== 8) {
    return false
  }

  // 检查是否全为数字
  if (!/^\d{8}$/.test(date)) {
    return false
  }

  // 检查年月日是否合法
  const year = parseInt(date.substring(0, 4), 10)
  const month = parseInt(date.substring(4, 6), 10)
  const day = parseInt(date.substring(6, 8), 10)

  if (year < 1900 || year > 2100) {
    return false
  }

  if (month < 1 || month > 12) {
    return false
  }

  if (day < 1 || day > 31) {
    return false
  }

  return true
}

/**
 * 验证股票代码格式
 * 格式: NNNNNN.XX (6位数字 + 点 + 2位大写字母)
 * 例如: 000001.SZ, 600000.SH
 */
export function validateStockCode(code: string): boolean {
  return /^\d{6}\.(SZ|SH|BJ)$/.test(code)
}