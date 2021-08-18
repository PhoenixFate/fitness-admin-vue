import http from '../../utils/httpRequest'

const prefix = '/sys/mealType'

export const apiMealTypeList = (params) => {
  return http.get(`${prefix}/`, {params})
}
