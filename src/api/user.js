import request from "@/utils/request"
/**
 * 用户管理模块
 */

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
 * 获取所有公司列表
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getFirmList = () => {
  return request({
    method: 'GET',
    url: '/user/firmList'
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
