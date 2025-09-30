import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest'
import { HttpClient } from '../../src/core/http'
import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'

describe('HttpClient', () => {
  const server = setupServer()

  beforeAll(() => {
    server.listen({ onUnhandledRequest: 'error' })
  })

  afterEach(() => {
    server.resetHandlers()
  })

  afterAll(() => {
    server.close()
  })

  describe('构造函数', () => {
    it('应该使用默认配置', () => {
      const client = new HttpClient()
      expect(client).toBeDefined()
    })

    it('应该使用自定义配置', () => {
      const client = new HttpClient('http://test.api.com', 10000, true)
      expect(client).toBeDefined()
    })
  })

  describe('post 请求', () => {
    it('应该成功发送POST请求', async () => {
      server.use(
        http.post('http://api.tushare.pro', () => {
          return HttpResponse.json({
            code: 0,
            msg: '',
            data: {
              fields: ['ts_code'],
              items: [['000001.SZ']]
            }
          })
        })
      )

      const client = new HttpClient()
      const response = await client.post({
        api_name: 'daily',
        token: 'test_token',
        params: {}
      })

      expect(response.code).toBe(0)
    })

    it('应该处理服务器错误(5xx)', async () => {
      server.use(
        http.post('http://api.tushare.pro', () => {
          return new HttpResponse(null, {
            status: 500,
            statusText: 'Internal Server Error'
          })
        })
      )

      const client = new HttpClient()
      await expect(client.post({
        api_name: 'daily',
        token: 'test_token',
        params: {}
      })).rejects.toThrow('服务器错误')
    })

    it('应该处理超时错误', async () => {
      server.use(
        http.post('http://api.tushare.pro', async () => {
          // 延迟响应超过超时时间
          await new Promise(resolve => setTimeout(resolve, 200))
          return HttpResponse.json({ code: 0 })
        })
      )

      const client = new HttpClient('http://api.tushare.pro', 50) // 50ms超时
      await expect(client.post({
        api_name: 'daily',
        token: 'test_token',
        params: {}
      })).rejects.toThrow('请求超时')
    })

    it('应该处理网络错误', async () => {
      server.use(
        http.post('http://api.tushare.pro', () => {
          return HttpResponse.error()
        })
      )

      const client = new HttpClient()
      await expect(client.post({
        api_name: 'daily',
        token: 'test_token',
        params: {}
      })).rejects.toThrow()
    })

    it('应该在debug模式下输出日志', async () => {
      const consoleLogs: string[] = []
      const originalLog = console.log
      console.log = (...args: any[]) => {
        consoleLogs.push(args.join(' '))
      }

      server.use(
        http.post('http://api.tushare.pro', () => {
          return HttpResponse.json({
            code: 0,
            data: null
          })
        })
      )

      try {
        const client = new HttpClient('http://api.tushare.pro', 5000, true)
        await client.post({
          api_name: 'daily',
          token: 'test_token',
          params: {}
        })

        expect(consoleLogs.some(log => log.includes('[Tushare SDK] 发送请求'))).toBe(true)
        expect(consoleLogs.some(log => log.includes('[Tushare SDK] 收到响应'))).toBe(true)
      } finally {
        console.log = originalLog
      }
    })

    it('应该处理非2xx状态码(非5xx)', async () => {
      server.use(
        http.post('http://api.tushare.pro', () => {
          return HttpResponse.json(
            { code: 40001, msg: '认证失败' },
            { status: 403 }
          )
        })
      )

      const client = new HttpClient()
      // 403错误会被返回为响应体,而不是抛出异常
      const response = await client.post({
        api_name: 'daily',
        token: 'invalid_token',
        params: {}
      })

      expect(response).toBeDefined()
    })
  })
})