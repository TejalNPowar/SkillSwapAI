import axios from 'axios'
import { students } from '../data/students.js'
import { skills } from '../data/skills.js'
import { requests as mockRequests } from '../data/requests.js'
import { notifications as mockNotifications } from '../data/notifications.js'

// Base axios instance — point this at the real Express/MongoDB backend later.
export const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

const MOCK_DELAY = 500
const mock = (data) => new Promise((resolve) => setTimeout(() => resolve({ data }), MOCK_DELAY))

/* ----------------------------- Auth ----------------------------- */

export function login(payload) {
  return api.post("/auth/login", payload);
}

export function register(data) {
  return api.post("/auth/register", data);
}

/* ---------------------------- Profile ---------------------------- */

export function getProfile() {
  return api.get("/auth/profile", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
}

export function updateProfile(userId, payload) {
  // return api.put(`/users/${userId}`, payload)
  return mock({ ...payload, id: userId })
}

/* ----------------------------- Users ------------------------------ */

export function getUsers() {
  return api.get("/users", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
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

export function getUserById(id) {
  return api.get(`/users/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
}

export default api
