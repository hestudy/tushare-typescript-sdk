# Data Model: Tushare TypeScript SDK

**Feature**: 001-tushare-typescript-sdk
**Date**: 2025-09-30
**Status**: Design

## 实体总览

本SDK的数据模型基于功能规格说明中识别的关键实体:

1. **TushareClient** - API客户端
2. **ClientConfig** - 客户端配置
3. **TushareRequest** - API请求
4. **TushareResponse** - API响应
5. **TushareError** - 错误对象
6. **DailyQuote** - 日线行情数据
7. **RealtimeQuote** - 实时行情数据

---

## 1. TushareClient (API客户端)

### 职责
- 管理与Tushare API的连接
- 处理认证和请求配置
- 提供统一的API调用接口
- 管理HTTP通信

### 属性
```typescript
class TushareClient {
  private config: ClientConfig
  private httpClient: HttpClient
  private isInitialized: boolean
}
```

### 方法
```typescript
interface ITushareClient {
  // 初始化方法
  constructor(config: ClientConfig)

  // 通用查询方法
  query<T>(request: TushareRequest): Promise<TushareResponse<T>>

  // 股票行情API
  daily(params: DailyParams): Promise<TushareResponse<DailyQuote>>
  realtimeQuote(params: RealtimeParams): Promise<TushareResponse<RealtimeQuote>>

  // 配置管理
  getConfig(): ClientConfig
  updateTimeout(timeout: number): void
  isReady(): boolean
}
```

### 状态转换
```
初始化 → 就绪 → 请求中 → 响应接收 → 就绪
                  ↓
               错误处理
```

---

## 2. ClientConfig (客户端配置)

### 职责
- 存储API认证信息
- 定义请求超时和重试策略
- 配置API基础URL

### 结构
```typescript
interface ClientConfig {
  /**
   * Tushare API token (必填)
   * 从 https://tushare.pro 用户中心获取
   */
  token: string

  /**
   * API基础URL (可选)
   * @default "http://api.tushare.pro"
   */
  baseUrl?: string

  /**
   * 请求超时时间(毫秒) (可选)
   * @default 5000
   */
  timeout?: number

  /**
   * 是否启用调试日志 (可选)
   * @default false
   */
  debug?: boolean
}
```

### 验证规则
- `token`: 必填,字符串长度>=32
- `baseUrl`: 必须是有效的HTTP(S) URL
- `timeout`: 必须>0,建议1000-10000ms
- `debug`: 布尔值

---

## 3. TushareRequest (API请求)

### 职责
- 封装API请求参数
- 提供参数验证
- 支持字段选择

### 结构
```typescript
interface TushareRequest {
  /**
   * API接口名称
   */
  api_name: string

  /**
   * 认证token
   */
  token: string

  /**
   * 查询参数
   */
  params: Record<string, any>

  /**
   * 返回字段列表(可选)
   * 逗号分隔的字符串或字符串数组
   */
  fields?: string | string[]
}
```

### 特定请求类型

#### DailyParams (日线行情查询参数)
```typescript
interface DailyParams {
  /**
   * 股票代码 (可选)
   * 格式: 000001.SZ 或 600000.SH
   */
  ts_code?: string

  /**
   * 交易日期 (可选)
   * 格式: YYYYMMDD
   */
  trade_date?: string

  /**
   * 开始日期 (可选)
   * 格式: YYYYMMDD
   */
  start_date?: string

  /**
   * 结束日期 (可选)
   * 格式: YYYYMMDD
   */
  end_date?: string
}
```

**验证规则**:
- 至少提供 `ts_code`、`trade_date`、`start_date+end_date` 之一
- 日期格式必须为YYYYMMDD(8位数字)
- `end_date` >= `start_date`
- 股票代码格式: 6位数字 + '.' + 交易所代码(SZ/SH)

#### RealtimeParams (实时行情查询参数)
```typescript
interface RealtimeParams {
  /**
   * 股票代码 (必填)
   * 支持多个股票,逗号分隔
   * 格式: 000001.SZ 或 000001.SZ,600000.SH
   */
  ts_code: string
}
```

**验证规则**:
- `ts_code` 必填
- 支持单个或多个代码(逗号分隔)
- 每个代码格式必须正确

---

## 4. TushareResponse (API响应)

### 职责
- 封装API响应数据
- 提供原始格式和结构化格式
- 统一错误处理

### 原始响应结构
```typescript
interface TushareRawResponse {
  /**
   * 响应代码
   * 0: 成功
   * 2002: 权限/认证错误
   * 其他非0值: 系统错误
   */
  code: number

  /**
   * 响应消息
   * 成功时为null,失败时包含错误信息
   */
  msg: string | null

  /**
   * 响应数据
   * 成功时包含fields和items,失败时为null
   */
  data: {
    fields: string[]
    items: any[][]
  } | null
}
```

### 结构化响应
```typescript
interface TushareResponse<T> {
  /**
   * 响应代码
   */
  code: number

  /**
   * 响应消息
   */
  msg: string | null

  /**
   * 原始数据(fields + items格式)
   */
  raw: {
    fields: string[]
    items: any[][]
  } | null

  /**
   * 结构化数据(对象数组)
   */
  data: T[] | null

  /**
   * 是否成功
   */
  success: boolean
}
```

---

## 5. TushareError (错误对象)

### 职责
- 统一错误表示
- 提供错误类型分类
- 包含详细错误信息

