# Research & Technical Decisions: SDK 文档站

**Feature**: 004-sdk-api
**Date**: 2025-09-30
**Status**: Complete

## 研究概述

本文档记录了为 Tushare TypeScript SDK 构建文档站和 API 测试平台的技术研究和决策过程。

---

## 1. VitePress 文档站框架

### 决策: VitePress 1.6.4+ (扩展默认主题)

**选择理由**:
- ✅ 基于 Vite,开发体验极佳(HMR, 快速构建)
- ✅ 内置本地搜索功能(MiniSearch),无需外部服务
- ✅ 支持 Vue 3 组件,可实现交互式 API 测试面板
- ✅ 静态站点生成(SSG),部署简单(GitHub Pages, Vercel, Netlify)
- ✅ Markdown 友好,支持在文档中直接使用 Vue 组件
- ✅ 成熟的主题系统,可通过插槽扩展默认主题

**替代方案评估**:
- Docusaurus: 功能强大但更重,对纯文档站略显过度设计
- VuePress: VitePress 的前身,已被 VitePress 取代
- Nextra: 基于 Next.js,但对 Vue 组件支持不佳

### 核心配置要点

```typescript
// .vitepress/config.ts
export default defineConfig({
  title: 'Tushare TypeScript SDK',
  lang: 'zh-CN',

  themeConfig: {
    // 多层级侧边栏(按功能分类)
    sidebar: {
      '/api/': [
        {
          text: '行情数据',
          collapsed: false,
          items: [
            { text: '日线行情', link: '/api/market/daily' },
            { text: '周线行情', link: '/api/market/weekly' }
          ]
        },
        {
          text: '财务数据',
          collapsed: false,
          items: [
            { text: '利润表', link: '/api/financial/income' },
            { text: '资产负债表', link: '/api/financial/balance' }
          ]
        }
      ]
    },

    // 本地搜索配置
    search: {
      provider: 'local',
      options: {
        translations: {
          button: { buttonText: '搜索文档' },
          modal: { noResultsText: '无法找到相关结果' }
        },
        miniSearch: {
          searchOptions: {
            fuzzy: 0.2,
            prefix: true
          }
        }
      }
    }
  }
})
```

### 自定义主题策略

**选择: 扩展默认主题 + 布局插槽**

```vue
<!-- .vitepress/theme/Layout.vue -->
<template>
  <DefaultTheme.Layout>
    <!-- 在 API 文档页面插入测试面板 -->
    <template #doc-after>
      <ApiTester v-if="frontmatter.api" :api-spec="frontmatter.api" />
    </template>

    <!-- 在侧边栏前插入 Token 管理器 -->
    <template #sidebar-nav-before>
      <TokenManager />
    </template>
  </DefaultTheme.Layout>
</template>
```

**优势**:
- 保留默认主题的所有功能(导航、搜索、响应式布局)
- 仅需自定义特殊功能(API 测试面板)
- 可用的插槽位置: `doc-before`, `doc-after`, `sidebar-nav-before`, `sidebar-nav-after` 等

---

## 2. API 文档自动生成

### 决策: TypeDoc + typedoc-plugin-markdown

**选择理由**:
- ✅ 成熟稳定,周下载量 1.3M+
- ✅ 直接从 TypeScript 源码和 JSDoc 提取信息
- ✅ 支持 Markdown 输出,与 VitePress 无缝集成
- ✅ 配置简单,可在 4-8 小时内完成基础设置
- ✅ 项目已有良好的 JSDoc 注释,可直接利用
- ✅ 支持自动分类(`@category` 标签)和分组

**替代方案评估**:
- **API Extractor**: 企业级工具,但配置复杂,对单包 SDK 过度设计
- **自定义 AST 解析**: 灵活性高,但开发成本 40-80 小时,维护负担重
- **TypeDoc 方案投入产出比最优**

### 配置示例

