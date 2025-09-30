[**tushare-typescript-sdk**](../index.md)

***

[tushare-typescript-sdk](../index.md) / CacheStorage

# Interface: CacheStorage

Defined in: [src/types/cache.ts:32](https://github.com/hestudy/tushare-typescript-sdk/blob/c090018fe8d4baaa005cb4cd1e2cbe013fd57cc7/src/types/cache.ts#L32)

缓存存储接口

定义缓存存储的基本操作,用户可以实现此接口来提供自定义存储(如 Redis、文件系统等)

## Example

```typescript
class RedisCache implements CacheStorage {
  async get(key: string): Promise<any | null> {
    const value = await redis.get(key);
    return value ? JSON.parse(value) : null;
  }

  async set(key: string, value: any, ttl?: number): Promise<void> {
    await redis.setex(key, ttl || 3600, JSON.stringify(value));
  }

  async delete(key: string): Promise<void> {
    await redis.del(key);
  }

  async clear(): Promise<void> {
    await redis.flushdb();
  }
}
```

## Methods

### clear()

> **clear**(): `Promise`\<`void`\>

Defined in: [src/types/cache.ts:60](https://github.com/hestudy/tushare-typescript-sdk/blob/c090018fe8d4baaa005cb4cd1e2cbe013fd57cc7/src/types/cache.ts#L60)

清空所有缓存

#### Returns

`Promise`\<`void`\>

***

### delete()

> **delete**(`key`): `Promise`\<`void`\>

Defined in: [src/types/cache.ts:55](https://github.com/hestudy/tushare-typescript-sdk/blob/c090018fe8d4baaa005cb4cd1e2cbe013fd57cc7/src/types/cache.ts#L55)

删除缓存值

#### Parameters

##### key

`string`

缓存键

#### Returns

`Promise`\<`void`\>

***

### get()

> **get**(`key`): `Promise`\<`any`\>

Defined in: [src/types/cache.ts:39](https://github.com/hestudy/tushare-typescript-sdk/blob/c090018fe8d4baaa005cb4cd1e2cbe013fd57cc7/src/types/cache.ts#L39)

获取缓存值

#### Parameters

##### key

`string`

缓存键

#### Returns

`Promise`\<`any`\>

缓存值,如果不存在或已过期则返回 null

***

### set()

> **set**(`key`, `value`, `ttl?`): `Promise`\<`void`\>

Defined in: [src/types/cache.ts:48](https://github.com/hestudy/tushare-typescript-sdk/blob/c090018fe8d4baaa005cb4cd1e2cbe013fd57cc7/src/types/cache.ts#L48)

设置缓存值

#### Parameters

##### key

`string`

缓存键

##### value

`any`

缓存值

##### ttl?

`number`

缓存过期时间(秒),可选

#### Returns

`Promise`\<`void`\>
