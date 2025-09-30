[**tushare-typescript-sdk**](../index.md)

***

[tushare-typescript-sdk](../index.md) / MemoryCache

# Class: MemoryCache

Defined in: [src/utils/cache.ts:38](https://github.com/hestudy/tushare-typescript-sdk/blob/c090018fe8d4baaa005cb4cd1e2cbe013fd57cc7/src/utils/cache.ts#L38)

内存缓存实现

使用 Map 数据结构存储缓存数据,支持 TTL 过期机制和定时清理

## Example

```typescript
const cache = new MemoryCache()

// 设置缓存
await cache.set('key1', { data: 'value' }, 3600) // 缓存1小时

// 获取缓存
const value = await cache.get('key1')

// 删除缓存
await cache.delete('key1')

// 清空所有缓存
await cache.clear()
```

## Implements

- [`CacheStorage`](../interfaces/CacheStorage.md)

## Constructors

### Constructor

> **new MemoryCache**(): `MemoryCache`

Defined in: [src/utils/cache.ts:43](https://github.com/hestudy/tushare-typescript-sdk/blob/c090018fe8d4baaa005cb4cd1e2cbe013fd57cc7/src/utils/cache.ts#L43)

#### Returns

`MemoryCache`

## Methods

### clear()

> **clear**(): `Promise`\<`void`\>

Defined in: [src/utils/cache.ts:98](https://github.com/hestudy/tushare-typescript-sdk/blob/c090018fe8d4baaa005cb4cd1e2cbe013fd57cc7/src/utils/cache.ts#L98)

清空所有缓存

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`CacheStorage`](../interfaces/CacheStorage.md).[`clear`](../interfaces/CacheStorage.md#clear)

***

### delete()

> **delete**(`key`): `Promise`\<`void`\>

Defined in: [src/utils/cache.ts:91](https://github.com/hestudy/tushare-typescript-sdk/blob/c090018fe8d4baaa005cb4cd1e2cbe013fd57cc7/src/utils/cache.ts#L91)

删除缓存值

#### Parameters

##### key

`string`

缓存键

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`CacheStorage`](../interfaces/CacheStorage.md).[`delete`](../interfaces/CacheStorage.md#delete)

***

### get()

> **get**(`key`): `Promise`\<`any`\>

Defined in: [src/utils/cache.ts:54](https://github.com/hestudy/tushare-typescript-sdk/blob/c090018fe8d4baaa005cb4cd1e2cbe013fd57cc7/src/utils/cache.ts#L54)

获取缓存值

#### Parameters

##### key

`string`

缓存键

#### Returns

`Promise`\<`any`\>

缓存值,如果不存在或已过期则返回 null

#### Implementation of

[`CacheStorage`](../interfaces/CacheStorage.md).[`get`](../interfaces/CacheStorage.md#get)

***

### set()

> **set**(`key`, `value`, `ttl`): `Promise`\<`void`\>

Defined in: [src/utils/cache.ts:77](https://github.com/hestudy/tushare-typescript-sdk/blob/c090018fe8d4baaa005cb4cd1e2cbe013fd57cc7/src/utils/cache.ts#L77)

设置缓存值

#### Parameters

##### key

`string`

缓存键

##### value

`any`

缓存值

##### ttl

`number` = `3600`

缓存过期时间(秒),默认 3600 秒 (1小时)

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`CacheStorage`](../interfaces/CacheStorage.md).[`set`](../interfaces/CacheStorage.md#set)

***

### size()

> **size**(): `number`

Defined in: [src/utils/cache.ts:150](https://github.com/hestudy/tushare-typescript-sdk/blob/c090018fe8d4baaa005cb4cd1e2cbe013fd57cc7/src/utils/cache.ts#L150)

获取当前缓存项数量 (用于测试)

#### Returns

`number`

缓存项数量
