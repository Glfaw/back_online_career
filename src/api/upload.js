import request from "@/utils/request";
/**
 * 文件上传模块
 */

/**
 * 上传头像
 * @param {new FormData()} data 
 * @returns 
 */
export const uploadAvatar = data => {
  return request({
    method: 'POST',
    url: '/upload/avatar',
    data
  })
}

/**
 * 导入excel
 * @param {new FormData()} data 
 * @returns 
 */
export const uploadExcelImport = data => {
  return request({
    method: 'POST',
    url: '/upload/excel/import',
    data
  })
}

/**
 * 导出excel
 * @returns file
 */
export const uploadExcelExport = () => {
  return request({
    method: 'GET',
    url: '/upload/excel/export',
    responseType: 'blob'
  })
}