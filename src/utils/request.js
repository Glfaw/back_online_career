import axios from "axios";
import store from "@/store";
import router from "@/router";
import { ShowNotify } from "@/utils/common";

const request = axios.create({
  baseURL: '/api/back',
})

// 请求拦截器
request.interceptors.request.use(
  config => {
    config.headers['Content-Type'] = config.url.includes('/upload/')
      ? 'mutipart/form-data;charset=utf-8'
      : 'application/json;charset=utf-8'

    const { user } = store.state;
    // // 携带token
    if(user && user.token)
      config.headers['Authorization'] = `${user.token}`
      
    return config;
  },
  error => Promise.reject(error)
)

// 响应拦截器
request.interceptors.response.use(
  response => {
    if(response.config.responseType === 'blob') return response;
    let res = response.data;
    if(res.code === 401) {
      ShowNotify({
        type: 'error',
        title: '访问失败',
        message: `${res.msg}`
      })
      router.replace('/login')
    }
    if(typeof res === 'string') {
      res = res? JSON.parse(res): res
    }
    return res
  },
  error => Promise.reject(error)
)

export default request