import http from '../../utils/httpRequest'

const prefix = '/sys/bill'

export const apiBillList = (params) => {
  return http.get(`${prefix}/`, {params})
}

export const apiBillTotalList = (params) => {
  return http.get(`${prefix}/total`, {params})
}

export const apiBillExport = (params) => {
  return http.get(`${prefix}/export`, {params: params, responseType: 'blob'})
}
