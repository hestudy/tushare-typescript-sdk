/**
 * useRequestHistory Composable
 *
 * 管理 API 请求历史记录
 */

import { computed, type Ref } from 'vue'
import { useLocalStorage } from './useLocalStorage'
import type { RequestHistoryEntry, RequestHistory } from '../types'
import { STORAGE_KEYS } from '../types'

const MAX_HISTORY_ENTRIES = 50

export interface UseRequestHistoryReturn {
  /** 历史记录列表(响应式) */
  history: Ref<RequestHistory>

  /** 添加记录 */
  addEntry: (entry: Omit<RequestHistoryEntry, 'id' | 'timestamp'>) => void

  /** 清空历史 */
  clear: () => void

  /** 删除单条记录 */
  removeEntry: (id: string) => void

  /** 获取指定 API 的历史 */
  getByApiName: (apiName: string) => RequestHistoryEntry[]
}

/**
 * 生成 UUID
 */
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

/**
 * 使用请求历史记录的 composable
 *
 * @returns 历史记录管理方法
 */
export function useRequestHistory(): UseRequestHistoryReturn {
  const { value: history, set: setHistory } = useLocalStorage<RequestHistory>(
    STORAGE_KEYS.HISTORY,
    []
  )

  /**
   * 添加历史记录
   */
  const addEntry = (
    entry: Omit<RequestHistoryEntry, 'id' | 'timestamp'>
  ): void => {
    const newEntry: RequestHistoryEntry = {
      ...entry,
      id: generateUUID(),
      timestamp: Date.now()
    }

    // 添加到历史记录开头(最新的在前)
    const updatedHistory = [newEntry, ...history.value]

    // 限制最大记录数
    if (updatedHistory.length > MAX_HISTORY_ENTRIES) {
      updatedHistory.splice(MAX_HISTORY_ENTRIES)
    }

    setHistory(updatedHistory)
  }

  /**
   * 清空历史记录
   */
  const clear = (): void => {
    setHistory([])
  }

  /**
   * 删除单条记录
   */
  const removeEntry = (id: string): void => {
    const updatedHistory = history.value.filter((entry) => entry.id !== id)
    setHistory(updatedHistory)
  }

  /**
   * 获取指定 API 的历史记录
   */
  const getByApiName = (apiName: string): RequestHistoryEntry[] => {
    return history.value.filter((entry) => entry.apiName === apiName)
  }

  return {
    history,
    addEntry,
    clear,
    removeEntry,
    getByApiName
  }
}