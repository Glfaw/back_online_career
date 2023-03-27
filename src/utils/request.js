import axios from "axios";
import store from "@/store";

const request = axios.create({
  baseURL: '/api/back',
  timeout: 5000
})

// 请求拦截器
request.interceptors.request.use(
  config => {
    const { user } = store.state;
    config.headers['Content-Type'] = 'application/json;charset=utf-8';
    // 携带token
    // if(user && user.token)
    //   config.headers['Authorization'] = `Bearer ${user.token}`
    return config;
  },
  error => Promise.reject(error)
)

// 相应拦截器
request.interceptors.response.use(
  response => {
    let res = response.data;
    if(response.config.responseType === 'blob') return res;
    if(typeof res === 'string') {
      res = res? JSON.parse(res): res
    }
    return res
  },
  error => Promise.reject(error)
)

export default request