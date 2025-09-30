import { ClientConfig } from '../types/config'

/**
 * 认证管理器类
 */
export class AuthManager {
  private token: string

  constructor(config: ClientConfig) {
    this.token = config.token
    this.validateToken()
  }

  /**
   * 获取token
   */
  getToken(): string {
    return this.token
  }

  /**
   * 验证token格式
   */
  private validateToken(): void {
    if (!this.token || this.token.length < 32) {
      throw new Error('Token无效: token长度必须至少为32个字符')
    }
  }
}