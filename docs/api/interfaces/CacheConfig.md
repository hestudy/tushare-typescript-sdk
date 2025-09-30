[**tushare-typescript-sdk**](../index.md)

***

[tushare-typescript-sdk](../index.md) / CacheConfig

# Interface: CacheConfig

Defined in: [src/types/cache.ts:77](https://github.com/hestudy/tushare-typescript-sdk/blob/c090018fe8d4baaa005cb4cd1e2cbe013fd57cc7/src/types/cache.ts#L77)

缓存配置接口

用于配置 TushareClient 的缓存行为

## Example

```typescript
const config: CacheConfig = {
  enabled: true,
  ttl: 3600, // 缓存1小时
  storage: new MemoryCache(), // 可选,默认使用内存缓存
};
```

## Properties

### enabled

> **enabled**: `boolean`

Defined in: [src/types/cache.ts:81](https://github.com/hestudy/tushare-typescript-sdk/blob/c090018fe8d4baaa005cb4cd1e2cbe013fd57cc7/src/types/cache.ts#L81)

是否启用缓存

***

### storage?

> `optional` **storage**: [`CacheStorage`](CacheStorage.md)

Defined in: [src/types/cache.ts:95](https://github.com/hestudy/tushare-typescript-sdk/blob/c090018fe8d4baaa005cb4cd1e2cbe013fd57cc7/src/types/cache.ts#L95)

自定义缓存存储实现

如果不提供,将使用默认的内存缓存实现

***

### ttl?

> `optional` **ttl**: `number`

Defined in: [src/types/cache.ts:88](https://github.com/hestudy/tushare-typescript-sdk/blob/c090018fe8d4baaa005cb4cd1e2cbe013fd57cc7/src/types/cache.ts#L88)

缓存过期时间(秒)

#### Default

```ts
3600
```
