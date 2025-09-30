# 配置

Tushare TypeScript SDK 提供了灵活的配置选项来满足不同场景的需求。

## 基本配置

### 创建客户端

```typescript
import { TushareClient } from 'tushare-typescript-sdk'

const client = new TushareClient({
  token: 'YOUR_API_TOKEN'
})
```

## 配置选项

### ClientConfig

完整的客户端配置选项:

```typescript
interface ClientConfig {
  /** API Token */
  token: string

  /** 请求超时时间(毫秒),默认 30000 */
  timeout?: number

  /** API 基础 URL,默认 'http://api.tushare.pro' */
  baseUrl?: string

  /** 是否启用调试模式,默认 false */
  debug?: boolean

  /** 缓存配置 */
  cache?: CacheConfig
}
```

### 超时配置

设置请求超时时间:

```typescript
const client = new TushareClient({
  token: 'YOUR_API_TOKEN',
  timeout: 60000  // 60 秒
})
```

### 调试模式

启用调试模式会输出详细的请求日志:

```typescript
const client = new TushareClient({
  token: 'YOUR_API_TOKEN',
  debug: true
})
```

## 缓存配置

SDK 支持内存缓存来减少 API 调用次数。

### 启用缓存

```typescript
const client = new TushareClient({
  token: 'YOUR_API_TOKEN',
  cache: {
    enabled: true,
    ttl: 3600,  // 缓存有效期(秒)
    maxSize: 100  // 最大缓存条目数
  }
})
```

### CacheConfig 选项

```typescript
interface CacheConfig {
  /** 是否启用缓存 */
  enabled: boolean

  /** 缓存有效期(秒) */
  ttl?: number

  /** 最大缓存条目数 */
  maxSize?: number

  /** 自定义缓存存储 */
  storage?: CacheStorage
}
```

### 自定义缓存存储

实现自定义缓存存储:

```typescript
class RedisCacheStorage implements CacheStorage {
  async get<T>(key: string): Promise<T | null> {
    // 从 Redis 读取
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    // 写入 Redis
  }

  async has(key: string): Promise<boolean> {
    // 检查是否存在
  }

  async delete(key: string): Promise<void> {
    // 删除缓存
  }

  async clear(): Promise<void> {
    // 清空所有缓存
  }
}

const client = new TushareClient({
  token: 'YOUR_API_TOKEN',
  cache: {
    enabled: true,
    storage: new RedisCacheStorage()
  }
})
```

## 环境变量

可以通过环境变量配置 Token:

```bash
export TUSHARE_TOKEN=your_api_token_here
```

然后在代码中读取:

```typescript
const client = new TushareClient({
  token: process.env.TUSHARE_TOKEN || ''
})
```

## 多实例配置

可以创建多个客户端实例:

```typescript
// 生产环境客户端
const prodClient = new TushareClient({
  token: process.env.PROD_TOKEN,
  cache: { enabled: true, ttl: 3600 }
})

// 测试环境客户端
const testClient = new TushareClient({
  token: process.env.TEST_TOKEN,
  debug: true
})
```

## 下一步

- [API 参考](/api/) - 查看完整的 API 文档
- [API 测试](/guide/api-testing) - 使用交互式测试工具