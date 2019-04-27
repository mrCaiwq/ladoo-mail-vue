import axios from 'axios'
import store from '@/store'
import { getToken } from '@/libs/util'
import { LoadingBar, Message } from 'iview'

const addErrorLog = errorInfo => {
  const {
    statusText,
    status,
    request: { responseURL }
  } = errorInfo
  let info = {
    type: 'ajax',
    code: status,
    mes: statusText,
    url: responseURL
  }
  if (!responseURL.includes('save_error_logger')) { store.dispatch('addErrorLog', info) }
}

class HttpRequest {
  constructor (baseUrl = baseURL) {
    this.baseUrl = baseUrl
    this.queue = {}
  }
  getInsideConfig () {
    const config = {
      baseURL: this.baseUrl,
      headers: {
        //
      }
    }
    return config
  }
  destroy (url) {
    delete this.queue[url]
    if (!Object.keys(this.queue).length) {
      // Spin.hide()
    }
  }
  interceptors (instance, url) {
    // 请求拦截
    instance.interceptors.request.use(
      config => {
        // 添加全局的loading...
        if (!Object.keys(this.queue).length) {
          // Spin.show() // 不建议开启，因为界面不友好
          LoadingBar.start()
        }
        const token = getToken()
        config.headers.Authorization = token

        this.queue[url] = true
        return config
      },
      error => {
        return Promise.reject(error)
      }
    )
    // 响应拦截
    instance.interceptors.response.use(
      res => {
        console.log('%c 接口请求', 'color: #4CAF50; font-weight: bold', res)
        this.destroy(url)
        const { data, status } = res
        if (res.data && (res.data.code > 400 || res.data.meta.code !== 0)) {
          Message.error(res.data.meta.msg)
          LoadingBar.error()
          return Promise.reject(new Error(res.data.meta))
        }
        LoadingBar.finish()
        return { data, status }
      },
      error => {
        LoadingBar.error()
        Message.error('请求失败')
        console.log('api resquest fail:', error)
        this.destroy(url)
        let errorInfo = error.response
        if (!errorInfo) {
          const {
            request: { statusText, status },
            config
          } = JSON.parse(JSON.stringify(error))
          errorInfo = {
            statusText,
            status,
            request: { responseURL: config.url }
          }
        }
        addErrorLog(errorInfo)
        return Promise.reject(error)
      }
    )
  }
  request (options) {
    const instance = axios.create()
    options = Object.assign(this.getInsideConfig(), options)
    this.interceptors(instance, options.url)
    return instance(options)
  }
}
export default HttpRequest
