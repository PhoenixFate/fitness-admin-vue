import http from '../../utils/httpRequest'

const prefix = '/sys/trainingGoal'

export const apiTrainingGoalList = (params) => {
  return http.get(`${prefix}/`, {params})
}
