// ============================================================
// api.js  —  NGO Tracker API service layer
// ============================================================

const BASE_URL = import.meta.env?.VITE_API_URL || "http://localhost:5000/api";

// ── Token helpers ─────────────────────────────────────────
export function getToken() {
  return localStorage.getItem("ngo_token");
}
export function setToken(token) {
  localStorage.setItem("ngo_token", token);
}
export function clearToken() {
  localStorage.removeItem("ngo_token");
}

// ── Base fetch wrapper ────────────────────────────────────
async function request(path, options = {}) {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const error = new Error(data.error || `HTTP ${res.status}`);
    error.status = res.status;
    error.data = data;
    throw error;
  }

  return data;
}

const get = (path) => request(path);
const post = (path, body) => request(path, { method: "POST", body: JSON.stringify(body) });
const put = (path, body) => request(path, { method: "PUT", body: JSON.stringify(body) });
const del = (path) => request(path, { method: "DELETE" });

// ════════════════════════════════════════════════════════════
// USERS API
// ════════════════════════════════════════════════════════════

export function getUsers() {
  return get("/users");
}

export async function createUser(payload) {
  const data = await post("/users", payload);
  return data;
}

export function deleteUser(id) {
  return del(`/users/${id}`);
}