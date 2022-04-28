/**
 * @description 把对象转换成FormData
 * @param {object} obj
 * @returns {FormData} formData
 */
export function object2form(obj) {
  const form = new FormData()
  Object.keys(obj).forEach((key) => {
    form.append(key, obj[key])
  })
  return form
}

/**
 * @description 把对象里面的下划线名称转成小驼峰
 * @param {object} obj
 * @returns {object} obj
 */
function underline2camel(obj) {
  if (typeof obj === 'object' && obj !== null) {
    const res = Array.isArray(obj) ? [] : {}
    for (const key in obj) {
      const resKey = key.replace(/_(\w)/g, (_, $1) => $1.toUpperCase())
      res[resKey] = underline2camel(obj[key])
    }
    return res
  }
  return obj
}

/**
 * 对原生方法封装，解析 json 字符串为对象
 */
export const jsonParse = (str: string, defaultVal = {}) => {
  try {
    if (typeof str === 'string') {
      if (str.length === 0) {
        return defaultVal
      }
      return JSON.parse(str) || defaultVal
    }
  } catch (error) {
    console.debug(error)
    return defaultVal
  }
  return str || defaultVal
}

/**
 * 对原生方法封装，解析 json 字符串为数组
 */
export const jsonParseArray = (str: string) => jsonParse(str, []) || []