```json
// typedoc.json
{
  "entryPoints": ["src/index.ts"],
  "out": "docs/api",
  "plugin": ["typedoc-plugin-markdown"],
  "exclude": ["**/*+(test|spec).ts"],
  "excludePrivate": true,
  "categorizeByGroup": true,
  "categoryOrder": [
    "Client",
    "Market Data",
    "Financial Data",
    "Cache",
    "Types",
    "*"
  ]
}
```

### 半自动文档生成工作流

**阶段 1: 自动生成(TypeDoc)**
- ✅ 类、接口、类型定义的结构
- ✅ 方法签名和参数类型
- ✅ 返回值类型
- ✅ JSDoc 注释提取

**阶段 2: 手动补充**
- 📝 添加 `@example` 标签提供使用示例
- 📝 添加 `@remarks` 说明注意事项
- 📝 添加 `@category` 标签进行分类
- 📝 编写高层次概述文档(快速开始、核心概念)

**阶段 3: 自动化同步(CI/CD)**
- 🔄 每次提交自动重新生成 API 文档
- 🔄 自动部署到 GitHub Pages

### JSDoc 增强示例

```typescript
/**
 * 获取日线行情数据
 *
 * @remarks
 * 该接口提供指定日期范围的股票日线行情数据,包括开盘价、收盘价、最高价、最低价等。
 *
 * @example 基本用法
 * ```typescript
 * const data = await client.daily({
 *   ts_code: '000001.SZ',
 *   start_date: '20250101',
 *   end_date: '20250131'
 * })
 * ```
 *
 * @example 使用缓存
 * ```typescript
 * const data = await client.daily(
 *   { ts_code: '000001.SZ' },
 *   { cache: { ttl: 3600 } }
 * )
 * ```
 *
 * @category Market Data
 * @param params - 查询参数
 * @returns 日线行情数据数组
 */
async daily(params: DailyParams): Promise<DailyData[]> {
  // ...
}
```

---

## 3. SDK 浏览器打包方案

### 决策: tsdown 添加 IIFE 格式

**选择理由**:
- ✅ 项目已使用 tsdown,保持技术栈一致性
- ✅ tsdown 原生支持 IIFE 格式
- ✅ 基于 Rust 的 Rolldown,构建速度极快
- ✅ SDK 已使用 Web 标准 API(`fetch`, `AbortController`),无需 polyfill
- ✅ 配置成本极低(仅需修改 1 个配置文件)

**替代方案评估**:
- **Vite library mode**: 功能强大,但引入新工具增加复杂度
- **Rollup**: 速度较慢,配置复杂
- **tsdown 方案最简单高效**

### 浏览器兼容性分析

**当前代码优势**:
- ✅ 无 Node.js 专有 API 依赖(`fs`, `path`, `http` 等)
- ✅ HTTP 客户端使用标准 `fetch` API
- ✅ 支持请求取消(`AbortController`)
- ✅ 现代浏览器(Chrome 90+, Firefox 88+, Safari 14+)原生支持,无需 polyfill

**目标浏览器**: 现代浏览器(2021+ 版本),覆盖率 >95%

### 配置修改

```typescript
// tsdown.config.ts
import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: './src/index.ts',
  format: ['esm', 'cjs', 'iife'],  // 添加 iife
  dts: true,
  minify: true,
  target: 'es2020',
  clean: true,
  sourcemap: true,
  outDir: 'dist',
  globalName: 'Tushare',  // 浏览器全局变量名
  platform: 'browser'
})
```

### 浏览器使用方式

```html
<!-- 从 CDN 加载 -->
<script src="https://unpkg.com/tushare-typescript-sdk/dist/index.iife.js"></script>
<script>
  const client = new Tushare.TushareClient({ token: 'xxx' })
  client.daily({ ts_code: '000001.SZ' })
    .then(data => console.log(data))
</script>
```

### 包体积预期

- 未压缩: ~80-120 KB
- Minified: ~40-60 KB
- Gzipped: ~15-25 KB ✅ **目标体积**

---

## 4. Vue 3 组件架构

### 核心组件设计

#### 4.1 ApiTester 组件(API 测试面板)

**功能**:
- 动态表单生成(基于 API 参数定义)
- 参数输入和验证
- 调用 SDK 实例测试接口
- 结果展示(JSON 格式化、响应时间、状态码)
- 错误处理和友好提示

