import request from "@/utils/request"
/**
 * 用户模块
 */

/**
 * 用户登录
 * @param {*} data Map{account, password}
 * @returns 
 */
export const login = data => {
  return request({
    method: 'POST',
    url: '/user/login',
    data
  })
}

/**
 * 用户分页搜索
 * @param {*} params Query{name, address, phone}
 * @returns 
 */
export const getPagination = params => {
  return request({
    method: 'GET',
    url: '/user/pagination',
    params
  })
}

/**
 * 获取角色表
 * @returns Array[...]
 */
export const getRoleList = () => {
  return request({
    method: 'GET',
    url: '/user/roleList'
  })
}

/**
 * 获取所有公司列表
 * @returns Array[...]
 */
export const getFirmList = () => {
  return request({
    method: 'GET',
    url: '/user/firmList'
  })
}

/**
 * 用户添加
 * @param {*} data User{...}
 * @returns 
 */
export const addUser = data => {
  return request({
    method: 'POST',
    url: '/user',
    data
  })
}

/**
 * 根据id删除
 * @param {*} id UID
 * @returns 
 */
export const deleteUserByID = id => {
  return request({
    method: 'DELETE',
    url: `/user/${id}`
  })
}

/**
 * 用户批量删除
 * @param {*} data Array[...]
 * @returns 
 */
export const deleteUserBySelect = data => {
  return request({
    method: 'DELETE',
    url: '/user',
    data
  })
}

/**
 * 用户更改
 * @param {*} data User{...}
 * @returns 
 */
export const updateUser = data => {
  return request({
    method: 'PUT',
    url: '/user',
    data
  })
}

/**
 * 获取个人信息
 * @param {*} id UID
 * @returns 
 */
export const loadPersonal = id => {
  return request({
    method: 'GET',
    url: `/user/${id}`
  })
}

/**
 * 更改个人信息
 * @param {*} data User{...}
 * @returns 
 */
export const refreshPersonal = data => {
  return request({
    method: 'PUT',
    url: '/user/person',
    data
  })
}