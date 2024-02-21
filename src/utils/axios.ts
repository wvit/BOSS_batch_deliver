import { message } from 'antd'
import Axios from 'axios'

const axios = Axios.create({
  baseURL: 'https://www.zhipin.com',
})

axios.interceptors.response.use(res => {
  const { data, status } = res

  if (status !== 200) message.error('请求失败')

  return data
})

export { axios }
