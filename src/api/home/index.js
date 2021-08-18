import http from '../../utils/httpRequest'

const prefix = '/sys/statistics'

export const apiHomeToday = () => {
  return http.get(`${prefix}/today`)
}

export const apiCustomerCount = (params) => {
  return http.post(`${prefix}/customer/count`, params)
}

export const apiVipCount = (params) => {
  return http.post(`${prefix}/vip/count`, params)
}

export const apiSaleMoney = (params) => {
  return http.post(`${prefix}/money`, params)
}
