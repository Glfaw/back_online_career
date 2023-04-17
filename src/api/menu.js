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