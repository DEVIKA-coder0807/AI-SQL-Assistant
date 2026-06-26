import { axiosInstance } from './axiosInstance.js'

export const sqlService = {
  generateSql: (payload) => axiosInstance.post('/query/generate', payload),
 explainSql: (payload) => axiosInstance.post('/query/explain', payload),
  optimizeSql: (payload) => axiosInstance.post('/query/optimize', payload),
  estimateImpact: (payload) => axiosInstance.post('/query/impact', payload),
  execute: (payload) => axiosInstance.post('/query/execute', payload),
  saveQuery: (payload) => axiosInstance.post('/saved', payload),
  getSaved: () => axiosInstance.get('/saved'),
  deleteSaved: (id) => axiosInstance.delete(`/saved/${id}`),
}
