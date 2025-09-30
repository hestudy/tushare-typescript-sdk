import DefaultTheme from 'vitepress/theme'
import { ApiTester, TokenManager, RequestHistory } from './components'

// 自定义主题入口文件
export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    // 全局注册自定义组件
    app.component('ApiTester', ApiTester)
    app.component('TokenManager', TokenManager)
    app.component('RequestHistory', RequestHistory)
  }
}