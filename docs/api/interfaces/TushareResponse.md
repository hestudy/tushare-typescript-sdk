[**tushare-typescript-sdk**](../index.md)

***

[tushare-typescript-sdk](../index.md) / TushareResponse

# Interface: TushareResponse\<T\>

Defined in: [src/types/api.ts:58](https://github.com/hestudy/tushare-typescript-sdk/blob/c090018fe8d4baaa005cb4cd1e2cbe013fd57cc7/src/types/api.ts#L58)

Tushare API 结构化响应接口

## Type Parameters

### T

`T`

## Properties

### code

> **code**: `number`

Defined in: [src/types/api.ts:62](https://github.com/hestudy/tushare-typescript-sdk/blob/c090018fe8d4baaa005cb4cd1e2cbe013fd57cc7/src/types/api.ts#L62)

响应代码

***

### data

> **data**: `null` \| `T`[]

Defined in: [src/types/api.ts:80](https://github.com/hestudy/tushare-typescript-sdk/blob/c090018fe8d4baaa005cb4cd1e2cbe013fd57cc7/src/types/api.ts#L80)

结构化数据(对象数组)

***

### msg

> **msg**: `null` \| `string`

Defined in: [src/types/api.ts:67](https://github.com/hestudy/tushare-typescript-sdk/blob/c090018fe8d4baaa005cb4cd1e2cbe013fd57cc7/src/types/api.ts#L67)

响应消息

***

### raw

> **raw**: `null` \| \{ `fields`: `string`[]; `items`: `unknown`[][]; \}

Defined in: [src/types/api.ts:72](https://github.com/hestudy/tushare-typescript-sdk/blob/c090018fe8d4baaa005cb4cd1e2cbe013fd57cc7/src/types/api.ts#L72)

原始数据(fields + items格式)

***

### success

> **success**: `boolean`

Defined in: [src/types/api.ts:85](https://github.com/hestudy/tushare-typescript-sdk/blob/c090018fe8d4baaa005cb4cd1e2cbe013fd57cc7/src/types/api.ts#L85)

是否成功
