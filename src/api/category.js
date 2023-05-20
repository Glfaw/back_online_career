import request from '@/utils/request'

export const getFirmTypeTree = () => {
  return request({
    method: 'GET',
    url: '/category/firm/tree'
  })
}

export const getFirmType = params => {
  return request({
    method: 'GET',
    url: '/category/firm',
    params
  })
}

export const updateFirmType = data => {
  return request({
    method: 'PUT',
    url: '/category/firm',
    data
  })
}

export const addFirmType = data => {
  return request({
    method: 'POST',
    url: '/category/firm',
    data
  })
}

export const delFirmTypeById = id => {
  return request({
    method: 'DELETE',
    url: `/category/firm/${id}`
  })
}

export const delFirmTypeList = data => {
  return request({
    method: 'DELETE',
    url: '/category/firm',
    data
  })
}

export const getCareerTypeTree = () => {
  return request({
    method: 'GET',
    url: '/category/career/tree',
  })
}

export const getCareerType = params => {
  return request({
    method: 'GET',
    url: '/category/career',
    params
  })
}

export const updateCareerType = data => {
  return request({
    method: 'PUT',
    url: '/category/career',
    data
  })
}

export const addCareerType = data => {
  return request({
    method: 'POST',
    url: '/category/career',
    data
  })
}

export const delCareerTypeById = id => {
  return request({
    method: 'DELETE',
    url: `/category/career/${id}`
  })
}

export const delCareerTypeList = data => {
  return request({
    method: 'DELETE',
    url: '/category/career',
    data
  })
}