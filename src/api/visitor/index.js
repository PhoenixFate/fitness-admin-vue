import http from '../../utils/httpRequest'

const prefix = '/sys/visitor'

export const apiVisitorList = (params) => {
  return http.get(`${prefix}/`, {params})
}

export const apiVisitorDetail = (id) => {
  return http.get(`${prefix}/${id}`)
}

export const apiVisitorSave = (params) => {
  return http.post(`${prefix}/`, params)
}

export const apiVisitorUpdate = (params) => {
  return http.put(`${prefix}/`, params)
}

export const apiVisitorDelete = (id) => {
  return http.delete(`${prefix}/${id}`)
}
