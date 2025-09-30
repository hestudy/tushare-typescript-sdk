/**
 * 格式化日期字符串
 * 将各种日期格式转换为 YYYYMMDD 格式
 */
export function formatDate(date: string | Date): string {
  if (date instanceof Date) {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}${month}${day}`
  }

  // 移除日期字符串中的分隔符
  return date.replace(/[-/\s]/g, '')
}

/**
 * 格式化股票代码
 * 统一格式为: NNNNNN.XX
 */
export function formatStockCode(code: string): string {
  // 移除空格
  code = code.trim().toUpperCase()

  // 如果已经有点分隔符,直接返回
  if (code.includes('.')) {
    return code
  }

  // 如果是6位数字,根据第一位判断交易所
  if (/^\d{6}$/.test(code)) {
    const firstDigit = code.charAt(0)
    // 6开头的是上海,其他是深圳
    const exchange = firstDigit === '6' ? 'SH' : 'SZ'
    return `${code}.${exchange}`
  }

  return code
}

/**
 * 解析多个股票代码(逗号分隔)
 * 返回格式化后的代码数组
 */
export function parseStockCodes(codes: string): string[] {
  return codes
    .split(',')
    .map((code) => code.trim())
    .filter((code) => code.length > 0)
    .map((code) => formatStockCode(code))
}