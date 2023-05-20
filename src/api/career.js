import request from '@/utils/request'

export const getCareerList = (params, data) => {
  return request({
    method: 'POST',
    url: '/career/pagination',
    params,
    data
  })
}

export const addCareer = data => {
  return request({
    method: 'POST',
    url: '/career',
    data
  })
}

export const updateCareer = data => {
  return request({
    method: 'PUT',
    url: '/career',
    data
  })
}

export const delCareerById = id => {
  return request({
    method: 'DELETE',
    url: `/career/${id}`,
  })
}

export const delCareerList = data => {
  return request({
    method: 'DELETE',
    url: '/career',
    data
  })
}