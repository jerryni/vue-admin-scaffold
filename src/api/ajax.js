import axios from 'axios'
import { Message } from 'element-ui'

axios.defaults.timeout = 50000
// axios.defaults.headers = {'X-Requested-With': 'XMLHttpRequest'}

// http request 拦截器
axios.interceptors.request.use(
  config => {
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

const STATUS_TIPS_TEXT_MAP = {
  500: '服务器错误，请联系管理员',
  504: '请求超时'
}
// http response 拦截器
axios.interceptors.response.use(
  response => {
    let {data} = response
    let {retCode, retDesc} = data

    if (retCode !== 200) {
      retDesc && Message.error(retDesc)
      return Promise.reject({
        code: retCode || '',
        message: retDesc || ''
      })
    }

    return data.data || {}
  },
  error => {
    if (error.response) {
      let status = error.response.status
      Message.error(STATUS_TIPS_TEXT_MAP[status] || '请求失败')
    }
    return Promise.reject(error)
  }
)

export default axios
