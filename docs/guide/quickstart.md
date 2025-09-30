# 快速开始

## 安装

使用 npm:

\`\`\`bash
npm install tushare-typescript-sdk
\`\`\`

使用 pnpm:

\`\`\`bash
pnpm add tushare-typescript-sdk
\`\`\`

## 获取 API Token

1. 访问 [Tushare Pro](https://tushare.pro) 注册账号
2. 在个人中心获取 API Token

## 基本使用

### Node.js

\`\`\`typescript
import { TushareClient } from 'tushare-typescript-sdk'

// 创建客户端
const client = new TushareClient({
  token: 'YOUR_API_TOKEN'
})

// 查询日线行情
const dailyData = await client.daily({
  ts_code: '000001.SZ',
  start_date: '20250101',
  end_date: '20250131'
})

console.log(dailyData)
\`\`\`

### 浏览器

\`\`\`html
<script src="https://unpkg.com/tushare-typescript-sdk/dist/index.iife.js"></script>
<script>
  const client = new Tushare.TushareClient({
    token: 'YOUR_API_TOKEN'
  })

  client.daily({ ts_code: '000001.SZ' })
    .then(data => console.log(data))
</script>
\`\`\`

## 配置选项

\`\`\`typescript
const client = new TushareClient({
  token: 'YOUR_API_TOKEN',
  timeout: 30000,        // 请求超时时间(毫秒)
  baseUrl: 'http://api.tushare.pro'  // API 基础 URL
})
\`\`\`

## 错误处理

\`\`\`typescript
try {
  const data = await client.daily({ ts_code: '000001.SZ' })
  console.log(data)
} catch (error) {
  if (error.code === 40001) {
    console.error('Token 无效')
  } else if (error.code === 40002) {
    console.error('超出频率限制')
  } else {
    console.error('请求失败:', error.message)
  }
}
\`\`\`

## 下一步

- [配置详解](/guide/configuration) - 了解更多配置选项
- [API 参考](/api/) - 查看完整的 API 文档
- [在线测试](/guide/api-testing) - 使用交互式测试工具