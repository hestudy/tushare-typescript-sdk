[**tushare-typescript-sdk**](../index.md)

***

[tushare-typescript-sdk](../index.md) / FinancialDataQuery

# Interface: FinancialDataQuery

Defined in: [src/types/financial.ts:200](https://github.com/hestudy/tushare-typescript-sdk/blob/c090018fe8d4baaa005cb4cd1e2cbe013fd57cc7/src/types/financial.ts#L200)

财务数据查询参数接口

封装财务数据查询的通用参数

## Properties

### endDate?

> `optional` **endDate**: `string`

Defined in: [src/types/financial.ts:208](https://github.com/hestudy/tushare-typescript-sdk/blob/c090018fe8d4baaa005cb4cd1e2cbe013fd57cc7/src/types/financial.ts#L208)

结束报告期 (可选, 格式: YYYYMMDD)

***

### fields?

> `optional` **fields**: `string`[]

Defined in: [src/types/financial.ts:214](https://github.com/hestudy/tushare-typescript-sdk/blob/c090018fe8d4baaa005cb4cd1e2cbe013fd57cc7/src/types/financial.ts#L214)

指定返回字段 (可选, 不指定则返回所有字段)

***

### period?

> `optional` **period**: [`PeriodType`](../enumerations/PeriodType.md)

Defined in: [src/types/financial.ts:211](https://github.com/hestudy/tushare-typescript-sdk/blob/c090018fe8d4baaa005cb4cd1e2cbe013fd57cc7/src/types/financial.ts#L211)

报告期类型 (可选, 不指定则返回所有类型)

***

### startDate?

> `optional` **startDate**: `string`

Defined in: [src/types/financial.ts:205](https://github.com/hestudy/tushare-typescript-sdk/blob/c090018fe8d4baaa005cb4cd1e2cbe013fd57cc7/src/types/financial.ts#L205)

起始报告期 (可选, 格式: YYYYMMDD)

***

### tsCode

> **tsCode**: `string`

Defined in: [src/types/financial.ts:202](https://github.com/hestudy/tushare-typescript-sdk/blob/c090018fe8d4baaa005cb4cd1e2cbe013fd57cc7/src/types/financial.ts#L202)

股票代码 (必填, 格式: 6位数字 + '.' + 市场代码)
