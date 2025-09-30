<template>
  <div class="api-tester">
    <h3>测试接口</h3>

    <form @submit.prevent="handleSubmit">
      <div v-for="param in apiSpec.parameters" :key="param.name" class="form-group">
        <label :for="`param-${param.name}`">
          {{ param.name }}
          <span v-if="param.required" class="required">*</span>
        </label>
        <input
          :id="`param-${param.name}`"
          v-model="formData[param.name]"
          :type="getInputType(param.type)"
          :placeholder="param.example || param.description"
          :required="param.required"
          class="form-input"
        />
        <div class="param-description">{{ param.description }}</div>
      </div>

      <button
        type="submit"
        class="btn-submit"
        :disabled="isLoading || !isClientReady"
      >
        {{ isLoading ? '请求中...' : '发送请求' }}
      </button>
    </form>

    <div v-if="!isClientReady" class="warning">
      ⚠️ 请先配置 API Token
    </div>

    <div v-if="validationErrors.length > 0" class="error-messages">
      <div v-for="(error, index) in validationErrors" :key="index" class="error-message">
        {{ error }}
      </div>
    </div>

    <div v-if="testResult" class="test-result">
      <div class="result-header">
        <h4>测试结果</h4>
        <div class="result-meta">
          <span class="status-code" :class="{ success: testResult.statusCode === 200 }">
            状态码: {{ testResult.statusCode }}
          </span>
          <span class="response-time">
            响应时间: {{ testResult.responseTime }}ms
          </span>
        </div>
      </div>

      <div v-if="testResult.error" class="error-result">
        <strong>错误:</strong> {{ testResult.error.message }}
      </div>

      <div v-else class="success-result">
        <pre class="result-json">{{ formatJson(testResult.data) }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useSdkClient, useRequestHistory } from '../composables'
import type { ApiDocEntry, TestResult } from '../types'

const props = defineProps<{
  apiName: string
  apiSpec: ApiDocEntry
}>()

const emit = defineEmits<{
  'test-start': []
  'test-complete': [result: TestResult]
  'test-error': [error: any]
}>()

const { callApi, isReady: isClientReady } = useSdkClient()
const { addEntry } = useRequestHistory()

const formData = reactive<Record<string, any>>({})
const isLoading = ref(false)
const testResult = ref<TestResult | null>(null)
const validationErrors = ref<string[]>([])

const getInputType = (paramType: string): string => {
  if (paramType.includes('number')) {
    return 'number'
  }
  return 'text'
}

const validateForm = (): boolean => {
  validationErrors.value = []

  for (const param of props.apiSpec.parameters) {
    if (param.required && !formData[param.name]) {
      validationErrors.value.push(`${param.name} 是必填参数`)
    }
  }

  return validationErrors.value.length === 0
}

const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }

  if (!isClientReady.value) {
    validationErrors.value = ['请先配置 API Token']
    return
  }

  isLoading.value = true
  testResult.value = null
  validationErrors.value = []

  emit('test-start')

  try {
    const result = await callApi(props.apiName, formData)
    testResult.value = result

    // 添加到历史记录
    addEntry({
      apiName: props.apiName,
      parameters: { ...formData },
      success: !result.error,
      responseSummary: result.error
        ? result.error.message
        : `返回 ${Array.isArray(result.data) ? result.data.length : 1} 条数据`,
      responseTime: result.responseTime,
      statusCode: result.statusCode
    })

    if (result.error) {
      emit('test-error', result.error)
    } else {
      emit('test-complete', result)
    }
  } catch (error: any) {
    validationErrors.value = [error.message || '请求失败']
    emit('test-error', error)
  } finally {
    isLoading.value = false
  }
}

const formatJson = (data: any): string => {
  try {
    return JSON.stringify(data, null, 2)
  } catch {
    return String(data)
  }
}
</script>

<style scoped>
.api-tester {
  padding: 1.5rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  margin-top: 2rem;
}

.api-tester h3 {
  margin: 0 0 1rem 0;
  font-size: 1.1rem;
  font-weight: 600;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.25rem;
  font-weight: 500;
  font-size: 0.9rem;
}

.required {
  color: var(--vp-c-danger);
}

.form-input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  font-size: 0.9rem;
  box-sizing: border-box;
}

.param-description {
  margin-top: 0.25rem;
  font-size: 0.8rem;
  color: var(--vp-c-text-2);
}

.btn-submit {
  width: 100%;
  padding: 0.75rem;
  background: var(--vp-c-brand);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: opacity 0.2s;
}

.btn-submit:hover:not(:disabled) {
  opacity: 0.9;
}

.btn-submit:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.warning {
  margin-top: 1rem;
  padding: 0.75rem;
  background: var(--vp-c-warning-soft);
  color: var(--vp-c-warning);
  border-radius: 4px;
  font-size: 0.9rem;
}

.error-messages {
  margin-top: 1rem;
}

.error-message {
  padding: 0.5rem;
  background: var(--vp-c-danger-soft);
  color: var(--vp-c-danger);
  border-radius: 4px;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.test-result {
  margin-top: 1.5rem;
  padding: 1rem;
  background: var(--vp-c-bg-soft);
  border-radius: 4px;
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--vp-c-divider);
}

.result-header h4 {
  margin: 0;
  font-size: 1rem;
}

.result-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.85rem;
}

.status-code {
  padding: 0.25rem 0.5rem;
  background: var(--vp-c-danger-soft);
  color: var(--vp-c-danger);
  border-radius: 4px;
}

.status-code.success {
  background: var(--vp-c-success-soft);
  color: var(--vp-c-success);
}

.response-time {
  color: var(--vp-c-text-2);
}

.error-result {
  padding: 0.75rem;
  background: var(--vp-c-danger-soft);
  color: var(--vp-c-danger);
  border-radius: 4px;
  font-size: 0.9rem;
}

.success-result {
  max-height: 400px;
  overflow: auto;
}

.result-json {
  margin: 0;
  padding: 1rem;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  font-size: 0.85rem;
  overflow-x: auto;
}
</style>