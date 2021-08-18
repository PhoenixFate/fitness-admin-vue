import http from '../../utils/httpRequest'

const prefix = '/sys/target'

export const apiTargetList = (params) => {
  return http.get(`${prefix}/`, {params})
}

export const apiTargetDetail = (id) => {
  return http.get(`${prefix}/${id}`)
}

export const apiTargetSave = (params) => {
  return http.post(`${prefix}/`, params)
}

export const apiTargetUpdate = (params) => {
  return http.put(`${prefix}/`, params)
}

export const apiTargetDelete = (id) => {
  return http.delete(`${prefix}/${id}`)
}
