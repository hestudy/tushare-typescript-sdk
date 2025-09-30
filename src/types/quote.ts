/**
 * 日线行情数据接口
 */
export interface DailyQuote {
  /**
   * 股票代码
   */
  ts_code: string

  /**
   * 交易日期 YYYYMMDD
   */
  trade_date: string

  /**
   * 开盘价
   */
  open: number

  /**
   * 最高价
   */
  high: number

  /**
   * 最低价
   */
  low: number

  /**
   * 收盘价
   */
  close: number

  /**
   * 昨收价
   */
  pre_close: number

  /**
   * 涨跌额
   */
  change: number

  /**
   * 涨跌幅 (%)
   */
  pct_chg: number

  /**
   * 成交量 (手)
   */
  vol: number

  /**
   * 成交额 (千元)
   */
  amount: number
}

/**
 * 实时行情数据接口
 */
export interface RealtimeQuote {
  /**
   * 股票代码
   */
  ts_code: string

  /**
   * 股票名称
   */
  name: string

  /**
   * 当前价格
   */
  price: number

  /**
   * 开盘价
   */
  open: number

  /**
   * 最高价
   */
  high: number

  /**
   * 最低价
   */
  low: number

  /**
   * 昨收价
   */
  pre_close: number

  /**
   * 成交量
   */
  volume: number

  /**
   * 成交额
   */
  amount: number
}
