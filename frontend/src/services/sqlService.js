import { axiosInstance } from './axiosInstance.js'

export const sqlService = {
  generateSql: (payload) => axiosInstance.post('/assistant/generate', payload),
  explainSql: (payload) => axiosInstance.post('/assistant/explain', payload),
  estimateImpact: (payload) => axiosInstance.post('/assistant/impact', payload),
  alternatives: (payload) => axiosInstance.post('/assistant/alternatives', payload),
  execute: (payload) => axiosInstance.post('/assistant/execute', payload),
}
