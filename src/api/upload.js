import request from "@/utils/request";
/**
 * 文件上传模块
 */

/**
 * 上传头像
 * @param data
 * @returns {Promise<AxiosResponse<any>>}
 */
export const uploadUserAvatar = data => {
  return request({
    method: 'POST',
    url: '/upload/user/avatar',
    data
  })
}

/**
 * 企业管理上传图像
 * @param data
 * @returns {Promise<AxiosResponse<any>>}
 */
export const uploadFirmLogo = data => {
  return request({
    method: 'POST',
    url: '/upload/firm/logo',
    data
  })
}

/**
 * 导入excel
 * @param data
 * @returns {Promise<AxiosResponse<any>>}
 */
export const impUser = data => {
  return request({
    method: 'POST',
    url: '/upload/user/imp',
    data
  })
}

/**
 * 导出excel
 * @returns {Promise<AxiosResponse<any>>}
 */
export const expUser = () => {
  return request({
    method: 'GET',
    url: '/upload/user/exp',
    responseType: 'blob'
  })
}

export const impFirm = data => {
  return request({
    method: 'POST',
    url: '/upload/firm/imp',
    data
  })
}

export const expFirm = () => {
  return request({
    method: 'GET',
    url: '/upload/firm/exp',
    responseType: 'blob'
  })
}

export const markdownFirm = data => {
  return request({
    method: 'POST',
    url: '/upload/firm/markdown',
    data
  })
}

export const markdownCareer = data => {
  return request({
    method: 'POST',
    url: '/upload/career/markdown',
    data
  })
}