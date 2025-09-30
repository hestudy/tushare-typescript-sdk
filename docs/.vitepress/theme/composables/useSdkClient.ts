/**
 * useSdkClient Composable
 *
 * 管理 SDK 客户端单例
 */

import { ref, computed, type Ref, type ComputedRef } from 'vue'
import { useLocalStorage } from './useLocalStorage'
import type { TokenConfig, TestResult, TestError } from '../types'
import { STORAGE_KEYS } from '../types'

// 声明全局 Tushare SDK(由 IIFE 构建提供)
declare global {
  interface Window {
    Tushare?: any
  }
}

export interface UseSdkClientReturn {
  /** SDK 客户端实例(计算属性) */
  client: ComputedRef<any | null>

  /** 设置 token */
  setToken: (token: string) => void

  /** 清除 token */
  clearToken: () => void

  /** 客户端是否就绪 */
  isReady: Ref<boolean>

  /** 调用 API */
  callApi: <T = any>(
    apiName: string,
    params: Record<string, any>
  ) => Promise<TestResult>
}

/**
 * 使用 SDK 客户端的 composable
 *
 * @returns SDK 客户端管理方法
 */
export function useSdkClient(): UseSdkClientReturn {
  const { value: tokenConfig, set: setTokenConfig, remove: removeTokenConfig } =
    useLocalStorage<TokenConfig | null>(STORAGE_KEYS.TOKEN, null)

  const clientInstance = ref<any>(null)
  const isReady = ref<boolean>(false)

  // 初始化客户端
  const initializeClient = () => {
    if (typeof window === 'undefined') {
      return
    }

    // 检查 SDK 是否加载
    if (!window.Tushare) {
      console.warn('Tushare SDK not loaded. Make sure to include the IIFE build.')
      isReady.value = false
      return
    }

    // 如果有 token,创建客户端实例
    if (tokenConfig.value && tokenConfig.value.token) {
      try {
        clientInstance.value = new window.Tushare.TushareClient({
          token: tokenConfig.value.token
        })
        isReady.value = true
      } catch (error) {
        console.error('Failed to initialize Tushare client:', error)
        isReady.value = false
      }
    } else {
      clientInstance.value = null
      isReady.value = false
    }
  }

  // 客户端计算属性
  const client = computed(() => clientInstance.value)

  // 设置 token
  const setToken = (token: string): void => {
    setTokenConfig({
      token,
      lastUpdated: Date.now()
    })
    initializeClient()
  }

  // 清除 token
  const clearToken = (): void => {
    removeTokenConfig()
    clientInstance.value = null
    isReady.value = false
  }

  /**
   * 调用 API 并返回测试结果
   */
  const callApi = async <T = any>(
    apiName: string,
    params: Record<string, any>
  ): Promise<TestResult> => {
    const startTime = Date.now()

    if (!client.value) {
      const error: TestError = {
        name: 'ClientNotReadyError',
        message: 'SDK client is not initialized. Please configure your token first.'
      }

      return {
        statusCode: 0,
        responseTime: 0,
        data: null,
        error,
        metadata: {
          apiName,
          parameters: params,
          startTime,
          endTime: Date.now()
        }
      }
    }

    try {
      // 调用 SDK 方法
      const apiMethod = client.value[apiName]
      if (typeof apiMethod !== 'function') {
        throw new Error(`API method "${apiName}" not found on SDK client`)
      }

      const data = await apiMethod.call(client.value, params)
      const endTime = Date.now()

      return {
        statusCode: 200,
        responseTime: endTime - startTime,
        data,
        metadata: {
          apiName,
          parameters: params,
          startTime,
          endTime
        }
      }
    } catch (error: any) {
      const endTime = Date.now()

      const testError: TestError = {
        name: error.name || 'APIError',
        message: error.message || 'Unknown error occurred',
        code: error.code,
        stack: error.stack
      }

      return {
        statusCode: error.statusCode || 500,
        responseTime: endTime - startTime,
        data: null,
        error: testError,
        metadata: {
          apiName,
          parameters: params,
          startTime,
          endTime
        }
      }
    }
  }

  // 初始化
  if (typeof window !== 'undefined') {
    initializeClient()
  }

  return {
    client,
    setToken,
    clearToken,
    isReady,
    callApi
  }
}