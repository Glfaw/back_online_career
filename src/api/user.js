import request from "@/utils/request";

/**
 * 用户模块 /user
 */

// 用户登录
export const login = data => {
  return request({
    method: 'POST',
    url: '/user/login',
    data
  })
}

// 用户分页搜索
export const getPagination = params => {
  return request({
    method: 'GET',
    url: '/user/pagination',
    params
  })
}

// 获取角色表
export const getRoleList = () => {
  return request({
    method: 'GET',
    url: '/user/roleList'
  })
}

// 获取所有公司列表
export const getFirmList = () => {
  return request({
    method: 'GET',
    url: '/user/firmList'
  })
}

// 用户添加
export const addUser = data => {
  return request({
    method: 'POST',
    url: '/user',
    data
  })
}

// 导出所有用户信息
export const exportByExcel = 'http://localhost:9090/back/user/export'

// 根据id删除
export const deleteUserByID = id => {
  return request({
    method: 'DELETE',
    url: `/user/${id}`
  })
}

// 用户批量删除
export const deleteUserBySelect = data => {
  return request({
    method: 'DELETE',
    url: '/user',
    data
  })
}

// 用户更改
export const updateUser = data => {
  return request({
    method: 'PUT',
    url: '/user',
    data
  })
}