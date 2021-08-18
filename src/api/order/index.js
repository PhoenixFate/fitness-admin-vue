import http from '../../utils/httpRequest'

const prefix = '/sys/order'

export const apiOrderList = (params) => {
  return http.get(`${prefix}/`, {params})
}

export const apiOrderDetail = (id) => {
  return http.get(`${prefix}/${id}`)
}
