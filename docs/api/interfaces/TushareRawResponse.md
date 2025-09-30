[**tushare-typescript-sdk**](../index.md)

***

[tushare-typescript-sdk](../index.md) / TushareRawResponse

# Interface: TushareRawResponse

Defined in: [src/types/api.ts:30](https://github.com/hestudy/tushare-typescript-sdk/blob/c090018fe8d4baaa005cb4cd1e2cbe013fd57cc7/src/types/api.ts#L30)

Tushare API 原始响应接口

## Properties

### code

> **code**: `number`

Defined in: [src/types/api.ts:37](https://github.com/hestudy/tushare-typescript-sdk/blob/c090018fe8d4baaa005cb4cd1e2cbe013fd57cc7/src/types/api.ts#L37)

响应代码
0: 成功
2002: 权限/认证错误
其他非0值: 系统错误

***

### data

> **data**: `null` \| \{ `fields`: `string`[]; `items`: `unknown`[][]; \}

Defined in: [src/types/api.ts:49](https://github.com/hestudy/tushare-typescript-sdk/blob/c090018fe8d4baaa005cb4cd1e2cbe013fd57cc7/src/types/api.ts#L49)

响应数据
成功时包含fields和items,失败时为null

***

### msg

> **msg**: `null` \| `string`

Defined in: [src/types/api.ts:43](https://github.com/hestudy/tushare-typescript-sdk/blob/c090018fe8d4baaa005cb4cd1e2cbe013fd57cc7/src/types/api.ts#L43)

响应消息
成功时为null,失败时包含错误信息
