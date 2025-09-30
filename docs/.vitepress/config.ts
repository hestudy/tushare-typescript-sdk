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
          text: '行情数据',
          collapsed: false,
          items: [
            { text: '日线行情', link: '/api/daily' },
            { text: '周线行情', link: '/api/weekly' },
            { text: '分钟行情', link: '/api/minute' }
          ]
        },
        {
          text: '财务数据',
          collapsed: false,
          items: [
            { text: '利润表', link: '/api/income' },
            { text: '资产负债表', link: '/api/balance' },
            { text: '现金流量表', link: '/api/cashflow' }
          ]
        },
        {
          text: '基础数据',
          collapsed: false,
          items: [
            { text: '股票列表', link: '/api/stock_basic' },
            { text: '交易日历', link: '/api/trade_cal' },
            { text: '公司信息', link: '/api/stock_company' }
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