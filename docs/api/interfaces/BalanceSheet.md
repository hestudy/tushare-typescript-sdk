[**tushare-typescript-sdk**](../index.md)

***

[tushare-typescript-sdk](../index.md) / BalanceSheet

# Interface: BalanceSheet

Defined in: [src/types/financial.ts:77](https://github.com/hestudy/tushare-typescript-sdk/blob/c090018fe8d4baaa005cb4cd1e2cbe013fd57cc7/src/types/financial.ts#L77)

资产负债表接口

表示上市公司在特定日期的财务状况

## Properties

### annDate

> **annDate**: `string`

Defined in: [src/types/financial.ts:85](https://github.com/hestudy/tushare-typescript-sdk/blob/c090018fe8d4baaa005cb4cd1e2cbe013fd57cc7/src/types/financial.ts#L85)

公告日期 (格式: YYYYMMDD)

***

### endDate

> **endDate**: `string`

Defined in: [src/types/financial.ts:82](https://github.com/hestudy/tushare-typescript-sdk/blob/c090018fe8d4baaa005cb4cd1e2cbe013fd57cc7/src/types/financial.ts#L82)

报告期 (格式: YYYYMMDD)

***

### reportType

> **reportType**: `string`

Defined in: [src/types/financial.ts:88](https://github.com/hestudy/tushare-typescript-sdk/blob/c090018fe8d4baaa005cb4cd1e2cbe013fd57cc7/src/types/financial.ts#L88)

报告类型

***

### totalAssets

> **totalAssets**: `null` \| `number`

Defined in: [src/types/financial.ts:91](https://github.com/hestudy/tushare-typescript-sdk/blob/c090018fe8d4baaa005cb4cd1e2cbe013fd57cc7/src/types/financial.ts#L91)

资产总计 (元)

***

### totalCurAssets

> **totalCurAssets**: `null` \| `number`

Defined in: [src/types/financial.ts:103](https://github.com/hestudy/tushare-typescript-sdk/blob/c090018fe8d4baaa005cb4cd1e2cbe013fd57cc7/src/types/financial.ts#L103)

流动资产合计 (元)

***

### totalCurLiab

> **totalCurLiab**: `null` \| `number`

Defined in: [src/types/financial.ts:106](https://github.com/hestudy/tushare-typescript-sdk/blob/c090018fe8d4baaa005cb4cd1e2cbe013fd57cc7/src/types/financial.ts#L106)

流动负债合计 (元)

***

### totalHldrEqyExcMinInt

> **totalHldrEqyExcMinInt**: `null` \| `number`

Defined in: [src/types/financial.ts:97](https://github.com/hestudy/tushare-typescript-sdk/blob/c090018fe8d4baaa005cb4cd1e2cbe013fd57cc7/src/types/financial.ts#L97)

股东权益合计(不含少数股东权益) (元)

***

### totalHldrEqyIncMinInt

> **totalHldrEqyIncMinInt**: `null` \| `number`

Defined in: [src/types/financial.ts:100](https://github.com/hestudy/tushare-typescript-sdk/blob/c090018fe8d4baaa005cb4cd1e2cbe013fd57cc7/src/types/financial.ts#L100)

股东权益合计(含少数股东权益) (元)

***

### totalLiab

> **totalLiab**: `null` \| `number`

Defined in: [src/types/financial.ts:94](https://github.com/hestudy/tushare-typescript-sdk/blob/c090018fe8d4baaa005cb4cd1e2cbe013fd57cc7/src/types/financial.ts#L94)

负债合计 (元)

***

### totalNcaAssets

> **totalNcaAssets**: `null` \| `number`

Defined in: [src/types/financial.ts:109](https://github.com/hestudy/tushare-typescript-sdk/blob/c090018fe8d4baaa005cb4cd1e2cbe013fd57cc7/src/types/financial.ts#L109)

非流动资产合计 (元)

***

### totalNcaLiab

> **totalNcaLiab**: `null` \| `number`

Defined in: [src/types/financial.ts:112](https://github.com/hestudy/tushare-typescript-sdk/blob/c090018fe8d4baaa005cb4cd1e2cbe013fd57cc7/src/types/financial.ts#L112)

非流动负债合计 (元)

***

### tsCode

> **tsCode**: `string`

Defined in: [src/types/financial.ts:79](https://github.com/hestudy/tushare-typescript-sdk/blob/c090018fe8d4baaa005cb4cd1e2cbe013fd57cc7/src/types/financial.ts#L79)

股票代码 (格式: 6位数字 + '.' + 市场代码)
