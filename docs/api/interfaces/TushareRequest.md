[**tushare-typescript-sdk**](../index.md)

***

[tushare-typescript-sdk](../index.md) / TushareRequest

# Interface: TushareRequest

Defined in: [src/types/api.ts:4](https://github.com/hestudy/tushare-typescript-sdk/blob/c090018fe8d4baaa005cb4cd1e2cbe013fd57cc7/src/types/api.ts#L4)

Tushare API 请求接口

## Properties

### api\_name

> **api\_name**: `string`

Defined in: [src/types/api.ts:8](https://github.com/hestudy/tushare-typescript-sdk/blob/c090018fe8d4baaa005cb4cd1e2cbe013fd57cc7/src/types/api.ts#L8)

API接口名称

***

### fields?

> `optional` **fields**: `string` \| `string`[]

Defined in: [src/types/api.ts:24](https://github.com/hestudy/tushare-typescript-sdk/blob/c090018fe8d4baaa005cb4cd1e2cbe013fd57cc7/src/types/api.ts#L24)

返回字段列表(可选)
逗号分隔的字符串或字符串数组

***

### params

> **params**: `Record`\<`string`, `unknown`\>

Defined in: [src/types/api.ts:18](https://github.com/hestudy/tushare-typescript-sdk/blob/c090018fe8d4baaa005cb4cd1e2cbe013fd57cc7/src/types/api.ts#L18)

查询参数

***

### token

> **token**: `string`

Defined in: [src/types/api.ts:13](https://github.com/hestudy/tushare-typescript-sdk/blob/c090018fe8d4baaa005cb4cd1e2cbe013fd57cc7/src/types/api.ts#L13)

认证token
