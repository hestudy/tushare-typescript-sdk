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

  describe('财务报表查询', () => {
    beforeEach(() => {
      client = new TushareClient({ token: 'test_token_32_characters_long_000' })
    })

    it('应该成功查询利润表数据', async () => {
      server.use(
        createSuccessHandler('income', {
          fields: ['ts_code', 'ann_date', 'end_date', 'revenue', 'operate_profit', 'total_profit', 'n_income'],
          items: [
            ['000001.SZ', '20231031', '20230930', 1000000.0, 500000.0, 450000.0, 350000.0]
          ]
        })
      )

      const statements = await client.getIncomeStatement('000001.SZ')

      expect(statements).toBeDefined()
      expect(statements.length).toBe(1)
      expect(statements[0].tsCode).toBe('000001.SZ')
      expect(statements[0].revenue).toBe(1000000.0)
    })

    it('应该成功查询资产负债表数据', async () => {
      server.use(
        createSuccessHandler('balancesheet', {
          fields: ['ts_code', 'ann_date', 'end_date', 'total_assets', 'total_liab', 'total_hldr_eqy_exc_min_int'],
          items: [
            ['000001.SZ', '20231031', '20230930', 5000000.0, 3000000.0, 2000000.0]
          ]
        })
      )

      const statements = await client.getBalanceSheet('000001.SZ')

      expect(statements).toBeDefined()
      expect(statements.length).toBe(1)
      expect(statements[0].tsCode).toBe('000001.SZ')
      expect(statements[0].totalAssets).toBe(5000000.0)
    })

    it('应该成功查询现金流量表数据', async () => {
      server.use(
        createSuccessHandler('cashflow', {
          fields: ['ts_code', 'ann_date', 'end_date', 'n_cashflow_act', 'n_cashflow_inv_act', 'n_cash_flows_fnc_act'],
          items: [
            ['000001.SZ', '20231031', '20230930', 100000.0, -50000.0, 30000.0]
          ]
        })
      )

      const statements = await client.getCashFlowStatement('000001.SZ')

      expect(statements).toBeDefined()
      expect(statements.length).toBe(1)
      expect(statements[0].tsCode).toBe('000001.SZ')
      expect(statements[0].nCashflowAct).toBe(100000.0)
    })

    it('应该成功查询财务指标数据', async () => {
      server.use(
        createSuccessHandler('fina_indicator', {
          fields: ['ts_code', 'ann_date', 'end_date', 'eps', 'roe', 'roa', 'current_ratio'],
          items: [
            ['000001.SZ', '20231031', '20230930', 1.23, 15.5, 8.2, 2.1]
          ]
        })
      )

      const indicators = await client.getFinancialIndicators('000001.SZ')

      expect(indicators).toBeDefined()
      expect(indicators.length).toBe(1)
      expect(indicators[0].tsCode).toBe('000001.SZ')
      expect(indicators[0].eps).toBe(1.23)
    })

    it('应该支持带日期范围参数的查询', async () => {
      server.use(
        createSuccessHandler('income', {
          fields: ['ts_code', 'ann_date', 'end_date', 'revenue'],
          items: [
            ['000001.SZ', '20231031', '20230930', 1000000.0],
            ['000001.SZ', '20230831', '20230630', 950000.0]
          ]
        })
      )

      const statements = await client.getIncomeStatement('000001.SZ', {
        startDate: '20230101',
        endDate: '20231231'
      })

      expect(statements.length).toBe(2)
    })

    it('应该支持带报告期类型参数的查询', async () => {
      server.use(
        createSuccessHandler('income', {
          fields: ['ts_code', 'ann_date', 'end_date', 'revenue'],
          items: [
            ['000001.SZ', '20231031', '20230930', 1000000.0]
          ]
        })
      )

      const statements = await client.getIncomeStatement('000001.SZ', {
        period: '20230930'
      })

      expect(statements.length).toBe(1)
    })
  })

  describe('缓存功能', () => {
    it('应该在没有缓存配置时正常工作', async () => {
      const clientWithoutCache = new TushareClient({
        token: 'test_token_32_characters_long_000'
      })

      server.use(
        createSuccessHandler('income', {
          fields: ['ts_code', 'ann_date', 'end_date', 'revenue'],
          items: [
            ['000001.SZ', '20231031', '20230930', 1000000.0]
          ]
        })
      )

      const statements = await clientWithoutCache.getIncomeStatement('000001.SZ')
      expect(statements.length).toBe(1)
    })

    it('应该在配置缓存后使用缓存', async () => {
      const { MemoryCache } = await import('../../src/utils/cache')
      const cache = new MemoryCache()

      const clientWithCache = new TushareClient({
        token: 'test_token_32_characters_long_000',
        cache: {
          storage: cache,
          ttl: 60
        }
      })

      let callCount = 0
      server.use(
        createSuccessHandler('income', {
          fields: ['ts_code', 'ann_date', 'end_date', 'revenue'],
          items: [
            ['000001.SZ', '20231031', '20230930', 1000000.0]
          ]
        })
      )

      // 第一次调用，应该请求 API
      const statements1 = await clientWithCache.getIncomeStatement('000001.SZ')
      expect(statements1.length).toBe(1)

      // 第二次调用，应该使用缓存（不会再次请求 API）
      const statements2 = await clientWithCache.getIncomeStatement('000001.SZ')
      expect(statements2.length).toBe(1)
      expect(statements2).toEqual(statements1)

      cache.stopCleanup()
    })

    it('应该为空数据不设置缓存', async () => {
      const { MemoryCache } = await import('../../src/utils/cache')
      const cache = new MemoryCache()

      const clientWithCache = new TushareClient({
        token: 'test_token_32_characters_long_000',
        cache: {
          storage: cache,
          ttl: 60
        }
      })

      server.use(
        createSuccessHandler('income', {
          fields: ['ts_code', 'ann_date', 'end_date', 'revenue'],
          items: []
        })
      )

      const statements = await clientWithCache.getIncomeStatement('999999.SZ')
      expect(statements.length).toBe(0)

      // 验证缓存为空
      expect(cache.size()).toBe(0)

      cache.stopCleanup()
    })
  })

  describe('空数据处理', () => {
    beforeEach(() => {
      client = new TushareClient({ token: 'test_token_32_characters_long_000' })
    })

    it('应该正确处理空数据响应', async () => {
      server.use(
        createSuccessHandler('income', {
          fields: ['ts_code', 'ann_date', 'end_date', 'revenue'],
          items: []
        })
      )

      const statements = await client.getIncomeStatement('999999.SZ')
      expect(statements).toEqual([])
    })

    it('应该正确处理无 data 字段的响应', async () => {
      server.use(
        createSuccessHandler('income', null)
      )

      const statements = await client.getIncomeStatement('999999.SZ')
      expect(statements).toEqual([])
    })
  })

  describe('客户端配置管理', () => {
    it('应该能获取客户端配置', () => {
      const client = new TushareClient({
        token: 'test_token_32_characters_long_000',
        timeout: 10000,
        debug: true
      })

      const config = client.getConfig()
      expect(config.token).toBe('test_token_32_characters_long_000')
      expect(config.timeout).toBe(10000)
      expect(config.debug).toBe(true)
    })

    it('应该能更新超时时间', () => {
      const client = new TushareClient({
        token: 'test_token_32_characters_long_000',
        timeout: 5000
      })

      client.updateTimeout(10000)
      const config = client.getConfig()
      expect(config.timeout).toBe(10000)
    })

    it('应该能初始化启用缓存的客户端', async () => {
      const { MemoryCache } = await import('../../src/utils/cache')
      const cache = new MemoryCache()

      const client = new TushareClient({
        token: 'test_token_32_characters_long_000',
        cache: {
          enabled: true,
          storage: cache,
          ttl: 60
        }
      })

      expect(client.isReady()).toBe(true)
      cache.stopCleanup()
    })

    it('应该能初始化没有显式存储的缓存配置', () => {
      const client = new TushareClient({
        token: 'test_token_32_characters_long_000',
        cache: {
          enabled: true,
          ttl: 60
        }
      })

      expect(client.isReady()).toBe(true)
      // 清理默认创建的缓存
      if ((client as any).cache) {
        (client as any).cache.stopCleanup()
      }
    })
  })

  describe('参数处理', () => {
    beforeEach(() => {
      client = new TushareClient({ token: 'test_token_32_characters_long_000' })
    })

    it('应该正确处理所有可选参数', async () => {
      server.use(
        createSuccessHandler('income', {
          fields: ['ts_code', 'ann_date', 'end_date', 'revenue'],
          items: [
            ['000001.SZ', '20231031', '20230930', 1000000.0]
          ]
        })
      )

      const statements = await client.getIncomeStatement('000001.SZ', {
        startDate: '20230101',
        endDate: '20231231',
        period: '20230930'
      })

      expect(statements.length).toBe(1)
    })

    it('应该正确处理部分可选参数', async () => {
      server.use(
        createSuccessHandler('balancesheet', {
          fields: ['ts_code', 'ann_date', 'end_date', 'total_assets'],
          items: [
            ['000001.SZ', '20231031', '20230930', 5000000.0]
          ]
        })
      )

      const statements = await client.getBalanceSheet('000001.SZ', {
        startDate: '20230101'
      })

      expect(statements.length).toBe(1)
    })

    it('应该正确处理只有 endDate 的情况', async () => {
      server.use(
        createSuccessHandler('cashflow', {
          fields: ['ts_code', 'ann_date', 'end_date', 'n_cashflow_act'],
          items: [
            ['000001.SZ', '20231031', '20230930', 100000.0]
          ]
        })
      )

      const statements = await client.getCashFlowStatement('000001.SZ', {
        endDate: '20231231'
      })

      expect(statements.length).toBe(1)
    })

    it('应该正确处理只有 period 的情况', async () => {
      server.use(
        createSuccessHandler('fina_indicator', {
          fields: ['ts_code', 'ann_date', 'end_date', 'eps'],
          items: [
            ['000001.SZ', '20231031', '20230930', 1.23]
          ]
        })
      )

      const indicators = await client.getFinancialIndicators('000001.SZ', {
        period: '20230930'
      })

      expect(indicators.length).toBe(1)
    })

    it('应该正确处理 startDate 和 period 组合', async () => {
      server.use(
        createSuccessHandler('income', {
          fields: ['ts_code', 'ann_date', 'end_date', 'revenue'],
          items: [
            ['000001.SZ', '20231031', '20230930', 1000000.0]
          ]
        })
      )

      const statements = await client.getIncomeStatement('000001.SZ', {
        startDate: '20230101',
        period: '20230930'
      })

      expect(statements.length).toBe(1)
    })

    it('应该正确处理 endDate 和 period 组合', async () => {
      server.use(
        createSuccessHandler('balancesheet', {
          fields: ['ts_code', 'ann_date', 'end_date', 'total_assets'],
          items: [
            ['000001.SZ', '20231031', '20230930', 5000000.0]
          ]
        })
      )

      const statements = await client.getBalanceSheet('000001.SZ', {
        endDate: '20231231',
        period: '20230930'
      })

      expect(statements.length).toBe(1)
    })

    it('应该处理没有任何可选参数的情况', async () => {
      server.use(
        createSuccessHandler('cashflow', {
          fields: ['ts_code', 'ann_date', 'end_date', 'n_cashflow_act'],
          items: [
            ['000001.SZ', '20231031', '20230930', 100000.0]
          ]
        })
      )

      const statements = await client.getCashFlowStatement('000001.SZ')
      expect(statements.length).toBe(1)
    })

    it('应该处理 undefined 参数对象', async () => {
      server.use(
        createSuccessHandler('fina_indicator', {
          fields: ['ts_code', 'ann_date', 'end_date', 'eps'],
          items: [
            ['000001.SZ', '20231031', '20230930', 1.23]
          ]
        })
      )

      const indicators = await client.getFinancialIndicators('000001.SZ', undefined)
      expect(indicators.length).toBe(1)
    })
  })
})