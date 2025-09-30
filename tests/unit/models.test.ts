import { describe, it, expect } from 'vitest'
import * as balanceModel from '../../src/models/balance'
import * as incomeModel from '../../src/models/income'
import * as cashflowModel from '../../src/models/cashflow'
import * as indicatorsModel from '../../src/models/indicators'

describe('财务报表模型', () => {
  describe('资产负债表模型', () => {
    describe('fromApiResponse', () => {
      it('应该正确转换 API 响应数据', () => {
        const fields = ['ts_code', 'end_date', 'ann_date', 'report_type', 'total_assets', 'total_liab']
        const items = [['000001.SZ', '20231231', '20240328', '1', 1200000000000, 800000000000]]

        const result = balanceModel.fromApiResponse(fields, items)

        expect(result).toHaveLength(1)
        expect(result[0].tsCode).toBe('000001.SZ')
        expect(result[0].endDate).toBe('20231231')
        expect(result[0].annDate).toBe('20240328')
        expect(result[0].totalAssets).toBe(1200000000000)
        expect(result[0].totalLiab).toBe(800000000000)
      })

      it('应该处理空数组', () => {
        const fields = ['ts_code', 'end_date']
        const items: any[][] = []

        const result = balanceModel.fromApiResponse(fields, items)

        expect(result).toEqual([])
      })

      it('应该处理 null 值', () => {
        const fields = ['ts_code', 'end_date', 'ann_date', 'total_assets', 'total_liab']
        const items = [['000001.SZ', '20231231', '20240328', null, null]]

        const result = balanceModel.fromApiResponse(fields, items)

        expect(result).toHaveLength(1)
        expect(result[0].totalAssets).toBeNull()
        expect(result[0].totalLiab).toBeNull()
      })

      it('应该处理未定义的字段', () => {
        const fields = ['ts_code', 'end_date', 'ann_date']
        const items = [['000001.SZ', '20231231', '20240328']]

        const result = balanceModel.fromApiResponse(fields, items)

        expect(result).toHaveLength(1)
        expect(result[0].totalAssets).toBeNull()
      })

      it('应该验证无效的股票代码并抛出错误', () => {
        const fields = ['ts_code', 'end_date', 'ann_date']
        const items = [['INVALID', '20231231', '20240328']]

        expect(() => balanceModel.fromApiResponse(fields, items)).toThrow('tsCode 格式无效')
      })

      it('应该验证空股票代码并抛出错误', () => {
        const fields = ['ts_code', 'end_date', 'ann_date']
        const items = [['', '20231231', '20240328']]

        expect(() => balanceModel.fromApiResponse(fields, items)).toThrow('tsCode 不能为空')
      })

      it('应该验证空日期并抛出错误', () => {
        const fields = ['ts_code', 'end_date', 'ann_date']
        const items = [['000001.SZ', '', '20240328']]

        expect(() => balanceModel.fromApiResponse(fields, items)).toThrow('日期不能为空')
      })

      it('应该验证无效的日期格式并抛出错误', () => {
        const fields = ['ts_code', 'end_date', 'ann_date']
        const items = [['000001.SZ', '2023-12-31', '20240328']]

        expect(() => balanceModel.fromApiResponse(fields, items)).toThrow('日期格式无效')
      })

      it('应该处理数字字符串', () => {
        const fields = ['ts_code', 'end_date', 'ann_date', 'total_assets']
        const items = [['000001.SZ', '20231231', '20240328', '1200000000000']]

        const result = balanceModel.fromApiResponse(fields, items)

        expect(result[0].totalAssets).toBe(1200000000000)
      })

      it('应该处理多行数据', () => {
        const fields = ['ts_code', 'end_date', 'ann_date', 'total_assets']
        const items = [
          ['000001.SZ', '20231231', '20240328', 1200000000000],
          ['000002.SZ', '20231231', '20240328', 800000000000]
        ]

        const result = balanceModel.fromApiResponse(fields, items)

        expect(result).toHaveLength(2)
        expect(result[0].tsCode).toBe('000001.SZ')
        expect(result[1].tsCode).toBe('000002.SZ')
      })
    })
  })

  describe('利润表模型', () => {
    describe('fromApiResponse', () => {
      it('应该正确转换 API 响应数据', () => {
        const fields = ['ts_code', 'end_date', 'ann_date', 'revenue', 'operate_profit', 'n_income']
        const items = [['000001.SZ', '20231231', '20240328', 10000000000, 5000000000, 3000000000]]

        const result = incomeModel.fromApiResponse(fields, items)

        expect(result).toHaveLength(1)
        expect(result[0].tsCode).toBe('000001.SZ')
        expect(result[0].revenue).toBe(10000000000)
        expect(result[0].operateProfit).toBe(5000000000)
        expect(result[0].nIncome).toBe(3000000000)
      })

      it('应该处理空数组', () => {
        const fields = ['ts_code', 'end_date']
        const items: any[][] = []

        const result = incomeModel.fromApiResponse(fields, items)

        expect(result).toEqual([])
      })

      it('应该处理 null 值', () => {
        const fields = ['ts_code', 'end_date', 'ann_date', 'revenue']
        const items = [['000001.SZ', '20231231', '20240328', null]]

        const result = incomeModel.fromApiResponse(fields, items)

        expect(result[0].revenue).toBeNull()
      })

      it('应该验证股票代码格式', () => {
        const fields = ['ts_code', 'end_date', 'ann_date']
        const items = [['INVALID', '20231231', '20240328']]

        expect(() => incomeModel.fromApiResponse(fields, items)).toThrow('tsCode 格式无效')
      })

      it('应该验证空日期并抛出错误', () => {
        const fields = ['ts_code', 'end_date', 'ann_date']
        const items = [['000001.SZ', '20231231', '']]

        expect(() => incomeModel.fromApiResponse(fields, items)).toThrow('日期不能为空')
      })

      it('应该验证无效日期格式并抛出错误', () => {
        const fields = ['ts_code', 'end_date', 'ann_date']
        const items = [['000001.SZ', '2023-12-31', '20240328']]

        expect(() => incomeModel.fromApiResponse(fields, items)).toThrow('日期格式无效')
      })
    })
  })

  describe('现金流量表模型', () => {
    describe('fromApiResponse', () => {
      it('应该正确转换 API 响应数据', () => {
        const fields = ['ts_code', 'end_date', 'ann_date', 'n_cashflow_act', 'n_cashflow_inv_act']
        const items = [['000001.SZ', '20231231', '20240328', 1000000000, -500000000]]

        const result = cashflowModel.fromApiResponse(fields, items)

        expect(result).toHaveLength(1)
        expect(result[0].tsCode).toBe('000001.SZ')
        expect(result[0].nCashflowAct).toBe(1000000000)
        expect(result[0].nCashflowInvAct).toBe(-500000000)
      })

      it('应该处理空数组', () => {
        const fields = ['ts_code', 'end_date']
        const items: any[][] = []

        const result = cashflowModel.fromApiResponse(fields, items)

        expect(result).toEqual([])
      })

      it('应该处理 null 值', () => {
        const fields = ['ts_code', 'end_date', 'ann_date', 'n_cashflow_act']
        const items = [['000001.SZ', '20231231', '20240328', null]]

        const result = cashflowModel.fromApiResponse(fields, items)

        expect(result[0].nCashflowAct).toBeNull()
      })

      it('应该验证股票代码格式', () => {
        const fields = ['ts_code', 'end_date', 'ann_date']
        const items = [['INVALID', '20231231', '20240328']]

        expect(() => cashflowModel.fromApiResponse(fields, items)).toThrow('tsCode 格式无效')
      })

      it('应该验证空日期并抛出错误', () => {
        const fields = ['ts_code', 'end_date', 'ann_date']
        const items = [['000001.SZ', '', '20240328']]

        expect(() => cashflowModel.fromApiResponse(fields, items)).toThrow('日期不能为空')
      })

      it('应该验证无效日期格式并抛出错误', () => {
        const fields = ['ts_code', 'end_date', 'ann_date']
        const items = [['000001.SZ', '20231231', '2024-03-28']]

        expect(() => cashflowModel.fromApiResponse(fields, items)).toThrow('日期格式无效')
      })

      it('应该处理负数现金流', () => {
        const fields = ['ts_code', 'end_date', 'ann_date', 'n_cashflow_act', 'n_cashflow_inv_act', 'n_cash_flows_fnc_act']
        const items = [['000001.SZ', '20231231', '20240328', -100000, -200000, -300000]]

        const result = cashflowModel.fromApiResponse(fields, items)

        expect(result[0].nCashflowAct).toBe(-100000)
        expect(result[0].nCashflowInvAct).toBe(-200000)
        expect(result[0].nCashFlowsFncAct).toBe(-300000)
      })
    })
  })

  describe('财务指标模型', () => {
    describe('fromApiResponse', () => {
      it('应该正确转换 API 响应数据', () => {
        const fields = ['ts_code', 'end_date', 'ann_date', 'eps', 'roe', 'current_ratio']
        const items = [['000001.SZ', '20231231', '20240328', 1.23, 15.5, 2.1]]

        const result = indicatorsModel.fromApiResponse(fields, items)

        expect(result).toHaveLength(1)
        expect(result[0].tsCode).toBe('000001.SZ')
        expect(result[0].eps).toBe(1.23)
        expect(result[0].roe).toBe(15.5)
        expect(result[0].currentRatio).toBe(2.1)
      })

      it('应该处理空数组', () => {
        const fields = ['ts_code', 'end_date']
        const items: any[][] = []

        const result = indicatorsModel.fromApiResponse(fields, items)

        expect(result).toEqual([])
      })

      it('应该处理 null 值', () => {
        const fields = ['ts_code', 'end_date', 'ann_date', 'eps']
        const items = [['000001.SZ', '20231231', '20240328', null]]

        const result = indicatorsModel.fromApiResponse(fields, items)

        expect(result[0].eps).toBeNull()
      })

      it('应该验证股票代码格式', () => {
        const fields = ['ts_code', 'end_date', 'ann_date']
        const items = [['INVALID', '20231231', '20240328']]

        expect(() => indicatorsModel.fromApiResponse(fields, items)).toThrow('tsCode 格式无效')
      })

      it('应该验证空日期并抛出错误', () => {
        const fields = ['ts_code', 'end_date', 'ann_date']
        const items = [['000001.SZ', '20231231', '']]

        expect(() => indicatorsModel.fromApiResponse(fields, items)).toThrow('日期不能为空')
      })

      it('应该验证无效日期格式并抛出错误', () => {
        const fields = ['ts_code', 'end_date', 'ann_date']
        const items = [['000001.SZ', '2023/12/31', '20240328']]

        expect(() => indicatorsModel.fromApiResponse(fields, items)).toThrow('日期格式无效')
      })

      it('应该处理小数点精度', () => {
        const fields = ['ts_code', 'end_date', 'ann_date', 'eps', 'roe']
        const items = [['000001.SZ', '20231231', '20240328', 1.2345, 15.6789]]

        const result = indicatorsModel.fromApiResponse(fields, items)

        expect(result[0].eps).toBe(1.2345)
        expect(result[0].roe).toBe(15.6789)
      })

      it('应该处理负值财务指标', () => {
        const fields = ['ts_code', 'end_date', 'ann_date', 'eps', 'roe']
        const items = [['000001.SZ', '20231231', '20240328', -0.5, -10.5]]

        const result = indicatorsModel.fromApiResponse(fields, items)

        expect(result[0].eps).toBe(-0.5)
        expect(result[0].roe).toBe(-10.5)
      })
    })
  })

  describe('边界情况', () => {
    it('资产负债表: 应该处理所有字段为 null', () => {
      const fields = ['ts_code', 'end_date', 'ann_date', 'total_assets', 'total_liab', 'total_cur_assets']
      const items = [['000001.SZ', '20231231', '20240328', null, null, null]]

      const result = balanceModel.fromApiResponse(fields, items)

      expect(result[0].totalAssets).toBeNull()
      expect(result[0].totalLiab).toBeNull()
      expect(result[0].totalCurAssets).toBeNull()
    })

    it('利润表: 应该处理空字符串', () => {
      const fields = ['ts_code', 'end_date', 'ann_date', 'revenue']
      const items = [['000001.SZ', '20231231', '20240328', '']]

      const result = incomeModel.fromApiResponse(fields, items)

      expect(result[0].revenue).toBeNull()
    })

    it('现金流量表: 应该处理零值', () => {
      const fields = ['ts_code', 'end_date', 'ann_date', 'n_cashflow_act']
      const items = [['000001.SZ', '20231231', '20240328', 0]]

      const result = cashflowModel.fromApiResponse(fields, items)

      expect(result[0].nCashflowAct).toBe(0)
    })

    it('财务指标: 应该处理极小值', () => {
      const fields = ['ts_code', 'end_date', 'ann_date', 'eps']
      const items = [['000001.SZ', '20231231', '20240328', 0.0001]]

      const result = indicatorsModel.fromApiResponse(fields, items)

      expect(result[0].eps).toBe(0.0001)
    })

    it('所有模型: 应该处理北京证券交易所代码', () => {
      const fields = ['ts_code', 'end_date', 'ann_date']
      const items = [['430047.BJ', '20231231', '20240328']]

      expect(() => balanceModel.fromApiResponse(fields, items)).not.toThrow()
      expect(() => incomeModel.fromApiResponse(fields, items)).not.toThrow()
      expect(() => cashflowModel.fromApiResponse(fields, items)).not.toThrow()
      expect(() => indicatorsModel.fromApiResponse(fields, items)).not.toThrow()

      const balanceResult = balanceModel.fromApiResponse(fields, items)
      expect(balanceResult[0].tsCode).toBe('430047.BJ')
    })

    it('所有模型: 应该处理上海证券交易所代码', () => {
      const fields = ['ts_code', 'end_date', 'ann_date']
      const items = [['600000.SH', '20231231', '20240328']]

      const balanceResult = balanceModel.fromApiResponse(fields, items)
      const incomeResult = incomeModel.fromApiResponse(fields, items)
      const cashflowResult = cashflowModel.fromApiResponse(fields, items)
      const indicatorsResult = indicatorsModel.fromApiResponse(fields, items)

      expect(balanceResult[0].tsCode).toBe('600000.SH')
      expect(incomeResult[0].tsCode).toBe('600000.SH')
      expect(cashflowResult[0].tsCode).toBe('600000.SH')
      expect(indicatorsResult[0].tsCode).toBe('600000.SH')
    })
  })
})