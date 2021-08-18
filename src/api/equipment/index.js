import http from '../../utils/httpRequest'

const prefix = '/sys/equipment'

export const apiEquipmentList = (params) => {
  return http.get(`${prefix}/`, {params})
}

export const apiEquipmentDetail = (id) => {
  return http.get(`${prefix}/${id}`)
}

export const apiEquipmentSave = (params) => {
  return http.post(`${prefix}/`, params)
}

export const apiEquipmentUpdate = (params) => {
  return http.put(`${prefix}/`, params)
}

export const apiEquipmentDelete = (id) => {
  return http.delete(`${prefix}/${id}`)
}
