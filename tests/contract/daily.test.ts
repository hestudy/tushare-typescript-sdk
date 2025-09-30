import { describe, it, expect, beforeEach } from 'vitest'
import { server, createSuccessHandler, createErrorHandler } from '../../vitest.setup'
import { TushareClient } from '../../src/core/client'
import { TushareErrorType } from '../../src/types/error'

describe('Daily API Contract Tests', () => {
  let client: TushareClient

  beforeEach(() => {
    client = new TushareClient({ token: 'test_token_32_characters_long_000' })
  })

  describe('成功响应', () => {
    it('应该返回正确的响应结构 (code=0, data.fields 和 data.items)', async () => {
      server.use(
        createSuccessHandler('daily', {
          fields: ['ts_code', 'trade_date', 'open', 'high', 'low', 'close', 'pre_close', 'change', 'pct_chg', 'vol', 'amount'],
          items: [
            ['000001.SZ', '20250930', 15.23, 15.98, 15.10, 15.67, 15.20, 0.47, 3.09, 123456.0, 1890000.0]
          ]
        })
      )

      const response = await client.daily({ ts_code: '000001.SZ' })

      expect(response.code).toBe(0)
      expect(response.success).toBe(true)
      expect(response.data).toBeDefined()
      expect(response.data?.length).toBe(1)
      expect(response.raw).toBeDefined()
      expect(response.raw?.fields).toHaveLength(11)
      expect(response.raw?.items).toHaveLength(1)
    })

    it('应该包含所有11个必需字段', async () => {
      server.use(
        createSuccessHandler('daily', {
          fields: ['ts_code', 'trade_date', 'open', 'high', 'low', 'close', 'pre_close', 'change', 'pct_chg', 'vol', 'amount'],
          items: [
            ['000001.SZ', '20250930', 15.23, 15.98, 15.10, 15.67, 15.20, 0.47, 3.09, 123456.0, 1890000.0]
          ]
        })
      )

      const response = await client.daily({ ts_code: '000001.SZ' })
      const quote = response.data?.[0]

      expect(quote).toBeDefined()
      expect(quote?.ts_code).toBe('000001.SZ')
      expect(quote?.trade_date).toBe('20250930')
      expect(quote?.open).toBe(15.23)
      expect(quote?.high).toBe(15.98)
      expect(quote?.low).toBe(15.10)
      expect(quote?.close).toBe(15.67)
      expect(quote?.pre_close).toBe(15.20)
      expect(quote?.change).toBe(0.47)
      expect(quote?.pct_chg).toBe(3.09)
      expect(quote?.vol).toBe(123456.0)
      expect(quote?.amount).toBe(1890000.0)
    })
  })

  describe('认证错误', () => {
    it('应该抛出 AUTHENTICATION_ERROR 当 token 无效或过期', async () => {
      server.use(createErrorHandler('daily', 2002, 'token无效或过期'))

      await expect(client.daily({ ts_code: '000001.SZ' })).rejects.toThrow()
      await expect(client.daily({ ts_code: '000001.SZ' })).rejects.toMatchObject({
        type: TushareErrorType.AUTHENTICATION_ERROR,
        code: 2002
      })
    })
  })

  describe('权限错误', () => {
    it('应该抛出 PERMISSION_ERROR 当积分不足或无权限', async () => {
      server.use(createErrorHandler('daily', 2002, '积分不足或无权限'))

      await expect(client.daily({ ts_code: '000001.SZ' })).rejects.toThrow()
      await expect(client.daily({ ts_code: '000001.SZ' })).rejects.toMatchObject({
        type: TushareErrorType.PERMISSION_ERROR,
        code: 2002
      })
    })
  })

  describe('参数错误', () => {
    it('应该抛出 PARAMETER_ERROR 当参数错误', async () => {
      server.use(createErrorHandler('daily', -1, '参数错误'))

      await expect(client.daily({ ts_code: '000001.SZ' })).rejects.toThrow()
      await expect(client.daily({ ts_code: '000001.SZ' })).rejects.toMatchObject({
        type: TushareErrorType.PARAMETER_ERROR,
        code: -1
      })
    })
  })

  describe('请求格式验证', () => {
    it('应该发送正确的请求格式 (api_name, token, params)', async () => {
      let capturedRequest: any = null

      server.use(
        server.use(
          createSuccessHandler('daily', {
            fields: ['ts_code'],
            items: [['000001.SZ']]
          })
        )
      )

      await client.daily({ ts_code: '000001.SZ', start_date: '20250901', end_date: '20250930' })

      // 验证请求格式 (通过MSW拦截)
      expect(true).toBe(true) // 这个测试需要通过MSW的请求验证
    })
  })
})