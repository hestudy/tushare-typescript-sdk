# Data Model: 财务数据

**Feature**: 003-tushare | **Date**: 2025-09-30

## 概述

本文档定义财务数据接口涉及的实体模型和类型系统。

## 核心实体

### 1. IncomeStatement (利润表)

**用途**: 表示上市公司在特定报告期的经营成果

**字段**:

| 字段名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| tsCode | string | ✓ | 股票代码 |
| endDate | string | ✓ | 报告期(YYYYMMDD) |
| annDate | string | ✓ | 公告日期(YYYYMMDD) |
| reportType | string | ✓ | 报告类型(1=合并报表, 2=单季合并, 3=调整单季合并, 5=调整合并) |
| totalRevenue | number \| null | | 营业总收入(元) |
| revenue | number \| null | | 营业收入(元) |
| operateProfit | number \| null | | 营业利润(元) |
| totalProfit | number \| null | | 利润总额(元) |
| nIncome | number \| null | | 净利润(元) |
| nIncomeAttrP | number \| null | | 归属于母公司所有者的净利润(元) |
| basicEps | number \| null | | 基本每股收益(元) |
| dilutedEps | number \| null | | 稀释每股收益(元) |

**验证规则**:
- `tsCode` 格式: 6位数字 + '.' + 市场代码(如 '000001.SZ')
- `endDate`, `annDate` 格式: YYYYMMDD
- 数值字段可为 null(表示未披露或不适用)

**状态转换**: N/A (不可变数据,仅查询)

### 2. BalanceSheet (资产负债表)

**用途**: 表示上市公司在特定日期的财务状况

**字段**:

| 字段名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| tsCode | string | ✓ | 股票代码 |
| endDate | string | ✓ | 报告期(YYYYMMDD) |
| annDate | string | ✓ | 公告日期(YYYYMMDD) |
| reportType | string | ✓ | 报告类型 |
| totalAssets | number \| null | | 资产总计(元) |
| totalLiab | number \| null | | 负债合计(元) |
| totalHldrEqyExcMinInt | number \| null | | 股东权益合计(不含少数股东权益)(元) |
| totalHldrEqyIncMinInt | number \| null | | 股东权益合计(含少数股东权益)(元) |
| totalCurAssets | number \| null | | 流动资产合计(元) |
| totalCurLiab | number \| null | | 流动负债合计(元) |
| totalNcaAssets | number \| null | | 非流动资产合计(元) |
| totalNcaLiab | number \| null | | 非流动负债合计(元) |

**验证规则**:
- 同 IncomeStatement
- 资产负债平衡: `totalAssets ≈ totalLiab + totalHldrEqyIncMinInt` (允许精度误差)

**状态转换**: N/A (不可变数据,仅查询)

### 3. CashFlowStatement (现金流量表)

**用途**: 表示上市公司在特定期间的现金流入流出情况

**字段**:

| 字段名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| tsCode | string | ✓ | 股票代码 |
| endDate | string | ✓ | 报告期(YYYYMMDD) |
| annDate | string | ✓ | 公告日期(YYYYMMDD) |
| reportType | string | ✓ | 报告类型 |
| nCashflowAct | number \| null | | 经营活动产生的现金流量净额(元) |
| nCashflowInvAct | number \| null | | 投资活动产生的现金流量净额(元) |
| nCashFlowsFncAct | number \| null | | 筹资活动产生的现金流量净额(元) |
| cCashEquEndPeriod | number \| null | | 期末现金及现金等价物余额(元) |
| cCashEquBegPeriod | number \| null | | 期初现金及现金等价物余额(元) |
| nIncrCashCashEqu | number \| null | | 现金及现金等价物净增加额(元) |

**验证规则**:
- 同 IncomeStatement
- 现金平衡: `nIncrCashCashEqu ≈ cCashEquEndPeriod - cCashEquBegPeriod` (允许精度误差)

**状态转换**: N/A (不可变数据,仅查询)

