import http from '../../utils/httpRequest'

const prefix = '/sys/exercise'

export const apiExerciseList = (params) => {
  return http.get(`${prefix}/`, {params})
}

export const apiExerciseListWithDetail = (params) => {
  return http.get(`${prefix}/detail`, {params})
}

export const apiExerciseDetail = (id) => {
  return http.get(`${prefix}/${id}`)
}

export const apiExerciseSave = (params) => {
  return http.post(`${prefix}/`, params)
}

export const apiExerciseUpdate = (params) => {
  return http.put(`${prefix}/`, params)
}

export const apiExerciseDelete = (id) => {
  return http.delete(`${prefix}/${id}`)
}
