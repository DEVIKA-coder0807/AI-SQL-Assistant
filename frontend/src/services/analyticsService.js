import { axiosInstance } from './axiosInstance.js'

export const analyticsService = {
  getDashboard: () => axiosInstance.get('/analytics/dashboard'),
  getTrends: () => axiosInstance.get('/analytics/trends'),
  getTables: () => axiosInstance.get('/analytics/tables'),
}
