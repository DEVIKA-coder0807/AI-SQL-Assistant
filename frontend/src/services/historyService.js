import { axiosInstance } from './axiosInstance.js'

export const historyService = {
  getHistory: (params) => axiosInstance.get('/history', { params }),
  getSaved: (params) => axiosInstance.get('/saved', { params }),
  getDetail: (id) => axiosInstance.get(`/history/${id}`),
}
