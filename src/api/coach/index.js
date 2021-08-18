import http from '../../utils/httpRequest'

const prefix = '/sys/coach'

export const apiCoachList = (params) => {
  return http.get(`${prefix}/`, {params})
}

export const apiCoachDetail = (id) => {
  return http.get(`${prefix}/${id}`)
}

export const apiCoachSave = (params) => {
  return http.post(`${prefix}/`, params)
}

export const apiCoachUpdate = (params) => {
  return http.put(`${prefix}/`, params)
}

export const apiCoachDelete = (id) => {
  return http.delete(`${prefix}/${id}`)
}
