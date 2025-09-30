# Quickstart: 财务数据接口

**Feature**: 003-tushare | **Date**: 2025-09-30

## 目标

通过一个完整的端到端示例,验证财务数据接口功能正确性。

## 前置条件

1. 安装 SDK:
```bash
npm install tushare-typescript-sdk
```

2. 获取 Tushare Pro token:
- 访问 https://tushare.pro
- 注册并获取 API token

## 快速开始

### 步骤 1: 初始化客户端

```typescript
import { TushareClient } from 'tushare-typescript-sdk';

const client = new TushareClient({
  token: 'YOUR_TUSHARE_TOKEN',
  // 可选:启用缓存
  cache: {
    enabled: true,
    ttl: 3600 // 缓存1小时
  }
});
```

### 步骤 2: 查询利润表数据

```typescript
// 查询平安银行(000001.SZ)最近的利润表数据
const incomeStatements = await client.getIncomeStatement('000001.SZ', {
  startDate: '20230101',
  endDate: '20231231'
});

console.log('营业收入:', incomeStatements[0].revenue);
console.log('净利润:', incomeStatements[0].nIncome);
```

### 步骤 3: 查询资产负债表数据

```typescript
// 查询平安银行的资产负债表
const balanceSheets = await client.getBalanceSheet('000001.SZ', {
  endDate: '20231231'
});

console.log('资产总计:', balanceSheets[0].totalAssets);
console.log('负债合计:', balanceSheets[0].totalLiab);
console.log('股东权益:', balanceSheets[0].totalHldrEqyIncMinInt);
```

### 步骤 4: 查询现金流量表数据

```typescript
// 查询平安银行的现金流量表
const cashFlows = await client.getCashFlowStatement('000001.SZ', {
  endDate: '20231231'
});

console.log('经营活动现金流:', cashFlows[0].nCashflowAct);
console.log('投资活动现金流:', cashFlows[0].nCashflowInvAct);
console.log('筹资活动现金流:', cashFlows[0].nCashFlowsFncAct);
```

### 步骤 5: 查询财务指标数据

```typescript
// 查询平安银行的财务指标
const indicators = await client.getFinancialIndicators('000001.SZ', {
  endDate: '20231231'
});

console.log('ROE:', indicators[0].roe + '%');
console.log('毛利率:', indicators[0].grossprofitMargin + '%');
console.log('资产负债率:', indicators[0].debtToAssets + '%');
console.log('流动比率:', indicators[0].currentRatio);
```

## 完整示例

```typescript
import { TushareClient } from 'tushare-typescript-sdk';

async function main() {
  // 初始化客户端
  const client = new TushareClient({
    token: process.env.TUSHARE_TOKEN!,
    cache: {
      enabled: true,
      ttl: 3600
    }
  });

  const tsCode = '000001.SZ'; // 平安银行
  const endDate = '20231231';

  try {
    // 1. 查询利润表
    console.log('=== 利润表 ===');
    const income = await client.getIncomeStatement(tsCode, { endDate });
    if (income.length > 0) {
      console.log(`营业收入: ${income[0].revenue}`);
      console.log(`净利润: ${income[0].nIncome}`);
    }

    // 2. 查询资产负债表
    console.log('\n=== 资产负债表 ===');
    const balance = await client.getBalanceSheet(tsCode, { endDate });
    if (balance.length > 0) {
      console.log(`资产总计: ${balance[0].totalAssets}`);
      console.log(`负债合计: ${balance[0].totalLiab}`);
    }

    // 3. 查询现金流量表
    console.log('\n=== 现金流量表 ===');
    const cashflow = await client.getCashFlowStatement(tsCode, { endDate });
    if (cashflow.length > 0) {
      console.log(`经营现金流: ${cashflow[0].nCashflowAct}`);
    }

    // 4. 查询财务指标
    console.log('\n=== 财务指标 ===');
    const indicators = await client.getFinancialIndicators(tsCode, { endDate });
    if (indicators.length > 0) {
      console.log(`ROE: ${indicators[0].roe}%`);
      console.log(`毛利率: ${indicators[0].grossprofitMargin}%`);
      console.log(`资产负债率: ${indicators[0].debtToAssets}%`);
    }

  } catch (error) {
    if (error instanceof AuthenticationError) {
      console.error('认证失败,请检查 token 是否正确');
    } else if (error instanceof RateLimitError) {
      console.error('超出调用频率限制,请稍后重试');
      if (error.retryAfter) {
        console.log(`建议等待 ${error.retryAfter} 秒后重试`);
      }
    } else if (error instanceof DataNotDisclosedError) {
      console.error(`数据未披露: ${error.tsCode} @ ${error.endDate}`);
    } else {
      console.error('未知错误:', error);
    }
  }
}

main();
```

