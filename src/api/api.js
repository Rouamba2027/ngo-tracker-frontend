// ============================================================
// api.js — NGO Tracker API service layer
// ============================================================

const BASE_URL = import.meta.env?.VITE_API_URL || "http://localhost:5000/api";

// ── Token helpers ─────────────────────────────────────────
export function getToken() { return localStorage.getItem("ngo_token"); }
export function setToken(token) { localStorage.setItem("ngo_token", token); }
export function clearToken() { localStorage.removeItem("ngo_token"); }

// ── Base fetch wrapper ────────────────────────────────────
async function request(path, options = {}) {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
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
// AUTH
// ════════════════════════════════════════════════════════════
export async function login(payload) {
  const data = await post("/auth/login", payload);
  if (data.token) setToken(data.token);
  return data;
}

export async function register(payload) {
  const data = await post("/auth/register", payload);
  if (data.token) setToken(data.token);
  return data;
}

export function getMe() { return get("/auth/me"); }
export function logout() { clearToken(); }

// ════════════════════════════════════════════════════════════
// USERS
// ════════════════════════════════════════════════════════════
export function getUsers() { return get("/users"); }
export async function createUser(payload) { return post("/users", payload); }
export function deleteUser(id) { return del(`/users/${id}`); }

// ════════════════════════════════════════════════════════════
// DASHBOARD
// ════════════════════════════════════════════════════════════
export function getDashboard() { return get("/dashboard"); }

// ════════════════════════════════════════════════════════════
// PROJECTS
// ════════════════════════════════════════════════════════════
export function getProjects(filters = {}) {
  const params = new URLSearchParams(Object.fromEntries(Object.entries(filters).filter(([, v]) => v))).toString();
  return get(`/projects${params ? "?" + params : ""}`);
}
export function getProject(id) { return get(`/projects/${id}`); }
export function createProject(payload) { return post("/projects", payload); }
export function updateProject(id, payload) { return put(`/projects/${id}`, payload); }
export function deleteProject(id) { return del(`/projects/${id}`); }

// ════════════════════════════════════════════════════════════
// EXPENSES
// ════════════════════════════════════════════════════════════
export function getExpenses(filters = {}) {
  const params = new URLSearchParams(Object.fromEntries(Object.entries(filters).filter(([, v]) => v))).toString();
  return get(`/expenses${params ? "?" + params : ""}`);
}
export function getExpense(id) { return get(`/expenses/${id}`); }
export function createExpense(payload) { return post("/expenses", payload); }
export function updateExpense(id, payload) { return put(`/expenses/${id}`, payload); }
export function deleteExpense(id) { return del(`/expenses/${id}`); }

// ════════════════════════════════════════════════════════════
// REPORTS
// ════════════════════════════════════════════════════════════
export function getReports(filters = {}) {
  const params = new URLSearchParams(Object.fromEntries(Object.entries(filters).filter(([, v]) => v))).toString();
  return get(`/reports${params ? "?" + params : ""}`);
}
export function getReport(id) { return get(`/reports/${id}`); }
export function generateReport(payload) { return post("/reports/generate", payload); }
export function deleteReport(id) { return del(`/reports/${id}`); }

// ════════════════════════════════════════════════════════════
// ORGANIZATION
// ════════════════════════════════════════════════════════════
export function getOrganization() { return get("/organization"); }
export function updateOrganization(payload) { return put("/organization", payload); }