[**tushare-typescript-sdk**](../index.md)

***

[tushare-typescript-sdk](../index.md) / IncomeStatement

# Interface: IncomeStatement

Defined in: [src/types/financial.ts:34](https://github.com/hestudy/tushare-typescript-sdk/blob/c090018fe8d4baaa005cb4cd1e2cbe013fd57cc7/src/types/financial.ts#L34)

利润表接口

表示上市公司在特定报告期的经营成果

## Properties

### annDate

> **annDate**: `string`

Defined in: [src/types/financial.ts:42](https://github.com/hestudy/tushare-typescript-sdk/blob/c090018fe8d4baaa005cb4cd1e2cbe013fd57cc7/src/types/financial.ts#L42)

公告日期 (格式: YYYYMMDD)

***

### basicEps

> **basicEps**: `null` \| `number`

Defined in: [src/types/financial.ts:66](https://github.com/hestudy/tushare-typescript-sdk/blob/c090018fe8d4baaa005cb4cd1e2cbe013fd57cc7/src/types/financial.ts#L66)

基本每股收益 (元)

***

### dilutedEps

> **dilutedEps**: `null` \| `number`

Defined in: [src/types/financial.ts:69](https://github.com/hestudy/tushare-typescript-sdk/blob/c090018fe8d4baaa005cb4cd1e2cbe013fd57cc7/src/types/financial.ts#L69)

稀释每股收益 (元)

***

### endDate

> **endDate**: `string`

Defined in: [src/types/financial.ts:39](https://github.com/hestudy/tushare-typescript-sdk/blob/c090018fe8d4baaa005cb4cd1e2cbe013fd57cc7/src/types/financial.ts#L39)

报告期 (格式: YYYYMMDD)

***

### nIncome

> **nIncome**: `null` \| `number`

Defined in: [src/types/financial.ts:60](https://github.com/hestudy/tushare-typescript-sdk/blob/c090018fe8d4baaa005cb4cd1e2cbe013fd57cc7/src/types/financial.ts#L60)

净利润 (元)

***

### nIncomeAttrP

> **nIncomeAttrP**: `null` \| `number`

Defined in: [src/types/financial.ts:63](https://github.com/hestudy/tushare-typescript-sdk/blob/c090018fe8d4baaa005cb4cd1e2cbe013fd57cc7/src/types/financial.ts#L63)

归属于母公司所有者的净利润 (元)

***

### operateProfit

> **operateProfit**: `null` \| `number`

Defined in: [src/types/financial.ts:54](https://github.com/hestudy/tushare-typescript-sdk/blob/c090018fe8d4baaa005cb4cd1e2cbe013fd57cc7/src/types/financial.ts#L54)

营业利润 (元)

***

### reportType

> **reportType**: `string`

Defined in: [src/types/financial.ts:45](https://github.com/hestudy/tushare-typescript-sdk/blob/c090018fe8d4baaa005cb4cd1e2cbe013fd57cc7/src/types/financial.ts#L45)

报告类型 (1=合并报表, 2=单季合并, 3=调整单季合并, 5=调整合并)

***

### revenue

> **revenue**: `null` \| `number`

Defined in: [src/types/financial.ts:51](https://github.com/hestudy/tushare-typescript-sdk/blob/c090018fe8d4baaa005cb4cd1e2cbe013fd57cc7/src/types/financial.ts#L51)

营业收入 (元)

***

### totalProfit

> **totalProfit**: `null` \| `number`

Defined in: [src/types/financial.ts:57](https://github.com/hestudy/tushare-typescript-sdk/blob/c090018fe8d4baaa005cb4cd1e2cbe013fd57cc7/src/types/financial.ts#L57)

利润总额 (元)

***

### totalRevenue

> **totalRevenue**: `null` \| `number`

Defined in: [src/types/financial.ts:48](https://github.com/hestudy/tushare-typescript-sdk/blob/c090018fe8d4baaa005cb4cd1e2cbe013fd57cc7/src/types/financial.ts#L48)

营业总收入 (元)

***

### tsCode

> **tsCode**: `string`

Defined in: [src/types/financial.ts:36](https://github.com/hestudy/tushare-typescript-sdk/blob/c090018fe8d4baaa005cb4cd1e2cbe013fd57cc7/src/types/financial.ts#L36)

股票代码 (格式: 6位数字 + '.' + 市场代码, 如 '000001.SZ')
