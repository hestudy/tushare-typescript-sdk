import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { MemoryCache } from '../../src/utils/cache'

describe('MemoryCache', () => {
  let cache: MemoryCache

  beforeEach(() => {
    cache = new MemoryCache()
  })

  afterEach(() => {
    cache.stopCleanup()
  })

  describe('基础功能', () => {
    it('应该能够设置和获取缓存', async () => {
      await cache.set('key1', 'value1')
      const value = await cache.get('key1')
      expect(value).toBe('value1')
    })

    it('应该能够存储各种类型的值', async () => {
      const testCases = [
        { key: 'string', value: 'test' },
        { key: 'number', value: 123 },
        { key: 'boolean', value: true },
        { key: 'object', value: { a: 1, b: 2 } },
        { key: 'array', value: [1, 2, 3] },
        { key: 'null', value: null }
      ]

      for (const { key, value } of testCases) {
        await cache.set(key, value)
        const retrieved = await cache.get(key)
        expect(retrieved).toEqual(value)
      }
    })

    it('应该在键不存在时返回 null', async () => {
      const value = await cache.get('non-existent')
      expect(value).toBeNull()
    })

    it('应该能够删除缓存', async () => {
      await cache.set('key1', 'value1')
      await cache.delete('key1')
      const value = await cache.get('key1')
      expect(value).toBeNull()
    })

    it('应该能够清空所有缓存', async () => {
      await cache.set('key1', 'value1')
      await cache.set('key2', 'value2')
      await cache.set('key3', 'value3')

      expect(cache.size()).toBe(3)

      await cache.clear()

      expect(cache.size()).toBe(0)
      expect(await cache.get('key1')).toBeNull()
      expect(await cache.get('key2')).toBeNull()
      expect(await cache.get('key3')).toBeNull()
    })

    it('应该能够覆盖已存在的缓存', async () => {
      await cache.set('key1', 'value1')
      await cache.set('key1', 'value2')
      const value = await cache.get('key1')
      expect(value).toBe('value2')
    })
  })

  describe('TTL 过期机制', () => {
    it('应该使用默认 TTL (3600秒)', async () => {
      const now = Date.now()
      await cache.set('key1', 'value1')

      // 验证缓存在有效期内可以获取
      const value = await cache.get('key1')
      expect(value).toBe('value1')

      // 验证缓存时间设置正确(默认1小时后过期)
      const item = (cache as any).store.get('key1')
      expect(item.expireAt).toBeGreaterThan(now + 3599 * 1000)
      expect(item.expireAt).toBeLessThan(now + 3601 * 1000)
    })

    it('应该支持自定义 TTL', async () => {
      const now = Date.now()
      await cache.set('key1', 'value1', 60) // 60秒

      const item = (cache as any).store.get('key1')
      expect(item.expireAt).toBeGreaterThan(now + 59 * 1000)
      expect(item.expireAt).toBeLessThan(now + 61 * 1000)
    })

    it('应该在过期后返回 null', async () => {
      // 设置一个很短的 TTL
      await cache.set('key1', 'value1', 0.001) // 1毫秒

      // 等待过期
      await new Promise(resolve => setTimeout(resolve, 10))

      const value = await cache.get('key1')
      expect(value).toBeNull()
    })

    it('应该在过期后自动删除缓存项', async () => {
      await cache.set('key1', 'value1', 0.001) // 1毫秒
      expect(cache.size()).toBe(1)

      // 等待过期
      await new Promise(resolve => setTimeout(resolve, 10))

      // 访问过期的缓存会触发删除
      await cache.get('key1')
      expect(cache.size()).toBe(0)
    })

    it('应该只过期指定的缓存项', async () => {
      await cache.set('key1', 'value1', 0.001) // 1毫秒
      await cache.set('key2', 'value2', 3600) // 1小时

      // 等待 key1 过期
      await new Promise(resolve => setTimeout(resolve, 10))

      expect(await cache.get('key1')).toBeNull()
      expect(await cache.get('key2')).toBe('value2')
      expect(cache.size()).toBe(1)
    })
  })

  describe('定时清理机制', () => {
    it('应该定时清理过期的缓存项', async () => {
      // 创建一个新的 cache 实例以便控制清理间隔
      const testCache = new MemoryCache()

      try {
        // 设置多个过期时间很短的缓存项
        await testCache.set('key1', 'value1', 0.001)
        await testCache.set('key2', 'value2', 0.001)
        await testCache.set('key3', 'value3', 3600)

        expect(testCache.size()).toBe(3)

        // 等待缓存过期
        await new Promise(resolve => setTimeout(resolve, 10))

        // 手动触发清理
        ;(testCache as any).cleanupExpired()

        // 过期的缓存应该被清理
        expect(testCache.size()).toBe(1)
        expect(await testCache.get('key1')).toBeNull()
        expect(await testCache.get('key2')).toBeNull()
        expect(await testCache.get('key3')).toBe('value3')
      } finally {
        testCache.stopCleanup()
      }
    })

    it('应该能够停止定时清理', () => {
      const cleanupInterval = (cache as any).cleanupInterval
      expect(cleanupInterval).not.toBeNull()

      cache.stopCleanup()

      expect((cache as any).cleanupInterval).toBeNull()
    })

    it('应该支持多次调用 stopCleanup', () => {
      cache.stopCleanup()
      cache.stopCleanup()

      expect((cache as any).cleanupInterval).toBeNull()
    })
  })

  describe('边界情况', () => {
    it('应该处理空字符串键', async () => {
      await cache.set('', 'empty-key-value')
      const value = await cache.get('')
      expect(value).toBe('empty-key-value')
    })

    it('应该处理 TTL 为 0', async () => {
      await cache.set('key1', 'value1', 0)

      // 等待一小段时间确保过期
      await new Promise(resolve => setTimeout(resolve, 10))

      // 立即过期
      const value = await cache.get('key1')
      expect(value).toBeNull()
    })

    it('应该处理负数 TTL', async () => {
      await cache.set('key1', 'value1', -1)

      // 立即过期
      const value = await cache.get('key1')
      expect(value).toBeNull()
    })

    it('应该处理非常大的 TTL', async () => {
      const largeTTL = 999999999 // 约31年
      await cache.set('key1', 'value1', largeTTL)

      const value = await cache.get('key1')
      expect(value).toBe('value1')
    })

    it('应该正确报告缓存大小', async () => {
      expect(cache.size()).toBe(0)

      await cache.set('key1', 'value1')
      expect(cache.size()).toBe(1)

      await cache.set('key2', 'value2')
      expect(cache.size()).toBe(2)

      await cache.delete('key1')
      expect(cache.size()).toBe(1)

      await cache.clear()
      expect(cache.size()).toBe(0)
    })

    it('删除不存在的键应该不报错', async () => {
      await expect(cache.delete('non-existent')).resolves.toBeUndefined()
    })
  })

  describe('并发操作', () => {
    it('应该支持并发读写操作', async () => {
      const operations = []

      // 并发写入
      for (let i = 0; i < 10; i++) {
        operations.push(cache.set(`key${i}`, `value${i}`))
      }

      await Promise.all(operations)

      expect(cache.size()).toBe(10)

      // 并发读取
      const readOperations = []
      for (let i = 0; i < 10; i++) {
        readOperations.push(cache.get(`key${i}`))
      }

      const results = await Promise.all(readOperations)

      results.forEach((value, index) => {
        expect(value).toBe(`value${index}`)
      })
    })

    it('应该支持并发删除操作', async () => {
      // 先写入数据
      for (let i = 0; i < 10; i++) {
        await cache.set(`key${i}`, `value${i}`)
      }

      // 并发删除
      const deleteOperations = []
      for (let i = 0; i < 10; i++) {
        deleteOperations.push(cache.delete(`key${i}`))
      }

      await Promise.all(deleteOperations)

      expect(cache.size()).toBe(0)
    })
  })
})