**技术栈**:
- Vue 3 Composition API
- 表单验证库(可选: VeeValidate, Zod)
- JSON 展示(Monaco Editor 或 Prism.js)

**Props 契约**:
```typescript
interface ApiTesterProps {
  apiName: string           // 接口名称
  apiSpec: ApiDocEntry      // 接口规范定义
}
```

#### 4.2 TokenManager 组件(Token 管理)

**功能**:
- Token 输入表单
- localStorage 持久化存储
- Token 有效性验证(可选)
- 清除 Token 功能

**存储键**: `tushare-sdk-docs:token`

#### 4.3 RequestHistory 组件(请求历史)

**功能**:
- 显示最近 50 条请求记录
- 记录内容: 接口名、参数、时间戳、成功/失败状态
- 快速重放功能(点击历史记录重新执行)
- 清空历史功能

**存储键**: `tushare-sdk-docs:history`

### Composables 设计

#### useLocalStorage (localStorage 封装)

```typescript
export function useLocalStorage<T>(
  key: string,
  defaultValue: T
): {
  value: Ref<T>
  set: (val: T) => void
  remove: () => void
}
```

**功能**:
- 自动 JSON 序列化/反序列化
- 错误处理(存储满、数据损坏)
- 响应式(Ref)

#### useSdkClient (SDK 客户端单例)

```typescript
export function useSdkClient(): {
  client: ComputedRef<TushareClient | null>
  setToken: (token: string) => void
  isReady: Ref<boolean>
}
```

**功能**:
- 单例模式管理 SDK 客户端实例
- 自动从 localStorage 加载 token
- 提供客户端就绪状态

#### useRequestHistory (历史记录管理)

```typescript
export function useRequestHistory(): {
  history: Ref<RequestHistoryEntry[]>
  addEntry: (entry: Omit<RequestHistoryEntry, 'id' | 'timestamp'>) => void
  clear: () => void
}
```

**功能**:
- 限制最大记录数(50 条)
- 自动删除最旧记录
- localStorage 持久化

---

## 5. localStorage 存储方案

### 存储架构

**存储键前缀**: `tushare-sdk-docs:`

**存储项**:
1. `tushare-sdk-docs:token` - TokenConfig
   ```typescript
   {
     token: string
     lastUpdated: number  // 时间戳
   }
   ```

2. `tushare-sdk-docs:history` - RequestHistoryEntry[]
   ```typescript
   [
     {
       id: string           // UUID
       apiName: string
       parameters: Record<string, any>
       timestamp: number
       success: boolean
       responseSummary: string  // 前 100 字符
     }
   ]
   ```

### 容量管理

**浏览器限制**: localStorage 通常限制 5-10MB

**策略**:
- Token: ~100 bytes
- 单条历史记录: ~500 bytes
- 50 条历史记录: ~25 KB
- **总计: < 30 KB** (远低于限制)

### 错误处理

```typescript
try {
  localStorage.setItem(key, value)
} catch (e) {
  if (e.name === 'QuotaExceededError') {
    // 存储已满,清理历史记录
    clearOldHistory()
  } else {
    // 其他错误(隐私模式、权限问题)
    console.error('localStorage unavailable')
  }
}
```

---

## 6. API 文档分类方案

### 分类结构

基于 Tushare API 的功能领域,设计三级分类:

```
📁 API 参考
├── 📂 行情数据 (Market Data)
│   ├── 日线行情 (daily)
│   ├── 周线行情 (weekly)
│   └── 分钟行情 (minute)
├── 📂 财务数据 (Financial Data)
│   ├── 利润表 (income)
│   ├── 资产负债表 (balance)
│   └── 现金流量表 (cashflow)
├── 📂 基础数据 (Basic Data)
│   ├── 股票列表 (stock_basic)
│   ├── 交易日历 (trade_cal)
│   └── 公司信息 (stock_company)
└── 📂 指数数据 (Index Data)
    ├── 指数基本信息 (index_basic)
    └── 指数日线行情 (index_daily)
```

