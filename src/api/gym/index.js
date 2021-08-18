import http from '../../utils/httpRequest'

const prefix = '/sys/gym'

export const apiGymList = (params) => {
  return http.get(`${prefix}/`, {params})
}

export const apiGymDetail = (id) => {
  return http.get(`${prefix}/${id}`)
}

export const apiGymSave = (params) => {
  return http.post(`${prefix}/`, params)
}

export const apiGymUpdate = (params) => {
  return http.put(`${prefix}/`, params)
}

export const apiGymDelete = (id) => {
  return http.delete(`${prefix}/${id}`)
}
