import request from "@/utils/request";
/**
 * 菜单管理模块
 */


export const getMenuList = () => {
  return request({
    method: 'GET',
    url: '/menu'
  })
}