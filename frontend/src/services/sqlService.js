import { axiosInstance } from './axiosInstance.js'

export const sqlService = {
  generateSql: (payload) => axiosInstance.post('/query/generate', payload),
  explainSql: (payload) => axiosInstance.post('/query/validate', payload),
  estimateImpact: (payload) => axiosInstance.post('/query/impact', payload),
  execute: (payload) => axiosInstance.post('/query/execute', payload),
}
