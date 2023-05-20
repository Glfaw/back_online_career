import request from '@/utils/request'

export const getAllFirm = () => {
  return request({
    method: 'GET',
    url: '/firm'
  })
}

export const getPagination = (params, data) => {
  return request({
    method: 'POST',
    url: '/firm/pagination',
    params,
    data
  })
}

export const addFirm = data => {
  return request({
    method: 'POST',
    url: '/firm',
    data
  })
}

export const updateFirm = data => {
  return request({
    method: 'PUT',
    url: '/firm',
    data
  })
}

export const deleteFirm = id => {
  return request({
    method: 'DELETE',
    url: `/firm/${id}`
  })
}

export const deleteFirmList = data => {
  return request({
    method: 'DELETE',
    url: '/firm',
    data
  })
}