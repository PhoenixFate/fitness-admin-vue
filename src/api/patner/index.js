import http from '../../utils/httpRequest'

const prefix = '/sys/partner'

export const apiPartnerList = (params) => {
  return http.get(`${prefix}/`, {params})
}

export const apiPartnerDetail = (id) => {
  return http.get(`${prefix}/${id}`)
}

export const apiPartnerSave = (params) => {
  return http.post(`${prefix}/`, params)
}

export const apiPartnerUpdate = (params) => {
  return http.put(`${prefix}/`, params)
}

export const apiPartnerDelete = (id) => {
  return http.delete(`${prefix}/${id}`)
}
