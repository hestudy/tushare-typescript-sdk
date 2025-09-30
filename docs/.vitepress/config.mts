import { defineConfig } from 'vitepress'

// VitePress 配置文件
export default defineConfig({
  title: 'Tushare TypeScript SDK',
  description: 'TypeScript SDK for Tushare Pro API',
  lang: 'zh-CN',

  themeConfig: {
    // 导航栏
    nav: [
      { text: '首页', link: '/' },
      { text: '指南', link: '/guide/' },
      { text: 'API 参考', link: '/api/' },
      {
        text: 'GitHub',
        link: 'https://github.com/your-org/tushare-typescript-sdk'
      }
    ],

    // 侧边栏
    sidebar: {
      '/guide/': [
        {
          text: '指南',
          items: [
            { text: '简介', link: '/guide/' },
            { text: '快速开始', link: '/guide/quickstart' },
            { text: '配置', link: '/guide/configuration' },
            { text: 'API 测试', link: '/guide/api-testing' }
          ]
        }
      ],
      '/api/': [
        {
          text: 'API 参考',
          items: [
            { text: '概述', link: '/api/' }
          ]
        },
        {
          text: '核心类',
          collapsed: false,
          items: [
            { text: 'TushareClient', link: '/api/classes/TushareClient' },
            { text: 'MemoryCache', link: '/api/classes/MemoryCache' }
          ]
        },
        {
          text: '错误类型',
          collapsed: false,
          items: [
            { text: 'TushareError', link: '/api/classes/TushareError' },
            { text: 'AuthenticationError', link: '/api/classes/AuthenticationError' },
            { text: 'RateLimitError', link: '/api/classes/RateLimitError' },
            { text: 'DataNotDisclosedError', link: '/api/classes/DataNotDisclosedError' }
          ]
        },
        {
          text: '接口定义',
          collapsed: false,
          items: [
            { text: 'ClientConfig', link: '/api/interfaces/ClientConfig' },
            { text: 'CacheConfig', link: '/api/interfaces/CacheConfig' },
            { text: 'DailyQuote', link: '/api/interfaces/DailyQuote' },
            { text: 'RealtimeQuote', link: '/api/interfaces/RealtimeQuote' },
            { text: 'BalanceSheet', link: '/api/interfaces/BalanceSheet' },
            { text: 'IncomeStatement', link: '/api/interfaces/IncomeStatement' },
            { text: 'CashFlowStatement', link: '/api/interfaces/CashFlowStatement' },
            { text: 'FinancialIndicator', link: '/api/interfaces/FinancialIndicator' }
          ]
        },
        {
          text: '枚举类型',
          collapsed: true,
          items: [
            { text: 'TushareErrorType', link: '/api/enumerations/TushareErrorType' },
            { text: 'DataStatus', link: '/api/enumerations/DataStatus' },
            { text: 'PeriodType', link: '/api/enumerations/PeriodType' }
          ]
        }
      ]
    },

    // 本地搜索配置
    search: {
      provider: 'local',
      options: {
        translations: {
          button: {
            buttonText: '搜索文档',
            buttonAriaLabel: '搜索文档'
          },
          modal: {
            noResultsText: '无法找到相关结果',
            resetButtonTitle: '清除查询条件',
            footer: {
              selectText: '选择',
              navigateText: '切换'
            }
          }
        }
      }
    },

    // 社交链接
    socialLinks: [
      { icon: 'github', link: 'https://github.com/your-org/tushare-typescript-sdk' }
    ],

    // 页脚
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2025-present'
    }
  }
})