import http from '../../utils/httpRequest'

const prefix = '/sys/actionType'

export const apiActionTypeList = (params) => {
  return http.get(`${prefix}/`, {params})
}

export const apiActionTypeDetail = (id) => {
  return http.get(`${prefix}/${id}`)
}

export const apiActionTypeSave = (params) => {
  return http.post(`${prefix}/`, params)
}

export const apiActionTypeUpdate = (params) => {
  return http.put(`${prefix}/`, params)
}

export const apiActionTypeDelete = (id) => {
  return http.delete(`${prefix}/${id}`)
}
