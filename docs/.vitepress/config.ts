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
      { text: 'API 参考', link: '/api/' }
    ],

    // 侧边栏(暂时为空,稍后配置)
    sidebar: {},

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
    }
  }
})