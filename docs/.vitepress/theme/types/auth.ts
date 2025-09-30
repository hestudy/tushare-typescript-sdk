/**
 * 认证相关类型定义
 */

/**
 * Token 配置
 * 存储在 localStorage: tushare-sdk-docs:token
 */
export interface TokenConfig {
  /** API token 值 */
  token: string

  /** 最后更新时间戳(毫秒) */
  lastUpdated: number

  /** Token 备注(可选,用户自定义) */
  label?: string
}

/**
 * 认证状态
 */
export interface AuthStatus {
  /** 是否已配置 token */
  hasToken: boolean

  /** 是否已验证 token 有效性 */
  isValidated: boolean

  /** 验证结果(如果已验证) */
  validationResult?: {
    /** 是否有效 */
    valid: boolean

    /** 错误信息(如果验证失败) */
    error?: string

    /** 验证时间 */
    timestamp: number
  }
}