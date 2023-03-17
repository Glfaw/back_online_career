import axios from "axios";

const request = axios.create({
  baseURL: '/api/back'
})

// 请求拦截器
// request.interceptors.request.use(
//   config => {
//     return config;
//   },
//   error => {
//     return Promise.reject(error)
//   }
// )

export default request