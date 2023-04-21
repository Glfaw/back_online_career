import request from "@/utils/request";

/**
 * 角色管理模块
 */

/**
 * 获取角色菜单
 * @param roleId
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getRoleMenu = roleId => {
  return request({
    method: 'GET',
    url: `/role/${roleId}`
  })
}

/**
 * 分配角色菜单
 * @param roleId
 * @param data
 * @returns {Promise<AxiosResponse<any>>}
 */
export const divideRoleMenu = (roleId, data) => {
  return request({
    method: 'POST',
    url: `/role/divide/${roleId}`,
    data
  })
}

/**
 * 获取所有角色
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getAllRoles = () => {
  return request({
    method: 'GET',
    url: '/role'
  })
}

/**
 * 获取搜索角色
 * @param params
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getSearchRoles = params => {
  return request({
    method: 'GET',
    url: '/role',
    params
  })
}

/**
 * 添加角色
 * @param data
 * @returns {Promise<AxiosResponse<any>>}
 */
export const addRole = data => {
  return request({
    method: 'POST',
    url: '/role',
    data
  })
}

/**
 * 修改角色
 * @param data
 * @returns {Promise<AxiosResponse<any>>}
 */
export const updateRole = data => {
  return request({
    method: 'PUT',
    url: '/role',
    data
  })
}

/**
 * 删除角色
 * @param id
 * @returns {Promise<AxiosResponse<any>>}
 */
export const deleteRole = id => {
  return request({
    method: 'DELETE',
    url: `/role/${id}`,
  })
}