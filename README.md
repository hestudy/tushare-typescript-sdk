# Tushare TypeScript SDK

[![npm version](https://img.shields.io/npm/v/tushare-typescript-sdk.svg)](https://www.npmjs.com/package/tushare-typescript-sdk)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0%2B-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20.x%2B-green.svg)](https://nodejs.org/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

为Tushare Pro API提供TypeScript类型安全的SDK。

## 特性

- ✅ **完全类型安全** - 使用TypeScript 5.0+编写,提供完整的类型提示
- ✅ **零依赖** - 纯TypeScript实现,无外部运行时依赖
- ✅ **Promise/async-await** - 现代异步API设计
- ✅ **完善的错误处理** - 8种细分错误类型,便于定位问题
- ✅ **双数据格式** - 支持原始格式和结构化对象数组
- ✅ **契约测试** - 基于API契约的完整测试覆盖
- ✅ **体积小巧** - 构建后仅3.4KB(压缩后1.5KB)

## 安装

```bash
npm install tushare-typescript-sdk
```

## 快速开始

```typescript
import { TushareClient } from 'tushare-typescript-sdk'

// 创建客户端实例
const client = new TushareClient({
  token: 'your_tushare_token_here'
})

// 查询日线行情
const response = await client.daily({
  ts_code: '000001.SZ',
  start_date: '20250901',
  end_date: '20250930'
})

// 使用结构化数据
response.data?.forEach(quote => {
  console.log(`${quote.trade_date}: ${quote.close}`)
})
```

## API文档

### 初始化客户端

```typescript
const client = new TushareClient({
  token: string,        // 必填: Tushare API Token
  timeout?: number,     // 可选: 超时时间(ms),默认5000
  debug?: boolean       // 可选: 是否启用调试日志,默认false
})
```

### 查询日线行情

```typescript
const response = await client.daily({
  ts_code?: string,      // 股票代码,如 '000001.SZ'
  trade_date?: string,   // 交易日期 YYYYMMDD
  start_date?: string,   // 开始日期 YYYYMMDD
  end_date?: string      // 结束日期 YYYYMMDD
})
```

### 查询实时行情

```typescript
const response = await client.realtimeQuote({
  ts_code: string  // 股票代码,支持多个(逗号分隔)
})
```

## 错误处理

```typescript
import { TushareError, TushareErrorType } from 'tushare-typescript-sdk'

try {
  const response = await client.daily({ ts_code: '000001.SZ' })
} catch (error) {
  if (error instanceof TushareError) {
    switch (error.type) {
      case TushareErrorType.AUTHENTICATION_ERROR:
        // 处理认证错误
        break
      case TushareErrorType.RATE_LIMIT_ERROR:
        // 处理频率限制
        break
      // ... 其他错误类型
    }
  }
}
```

## 支持的错误类型

- `AUTHENTICATION_ERROR` - Token无效或过期
- `PERMISSION_ERROR` - 积分不足或无权限
- `RATE_LIMIT_ERROR` - 超过调用频率限制
- `PARAMETER_ERROR` - 参数错误
- `TIMEOUT_ERROR` - 请求超时
- `NETWORK_ERROR` - 网络连接失败
- `SERVER_ERROR` - 服务器内部错误
- `UNKNOWN_ERROR` - 未知错误

## 开发

```bash
# 安装依赖
npm install

# 运行测试
npm test

# 类型检查
npm run typecheck

# 构建
npm run build

# 代码检查
npm run lint
```

## 许可证

MIT

## 相关链接

- [Tushare Pro官网](https://tushare.pro)
- [API文档](https://tushare.pro/document/2)
- [问题反馈](https://github.com/your-repo/issues)