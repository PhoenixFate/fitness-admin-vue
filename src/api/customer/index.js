import http from '../../utils/httpRequest'

const prefix = '/sys/customer'

export const apiCustomerList = params => {
  return http.get(`${prefix}/`, {params})
}

export const apiCustomerById = customerId => {
  return http.get(`${prefix}/${customerId}`)
}

export const apiCustomerByNumber = customerNumber => {
  return http.get(`${prefix}/number/${customerNumber}`)
}

export const apiCustomerByPhysicalCard = physicalCard => {
  return http.get(`${prefix}/physicalCard/${physicalCard}`)
}

export const apiUpdateCustomerCommon = params => {
  return http.put(`${prefix}/base`, params)
}

export const apiSaveCustomer = params => {
  return http.post(`${prefix}/`, params)
}

export const apiStopCustomer = customerId => {
  return http.put(`${prefix}/stop/${customerId}`)
}

export const apiCancelStop = customerId => {
  return http.put(`${prefix}/cancelStop/${customerId}`)
}

export const apiCancelCustomer = customerId => {
  return http.put(`${prefix}/cancel/${customerId}`)
}

export const apiCustomerDelete = id => {
  return http.delete(`${prefix}/${id}`)
}

export function apiVipClassCheckin (trainerId, customerName, startAt, endAt, page, pageSize) {
  return http.get(`${prefix}/vip/checking`, {
    params: {
      trainerId,
      customerName,
      startAt,
      endAt,
      page: page - 1,
      size: pageSize
    }
  })
}
