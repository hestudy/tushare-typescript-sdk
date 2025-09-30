/**
 * 内存缓存实现
 */
import { CacheStorage } from '../types/cache'

/**
 * 缓存项接口
 */
interface CacheItem {
  /** 缓存值 */
  value: any
  /** 过期时间 (毫秒时间戳) */
  expireAt: number
}

/**
 * 内存缓存实现
 *
 * 使用 Map 数据结构存储缓存数据,支持 TTL 过期机制和定时清理
 *
 * @example
 * ```typescript
 * const cache = new MemoryCache()
 *
 * // 设置缓存
 * await cache.set('key1', { data: 'value' }, 3600) // 缓存1小时
 *
 * // 获取缓存
 * const value = await cache.get('key1')
 *
 * // 删除缓存
 * await cache.delete('key1')
 *
 * // 清空所有缓存
 * await cache.clear()
 * ```
 */
export class MemoryCache implements CacheStorage {
  private store: Map<string, CacheItem>
  private cleanupInterval: ReturnType<typeof setInterval> | null = null
  private readonly defaultCleanupIntervalMs = 60000 // 1分钟

  constructor() {
    this.store = new Map()
    this.startCleanup()
  }

  /**
   * 获取缓存值
   *
   * @param key - 缓存键
   * @returns 缓存值,如果不存在或已过期则返回 null
   */
  async get(key: string): Promise<any | null> {
    const item = this.store.get(key)

    if (!item) {
      return null
    }

    // 检查是否过期
    if (Date.now() > item.expireAt) {
      this.store.delete(key)
      return null
    }

    return item.value
  }

  /**
   * 设置缓存值
   *
   * @param key - 缓存键
   * @param value - 缓存值
   * @param ttl - 缓存过期时间(秒),默认 3600 秒 (1小时)
   */
  async set(key: string, value: any, ttl: number = 3600): Promise<void> {
    const expireAt = Date.now() + ttl * 1000

    this.store.set(key, {
      value,
      expireAt
    })
  }

  /**
   * 删除缓存值
   *
   * @param key - 缓存键
   */
  async delete(key: string): Promise<void> {
    this.store.delete(key)
  }

  /**
   * 清空所有缓存
   */
  async clear(): Promise<void> {
    this.store.clear()
  }

  /**
   * 启动定时清理过期缓存
   *
   * @private
   */
  private startCleanup(): void {
    this.cleanupInterval = setInterval(() => {
      this.cleanupExpired()
    }, this.defaultCleanupIntervalMs)

    // 避免 Node.js 进程无法退出
    if (this.cleanupInterval && typeof (this.cleanupInterval as any).unref === 'function') {
      (this.cleanupInterval as any).unref()
    }
  }

  /**
   * 清理所有过期的缓存项
   *
   * @private
   */
  private cleanupExpired(): void {
    const now = Date.now()

    for (const [key, item] of this.store.entries()) {
      if (now > item.expireAt) {
        this.store.delete(key)
      }
    }
  }

  /**
   * 停止定时清理
   *
   * @private
   */
  stopCleanup(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval)
      this.cleanupInterval = null
    }
  }

  /**
   * 获取当前缓存项数量 (用于测试)
   *
   * @returns 缓存项数量
   */
  size(): number {
    return this.store.size
  }
}
