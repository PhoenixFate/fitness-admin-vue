import http from '../../utils/httpRequest'

const prefix = '/sys/action'

export const apiActionList = (params) => {
  return http.get(`${prefix}/`, {params})
}

export const apiActionList2 = (params) => {
  return http.get(`${prefix}/type`, {params})
}

export const apiActionDetail = (id) => {
  return http.get(`${prefix}/${id}`)
}

export const apiActionSave = (params) => {
  return http.post(`${prefix}/`, params)
}

export const apiActionUpdate = (params) => {
  return http.put(`${prefix}/`, params)
}

export const apiActionDelete = (id) => {
  return http.delete(`${prefix}/${id}`)
}
