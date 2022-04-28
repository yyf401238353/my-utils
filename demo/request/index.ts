
import axios from 'axios'
const DEFAULT_MSG = '请求失败，请稍后再试！'
const codeMessage = {
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  404: '请求的资源找不到',
  410: '请求的资源被永久删除，且不会再得到的。',
  401: '登录态丢失',
  422: '当创建一个对象时，发生一个验证错误。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。'
}
export interface BaseResponse<T = any> {
  code: number
  message?: string
  data?: T
}
export interface BaseResponsePromise<T = any> extends Promise<BaseResponse<T>> { }

export interface CodeMessage {
  [key: number]: string
}

// eslint-disable-next-line no-unused-vars
enum ResponseStatus {
  // eslint-disable-next-line no-unused-vars
  Cancel = 'Cancel'
}

const __DEV__ = true // 是否是开发环境
const API_ORIGIN = 'xxx'
const API_BASE = 'xxx'
export const baseURL = API_ORIGIN + API_BASE
// 用于取消发送请求
let source = axios.CancelToken.source()
export const isSuccess = (status: number) => status >= 200 && status < 300
function request<T = any>(
  url: string,
  options?: any
): BaseResponsePromise<T> {
  const baseOptions = typeof url === 'string' ? { url } : url
  const {
    url: urlOption,
    baseURL: baseURLOption,
    headers,
    needWarn = true,
    ...restOptions
  } = Object.assign({}, baseOptions, options)
  const _options: any = {
    url: (baseURLOption ?? baseURL) + urlOption,
    cancelToken: source.token,
    headers: {
      ...headers
    },
    // 发送接口时: request 拦截器
    beforeRequest(config) {
      return config
    },
    // 获取结果时：返回页面层数据拦截器
    beforeResponse(response) {

      // TODO: 1.处理特殊返回内容 2.处理200系列报错code相关内容 3.

      return response
    },
    // 返回数据异常结果时
    errorResponse(error) {
      try {
        if (error && error?.message === ResponseStatus.Cancel) return
      } catch (e) { }

      const status = error.response?.status
      let message = DEFAULT_MSG
      if (error?.response) {
        // TODO: 处理错误码
        message = codeMessage[error.response.status] || message
      }

      // TODO: 弹出错误信息

      if (__DEV__) {
        console.log(error, error.request || error.response)
      }
      return Promise.reject(error)
    },
    // 请求异常结果时
    errorRequest(error: any) {
      if (__DEV__) {
        console.log('errorRequest', error.request)
      }
      return Promise.reject(error)
    },
    validateStatus: isSuccess,
    ...restOptions
  }

  return axios(_options).then((res) => {
    // 自行处理返回结果 可以用data
    return res.data
  })
}

export default request
