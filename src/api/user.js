import request from "@/utils/request";

/**
 * 用户模块
 */

// 用户登录
export const login = data => {
  return request({
    method: 'POST',
    url: '/user/login',
    data
  })
}

// 用户管理搜索
export const getSearchPagination = params => {
  return request({
    method: 'GET',
    url: '/user/pagination',
    params
  })
}

// 获取所有用户信息
export const getAllUser = () => {
  return request({
    method: 'GET',
    url: '/user'
  })
}

// 获取角色表
export const getRoleList = () => {
  return request({
    method: 'GET',
    url: '/user/roleList'
  })
}