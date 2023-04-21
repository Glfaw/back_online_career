import request from "@/utils/request";
/**
 * 菜单管理模块
 */

/**
 * 获取全部菜单
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getMenuList = () => {
  return request({
    method: 'GET',
    url: '/menu'
  })
}

/**
 * 获取搜索菜单
 * @param params
 * @returns {Promise<AxiosResponse<any>>}
 */
export const searchMenu = params => {
  return request({
    method: 'GET',
    url: '/menu',
    params
  })
}

/**
 * 获取全部图标，类型为icon
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getDictIcon = () => {
  return request({
    method: 'GET',
    url: '/menu/icon'
  })
}

/**
 * 修改菜单
 * @param data
 * @returns {Promise<AxiosResponse<any>>}
 */
export const updateMenu = data => {
  return request({
    method: 'PUT',
    url: '/menu',
    data
  })
}

/**
 * 添加菜单
 * @param data
 * @returns {Promise<AxiosResponse<any>>}
 */
export const addMenu = data => {
  return request({
    method: 'POST',
    url: '/menu',
    data
  })
}

/**
 * 删除菜单
 * @param id
 * @returns {Promise<AxiosResponse<any>>}
 */
export const deleteMenu = id => {
  return request({
    method: 'DELETE',
    url: `/menu/${id}`,
  })
}