### 结构
```typescript
enum TushareErrorType {
  AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',  // Token无效
  PERMISSION_ERROR = 'PERMISSION_ERROR',          // 积分不足
  RATE_LIMIT_ERROR = 'RATE_LIMIT_ERROR',         // 超频率限制
  PARAMETER_ERROR = 'PARAMETER_ERROR',           // 参数错误
  NETWORK_ERROR = 'NETWORK_ERROR',               // 网络错误
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',               // 超时
  SERVER_ERROR = 'SERVER_ERROR',                 // 服务器错误
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'                // 未知错误
}

class TushareError extends Error {
  /**
   * 错误类型
   */
  type: TushareErrorType

  /**
   * 错误代码
   */
  code: number

  /**
   * 错误消息
   */
  message: string

  /**
   * 原始响应(如有)
   */
  rawResponse?: TushareRawResponse

  /**
   * 请求参数(用于调试)
   */
  requestParams?: TushareRequest

  constructor(
    type: TushareErrorType,
    message: string,
    code?: number,
    rawResponse?: TushareRawResponse
  )
}
```

### 错误映射规则
| 响应码 | 错误消息关键词 | 错误类型 |
|--------|--------------|---------|
| 2002 | "token无效", "token过期" | AUTHENTICATION_ERROR |
| 2002 | "积分不足", "无权限" | PERMISSION_ERROR |
| -1 | "超过频率", "rate limit" | RATE_LIMIT_ERROR |
| -1 | "参数错误", "parameter" | PARAMETER_ERROR |
| timeout | - | TIMEOUT_ERROR |
| network | - | NETWORK_ERROR |
| 500+ | - | SERVER_ERROR |
| 其他 | - | UNKNOWN_ERROR |

---

## 6. DailyQuote (日线行情数据)

### 职责
- 表示单日股票行情数据
- 提供类型安全的数据访问

### 结构
```typescript
interface DailyQuote {
  /**
   * 股票代码
   */
  ts_code: string

  /**
   * 交易日期 YYYYMMDD
   */
  trade_date: string

  /**
   * 开盘价
   */
  open: number

  /**
   * 最高价
   */
  high: number

  /**
   * 最低价
   */
  low: number

  /**
   * 收盘价
   */
  close: number

  /**
   * 昨收价
   */
  pre_close: number

  /**
   * 涨跌额
   */
  change: number

  /**
   * 涨跌幅 (%)
   */
  pct_chg: number

  /**
   * 成交量 (手)
   */
  vol: number

  /**
   * 成交额 (千元)
   */
  amount: number
}
```

### 数据转换
原始API响应(items数组)将按fields顺序转换为DailyQuote对象。

---

## 7. RealtimeQuote (实时行情数据)

### 职责
- 表示实时股票行情数据
- 提供类型安全的数据访问

### 结构
```typescript
interface RealtimeQuote {
  /**
   * 股票代码
   */
  ts_code: string

  /**
   * 股票名称
   */
  name: string

  /**
   * 当前价格
   */
  price: number

  /**
   * 开盘价
   */
  open: number

  /**
   * 最高价
   */
  high: number

  /**
   * 最低价
   */
  low: number

  /**
   * 昨收价
   */
  pre_close: number

  /**
   * 成交量
   */
  volume: number

  /**
   * 成交额
   */
  amount: number
}
```

---

## 关系图

```
TushareClient
    ├── has: ClientConfig
    ├── creates: TushareRequest
    ├── returns: TushareResponse<T>
    └── throws: TushareError

TushareRequest
    ├── DailyParams (extends)
    └── RealtimeParams (extends)

TushareResponse<T>
    ├── contains: DailyQuote[] (when T = DailyQuote)
    └── contains: RealtimeQuote[] (when T = RealtimeQuote)

TushareError
    └── has: TushareErrorType
```

---

## 数据流

### 成功流程
```
用户代码
  → TushareClient.daily(params)
  → 创建 TushareRequest
  → HTTP POST 到 api.tushare.pro
  → 接收 TushareRawResponse
  → 验证 code === 0
  → 转换 items → DailyQuote[]
  → 返回 TushareResponse<DailyQuote>
  → 用户接收数据
```

### 错误流程
```
用户代码
  → TushareClient.daily(params)
  → 创建 TushareRequest
  → 参数验证失败?
    → 抛出 TushareError(PARAMETER_ERROR)
  → HTTP POST 到 api.tushare.pro
  → 网络错误?
    → 抛出 TushareError(NETWORK_ERROR)
  → 超时?
    → 抛出 TushareError(TIMEOUT_ERROR)
  → 接收 TushareRawResponse
  → code !== 0?
    → 解析错误类型
    → 抛出 TushareError(相应类型)
  → 用户捕获错误
```

---

## 验证规则汇总

### ClientConfig
- ✅ token: 必填, length >= 32
- ✅ baseUrl: 有效的HTTP(S) URL
- ✅ timeout: > 0, 建议1000-10000ms

### DailyParams
- ✅ 至少一个查询条件(ts_code/trade_date/start_date+end_date)
- ✅ 日期格式: YYYYMMDD(8位数字)
- ✅ end_date >= start_date
- ✅ 股票代码格式: NNNNNN.XX

### RealtimeParams
- ✅ ts_code: 必填
- ✅ 股票代码格式: NNNNNN.XX
- ✅ 支持多个代码(逗号分隔)

---

## 下一步

Phase 1剩余任务:
1. ✅ 创建API契约(contracts/)
2. ✅ 定义数据模型(data-model.md)
3. 📝 编写快速上手指南(quickstart.md)
4. 📝 更新代理配置文件(CLAUDE.md)

---

**设计完成**: 2025-09-30
**状态**: 待实现