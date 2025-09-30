<template>
  <div class="request-history">
    <div class="history-header">
      <h3>请求历史</h3>
      <button
        v-if="history.length > 0"
        type="button"
        class="btn-clear"
        @click="handleClear"
      >
        清空历史
      </button>
    </div>

    <div v-if="history.length === 0" class="empty-state">
      暂无请求历史
    </div>

    <div v-else class="history-list">
      <div
        v-for="entry in displayedHistory"
        :key="entry.id"
        :class="['history-item', { success: entry.success, failed: !entry.success }]"
        @click="handleReplay(entry)"
      >
        <div class="history-item-header">
          <span class="api-name">{{ entry.apiName }}</span>
          <span :class="['status-badge', { success: entry.success, failed: !entry.success }]">
            {{ entry.success ? '成功' : '失败' }}
          </span>
        </div>

        <div class="history-item-body">
          <div class="timestamp">
            {{ formatTimestamp(entry.timestamp) }}
          </div>
          <div v-if="showDetails" class="parameters">
            参数: {{ formatParameters(entry.parameters) }}
          </div>
          <div v-if="entry.responseTime" class="response-time">
            耗时: {{ entry.responseTime }}ms
          </div>
        </div>

        <div v-if="showDetails" class="history-item-footer">
          <div class="summary">{{ entry.responseSummary }}</div>
          <button
            type="button"
            class="btn-remove"
            @click.stop="handleRemove(entry.id)"
          >
            删除
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRequestHistory } from '../composables'
import type { RequestHistoryEntry } from '../types'

const props = withDefaults(
  defineProps<{
    maxEntries?: number
    showDetails?: boolean
  }>(),
  {
    maxEntries: 10,
    showDetails: true
  }
)

const emit = defineEmits<{
  'replay-request': [entry: RequestHistoryEntry]
  'clear-history': []
}>()

const { history, clear, removeEntry } = useRequestHistory()

const displayedHistory = computed(() => {
  return history.value.slice(0, props.maxEntries)
})

const formatTimestamp = (timestamp: number): string => {
  const date = new Date(timestamp)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) {
    return '刚刚'
  } else if (diffMins < 60) {
    return `${diffMins}分钟前`
  } else if (diffHours < 24) {
    return `${diffHours}小时前`
  } else if (diffDays < 7) {
    return `${diffDays}天前`
  } else {
    return date.toLocaleDateString('zh-CN')
  }
}

const formatParameters = (params: Record<string, any>): string => {
  const entries = Object.entries(params)
  if (entries.length === 0) {
    return '无'
  }
  return entries
    .slice(0, 3)
    .map(([key, value]) => `${key}=${value}`)
    .join(', ')
}

const handleReplay = (entry: RequestHistoryEntry) => {
  emit('replay-request', entry)
}

const handleRemove = (id: string) => {
  removeEntry(id)
}

const handleClear = () => {
  if (confirm('确定要清空所有历史记录吗?')) {
    clear()
    emit('clear-history')
  }
}
</script>

<style scoped>
.request-history {
  padding: 1rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  margin-top: 1rem;
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.history-header h3 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
}

.btn-clear {
  padding: 0.25rem 0.75rem;
  font-size: 0.85rem;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  cursor: pointer;
  transition: opacity 0.2s;
}

.btn-clear:hover {
  opacity: 0.8;
}

.empty-state {
  text-align: center;
  padding: 2rem;
  color: var(--vp-c-text-2);
  font-size: 0.9rem;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.history-item {
  padding: 0.75rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.history-item:hover {
  background-color: var(--vp-c-bg-soft);
}

.history-item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.api-name {
  font-weight: 600;
  font-size: 0.9rem;
}

.status-badge {
  padding: 0.125rem 0.5rem;
  font-size: 0.75rem;
  border-radius: 12px;
}

.status-badge.success {
  background: var(--vp-c-success-soft);
  color: var(--vp-c-success);
}

.status-badge.failed {
  background: var(--vp-c-danger-soft);
  color: var(--vp-c-danger);
}

.history-item-body {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
}

.history-item-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5rem;
  padding-top: 0.5rem;
  border-top: 1px solid var(--vp-c-divider);
}

.summary {
  flex: 1;
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.btn-remove {
  padding: 0.125rem 0.5rem;
  font-size: 0.75rem;
  background: transparent;
  color: var(--vp-c-danger);
  border: 1px solid var(--vp-c-danger);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-remove:hover {
  background: var(--vp-c-danger);
  color: white;
}
</style>