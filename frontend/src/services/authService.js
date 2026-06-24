import { axiosInstance } from './axiosInstance.js'

export const authService = {
  login: (credentials) => axiosInstance.post('/auth/login', credentials),
  register: (payload) => axiosInstance.post('/auth/register', payload),
  refresh: () => axiosInstance.get('/auth/refresh'),
}
