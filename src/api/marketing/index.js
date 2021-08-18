import http from '../../utils/httpRequest'

const prefix = '/sys/marketing'

export const apiCustomerMarketCardList = params => {
  return http.get(`${prefix}/card`, {params})
}

export const apiCustomerMarketTrainingList = params => {
  return http.get(`${prefix}/training`, {params})
}

export const apiPeriodCount = () => {
  return http.get(`${prefix}/period/count`)
}

export const apiPeriodCountChart = () => {
  return http.get(`${prefix}/period/count/chart`)
}
