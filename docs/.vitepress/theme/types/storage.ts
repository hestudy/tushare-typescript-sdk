/**
 * localStorage 存储相关类型定义
 */

import type { TokenConfig } from './auth'
import type { RequestHistory } from './history'

/**
 * localStorage 存储键前缀
 */
export const STORAGE_PREFIX = 'tushare-sdk-docs:' as const

/**
 * localStorage 存储键定义
 */
export const STORAGE_KEYS = {
  /** Token 配置 */
  TOKEN: `${STORAGE_PREFIX}token`,

  /** 请求历史 */
  HISTORY: `${STORAGE_PREFIX}history`,

  /** 用户偏好设置(可选扩展) */
  PREFERENCES: `${STORAGE_PREFIX}preferences`,
} as const

/**
 * 用户偏好设置(可选)
 */
export interface UserPreferences {
  /** 主题(亮色/暗色) */
  theme?: 'light' | 'dark'

  /** 默认折叠侧边栏分类 */
  collapsedCategories?: string[]

  /** 最后访问的页面 */
  lastVisitedPage?: string
}

/**
 * localStorage 存储架构定义
 */
export interface StorageSchema {
  [STORAGE_KEYS.TOKEN]: TokenConfig
  [STORAGE_KEYS.HISTORY]: RequestHistory
  [STORAGE_KEYS.PREFERENCES]?: UserPreferences
}