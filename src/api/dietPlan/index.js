import http from '../../utils/httpRequest'

const prefix = '/sys/dietPlan'

export const apiDietPlanList = (params) => {
  return http.get(`${prefix}/`, {params})
}

export const apiDietPlanDetail = (id) => {
  return http.get(`${prefix}/${id}`)
}

export const apiDietPlanSave = (params) => {
  return http.post(`${prefix}/`, params)
}

export const apiDietPlanUpdate = (params) => {
  return http.put(`${prefix}/`, params)
}

export const apiDietPlanDelete = (id) => {
  return http.delete(`${prefix}/${id}`)
}
