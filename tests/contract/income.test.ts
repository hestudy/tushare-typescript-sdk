/**
 * 利润表接口契约测试
 *
 * 验证 income 接口的请求和响应格式是否符合契约定义
 */
import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { TushareClient } from '../../src/core/client'

// 设置 MSW 服务器
const server = setupServer()

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('利润表接口契约测试', () => {
  const baseUrl = 'http://api.tushare.pro'

  it('成功响应: 验证请求格式和响应数据结构', async () => {
    // 模拟成功的 API 响应
    server.use(
      http.post(baseUrl, async ({ request }) => {
        const body = await request.json() as any

        // 验证请求格式
        expect(body.api_name).toBe('income')
        expect(body.token).toBeDefined()
        expect(body.params).toBeDefined()
        expect(body.params.ts_code).toBe('000001.SZ')

        // 返回成功响应
        return HttpResponse.json({
          code: 0,
          msg: 'success',
          data: {
            fields: ['ts_code', 'end_date', 'ann_date', 'report_type', 'total_revenue', 'revenue', 'operate_profit', 'total_profit', 'n_income', 'n_income_attr_p', 'basic_eps', 'diluted_eps'],
            items: [
              ['000001.SZ', '20231231', '20240328', '1', 45000000000, 44000000000, 40000000000, 42000000000, 5000000000, 4800000000, 1.25, 1.24],
              ['000001.SZ', '20230930', '20231030', '1', 32000000000, 31000000000, 28000000000, 30000000000, 3500000000, 3400000000, 0.88, 0.87]
            ]
          }
        })
      })
    )

    const client = new TushareClient({ token: 'test_token_123456789012345678901' })

    // 调用方法 - 应该成功返回利润表数据
    const result = await client.getIncomeStatement('000001.SZ')

    // 验证响应数据
    expect(result).toBeInstanceOf(Array)
    expect(result.length).toBe(2)
    expect(result[0].tsCode).toBe('000001.SZ')
    expect(result[0].endDate).toBe('20231231')
    expect(result[0].revenue).toBe(44000000000)
  })

  it('认证失败: token 无效返回 40001 错误', async () => {
    // 模拟认证失败的 API 响应
    server.use(
      http.post(baseUrl, async ({ request }) => {
        const body = await request.json() as any

        // 验证请求格式
        expect(body.api_name).toBe('income')
        expect(body.token).toBeDefined()

        // 返回认证失败响应
        return HttpResponse.json({
          code: 40001,
          msg: 'token认证失败'
        })
      })
    )

    const client = new TushareClient({ token: 'invalid_token_123456789012345678901' })

    // 调用方法 - 应该抛出认证错误
    await expect(client.getIncomeStatement('000001.SZ')).rejects.toThrow()
  })

  it('限流错误: 超出频率限制返回 40002 错误', async () => {
    // 模拟限流错误的 API 响应
    server.use(
      http.post(baseUrl, async ({ request }) => {
        const body = await request.json() as any

        // 验证请求格式
        expect(body.api_name).toBe('income')
        expect(body.token).toBeDefined()

        // 返回限流错误响应
        return HttpResponse.json({
          code: 40002,
          msg: '超出调用频率限制,请稍后重试'
        })
      })
    )

    const client = new TushareClient({ token: 'test_token_123456789012345678901' })

    // 调用方法 - 应该抛出限流错误
    await expect(client.getIncomeStatement('000001.SZ')).rejects.toThrow()
  })

  it('空数据响应: 未披露数据返回空 items', async () => {
    // 模拟空数据响应
    server.use(
      http.post(baseUrl, async ({ request }) => {
        const body = await request.json() as any

        // 验证请求格式
        expect(body.api_name).toBe('income')
        expect(body.token).toBeDefined()
        expect(body.params.ts_code).toBe('999999.SZ')

        // 返回空数据响应
        return HttpResponse.json({
          code: 0,
          msg: 'success',
          data: {
            fields: [],
            items: []
          }
        })
      })
    )

    const client = new TushareClient({ token: 'test_token_123456789012345678901' })

    // 调用方法 - 应该返回空数组
    const result = await client.getIncomeStatement('999999.SZ')
    expect(result).toBeInstanceOf(Array)
    expect(result.length).toBe(0)
  })
})