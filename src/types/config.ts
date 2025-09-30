/**
 * Tushare客户端配置接口
 */
export interface ClientConfig {
  /**
   * Tushare API token (必填)
   * 从 https://tushare.pro 用户中心获取
   */
  token: string

  /**
   * API基础URL (可选)
   * @default "http://api.tushare.pro"
   */
  baseUrl?: string

  /**
   * 请求超时时间(毫秒) (可选)
   * @default 5000
   */
  timeout?: number

  /**
   * 是否启用调试日志 (可选)
   * @default false
   */
  debug?: boolean
}
