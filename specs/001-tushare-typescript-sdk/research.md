# Research Document: Tushare API 技术规范研究

**Feature**: Tushare TypeScript SDK
**Branch**: `001-tushare-typescript-sdk`
**Date**: 2025-09-30
**Status**: Complete

## 研究概述

本文档详细研究了Tushare API的技术规范,重点关注股票行情相关接口的认证机制、请求格式、响应结构、错误处理和使用限制。研究结果将用于指导TypeScript SDK的设计与实现。

---

## 1. Tushare API 认证机制

### 1.1 Token 获取方式

- **获取路径**: 登录Tushare Pro (https://tushare.pro) → 用户中心 → 接口TOKEN
- **Token特性**:
  - Token是调取数据的唯一凭证
  - Token有效期为1年
  - 如发现泄露可以刷新生成新的Token(刷新后原Token立即失效)
  - Token与积分系统绑定,不同积分级别有不同的访问权限和频率限制

### 1.2 Token 使用方式

#### Python SDK方式(参考)
```python
# 方法1: 设置并保存Token(仅需首次调用)
import tushare as ts
ts.set_token('your_token_here')
pro = ts.pro_api()

# 方法2: 直接初始化时传入
pro = ts.pro_api('your_token_here')
```

#### HTTP API方式(TypeScript SDK应采用)
```bash
curl -X POST -d '{
  "api_name": "daily",
  "token": "your_token_here",
  "params": {
    "ts_code": "000001.SZ",
    "start_date": "20240101",
    "end_date": "20240131"
  },
  "fields": "ts_code,trade_date,open,high,low,close,vol,amount"
}' http://api.tushare.pro
```

**设计决策**: TypeScript SDK将在每次HTTP请求的JSON body中包含token字段进行认证,不依赖服务端session或cookie。

---

## 2. API 请求格式规范

### 2.1 HTTP 基本信息

- **Endpoint**: `http://api.tushare.pro`
- **Protocol**: HTTP (可升级为HTTPS)
- **Method**: POST (统一使用POST方法)
- **Content-Type**: `application/json`

### 2.2 请求体(Request Body)结构

所有API请求使用统一的JSON格式:

```typescript
interface TushareRequest {
  api_name: string;      // API接口名称,如 "daily", "trade_cal"
  token: string;         // 用户认证Token
  params: {              // 接口特定参数(可选)
    [key: string]: string | number | null;
  };
  fields?: string;       // 返回字段列表,逗号分隔(可选,不指定则返回全部字段)
}
```

### 2.3 请求参数说明

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| api_name | string | 是 | API接口名称,标识要调用的具体接口 |
| token | string | 是 | 用户认证凭证 |
| params | object | 否 | 接口特定的查询参数,不同接口参数不同 |
| fields | string | 否 | 指定返回字段,逗号分隔。不指定时返回所有字段 |

### 2.4 完整请求示例

```json
{
  "api_name": "daily",
  "token": "your_token_here",
  "params": {
    "ts_code": "000001.SZ",
    "start_date": "20240101",
    "end_date": "20240131"
  },
  "fields": "ts_code,trade_date,open,high,low,close,vol,amount"
}
```

---

## 3. 股票行情相关接口规范

### 3.1 日线行情接口 (daily)

#### 接口描述
获取A股日线行情数据(未复权),交易日每天15:00-17:00之间更新。停牌期间不提供数据。

#### 输入参数

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| ts_code | string | 否 | 股票代码,支持多个(逗号分隔),如 "000001.SZ,600000.SH" |
| trade_date | string | 否 | 交易日期,格式: YYYYMMDD |
| start_date | string | 否 | 开始日期,格式: YYYYMMDD |
| end_date | string | 否 | 结束日期,格式: YYYYMMDD |

**参数使用规则**:
- ts_code + trade_date: 查询指定股票在特定日期的行情
- ts_code + start_date + end_date: 查询指定股票在日期范围内的行情
- trade_date: 查询所有股票在特定日期的行情
- start_date + end_date: 不建议使用(数据量过大)

#### 输出字段

| 字段名 | 类型 | 说明 |
|--------|------|------|
| ts_code | string | 股票代码 |
| trade_date | string | 交易日期 |
| open | float | 开盘价 |
| high | float | 最高价 |
| low | float | 最低价 |
| close | float | 收盘价 |
| pre_close | float | 前收盘价 |
| change | float | 涨跌额 |
| pct_chg | float | 涨跌幅(%) |
| vol | float | 成交量(手) |
| amount | float | 成交额(千元) |

#### 使用示例

```python
# Python SDK示例(供参考)
pro = ts.pro_api()

# 查询单只股票
df = pro.daily(ts_code='000001.SZ', start_date='20180701', end_date='20180718')

# 查询多只股票
df = pro.daily(ts_code='000001.SZ,600000.SH', start_date='20180701', end_date='20180718')

# 查询指定日期所有股票
df = pro.daily(trade_date='20180810')
```

#### 权限要求
- **最低积分**: 120分(新用户完善资料即可获得)
- **调用频率**: 基础积分每分钟500次
- **数据限制**: 每次请求最多6000条数据

---

### 3.2 分钟线行情接口 (pro_bar)

#### 接口描述
通用行情接口,整合了股票、指数、数字货币、ETF、期货、期权的行情数据,支持分钟级数据。部分指标是现用现算。

**重要提示**: 由于本接口在SDK层做了逻辑处理,目前**暂时无法用HTTP方式直接调取**。对于TypeScript SDK初始版本,建议暂不实现此接口,或者等待Tushare官方提供HTTP支持。

#### 输入参数

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| ts_code | string | 是 | 证券代码,不支持多值输入 |
| freq | string | 是 | 数据频度: 1min/5min/15min/30min/60min/D/W/M |
| start_date | string | 否 | 开始日期,分钟线格式: "2019-09-01 09:00:00" |
| end_date | string | 否 | 结束日期,同start_date格式 |
| asset | string | 否 | 资产类别,默认'E'(股票)/I(指数)/C(数字货币) |
| adj | string | 否 | 复权类型: None(不复权)/qfq(前复权)/hfq(后复权) |
| ma | array | 否 | 均线周期,如 [5, 20, 50] |
| factors | array | 否 | 股票因子,如 ['tor', 'vr'] |

#### 输出字段

| 字段名 | 类型 | 说明 |
|--------|------|------|
| ts_code | string | 证券代码 |
| trade_time | string | 交易时间 |
| open | float | 开盘价 |
| high | float | 最高价 |
| low | float | 最低价 |
| close | float | 收盘价 |
| vol | float | 成交量 |
| amount | float | 成交额 |

#### 使用示例

```python
# Python SDK示例(供参考)
import tushare as ts
df = ts.pro_bar(ts_code='600000.SH', freq='1min',
                start_date='2020-01-07 09:00:00',
                end_date='2020-01-08 17:00:00')
```

#### 权限要求
- **最低积分**: 600分(分钟数据需要)
- **调用频率**: 取决于用户积分级别
- **HTTP支持**: 目前不支持HTTP方式调用

**设计决策**: TypeScript SDK初始版本(v1.0)不实现此接口,在文档中说明原因。未来如果Tushare提供HTTP支持或找到解决方案,可在后续版本中添加。

---

### 3.3 实时行情接口 (realtime_quote)

#### 接口描述
实时盘口TICK快照(爬虫版),用于获取A股实时行情数据。完全免费(0积分),但数据来自第三方爬虫,Tushare不对数据内容和质量负责。仅用于研究学习,商业用途需自行处理合规问题。

**数据来源**:
- Sina财经(默认): 支持多股票查询(最多50个)
- 东方财富(dc): 仅支持单只股票查询

#### 输入参数

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| ts_code | string | 否 | 股票代码,多个用逗号分隔,如 "600000.SH,000001.SZ" |
| src | string | 否 | 数据源: 'sina'(默认) 或 'dc'(东方财富) |

#### 输出字段(主要字段)

| 字段名 | 类型 | 说明 |
|--------|------|------|
| ts_code | string | 股票代码 |
| name | string | 股票名称 |
| price | float | 当前价格 |
| open | float | 开盘价 |
| high | float | 最高价 |
| low | float | 最低价 |
| pre_close | float | 前收盘价 |
| volume | float | 成交量 |
| amount | float | 成交额 |
| bid | float | 竞买价 |
| ask | float | 竞卖价 |
| time | string | 时间 |

(完整字段约25个,包含买卖五档报价等)

#### 使用示例

```python
# Python SDK示例(供参考)
import tushare as ts
ts.set_token('your_token')

# Sina数据源(支持多股票)
df = ts.realtime_quote(ts_code='600000.SH,000001.SZ,000001.SH')

# 东方财富数据源(单只股票)
df = ts.realtime_quote(ts_code='600000.SH', src='dc')
```

#### 权限要求
- **最低积分**: 0分(完全开放)
- **账号要求**: 需要Tushare账号
- **调用频率**: 文档未明确说明
- **使用限制**: 仅供研究学习,商业用途需自行处理合规问题

**设计决策**: TypeScript SDK将实现此接口,但需要在文档中明确说明:
1. 数据来自第三方爬虫,质量不由Tushare保证
2. 仅供研究学习使用
3. 商业用途需用户自行评估合规风险

---

## 4. API 响应数据格式

### 4.1 响应结构

所有API响应使用统一的JSON格式:

```typescript
interface TushareResponse {
  code: number;          // 接口返回码: 0=成功, 非0=失败
  msg: string | null;    // 错误信息,成功时为null
  data: {
    fields: string[];    // 字段名称数组
    items: any[][];      // 二维数组,每个子数组代表一行数据
  } | null;              // 失败时data为null
}
```

### 4.2 成功响应示例

```json
{
  "code": 0,
  "msg": null,
  "data": {
    "fields": ["ts_code", "trade_date", "open", "high", "low", "close", "vol", "amount"],
    "items": [
      ["000001.SZ", "20240115", 10.50, 10.80, 10.40, 10.75, 125000, 1350000],
      ["000001.SZ", "20240116", 10.75, 11.00, 10.70, 10.95, 138000, 1520000],
      ["000001.SZ", "20240117", 10.95, 11.20, 10.90, 11.10, 145000, 1610000]
    ]
  }
}
```

### 4.3 响应数据特点

1. **紧凑格式**: fields和items分离,避免每行数据重复字段名,节省带宽
2. **一一对应**: items中每个子数组的值顺序与fields数组的字段顺序严格对应
3. **类型混合**: items中的值可能是string、number、null等多种类型
4. **大小写敏感**: 字段名区分大小写

### 4.4 数据转换建议

TypeScript SDK应提供两种返回格式:

1. **原始格式**: 直接返回`{fields, items}`格式,保持高性能
2. **结构化格式**: 转换为对象数组,便于使用

```typescript
// 原始格式
{
  fields: ["ts_code", "trade_date", "close"],
  items: [["000001.SZ", "20240115", 10.75]]
}

// 转换后的结构化格式
[
  {
    ts_code: "000001.SZ",
    trade_date: "20240115",
    close: 10.75
  }
]
```

---

## 5. 错误处理机制

### 5.1 错误码(code)说明

| 错误码 | 含义 | 常见原因 | 处理建议 |
|--------|------|----------|----------|
| 0 | 成功 | - | 正常处理数据 |
| 2002 | 权限问题 | Token无效、积分不足、接口无权限 | 检查Token、升级积分、确认接口权限 |
| 其他非0值 | 系统错误 | 网络故障、服务器内部错误 | 查看msg字段详细信息,考虑重试 |

### 5.2 错误响应示例

```json
{
  "code": 2002,
  "msg": "No permission to access this interface",
  "data": null
}
```

### 5.3 错误类型分类

TypeScript SDK应定义清晰的错误类型:

```typescript
enum TushareErrorType {
  AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',  // Token无效或过期
  PERMISSION_ERROR = 'PERMISSION_ERROR',          // 权限不足(积分不够)
  RATE_LIMIT_ERROR = 'RATE_LIMIT_ERROR',         // 超过频率限制
  PARAMETER_ERROR = 'PARAMETER_ERROR',            // 参数错误
  NETWORK_ERROR = 'NETWORK_ERROR',                // 网络错误
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',                // 请求超时
  SERVER_ERROR = 'SERVER_ERROR',                  // 服务器内部错误
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'                 // 未知错误
}
```

### 5.4 常见错误场景

1. **Token无效或过期**: code=2002, msg包含"token"关键词
2. **积分不足**: code=2002, msg包含"permission"或"积分"关键词
3. **超过频率限制**: 通常表现为连续请求失败或超时
4. **参数错误**: msg中会提示具体哪个参数有问题
5. **网络超时**: HTTP请求层面的超时,不是API返回的错误

### 5.5 错误处理最佳实践

根据功能规格说明(spec.md),TypeScript SDK不提供自动重试机制,所有错误由用户处理:

```typescript
// 推荐的错误处理模式
try {
  const result = await client.daily({
    ts_code: '000001.SZ',
    start_date: '20240101',
    end_date: '20240131'
  });
  // 处理成功响应
} catch (error) {
  if (error instanceof TushareAuthenticationError) {
    // 处理认证错误
  } else if (error instanceof TusharePermissionError) {
    // 处理权限错误
  } else if (error instanceof TushareRateLimitError) {
    // 处理频率限制错误,由用户决定是否重试
  } else {
    // 处理其他错误
  }
}
```

---

## 6. API 使用限制和配额规则

### 6.1 积分制度概述

Tushare Pro引入积分制度,目的是:
1. 避免低门槛无限制的恶意数据调取
2. 保证大多数用户调取数据的稳定性
3. 支持Tushare社区的可持续发展

**重要说明**:
- 积分是分级门槛,调用接口不消耗积分
- 积分有效期为1年
- 积分越多,调用频次越高

### 6.2 积分频次对应表

| 积分级别 | 每分钟调用次数 | 每天总调用次数 | 说明 |
|----------|----------------|----------------|------|
| 120分 | 较低 | 有限 | 新用户基础级别 |
| 5000分 | 200次/分钟 | 10000次/天 | 基本没有太多频次限制 |
| 8000分+ | 500次/分钟 | 不限制 | 高级用户 |

**注意**: 以上数据来自社区讨论,具体限制可能随时调整,建议查阅官方文档最新信息。

### 6.3 不同接口的积分要求

| 接口类型 | 最低积分要求 | 说明 |
|----------|--------------|------|
| 日线行情(daily) | 120分 | 基础接口,新用户完善资料即可获得 |
| 分钟线行情(pro_bar) | 600分 | 中级接口 |
| 实时行情(realtime_quote) | 0分 | 完全开放,但数据来自爬虫 |

### 6.4 获取积分的方法

1. **注册账号**: 基础积分
2. **完善个人信息**: 达到120分
3. **社区贡献**: 发布文章、分享经验
4. **赞助支持**: 通过赞助获取更高积分
5. **API使用反馈**: 报告bug、提供建议

### 6.5 避免频率限制的建议

根据研究结果和Tushare官方建议:

1. **提高积分**: 达到5000分以上基本没有频次限制
2. **程序中增加重试机制**: 由用户自行实现
3. **关闭网络代理**: VPN、翻墙软件可能导致timeout
4. **合理设置超时**: 建议读取超时1500ms,连接超时1000-5000ms
5. **分批请求**: 避免一次性请求过多数据
6. **缓存数据**: 避免重复请求相同数据

**TypeScript SDK设计决策**:
- 不提供自动重试机制(符合spec.md要求)
- 提供可配置的超时时间(默认1500ms读取超时,2000ms连接超时)
- 在错误对象中提供清晰的错误类型,便于用户实现自定义重试逻辑
- 在文档中提供最佳实践指南

---

## 7. Python SDK 设计模式参考

### 7.1 Python SDK 源码分析

**GitHub仓库**: https://github.com/waditu/tushare

### 7.2 主要设计特点

1. **模块化组织**: 按功能分模块(股票、基金、期货等)
2. **函数式API**: 直接调用函数获取数据,简单直观
3. **Pandas集成**: 所有数据返回pandas DataFrame格式
4. **隐藏复杂性**: HTTP请求、数据转换等细节对用户透明
5. **多数据源支持**: 支持不同数据源(Tushare Pro、爬虫版等)

### 7.3 API调用模式

```python
# 初始化模式
import tushare as ts
ts.set_token('your_token')      # 可选: 设置并保存token
pro = ts.pro_api()               # 创建Pro API实例
# 或
pro = ts.pro_api('your_token')   # 直接传入token

# 数据查询模式
df = pro.daily(ts_code='000001.SZ', start_date='20180701', end_date='20180718')
df = pro.query('daily', ts_code='000001.SZ', start_date='20180701', end_date='20180718')
```

### 7.4 TypeScript SDK 设计建议

基于Python SDK经验和TypeScript生态特点,建议采用以下设计:

#### 面向对象的客户端模式

```typescript
// 初始化
const client = new TushareClient({
  token: 'your_token',
  timeout: 5000,
  baseUrl: 'http://api.tushare.pro'
});

// 方法调用(类型安全)
const result = await client.daily({
  ts_code: '000001.SZ',
  start_date: '20240101',
  end_date: '20240131'
});
```

#### 模块化API组织

```typescript
// 按功能分组
client.stock.daily(...)       // 股票日线
client.stock.realtime(...)    // 股票实时行情
client.index.daily(...)       // 指数日线
client.fund.nav(...)          // 基金净值(未来版本)
```

#### 类型安全的参数和返回值

```typescript
interface DailyParams {
  ts_code?: string;
  trade_date?: string;
  start_date?: string;
  end_date?: string;
}

interface DailyData {
  ts_code: string;
  trade_date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  pre_close: number;
  change: number;
  pct_chg: number;
  vol: number;
  amount: number;
}

interface DailyResponse {
  fields: string[];
  items: any[][];
  data: DailyData[];  // 转换后的结构化数据
}
```

---

## 8. 技术决策总结

### 8.1 已解决的技术问题

| 问题 | 决策 | 理由 |
|------|------|------|
| 认证方式 | 每次请求在body中传递token | HTTP API标准方式,无状态,简单可靠 |
| HTTP方法 | 统一使用POST | Tushare API要求 |
| 请求格式 | JSON body with {api_name, token, params, fields} | Tushare API标准格式 |
| 响应处理 | 提供原始格式和结构化格式两种选择 | 平衡性能和易用性 |
| 错误处理 | 定义清晰的错误类型,不自动重试 | 符合spec.md要求,由用户控制重试逻辑 |
| 超时配置 | 可配置,默认读取1500ms,连接2000ms | 参考最佳实践 |
| TypeScript版本 | 5.0+ | spec.md要求,支持最新语言特性 |
| Node.js版本 | 20.x+ | spec.md要求,长期支持版本 |

### 8.2 初始版本接口范围

根据研究结果和spec.md要求,初始版本(v1.0)将实现:

**包含的接口**:
1. ✅ **daily** - 日线行情接口(核心功能,120积分)
2. ✅ **realtime_quote** - 实时行情接口(0积分,附带免责说明)

**不包含的接口**:
1. ❌ **pro_bar** - 分钟线行情接口
   - 原因: 目前不支持HTTP调用,仅Python SDK支持
   - 计划: 未来版本如果Tushare提供HTTP支持再添加

### 8.3 关键技术约束

1. **不提供自动重试**: 所有失败由用户处理(spec.md明确要求)
2. **不支持callback模式**: 仅支持Promise/async-await(spec.md要求)
3. **不实现分钟线接口**: HTTP API暂不支持(技术限制)
4. **积分和权限检查**: 在客户端侧提供参数验证,但最终以服务端返回为准

### 8.4 未来扩展方向

1. **更多接口**: 当官方提供HTTP支持后,添加pro_bar等接口
2. **数据缓存**: 可选的本地缓存机制,减少重复请求
3. **批量操作**: 优化多股票查询性能
4. **WebSocket支持**: 如果官方提供实时推送服务
5. **TypeScript装饰器**: 提供更优雅的API调用方式

---

## 9. 参考资源

### 9.1 官方文档

- Tushare Pro官网: https://tushare.pro
- 接口文档首页: https://tushare.pro/document/1
- HTTP调用说明: https://tushare.pro/document/1?doc_id=40
- 日线行情接口: https://tushare.pro/document/2?doc_id=27
- 分钟线接口: https://tushare.pro/document/2?doc_id=109
- 实时行情接口: https://tushare.pro/document/2?doc_id=315
- 积分制度说明: https://tushare.pro/document/1?doc_id=290

### 9.2 开源项目

- Python SDK源码: https://github.com/waditu/tushare
- 增强版客户端: https://github.com/yzhq0/tushare_plus

### 9.3 社区资源

- Tushare官方博客: 相关技术文章和更新公告
- GitHub Issues: 用户反馈和问题讨论
- 在线教程: 各类使用教程和最佳实践

---

## 10. 结论

通过深入研究Tushare API的技术规范,我们明确了TypeScript SDK的设计方向:

1. **认证机制**: 采用Token-in-body的HTTP POST认证方式
2. **请求格式**: 遵循Tushare标准的JSON请求格式
3. **响应处理**: 提供原始和结构化两种数据格式
4. **错误处理**: 定义清晰的错误类型,不自动重试,由用户控制
5. **接口范围**: 初始版本实现daily和realtime_quote两个核心接口
6. **API设计**: 参考Python SDK经验,结合TypeScript特性,提供类型安全的面向对象API

所有技术决策均符合spec.md中的功能需求和约束条件,为后续的设计(data-model.md)和实现(tasks.md)提供了坚实的技术基础。

---

**研究状态**: ✅ 完成
**下一步**: 执行Phase 1 - 创建data-model.md, contracts/, quickstart.md