import http from '../../utils/httpRequest'

const prefix = '/sys/contract'

export const apiContractList = (params) => {
  return http.get(`${prefix}/`, {params})
}

export const apiActiveContract = (params) => {
  return http.put(`${prefix}/active`, params)
}

export const apiUpdateContract = (params) => {
  return http.put(`${prefix}/`, params)
}

export const apiContractDelete = (id) => {
  return http.delete(`${prefix}/${id}`)
}

export const apiCustomerContractList = customerId => {
  return http.get(`${prefix}/customer/${customerId}`)
}

export const apiSaveCustomerContract = params => {
  return http.post(`${prefix}/`, params)
}

// 次卡销次数
export const apiFinishTimes = params => {
  return http.put(`${prefix}/finish/times`, params)
}

// 退款
export const apiRefundContract = (params) => {
  return http.put(`${prefix}/refund`, params)
}
