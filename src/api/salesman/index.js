import http from '../../utils/httpRequest'

const prefix = '/sys/salesman'

export const apiSalesmanList = (params) => {
  return http.get(`${prefix}/`, {params})
}

export const apiSalesmanDetail = (id) => {
  return http.get(`${prefix}/${id}`)
}

export const apiSalesmanSave = (params) => {
  return http.post(`${prefix}/`, params)
}

export const apiSalesmanUpdate = (params) => {
  return http.put(`${prefix}/`, params)
}

export const apiSalesmanDelete = (id) => {
  return http.delete(`${prefix}/${id}`)
}
