/**
 * 财务数据相关类型定义
 */

/**
 * 数据状态枚举
 */
export enum DataStatus {
  /** 已披露 */
  DISCLOSED = 'disclosed',
  /** 未披露 */
  NOT_DISCLOSED = 'not_disclosed',
  /** 不适用 */
  NOT_APPLICABLE = 'not_applicable'
}

/**
 * 报告期类型枚举
 */
export enum PeriodType {
  /** 年报 */
  ANNUAL = 'annual',
  /** 半年报 */
  SEMI_ANNUAL = 'semi',
  /** 季报 */
  QUARTERLY = 'quarterly'
}

/**
 * 利润表接口
 *
 * 表示上市公司在特定报告期的经营成果
 */
export interface IncomeStatement {
  /** 股票代码 (格式: 6位数字 + '.' + 市场代码, 如 '000001.SZ') */
  tsCode: string

  /** 报告期 (格式: YYYYMMDD) */
  endDate: string

  /** 公告日期 (格式: YYYYMMDD) */
  annDate: string

  /** 报告类型 (1=合并报表, 2=单季合并, 3=调整单季合并, 5=调整合并) */
  reportType: string

  /** 营业总收入 (元) */
  totalRevenue: number | null

  /** 营业收入 (元) */
  revenue: number | null

  /** 营业利润 (元) */
  operateProfit: number | null

  /** 利润总额 (元) */
  totalProfit: number | null

  /** 净利润 (元) */
  nIncome: number | null

  /** 归属于母公司所有者的净利润 (元) */
  nIncomeAttrP: number | null

  /** 基本每股收益 (元) */
  basicEps: number | null

  /** 稀释每股收益 (元) */
  dilutedEps: number | null
}

/**
 * 资产负债表接口
 *
 * 表示上市公司在特定日期的财务状况
 */
export interface BalanceSheet {
  /** 股票代码 (格式: 6位数字 + '.' + 市场代码) */
  tsCode: string

  /** 报告期 (格式: YYYYMMDD) */
  endDate: string

  /** 公告日期 (格式: YYYYMMDD) */
  annDate: string

  /** 报告类型 */
  reportType: string

  /** 资产总计 (元) */
  totalAssets: number | null

  /** 负债合计 (元) */
  totalLiab: number | null

  /** 股东权益合计(不含少数股东权益) (元) */
  totalHldrEqyExcMinInt: number | null

  /** 股东权益合计(含少数股东权益) (元) */
  totalHldrEqyIncMinInt: number | null

  /** 流动资产合计 (元) */
  totalCurAssets: number | null

  /** 流动负债合计 (元) */
  totalCurLiab: number | null

  /** 非流动资产合计 (元) */
  totalNcaAssets: number | null

  /** 非流动负债合计 (元) */
  totalNcaLiab: number | null
}

/**
 * 现金流量表接口
 *
 * 表示上市公司在特定期间的现金流入流出情况
 */
export interface CashFlowStatement {
  /** 股票代码 (格式: 6位数字 + '.' + 市场代码) */
  tsCode: string

  /** 报告期 (格式: YYYYMMDD) */
  endDate: string

  /** 公告日期 (格式: YYYYMMDD) */
  annDate: string

  /** 报告类型 */
  reportType: string

  /** 经营活动产生的现金流量净额 (元) */
  nCashflowAct: number | null

  /** 投资活动产生的现金流量净额 (元) */
  nCashflowInvAct: number | null

  /** 筹资活动产生的现金流量净额 (元) */
  nCashFlowsFncAct: number | null

  /** 期末现金及现金等价物余额 (元) */
  cCashEquEndPeriod: number | null

  /** 期初现金及现金等价物余额 (元) */
  cCashEquBegPeriod: number | null

  /** 现金及现金等价物净增加额 (元) */
  nIncrCashCashEqu: number | null
}

/**
 * 财务指标接口
 *
 * 表示基于财务报表计算得出的分析指标
 */
export interface FinancialIndicator {
  /** 股票代码 (格式: 6位数字 + '.' + 市场代码) */
  tsCode: string

  /** 报告期 (格式: YYYYMMDD) */
  endDate: string

  /** 公告日期 (格式: YYYYMMDD) */
  annDate: string

  /** 净资产收益率 (%) */
  roe: number | null

  /** 加权平均净资产收益率 (%) */
  roeWaa: number | null

  /** 销售毛利率 (%) */
  grossprofitMargin: number | null

  /** 销售净利率 (%) */
  netprofitMargin: number | null

  /** 资产负债率 (%) */
  debtToAssets: number | null

  /** 流动比率 */
  currentRatio: number | null

  /** 速动比率 */
  quickRatio: number | null

  /** 每股收益 (元) */
  eps: number | null

  /** 每股净资产 (元) */
  bps: number | null
}

/**
 * 财务数据查询参数接口
 *
 * 封装财务数据查询的通用参数
 */
export interface FinancialDataQuery {
  /** 股票代码 (必填, 格式: 6位数字 + '.' + 市场代码) */
  tsCode: string

  /** 起始报告期 (可选, 格式: YYYYMMDD) */
  startDate?: string

  /** 结束报告期 (可选, 格式: YYYYMMDD) */
  endDate?: string

  /** 报告期类型 (可选, 不指定则返回所有类型) */
  period?: PeriodType

  /** 指定返回字段 (可选, 不指定则返回所有字段) */
  fields?: string[]
}