### 分类实现方式

**方式 1: JSDoc 标签**
```typescript
/**
 * @category Market Data
 */
export async function daily(params: DailyParams) {
  // ...
}
```

**方式 2: 配置文件**
```typescript
// tools/docs-generator/categorization.ts
export const API_CATEGORIES = {
  'Market Data': ['daily', 'weekly', 'minute'],
  'Financial Data': ['income', 'balance', 'cashflow'],
  'Basic Data': ['stock_basic', 'trade_cal', 'stock_company'],
  'Index Data': ['index_basic', 'index_daily']
}
```

**推荐**: 使用 JSDoc 标签,TypeDoc 自动识别

### 导航生成

VitePress 侧边栏配置将根据分类自动生成:

```typescript
// .vitepress/config.ts (自动生成脚本)
const sidebar = generateSidebarFromCategories(API_CATEGORIES)
```

---

## 7. 搜索功能配置

### 选择: VitePress 内置本地搜索(MiniSearch)

**优势**:
- ✅ 零配置,开箱即用
- ✅ 无需外部服务(Algolia 需注册和配置)
- ✅ 静态站点友好,全部在客户端运行
- ✅ 支持中文分词(通过自定义 tokenizer)
- ✅ 支持模糊搜索和前缀匹配

### 高级配置

```typescript
themeConfig: {
  search: {
    provider: 'local',
    options: {
      // 中文优化
      miniSearch: {
        options: {
          tokenize: (text) => {
            // 中文按字符分词,英文按单词分词
            return text.split(/[\s\-,。、]+/)
          },
          processTerm: (term) => term.toLowerCase()
        },
        searchOptions: {
          fuzzy: 0.2,      // 模糊匹配容差
          prefix: true,     // 启用前缀匹配
          boost: {          // 字段权重
            title: 4,       // 标题权重最高
            text: 2,
            titles: 1
          }
        }
      }
    }
  }
}
```

### 搜索范围

**索引内容**:
- 页面标题
- 页面正文
- 各级标题(h2, h3, h4)

**排除内容**:
- 代码块中的内容(可选)
- 标记 `<!-- exclude-from-search -->` 的页面

---

## 8. 部署方案

### 选择: 静态站点部署(GitHub Pages)

**原因**:
- ✅ VitePress 生成纯静态文件
- ✅ 无需后端服务器
- ✅ GitHub Pages 免费、稳定、自动 HTTPS
- ✅ 支持自定义域名

### 部署流程

```yaml
# .github/workflows/deploy-docs.yml
name: Deploy Documentation

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 20

      - name: Install dependencies
        run: npm ci

      - name: Build SDK
        run: npm run build

      - name: Generate API docs
        run: npm run docs:generate

      - name: Build VitePress
        run: npm run docs:build

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: docs/.vitepress/dist
```

### 替代部署平台

- **Vercel**: 自动部署,边缘网络,速度更快
- **Netlify**: 类似 Vercel,支持表单和函数
- **Cloudflare Pages**: CDN 加速,全球分发

---

## 9. 安全考虑

### Token 管理风险

**问题**: 浏览器环境中 token 暴露风险

**解决方案**:
1. **明确文档警告**: 在文档中说明 token 不应在生产环境暴露
2. **推荐架构**:
   ```
   浏览器 -> 你的后端服务 -> Tushare API
             (无 token)      (使用 token)
   ```
3. **演示 token**: 提供限流的公共演示 token,仅用于测试

### CORS 处理

**假设**: Tushare API 支持 CORS

**如果不支持**: 提供代理服务器示例代码

```typescript
// example-proxy/server.ts
import express from 'express'
import { TushareClient } from 'tushare-typescript-sdk'

const app = express()
const client = new TushareClient({ token: process.env.TUSHARE_TOKEN })

app.post('/api/:method', async (req, res) => {
  const { method } = req.params
  const data = await client[method](req.body)
  res.json(data)
})

app.listen(3000)
```

---

## 10. 性能目标

### 文档站性能指标

