import { describe, it, expect, beforeEach } from 'vitest'
import { server, createErrorHandler } from '../../vitest.setup'
import { http, HttpResponse } from 'msw'
import { TushareClient } from '../../src/core/client'
import { TushareError, TushareErrorType } from '../../src/types/error'

describe('Error Handling Integration Tests', () => {
  let client: TushareClient

  beforeEach(() => {
    client = new TushareClient({ token: 'test_token_32_characters_long_000' })
  })

  describe('AUTHENTICATION_ERROR', () => {
    it('应该捕获 token 无效错误', async () => {
      server.use(createErrorHandler('daily', 2002, 'token无效'))

      try {
        await client.daily({ ts_code: '000001.SZ' })
        expect.fail('应该抛出错误')
      } catch (error) {
        expect(error).toBeInstanceOf(TushareError)
        expect((error as TushareError).type).toBe(TushareErrorType.AUTHENTICATION_ERROR)
        expect((error as TushareError).code).toBe(2002)
      }
    })

    it('应该捕获 token 过期错误', async () => {
      server.use(createErrorHandler('daily', 2002, 'token过期'))

      try {
        await client.daily({ ts_code: '000001.SZ' })
        expect.fail('应该抛出错误')
      } catch (error) {
        expect(error).toBeInstanceOf(TushareError)
        expect((error as TushareError).type).toBe(TushareErrorType.AUTHENTICATION_ERROR)
      }
    })
  })

  describe('PERMISSION_ERROR', () => {
    it('应该捕获积分不足错误', async () => {
      server.use(createErrorHandler('daily', 2002, '积分不足'))

      try {
        await client.daily({ ts_code: '000001.SZ' })
        expect.fail('应该抛出错误')
      } catch (error) {
        expect(error).toBeInstanceOf(TushareError)
        expect((error as TushareError).type).toBe(TushareErrorType.PERMISSION_ERROR)
        expect((error as TushareError).code).toBe(2002)
      }
    })

    it('应该捕获无权限错误', async () => {
      server.use(createErrorHandler('daily', 2002, '无权限'))

      try {
        await client.daily({ ts_code: '000001.SZ' })
        expect.fail('应该抛出错误')
      } catch (error) {
        expect(error).toBeInstanceOf(TushareError)
        expect((error as TushareError).type).toBe(TushareErrorType.PERMISSION_ERROR)
      }
    })
  })

  describe('RATE_LIMIT_ERROR', () => {
    it('应该捕获超频率限制错误', async () => {
      server.use(createErrorHandler('daily', -1, '超过频率限制'))

      try {
        await client.daily({ ts_code: '000001.SZ' })
        expect.fail('应该抛出错误')
      } catch (error) {
        expect(error).toBeInstanceOf(TushareError)
        expect((error as TushareError).type).toBe(TushareErrorType.RATE_LIMIT_ERROR)
      }
    })

    it('应该捕获 rate limit 错误', async () => {
      server.use(createErrorHandler('daily', -1, 'rate limit exceeded'))

      try {
        await client.daily({ ts_code: '000001.SZ' })
        expect.fail('应该抛出错误')
      } catch (error) {
        expect(error).toBeInstanceOf(TushareError)
        expect((error as TushareError).type).toBe(TushareErrorType.RATE_LIMIT_ERROR)
      }
    })
  })

  describe('PARAMETER_ERROR', () => {
    it('应该捕获参数错误', async () => {
      server.use(createErrorHandler('daily', -1, '参数错误'))

      try {
        await client.daily({ ts_code: '000001.SZ' })
        expect.fail('应该抛出错误')
      } catch (error) {
        expect(error).toBeInstanceOf(TushareError)
        expect((error as TushareError).type).toBe(TushareErrorType.PARAMETER_ERROR)
        expect((error as TushareError).code).toBe(-1)
      }
    })

    it('应该捕获 parameter 关键字错误', async () => {
      server.use(createErrorHandler('daily', -1, 'invalid parameter: ts_code'))

      try {
        await client.daily({ ts_code: '000001.SZ' })
        expect.fail('应该抛出错误')
      } catch (error) {
        expect(error).toBeInstanceOf(TushareError)
        expect((error as TushareError).type).toBe(TushareErrorType.PARAMETER_ERROR)
      }
    })
  })

  describe('TIMEOUT_ERROR', () => {
    it('应该捕获请求超时错误', async () => {
      server.use(
        http.post('http://api.tushare.pro', async () => {
          await new Promise((resolve) => setTimeout(resolve, 10000))
          return HttpResponse.json({ code: 0, msg: null, data: null })
        })
      )

      const timeoutClient = new TushareClient({ token: 'test_token_32_characters_long_000', timeout: 10 })

      try {
        await timeoutClient.daily({ ts_code: '000001.SZ' })
        expect.fail('应该抛出错误')
      } catch (error) {
        expect(error).toBeInstanceOf(TushareError)
        expect((error as TushareError).type).toBe(TushareErrorType.TIMEOUT_ERROR)
      }
    })
  })

  describe('NETWORK_ERROR', () => {
    it('应该捕获网络连接失败错误', async () => {
      server.use(
        http.post('http://api.tushare.pro', async () => {
          return HttpResponse.error()
        })
      )

      try {
        await client.daily({ ts_code: '000001.SZ' })
        expect.fail('应该抛出错误')
      } catch (error) {
        expect(error).toBeInstanceOf(TushareError)
        expect((error as TushareError).type).toBe(TushareErrorType.NETWORK_ERROR)
      }
    })
  })

  describe('SERVER_ERROR', () => {
    it('应该捕获服务器内部错误', async () => {
      server.use(
        http.post('http://api.tushare.pro', async () => {
          return new HttpResponse(null, { status: 500 })
        })
      )

      try {
        await client.daily({ ts_code: '000001.SZ' })
        expect.fail('应该抛出错误')
      } catch (error) {
        expect(error).toBeInstanceOf(TushareError)
        expect((error as TushareError).type).toBe(TushareErrorType.SERVER_ERROR)
      }
    })

    it('应该捕获 503 服务不可用错误', async () => {
      server.use(
        http.post('http://api.tushare.pro', async () => {
          return new HttpResponse(null, { status: 503 })
        })
      )

      try {
        await client.daily({ ts_code: '000001.SZ' })
        expect.fail('应该抛出错误')
      } catch (error) {
        expect(error).toBeInstanceOf(TushareError)
        expect((error as TushareError).type).toBe(TushareErrorType.SERVER_ERROR)
      }
    })
  })

  describe('UNKNOWN_ERROR', () => {
    it('应该捕获未知错误类型', async () => {
      server.use(createErrorHandler('daily', 9999, '未知错误'))

      try {
        await client.daily({ ts_code: '000001.SZ' })
        expect.fail('应该抛出错误')
      } catch (error) {
        expect(error).toBeInstanceOf(TushareError)
        expect((error as TushareError).type).toBe(TushareErrorType.UNKNOWN_ERROR)
      }
    })
  })

  describe('错误对象信息完整性', () => {
    it('应该包含 type, code, message 属性', async () => {
      server.use(createErrorHandler('daily', 2002, 'token无效'))

      try {
        await client.daily({ ts_code: '000001.SZ' })
        expect.fail('应该抛出错误')
      } catch (error) {
        expect(error).toBeInstanceOf(TushareError)
        const tushaError = error as TushareError
        expect(tushaError.type).toBeDefined()
        expect(tushaError.code).toBeDefined()
        expect(tushaError.message).toBeDefined()
      }
    })

    it('应该包含原始响应和请求参数', async () => {
      server.use(createErrorHandler('daily', 2002, 'token无效'))

      try {
        await client.daily({ ts_code: '000001.SZ' })
        expect.fail('应该抛出错误')
      } catch (error) {
        expect(error).toBeInstanceOf(TushareError)
        const tushareError = error as TushareError
        expect(tushareError.rawResponse).toBeDefined()
      }
    })
  })
})