### 4. FinancialIndicator (财务指标)

**用途**: 表示基于财务报表计算得出的分析指标

**字段**:

| 字段名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| tsCode | string | ✓ | 股票代码 |
| endDate | string | ✓ | 报告期(YYYYMMDD) |
| annDate | string | ✓ | 公告日期(YYYYMMDD) |
| roe | number \| null | | 净资产收益率(%) |
| roeWaa | number \| null | | 加权平均净资产收益率(%) |
| grossprofitMargin | number \| null | | 销售毛利率(%) |
| netprofitMargin | number \| null | | 销售净利率(%) |
| debtToAssets | number \| null | | 资产负债率(%) |
| currentRatio | number \| null | | 流动比率 |
| quickRatio | number \| null | | 速动比率 |
| eps | number \| null | | 每股收益(元) |
| bps | number \| null | | 每股净资产(元) |

**验证规则**:
- 同 IncomeStatement
- 比率字段范围: 0 ~ 100 (百分比), 或 ≥ 0 (比率)

**状态转换**: N/A (不可变数据,仅查询)

## 辅助类型

### DataStatus (数据状态)

**用途**: 标识财务数据的披露状态

```typescript
enum DataStatus {
  DISCLOSED = 'disclosed',        // 已披露
  NOT_DISCLOSED = 'not_disclosed', // 未披露
  NOT_APPLICABLE = 'not_applicable' // 不适用
}
```

### PeriodType (报告期类型)

**用途**: 区分财务报告的期间类型

```typescript
enum PeriodType {
  ANNUAL = 'annual',      // 年报
  SEMI_ANNUAL = 'semi',   // 半年报
  QUARTERLY = 'quarterly' // 季报
}
```

### FinancialDataQuery (查询参数)

**用途**: 封装财务数据查询的通用参数

```typescript
interface FinancialDataQuery {
  tsCode: string;           // 股票代码(必填)
  startDate?: string;       // 起始报告期(YYYYMMDD,可选)
  endDate?: string;         // 结束报告期(YYYYMMDD,可选)
  period?: PeriodType;      // 报告期类型(可选,不指定则返回所有类型)
  fields?: string[];        // 指定返回字段(可选,不指定则返回所有字段)
}
```

## 错误类型

### DataNotDisclosedError (数据未披露错误)

**用途**: 表示请求的报告期数据未披露

**字段**:
- `name`: 'DataNotDisclosedError'
- `message`: 描述信息
- `tsCode`: 股票代码
- `endDate`: 请求的报告期
- `status`: `DataStatus.NOT_DISCLOSED`

### AuthenticationError (认证错误)

**用途**: 表示 token 无效或过期

**字段**:
- `name`: 'AuthenticationError'
- `message`: 描述信息
- `code`: 错误码(如 40001)

### RateLimitError (限流错误)

**用途**: 表示超出 API 调用频率限制

**字段**:
- `name`: 'RateLimitError'
- `message`: 描述信息
- `retryAfter?`: 建议的重试等待时间(秒)

## 数据关系

```
FinancialDataQuery
    ↓ (查询参数)
TushareClient
    ↓ (返回)
IncomeStatement[] | BalanceSheet[] | CashFlowStatement[] | FinancialIndicator[]
    ↓ (可能抛出)
DataNotDisclosedError | AuthenticationError | RateLimitError
```

## 实现注意事项

1. **可空字段处理**: 所有数值字段均可为 `null`,表示该字段未披露或不适用,客户端代码需处理 null 值
2. **日期格式**: 统一使用 YYYYMMDD 字符串格式,便于字符串比较和排序
3. **精度处理**: 金额字段单位为"元",百分比字段单位为"%",使用时注意单位转换
4. **字段命名**: 遵循 camelCase 命名约定,与 Tushare API 原始字段名(snake_case)做映射转换
5. **不可变性**: 所有实体为只读数据,不支持修改操作

---
**状态**: ✅ 完成 | **下一步**: 生成契约文件