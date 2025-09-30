/**
 * 现金流量表接口契约测试
 *
 * 验证 cashflow 接口的请求和响应格式是否符合契约定义
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

describe('现金流量表接口契约测试', () => {
  const baseUrl = 'http://api.tushare.pro'

  it('成功响应: 验证请求格式和响应数据结构', async () => {
    // 模拟成功的 API 响应
    server.use(
      http.post(baseUrl, async ({ request }) => {
        const body = await request.json() as any

        // 验证请求格式
        expect(body.api_name).toBe('cashflow')
        expect(body.token).toBeDefined()
        expect(body.params).toBeDefined()
        expect(body.params.ts_code).toBe('000001.SZ')

        // 返回成功响应
        return HttpResponse.json({
          code: 0,
          msg: 'success',
          data: {
            fields: ['ts_code', 'end_date', 'ann_date', 'report_type', 'n_cashflow_act', 'n_cashflow_inv_act', 'n_cash_flows_fnc_act', 'c_cash_equ_end_period', 'c_cash_equ_beg_period', 'n_incr_cash_cash_equ'],
            items: [
              ['000001.SZ', '20231231', '20240328', '1', 15000000000, -8000000000, -3000000000, 50000000000, 46000000000, 4000000000]
            ]
          }
        })
      })
    )

    const client = new TushareClient({ token: 'test_token_12345678901234567890' })

    // 调用方法 - 此时应该失败,因为 getCashFlowStatement 方法尚未实现
    await expect(async () => {
      // @ts-expect-error - 方法尚未实现
      await client.getCashFlowStatement('000001.SZ')
    }).rejects.toThrow()
  })

  it('认证失败: token 无效返回 40001 错误', async () => {
    // 模拟认证失败的 API 响应
    server.use(
      http.post(baseUrl, async ({ request }) => {
        const body = await request.json() as any

        // 验证请求格式
        expect(body.api_name).toBe('cashflow')
        expect(body.token).toBeDefined()

        // 返回认证失败响应
        return HttpResponse.json({
          code: 40001,
          msg: 'token认证失败'
        })
      })
    )

    const client = new TushareClient({ token: 'invalid_token_12345678901234567890' })

    // 调用方法 - 应该抛出认证错误
    await expect(async () => {
      // @ts-expect-error - 方法尚未实现
      await client.getCashFlowStatement('000001.SZ')
    }).rejects.toThrow()
  })

  it('限流错误: 超出频率限制返回 40002 错误', async () => {
    // 模拟限流错误的 API 响应
    server.use(
      http.post(baseUrl, async ({ request }) => {
        const body = await request.json() as any

        // 验证请求格式
        expect(body.api_name).toBe('cashflow')
        expect(body.token).toBeDefined()

        // 返回限流错误响应
        return HttpResponse.json({
          code: 40002,
          msg: '超出调用频率限制,请稍后重试'
        })
      })
    )

    const client = new TushareClient({ token: 'test_token_12345678901234567890' })

    // 调用方法 - 应该抛出限流错误
    await expect(async () => {
      // @ts-expect-error - 方法尚未实现
      await client.getCashFlowStatement('000001.SZ')
    }).rejects.toThrow()
  })

  it('空数据响应: 未披露数据返回空 items', async () => {
    // 模拟空数据响应
    server.use(
      http.post(baseUrl, async ({ request }) => {
        const body = await request.json() as any

        // 验证请求格式
        expect(body.api_name).toBe('cashflow')
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

    const client = new TushareClient({ token: 'test_token_12345678901234567890' })

    // 调用方法 - 应该返回空数组
    await expect(async () => {
      // @ts-expect-error - 方法尚未实现
      await client.getCashFlowStatement('999999.SZ')
    }).rejects.toThrow()
  })
})