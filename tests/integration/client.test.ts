import { describe, it, expect, beforeEach } from 'vitest'
import { server, createSuccessHandler } from '../../vitest.setup'
import { TushareClient } from '../../src/core/client'

describe('Client Integration Tests', () => {
  let client: TushareClient

  describe('客户端初始化', () => {
    it('应该成功初始化客户端', () => {
      client = new TushareClient({
        token: 'test_token_32_characters_long_000',
        timeout: 5000,
        debug: false
      })

      expect(client).toBeDefined()
      expect(client.isReady()).toBe(true)
    })

    it('应该使用默认配置', () => {
      client = new TushareClient({ token: 'test_token_32_characters_long_000' })

      expect(client).toBeDefined()
      expect(client.isReady()).toBe(true)
    })
  })

  describe('查询单个股票日线数据', () => {
    beforeEach(() => {
      client = new TushareClient({ token: 'test_token_32_characters_long_000' })
    })

    it('应该成功查询单个股票的日线数据', async () => {
      server.use(
        createSuccessHandler('daily', {
          fields: ['ts_code', 'trade_date', 'open', 'high', 'low', 'close', 'pre_close', 'change', 'pct_chg', 'vol', 'amount'],
          items: [
            ['000001.SZ', '20250930', 15.23, 15.98, 15.10, 15.67, 15.20, 0.47, 3.09, 123456.0, 1890000.0]
          ]
        })
      )

      const response = await client.daily({ ts_code: '000001.SZ' })

      expect(response.success).toBe(true)
      expect(response.data).toBeDefined()
      expect(response.data?.length).toBe(1)
      expect(response.data?.[0].ts_code).toBe('000001.SZ')
    })
  })

  describe('查询日期范围的日线数据', () => {
    beforeEach(() => {
      client = new TushareClient({ token: 'test_token_32_characters_long_000' })
    })

    it('应该成功查询日期范围内的日线数据', async () => {
      server.use(
        createSuccessHandler('daily', {
          fields: ['ts_code', 'trade_date', 'open', 'high', 'low', 'close', 'pre_close', 'change', 'pct_chg', 'vol', 'amount'],
          items: [
            ['000001.SZ', '20250901', 15.0, 15.5, 14.9, 15.3, 15.0, 0.3, 2.0, 100000.0, 1500000.0],
            ['000001.SZ', '20250902', 15.3, 15.8, 15.2, 15.6, 15.3, 0.3, 1.96, 110000.0, 1700000.0],
            ['000001.SZ', '20250903', 15.6, 16.0, 15.5, 15.9, 15.6, 0.3, 1.92, 120000.0, 1900000.0]
          ]
        })
      )

      const response = await client.daily({
        ts_code: '000001.SZ',
        start_date: '20250901',
        end_date: '20250903'
      })

      expect(response.success).toBe(true)
      expect(response.data?.length).toBe(3)
    })
  })

  describe('查询实时行情', () => {
    beforeEach(() => {
      client = new TushareClient({ token: 'test_token_32_characters_long_000' })
    })

    it('应该成功查询单个股票实时行情', async () => {
      server.use(
        createSuccessHandler('realtime_quote', {
          fields: ['ts_code', 'name', 'price', 'open', 'high', 'low', 'pre_close', 'volume', 'amount'],
          items: [
            ['000001.SZ', '平安银行', 15.67, 15.23, 15.98, 15.10, 15.20, 12345678.0, 189000000.0]
          ]
        })
      )

      const response = await client.realtimeQuote({ ts_code: '000001.SZ' })

      expect(response.success).toBe(true)
      expect(response.data).toBeDefined()
      expect(response.data?.length).toBe(1)
      expect(response.data?.[0].name).toBe('平安银行')
    })
  })

  describe('批量查询实时行情', () => {
    beforeEach(() => {
      client = new TushareClient({ token: 'test_token_32_characters_long_000' })
    })

    it('应该成功批量查询多个股票实时行情', async () => {
      server.use(
        createSuccessHandler('realtime_quote', {
          fields: ['ts_code', 'name', 'price', 'open', 'high', 'low', 'pre_close', 'volume', 'amount'],
          items: [
            ['000001.SZ', '平安银行', 15.67, 15.23, 15.98, 15.10, 15.20, 12345678.0, 189000000.0],
            ['600000.SH', '浦发银行', 8.90, 8.75, 9.10, 8.70, 8.80, 98765432.0, 876543210.0],
            ['600519.SH', '贵州茅台', 1680.50, 1675.00, 1690.00, 1670.00, 1680.00, 1234567.0, 2070987654.0]
          ]
        })
      )

      const response = await client.realtimeQuote({ ts_code: '000001.SZ,600000.SH,600519.SH' })

      expect(response.success).toBe(true)
      expect(response.data?.length).toBe(3)
    })
  })

  describe('响应数据结构化转换', () => {
    beforeEach(() => {
      client = new TushareClient({ token: 'test_token_32_characters_long_000' })
    })

    it('应该正确转换 raw 数据为结构化数据', async () => {
      server.use(
        createSuccessHandler('daily', {
          fields: ['ts_code', 'trade_date', 'open', 'high', 'low', 'close', 'pre_close', 'change', 'pct_chg', 'vol', 'amount'],
          items: [
            ['000001.SZ', '20250930', 15.23, 15.98, 15.10, 15.67, 15.20, 0.47, 3.09, 123456.0, 1890000.0]
          ]
        })
      )

      const response = await client.daily({ ts_code: '000001.SZ' })

      // 验证原始数据存在
      expect(response.raw).toBeDefined()
      expect(response.raw?.fields).toHaveLength(11)
      expect(response.raw?.items).toHaveLength(1)

      // 验证结构化数据存在且正确
      expect(response.data).toBeDefined()
      expect(response.data?.length).toBe(1)

      const quote = response.data?.[0]
      expect(quote?.ts_code).toBe('000001.SZ')
      expect(quote?.trade_date).toBe('20250930')
      expect(quote?.close).toBe(15.67)
    })
  })

  describe('isReady 状态检查', () => {
    it('应该返回客户端就绪状态', () => {
      const client = new TushareClient({ token: 'test_token_32_characters_long_000' })
      expect(client.isReady()).toBe(true)
    })
  })
})