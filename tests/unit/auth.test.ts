import { describe, it, expect } from 'vitest'
import { AuthManager } from '../../src/core/auth'

describe('AuthManager', () => {
  describe('构造函数和验证', () => {
    it('应该接受有效的token', () => {
      const config = { token: '1234567890123456789012345678901234567890' }
      const authManager = new AuthManager(config)
      expect(authManager.getToken()).toBe('1234567890123456789012345678901234567890')
    })

    it('应该接受恰好32个字符的token', () => {
      const config = { token: '12345678901234567890123456789012' } // 32个字符
      const authManager = new AuthManager(config)
      expect(authManager.getToken()).toBe('12345678901234567890123456789012')
    })

    it('应该拒绝少于32个字符的token', () => {
      const config = { token: '1234567890123456789012345678901' } // 31个字符
      expect(() => new AuthManager(config)).toThrow('Token无效: token长度必须至少为32个字符')
    })

    it('应该拒绝空token', () => {
      const config = { token: '' }
      expect(() => new AuthManager(config)).toThrow('Token无效: token长度必须至少为32个字符')
    })
  })

  describe('getToken', () => {
    it('应该返回配置的token', () => {
      const token = 'test_token_1234567890123456789012345'
      const config = { token }
      const authManager = new AuthManager(config)
      expect(authManager.getToken()).toBe(token)
    })
  })
})