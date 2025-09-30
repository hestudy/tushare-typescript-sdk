/**
 * localStorage 存储契约
 *
 * 定义 localStorage 数据格式和存储键
 */

/**
 * Token 配置
 */
export interface TokenConfig {
  /** API token 值 */
  token: string

  /** 最后更新时间戳(毫秒) */
  lastUpdated: number

  /** Token 备注(可选) */
  label?: string
}

/**
 * 请求历史记录条目
 */
export interface RequestHistoryEntry {
  /** 记录唯一 ID(UUID) */
  id: string

  /** API 接口名称 */
  apiName: string

  /** 请求参数 */
  parameters: Record<string, any>

  /** 请求时间戳(毫秒) */
  timestamp: number

  /** 是否成功 */
  success: boolean

  /** 响应摘要 */
  responseSummary: string

  /** 响应时间(毫秒,可选) */
  responseTime?: number

  /** HTTP 状态码(可选) */
  statusCode?: number
}

/**
 * localStorage 存储键定义
 */
export const STORAGE_PREFIX = 'tushare-sdk-docs:' as const

export const STORAGE_KEYS = {
  TOKEN: `${STORAGE_PREFIX}token`,
  HISTORY: `${STORAGE_PREFIX}history`,
  PREFERENCES: `${STORAGE_PREFIX}preferences`,
} as const

/**
 * localStorage 存储架构
 */
export interface StorageSchema {
  [STORAGE_KEYS.TOKEN]: TokenConfig
  [STORAGE_KEYS.HISTORY]: RequestHistoryEntry[]
  [STORAGE_KEYS.PREFERENCES]?: {
    theme?: 'light' | 'dark'
    collapsedCategories?: string[]
  }
}

/**
 * 存储操作契约
 */
export interface StorageOperations {
  /**
   * 获取 token 配置
   */
  getToken(): TokenConfig | null

  /**
   * 设置 token 配置
   */
  setToken(config: TokenConfig): void

  /**
   * 清除 token 配置
   */
  clearToken(): void

  /**
   * 获取请求历史
   */
  getHistory(): RequestHistoryEntry[]

  /**
   * 添加历史记录
   *
   * @param entry - 历史记录条目(不含 id 和 timestamp,会自动生成)
   */
  addHistoryEntry(
    entry: Omit<RequestHistoryEntry, 'id' | 'timestamp'>
  ): void

  /**
   * 清空历史记录
   */
  clearHistory(): void

  /**
   * 删除单条历史记录
   *
   * @param id - 记录 ID
   */
  removeHistoryEntry(id: string): void
}