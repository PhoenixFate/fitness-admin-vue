import http from '../../utils/httpRequest'

const prefix = '/sys/customerSureClass'

export const apiSureClassList = (params) => {
  return http.get(`${prefix}/`, {params})
}
export const apiOneContractSureClassList = (contractId) => {
  return http.get(`${prefix}/contract/${contractId}`)
}

export const apiUpdateSureClass = (params) => {
  return http.put(`${prefix}`, params)
}

export const apiDeleteSureClassLog = (customerSureClassId) => {
  return http.delete(`${prefix}/${customerSureClassId}`)
}

export const apiExportSureClass = (params) => {
  return http.get(`${prefix}/export`, {params: params, responseType: 'blob'})
}
