import http from '../../utils/httpRequest'

const prefix = '/sys/customerReturnVisit'

export const apiOneCustomerReturnVisit = (customerId) => {
  return http.get(`${prefix}/customer/${customerId}`)
}

export const apiSaveCustomerReturnVisit = params => {
  return http.post(`${prefix}/`, params)
}

export const apiGetRemind = (params) => {
  return http.get(`${prefix}/remind/`, {params})
}
