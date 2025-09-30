/**
 * useLocalStorage Composable
 *
 * 封装 localStorage 操作,提供响应式支持和错误处理
 */

import { ref, watch, type Ref } from 'vue'

export interface UseLocalStorageReturn<T> {
  /** 响应式值 */
  value: Ref<T>

  /** 设置值 */
  set: (val: T) => void

  /** 移除值 */
  remove: () => void

  /** 重新加载值(从 localStorage) */
  reload: () => void
}

/**
 * 使用 localStorage 存储数据的 composable
 *
 * @param key - localStorage 键名
 * @param defaultValue - 默认值
 * @returns 响应式 localStorage 值和操作方法
 */
export function useLocalStorage<T>(
  key: string,
  defaultValue: T
): UseLocalStorageReturn<T> {
  // 从 localStorage 读取初始值
  const readValue = (): T => {
    if (typeof window === 'undefined') {
      return defaultValue
    }

    try {
      const item = window.localStorage.getItem(key)
      return item ? (JSON.parse(item) as T) : defaultValue
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error)
      return defaultValue
    }
  }

  // 创建响应式引用
  const storedValue = ref<T>(readValue()) as Ref<T>

  // 设置值
  const set = (val: T) => {
    if (typeof window === 'undefined') {
      console.warn('localStorage is not available')
      return
    }

    try {
      // 更新响应式值
      storedValue.value = val

      // 保存到 localStorage
      window.localStorage.setItem(key, JSON.stringify(val))

      // 触发自定义事件,通知其他标签页
      window.dispatchEvent(
        new CustomEvent('local-storage', {
          detail: { key, value: val }
        })
      )
    } catch (error) {
      // 处理 QuotaExceededError
      if (error instanceof Error && error.name === 'QuotaExceededError') {
        console.error('localStorage quota exceeded')
        // 可以在这里实现清理策略
      } else {
        console.warn(`Error setting localStorage key "${key}":`, error)
      }
    }
  }

  // 移除值
  const remove = () => {
    if (typeof window === 'undefined') {
      return
    }

    try {
      window.localStorage.removeItem(key)
      storedValue.value = defaultValue
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error)
    }
  }

  // 重新加载值
  const reload = () => {
    storedValue.value = readValue()
  }

  // 监听其他标签页的变化
  if (typeof window !== 'undefined') {
    // 标准 storage 事件(跨标签页)
    window.addEventListener('storage', (e: StorageEvent) => {
      if (e.key === key && e.newValue) {
        try {
          storedValue.value = JSON.parse(e.newValue) as T
        } catch (error) {
          console.warn(`Error parsing storage event for key "${key}":`, error)
        }
      } else if (e.key === key && e.newValue === null) {
        storedValue.value = defaultValue
      }
    })

    // 自定义事件(同一标签页)
    window.addEventListener('local-storage', ((e: CustomEvent) => {
      if (e.detail.key === key) {
        storedValue.value = e.detail.value
      }
    }) as EventListener)
  }

  return {
    value: storedValue,
    set,
    remove,
    reload
  }
}