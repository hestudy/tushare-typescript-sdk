[**tushare-typescript-sdk**](../index.md)

***

[tushare-typescript-sdk](../index.md) / TushareClient

# Class: TushareClient

Defined in: [src/core/client.ts:24](https://github.com/hestudy/tushare-typescript-sdk/blob/c090018fe8d4baaa005cb4cd1e2cbe013fd57cc7/src/core/client.ts#L24)

Tushare SDK 主客户端类

## Constructors

### Constructor

> **new TushareClient**(`config`): `TushareClient`

Defined in: [src/core/client.ts:34](https://github.com/hestudy/tushare-typescript-sdk/blob/c090018fe8d4baaa005cb4cd1e2cbe013fd57cc7/src/core/client.ts#L34)

创建Tushare客户端实例

#### Parameters

##### config

[`ClientConfig`](../interfaces/ClientConfig.md)

#### Returns

`TushareClient`

## Methods

### daily()

> **daily**(`params`): `Promise`\<[`TushareResponse`](../interfaces/TushareResponse.md)\<[`DailyQuote`](../interfaces/DailyQuote.md)\>\>

Defined in: [src/core/client.ts:112](https://github.com/hestudy/tushare-typescript-sdk/blob/c090018fe8d4baaa005cb4cd1e2cbe013fd57cc7/src/core/client.ts#L112)

查询日线行情

#### Parameters

##### params

[`DailyParams`](../interfaces/DailyParams.md)

#### Returns

`Promise`\<[`TushareResponse`](../interfaces/TushareResponse.md)\<[`DailyQuote`](../interfaces/DailyQuote.md)\>\>

***

### getBalanceSheet()

> **getBalanceSheet**(`tsCode`, `params?`): `Promise`\<[`BalanceSheet`](../interfaces/BalanceSheet.md)[]\>

Defined in: [src/core/client.ts:229](https://github.com/hestudy/tushare-typescript-sdk/blob/c090018fe8d4baaa005cb4cd1e2cbe013fd57cc7/src/core/client.ts#L229)

查询资产负债表数据

#### Parameters

##### tsCode

`string`

股票代码 (格式: XXXXXX.SZ/SH/BJ)

##### params?

可选查询参数

###### endDate?

`string`

结束报告期 (格式: YYYYMMDD)

###### period?

`string`

报告期类型

###### startDate?

`string`

起始报告期 (格式: YYYYMMDD)

#### Returns

`Promise`\<[`BalanceSheet`](../interfaces/BalanceSheet.md)[]\>

资产负债表数据数组

#### Throws

token 无效或过期

#### Throws

超出调用频率限制

#### Throws

数据未披露

#### Example

```typescript
const client = new TushareClient({ token: 'your_token' })
const statements = await client.getBalanceSheet('000001.SZ')
```

***

### getCashFlowStatement()

> **getCashFlowStatement**(`tsCode`, `params?`): `Promise`\<[`CashFlowStatement`](../interfaces/CashFlowStatement.md)[]\>

Defined in: [src/core/client.ts:301](https://github.com/hestudy/tushare-typescript-sdk/blob/c090018fe8d4baaa005cb4cd1e2cbe013fd57cc7/src/core/client.ts#L301)

查询现金流量表数据

#### Parameters

##### tsCode

`string`

股票代码 (格式: XXXXXX.SZ/SH/BJ)

##### params?

可选查询参数

###### endDate?

`string`

结束报告期 (格式: YYYYMMDD)

###### period?

`string`

报告期类型

###### startDate?

`string`

起始报告期 (格式: YYYYMMDD)

#### Returns

`Promise`\<[`CashFlowStatement`](../interfaces/CashFlowStatement.md)[]\>

现金流量表数据数组

#### Throws

token 无效或过期

#### Throws

超出调用频率限制

#### Throws

数据未披露

#### Example

```typescript
const client = new TushareClient({ token: 'your_token' })
const statements = await client.getCashFlowStatement('000001.SZ')
```

***

### getConfig()

> **getConfig**(): [`ClientConfig`](../interfaces/ClientConfig.md)

Defined in: [src/core/client.ts:65](https://github.com/hestudy/tushare-typescript-sdk/blob/c090018fe8d4baaa005cb4cd1e2cbe013fd57cc7/src/core/client.ts#L65)

获取客户端配置

#### Returns

[`ClientConfig`](../interfaces/ClientConfig.md)

***

### getFinancialIndicators()

> **getFinancialIndicators**(`tsCode`, `params?`): `Promise`\<[`FinancialIndicator`](../interfaces/FinancialIndicator.md)[]\>

Defined in: [src/core/client.ts:373](https://github.com/hestudy/tushare-typescript-sdk/blob/c090018fe8d4baaa005cb4cd1e2cbe013fd57cc7/src/core/client.ts#L373)

查询财务指标数据

#### Parameters

##### tsCode

`string`

股票代码 (格式: XXXXXX.SZ/SH/BJ)

##### params?

可选查询参数

###### endDate?

`string`

结束报告期 (格式: YYYYMMDD)

###### period?

`string`

报告期类型

###### startDate?

`string`

起始报告期 (格式: YYYYMMDD)

#### Returns

`Promise`\<[`FinancialIndicator`](../interfaces/FinancialIndicator.md)[]\>

财务指标数据数组

#### Throws

token 无效或过期

#### Throws

超出调用频率限制

#### Throws

数据未披露

#### Example

```typescript
const client = new TushareClient({ token: 'your_token' })
const indicators = await client.getFinancialIndicators('000001.SZ')
```

***

### getIncomeStatement()

> **getIncomeStatement**(`tsCode`, `params?`): `Promise`\<[`IncomeStatement`](../interfaces/IncomeStatement.md)[]\>

Defined in: [src/core/client.ts:157](https://github.com/hestudy/tushare-typescript-sdk/blob/c090018fe8d4baaa005cb4cd1e2cbe013fd57cc7/src/core/client.ts#L157)

查询利润表数据

#### Parameters

##### tsCode

`string`

股票代码 (格式: XXXXXX.SZ/SH/BJ)

##### params?

可选查询参数

###### endDate?

`string`

结束报告期 (格式: YYYYMMDD)

###### period?

`string`

报告期类型

###### startDate?

`string`

起始报告期 (格式: YYYYMMDD)

#### Returns

`Promise`\<[`IncomeStatement`](../interfaces/IncomeStatement.md)[]\>

利润表数据数组

#### Throws

token 无效或过期

#### Throws

超出调用频率限制

#### Throws

数据未披露

#### Example

```typescript
const client = new TushareClient({ token: 'your_token' })

// 查询指定股票的所有利润表数据
const statements = await client.getIncomeStatement('000001.SZ')

// 查询指定日期范围的利润表数据
const statements2 = await client.getIncomeStatement('000001.SZ', {
  startDate: '20230101',
  endDate: '20231231'
})
```

***

### isReady()

> **isReady**(): `boolean`

Defined in: [src/core/client.ts:58](https://github.com/hestudy/tushare-typescript-sdk/blob/c090018fe8d4baaa005cb4cd1e2cbe013fd57cc7/src/core/client.ts#L58)

检查客户端是否就绪

#### Returns

`boolean`

***

### query()

> **query**\<`T`\>(`request`): `Promise`\<[`TushareResponse`](../interfaces/TushareResponse.md)\<`T`\>\>

Defined in: [src/core/client.ts:80](https://github.com/hestudy/tushare-typescript-sdk/blob/c090018fe8d4baaa005cb4cd1e2cbe013fd57cc7/src/core/client.ts#L80)

通用查询方法

#### Type Parameters

##### T

`T`

#### Parameters

##### request

`Omit`\<[`TushareRequest`](../interfaces/TushareRequest.md), `"token"`\>

#### Returns

`Promise`\<[`TushareResponse`](../interfaces/TushareResponse.md)\<`T`\>\>

***

### realtimeQuote()

> **realtimeQuote**(`params`): `Promise`\<[`TushareResponse`](../interfaces/TushareResponse.md)\<[`RealtimeQuote`](../interfaces/RealtimeQuote.md)\>\>

Defined in: [src/core/client.ts:122](https://github.com/hestudy/tushare-typescript-sdk/blob/c090018fe8d4baaa005cb4cd1e2cbe013fd57cc7/src/core/client.ts#L122)

查询实时行情

#### Parameters

##### params

[`RealtimeParams`](../interfaces/RealtimeParams.md)

#### Returns

`Promise`\<[`TushareResponse`](../interfaces/TushareResponse.md)\<[`RealtimeQuote`](../interfaces/RealtimeQuote.md)\>\>

***

### updateTimeout()

> **updateTimeout**(`timeout`): `void`

Defined in: [src/core/client.ts:72](https://github.com/hestudy/tushare-typescript-sdk/blob/c090018fe8d4baaa005cb4cd1e2cbe013fd57cc7/src/core/client.ts#L72)

更新超时时间

#### Parameters

##### timeout

`number`

#### Returns

`void`
