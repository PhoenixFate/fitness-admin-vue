import http from '../../utils/httpRequest'

const prefix = '/sys/customerShare'

export const apiCustomerShareList = (params) => {
  return http.get(`${prefix}/`, {params})
}

export const apiCustomerShareDetail = (id) => {
  return http.get(`${prefix}/${id}`)
}
