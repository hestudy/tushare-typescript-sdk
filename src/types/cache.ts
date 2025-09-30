/**
 * 缓存相关类型定义
 */

/**
 * 缓存存储接口
 *
 * 定义缓存存储的基本操作,用户可以实现此接口来提供自定义存储(如 Redis、文件系统等)
 *
 * @example
 * ```typescript
 * class RedisCache implements CacheStorage {
 *   async get(key: string): Promise<any | null> {
 *     const value = await redis.get(key);
 *     return value ? JSON.parse(value) : null;
 *   }
 *
 *   async set(key: string, value: any, ttl?: number): Promise<void> {
 *     await redis.setex(key, ttl || 3600, JSON.stringify(value));
 *   }
 *
 *   async delete(key: string): Promise<void> {
 *     await redis.del(key);
 *   }
 *
 *   async clear(): Promise<void> {
 *     await redis.flushdb();
 *   }
 * }
 * ```
 */
export interface CacheStorage {
  /**
   * 获取缓存值
   *
   * @param key - 缓存键
   * @returns 缓存值,如果不存在或已过期则返回 null
   */
  get(key: string): Promise<any | null>

  /**
   * 设置缓存值
   *
   * @param key - 缓存键
   * @param value - 缓存值
   * @param ttl - 缓存过期时间(秒),可选
   */
  set(key: string, value: any, ttl?: number): Promise<void>

  /**
   * 删除缓存值
   *
   * @param key - 缓存键
   */
  delete(key: string): Promise<void>

  /**
   * 清空所有缓存
   */
  clear(): Promise<void>
}

/**
 * 缓存配置接口
 *
 * 用于配置 TushareClient 的缓存行为
 *
 * @example
 * ```typescript
 * const config: CacheConfig = {
 *   enabled: true,
 *   ttl: 3600, // 缓存1小时
 *   storage: new MemoryCache(), // 可选,默认使用内存缓存
 * };
 * ```
 */
export interface CacheConfig {
  /**
   * 是否启用缓存
   */
  enabled: boolean

  /**
   * 缓存过期时间(秒)
   *
   * @default 3600
   */
  ttl?: number

  /**
   * 自定义缓存存储实现
   *
   * 如果不提供,将使用默认的内存缓存实现
   */
  storage?: CacheStorage
}
