import request from "@/utils/request"
import axios from 'axios'
/**
 * 用户管理模块
 */

const beauty = axios.create({
  baseURL: '/beauty',
})

export const getBeautyArr = () => {
  return beauty({
    method: 'GET',
    params: {
      db: 'json'
    }
  })
}


/**
 * 分页搜索
 * @param params
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getPagination = params => {
  return request({
    method: 'GET',
    url: '/user/pagination',
    params
  })
}

/**
 * 添加用户
 * @param data
 * @returns {Promise<AxiosResponse<any>>}
 */
export const addUser = data => {
  return request({
    method: 'POST',
    url: '/user',
    data
  })
}

/**
 * 根据id删除用户
 * @param id
 * @returns {Promise<AxiosResponse<any>>}
 */
export const deleteUserByID = id => {
  return request({
    method: 'DELETE',
    url: `/user/${id}`
  })
}

/**
 * 用户批量删除
 * @param data
 * @returns {Promise<AxiosResponse<any>>}
 */
export const deleteUserBySelect = data => {
  return request({
    method: 'DELETE',
    url: '/user',
    data
  })
}

/**
 * 更改用户信息
 * @param data
 * @returns {Promise<AxiosResponse<any>>}
 */
export const updateUser = data => {
  return request({
    method: 'PUT',
    url: '/user',
    data
  })
}

export const updatePwd = data => {
  return request({
    method: 'POST',
    url: '/user/pwd',
    data
  })
}
