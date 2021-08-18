import http from '../../utils/httpRequest'

const prefix = '/sys/oss'

export const apiUploadImage = (params) => {
  return http.post(`${prefix}/`, params, {
    headers: {'Content-Type': 'multipart/form-data'}
  })
}

export const apiUploadImageBase64 = (params) => {
  return http.post(`${prefix}/base64`, params)
}
