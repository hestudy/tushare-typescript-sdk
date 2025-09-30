import { describe, it, expect } from 'vitest'
import { TushareError, TushareErrorType } from '../../src/types/error'
import {
  createNetworkError,
  createTimeoutError,
  createParameterError,
  mapApiErrorToTushareError
} from '../../src/models/error'

describe('error', () => {
  describe('TushareError', () => {
    it('应创建认证错误', () => {
      const error = new TushareError(
        TushareErrorType.AUTHENTICATION_ERROR,
        '认证失败',
        2002
      )

      expect(error).toBeInstanceOf(Error)
      expect(error).toBeInstanceOf(TushareError)
      expect(error.type).toBe(TushareErrorType.AUTHENTICATION_ERROR)
      expect(error.message).toBe('认证失败')
      expect(error.code).toBe(2002)
      expect(error.name).toBe('TushareError')
    })

    it('应创建权限错误', () => {
      const error = new TushareError(
        TushareErrorType.PERMISSION_ERROR,
        '积分不足',
        2002
      )

      expect(error.type).toBe(TushareErrorType.PERMISSION_ERROR)
      expect(error.message).toBe('积分不足')
      expect(error.code).toBe(2002)
    })

    it('应包含原始响应数据', () => {
      const rawResponse = {
        code: 2002,
        msg: 'token无效',
        data: null
      }

      const error = new TushareError(
        TushareErrorType.AUTHENTICATION_ERROR,
        'token无效',
        2002,
        rawResponse
      )

      expect(error.rawResponse).toBe(rawResponse)
    })

    it('应包含请求参数', () => {
      const requestParams = {
        api_name: 'daily',
        token: 'xxx',
        params: { ts_code: '000001.SZ' }
      }

      const error = new TushareError(
        TushareErrorType.PARAMETER_ERROR,
        '参数错误',
        -1,
        undefined,
        requestParams
      )

      expect(error.requestParams).toBe(requestParams)
    })
  })

  describe('mapApiErrorToTushareError', () => {
    it('应将code=2002和token相关消息映射为认证错误', () => {
      const error1 = mapApiErrorToTushareError({ code: 2002, msg: 'token无效', data: null })
      expect(error1.type).toBe(TushareErrorType.AUTHENTICATION_ERROR)

      const error2 = mapApiErrorToTushareError({ code: 2002, msg: 'token过期', data: null })
      expect(error2.type).toBe(TushareErrorType.AUTHENTICATION_ERROR)
    })

    it('应将code=2002和权限相关消息映射为权限错误', () => {
      const error1 = mapApiErrorToTushareError({ code: 2002, msg: '积分不足', data: null })
      expect(error1.type).toBe(TushareErrorType.PERMISSION_ERROR)

      const error2 = mapApiErrorToTushareError({ code: 2002, msg: '无权限', data: null })
      expect(error2.type).toBe(TushareErrorType.PERMISSION_ERROR)
    })

    it('应将频率限制消息映射为频率限制错误', () => {
      const error1 = mapApiErrorToTushareError({ code: -1, msg: '超过频率限制', data: null })
      expect(error1.type).toBe(TushareErrorType.RATE_LIMIT_ERROR)

      const error2 = mapApiErrorToTushareError({ code: -1, msg: '超过调用频率', data: null })
      expect(error2.type).toBe(TushareErrorType.RATE_LIMIT_ERROR)

      const error3 = mapApiErrorToTushareError({ code: -1, msg: 'rate limit exceeded', data: null })
      expect(error3.type).toBe(TushareErrorType.RATE_LIMIT_ERROR)

      const error4 = mapApiErrorToTushareError({ code: -1, msg: '频率超限', data: null })
      expect(error4.type).toBe(TushareErrorType.RATE_LIMIT_ERROR)
    })

    it('应将参数相关消息映射为参数错误', () => {
      const error1 = mapApiErrorToTushareError({ code: -1, msg: '参数错误', data: null })
      expect(error1.type).toBe(TushareErrorType.PARAMETER_ERROR)

      const error2 = mapApiErrorToTushareError({ code: -1, msg: 'parameter error', data: null })
      expect(error2.type).toBe(TushareErrorType.PARAMETER_ERROR)
    })

    it('应将未知code映射为未知错误', () => {
      const error1 = mapApiErrorToTushareError({ code: -999, msg: '未知错误', data: null })
      expect(error1.type).toBe(TushareErrorType.UNKNOWN_ERROR)

      const error2 = mapApiErrorToTushareError({ code: 1000, msg: '其他错误', data: null })
      expect(error2.type).toBe(TushareErrorType.UNKNOWN_ERROR)
    })

    it('应对code=2002但无明确关键词的消息使用默认映射', () => {
      const error = mapApiErrorToTushareError({ code: 2002, msg: '访问被拒绝', data: null })
      expect(error.type).toBe(TushareErrorType.AUTHENTICATION_ERROR)
    })

    it('应将code=-1但不匹配任何特定模式的映射为参数错误', () => {
      const error = mapApiErrorToTushareError({ code: -1, msg: '未知的-1错误', data: null })
      expect(error.type).toBe(TushareErrorType.PARAMETER_ERROR)
    })
  })

  describe('便捷创建函数', () => {
    it('createParameterError 应创建参数错误', () => {
      const error = createParameterError('参数错误:缺少ts_code')
      expect(error.type).toBe(TushareErrorType.PARAMETER_ERROR)
      expect(error.message).toBe('参数错误:缺少ts_code')
      expect(error.code).toBe(-1)
    })

    it('createTimeoutError 应创建超时错误', () => {
      const error = createTimeoutError(5000)
      expect(error.type).toBe(TushareErrorType.TIMEOUT_ERROR)
      expect(error.message).toContain('请求超时')
      expect(error.message).toContain('5000')
    })

    it('createNetworkError 应创建网络错误', () => {
      const originalError = new Error('网络连接失败')
      const error = createNetworkError(originalError)
      expect(error.type).toBe(TushareErrorType.NETWORK_ERROR)
      expect(error.message).toContain('网络错误')
      expect(error.message).toContain('网络连接失败')
    })

    it('createServerError 应创建服务器错误', async () => {
      const { createServerError } = await import('../../src/models/error')
      const error = createServerError(500, 'Internal Server Error')
      expect(error.type).toBe(TushareErrorType.SERVER_ERROR)
      expect(error.message).toContain('服务器错误')
      expect(error.message).toContain('500')
      expect(error.code).toBe(500)
    })
  })

  describe('错误对象行为', () => {
    it('应支持instanceof检查', () => {
      const error = new TushareError(
        TushareErrorType.AUTHENTICATION_ERROR,
        '认证失败',
        2002
      )

      expect(error instanceof Error).toBe(true)
      expect(error instanceof TushareError).toBe(true)
    })

    it('应有正确的stack trace', () => {
      const error = new TushareError(
        TushareErrorType.PARAMETER_ERROR,
        '参数错误',
        -1
      )

      expect(error.stack).toBeDefined()
      expect(typeof error.stack).toBe('string')
      expect(error.stack).toContain('TushareError')
    })

    it('应可以被JSON序列化', () => {
      const error = new TushareError(
        TushareErrorType.NETWORK_ERROR,
        '网络错误',
        -1
      )

      const json = JSON.stringify({
        type: error.type,
        message: error.message,
        code: error.code
      })

      expect(json).toContain('NETWORK_ERROR')
      expect(json).toContain('网络错误')
      expect(json).toContain('-1')
    })

    it('应可以传递给Promise.reject', async () => {
      const error = new TushareError(
        TushareErrorType.TIMEOUT_ERROR,
        '超时',
        -1
      )

      await expect(Promise.reject(error)).rejects.toThrow(TushareError)
      await expect(Promise.reject(error)).rejects.toMatchObject({
        type: TushareErrorType.TIMEOUT_ERROR,
        message: '超时'
      })
    })
  })
})