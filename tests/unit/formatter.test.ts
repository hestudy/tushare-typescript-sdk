import { describe, it, expect } from 'vitest'
import { formatDate, formatStockCode, parseStockCodes } from '../../src/utils/formatter'

describe('formatter', () => {
  describe('formatDate', () => {
    it('应将Date对象格式化为YYYYMMDD', () => {
      const date1 = new Date('2024-01-01')
      expect(formatDate(date1)).toBe('20240101')

      const date2 = new Date('2024-12-31')
      expect(formatDate(date2)).toBe('20241231')

      const date3 = new Date('2024-03-15')
      expect(formatDate(date3)).toBe('20240315')
    })

    it('应移除日期字符串中的连字符', () => {
      expect(formatDate('2024-01-01')).toBe('20240101')
      expect(formatDate('2024-12-31')).toBe('20241231')
    })

    it('应移除日期字符串中的斜杠', () => {
      expect(formatDate('2024/01/01')).toBe('20240101')
      expect(formatDate('2024/12/31')).toBe('20241231')
    })

    it('应移除日期字符串中的空格', () => {
      expect(formatDate('2024 01 01')).toBe('20240101')
      expect(formatDate('2024  01  01')).toBe('20240101')
    })

    it('应处理已经是YYYYMMDD格式的字符串', () => {
      expect(formatDate('20240101')).toBe('20240101')
      expect(formatDate('20241231')).toBe('20241231')
    })

    it('应处理混合分隔符', () => {
      expect(formatDate('2024-01/01')).toBe('20240101')
      expect(formatDate('2024 01-01')).toBe('20240101')
    })

    it('应正确处理个位数月份和日期', () => {
      const date = new Date('2024-01-05')
      expect(formatDate(date)).toBe('20240105')

      const date2 = new Date('2024-09-09')
      expect(formatDate(date2)).toBe('20240909')
    })
  })

  describe('formatStockCode', () => {
    it('应保持已格式化的股票代码不变', () => {
      expect(formatStockCode('000001.SZ')).toBe('000001.SZ')
      expect(formatStockCode('600000.SH')).toBe('600000.SH')
      expect(formatStockCode('688001.SH')).toBe('688001.SH')
    })

    it('应将6开头的代码格式化为上海股票', () => {
      expect(formatStockCode('600000')).toBe('600000.SH')
      expect(formatStockCode('601888')).toBe('601888.SH')
      expect(formatStockCode('688001')).toBe('688001.SH')
    })

    it('应将非6开头的代码格式化为深圳股票', () => {
      expect(formatStockCode('000001')).toBe('000001.SZ')
      expect(formatStockCode('300001')).toBe('300001.SZ')
      expect(formatStockCode('002001')).toBe('002001.SZ')
    })

    it('应移除首尾空格', () => {
      expect(formatStockCode(' 000001.SZ ')).toBe('000001.SZ')
      expect(formatStockCode('  600000.SH  ')).toBe('600000.SH')
      expect(formatStockCode(' 000001 ')).toBe('000001.SZ')
    })

    it('应将小写转换为大写', () => {
      expect(formatStockCode('000001.sz')).toBe('000001.SZ')
      expect(formatStockCode('600000.sh')).toBe('600000.SH')
    })

    it('应处理无法识别格式的代码', () => {
      // 非6位数字的代码保持原样
      expect(formatStockCode('AAAA')).toBe('AAAA')
      expect(formatStockCode('123')).toBe('123')
      expect(formatStockCode('12345678')).toBe('12345678')
    })

    it('应同时处理空格和大小写', () => {
      expect(formatStockCode(' 000001.sz ')).toBe('000001.SZ')
      expect(formatStockCode('  600000.sh  ')).toBe('600000.SH')
    })
  })

  describe('parseStockCodes', () => {
    it('应解析单个股票代码', () => {
      const codes = parseStockCodes('000001.SZ')
      expect(codes).toEqual(['000001.SZ'])
    })

    it('应解析多个股票代码', () => {
      const codes = parseStockCodes('000001.SZ,600000.SH,688001.SH')
      expect(codes).toEqual(['000001.SZ', '600000.SH', '688001.SH'])
    })

    it('应移除代码两侧的空格', () => {
      const codes = parseStockCodes(' 000001.SZ , 600000.SH ')
      expect(codes).toEqual(['000001.SZ', '600000.SH'])
    })

    it('应过滤空字符串', () => {
      const codes = parseStockCodes('000001.SZ,,600000.SH')
      expect(codes).toEqual(['000001.SZ', '600000.SH'])

      const codes2 = parseStockCodes('000001.SZ,  ,600000.SH')
      expect(codes2).toEqual(['000001.SZ', '600000.SH'])
    })

    it('应自动格式化未格式化的代码', () => {
      const codes = parseStockCodes('000001,600000')
      expect(codes).toEqual(['000001.SZ', '600000.SH'])
    })

    it('应处理混合格式的代码', () => {
      const codes = parseStockCodes('000001,600000.SH,300001.sz')
      expect(codes).toEqual(['000001.SZ', '600000.SH', '300001.SZ'])
    })

    it('应处理只有一个代码的情况', () => {
      const codes = parseStockCodes('000001')
      expect(codes).toEqual(['000001.SZ'])
    })

    it('应处理空字符串', () => {
      const codes = parseStockCodes('')
      expect(codes).toEqual([])
    })

    it('应处理只有逗号和空格的字符串', () => {
      const codes = parseStockCodes(',  ,  ,')
      expect(codes).toEqual([])
    })

    it('应同时处理空格、大小写和自动格式化', () => {
      const codes = parseStockCodes(' 000001 , 600000.sh , 300001.SZ ')
      expect(codes).toEqual(['000001.SZ', '600000.SH', '300001.SZ'])
    })

    it('应处理大量股票代码', () => {
      const input = Array.from({ length: 50 }, (_, i) =>
        i < 25 ? `${String(i).padStart(6, '0')}` : `6${String(i).padStart(5, '0')}`
      ).join(',')
      const codes = parseStockCodes(input)
      expect(codes).toHaveLength(50)
      expect(codes[0]).toBe('000000.SZ')
      expect(codes[24]).toBe('000024.SZ')
      expect(codes[25]).toBe('600025.SH')
      expect(codes[49]).toBe('600049.SH')
    })
  })
})