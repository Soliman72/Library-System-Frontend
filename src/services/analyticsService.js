import api from './api'

export const analyticsService = {
  getSummary() {
    return api.get('/analytics/summary')
  }
}
