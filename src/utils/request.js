import axios from 'axios'
import store from '@/store'
import Qs from 'qs'

// 重定向到登录页后重置用户信息
const redirect = () => {
  store.dispatch('user/resetToken').then(() => {
    // 调用退出接口
  })
}

// 创建axios实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // 基路径
  withCredentials: true, // 跨域请求时发送Cookie
  timeout: 5000 // 请求超时时间
})

// request 拦截
service.interceptors.request.use(
  config => {
    if (config.method === 'get') {
      config.data = { unused: 0 } // 解决get请求添加不上Content-Type
    }
    if (config.method === 'post') {
      if (config.isFormData) {
        // 表单提交
        config.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset-utf-8'
        config.data = Qs.stringify(config.data)
      }
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// response 拦截
service.interceptors.response.use(
  response => {
    console.log(response)
    if (response.status && response.status === 200) {
      // 后台接口重定向 重定向到登录页
      if (/login\/index.do/.test(response.request.responseURL)) {
        redirect()
      }
      return Promise.resolve(response.data)
    } else {
      redirect()
      return Promise.reject(new Error(response.data || 'Error'))
    }
  },
  error => {
    redirect()
    return Promise.reject(error)
  }
)

export default service
