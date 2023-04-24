import request from "@/utils/request"

/**
 * 账户权限模块
 */

/**
 * 用户登录
 * @param data
 * @returns {Promise<AxiosResponse<any>>}
 */
export const login = data => {
  return request({
    method: 'POST',
    url: '/user/login',
    data
  })
}

/**
 * 获取登录用户的菜单信息
 * @param roleId
 * @returns {Promise<AxiosResponse<any>>}
 */
export const loadRouteMenu = ({roleId}) => {
  return request({
    method: 'GET',
    url: `/user/menu/${roleId}`
  })
}


/**
 * 获取个人信息
 * @param id
 * @returns {Promise<AxiosResponse<any>>}
 */
export const loadPersonal = id => {
  return request({
    method: 'GET',
    url: `/user/${id}`
  })
}

/**
 * 更改个人信息
 * @param data
 * @returns {Promise<AxiosResponse<any>>}
 */
export const refreshPersonal = data => {
  return request({
    method: 'PUT',
    url: '/user/person',
    data
  })
}

