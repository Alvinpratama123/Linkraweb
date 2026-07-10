export const ROLES = ["QA", "FRONTEND", "BACKEND", "PM", "UIUX", "DEVOPS"];

export const SENDER_TARGET_MAP = {
  QA:       ["FRONTEND", "BACKEND", "PM", "UIUX", "DEVOPS"],
  FRONTEND: ["BACKEND", "PM", "QA"],
  BACKEND:  ["FRONTEND", "PM", "QA"],
  PM:       ["FRONTEND", "BACKEND", "QA", "UIUX", "DEVOPS"],
  UIUX:     ["FRONTEND", "PM", "QA"],
  DEVOPS:   ["BACKEND", "PM"],
};

export const ISSUE_TYPES = ["MODUL", "PROJECT", "INTEGRASI", "BUG", "LAINNYA"];

export const PROGRESS_OPTIONS = ["BELUM_DILAKUKAN", "SEDANG_DIKERJAKAN", "SELESAI"];

export const APPROVAL_OPTIONS = ["PENDING", "APPROVED", "REJECTED"];
