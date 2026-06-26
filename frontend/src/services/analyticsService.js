import { axiosInstance } from './axiosInstance.js'

export const analyticsService = {
  getDashboard: () => axiosInstance.get('/analytics/dashboard', { params: { t: Date.now() } }),
  getTrends: () => axiosInstance.get('/analytics/trends', { params: { t: Date.now() } }),
  getTables: () => axiosInstance.get('/analytics/tables', { params: { t: Date.now() } }),
}
