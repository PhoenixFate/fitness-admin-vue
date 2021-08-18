import http from '../../utils/httpRequest'

const prefix = '/sys/vipCard'

export const apiVipCardList = (params) => {
  return http.get(`${prefix}/`, {params})
}

export const apiVipCardDetail = (id) => {
  return http.get(`${prefix}/${id}`)
}

export const apiVipCardSave = (params) => {
  return http.post(`${prefix}/`, params)
}

export const apiVipCardUpdate = (params) => {
  return http.put(`${prefix}/`, params)
}

export const apiVipCardDelete = (id) => {
  return http.delete(`${prefix}/${id}`)
}
