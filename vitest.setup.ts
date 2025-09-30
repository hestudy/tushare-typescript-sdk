import { beforeAll, afterEach, afterAll } from 'vitest'
import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'

// 创建MSW服务器用于模拟Tushare API
export const server = setupServer()

// 在所有测试前启动mock服务器
beforeAll(() => {
  server.listen({ onUnhandledRequest: 'warn' })
})

// 每个测试后重置handlers
afterEach(() => {
  server.resetHandlers()
})

// 所有测试后关闭服务器
afterAll(() => {
  server.close()
})

// 导出常用的mock handlers工厂函数
export const createSuccessHandler = (apiName: string, data: any) => {
  return http.post('http://api.tushare.pro', async ({ request }) => {
    const body = await request.json() as any
    if (body.api_name === apiName) {
      return HttpResponse.json({
        code: 0,
        msg: null,
        data
      })
    }
  })
}

export const createErrorHandler = (apiName: string, code: number, msg: string) => {
  return http.post('http://api.tushare.pro', async ({ request }) => {
    const body = await request.json() as any
    if (body.api_name === apiName) {
      return HttpResponse.json({
        code,
        msg,
        data: null
      })
    }
  })
}