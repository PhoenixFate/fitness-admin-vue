import http from '../../utils/httpRequest'

const prefix = '/sys/trainingPlan'

export const apiTrainingPlanList = (params) => {
  return http.get(`${prefix}/`, {params})
}

export const apiTrainingPlanDetail = (id) => {
  return http.get(`${prefix}/${id}`)
}

export const apiTrainingPlanSave = (params) => {
  return http.post(`${prefix}/`, params)
}

export const apiTrainingPlanUpdate = (params) => {
  return http.put(`${prefix}/`, params)
}

export const apiTrainingPlanDelete = (id) => {
  return http.delete(`${prefix}/${id}`)
}
