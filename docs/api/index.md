# API 参考

欢迎查阅 Tushare TypeScript SDK 的完整 API 文档。

## 分类导览

### 行情数据

- [日线行情](/api/daily) - 获取股票日线行情数据
- [周线行情](/api/weekly) - 获取股票周线行情数据
- [分钟行情](/api/minute) - 获取股票分钟级行情数据

### 财务数据

- [利润表](/api/income) - 获取上市公司利润表数据
- [资产负债表](/api/balance) - 获取上市公司资产负债表数据
- [现金流量表](/api/cashflow) - 获取上市公司现金流量表数据

### 基础数据

- [股票列表](/api/stock_basic) - 获取股票基础信息列表
- [交易日历](/api/trade_cal) - 获取交易日历数据
- [公司信息](/api/stock_company) - 获取上市公司基本信息

## 使用方式

所有 API 都通过 `TushareClient` 实例调用:

\`\`\`typescript
import { TushareClient } from 'tushare-typescript-sdk'

const client = new TushareClient({ token: 'YOUR_TOKEN' })

// 调用 API
const data = await client.daily({
  ts_code: '000001.SZ',
  trade_date: '20250101'
})
\`\`\`

## 在线测试

每个 API 文档页面底部都有交互式测试工具,您可以:

1. 配置 API Token
2. 填写参数
3. 实时测试 API
4. 查看响应结果

[了解如何使用 API 测试工具](/guide/api-testing)

## 通用参数说明

### 股票代码格式

- 上海: `600000.SH`
- 深圳: `000001.SZ`
- 创业板: `300001.SZ`
- 科创板: `688001.SH`

### 日期格式

统一使用 `YYYYMMDD` 格式,例如:
- `20250101` - 2025年1月1日
- `20250630` - 2025年6月30日

## 错误码

| 错误码 | 说明 | 解决方案 |
|--------|------|----------|
| 40001 | Token 无效 | 检查 Token 是否正确 |
| 40002 | 超出频率限制 | 等待一段时间后重试 |
| 40003 | 权限不足 | 升级账户权限 |