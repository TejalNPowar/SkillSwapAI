import axios from "axios";
import { students } from "../data/students.js";
import { skills } from "../data/skills.js";
import { notifications as mockNotifications } from "../data/notifications.js";

// Base Axios Instance
export const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

const MOCK_DELAY = 500;
const mock = (data) =>
  new Promise((resolve) =>
    setTimeout(() => resolve({ data }), MOCK_DELAY)
  );

/* ============================================================
                        AUTH
============================================================ */

export function login(payload) {
  return api.post("/auth/login", payload);
}

export function register(data) {
  return api.post("/auth/register", data);
}

/* ============================================================
                      PROFILE
============================================================ */

export function getProfile() {
  return api.get("/auth/profile", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
}

export function updateProfile(payload) {
  return api.put("/auth/profile", payload, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
}

/* ============================================================
                        USERS
============================================================ */

export function getUsers() {
  return api.get("/users", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
}

export function getUserById(id) {
  return api.get(`/users/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
}

export function getSkills() {
  // Backend endpoint not created yet
  return mock(skills);
}

/* ============================================================
                    DASHBOARD (Mock for now)
============================================================ */

export function fetchDashboard() {
  return api.get("/dashboard", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
}

/* ============================================================
                    SWAP REQUESTS
============================================================ */

export function sendRequest(data) {
  return api.post("/swaps/send", data, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
}

export function getSentRequests() {
  return api.get("/swaps/sent", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
}

export function getReceivedRequests() {
  return api.get("/swaps/received", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
}

export function acceptRequest(id) {
  return api.put(
    `/swaps/${id}/accept`,
    {},
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );
}

export function rejectRequest(id) {
  return api.put(
    `/swaps/${id}/reject`,
    {},
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );
}

export default api;