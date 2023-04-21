import request from "@/utils/request";
/**
 * 文件上传模块
 */

/**
 * 上传头像
 * @param data
 * @returns {Promise<AxiosResponse<any>>}
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
 * @param data
 * @returns {Promise<AxiosResponse<any>>}
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
 * @returns {Promise<AxiosResponse<any>>}
 */
export const uploadExcelExport = () => {
  return request({
    method: 'GET',
    url: '/upload/excel/export',
    responseType: 'blob'
  })
}