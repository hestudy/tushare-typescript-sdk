import { describe, it, expect } from 'vitest'
import { transformResponse } from '../../src/models/response'
import type { TushareRawResponse } from '../../src/types/api'

describe('response', () => {
  describe('transformResponse', () => {
    it('应将原始响应转换为结构化数据', () => {
      const rawResponse: TushareRawResponse = {
        code: 0,
        msg: null,
        data: {
          fields: ['ts_code', 'trade_date', 'close'],
          items: [
            ['000001.SZ', '20240101', 15.67],
            ['000001.SZ', '20240102', 15.89]
          ]
        }
      }

      const response = transformResponse<any>(rawResponse)

      expect(response.code).toBe(0)
      expect(response.msg).toBeNull()
      expect(response.success).toBe(true)
      expect(response.data).toHaveLength(2)
      expect(response.data[0]).toEqual({
        ts_code: '000001.SZ',
        trade_date: '20240101',
        close: 15.67
      })
      expect(response.data[1]).toEqual({
        ts_code: '000001.SZ',
        trade_date: '20240102',
        close: 15.89
      })
    })

    it('应保留原始响应数据', () => {
      const rawResponse: TushareRawResponse = {
        code: 0,
        msg: null,
        data: {
          fields: ['ts_code', 'close'],
          items: [['000001.SZ', 15.67]]
        }
      }

      const response = transformResponse<any>(rawResponse)

      expect(response.raw).toBeDefined()
      expect(response.raw.fields).toEqual(['ts_code', 'close'])
      expect(response.raw.items).toEqual([['000001.SZ', 15.67]])
    })

    it('应处理空数据响应', () => {
      const rawResponse: TushareRawResponse = {
        code: 0,
        msg: null,
        data: {
          fields: ['ts_code', 'trade_date', 'close'],
          items: []
        }
      }

      const response = transformResponse<any>(rawResponse)

      expect(response.success).toBe(true)
      expect(response.data).toEqual([])
      expect(response.data).toHaveLength(0)
    })

    it('应处理null数据响应', () => {
      const rawResponse: TushareRawResponse = {
        code: -1,
        msg: '参数错误',
        data: null
      }

      const response = transformResponse<any>(rawResponse)

      expect(response.success).toBe(false)
      expect(response.code).toBe(-1)
      expect(response.msg).toBe('参数错误')
      expect(response.data).toBeNull()
      expect(response.raw).toBeNull()
    })

    it('应处理错误响应', () => {
      const rawResponse: TushareRawResponse = {
        code: 2002,
        msg: 'token无效',
        data: null
      }

      const response = transformResponse<any>(rawResponse)

      expect(response.success).toBe(false)
      expect(response.code).toBe(2002)
      expect(response.msg).toBe('token无效')
      expect(response.data).toBeNull()
    })

    it('应处理包含null值的数据', () => {
      const rawResponse: TushareRawResponse = {
        code: 0,
        msg: null,
        data: {
          fields: ['ts_code', 'close', 'volume'],
          items: [
            ['000001.SZ', 15.67, null],
            ['000002.SZ', null, 1000000]
          ]
        }
      }

      const response = transformResponse<any>(rawResponse)

      expect(response.success).toBe(true)
      expect(response.data).toHaveLength(2)
      expect(response.data[0].volume).toBeNull()
      expect(response.data[1].close).toBeNull()
    })

    it('应处理单条数据', () => {
      const rawResponse: TushareRawResponse = {
        code: 0,
        msg: null,
        data: {
          fields: ['ts_code', 'name', 'price'],
          items: [['000001.SZ', '平安银行', 15.67]]
        }
      }

      const response = transformResponse<any>(rawResponse)

      expect(response.data).toHaveLength(1)
      expect(response.data[0]).toEqual({
        ts_code: '000001.SZ',
        name: '平安银行',
        price: 15.67
      })
    })

    it('应处理大量字段', () => {
      const fields = Array.from({ length: 20 }, (_, i) => `field${i}`)
      const items = [Array.from({ length: 20 }, (_, i) => i)]

      const rawResponse: TushareRawResponse = {
        code: 0,
        msg: null,
        data: { fields, items }
      }

      const response = transformResponse<any>(rawResponse)

      expect(response.data).toHaveLength(1)
      expect(Object.keys(response.data[0])).toHaveLength(20)
      expect(response.data[0].field0).toBe(0)
      expect(response.data[0].field19).toBe(19)
    })

    it('应处理大量数据行', () => {
      const fields = ['ts_code', 'value']
      const items = Array.from({ length: 1000 }, (_, i) => [`CODE${i}`, i * 10])

      const rawResponse: TushareRawResponse = {
        code: 0,
        msg: null,
        data: { fields, items }
      }

      const response = transformResponse<any>(rawResponse)

      expect(response.data).toHaveLength(1000)
      expect(response.data[0]).toEqual({ ts_code: 'CODE0', value: 0 })
      expect(response.data[999]).toEqual({ ts_code: 'CODE999', value: 9990 })
    })

    it('应处理混合类型的值', () => {
      const rawResponse: TushareRawResponse = {
        code: 0,
        msg: null,
        data: {
          fields: ['str', 'num', 'bool', 'null', 'arr', 'obj'],
          items: [
            ['text', 123, true, null, [1, 2], { key: 'value' }]
          ]
        }
      }

      const response = transformResponse<any>(rawResponse)

      expect(response.data[0]).toEqual({
        str: 'text',
        num: 123,
        bool: true,
        null: null,
        arr: [1, 2],
        obj: { key: 'value' }
      })
    })

    it('应正确设置success标志', () => {
      const successResponse = transformResponse<any>({
        code: 0,
        msg: null,
        data: { fields: ['f'], items: [['v']] }
      })
      expect(successResponse.success).toBe(true)

      const errorResponse1 = transformResponse<any>({
        code: -1,
        msg: '错误',
        data: null
      })
      expect(errorResponse1.success).toBe(false)

      const errorResponse2 = transformResponse<any>({
        code: 2002,
        msg: 'token无效',
        data: null
      })
      expect(errorResponse2.success).toBe(false)
    })

    it('应保持字段顺序', () => {
      const rawResponse: TushareRawResponse = {
        code: 0,
        msg: null,
        data: {
          fields: ['z', 'y', 'x', 'w'],
          items: [['zv', 'yv', 'xv', 'wv']]
        }
      }

      const response = transformResponse<any>(rawResponse)
      const keys = Object.keys(response.data[0])

      expect(keys).toEqual(['z', 'y', 'x', 'w'])
    })

    it('应处理字段和数据长度不匹配的情况', () => {
      // 字段多于数据
      const response1 = transformResponse<any>({
        code: 0,
        msg: null,
        data: {
          fields: ['a', 'b', 'c'],
          items: [['v1', 'v2']]
        }
      })
      expect(response1.data[0]).toEqual({ a: 'v1', b: 'v2', c: undefined })

      // 数据多于字段
      const response2 = transformResponse<any>({
        code: 0,
        msg: null,
        data: {
          fields: ['a', 'b'],
          items: [['v1', 'v2', 'v3']]
        }
      })
      expect(response2.data[0]).toEqual({ a: 'v1', b: 'v2' })
    })

    it('应处理空字段名', () => {
      const rawResponse: TushareRawResponse = {
        code: 0,
        msg: null,
        data: {
          fields: ['', 'field1', ''],
          items: [['v0', 'v1', 'v2']]
        }
      }

      const response = transformResponse<any>(rawResponse)

      expect(response.data[0]).toHaveProperty('')
      expect(response.data[0]).toHaveProperty('field1')
      expect(response.data[0].field1).toBe('v1')
    })
  })
})