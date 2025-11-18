import { createAlova } from 'alova'
import { axiosRequestAdapter } from '@alova/adapter-axios'
import { createAlovaMockAdapter } from '@alova/mock'
import mockNews from '../mock/news'
import statesHook from 'alova/vue'

const mockAdapter = createAlovaMockAdapter([mockNews], {
  // 全局控制是否启用mock接口，默认为true
  enable: true,
  // 非模拟请求适配器，用于未匹配mock接口时发送请求
  httpAdapter: axiosRequestAdapter(),
  // 是否打印mock接口请求信息
  mockRequestLogger: true,
  onMockResponse: (data) => {
    return {
      response: {
        status: 200,
        data: {
          code: 0,
          data: data.body,
          success: true,
        },
      },
      headers: data.responseHeaders,
    } as any
  },
})

/**
 * 获取API基础URL
 * 开发和生产环境都使用相对路径 /api/
 * 由Nitro服务器通过devProxy(开发)和routeRules(生产)代理处理
 */
function getApiBaseURL() {
  return '/api/'
}

const Http = createAlova({
  baseURL: getApiBaseURL(),
  timeout: 30 * 1000,
  statesHook,
  cacheFor: null,
  requestAdapter: mockAdapter,
  responded: {
    onSuccess: async (response) => {
      if (response.status === 200) {
        return response.data
      }
      else {
        const status = {
          400: `${response.status} 请求出现语法错误`,
          401: `${response.status} 用户未授权`,
          403: `${response.status} 服务器拒绝访问`,
          404: `${response.status} 请求的资源不存在`,
          405: `${response.status} 请求方法未允许`,
          408: `${response.status} 网络请求超时`,
          500: `${response.status} 服务器内部错误`,
          501: `${response.status} 服务器未实现请求功能`,
          502: `${response.status} 错误网关`,
          503: `${response.status} 服务不可用`,
          504: `${response.status} 网关超时`,
          505: `${response.status} http版本不支持该请求`,
          default: `${response.status} 请求错误`,
        } as any
        // ElMessage.error(status[response.status] || status.default)
        throw new Error(status[response.status] || status.default)
      }
    },
    onError: (error, method) => {
      const message = `[${method.type}] - [${method.url}] - ${error.message}`
      // ElMessage.error(message)
      throw new Error(message)
    },
  },
})

export { Http }
