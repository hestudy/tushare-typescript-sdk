import { describe, it, expect } from 'vitest'
import {
  validateDailyParams,
  validateRealtimeParams,
  validateDateFormat,
  validateStockCode
} from '../../src/utils/validator'
import { TushareError, TushareErrorType } from '../../src/types/error'

describe('validator', () => {
  describe('validateDateFormat', () => {
    it('应接受有效的日期格式 YYYYMMDD', () => {
      expect(validateDateFormat('20240101')).toBe(true)
      expect(validateDateFormat('20240315')).toBe(true)
      expect(validateDateFormat('20241231')).toBe(true)
      expect(validateDateFormat('19900101')).toBe(true)
      expect(validateDateFormat('21001231')).toBe(true)
    })

    it('应拒绝无效的日期长度', () => {
      expect(validateDateFormat('2024010')).toBe(false) // 7位
      expect(validateDateFormat('202401011')).toBe(false) // 9位
      expect(validateDateFormat('20240')).toBe(false)
    })

    it('应拒绝包含非数字字符的日期', () => {
      expect(validateDateFormat('2024-01-01')).toBe(false)
      expect(validateDateFormat('2024/01/01')).toBe(false)
      expect(validateDateFormat('2024010a')).toBe(false)
    })

    it('应拒绝无效的年份', () => {
      expect(validateDateFormat('18991231')).toBe(false) // 年份 < 1900
      expect(validateDateFormat('21010101')).toBe(false) // 年份 > 2100
    })

    it('应拒绝无效的月份', () => {
      expect(validateDateFormat('20240001')).toBe(false) // 月份 = 0
      expect(validateDateFormat('20241301')).toBe(false) // 月份 > 12
    })

    it('应拒绝无效的日期', () => {
      expect(validateDateFormat('20240100')).toBe(false) // 日期 = 0
      expect(validateDateFormat('20240132')).toBe(false) // 日期 > 31
    })
  })

  describe('validateStockCode', () => {
    it('应接受有效的股票代码格式', () => {
      expect(validateStockCode('000001.SZ')).toBe(true)
      expect(validateStockCode('600000.SH')).toBe(true)
      expect(validateStockCode('688001.SH')).toBe(true)
      expect(validateStockCode('300001.SZ')).toBe(true)
      expect(validateStockCode('430001.BJ')).toBe(true) // 北交所
    })

    it('应拒绝无效的股票代码长度', () => {
      expect(validateStockCode('00001.SZ')).toBe(false) // 5位数字
      expect(validateStockCode('0000001.SZ')).toBe(false) // 7位数字
    })

    it('应拒绝无效的交易所代码', () => {
      expect(validateStockCode('000001.XX')).toBe(false)
      expect(validateStockCode('000001.sz')).toBe(false) // 小写
      expect(validateStockCode('000001.SH1')).toBe(false)
    })

    it('应拒绝缺少点号的代码', () => {
      expect(validateStockCode('000001SZ')).toBe(false)
      expect(validateStockCode('000001')).toBe(false)
    })

    it('应拒绝包含非数字字符的代码', () => {
      expect(validateStockCode('00000A.SZ')).toBe(false)
      expect(validateStockCode('A00001.SZ')).toBe(false)
    })
  })

  describe('validateDailyParams', () => {
    it('应接受包含 ts_code 的参数', () => {
      expect(() => validateDailyParams({ ts_code: '000001.SZ' })).not.toThrow()
    })

    it('应接受包含 trade_date 的参数', () => {
      expect(() => validateDailyParams({ trade_date: '20240101' })).not.toThrow()
    })

    it('应接受包含 start_date 和 end_date 的参数', () => {
      expect(() =>
        validateDailyParams({ start_date: '20240101', end_date: '20240131' })
      ).not.toThrow()
    })

    it('应接受组合参数', () => {
      expect(() =>
        validateDailyParams({
          ts_code: '000001.SZ',
          start_date: '20240101',
          end_date: '20240131'
        })
      ).not.toThrow()
    })

    it('应拒绝空参数对象', () => {
      expect(() => validateDailyParams({})).toThrow(TushareError)
      try {
        validateDailyParams({})
      } catch (error) {
        expect(error).toBeInstanceOf(TushareError)
        expect((error as TushareError).type).toBe(TushareErrorType.PARAMETER_ERROR)
        expect((error as TushareError).message).toContain('至少需要提供')
      }
    })

    it('应拒绝无效的 trade_date 格式', () => {
      expect(() => validateDailyParams({ trade_date: '2024-01-01' })).toThrow(TushareError)
      expect(() => validateDailyParams({ trade_date: '20240' })).toThrow(TushareError)
      expect(() => validateDailyParams({ trade_date: '20241301' })).toThrow(TushareError)
    })

    it('应拒绝无效的 start_date 格式', () => {
      expect(() => validateDailyParams({ start_date: '2024-01-01', end_date: '20240131' })).toThrow(
        TushareError
      )
    })

    it('应拒绝无效的 end_date 格式', () => {
      expect(() => validateDailyParams({ start_date: '20240101', end_date: '2024-01-31' })).toThrow(
        TushareError
      )
    })

    it('应拒绝 end_date < start_date', () => {
      expect(() => validateDailyParams({ start_date: '20240131', end_date: '20240101' })).toThrow(
        TushareError
      )
      try {
        validateDailyParams({ start_date: '20240131', end_date: '20240101' })
      } catch (error) {
        expect((error as TushareError).message).toContain('end_date 必须大于等于 start_date')
      }
    })

    it('应拒绝无效的股票代码格式', () => {
      expect(() => validateDailyParams({ ts_code: '000001' })).toThrow(TushareError)
      expect(() => validateDailyParams({ ts_code: '000001.XX' })).toThrow(TushareError)
      expect(() => validateDailyParams({ ts_code: 'AAAA01.SZ' })).toThrow(TushareError)
    })

    it('应验证多个股票代码', () => {
      expect(() =>
        validateDailyParams({ ts_code: '000001.SZ,600000.SH,688001.SH' })
      ).not.toThrow()

      expect(() => validateDailyParams({ ts_code: '000001.SZ,invalid,600000.SH' })).toThrow(
        TushareError
      )
      try {
        validateDailyParams({ ts_code: '000001.SZ,invalid,600000.SH' })
      } catch (error) {
        expect((error as TushareError).message).toContain('invalid')
      }
    })

    it('应处理带空格的股票代码', () => {
      expect(() => validateDailyParams({ ts_code: '000001.SZ, 600000.SH' })).not.toThrow()
      expect(() => validateDailyParams({ ts_code: ' 000001.SZ , 600000.SH ' })).not.toThrow()
    })
  })

  describe('validateRealtimeParams', () => {
    it('应接受有效的单个股票代码', () => {
      expect(() => validateRealtimeParams({ ts_code: '000001.SZ' })).not.toThrow()
      expect(() => validateRealtimeParams({ ts_code: '600000.SH' })).not.toThrow()
    })

    it('应接受多个股票代码', () => {
      expect(() => validateRealtimeParams({ ts_code: '000001.SZ,600000.SH' })).not.toThrow()
      expect(() => validateRealtimeParams({ ts_code: '000001.SZ,600000.SH,688001.SH' })).not.toThrow()
    })

    it('应拒绝空的 ts_code', () => {
      expect(() => validateRealtimeParams({ ts_code: '' })).toThrow(TushareError)
      try {
        validateRealtimeParams({ ts_code: '' })
      } catch (error) {
        expect(error).toBeInstanceOf(TushareError)
        expect((error as TushareError).type).toBe(TushareErrorType.PARAMETER_ERROR)
        expect((error as TushareError).message).toContain('ts_code 为必填项')
      }
    })

    it('应拒绝缺少 ts_code', () => {
      expect(() => validateRealtimeParams({} as any)).toThrow(TushareError)
    })

    it('应拒绝无效的股票代码格式', () => {
      expect(() => validateRealtimeParams({ ts_code: '000001' })).toThrow(TushareError)
      expect(() => validateRealtimeParams({ ts_code: '000001.XX' })).toThrow(TushareError)
      expect(() => validateRealtimeParams({ ts_code: 'INVALID.SZ' })).toThrow(TushareError)
    })

    it('应拒绝包含无效代码的多代码列表', () => {
      expect(() => validateRealtimeParams({ ts_code: '000001.SZ,invalid' })).toThrow(TushareError)
      expect(() => validateRealtimeParams({ ts_code: 'invalid,600000.SH' })).toThrow(TushareError)
    })

    it('应处理带空格的股票代码', () => {
      expect(() => validateRealtimeParams({ ts_code: ' 000001.SZ ' })).not.toThrow()
      expect(() => validateRealtimeParams({ ts_code: '000001.SZ, 600000.SH' })).not.toThrow()
    })
  })
})