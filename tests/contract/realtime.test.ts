import { describe, it, expect, beforeEach } from 'vitest'
import { server, createSuccessHandler, createErrorHandler } from '../../vitest.setup'
import { TushareClient } from '../../src/core/client'
import { TushareErrorType } from '../../src/types/error'

describe('Realtime Quote API Contract Tests', () => {
  let client: TushareClient

  beforeEach(() => {
    client = new TushareClient({ token: 'test_token_32_characters_long_000' })
  })

  describe('成功响应', () => {
    it('应该返回正确的响应结构 (code=0, data.fields 和 data.items)', async () => {
      server.use(
        createSuccessHandler('realtime_quote', {
          fields: ['ts_code', 'name', 'price', 'open', 'high', 'low', 'pre_close', 'volume', 'amount'],
          items: [
            ['000001.SZ', '平安银行', 15.67, 15.23, 15.98, 15.10, 15.20, 12345678.0, 189000000.0]
          ]
        })
      )

      const response = await client.realtimeQuote({ ts_code: '000001.SZ' })

      expect(response.code).toBe(0)
      expect(response.success).toBe(true)
      expect(response.data).toBeDefined()
      expect(response.data?.length).toBe(1)
      expect(response.raw).toBeDefined()
      expect(response.raw?.fields).toHaveLength(9)
      expect(response.raw?.items).toHaveLength(1)
    })

    it('应该包含所有9个必需字段', async () => {
      server.use(
        createSuccessHandler('realtime_quote', {
          fields: ['ts_code', 'name', 'price', 'open', 'high', 'low', 'pre_close', 'volume', 'amount'],
          items: [
            ['000001.SZ', '平安银行', 15.67, 15.23, 15.98, 15.10, 15.20, 12345678.0, 189000000.0]
          ]
        })
      )

      const response = await client.realtimeQuote({ ts_code: '000001.SZ' })
      const quote = response.data?.[0]

      expect(quote).toBeDefined()
      expect(quote?.ts_code).toBe('000001.SZ')
      expect(quote?.name).toBe('平安银行')
      expect(quote?.price).toBe(15.67)
      expect(quote?.open).toBe(15.23)
      expect(quote?.high).toBe(15.98)
      expect(quote?.low).toBe(15.10)
      expect(quote?.pre_close).toBe(15.20)
      expect(quote?.volume).toBe(12345678.0)
      expect(quote?.amount).toBe(189000000.0)
    })

    it('应该支持单个股票查询', async () => {
      server.use(
        createSuccessHandler('realtime_quote', {
          fields: ['ts_code', 'name', 'price', 'open', 'high', 'low', 'pre_close', 'volume', 'amount'],
          items: [
            ['000001.SZ', '平安银行', 15.67, 15.23, 15.98, 15.10, 15.20, 12345678.0, 189000000.0]
          ]
        })
      )

      const response = await client.realtimeQuote({ ts_code: '000001.SZ' })
      expect(response.data?.length).toBe(1)
    })

    it('应该支持多个股票查询', async () => {
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
      expect(response.data?.length).toBe(3)
    })
  })

  describe('认证错误', () => {
    it('应该抛出 AUTHENTICATION_ERROR 当 token 无效或过期', async () => {
      server.use(createErrorHandler('realtime_quote', 2002, 'token无效或过期'))

      await expect(client.realtimeQuote({ ts_code: '000001.SZ' })).rejects.toThrow()
      await expect(client.realtimeQuote({ ts_code: '000001.SZ' })).rejects.toMatchObject({
        type: TushareErrorType.AUTHENTICATION_ERROR,
        code: 2002
      })
    })
  })

  describe('参数错误', () => {
    it('应该抛出 PARAMETER_ERROR 当缺少 ts_code', async () => {
      server.use(createErrorHandler('realtime_quote', -1, '参数错误:ts_code为必填项'))

      // @ts-expect-error - 故意传递无效参数
      await expect(client.realtimeQuote({})).rejects.toThrow()
    })
  })

  describe('频率限制错误', () => {
    it('应该抛出 RATE_LIMIT_ERROR 当超过调用频率限制', async () => {
      server.use(createErrorHandler('realtime_quote', -1, '超过调用频率限制'))

      await expect(client.realtimeQuote({ ts_code: '000001.SZ' })).rejects.toThrow()
      await expect(client.realtimeQuote({ ts_code: '000001.SZ' })).rejects.toMatchObject({
        type: TushareErrorType.RATE_LIMIT_ERROR
      })
    })
  })
})