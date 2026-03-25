// ============================================================
// api.js  —  NGO Tracker API service layer
// Every backend route is wrapped here. Import and call these
// functions from your React components instead of raw fetch().
// ============================================================

const BASE_URL = import.meta.env?.VITE_API_URL || "http://localhost:5000/api";

// ── Token helpers ────────────────────────────────────────────
export function getToken() {
  return localStorage.getItem("ngo_token");
}
export function setToken(token) {
  localStorage.setItem("ngo_token", token);
}
export function clearToken() {
  localStorage.removeItem("ngo_token");
}

// ── Base fetch wrapper ───────────────────────────────────────
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
// AUTH  —  /api/auth
// ════════════════════════════════════════════════════════════

/**
 * Register a new user.
 * @param {"ONG"|"MANAGER"|"VIEWER"} type
 * For ONG: { type, name, email, password, orgName, receiptNumber, country }
 * For MANAGER/VIEWER: { type, name, email, password, orgCode }
 * @returns { token, user, orgCode }
 */
export async function register(payload) {
  const data = await post("/auth/register", payload);
  if (data.token) setToken(data.token);
  return data;
}

/**
 * Login.
 * @param {{ email, password, role, orgCode? }} payload
 * @returns { token, user }
 */
export async function login(payload) {
  const data = await post("/auth/login", payload);
  if (data.token) setToken(data.token);
  return data;
}

/**
 * Get the currently authenticated user.
 * @returns { user }
 */
export function getMe() {
  return get("/auth/me");
}

/**
 * Log out — clears the local token.
 */
export function logout() {
  clearToken();
}

// ════════════════════════════════════════════════════════════
// DASHBOARD  —  /api/dashboard
// ════════════════════════════════════════════════════════════

/**
 * Get full dashboard data (KPIs, monthly chart, alerts, recent projects).
 * @returns { stats, monthlyExpenses, budgetByDomain, alerts, recentProjects }
 */
export function getDashboard() {
  return get("/dashboard");
}

// ════════════════════════════════════════════════════════════
// PROJECTS  —  /api/projects
// ════════════════════════════════════════════════════════════

/**
 * List projects. Scoped by role automatically on the server.
 * @param {{ status?, domain?, search? }} filters
 * @returns { projects[], total }
 */
export function getProjects(filters = {}) {
  const params = new URLSearchParams(
    Object.fromEntries(Object.entries(filters).filter(([, v]) => v))
  ).toString();
  return get(`/projects${params ? "?" + params : ""}`);
}

/**
 * Get a single project by ID.
 * @returns { project }
 */
export function getProject(id) {
  return get(`/projects/${id}`);
}

/**
 * Get all expenses for a project.
 * @returns { expenses[], total }
 */
export function getProjectExpenses(id) {
  return get(`/projects/${id}/expenses`);
}

/**
 * Create a new project (ADMIN only).
 * @param {{ name, domain, budgetAllocated, startDate?, endDate?, assignedManagers? }} payload
 * @returns { project }
 */
export function createProject(payload) {
  return post("/projects", payload);
}

/**
 * Update a project (ADMIN only).
 * @returns { project }
 */
export function updateProject(id, payload) {
  return put(`/projects/${id}`, payload);
}

/**
 * Delete a project (ADMIN only).
 */
export function deleteProject(id) {
  return del(`/projects/${id}`);
}

// ════════════════════════════════════════════════════════════
// EXPENSES  —  /api/expenses
// ════════════════════════════════════════════════════════════

/**
 * List expenses.
 * @param {{ projectId?, category?, from?, to? }} filters
 * @returns { expenses[], total, totalAmount }
 */
export function getExpenses(filters = {}) {
  const params = new URLSearchParams(
    Object.fromEntries(Object.entries(filters).filter(([, v]) => v))
  ).toString();
  return get(`/expenses${params ? "?" + params : ""}`);
}

/**
 * Get a single expense by ID.
 * @returns { expense }
 */
export function getExpense(id) {
  return get(`/expenses/${id}`);
}

/**
 * Record a new expense (ADMIN or MANAGER).
 * @param {{ projectId, amount, category, description?, date? }} payload
 * @returns { expense }
 */
export function createExpense(payload) {
  return post("/expenses", payload);
}

/**
 * Update an expense (ADMIN or own MANAGER expense).
 * @returns { expense }
 */
export function updateExpense(id, payload) {
  return put(`/expenses/${id}`, payload);
}

/**
 * Delete an expense.
 */
export function deleteExpense(id) {
  return del(`/expenses/${id}`);
}

// ════════════════════════════════════════════════════════════
// REPORTS  —  /api/reports
// ════════════════════════════════════════════════════════════

/**
 * List reports.
 * @param {{ projectId?, type? }} filters
 * @returns { reports[], total }
 */
export function getReports(filters = {}) {
  const params = new URLSearchParams(
    Object.fromEntries(Object.entries(filters).filter(([, v]) => v))
  ).toString();
  return get(`/reports${params ? "?" + params : ""}`);
}

/**
 * Get a single report (includes generated data).
 * @returns { report }
 */
export function getReport(id) {
  return get(`/reports/${id}`);
}

/**
 * Generate a new report (ADMIN or MANAGER).
 * @param {{ type: "quarterly"|"semester"|"annual", projectId? }} payload
 * @returns { report }
 */
export function generateReport(payload) {
  return post("/reports/generate", payload);
}

/**
 * Delete a report (ADMIN only).
 */
export function deleteReport(id) {
  return del(`/reports/${id}`);
}

// ════════════════════════════════════════════════════════════
// USERS  —  /api/users  (ADMIN only)
// ════════════════════════════════════════════════════════════

/**
 * List all users in the organisation.
 * @returns { users[], total }
 */
export function getUsers() {
  return get("/users");
}

/**
 * Get a single user.
 * @returns { user }
 */
export function getUser(id) {
  return get(`/users/${id}`);
}

/**
 * Update a user's name, role, or password.
 * @param {{ name?, role?, password? }} payload
 * @returns { user }
 */
export function updateUser(id, payload) {
  return put(`/users/${id}`, payload);
}

/**
 * Remove a user from the organisation (ADMIN only).
 */
export function deleteUser(id) {
  return del(`/users/${id}`);
}

// ════════════════════════════════════════════════════════════
// ORGANIZATION  —  /api/organization
// ════════════════════════════════════════════════════════════

/**
 * Get the current user's organisation info.
 * @returns { organization }
 */
export function getOrganization() {
  return get("/organization");
}

/**
 * Update organisation details (ADMIN only).
 * @param {{ name?, country? }} payload
 * @returns { organization }
 */
export function updateOrganization(payload) {
  return put("/organization", payload);
}
/**
 * Create a new user (ADMIN only).
 * @param {{ name, email, password, role: "MANAGER"|"VIEWER" }} payload
 * @returns { user }
 */
export function createUser(payload) {
  return post("/users", payload);
}
