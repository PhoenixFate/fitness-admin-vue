import http from '../../utils/httpRequest'

const prefix = '/sys/classInfo'

export const apiClassList = (params) => {
  return http.get(`${prefix}/`, {params})
}

export const apiClassListWithDetail = (params) => {
  return http.get(`${prefix}/detail`, {params})
}

export const apiClassDetail = (id) => {
  return http.get(`${prefix}/${id}`)
}

export const apiClassSave = (params) => {
  return http.post(`${prefix}/`, params)
}

export const apiClassUpdate = (params) => {
  return http.put(`${prefix}/`, params)
}

export const apiClassDelete = (id) => {
  return http.delete(`${prefix}/${id}`)
}
