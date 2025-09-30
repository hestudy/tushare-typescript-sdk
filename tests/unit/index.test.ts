import { describe, it, expect } from 'vitest'
import * as TushareSDK from '../../src/index'
import { TushareClient } from '../../src/core/client'
import { TushareError, TushareErrorType } from '../../src/models/error'

describe('index - SDK公共导出', () => {
  describe('主要类导出', () => {
    it('应导出TushareClient类', () => {
      expect(TushareSDK.TushareClient).toBeDefined()
      expect(typeof TushareSDK.TushareClient).toBe('function')
      expect(TushareSDK.TushareClient).toBe(TushareClient)
    })

    it('应导出TushareError类', () => {
      expect(TushareSDK.TushareError).toBeDefined()
      expect(typeof TushareSDK.TushareError).toBe('function')
    })

    it('应导出TushareErrorType枚举', () => {
      expect(TushareSDK.TushareErrorType).toBeDefined()
      expect(typeof TushareSDK.TushareErrorType).toBe('object')
    })
  })

  describe('TushareClient可用性测试', () => {
    it('应能够实例化TushareClient', () => {
      const client = new TushareSDK.TushareClient({
        token: 'test_token_for_unit_test_32chars_'
      })

      expect(client).toBeInstanceOf(TushareSDK.TushareClient)
      expect(client.isReady()).toBe(true)
    })

    it('应能够访问TushareClient的方法', () => {
      const client = new TushareSDK.TushareClient({
        token: 'test_token_for_unit_test_32chars_'
      })

      expect(typeof client.daily).toBe('function')
      expect(typeof client.realtimeQuote).toBe('function')
      expect(typeof client.isReady).toBe('function')
      expect(typeof client.getConfig).toBe('function')
    })
  })

  describe('TushareError可用性测试', () => {
    it('应能够创建TushareError实例', () => {
      const error = new TushareSDK.TushareError(
        TushareSDK.TushareErrorType.PARAMETER_ERROR,
        '参数错误',
        -1
      )

      expect(error).toBeInstanceOf(TushareSDK.TushareError)
      expect(error).toBeInstanceOf(Error)
      expect(error.type).toBe(TushareSDK.TushareErrorType.PARAMETER_ERROR)
      expect(error.message).toBe('参数错误')
    })

    it('应能够访问所有错误类型', () => {
      const errorTypes = TushareSDK.TushareErrorType

      expect(errorTypes.AUTHENTICATION_ERROR).toBeDefined()
      expect(errorTypes.PERMISSION_ERROR).toBeDefined()
      expect(errorTypes.RATE_LIMIT_ERROR).toBeDefined()
      expect(errorTypes.PARAMETER_ERROR).toBeDefined()
      expect(errorTypes.NETWORK_ERROR).toBeDefined()
      expect(errorTypes.TIMEOUT_ERROR).toBeDefined()
      expect(errorTypes.SERVER_ERROR).toBeDefined()
      expect(errorTypes.UNKNOWN_ERROR).toBeDefined()
    })
  })

  describe('类型导出检查', () => {
    it('应能够使用导出的类型进行类型检查', () => {
      // 这些类型在TypeScript编译时会被检查
      // 如果类型未正确导出,TypeScript编译会失败

      const config: TushareSDK.ClientConfig = {
        token: 'test_token_for_unit_test_32chars_',
        timeout: 5000,
        debug: false
      }
      expect(config.token).toBe('test_token_for_unit_test_32chars_')

      const dailyParams: TushareSDK.DailyParams = {
        ts_code: '000001.SZ',
        start_date: '20240101'
      }
      expect(dailyParams.ts_code).toBe('000001.SZ')

      const realtimeParams: TushareSDK.RealtimeParams = {
        ts_code: '000001.SZ'
      }
      expect(realtimeParams.ts_code).toBe('000001.SZ')
    })
  })

  describe('SDK完整性检查', () => {
    it('应只导出必要的公共API', () => {
      const exports = Object.keys(TushareSDK)

      // 主要导出项
      expect(exports).toContain('TushareClient')
      expect(exports).toContain('TushareError')
      expect(exports).toContain('TushareErrorType')

      // 不应导出内部实现细节
      expect(exports).not.toContain('HttpClient')
      expect(exports).not.toContain('AuthManager')
      expect(exports).not.toContain('validateDailyParams')
      expect(exports).not.toContain('transformResponse')
    })

    it('SDK应该是稳定的(没有undefined导出)', () => {
      const exports = Object.entries(TushareSDK)

      for (const [key, value] of exports) {
        expect(value).not.toBeUndefined()
        expect(value).not.toBeNull()
      }
    })
  })

  describe('向后兼容性', () => {
    it('主要API应保持一致的接口', () => {
      // 验证TushareClient构造函数签名
      const client = new TushareSDK.TushareClient({
        token: 'test_token_for_unit_test_32chars_'
      })

      // 验证必要方法存在
      expect(client).toHaveProperty('daily')
      expect(client).toHaveProperty('realtimeQuote')
      expect(client).toHaveProperty('isReady')
      expect(client).toHaveProperty('getConfig')

      // 验证TushareError构造函数签名
      const error = new TushareSDK.TushareError(
        TushareSDK.TushareErrorType.UNKNOWN_ERROR,
        'test',
        -1
      )
      expect(error).toHaveProperty('type')
      expect(error).toHaveProperty('code')
      expect(error).toHaveProperty('message')
    })
  })

  describe('文档示例验证', () => {
    it('文档中的基本使用示例应该可用', () => {
      // 模拟quickstart.md中的基本使用示例
      const client = new TushareSDK.TushareClient({
        token: 'your_token_here_32_chars_minimum',
        timeout: 5000,
        debug: false
      })

      expect(client.isReady()).toBe(true)
      expect(typeof client.daily).toBe('function')
      expect(typeof client.realtimeQuote).toBe('function')
    })

    it('文档中的错误处理示例应该可用', () => {
      // 模拟quickstart.md中的错误处理示例
      const errorTypes = TushareSDK.TushareErrorType

      const error = new TushareSDK.TushareError(
        errorTypes.AUTHENTICATION_ERROR,
        'token无效',
        2002
      )

      expect(error.type).toBe(errorTypes.AUTHENTICATION_ERROR)
      expect(error instanceof TushareSDK.TushareError).toBe(true)
    })
  })
})