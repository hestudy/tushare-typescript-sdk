<template>
  <div class="token-manager">
    <div class="token-input-group">
      <label for="token-input">API Token</label>
      <div class="input-wrapper">
        <input
          id="token-input"
          v-model="tokenInput"
          :type="showToken ? 'text' : 'password'"
          placeholder="请输入您的 Tushare API Token"
          class="token-input"
        />
        <button
          type="button"
          class="toggle-visibility"
          @click="showToken = !showToken"
        >
          {{ showToken ? '隐藏' : '显示' }}
        </button>
      </div>
    </div>

    <div class="button-group">
      <button
        type="button"
        class="btn-primary"
        :disabled="!tokenInput.trim()"
        @click="saveToken"
      >
        保存
      </button>
      <button
        type="button"
        class="btn-secondary"
        :disabled="!hasToken"
        @click="clearToken"
      >
        清除
      </button>
    </div>

    <div v-if="message" :class="['message', messageType]">
      {{ message }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useSdkClient } from '../composables'

const props = defineProps<{
  initialToken?: string
  showValidation?: boolean
}>()

const emit = defineEmits<{
  'token-updated': [token: string]
  'token-cleared': []
  'validation-complete': [result: any]
}>()

const { setToken, clearToken: clearSdkToken, isReady } = useSdkClient()

const tokenInput = ref('')
const showToken = ref(false)
const message = ref('')
const messageType = ref<'success' | 'error'>('success')

const hasToken = computed(() => isReady.value)

onMounted(() => {
  if (props.initialToken) {
    tokenInput.value = props.initialToken
  }
})

const saveToken = () => {
  const token = tokenInput.value.trim()
  if (!token) {
    return
  }

  try {
    setToken(token)
    message.value = 'Token 已保存'
    messageType.value = 'success'
    emit('token-updated', token)

    // 清除消息
    setTimeout(() => {
      message.value = ''
    }, 3000)
  } catch (error) {
    message.value = '保存失败,请重试'
    messageType.value = 'error'
  }
}

const clearToken = () => {
  if (confirm('确定要清除 Token 吗?')) {
    clearSdkToken()
    tokenInput.value = ''
    message.value = 'Token 已清除'
    messageType.value = 'success'
    emit('token-cleared')

    setTimeout(() => {
      message.value = ''
    }, 3000)
  }
}
</script>

<style scoped>
.token-manager {
  padding: 1rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  margin-bottom: 1rem;
}

.token-input-group {
  margin-bottom: 1rem;
}

.token-input-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  font-size: 0.9rem;
}

.input-wrapper {
  display: flex;
  gap: 0.5rem;
}

.token-input {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  font-size: 0.9rem;
}

.toggle-visibility {
  padding: 0.5rem 1rem;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85rem;
}

.button-group {
  display: flex;
  gap: 0.5rem;
}

.btn-primary,
.btn-secondary {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: opacity 0.2s;
}

.btn-primary {
  background: var(--vp-c-brand);
  color: white;
}

.btn-secondary {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
}

.btn-primary:hover:not(:disabled),
.btn-secondary:hover:not(:disabled) {
  opacity: 0.8;
}

.btn-primary:disabled,
.btn-secondary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.message {
  margin-top: 0.5rem;
  padding: 0.5rem;
  border-radius: 4px;
  font-size: 0.85rem;
}

.message.success {
  background: var(--vp-c-success-soft);
  color: var(--vp-c-success);
}

.message.error {
  background: var(--vp-c-danger-soft);
  color: var(--vp-c-danger);
}
</style>