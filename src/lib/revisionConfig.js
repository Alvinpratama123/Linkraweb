export const ROLES = ["QA", "FRONTEND", "BACKEND", "PM", "UIUX", "DEVOPS"];

export const ROLE_LABELS = {
  QA:       "QA (Quality Assurance)",
  FRONTEND: "Frontend Developer",
  BACKEND:  "Backend Developer",
  PM:       "Project Manager",
  UIUX:     "UI/UX Designer",
  DEVOPS:   "DevOps Engineer",
};

export const ROLE_COLORS = {
  QA:       { bg: "bg-purple-100", text: "text-purple-700" },
  FRONTEND: { bg: "bg-blue-100",   text: "text-blue-700"   },
  BACKEND:  { bg: "bg-green-100",  text: "text-green-700"  },
  PM:       { bg: "bg-orange-100", text: "text-orange-700" },
  UIUX:     { bg: "bg-pink-100",   text: "text-pink-700"   },
  DEVOPS:   { bg: "bg-slate-100",  text: "text-slate-700"  },
};


// Siapa bisa kirim ke siapa
export const SENDER_TARGET_MAP = {
  QA:       ["FRONTEND", "BACKEND", "PM", "UIUX", "DEVOPS"],
  FRONTEND: ["BACKEND", "PM", "QA"],
  BACKEND:  ["FRONTEND", "PM", "QA"],
  PM:       ["FRONTEND", "BACKEND", "QA", "UIUX", "DEVOPS"],
  UIUX:     ["FRONTEND", "PM", "QA"],
  DEVOPS:   ["BACKEND", "PM"],
};

export const ISSUE_TYPES = ["MODUL", "PROJECT", "INTEGRASI", "BUG", "LAINNYA"];

export const ISSUE_TYPE_LABELS = {
  MODUL:     "Modul",
  PROJECT:   "Project",
  INTEGRASI: "Integrasi",
  BUG:       "Bug",
  LAINNYA:   "Lainnya",
};

export const PROGRESS_LABELS = {
  BELUM_DILAKUKAN:   "Belum dilakukan",
  SEDANG_DIKERJAKAN: "Sedang dikerjakan",
  SELESAI:           "Selesai",
};

export const APPROVAL_LABELS = {
  PENDING:  "Pending",
  APPROVED: "Approved",
  REJECTED: "Rejected",
};