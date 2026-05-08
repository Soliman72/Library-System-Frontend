import axios from 'axios'
import router from '../router'

const api = axios.create({
  baseURL: 'http://localhost:8080'
})

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      if (error.response.status === 401) {
        localStorage.removeItem('token')
        localStorage.removeItem('role')
        if (router.currentRoute.value.path !== '/') {
           router.push('/')
        }
      } else if (error.response.status === 403) {
        alert('You do not have permission to perform this action.')
      }
    }
    return Promise.reject(error)
  }
)

export default api
