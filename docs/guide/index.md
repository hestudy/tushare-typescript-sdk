# 简介

欢迎使用 Tushare TypeScript SDK!

## 什么是 Tushare TypeScript SDK?

Tushare TypeScript SDK 是一个为 [Tushare Pro](https://tushare.pro) 财经数据接口提供的 TypeScript 类型安全的 SDK。它提供:

- 🎯 **完整的类型定义** - 所有 API 都有完整的 TypeScript 类型支持
- 🚀 **现代化开发体验** - 使用 async/await,支持 Promise
- 📦 **多种模块格式** - 支持 ESM、CJS 和浏览器 IIFE
- 🔧 **灵活的配置** - 支持缓存、超时等配置选项
- 📝 **详细的文档** - 完整的 API 文档和示例代码

## 特性

### 类型安全

所有 API 调用都有完整的类型定义,享受 IDE 的智能提示和类型检查。

### 易于使用

简洁的 API 设计,上手即用:

\`\`\`typescript
import { TushareClient } from 'tushare-typescript-sdk'

const client = new TushareClient({ token: 'YOUR_TOKEN' })
const data = await client.daily({ ts_code: '000001.SZ' })
\`\`\`

### 浏览器支持

可在 Node.js 和现代浏览器中使用,无需额外配置。

## 下一步

- [快速开始](/guide/quickstart) - 了解如何安装和使用
- [API 参考](/api/) - 查看完整的 API 文档
- [API 测试](/guide/api-testing) - 在线测试 API