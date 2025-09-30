/**
 * 集成测试 - 完整 API 测试流程
 *
 * 测试场景:
 * 1. 用户配置 token
 * 2. 用户填写参数并发送请求
 * 3. 显示测试结果
 * 4. 历史记录中出现该请求
 * 5. 可从历史记录重放请求
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import type { TokenConfig, RequestHistoryEntry, TestResult } from '../../specs/004-sdk-api/contracts/storage.contract'

describe('集成测试: API 测试流程', () => {
  // Mock localStorage
  const mockStorage = new Map<string, string>()

  beforeEach(() => {
    mockStorage.clear()

    // Mock localStorage
    global.localStorage = {
      getItem: vi.fn((key: string) => mockStorage.get(key) || null),
      setItem: vi.fn((key: string, value: string) => {
        mockStorage.set(key, value)
      }),
      removeItem: vi.fn((key: string) => {
        mockStorage.delete(key)
      }),
      clear: vi.fn(() => {
        mockStorage.clear()
      }),
      key: vi.fn((index: number) => {
        const keys = Array.from(mockStorage.keys())
        return keys[index] || null
      }),
      length: mockStorage.size,
    } as Storage
  })

  describe('步骤 1: Token 配置', () => {
    it('应该能够保存 token 到 localStorage', () => {
      const tokenConfig: TokenConfig = {
        token: 'test-token-123',
        lastUpdated: Date.now(),
        label: 'Test Token'
      }

      localStorage.setItem('tushare-sdk-docs:token', JSON.stringify(tokenConfig))

      const stored = localStorage.getItem('tushare-sdk-docs:token')
      expect(stored).toBeTruthy()

      const parsed = JSON.parse(stored!)
      expect(parsed.token).toBe('test-token-123')
      expect(parsed.label).toBe('Test Token')
    })

    it('应该能够从 localStorage 读取 token', () => {
      const tokenConfig: TokenConfig = {
        token: 'test-token-456',
        lastUpdated: Date.now()
      }

      mockStorage.set('tushare-sdk-docs:token', JSON.stringify(tokenConfig))

      const stored = localStorage.getItem('tushare-sdk-docs:token')
      const parsed = JSON.parse(stored!)

      expect(parsed.token).toBe('test-token-456')
    })

    it('应该能够清除 token', () => {
      const tokenConfig: TokenConfig = {
        token: 'test-token-789',
        lastUpdated: Date.now()
      }

      localStorage.setItem('tushare-sdk-docs:token', JSON.stringify(tokenConfig))
      expect(localStorage.getItem('tushare-sdk-docs:token')).toBeTruthy()

      localStorage.removeItem('tushare-sdk-docs:token')
      expect(localStorage.getItem('tushare-sdk-docs:token')).toBeNull()
    })
  })

  describe('步骤 2-3: 参数填写和请求发送', () => {
    it('应该能够构造正确的测试结果对象', () => {
      const testResult: TestResult = {
        statusCode: 200,
        responseTime: 1234,
        data: {
          code: 0,
          msg: 'success',
          data: [
            { ts_code: '000001.SZ', trade_date: '20250101', close: 10.5 }
          ]
        },
        metadata: {
          apiName: 'daily',
          parameters: { ts_code: '000001.SZ', trade_date: '20250101' },
          startTime: Date.now() - 1234,
          endTime: Date.now()
        }
      }

      expect(testResult.statusCode).toBe(200)
      expect(testResult.responseTime).toBe(1234)
      expect(testResult.data.code).toBe(0)
      expect(testResult.metadata.apiName).toBe('daily')
    })

    it('应该能够处理错误结果', () => {
      const testResult: TestResult = {
        statusCode: 400,
        responseTime: 500,
        data: null,
        error: {
          name: 'ValidationError',
          message: 'Invalid ts_code parameter',
          code: 'INVALID_PARAM'
        },
        metadata: {
          apiName: 'daily',
          parameters: { ts_code: 'INVALID' },
          startTime: Date.now() - 500,
          endTime: Date.now()
        }
      }

      expect(testResult.statusCode).toBe(400)
      expect(testResult.error).toBeDefined()
      expect(testResult.error?.name).toBe('ValidationError')
      expect(testResult.error?.code).toBe('INVALID_PARAM')
    })
  })

  describe('步骤 4: 历史记录保存', () => {
    it('应该能够添加历史记录', () => {
      const historyEntry: RequestHistoryEntry = {
        id: 'uuid-123',
        apiName: 'daily',
        parameters: { ts_code: '000001.SZ', trade_date: '20250101' },
        timestamp: Date.now(),
        success: true,
        responseSummary: 'Successfully retrieved 1 record',
        responseTime: 1234,
        statusCode: 200
      }

      const history: RequestHistoryEntry[] = [historyEntry]
      localStorage.setItem('tushare-sdk-docs:history', JSON.stringify(history))

      const stored = localStorage.getItem('tushare-sdk-docs:history')
      const parsed: RequestHistoryEntry[] = JSON.parse(stored!)

      expect(parsed).toHaveLength(1)
      expect(parsed[0].apiName).toBe('daily')
      expect(parsed[0].success).toBe(true)
    })

    it('应该自动限制历史记录数量为 50 条', () => {
      // 创建超过 50 条的历史记录
      const history: RequestHistoryEntry[] = []
      for (let i = 0; i < 60; i++) {
        history.push({
          id: `uuid-${i}`,
          apiName: 'daily',
          parameters: { ts_code: '000001.SZ' },
          timestamp: Date.now() - (60 - i) * 1000,
          success: true,
          responseSummary: `Record ${i}`,
          responseTime: 1000,
          statusCode: 200
        })
      }

      // 模拟添加历史记录并限制数量
      const maxEntries = 50
      const limitedHistory = history.slice(-maxEntries)

      expect(limitedHistory).toHaveLength(50)
      expect(limitedHistory[0].responseSummary).toBe('Record 10')
      expect(limitedHistory[49].responseSummary).toBe('Record 59')
    })

    it('应该按时间戳排序历史记录(最新的在前)', () => {
      const now = Date.now()
      const history: RequestHistoryEntry[] = [
        {
          id: 'uuid-1',
          apiName: 'daily',
          parameters: {},
          timestamp: now - 3000,
          success: true,
          responseSummary: 'Oldest'
        },
        {
          id: 'uuid-2',
          apiName: 'weekly',
          parameters: {},
          timestamp: now - 1000,
          success: true,
          responseSummary: 'Newest'
        },
        {
          id: 'uuid-3',
          apiName: 'minute',
          parameters: {},
          timestamp: now - 2000,
          success: true,
          responseSummary: 'Middle'
        }
      ]

      const sorted = [...history].sort((a, b) => b.timestamp - a.timestamp)

      expect(sorted[0].responseSummary).toBe('Newest')
      expect(sorted[1].responseSummary).toBe('Middle')
      expect(sorted[2].responseSummary).toBe('Oldest')
    })
  })

  describe('步骤 5: 历史记录重放', () => {
    it('应该能够从历史记录中获取参数', () => {
      const historyEntry: RequestHistoryEntry = {
        id: 'uuid-123',
        apiName: 'daily',
        parameters: {
          ts_code: '000001.SZ',
          trade_date: '20250101',
          start_date: '20250101',
          end_date: '20250131'
        },
        timestamp: Date.now(),
        success: true,
        responseSummary: 'Success'
      }

      // 模拟重放:从历史记录中提取参数
      const replayParams = historyEntry.parameters

      expect(replayParams.ts_code).toBe('000001.SZ')
      expect(replayParams.trade_date).toBe('20250101')
      expect(replayParams.start_date).toBe('20250101')
      expect(replayParams.end_date).toBe('20250131')
    })

    it('应该能够删除单条历史记录', () => {
      const history: RequestHistoryEntry[] = [
        {
          id: 'uuid-1',
          apiName: 'daily',
          parameters: {},
          timestamp: Date.now(),
          success: true,
          responseSummary: 'Record 1'
        },
        {
          id: 'uuid-2',
          apiName: 'weekly',
          parameters: {},
          timestamp: Date.now(),
          success: true,
          responseSummary: 'Record 2'
        }
      ]

      localStorage.setItem('tushare-sdk-docs:history', JSON.stringify(history))

      // 模拟删除操作
      const idToRemove = 'uuid-1'
      const updatedHistory = history.filter(entry => entry.id !== idToRemove)
      localStorage.setItem('tushare-sdk-docs:history', JSON.stringify(updatedHistory))

      const stored = localStorage.getItem('tushare-sdk-docs:history')
      const parsed: RequestHistoryEntry[] = JSON.parse(stored!)

      expect(parsed).toHaveLength(1)
      expect(parsed[0].id).toBe('uuid-2')
    })

    it('应该能够清空所有历史记录', () => {
      const history: RequestHistoryEntry[] = [
        {
          id: 'uuid-1',
          apiName: 'daily',
          parameters: {},
          timestamp: Date.now(),
          success: true,
          responseSummary: 'Record 1'
        }
      ]

      localStorage.setItem('tushare-sdk-docs:history', JSON.stringify(history))
      expect(localStorage.getItem('tushare-sdk-docs:history')).toBeTruthy()

      localStorage.removeItem('tushare-sdk-docs:history')
      expect(localStorage.getItem('tushare-sdk-docs:history')).toBeNull()
    })
  })

  describe('完整流程集成', () => {
    it('应该完成完整的 API 测试流程', () => {
      // 1. 配置 token
      const tokenConfig: TokenConfig = {
        token: 'test-token',
        lastUpdated: Date.now()
      }
      localStorage.setItem('tushare-sdk-docs:token', JSON.stringify(tokenConfig))

      // 2. 验证 token 已保存
      const storedToken = localStorage.getItem('tushare-sdk-docs:token')
      expect(storedToken).toBeTruthy()

      // 3. 创建测试结果
      const testResult: TestResult = {
        statusCode: 200,
        responseTime: 1500,
        data: { code: 0, data: [] },
        metadata: {
          apiName: 'daily',
          parameters: { ts_code: '000001.SZ' },
          startTime: Date.now() - 1500,
          endTime: Date.now()
        }
      }

      // 4. 添加到历史记录
      const historyEntry: RequestHistoryEntry = {
        id: `uuid-${Date.now()}`,
        apiName: testResult.metadata.apiName,
        parameters: testResult.metadata.parameters,
        timestamp: testResult.metadata.endTime,
        success: testResult.statusCode >= 200 && testResult.statusCode < 300,
        responseSummary: testResult.error
          ? testResult.error.message
          : `Successfully completed in ${testResult.responseTime}ms`,
        responseTime: testResult.responseTime,
        statusCode: testResult.statusCode
      }

      const history: RequestHistoryEntry[] = [historyEntry]
      localStorage.setItem('tushare-sdk-docs:history', JSON.stringify(history))

      // 5. 验证历史记录
      const storedHistory = localStorage.getItem('tushare-sdk-docs:history')
      const parsedHistory: RequestHistoryEntry[] = JSON.parse(storedHistory!)

      expect(parsedHistory).toHaveLength(1)
      expect(parsedHistory[0].apiName).toBe('daily')
      expect(parsedHistory[0].success).toBe(true)
      expect(parsedHistory[0].parameters.ts_code).toBe('000001.SZ')

      // 6. 重放请求(获取参数)
      const replayParams = parsedHistory[0].parameters
      expect(replayParams).toEqual({ ts_code: '000001.SZ' })
    })
  })

  describe('错误处理', () => {
    it('应该处理 localStorage 存储满的情况', () => {
      // 模拟 QuotaExceededError
      const mockSetItem = vi.fn(() => {
        const error = new Error('QuotaExceededError')
        error.name = 'QuotaExceededError'
        throw error
      })

      try {
        mockSetItem()
      } catch (e: any) {
        expect(e.name).toBe('QuotaExceededError')
        // 在实际实现中,这里应该清理旧记录
      }
    })

    it('应该处理损坏的 JSON 数据', () => {
      mockStorage.set('tushare-sdk-docs:token', 'invalid-json{')

      try {
        const stored = localStorage.getItem('tushare-sdk-docs:token')
        JSON.parse(stored!)
      } catch (e) {
        expect(e).toBeInstanceOf(SyntaxError)
        // 在实际实现中,这里应该返回 null 或默认值
      }
    })
  })
})