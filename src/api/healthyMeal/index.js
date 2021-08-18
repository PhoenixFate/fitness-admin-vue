import http from '../../utils/httpRequest'

const prefix = '/sys/healthyMeal'

export const apiHealthyMealList = (params) => {
  return http.get(`${prefix}/`, {params})
}

export const apiHealthyMealListWithDetail = (params) => {
  return http.get(`${prefix}/detail`, {params})
}

export const apiHealthyMealDetail = (id) => {
  return http.get(`${prefix}/${id}`)
}

export const apiHealthyMealSave = (params) => {
  return http.post(`${prefix}/`, params)
}

export const apiHealthyMealUpdate = (params) => {
  return http.put(`${prefix}/`, params)
}

export const apiHealthyMealDelete = (id) => {
  return http.delete(`${prefix}/${id}`)
}
