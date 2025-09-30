[**tushare-typescript-sdk**](../index.md)

***

[tushare-typescript-sdk](../index.md) / CashFlowStatement

# Interface: CashFlowStatement

Defined in: [src/types/financial.ts:120](https://github.com/hestudy/tushare-typescript-sdk/blob/c090018fe8d4baaa005cb4cd1e2cbe013fd57cc7/src/types/financial.ts#L120)

现金流量表接口

表示上市公司在特定期间的现金流入流出情况

## Properties

### annDate

> **annDate**: `string`

Defined in: [src/types/financial.ts:128](https://github.com/hestudy/tushare-typescript-sdk/blob/c090018fe8d4baaa005cb4cd1e2cbe013fd57cc7/src/types/financial.ts#L128)

公告日期 (格式: YYYYMMDD)

***

### cCashEquBegPeriod

> **cCashEquBegPeriod**: `null` \| `number`

Defined in: [src/types/financial.ts:146](https://github.com/hestudy/tushare-typescript-sdk/blob/c090018fe8d4baaa005cb4cd1e2cbe013fd57cc7/src/types/financial.ts#L146)

期初现金及现金等价物余额 (元)

***

### cCashEquEndPeriod

> **cCashEquEndPeriod**: `null` \| `number`

Defined in: [src/types/financial.ts:143](https://github.com/hestudy/tushare-typescript-sdk/blob/c090018fe8d4baaa005cb4cd1e2cbe013fd57cc7/src/types/financial.ts#L143)

期末现金及现金等价物余额 (元)

***

### endDate

> **endDate**: `string`

Defined in: [src/types/financial.ts:125](https://github.com/hestudy/tushare-typescript-sdk/blob/c090018fe8d4baaa005cb4cd1e2cbe013fd57cc7/src/types/financial.ts#L125)

报告期 (格式: YYYYMMDD)

***

### nCashflowAct

> **nCashflowAct**: `null` \| `number`

Defined in: [src/types/financial.ts:134](https://github.com/hestudy/tushare-typescript-sdk/blob/c090018fe8d4baaa005cb4cd1e2cbe013fd57cc7/src/types/financial.ts#L134)

经营活动产生的现金流量净额 (元)

***

### nCashflowInvAct

> **nCashflowInvAct**: `null` \| `number`

Defined in: [src/types/financial.ts:137](https://github.com/hestudy/tushare-typescript-sdk/blob/c090018fe8d4baaa005cb4cd1e2cbe013fd57cc7/src/types/financial.ts#L137)

投资活动产生的现金流量净额 (元)

***

### nCashFlowsFncAct

> **nCashFlowsFncAct**: `null` \| `number`

Defined in: [src/types/financial.ts:140](https://github.com/hestudy/tushare-typescript-sdk/blob/c090018fe8d4baaa005cb4cd1e2cbe013fd57cc7/src/types/financial.ts#L140)

筹资活动产生的现金流量净额 (元)

***

### nIncrCashCashEqu

> **nIncrCashCashEqu**: `null` \| `number`

Defined in: [src/types/financial.ts:149](https://github.com/hestudy/tushare-typescript-sdk/blob/c090018fe8d4baaa005cb4cd1e2cbe013fd57cc7/src/types/financial.ts#L149)

现金及现金等价物净增加额 (元)

***

### reportType

> **reportType**: `string`

Defined in: [src/types/financial.ts:131](https://github.com/hestudy/tushare-typescript-sdk/blob/c090018fe8d4baaa005cb4cd1e2cbe013fd57cc7/src/types/financial.ts#L131)

报告类型

***

### tsCode

> **tsCode**: `string`

Defined in: [src/types/financial.ts:122](https://github.com/hestudy/tushare-typescript-sdk/blob/c090018fe8d4baaa005cb4cd1e2cbe013fd57cc7/src/types/financial.ts#L122)

股票代码 (格式: 6位数字 + '.' + 市场代码)
