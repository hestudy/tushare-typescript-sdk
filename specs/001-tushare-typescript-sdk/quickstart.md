# Quick Start Guide: Tushare TypeScript SDK

**Feature**: 001-tushare-typescript-sdk
**Date**: 2025-09-30
**Version**: 1.0.0

本指南演示如何快速开始使用Tushare TypeScript SDK访问股票行情数据。

---

## 前置要求

- **Node.js**: >= 20.0.0
- **TypeScript**: >= 5.0.0 (如果使用TypeScript开发)
- **Tushare Token**: 从 [Tushare Pro](https://tushare.pro) 用户中心获取

---

## 安装

```bash
# 使用npm
npm install tushare-typescript-sdk

# 使用pnpm
pnpm add tushare-typescript-sdk

# 使用yarn
yarn add tushare-typescript-sdk
```

---

## 基础使用

### 1. 初始化客户端

```typescript
import { TushareClient } from 'tushare-typescript-sdk'

// 创建客户端实例
const client = new TushareClient({
  token: 'your_tushare_token_here',  // 必填
  timeout: 5000,                     // 可选,默认5000ms
  debug: false                        // 可选,默认false
})
```

### 2. 查询日线行情

```typescript
async function getDailyQuote() {
  try {
    // 查询平安银行(000001.SZ)的最新日线数据
    const response = await client.daily({
      ts_code: '000001.SZ'
    })

    if (response.success && response.data) {
      // 使用结构化数据
      response.data.forEach(quote => {
        console.log(`日期: ${quote.trade_date}`)
        console.log(`开盘: ${quote.open}`)
        console.log(`收盘: ${quote.close}`)
        console.log(`涨跌幅: ${quote.pct_chg}%`)
        console.log('---')
      })
    }
  } catch (error) {
    console.error('查询失败:', error)
  }
}

getDailyQuote()
```

### 3. 查询日期范围的行情

```typescript
async function getDailyQuoteRange() {
  const response = await client.daily({
    ts_code: '000001.SZ',
    start_date: '20250901',
    end_date: '20250930'
  })

  if (response.success && response.data) {
    console.log(`获取到 ${response.data.length} 条数据`)

    // 计算月度收益
    const firstQuote = response.data[0]
    const lastQuote = response.data[response.data.length - 1]
    const monthReturn = (
      (lastQuote.close - firstQuote.open) / firstQuote.open * 100
    ).toFixed(2)

    console.log(`月度收益: ${monthReturn}%`)
  }
}
```

### 4. 查询实时行情

```typescript
async function getRealtimeQuote() {
  try {
    // 查询单个股票实时行情
    const response = await client.realtimeQuote({
      ts_code: '000001.SZ'
    })

    if (response.success && response.data) {
      const quote = response.data[0]
      console.log(`${quote.name} (${quote.ts_code})`)
      console.log(`当前价: ${quote.price}`)
      console.log(`今开: ${quote.open}`)
      console.log(`最高: ${quote.high}`)
      console.log(`最低: ${quote.low}`)
    }
  } catch (error) {
    console.error('查询失败:', error)
  }
}

getRealtimeQuote()
```

### 5. 批量查询实时行情

```typescript
async function getBatchRealtimeQuote() {
  const response = await client.realtimeQuote({
    ts_code: '000001.SZ,600000.SH,600519.SH'  // 多个股票代码,逗号分隔
  })

  if (response.success && response.data) {
    response.data.forEach(quote => {
      const change = quote.price - quote.pre_close
      const pct = (change / quote.pre_close * 100).toFixed(2)
      console.log(
        `${quote.name}: ${quote.price} (${change > 0 ? '+' : ''}${pct}%)`
      )
    })
  }
}
```

---

## 错误处理

### 捕获和处理错误

```typescript
import { TushareClient, TushareError, TushareErrorType } from 'tushare-typescript-sdk'

async function handleErrors() {
  const client = new TushareClient({
    token: 'your_token'
  })

  try {
    const response = await client.daily({
      ts_code: '000001.SZ'
    })

    console.log('查询成功:', response.data)
  } catch (error) {
    if (error instanceof TushareError) {
      // 根据错误类型进行不同处理
      switch (error.type) {
        case TushareErrorType.AUTHENTICATION_ERROR:
          console.error('认证失败,请检查Token是否有效')
          break

        case TushareErrorType.PERMISSION_ERROR:
          console.error('权限不足,请检查积分是否充足')
          break

        case TushareErrorType.RATE_LIMIT_ERROR:
          console.error('超过调用频率限制,请稍后重试')
          break

        case TushareErrorType.PARAMETER_ERROR:
          console.error('参数错误:', error.message)
          break

        case TushareErrorType.TIMEOUT_ERROR:
          console.error('请求超时,请检查网络连接')
          break

        case TushareErrorType.NETWORK_ERROR:
          console.error('网络错误:', error.message)
          break

        default:
          console.error('未知错误:', error.message)
      }
    } else {
      console.error('系统错误:', error)
    }
  }
}
```

### 手动重试策略

由于SDK不提供自动重试,用户可以根据需要实现自己的重试逻辑:

```typescript
async function queryWithRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: Error | null = null

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error as Error

      // 只对网络错误和超时错误重试
      if (error instanceof TushareError) {
        const shouldRetry =
          error.type === TushareErrorType.NETWORK_ERROR ||
          error.type === TushareErrorType.TIMEOUT_ERROR

        if (!shouldRetry) {
          throw error  // 立即抛出不应重试的错误
        }
      }

      // 等待后重试
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay * (i + 1)))
      }
    }
  }

  throw lastError
}

// 使用重试逻辑
const response = await queryWithRetry(() =>
  client.daily({ ts_code: '000001.SZ' })
)
```

---

## 高级用法

### 访问原始响应数据

```typescript
const response = await client.daily({
  ts_code: '000001.SZ'
})

// 访问结构化数据(推荐)
console.log('结构化数据:', response.data)

// 访问原始数据(fields + items格式)
console.log('字段名:', response.raw.fields)
console.log('数据行:', response.raw.items)

// 手动转换原始数据
const manualData = response.raw.items.map(item => {
  const obj: any = {}
  response.raw.fields.forEach((field, index) => {
    obj[field] = item[index]
  })
  return obj
})
```

### 选择特定返回字段(待实现)

```typescript
// 未来版本将支持字段选择以减少数据传输
const response = await client.daily({
  ts_code: '000001.SZ'
}, {
  fields: ['ts_code', 'trade_date', 'close']  // 仅返回这些字段
})
```

### 自定义配置

```typescript
// 创建不同配置的客户端实例
const fastClient = new TushareClient({
  token: 'your_token',
  timeout: 3000,  // 更短的超时时间
  debug: false
})

const debugClient = new TushareClient({
  token: 'your_token',
  timeout: 10000,  // 更长的超时时间
  debug: true      // 启用调试日志
})
```

---

## 完整示例

### 股票行情分析工具

```typescript
import { TushareClient, TushareError, TushareErrorType } from 'tushare-typescript-sdk'

class StockAnalyzer {
  private client: TushareClient

  constructor(token: string) {
    this.client = new TushareClient({ token })
  }

  /**
   * 分析股票月度表现
   */
  async analyzeMonthlyPerformance(tsCode: string, month: string) {
    try {
      // month格式: YYYYMM
      const startDate = `${month}01`
      const endDate = `${month}31`

      const response = await this.client.daily({
        ts_code: tsCode,
        start_date: startDate,
        end_date: endDate
      })

      if (!response.success || !response.data || response.data.length === 0) {
        throw new Error('未获取到数据')
      }

      const quotes = response.data

      // 计算统计数据
      const firstQuote = quotes[0]
      const lastQuote = quotes[quotes.length - 1]

      const monthReturn = (
        (lastQuote.close - firstQuote.open) / firstQuote.open * 100
      )

      const maxPrice = Math.max(...quotes.map(q => q.high))
      const minPrice = Math.min(...quotes.map(q => q.low))

      const totalVolume = quotes.reduce((sum, q) => sum + q.vol, 0)
      const avgVolume = totalVolume / quotes.length

      return {
        股票代码: tsCode,
        交易天数: quotes.length,
        月度收益率: `${monthReturn.toFixed(2)}%`,
        最高价: maxPrice,
        最低价: minPrice,
        平均成交量: Math.round(avgVolume),
        起始日期: firstQuote.trade_date,
        结束日期: lastQuote.trade_date
      }
    } catch (error) {
      if (error instanceof TushareError) {
        console.error(`分析失败 [${error.type}]:`, error.message)
      }
      throw error
    }
  }

  /**
   * 监控多只股票实时价格
   */
  async monitorRealtime(tsCodes: string[]) {
    const codesStr = tsCodes.join(',')

    const response = await this.client.realtimeQuote({
      ts_code: codesStr
    })

    if (!response.success || !response.data) {
      throw new Error('获取实时行情失败')
    }

    return response.data.map(quote => {
      const change = quote.price - quote.pre_close
      const pct = (change / quote.pre_close * 100)

      return {
        代码: quote.ts_code,
        名称: quote.name,
        当前价: quote.price,
        涨跌额: change.toFixed(2),
        涨跌幅: `${pct > 0 ? '+' : ''}${pct.toFixed(2)}%`,
        成交量: quote.volume
      }
    })
  }
}

// 使用示例
async function main() {
  const analyzer = new StockAnalyzer('your_token_here')

  // 分析月度表现
  console.log('=== 月度分析 ===')
  const analysis = await analyzer.analyzeMonthlyPerformance('000001.SZ', '202509')
  console.table(analysis)

  // 监控实时行情
  console.log('\n=== 实时监控 ===')
  const realtime = await analyzer.monitorRealtime([
    '000001.SZ',  // 平安银行
    '600000.SH',  // 浦发银行
    '600519.SH'   // 贵州茅台
  ])
  console.table(realtime)
}

main().catch(console.error)
```

---

## 测试验证步骤

### 验收测试清单

按照以下步骤验证SDK功能:

#### 1. 基础功能验证

```typescript
// ✅ 测试1: 客户端初始化
const client = new TushareClient({ token: 'your_token' })
console.log('客户端初始化:', client.isReady() ? '成功' : '失败')

// ✅ 测试2: 查询单个股票日线数据
const dailyResponse = await client.daily({ ts_code: '000001.SZ' })
console.log('日线查询:', dailyResponse.success ? '成功' : '失败')
console.log('数据条数:', dailyResponse.data?.length || 0)

// ✅ 测试3: 查询实时行情
const realtimeResponse = await client.realtimeQuote({ ts_code: '000001.SZ' })
console.log('实时查询:', realtimeResponse.success ? '成功' : '失败')
```

#### 2. 错误处理验证

```typescript
// ✅ 测试4: 无效Token
try {
  const badClient = new TushareClient({ token: 'invalid' })
  await badClient.daily({ ts_code: '000001.SZ' })
} catch (error) {
  console.log('无效Token错误捕获:', error instanceof TushareError)
}

// ✅ 测试5: 参数错误
try {
  await client.daily({})  // 缺少必要参数
} catch (error) {
  console.log('参数错误捕获:', error instanceof TushareError)
}

// ✅ 测试6: 超时处理
try {
  const timeoutClient = new TushareClient({
    token: 'your_token',
    timeout: 1  // 1ms超时
  })
  await timeoutClient.daily({ ts_code: '000001.SZ' })
} catch (error) {
  console.log('超时错误捕获:', error instanceof TushareError)
}
```

#### 3. 数据完整性验证

```typescript
// ✅ 测试7: 验证返回数据结构
const response = await client.daily({ ts_code: '000001.SZ' })
const quote = response.data?.[0]

console.log('数据完整性检查:')
console.log('- ts_code存在:', !!quote?.ts_code)
console.log('- trade_date存在:', !!quote?.trade_date)
console.log('- close价格合理:', (quote?.close || 0) > 0)
console.log('- 原始数据fields:', response.raw?.fields.length || 0)
console.log('- 原始数据items:', response.raw?.items.length || 0)
```

---

## 常见问题

### Q1: 如何获取Tushare Token?
访问 [Tushare Pro](https://tushare.pro),注册登录后在用户中心获取Token。

### Q2: 为什么查询返回空数据?
可能原因:
- 股票代码格式不正确(需要包含交易所后缀,如.SZ或.SH)
- 查询日期为非交易日
- 查询的历史日期过早,没有数据

### Q3: 积分不足怎么办?
- 日线行情(daily)需要120积分,新用户注册即可获得
- 实时行情(realtime_quote)不需要积分
- 可通过Tushare社区积分系统获取更多积分

### Q4: SDK是否支持自动重试?
不支持。根据设计规范,所有错误由用户代码处理。用户可以根据业务需求实现自定义重试逻辑(参考上文"手动重试策略"示例)。

### Q5: 如何提高API调用性能?
- 使用日期范围查询减少请求次数
- 批量查询实时行情(支持多个股票代码)
- 合理设置超时时间
- 在应用层实现缓存机制

---

## 下一步

- 📖 阅读 [完整API文档](./API.md) (待创建)
- 🔧 查看 [高级配置指南](./ADVANCED.md) (待创建)
- 🐛 报告问题: [GitHub Issues](https://github.com/your-repo/issues)
- 💬 社区讨论: [GitHub Discussions](https://github.com/your-repo/discussions)

---

**版本**: 1.0.0
**更新日期**: 2025-09-30
**适用SDK版本**: >= 1.0.0