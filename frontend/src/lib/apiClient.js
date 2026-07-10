const GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL || "http://localhost:8080";

async function request(endpoint, options = {}) {
  const { method = "GET", body, isFormData = false } = options;

  const headers = {};
  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  const token = getCookie("auth_token");
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`${GATEWAY_URL}${endpoint}`, {
      method,
      headers,
      body: isFormData ? body : body ? JSON.stringify(body) : undefined,
      credentials: "include",
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || `Request failed: ${res.status}`);
    }

    return data;
  } catch (err) {
    throw err;
  }
}

function getCookie(name) {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? decodeURIComponent(match[2]) : null;
}

export const api = {
  get: (endpoint) => request(endpoint, { method: "GET" }),
  post: (endpoint, body) => request(endpoint, { method: "POST", body }),
  put: (endpoint, body) => request(endpoint, { method: "PUT", body }),
  patch: (endpoint, body) => request(endpoint, { method: "PATCH", body }),
  delete: (endpoint) => request(endpoint, { method: "DELETE" }),
  upload: (endpoint, formData) => request(endpoint, { method: "POST", body: formData, isFormData: true }),
};

export const auth = {
  login: (email, password) => api.post("/api/auth/login", { email, password }),
  register: (data) => api.post("/api/auth/register", data),
  verifyRegister: (data) => api.post("/api/auth/verify-register", data),
  verifyOtp: (email, code) => api.post("/api/auth/verif/verify-register", { email, code }),
  resendOtp: (email) => api.post("/api/auth/resend-otp", { email }),
  getMe: () => api.get("/api/auth/me"),
  logout: () => api.post("/api/auth/logout"),
  forgotPassword: (email) => api.post("/api/auth/forgot-password", { email }),
  verifyResetOtp: (email, code) => api.post("/api/auth/verify-reset-otp", { email, code }),
  resetPassword: (email, code, password) => api.post("/api/auth/reset-password", { email, code, password }),
  updateProfile: (data) => api.put("/api/auth/update-profile", data),
  getProfile: () => api.get("/api/auth/get-profile"),
};

export const users = {
  list: (role) => api.get(`/api/members${role ? `?role=${role}` : ""}`),
  getById: (id) => api.get(`/api/members/${id}`),
  create: (data) => api.post("/api/members", data),
  delete: (id) => api.delete(`/api/members/${id}`),
  resendEmail: (id) => api.post(`/api/members/resend-email/${id}`),
};

export const projects = {
  list: (params) => api.get(`/api/projects?${new URLSearchParams(params || {})}`),
  getById: (id) => api.get(`/api/projects/${id}`),
  create: (data) => api.post("/api/projects", data),
  update: (id, data) => api.patch(`/api/projects/${id}`, data),
  delete: (id) => api.delete(`/api/projects/${id}`),
  updateDecision: (id, decision, finished) => api.patch(`/api/projects/${id}/decision`, { decision, finished }),
  upload: (formData) => api.upload("/api/projects/upload", formData),
};

export const attachments = {
  getById: (id) => api.get(`/api/projects/attachments/${id}`),
  update: (id, data) => api.patch(`/api/projects/attachments/${id}`, data),
  delete: (id) => api.delete(`/api/projects/attachments/${id}`),
};

export const revisions = {
  list: (params) => api.get(`/api/revisions?${new URLSearchParams(params || {})}`),
  getById: (id) => api.get(`/api/revisions/${id}`),
  create: (data) => api.post("/api/revisions", data),
  update: (id, data) => api.patch(`/api/revisions/${id}`, data),
  getComments: (id) => api.get(`/api/revisions/${id}/comments`),
  addComment: (id, content) => api.post(`/api/revisions/${id}/comments`, { content }),
};

export const notifications = {
  list: (params) => api.get(`/api/notifications?${new URLSearchParams(params || {})}`),
  count: () => api.get("/api/notifications/count"),
  markRead: (id) => api.patch(`/api/notifications/${id}/read`),
  markAllRead: () => api.patch("/api/notifications/read-all"),
  delete: (id) => api.delete(`/api/notifications/${id}`),
  cleanup: () => api.delete("/api/notifications/cleanup"),
};

export const dashboard = {
  summary: () => api.get("/api/dashboard/summary"),
  statistics: () => api.get("/api/dashboard/statistics"),
  recentProjects: () => api.get("/api/dashboard/recent-projects"),
  recentRevisions: () => api.get("/api/dashboard/recent-revisions"),
  activity: () => api.get("/api/dashboard/activity"),
  members: () => api.get("/api/dashboard/members"),
  exportExcel: () => `${GATEWAY_URL}/api/dashboard/export/excel`,
  exportPdf: () => `${GATEWAY_URL}/api/dashboard/export/pdf`,
};
