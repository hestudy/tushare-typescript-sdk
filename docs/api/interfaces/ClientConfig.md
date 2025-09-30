[**tushare-typescript-sdk**](../index.md)

***

[tushare-typescript-sdk](../index.md) / ClientConfig

# Interface: ClientConfig

Defined in: [src/types/config.ts:6](https://github.com/hestudy/tushare-typescript-sdk/blob/c090018fe8d4baaa005cb4cd1e2cbe013fd57cc7/src/types/config.ts#L6)

Tushare客户端配置接口

## Properties

### baseUrl?

> `optional` **baseUrl**: `string`

Defined in: [src/types/config.ts:17](https://github.com/hestudy/tushare-typescript-sdk/blob/c090018fe8d4baaa005cb4cd1e2cbe013fd57cc7/src/types/config.ts#L17)

API基础URL (可选)

#### Default

```ts
"http://api.tushare.pro"
```

***

### cache?

> `optional` **cache**: [`CacheConfig`](CacheConfig.md)

Defined in: [src/types/config.ts:35](https://github.com/hestudy/tushare-typescript-sdk/blob/c090018fe8d4baaa005cb4cd1e2cbe013fd57cc7/src/types/config.ts#L35)

缓存配置 (可选)

#### Default

```ts
undefined (不启用缓存)
```

***

### debug?

> `optional` **debug**: `boolean`

Defined in: [src/types/config.ts:29](https://github.com/hestudy/tushare-typescript-sdk/blob/c090018fe8d4baaa005cb4cd1e2cbe013fd57cc7/src/types/config.ts#L29)

是否启用调试日志 (可选)

#### Default

```ts
false
```

***

### timeout?

> `optional` **timeout**: `number`

Defined in: [src/types/config.ts:23](https://github.com/hestudy/tushare-typescript-sdk/blob/c090018fe8d4baaa005cb4cd1e2cbe013fd57cc7/src/types/config.ts#L23)

请求超时时间(毫秒) (可选)

#### Default

```ts
5000
```

***

### token

> **token**: `string`

Defined in: [src/types/config.ts:11](https://github.com/hestudy/tushare-typescript-sdk/blob/c090018fe8d4baaa005cb4cd1e2cbe013fd57cc7/src/types/config.ts#L11)

Tushare API token (必填)
从 https://tushare.pro 用户中心获取
