import request from '@/utils/request'

export const getCollResumeList = params => {
  return request({
    method: 'GET',
    url: '/collResume/pagination',
    params
  })
}

export const delCollResume = data => {
  return request({
    method: 'DELETE',
    url: '/collResume',
    data
  })
}