- **首屏加载时间**: < 3s (全球平均)
- **Lighthouse 分数**: > 90 (Performance, Accessibility, Best Practices, SEO)
- **包体积**: 压缩后 < 200 KB (不含 SDK)

### API 测试性能

- **SDK 加载时间**: < 500ms
- **测试结果展示**: < 100ms (不含网络请求)
- **历史记录操作**: < 50ms

### 优化策略

1. **代码分割**: API 测试组件按需加载
2. **图片优化**: 使用 WebP 格式,懒加载
3. **字体子集化**: 仅加载中文常用字
4. **CDN 加速**: 静态资源通过 CDN 分发

---

## 11. 实施时间估算

### 阶段划分

| 阶段 | 任务 | 预估时间 |
|------|------|---------|
| **Phase 0** | 环境搭建、依赖安装 | 2-4 小时 |
| **Phase 1** | 文档生成工具开发 | 8-12 小时 |
| **Phase 2** | VitePress 配置、主题自定义 | 6-8 小时 |
| **Phase 3** | Vue 组件开发(API 测试面板) | 12-16 小时 |
| **Phase 4** | 集成测试、样式调整 | 4-6 小时 |
| **Phase 5** | 文档内容编写 | 6-8 小时 |
| **Phase 6** | CI/CD 配置、部署 | 2-4 小时 |
| **总计** | | **40-58 小时** |

---

## 12. 风险和缓解措施

### 风险 1: TypeDoc 输出格式不符合预期

**缓解**: 早期测试(Phase 1),如不满足需求,切换到自定义生成器

### 风险 2: VitePress 主题定制遇到限制

**缓解**: 使用布局插槽扩展,而非完全自定义主题

### 风险 3: SDK 浏览器打包遇到兼容性问题

**缓解**: 早期验证(Phase 0),确认 fetch API 可用性

### 风险 4: localStorage 存储限制

**缓解**: 限制历史记录数量(50 条),实现自动清理

---

## 13. 未来扩展方向

### 短期优化(3-6 个月)
- [ ] 添加 API 性能监控(响应时间统计)
- [ ] 实现请求历史导出功能(JSON/CSV)
- [ ] 支持多语言代码示例(Python, Java, Go)
- [ ] 添加 API 变更日志(Changelog)

### 长期规划(6-12 个月)
- [ ] 实现 API Playground(交互式探索)
- [ ] 集成 GraphQL 查询构建器(如果 Tushare 支持)
- [ ] 添加数据可视化示例(图表库集成)
- [ ] 社区贡献的示例代码库

---

## 决策总结

| 技术决策点 | 选择方案 | 核心理由 |
|-----------|---------|---------|
| **文档框架** | VitePress 1.6.4+ | Vue 3 集成、静态站点、本地搜索 |
| **API 文档生成** | TypeDoc + Plugin | 成熟稳定、配置简单、投入产出比高 |
| **SDK 浏览器打包** | tsdown IIFE | 已有工具、零学习成本、速度快 |
| **组件框架** | Vue 3 Composition API | VitePress 原生支持 |
| **状态管理** | Composables | 轻量级,无需 Vuex/Pinia |
| **存储方案** | localStorage | 无需后端、简单高效 |
| **搜索功能** | VitePress 本地搜索 | 开箱即用、零配置 |
| **部署平台** | GitHub Pages | 免费、稳定、集成简单 |
| **目标浏览器** | 现代浏览器(Chrome 90+) | 无 polyfill、体积小 |
| **CI/CD** | GitHub Actions | 项目已使用 |

---

## 参考资源

1. **VitePress 官方文档**: https://vitepress.dev
2. **TypeDoc 文档**: https://typedoc.org
3. **typedoc-plugin-markdown**: https://typedoc-plugin-markdown.org
4. **Vue 3 文档**: https://vuejs.org
5. **tsdown 文档**: https://tsdown.dev (或 GitHub 仓库)
6. **MDN Web API**: https://developer.mozilla.org/zh-CN/docs/Web/API

---

**研究完成日期**: 2025-09-30
**下一步**: 进入 Phase 1 - 设计和契约定义