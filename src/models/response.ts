import { TushareResponse, TushareRawResponse } from '../types/api'

/**
 * 将原始响应数据 {fields, items} 转换为结构化对象数组
 */
export function transformResponse<T>(raw: TushareRawResponse): TushareResponse<T> {
  const { code, msg, data } = raw

  // 如果请求失败,返回失败响应
  if (code !== 0 || !data) {
    return {
      code,
      msg,
      raw: null,
      data: null,
      success: false
    }
  }

  // 转换 items 为对象数组
  const { fields, items } = data
  const transformedData: T[] = items.map((item) => {
    const obj: Record<string, unknown> = {}
    fields.forEach((field, index) => {
      obj[field] = item[index]
    })
    return obj as T
  })

  return {
    code,
    msg,
    raw: { fields, items },
    data: transformedData,
    success: true
  }
}