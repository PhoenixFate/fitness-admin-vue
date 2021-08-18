import http from '../../utils/httpRequest'

const prefix = '/sys/customerClockIn'

export const apiCustomerClockInList = (params) => {
  return http.get(`${prefix}/`, {params})
}

export const apiCustomerClockInSave = (customerNumber) => {
  return http.post(`${prefix}/in/${customerNumber}`)
}

export const apiCustomerClockInUpdate = (customerNumber) => {
  return http.put(`${prefix}/out/${customerNumber}`)
}
