import axios from 'axios'
import { students } from '../data/students.js'
import { skills } from '../data/skills.js'
import { requests as mockRequests } from '../data/requests.js'
import { notifications as mockNotifications } from '../data/notifications.js'

// Base axios instance — point this at the real Express/MongoDB backend later.
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
})

const MOCK_DELAY = 500
const mock = (data) => new Promise((resolve) => setTimeout(() => resolve({ data }), MOCK_DELAY))

/* ----------------------------- Auth ----------------------------- */

export function login(payload) {
  // return api.post('/auth/login', payload)
  return mock({ token: 'mock-token', user: students[0] })
}

export function register(payload) {
  // return api.post('/auth/register', payload)
  return mock({ token: 'mock-token', user: { ...payload, id: 'new-user' } })
}

/* ---------------------------- Profile ---------------------------- */

export function getProfile(userId) {
  // return api.get(`/users/${userId}`)
  const found = students.find((s) => s.id === userId) || students[0]
  return mock(found)
}

export function updateProfile(userId, payload) {
  // return api.put(`/users/${userId}`, payload)
  return mock({ ...payload, id: userId })
}

/* ----------------------------- Users ------------------------------ */

export function getUsers(filters = {}) {
  // return api.get('/users', { params: filters })
  return mock(students)
}

export function getSkills() {
  // return api.get('/skills')
  return mock(skills)
}

/* --------------------------- Dashboard ----------------------------- */

export function fetchDashboard(userId) {
  // return api.get(`/dashboard/${userId}`)
  return mock({
    stats: {
      connections: 24,
      pendingRequests: 5,
      completedSwaps: 12,
      skillsShared: 8,
    },
    recommended: students.slice(0, 6),
    recentActivity: mockNotifications,
  })
}

/* --------------------------- Requests ------------------------------ */

export function getRequests(userId) {
  // return api.get(`/requests`, { params: { userId } })
  return mock(mockRequests)
}

export function sendRequest(payload) {
  // return api.post('/requests', payload)
  return mock({ ...payload, id: `req-${Date.now()}`, status: 'pending' })
}

export function acceptRequest(requestId) {
  // return api.patch(`/requests/${requestId}/accept`)
  return mock({ id: requestId, status: 'accepted' })
}

export function rejectRequest(requestId) {
  // return api.patch(`/requests/${requestId}/reject`)
  return mock({ id: requestId, status: 'rejected' })
}

export function cancelRequest(requestId) {
  // return api.patch(`/requests/${requestId}/cancel`)
  return mock({ id: requestId, status: 'cancelled' })
}

export function completeRequest(requestId) {
  // return api.patch(`/requests/${requestId}/complete`)
  return mock({ id: requestId, status: 'completed' })
}

export default api