## 错误处理

### 1. 认证错误

```typescript
try {
  await client.getIncomeStatement('000001.SZ');
} catch (error) {
  if (error instanceof AuthenticationError) {
    console.error('Token 无效或过期');
    // 处理认证错误,如提示用户更新 token
  }
}
```

### 2. 限流错误

```typescript
try {
  await client.getIncomeStatement('000001.SZ');
} catch (error) {
  if (error instanceof RateLimitError) {
    console.error('超出频率限制');
    // 用户自行实现重试逻辑
    if (error.retryAfter) {
      await sleep(error.retryAfter * 1000);
      // 重试请求
    }
  }
}
```

### 3. 数据未披露

```typescript
try {
  await client.getIncomeStatement('000001.SZ', {
    endDate: '20250331' // 未来的报告期
  });
} catch (error) {
  if (error instanceof DataNotDisclosedError) {
    console.error('请求的报告期数据尚未披露');
    // 处理未披露情况,如返回空结果或提示用户
  }
}
```

## 缓存配置

### 启用内存缓存

```typescript
const client = new TushareClient({
  token: 'YOUR_TOKEN',
  cache: {
    enabled: true,
    ttl: 3600 // 缓存1小时
  }
});
```

### 自定义缓存存储

```typescript
import { CacheStorage } from 'tushare-typescript-sdk';

// 实现自定义存储(例如 Redis)
class RedisCache implements CacheStorage {
  async get(key: string): Promise<any | null> {
    // 从 Redis 读取
    const value = await redis.get(key);
    return value ? JSON.parse(value) : null;
  }

  async set(key: string, value: any, ttl?: number): Promise<void> {
    // 写入 Redis
    await redis.setex(key, ttl || 3600, JSON.stringify(value));
  }

  async delete(key: string): Promise<void> {
    await redis.del(key);
  }

  async clear(): Promise<void> {
    await redis.flushdb();
  }
}

// 使用自定义存储
const client = new TushareClient({
  token: 'YOUR_TOKEN',
  cache: {
    enabled: true,
    ttl: 3600,
    storage: new RedisCache()
  }
});
```

## 验收测试

运行以下命令验证功能:

```bash
# 设置环境变量
export TUSHARE_TOKEN=your_token_here

# 运行快速开始示例
npm run example:financial

# 预期输出:
# === 利润表 ===
# 营业收入: 44000000000
# 净利润: 5000000000
#
# === 资产负债表 ===
# 资产总计: 1200000000000
# 负债合计: 800000000000
#
# === 现金流量表 ===
# 经营现金流: 15000000000
#
# === 财务指标 ===
# ROE: 15.2%
# 毛利率: 35.5%
# 资产负债率: 65.2%
```

## 常见问题

**Q: 如何查询多只股票的数据?**
A: SDK 每次只支持查询单只股票。如需批量查询,请多次调用 API:

```typescript
const tsCodes = ['000001.SZ', '600000.SH', '000002.SZ'];
const results = await Promise.all(
  tsCodes.map(code => client.getIncomeStatement(code))
);
```

注意:批量查询可能触发限流,建议控制并发数量或使用缓存。

**Q: 如何判断数据是否已披露?**
A: 捕获 `DataNotDisclosedError` 异常即可判断:

```typescript
try {
  const data = await client.getIncomeStatement('000001.SZ', {
    endDate: '20250331'
  });
} catch (error) {
  if (error instanceof DataNotDisclosedError) {
    console.log('数据未披露');
  }
}
```

**Q: 缓存会影响数据的实时性吗?**
A: 会。启用缓存后,同一查询在 TTL 时间内返回缓存数据。如需实时数据,可:
- 禁用缓存(`cache.enabled = false`)
- 减小 TTL
- 手动清除缓存

---
**状态**: ✅ 完成 | **下一步**: 更新 CLAUDE.md