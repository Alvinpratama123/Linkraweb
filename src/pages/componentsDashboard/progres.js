// pages/componentsDashboard/progres.js
"use client";

import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import ReactDOM from "react-dom";
import Swal from 'sweetalert2';

const formatDate = (iso) => {
  try {
    return new Date(iso).toLocaleString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (e) {
    return iso || "";
  }
};

const normalizeDecision = (value) => {
  const normalized = String(value || "pending").toLowerCase();
  if (normalized === "approved") return "approved";
  if (normalized === "rejected") return "rejected";
  return "pending";
};

const getDecisionLabel = (value) => {
  const normalized = normalizeDecision(value);
  if (normalized === "approved") return "Approved";
  if (normalized === "rejected") return "Rejected";
  return "Pending";
};

const getDecisionIcon = (value) => {
  const normalized = normalizeDecision(value);
  if (normalized === "approved") return "✓";
  if (normalized === "rejected") return "✗";
  return "○";
};

const decisionBadgeClass = (value, theme) => {
  const normalized = normalizeDecision(value);
  if (normalized === "approved") {
    return theme === "dark" 
      ? "bg-green-900/50 text-green-300 border-green-700" 
      : "bg-green-50 text-green-700 border-green-200";
  }
  if (normalized === "rejected") {
    return theme === "dark" 
      ? "bg-red-900/50 text-red-300 border-red-700" 
      : "bg-red-50 text-red-700 border-red-200";
  }
  return theme === "dark" 
    ? "bg-yellow-900/50 text-yellow-300 border-yellow-700" 
    : "bg-yellow-50 text-yellow-700 border-yellow-200";
};

const getInitial = (text) => {
  const clean = String(text || "").trim();
  return clean ? clean.charAt(0).toUpperCase() : "?";
};

const normalizeAttachmentStatus = (value) => {
  const normalized = String(value || "pending").toLowerCase();
  if (normalized === "approved") return "approved";
  if (normalized === "rejected") return "rejected";
  return "pending";
};

const getAttachmentStatusLabel = (value) => {
  const normalized = normalizeAttachmentStatus(value);
  if (normalized === "approved") return "Approved";
  if (normalized === "rejected") return "Rejected";
  return "Pending";
};

// Toast notification menggunakan SweetAlert2
const showToast = (icon, title, message) => {
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    }
  });

  Toast.fire({
    icon: icon,
    title: title,
    text: message,
  });
};

// ─── HELPER: FETCH WITH AUTH HANDLING ─────────────────────────
const fetchWithAuth = async (url, options = {}) => {
  try {
    const response = await fetch(url, {
      ...options,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (response.status === 401) {
      console.error('❌ Unauthorized request, redirecting to login');
      if (typeof window !== 'undefined') {
        localStorage.clear();
        sessionStorage.clear();
        document.cookie.split(";").forEach((c) => {
          document.cookie = c
            .replace(/^ +/, "")
            .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
        });
        window.location.href = '/components/login';
      }
      throw new Error('Unauthorized');
    }

    if (response.status === 403) {
      const errText = await response.text();
      let errMsg = 'Anda tidak memiliki akses';
      try { errMsg = JSON.parse(errText).message || errMsg; } catch {}
      console.error('❌ Forbidden:', errMsg);
      throw new Error(errMsg);
    }

    if (!response.ok) {
      const text = await response.text();
      if (text.trim().startsWith('<!DOCTYPE') || text.trim().startsWith('<html')) {
        console.error('❌ Received HTML instead of JSON, redirecting to login');
        if (typeof window !== 'undefined') {
          window.location.href = '/components/login';
        }
        throw new Error('Received HTML response');
      }
      throw new Error(text || `HTTP ${response.status}`);
    }

    const text = await response.text();
    try {
      return JSON.parse(text);
    } catch (e) {
      console.error('❌ Invalid JSON response:', text.substring(0, 200));
      throw new Error('Invalid JSON response');
    }
  } catch (error) {
    console.error('❌ Fetch error:', error);
    throw error;
  }
};

// ─── FUNGSI GET NOTIFICATION LINK ────────────────────────────
const getNotificationLink = (role, tab = 'progress', projectName = null) => {
  const normalizedRole = (role || '').toLowerCase();
  
  let baseUrl;
  if (normalizedRole === 'admin' || normalizedRole === 'administrator') {
    baseUrl = '/dashboardAdmin/admin';
  } else {
    baseUrl = '/memberDashboard/MemberDashboard';
  }
  
  let url = `${baseUrl}?tab=${tab}`;
  if (projectName) {
    url += `&project=${encodeURIComponent(projectName)}`;
  }
  url += `&refresh=${Date.now()}`;
  
  return url;
};

// ─── FUNGSI NOTIFIKASI KE USER SPESIFIK ──────────────────────
const addNotificationToUser = async (userId, title, message, type = "info", link = null) => {
  try {
    if (!userId) {
      console.error('❌ [Progres] User ID is required');
      return { success: false, error: 'User ID required' };
    }
    
    console.log(`📢 [Progres] Sending notification to user ${userId}: ${title}`);
    console.log(`📢 [Progres] Link: ${link}`);
    
    const data = await fetchWithAuth("/api/notifications", {
      method: "POST",
      body: JSON.stringify({
        userId,
        title,
        message,
        type,
        link: link || `/memberDashboard/MemberDashboard?tab=progress&refresh=${Date.now()}`,
        icon: type === "success" ? "✓" : type === "error" ? "✗" : type === "warning" ? "⚠" : "📢",
        color: type === "success" ? "green" : type === "error" ? "red" : type === "warning" ? "orange" : "blue",
      }),
    });
    
    console.log(`✅ [Progres] Notification to user response:`, data);
    return data;
  } catch (error) {
    console.error("❌ Add notification to user error:", error);
    return { success: false, error: error.message };
  }
};

// ─── FUNGSI NOTIFIKASI KE ADMIN (CURRENT USER) ──────────────
const addNotificationToAdmin = async (title, message, type = "info", link = null) => {
  try {
    const meData = await fetchWithAuth('/api/auth/me');
    
    if (!meData.success || !meData.user) {
      console.error('❌ Cannot get current user');
      return;
    }
    
    const userId = meData.user.id;
    const userRole = meData.user.role || 'member';
    const notificationLink = link || getNotificationLink(userRole, 'progress');
    
    return await addNotificationToUser(userId, title, message, type, notificationLink);
  } catch (error) {
    console.error("❌ Add notification to admin error:", error);
  }
};

// ─── FUNGSI NOTIFIKASI KE MEMBER ──────────────────────────────
const addNotificationToMember = async (userId, title, message, type = "info", projectName = null) => {
  try {
    if (!userId) {
      console.error('❌ [Progres] Cannot send notification to member: userId is required');
      return { success: false, error: 'User ID required' };
    }
    
    console.log(`📢 [Progres] Sending notification to MEMBER ${userId}: ${title}`);
    console.log(`📢 [Progres] Project: ${projectName}`);
    
    // Buat link dengan project name
    let memberLink;
    if (projectName) {
      memberLink = `/memberDashboard/MemberDashboard?tab=progress&project=${encodeURIComponent(projectName)}&refresh=${Date.now()}`;
    } else {
      memberLink = `/memberDashboard/MemberDashboard?tab=progress&refresh=${Date.now()}`;
    }
    
    return await addNotificationToUser(userId, title, message, type, memberLink);
  } catch (error) {
    console.error("❌ Add notification to member error:", error);
    return { success: false, error: error.message };
  }
};

// Kumpulkan semua lampiran (gambar, modul, link) milik satu role/project
const getRoleAttachments = (role) => {
  if (!role) return [];
  const attachments = [];
  const overrides = role.attachmentStatusOverrides || {};

  if (role.attachments && role.attachments.length > 0) {
    role.attachments.forEach((item) => {
      attachments.push({
        ...item,
        status: normalizeAttachmentStatus(item.status || overrides[item.id] || "pending"),
        label: item.name || (item.type === "image" ? "Gambar" : item.type === "link" ? "Link" : "File"),
        url: item.url || item.data || "",
        data: item.url || item.data || "",
      });
    });
  }

  if (role.imageUrl) {
    const exists = attachments.some((a) => a.url === role.imageUrl);
    if (!exists) {
      attachments.push({
        id: `image-${role.id}`,
        type: "image",
        name: "Gambar Project",
        label: "Gambar Project",
        url: role.imageUrl,
        data: role.imageUrl,
        description: role.imageDescription || null,
        createdAt: role.createdAt || role.date,
        status: normalizeAttachmentStatus(overrides[`image-${role.id}`] || "pending"),
      });
    }
  }

  if (role.moduleUrl) {
    attachments.push({
      id: `module-${role.id}`,
      type: "module",
      name: "Modul Project",
      label: "Modul Project",
      url: role.moduleUrl,
      data: role.moduleUrl,
      description: "Modul pembelajaran",
      createdAt: role.createdAt || role.date,
      status: normalizeAttachmentStatus(overrides[`module-${role.id}`] || "pending"),
    });
  }

  if (role.repoLink) {
    attachments.push({
      id: `repo-${role.id}`,
      type: "link",
      name: role.repoLink,
      label: "Project Link",
      url: role.repoLink,
      data: role.repoLink,
      createdAt: role.date || role.createdAt || "",
      description: "Link repository / demo project",
      status: normalizeAttachmentStatus(overrides[`repo-${role.id}`] || "pending"),
    });
  }

  return attachments;
};

// Avatar kecil untuk foto role
const RoleAvatar = ({ project, theme, size = "w-11 h-11" }) => {
  const photoUrl = project.imageUrl;
  const label = project.user?.email || project.name;

  if (photoUrl) {
    return (
      <img
        src={photoUrl}
        alt={label}
        className={`${size} rounded-full object-cover flex-shrink-0 border-2 ${
          theme === "dark" ? "border-gray-600" : "border-gray-200"
        }`}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='44' height='44'%3E%3Crect width='44' height='44' fill='%23e5e7eb'/%3E%3C/svg%3E";
        }}
      />
    );
  }

  return (
    <div
      className={`${size} rounded-full flex-shrink-0 flex items-center justify-center text-sm font-semibold ${
        theme === "dark" 
          ? "bg-indigo-900/50 text-indigo-300 border border-indigo-700" 
          : "bg-indigo-50 text-indigo-700 border border-indigo-200"
      }`}
    >
      {getInitial(label)}
    </div>
  );
};

// Komponen Dropdown untuk Action per Module
const ModuleDropdown = ({ module, theme, onViewDetail, onDelete, isAdmin }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition flex items-center gap-2 ${
          theme === "dark"
            ? "bg-gray-700 hover:bg-gray-600 text-gray-200"
            : "bg-gray-100 hover:bg-gray-200 text-gray-700"
        }`}
      >
        Actions
        <svg className={`w-3 h-3 transition-transform ${isOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className={`absolute right-0 mt-2 w-56 rounded-xl shadow-lg border z-50 ${
            theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
          }`}>
            <div className="py-1">
              <div className={`px-4 py-2 border-b ${theme === "dark" ? "border-gray-700" : "border-gray-100"}`}>
                <div className={`text-xs font-semibold ${theme === "dark" ? "text-gray-200" : "text-gray-800"}`}>
                  {module.name}
                </div>
                <div className={`text-xs mt-0.5 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                  {module.totalRole} role &bull; {module.avgProgress}% rata-rata
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(false);
                  onViewDetail(module.name);
                }}
                className={`w-full text-left px-4 py-2.5 text-sm transition flex items-center gap-3 ${
                  theme === "dark"
                    ? "hover:bg-gray-700 text-gray-200"
                    : "hover:bg-gray-50 text-gray-700"
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Lihat Detail
              </button>

              {isAdmin && (
                <>
                  <div className={`border-t ${theme === "dark" ? "border-gray-700" : "border-gray-100"}`} />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsOpen(false);
                      onDelete(module);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-sm transition flex items-center gap-3 ${
                      theme === "dark"
                        ? "hover:bg-gray-700 text-red-400"
                        : "hover:bg-gray-50 text-red-600"
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Hapus Module
                  </button>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// Komponen Dropdown untuk Action per Role
const RoleDropdown = ({ role, theme, onDecision, onDelete, onViewDetail, isAdmin = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
  const btnRef = useRef(null);
  const status = normalizeDecision(role.decision);

  const handleToggle = (e) => {
    e.stopPropagation();
    if (!isOpen && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      let top = rect.bottom + 4;
      let left = rect.right - 224;
      if (top + 300 > window.innerHeight) top = rect.top - 4 - 300;
      if (left < 8) left = 8;
      setMenuPos({ top, left });
    }
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative inline-block">
      <button
        ref={btnRef}
        onClick={handleToggle}
        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition flex items-center gap-2 ${
          theme === "dark" 
            ? "bg-gray-700 hover:bg-gray-600 text-gray-200" 
            : "bg-gray-100 hover:bg-gray-200 text-gray-700"
        }`}
      >
        Actions
        <svg className={`w-3 h-3 transition-transform ${isOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && ReactDOM.createPortal(
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          
          <div className={`fixed z-50 w-56 rounded-xl shadow-2xl border max-h-[70vh] overflow-y-auto ${
            theme === "dark" 
              ? "bg-gray-800 border-gray-700" 
              : "bg-white border-gray-200"
          }`} style={{ top: menuPos.top, left: menuPos.left }}>
            <div className="py-1">
              <div className={`px-4 py-2 border-b ${theme === "dark" ? "border-gray-700" : "border-gray-100"}`}>
                <div className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                  {role.user?.email || role.position || "Role"}
                </div>
                <div className={`text-xs font-semibold mt-0.5 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                  Status: {getDecisionLabel(status)}
                </div>
              </div>

              <button
                onClick={() => {
                  setIsOpen(false);
                  onViewDetail(role);
                }}
                className={`w-full text-left px-4 py-2.5 text-sm transition flex items-center gap-3 ${
                  theme === "dark" 
                    ? "hover:bg-gray-700 text-gray-200" 
                    : "hover:bg-gray-50 text-gray-700"
                }`}
              >
                Lihat Detail
              </button>

              {isAdmin && (
                <>
              <button
                onClick={() => {
                  setIsOpen(false);
                  onDecision(role, "approved");
                }}
                disabled={status === "approved"}
                className={`w-full text-left px-4 py-2.5 text-sm transition flex items-center gap-3 ${
                  status === "approved"
                    ? theme === "dark" ? "text-gray-500 cursor-not-allowed" : "text-gray-400 cursor-not-allowed"
                    : theme === "dark" 
                      ? "hover:bg-gray-700 text-green-400" 
                      : "hover:bg-gray-50 text-green-600"
                }`}
              >
                Approve
              </button>

              <button
                onClick={() => {
                  setIsOpen(false);
                  onDecision(role, "rejected");
                }}
                disabled={status === "rejected"}
                className={`w-full text-left px-4 py-2.5 text-sm transition flex items-center gap-3 ${
                  status === "rejected"
                    ? theme === "dark" ? "text-gray-500 cursor-not-allowed" : "text-gray-400 cursor-not-allowed"
                    : theme === "dark" 
                      ? "hover:bg-gray-700 text-red-400" 
                      : "hover:bg-gray-50 text-red-600"
                }`}
              >
                Reject
              </button>

              <button
                onClick={() => {
                  setIsOpen(false);
                  onDecision(role, "pending");
                }}
                disabled={status === "pending"}
                className={`w-full text-left px-4 py-2.5 text-sm transition flex items-center gap-3 ${
                  status === "pending"
                    ? theme === "dark" ? "text-gray-500 cursor-not-allowed" : "text-gray-400 cursor-not-allowed"
                    : theme === "dark" 
                      ? "hover:bg-gray-700 text-yellow-400" 
                      : "hover:bg-gray-50 text-yellow-600"
                }`}
              >
                Reset ke Pending
              </button>

              <div className={`border-t ${theme === "dark" ? "border-gray-700" : "border-gray-100"}`} />

              <button
                onClick={() => {
                  setIsOpen(false);
                  if (confirm(`Yakin ingin menghapus role "${role.user?.email || role.position}" ini?`)) {
                    onDelete(role);
                  }
                }}
                className={`w-full text-left px-4 py-2.5 text-sm transition flex items-center gap-3 ${
                  theme === "dark" 
                    ? "hover:bg-gray-700 text-red-400" 
                    : "hover:bg-red-50 text-red-600"
                }`}
              >
                Hapus Role
              </button>
                </>
              )}
            </div>
          </div>
        </>,
        document.body
      )}
    </div>
  );
};

// Modal "Lihat Detail" dengan tombol Approve/Reject per attachment
const RoleDetailModal = ({ role, theme, onClose, onDecision, onAttachmentStatus, onApproveAll, onResetAll, isAdmin = false }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [attachmentSearch, setAttachmentSearch] = useState("");
  const [localAttachments, setLocalAttachments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (role) {
      const attachments = getRoleAttachments(role);
      setLocalAttachments(attachments);
      setSelectedIndex(0);
      setAttachmentSearch("");
    }
  }, [role]);

  const filteredAttachments = localAttachments.filter((item) => {
    const search = attachmentSearch.trim().toLowerCase();
    if (!search) return true;
    return (
      item.name?.toLowerCase().includes(search) ||
      item.label?.toLowerCase().includes(search) ||
      item.description?.toLowerCase().includes(search)
    );
  });

  const activeAttachment = filteredAttachments[selectedIndex] || null;
  const status = normalizeDecision(role?.decision || "pending");
  
  const totalItems = localAttachments.length;
  const approvedItems = localAttachments.filter(a => normalizeAttachmentStatus(a.status) === "approved").length;
  const progressPercent = totalItems > 0 ? Math.round((approvedItems / totalItems) * 100) : 0;
  const allAttachmentsApproved = totalItems > 0 && approvedItems === totalItems;

  const handleStatusChange = async (attachment, newStatus) => {
    setLoading(true);
    
    try {
      if (attachment.id && !attachment.id.toString().startsWith('image-') && !attachment.id.toString().startsWith('module-') && !attachment.id.toString().startsWith('repo-')) {
        const data = await fetchWithAuth(`/api/projects/attachments/${attachment.id}`, {
          method: 'PATCH',
          body: JSON.stringify({ status: newStatus }),
        });
        
        if (!data.success) {
          throw new Error(data.message || 'Gagal update status');
        }
        
        setLocalAttachments(prev => 
          prev.map(item => 
            item.id === attachment.id 
              ? { ...item, status: newStatus }
              : item
          )
        );
        
        await onAttachmentStatus(role, attachment, newStatus);
        
        const statusLabel = getAttachmentStatusLabel(newStatus);
        showToast('success', `${newStatus === 'approved' ? '✓' : '✗'} ${statusLabel}`, `"${attachment.label}" telah di-${statusLabel.toLowerCase()}`);
        
        const updatedAttachments = localAttachments.map(item => 
          item.id === attachment.id ? { ...item, status: newStatus } : item
        );
        const allApproved = updatedAttachments.every(item => normalizeAttachmentStatus(item.status) === "approved");
        
        if (allApproved) {
          showToast('success', '✓ Semua Approved', 'Semua lampiran telah di-approve!');
          await onDecision(role, 'approved');
        }
      } else {
        await onAttachmentStatus(role, attachment, newStatus);
        
        setLocalAttachments(prev => 
          prev.map(item => 
            item.id === attachment.id 
              ? { ...item, status: newStatus }
              : item
          )
        );
        
        const statusLabel = getAttachmentStatusLabel(newStatus);
        showToast('success', `${newStatus === 'approved' ? '✓' : '✗'} ${statusLabel}`, `"${attachment.label}" telah di-${statusLabel.toLowerCase()}`);
      }
    } catch (error) {
      console.error('Error updating attachment status:', error);
      showToast('error', '✗ Gagal', error.message || 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  if (!role) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center ${theme === "dark" ? "bg-black/80" : "bg-black/60"} p-2 sm:p-4`}
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className={`relative max-w-6xl w-full max-h-[95vh] rounded-2xl overflow-hidden ${theme === "dark" ? "bg-gray-800" : "bg-white"} shadow-2xl`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`sticky top-0 z-10 ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"} border-b px-4 sm:px-6 py-4 flex items-center justify-between`}>
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <RoleAvatar project={role} theme={theme} size="w-12 h-12" />
            <div className="min-w-0">
              <h2 className={`text-lg sm:text-xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"} truncate`}>{role.user?.email || "-"}</h2>
              <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                {role.user?.position || role.position || "-"} • {role.name}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0 ml-4">
            <button
              type="button"
              onClick={onClose}
              className={`w-10 h-10 rounded-full ${theme === "dark" ? "bg-gray-700 hover:bg-gray-600 text-gray-300" : "bg-gray-100 hover:bg-gray-200 text-gray-600"} flex items-center justify-center text-xl transition`}
            >
              ×
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 p-4 sm:p-6 overflow-y-auto max-h-[calc(95vh-160px)]">
          <div className="lg:w-80 flex-shrink-0 space-y-4">
            <div className={`rounded-xl p-3 ${theme === "dark" ? "bg-gray-700/50" : "bg-gray-50"}`}>
              <div className="flex items-center justify-between text-xs">
                <span className={`${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                  Progress Pengerjaan
                </span>
                <span className={`font-semibold ${
                  progressPercent === 100 
                    ? "text-green-600" 
                    : theme === "dark" ? "text-blue-400" : "text-[#001d55]"
                }`}>
                  {progressPercent}%
                </span>
              </div>
              <div className={`w-full h-2 rounded-full overflow-hidden mt-1 ${theme === "dark" ? "bg-gray-600" : "bg-gray-200"}`}>
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ${
                    progressPercent === 100 
                      ? "bg-green-600" 
                      : progressPercent >= 70 
                      ? "bg-blue-600" 
                      : progressPercent >= 40 
                      ? "bg-yellow-600" 
                      : "bg-red-600"
                  }`} 
                  style={{ width: `${progressPercent}%` }} 
                />
              </div>
              <div className="flex justify-between text-[10px] mt-1">
                <span className={theme === "dark" ? "text-gray-500" : "text-gray-400"}>
                  {approvedItems} dari {totalItems} selesai
                </span>
                <span className={
                  progressPercent === 100 
                    ? "text-green-600 font-semibold" 
                    : theme === "dark" ? "text-gray-400" : "text-gray-500"
                }>
                  {progressPercent === 100 ? "Selesai!" : `${progressPercent}%`}
                </span>
              </div>
            </div>

            <div className="relative">
              <input
                type="search"
                value={attachmentSearch}
                onChange={(e) => {
                  setAttachmentSearch(e.target.value);
                  setSelectedIndex(0);
                }}
                placeholder="Cari lampiran..."
                className={`w-full h-11 pl-9 border ${theme === "dark" ? "border-gray-600 bg-gray-700 text-white placeholder-gray-400" : "border-gray-300 bg-white text-gray-900 placeholder-gray-400"} rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors duration-200`}
              />
            </div>

            <div className="space-y-3 max-h-[50vh] lg:max-h-[55vh] overflow-y-auto pr-1">
              {filteredAttachments.length === 0 ? (
                <div className={`text-center py-8 ${theme === "dark" ? "text-gray-500" : "text-gray-400"} text-sm`}>
                  <p>Tidak ada lampiran</p>
                  <p className="text-xs mt-1">Coba kata kunci lain</p>
                </div>
              ) : (
                filteredAttachments.map((item, idx) => {
                  const isActive = selectedIndex === idx;
                  const itemStatus = normalizeAttachmentStatus(item.status);

                  return (
                    <div
                      key={`attach-${item.id || idx}`}
                      className={`w-full rounded-xl border-2 transition-all ${
                        isActive
                          ? `border-blue-600 ${theme === "dark" ? "bg-blue-900/30 shadow-lg shadow-blue-900/20" : "bg-blue-50 shadow-md"}`
                          : theme === "dark"
                          ? "border-gray-700 hover:border-gray-600"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <button onClick={() => setSelectedIndex(idx)} className="w-full text-left p-3">
                        <div className="flex items-start gap-3">
                          {item.type === "image" ? (
                            <img src={item.url || item.data} alt={item.name} className="w-12 h-10 object-cover rounded-lg flex-shrink-0" />
                          ) : item.type === "link" ? (
                            <div className={`w-12 h-10 flex items-center justify-center rounded-lg text-lg flex-shrink-0 ${theme === "dark" ? "bg-blue-900/50 text-blue-400" : "bg-blue-100 text-blue-700"}`}>
                              🔗
                            </div>
                          ) : (
                            <div className={`w-12 h-10 flex items-center justify-center rounded-lg text-lg flex-shrink-0 ${theme === "dark" ? "bg-gray-700 text-gray-400" : "bg-gray-100 text-gray-600"}`}>
                              📄
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className={`text-sm font-medium ${theme === "dark" ? "text-gray-200" : "text-gray-800"} truncate`}>{item.label}</div>
                            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                              <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${decisionBadgeClass(itemStatus, theme)}`}>
                                {getDecisionIcon(itemStatus)} {getAttachmentStatusLabel(item.status)}
                              </span>
                              {item.description && (
                                <span className={`text-[10px] ${theme === "dark" ? "text-blue-400" : "text-blue-500"}`} title={item.description}>
                                  💬
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </button>

                      <div className={`flex gap-1 px-3 pb-3 ${isActive ? "border-t pt-2" : ""} ${theme === "dark" ? "border-gray-700" : "border-gray-200"}`}>
                        {isAdmin && (
                          <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!loading) {
                              handleStatusChange(item, "approved");
                            }
                          }}
                          disabled={itemStatus === "approved" || loading}
                          className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center justify-center gap-1 ${
                            itemStatus === "approved" || loading
                              ? "bg-green-200 text-green-500 dark:bg-green-900/50 dark:text-green-300 cursor-not-allowed opacity-50"
                              : "bg-green-600 text-white hover:bg-green-700"
                          }`}
                        >
                          {loading ? "⏳" : "✓"} Approve
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!loading) {
                              handleStatusChange(item, "rejected");
                            }
                          }}
                          disabled={itemStatus === "rejected" || loading}
                          className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center justify-center gap-1 ${
                            itemStatus === "rejected" || loading
                              ? "bg-red-200 text-red-500 dark:bg-red-900/50 dark:text-red-300 cursor-not-allowed opacity-50"
                              : "bg-red-600 text-white hover:bg-red-700"
                          }`}
                        >
                          {loading ? "⏳" : "✗"} Reject
                        </button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className={`${theme === "dark" ? "bg-gray-700/50" : "bg-gray-50"} rounded-2xl p-4 sm:p-6 min-h-[300px] transition-colors duration-200`}>
              {activeAttachment ? (
                <div className="flex flex-col gap-4">
                  {activeAttachment.description && (
                    <div className={`${theme === "dark" ? "bg-blue-900/30 border-blue-700" : "bg-blue-50 border-blue-200"} border rounded-xl p-4`}>
                      <p className={`text-sm ${theme === "dark" ? "text-blue-300" : "text-blue-800"}`}>{activeAttachment.description}</p>
                    </div>
                  )}

                  <div className="flex items-center gap-3 flex-wrap">
                    <span className={`text-xs px-3 py-1 rounded-full border ${decisionBadgeClass(normalizeAttachmentStatus(activeAttachment.status), theme)}`}>
                      {getDecisionIcon(normalizeAttachmentStatus(activeAttachment.status))} {getAttachmentStatusLabel(activeAttachment.status)}
                    </span>
                    <span className={`text-xs ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`}>
                      {formatDate(activeAttachment.createdAt)}
                    </span>
                    {activeAttachment.type === "link" && (
                      <span className={`text-xs ${theme === "dark" ? "bg-blue-900 text-blue-300" : "bg-blue-100 text-blue-700"} px-2 py-0.5 rounded-full`}>Link</span>
                    )}
                    {activeAttachment.type === "image" && (
                      <span className={`text-xs ${theme === "dark" ? "bg-purple-900 text-purple-300" : "bg-purple-100 text-purple-700"} px-2 py-0.5 rounded-full`}>Gambar</span>
                    )}
                    {activeAttachment.type === "module" && (
                      <span className={`text-xs ${theme === "dark" ? "bg-red-900 text-red-300" : "bg-red-100 text-red-700"} px-2 py-0.5 rounded-full`}>PDF</span>
                    )}
                  </div>

                  {activeAttachment.type === "image" ? (
                    <div className={`relative rounded-2xl overflow-hidden ${theme === "dark" ? "bg-gray-800" : "bg-gray-900"} min-h-[300px] flex items-center justify-center`}>
                      <img
                        src={activeAttachment.url}
                        alt={activeAttachment.name}
                        className="w-full max-h-[60vh] object-contain"
                        onError={(e) => {
                          e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect width='200' height='200' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%239ca3af' font-family='sans-serif' font-size='14'%3EGagal memuat gambar%3C/text%3E%3C/svg%3E";
                        }}
                      />
                    </div>
                  ) : activeAttachment.type === "link" ? (
                    <div className={`rounded-2xl border-2 border-dashed ${theme === "dark" ? "border-blue-700 bg-blue-900/20" : "border-blue-300 bg-blue-50/50"} p-8 text-center min-h-[200px] flex flex-col items-center justify-center`}>
                      <div className="text-5xl mb-4">🔗</div>
                      <div className={`text-sm font-semibold ${theme === "dark" ? "text-gray-200" : "text-gray-800"} mb-4 break-all`}>
                        {activeAttachment.name || activeAttachment.label}
                      </div>
                      <a href={activeAttachment.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition">
                        Buka Link
                      </a>
                    </div>
                  ) : (
                    <div className={`rounded-2xl border-2 border-dashed ${theme === "dark" ? "border-gray-700 bg-gray-800/50" : "border-gray-300 bg-gray-50"} p-8 text-center min-h-[200px] flex flex-col items-center justify-center`}>
                      <div className="text-5xl mb-4">📄</div>
                      <div className={`text-sm font-semibold ${theme === "dark" ? "text-gray-200" : "text-gray-800"} mb-4`}>
                        {activeAttachment.name || activeAttachment.label}
                      </div>
                      <a
                        href={`/api/projects/download?file=${encodeURIComponent(activeAttachment.url)}`}
                        className="inline-flex items-center gap-2 rounded-xl bg-gray-800 px-6 py-3 text-sm font-semibold text-white hover:bg-gray-900 transition"
                      >
                        Unduh {activeAttachment.name || "File"}
                      </a>
                    </div>
                  )}
                </div>
              ) : (
                <div className={`text-center py-12 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                  <p className="text-4xl mb-3">📎</p>
                  <p>Pilih lampiran untuk melihat detail</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className={`sticky bottom-0 ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"} border-t px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-3`}>
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
              Progress:
            </span>
            <span className={`text-xs px-3 py-1 rounded-full ${
              progressPercent === 100 
                ? "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300"
                : progressPercent >= 70 
                ? "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300"
                : progressPercent >= 40 
                ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300"
                : "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300"
            }`}>
              {progressPercent}%
            </span>
            <span className={`text-xs px-3 py-1 rounded-full ${theme === "dark" ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-600"}`}>
              {approvedItems}/{totalItems} approved
            </span>
            {status && (
              <>
                <span className={`text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                  Status:
                </span>
                <span className={`text-xs px-3 py-1 rounded-full border ${decisionBadgeClass(status, theme)}`}>
                  {getDecisionIcon(status)} {getDecisionLabel(status)}
                </span>
              </>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {isAdmin && (
              <>
            <button
              onClick={() => onApproveAll(role)}
              disabled={allAttachmentsApproved || loading}
              className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              Approve All
            </button>
            <button
              onClick={() => onResetAll(role)}
              disabled={loading}
              className={`px-4 py-2 rounded-xl border ${theme === "dark" ? "border-gray-600 bg-gray-700 text-gray-200 hover:bg-gray-600" : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"} text-sm font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2`}
            >
              Reset All
            </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── KOMPONEN UTAMA ────────────────────────────────────────────
function Progres({ theme, setTheme, userData, selectedProject }) {
  const isAdmin = userData?.role?.toUpperCase() === "ADMIN" || userData?.canApprove === true;
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterDate, setFilterDate] = useState("");
  const [moduleSearch, setModuleSearch] = useState("");
  const [selectedModuleName, setSelectedModuleName] = useState(selectedProject || null);
  const [roleSearch, setRoleSearch] = useState("");
  const [detailRoleId, setDetailRoleId] = useState(null);

  // 🔥 EFFECT UNTUK SELECTED PROJECT DARI PARENT
  useEffect(() => {
    if (selectedProject) {
      console.log(`📋 [Progres] Setting selected module to: ${selectedProject}`);
      setSelectedModuleName(selectedProject);
    }
  }, [selectedProject]);

  // ─── FETCH PROJECTS ──────────────────────────────────────────
  const fetchProjects = async () => {
    try {
      console.log('🔄 [Progres] Fetching projects...');
      setLoading(true);
      
      const data = await fetchWithAuth("/api/projects");
      
      if (data.success) {
        const nextProjects = data.projects || [];
        setProjects(nextProjects);
        console.log('✅ [Progres] Projects fetched:', nextProjects.length);
        return nextProjects;
      }
      return [];
    } catch (error) {
      console.error("❌ Fetch projects error:", error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
    
    const handleRefresh = () => {
      console.log('🔄 [Progres] Refresh triggered by notification');
      fetchProjects();
    };
    
    window.addEventListener('refresh-progress', handleRefresh);
    
    return () => {
      window.removeEventListener('refresh-progress', handleRefresh);
    };
  }, []);

  useEffect(() => {
    setRoleSearch("");
    setDetailRoleId(null);
  }, [selectedModuleName]);

  const syncProjectState = (updatedProject) => {
    if (!updatedProject?.id) return;
    setProjects((prev) =>
      prev.map((project) => (project.id === updatedProject.id ? { ...project, ...updatedProject } : project))
    );
  };

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesDate = !filterDate || project.date === filterDate;
      return matchesDate;
    });
  }, [projects, filterDate]);

  const modules = useMemo(() => {
    const map = new Map();
    filteredProjects.forEach((project) => {
      const key = project.name || "(Tanpa Nama)";
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(project);
    });

    const list = Array.from(map.entries()).map(([name, roles]) => {
      const totalRole = roles.length;
      const totalProgress = roles.reduce((sum, r) => sum + (Number(r.progress) || 0), 0);
      const avgProgress = totalRole > 0 ? Math.round(totalProgress / totalRole) : 0;

      const decisions = roles.map((r) => normalizeDecision(r.decision));
      let status = "pending";
      if (decisions.length > 0 && decisions.every((d) => d === "approved")) status = "approved";
      else if (decisions.some((d) => d === "rejected")) status = "rejected";

      return { name, roles, totalRole, avgProgress, status };
    });

    const search = moduleSearch.trim().toLowerCase();
    return search ? list.filter((m) => m.name.toLowerCase().includes(search)) : list;
  }, [filteredProjects, moduleSearch]);

  const activeModuleRoles = useMemo(() => {
    if (!selectedModuleName) return [];
    return projects.filter((p) => (p.name || "(Tanpa Nama)") === selectedModuleName);
  }, [projects, selectedModuleName]);

  const filteredRoles = useMemo(() => {
    const search = roleSearch.trim().toLowerCase();
    if (!search) return activeModuleRoles;
    return activeModuleRoles.filter((role) => {
      return (
        role.user?.email?.toLowerCase().includes(search) ||
        role.position?.toLowerCase().includes(search) ||
        role.user?.position?.toLowerCase().includes(search)
      );
    });
  }, [activeModuleRoles, roleSearch]);

  const activeModuleAllApproved =
    activeModuleRoles.length > 0 && activeModuleRoles.every((r) => normalizeDecision(r.decision) === "approved");

  const overallModuleProgress = useMemo(() => {
    if (activeModuleRoles.length === 0) return 0;
    
    const totalProgress = activeModuleRoles.reduce((sum, role) => {
      return sum + (Number(role.progress) || 0);
    }, 0);
    
    const average = Math.round(totalProgress / activeModuleRoles.length);
    
    const allComplete = activeModuleRoles.every(role => Number(role.progress) >= 100);
    if (allComplete && activeModuleRoles.length > 0) {
      return 100;
    }
    
    return Math.min(average, 100);
  }, [activeModuleRoles]);

  const detailRole = useMemo(
    () => activeModuleRoles.find((r) => r.id === detailRoleId) || null,
    [activeModuleRoles, detailRoleId]
  );

  // ─── HANDLE ROLE DECISION ────────────────────────────────────
  const handleRoleDecision = async (role, decision) => {
    const normalizedDecision = normalizeDecision(decision);
    const decisionLabel = getDecisionLabel(decision);

    syncProjectState({ ...role, decision: normalizedDecision });

    try {
      const data = await fetchWithAuth(`/api/projects/${role.id}`, {
        method: "PATCH",
        body: JSON.stringify({ decision: normalizedDecision, skipNotification: true }),
      });
      
      if (data.success) {
        syncProjectState(data.project);
        showToast('success', `${decision === 'approved' ? '✓' : decision === 'rejected' ? '✗' : '○'} ${decisionLabel}`, `Role "${role.user?.email || role.position}" telah di-${decisionLabel.toLowerCase()}`);
        
        const statusIcon = decision === 'approved' ? '✓' : decision === 'rejected' ? '✗' : '○';
        const notifType = decision === 'approved' ? 'success' : decision === 'rejected' ? 'error' : 'info';
        const statusLabel = decisionLabel.toLowerCase();
        
        // 🔥 1. Kirim notifikasi ke ADMIN (yang melakukan aksi)
        await addNotificationToAdmin(
          `${statusIcon} Role ${decisionLabel}`,
          `Role "${role.user?.email || role.position}" pada module "${role.name}" telah di-${statusLabel}`,
          notifType
        );
        
        // 🔥 2. Kirim notifikasi ke MEMBER (pemilik role/project)
        if (role.user?.id) {
          console.log(`📢 [Progres] Sending notification to MEMBER ${role.user.id} for role decision`);
          await addNotificationToMember(
            role.user.id,
            `${statusIcon} Project ${decisionLabel}`,
            `Project "${role.name}" Anda telah di-${statusLabel} oleh admin`,
            notifType,
            role.name
          );
        }
        
        // 🔥 3. Kirim notifikasi ke ALL MEMBERS yang terlibat dalam project ini
        const allRolesInProject = projects.filter(p => p.name === role.name);
        for (const r of allRolesInProject) {
          if (r.user?.id && r.user.id !== role.user?.id && r.user.id !== userData?.id) {
            console.log(`📢 [Progres] Sending notification to other member ${r.user.id} in same project`);
            await addNotificationToMember(
              r.user.id,
              `${statusIcon} Update Project ${decisionLabel}`,
              `Project "${role.name}" telah di-${statusLabel} oleh admin`,
              notifType,
              role.name
            );
          }
        }
      }
    } catch (error) {
      console.error("❌ Role decision error:", error);
      showToast('error', '✗ Gagal', error.message || 'Terjadi kesalahan saat mengupdate status');
      syncProjectState(role);
    }
  };

  // ─── HANDLE APPROVE ALL ROLES ───────────────────────────────
  const handleApproveAllRoles = async () => {
    if (!selectedModuleName || activeModuleRoles.length === 0) return;

    const rolesToNotify = [...activeModuleRoles];

    activeModuleRoles.forEach((role) => {
      syncProjectState({ ...role, decision: "approved" });
    });

    try {
      await Promise.all(
        activeModuleRoles.map((role) =>
          fetchWithAuth(`/api/projects/${role.id}`, {
            method: "PATCH",
            body: JSON.stringify({ decision: "approved", skipNotification: true }),
          })
        )
      );

      showToast('success', '✓ Berhasil', `Semua role pada module "${selectedModuleName}" telah di-approve`);
      
      // 🔥 1. Kirim notifikasi ke ADMIN
      await addNotificationToAdmin(
        `✓ Semua Role di-approve`,
        `Semua role pada module "${selectedModuleName}" telah di-approve`,
        'success'
      );
      
      // 🔥 2. Kirim notifikasi ke setiap MEMBER
      for (const role of rolesToNotify) {
        if (role.user?.id) {
          await addNotificationToMember(
            role.user.id,
            `✓ Project ${role.name} Disetujui`,
            `Project "${role.name}" Anda telah disetujui oleh admin`,
            'success',
            role.name
          );
        }
      }

      const updated = await fetchProjects();
      updated.filter((p) => (p.name || "(Tanpa Nama)") === selectedModuleName).forEach((p) => syncProjectState(p));
    } catch (error) {
      console.error("❌ Approve all roles error:", error);
      showToast('error', '✗ Gagal', 'Terjadi kesalahan saat approve semua role');
    }
  };

  // ─── HANDLE RESET ALL ROLES ─────────────────────────────────
  const handleResetAllRoles = async () => {
    if (!selectedModuleName || activeModuleRoles.length === 0) return;
    
    const result = await Swal.fire({
      title: 'Yakin ingin mereset?',
      text: `Semua status role pada module "${selectedModuleName}" akan direset ke Pending`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, Reset!',
      cancelButtonText: 'Batal'
    });

    if (!result.isConfirmed) return;

    const rolesToNotify = [...activeModuleRoles];

    activeModuleRoles.forEach((role) => {
      syncProjectState({ ...role, decision: "pending" });
    });

    try {
      await Promise.all(
        activeModuleRoles.map((role) =>
          fetchWithAuth(`/api/projects/${role.id}`, {
            method: "PATCH",
            body: JSON.stringify({ decision: "pending", skipNotification: true }),
          })
        )
      );

      showToast('info', '○ Reset', `Semua status role pada module "${selectedModuleName}" telah direset ke Pending`);
      
      await addNotificationToAdmin(
        `○ Reset Semua Role`,
        `Semua status role pada module "${selectedModuleName}" telah direset ke Pending`,
        'info'
      );
      
      for (const role of rolesToNotify) {
        if (role.user?.id) {
          await addNotificationToMember(
            role.user.id,
            `○ Status Direset`,
            `Status project "${role.name}" Anda telah direset ke Pending oleh admin`,
            'info',
            role.name
          );
        }
      }

      const updated = await fetchProjects();
      updated.filter((p) => (p.name || "(Tanpa Nama)") === selectedModuleName).forEach((p) => syncProjectState(p));
    } catch (error) {
      console.error("❌ Reset all roles error:", error);
      showToast('error', '✗ Gagal', 'Terjadi kesalahan saat reset semua role');
    }
  };

  // ─── HANDLE DELETE ROLE ──────────────────────────────────────
  const handleDeleteRole = async (role) => {
    const result = await Swal.fire({
      title: 'Yakin ingin menghapus?',
      text: `Role "${role.user?.email || role.position}" akan dihapus permanen`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal'
    });

    if (!result.isConfirmed) return;

    try {
      await fetchWithAuth(`/api/projects/${role.id}`, { 
        method: "DELETE",
      });
      
      setProjects((prev) => prev.filter((p) => p.id !== role.id));
      if (detailRoleId === role.id) setDetailRoleId(null);

      showToast('success', '✓ Dihapus', `Role "${role.user?.email || role.position}" telah dihapus`);
      
      await addNotificationToAdmin(
        `🗑 Role Dihapus`,
        `Role "${role.user?.email || role.position}" pada module "${role.name}" telah dihapus`,
        'error'
      );
    } catch (error) {
      console.error("❌ Delete role error:", error);
      showToast('error', '✗ Gagal', error.message || 'Terjadi kesalahan saat menghapus role');
    }
  };

  // ─── HANDLE ATTACHMENT STATUS ───────────────────────────────
  const handleAttachmentStatus = async (role, attachment, status) => {
    const normalizedStatus = normalizeAttachmentStatus(status);
    const nextOverrides = { 
      ...(role.attachmentStatusOverrides || {}), 
      [attachment.id]: normalizedStatus 
    };

    const attachments = getRoleAttachments(role);
    const updatedAttachments = attachments.map(item => 
      item.id === attachment.id ? { ...item, status: normalizedStatus } : item
    );
    const approvedCount = updatedAttachments.filter(a => 
      normalizeAttachmentStatus(a.status) === "approved"
    ).length;
    const newProgress = attachments.length > 0 
      ? Math.round((approvedCount / attachments.length) * 100) 
      : 0;

    const optimisticRole = {
      ...role,
      progress: newProgress,
      attachmentStatusOverrides: nextOverrides,
      attachments: (role.attachments || []).map((item) => 
        item.id === attachment.id ? { ...item, status: normalizedStatus } : item
      ),
    };
    syncProjectState(optimisticRole);

    try {
      const data = await fetchWithAuth(`/api/projects/${role.id}`, {
        method: "PATCH",
        body: JSON.stringify({ 
          progress: newProgress,
          attachmentStatusOverrides: nextOverrides,
          skipNotification: true 
        }),
      });
      
      if (data.success) {
        syncProjectState(data.project);
        
        const statusIcon = normalizedStatus === 'approved' ? '✓' : '✗';
        const notifType = normalizedStatus === 'approved' ? 'success' : 'error';
        const statusLabel = getAttachmentStatusLabel(normalizedStatus).toLowerCase();
        
        await addNotificationToAdmin(
          `${statusIcon} Lampiran ${getAttachmentStatusLabel(normalizedStatus)}`,
          `Lampiran "${attachment.label}" pada role "${role.user?.email || role.position}" telah di-${statusLabel}`,
          notifType
        );
        
        if (role.user?.id) {
          await addNotificationToMember(
            role.user.id,
            `${statusIcon} Lampiran ${getAttachmentStatusLabel(normalizedStatus)}`,
            `Lampiran "${attachment.label}" pada project "${role.name}" Anda telah di-${statusLabel}`,
            notifType,
            role.name
          );
        }
        
        const allAttachments = getRoleAttachments(data.project);
        const allApproved = allAttachments.every(a => 
          normalizeAttachmentStatus(a.status) === "approved"
        );
        
        if (allApproved && role.user?.id) {
          await addNotificationToMember(
            role.user.id,
            `✓ Semua Lampiran Selesai`,
            `Semua lampiran pada project "${role.name}" Anda telah selesai direview dan disetujui!`,
            'success',
            role.name
          );
        }
        
      } else {
        syncProjectState(role);
        throw new Error(data.message || 'Gagal update status');
      }
    } catch (error) {
      console.error("❌ Update attachment status error:", error);
      syncProjectState(role);
      throw error;
    }
  };

  // ─── HANDLE APPROVE ALL ATTACHMENTS ─────────────────────────
  const handleApproveAllAttachmentsForRole = async (role) => {
    const allAttachments = getRoleAttachments(role);
    const overrides = { ...(role.attachmentStatusOverrides || {}) };
    const attachmentIds = [];

    allAttachments.forEach((att) => {
      overrides[att.id] = "approved";
      if (att.id && !att.id.toString().startsWith('image-') && !att.id.toString().startsWith('module-') && !att.id.toString().startsWith('repo-')) {
        attachmentIds.push(att.id);
      }
    });

    const newProgress = allAttachments.length > 0 ? 100 : 0;

    const optimisticRole = { 
      ...role, 
      decision: "approved", 
      progress: newProgress,
      attachmentStatusOverrides: overrides 
    };
    syncProjectState(optimisticRole);

    try {
      for (const attId of attachmentIds) {
        await fetchWithAuth(`/api/projects/attachments/${attId}`, {
          method: 'PATCH',
          body: JSON.stringify({ status: 'approved' }),
        });
      }

      await fetchWithAuth(`/api/projects/${role.id}`, {
        method: "PATCH",
        body: JSON.stringify({ 
          decision: "approved", 
          progress: newProgress,
          attachmentStatusOverrides: overrides,
          skipNotification: true 
        }),
      });

      showToast('success', '✓ Berhasil', `Semua lampiran pada role "${role.user?.email || role.position}" telah di-approve`);
      
      await addNotificationToAdmin(
        `✓ Semua Lampiran di-approve`,
        `Semua lampiran pada role "${role.user?.email || role.position}" telah di-approve`,
        'success'
      );
      
      if (role.user?.id) {
        await addNotificationToMember(
          role.user.id,
          `✓ Semua Lampiran Disetujui`,
          `Semua lampiran pada project "${role.name}" Anda telah disetujui`,
          'success',
          role.name
        );
      }

      const updated = await fetchProjects();
      const updatedRole = updated.find((p) => p.id === role.id);
      if (updatedRole) syncProjectState(updatedRole);
    } catch (error) {
      console.error("❌ Approve all attachments error:", error);
      showToast('error', '✗ Gagal', error.message || 'Terjadi kesalahan saat approve semua lampiran');
      syncProjectState(role);
    }
  };

  // ─── HANDLE RESET ALL ATTACHMENTS ───────────────────────────
  const handleResetAllForRole = async (role) => {
    const result = await Swal.fire({
      title: 'Yakin ingin mereset?',
      text: `Semua status pada role "${role.user?.email || role.position}" akan direset ke Pending`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, Reset!',
      cancelButtonText: 'Batal'
    });

    if (!result.isConfirmed) return;

    const allAttachments = getRoleAttachments(role);
    const overrides = { ...(role.attachmentStatusOverrides || {}) };
    const attachmentIds = [];

    allAttachments.forEach((att) => {
      overrides[att.id] = "pending";
      if (att.id && !att.id.toString().startsWith('image-') && !att.id.toString().startsWith('module-') && !att.id.toString().startsWith('repo-')) {
        attachmentIds.push(att.id);
      }
    });

    const newProgress = 0;

    const optimisticRole = { 
      ...role, 
      decision: "pending", 
      progress: newProgress,
      attachmentStatusOverrides: overrides 
    };
    syncProjectState(optimisticRole);

    try {
      for (const attId of attachmentIds) {
        await fetchWithAuth(`/api/projects/attachments/${attId}`, {
          method: 'PATCH',
          body: JSON.stringify({ status: 'pending' }),
        });
      }

      await fetchWithAuth(`/api/projects/${role.id}`, {
        method: "PATCH",
        body: JSON.stringify({ 
          decision: "pending", 
          progress: newProgress,
          attachmentStatusOverrides: overrides,
          skipNotification: true 
        }),
      });

      showToast('info', '○ Reset', `Semua status pada role "${role.user?.email || role.position}" telah direset ke Pending`);
      
      await addNotificationToAdmin(
        `○ Reset Semua Status`,
        `Semua status pada role "${role.user?.email || role.position}" telah direset ke Pending`,
        'info'
      );
      
      if (role.user?.id) {
        await addNotificationToMember(
          role.user.id,
          `○ Status Direset`,
          `Status project "${role.name}" Anda telah direset ke Pending oleh admin`,
          'info',
          role.name
        );
      }

      const updated = await fetchProjects();
      const updatedRole = updated.find((p) => p.id === role.id);
      if (updatedRole) syncProjectState(updatedRole);
    } catch (error) {
      console.error("❌ Reset all error:", error);
      showToast('error', '✗ Gagal', error.message || 'Terjadi kesalahan saat reset semua status');
      syncProjectState(role);
    }
  };

  // ─── HANDLE DELETE MODULE (semua project dengan nama sama) ─────
  const handleDeleteModule = async (mod) => {
    const result = await Swal.fire({
      title: 'Hapus Module?',
      text: `Semua ${mod.totalRole} role pada module "${mod.name}" akan dihapus permanen!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal'
    });

    if (!result.isConfirmed) return;

    try {
      showToast('loading', 'Menghapus...', `Menghapus module "${mod.name}"`);
      const roleIds = mod.roles.map((r) => r.id);

      await Promise.all(
        roleIds.map((id) => fetchWithAuth(`/api/projects/${id}`, { method: "DELETE" }))
      );

      await fetchProjects();
      showToast('success', '✓ Terhapus', `Module "${mod.name}" berhasil dihapus`);
    } catch (error) {
      console.error("❌ Delete module error:", error);
      showToast('error', '✗ Gagal', error.message || 'Gagal menghapus module');
    }
  };

  const handleBackToModule = () => {
    setSelectedModuleName(null);
    setRoleSearch("");
    setDetailRoleId(null);
  };

  return (
    <div className={`min-h-screen ${theme === "dark" ? "bg-[#1a1a2e]" : "bg-[#eef2f7]"} p-4 md:p-8 transition-colors duration-200`}>
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <p className={`text-xs font-semibold tracking-widest ${theme === "dark" ? "text-gray-400" : "text-gray-500"} uppercase`}>
            Progress Project
          </p>
          <h1 className={`text-3xl md:text-4xl font-bold ${theme === "dark" ? "text-white" : "text-[#001d55]"} mt-2`}>
            {selectedModuleName ? selectedModuleName : "Daftar Module"}
          </h1>
        </div>

        <div className={`${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"} rounded-2xl shadow-sm border p-5 md:p-8 transition-colors duration-200`}>
          {!selectedModuleName ? (
            <>
              {projects.length > 0 && (
                <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                  <div className="grid gap-4 md:grid-cols-2 w-full md:w-auto">
                    <div className="flex flex-col gap-2">
                      <label className={`text-sm font-semibold ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                        Filter Tanggal
                      </label>
                      <input
                        type="date"
                        value={filterDate}
                        onChange={(e) => setFilterDate(e.target.value)}
                        className={`w-full h-12 border ${theme === "dark" ? "border-gray-600 bg-gray-700 text-white" : "border-gray-300 bg-white text-gray-900"} rounded-xl px-4 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors duration-200`}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className={`text-sm font-semibold ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                        Cari Nama Module
                      </label>
                      <input
                        type="text"
                        value={moduleSearch}
                        onChange={(e) => setModuleSearch(e.target.value)}
                        placeholder="Cari module..."
                        className={`w-full h-12 border ${theme === "dark" ? "border-gray-600 bg-gray-700 text-white placeholder-gray-400" : "border-gray-300 bg-white text-gray-900 placeholder-gray-400"} rounded-xl px-4 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors duration-200`}
                      />
                    </div>
                  </div>
                  {(filterDate || moduleSearch) && (
                    <button
                      type="button"
                      onClick={() => {
                        setFilterDate("");
                        setModuleSearch("");
                      }}
                      className={`h-12 px-4 rounded-xl border ${theme === "dark" ? "border-gray-600 bg-gray-700 text-gray-300 hover:bg-gray-600" : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"} transition flex items-center gap-2`}
                    >
                      Reset filter
                    </button>
                  )}
                </div>
              )}

              {loading ? (
                <div className={`text-center py-16 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>Memuat data...</div>
              ) : projects.length === 0 ? (
                <div className={`text-center py-16 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                  Belum ada project yang diupload. Silakan tambah project di halaman Projects.
                </div>
              ) : modules.length === 0 ? (
                <div className={`text-center py-16 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>Tidak ada module yang cocok dengan filter saat ini.</div>
              ) : (
                <div className="overflow-x-auto max-h-[60vh] overflow-y-auto">
                  <table className="w-full text-left border-collapse min-w-[700px]">
                    <thead className={`sticky top-0 z-10 ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
                      <tr className={`border-b ${theme === "dark" ? "border-gray-700" : "border-gray-200"}`}>
                        <th className={`py-4 px-3 text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>Nama Module</th>
                        <th className={`py-4 px-3 text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>Total Role</th>
                        <th className={`py-4 px-3 text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>Progress</th>
                        <th className={`py-4 px-3 text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>Status</th>
                        <th className={`py-4 px-3 text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {modules.map((module) => (
                        <tr
                          key={module.name}
                          className={`border-b ${theme === "dark" ? "border-gray-700 hover:bg-gray-700/50" : "border-gray-100 hover:bg-gray-50"} transition`}
                        >
                          <td className={`py-4 px-3 font-medium ${theme === "dark" ? "text-gray-200" : "text-gray-700"}`}>{module.name}</td>
                          <td className={`py-4 px-3 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>{module.totalRole} role</td>
                          <td className="py-4 px-3">
                            <div className="flex items-center gap-3 min-w-[140px]">
                              <span className={`text-sm font-semibold ${theme === "dark" ? "text-blue-400" : "text-[#001d55]"}`}>{module.avgProgress}%</span>
                              <div className={`w-full ${theme === "dark" ? "bg-gray-700" : "bg-gray-200"} h-2 rounded-full overflow-hidden`}>
                                <div className="h-2 rounded-full bg-[#001d55]" style={{ width: `${module.avgProgress}%` }} />
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-3">
                            <span className={`text-xs px-2 py-1 rounded-full border ${decisionBadgeClass(module.status, theme)}`}>
                              {getDecisionIcon(module.status)} {getDecisionLabel(module.status)}
                            </span>
                          </td>
                          <td className="py-4 px-3">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedModuleName(module.name);
                                }}
                                className={`text-sm ${theme === "dark" ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:underline"}`}
                              >
                                Lihat Detail
                              </button>
                              {isAdmin && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteModule(module);
                                  }}
                                  className={`text-sm ${theme === "dark" ? "text-red-400 hover:text-red-300" : "text-red-500 hover:text-red-700"}`}
                                >
                                  Hapus
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          ) : (
            <>
              <div className="mb-5">
                <button
                  type="button"
                  onClick={handleBackToModule}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition ${
                    theme === "dark" 
                      ? "bg-gray-700 hover:bg-gray-600 text-gray-200" 
                      : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                  }`}
                >
                  ← Kembali ke Daftar Module
                </button>
              </div>

              <div className={`mb-6 rounded-2xl border p-5 ${theme === "dark" ? "border-gray-700 bg-gray-700/30" : "border-gray-200 bg-gray-50"}`}>
                <div className="flex items-center justify-between mb-2">
                  <p className={`text-sm font-semibold ${theme === "dark" ? "text-gray-200" : "text-gray-800"}`}>
                    Persentase Progres Keseluruhan
                  </p>
                  <span className={`text-xl font-bold ${
                    overallModuleProgress === 100 
                      ? "text-green-600" 
                      : theme === "dark" ? "text-blue-400" : "text-[#001d55]"
                  }`}>
                    {overallModuleProgress}%
                  </span>
                </div>
                <div className={`w-full h-3 rounded-full overflow-hidden ${theme === "dark" ? "bg-gray-700" : "bg-gray-200"}`}>
                  <div 
                    className={`h-3 rounded-full transition-all duration-500 ${
                      overallModuleProgress === 100 
                        ? "bg-green-600" 
                        : overallModuleProgress >= 70 
                        ? "bg-blue-600" 
                        : overallModuleProgress >= 40 
                        ? "bg-yellow-600" 
                        : "bg-red-600"
                    }`} 
                    style={{ width: `${overallModuleProgress}%` }} 
                  />
                </div>
                <div className="flex justify-between text-xs mt-1">
                  <span className={theme === "dark" ? "text-gray-500" : "text-gray-400"}>0%</span>
                  <span className={theme === "dark" ? "text-gray-500" : "text-gray-400"}>75%</span>
                  <span className={theme === "dark" ? "text-gray-500" : "text-gray-400"}>100%</span>
                </div>
                <p className={`text-xs mt-2 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                  Rata-rata progress dari {activeModuleRoles.length} role pada module ini.
                  {overallModuleProgress === 100 && " ✓ Semua role sudah selesai!"}
                </p>
              </div>

              <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="relative flex-1 md:w-72">
                  <input
                    type="text"
                    value={roleSearch}
                    onChange={(e) => setRoleSearch(e.target.value)}
                    placeholder="Cari role (email / posisi)..."
                    className={`w-full h-11 pl-9 border ${theme === "dark" ? "border-gray-600 bg-gray-700 text-white placeholder-gray-400" : "border-gray-300 bg-white text-gray-900 placeholder-gray-400"} rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors duration-200`}
                  />
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {isAdmin && (
                    <>
                  <button
                    onClick={handleApproveAllRoles}
                    disabled={activeModuleAllApproved}
                    className="h-11 px-4 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    Approve All
                  </button>
                  <button
                    onClick={handleResetAllRoles}
                    className={`h-11 px-4 rounded-xl border ${theme === "dark" ? "border-gray-600 bg-gray-700 text-gray-200 hover:bg-gray-600" : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"} text-sm font-semibold transition flex items-center gap-2`}
                  >
                    Reset All
                  </button>
                    </>
                  )}
                </div>
              </div>

              {activeModuleAllApproved && (
                <div className={`mb-4 inline-flex items-center gap-2 text-xs px-3 py-1 rounded-full border ${decisionBadgeClass("approved", theme)}`}>
                  ✓ Semua role pada module ini sudah approved
                </div>
              )}

              {filteredRoles.length === 0 ? (
                <div className={`text-center py-16 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>Tidak ada role yang cocok dengan pencarian.</div>
              ) : (
                <div className="overflow-x-auto max-h-[60vh] overflow-y-auto">
                  <table className="w-full text-left border-collapse min-w-[700px]">
                    <thead className={`sticky top-0 z-10 ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
                      <tr className={`border-b ${theme === "dark" ? "border-gray-700" : "border-gray-200"}`}>
                        <th className={`py-4 px-3 text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>Foto</th>
                        <th className={`py-4 px-3 text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>Email</th>
                        <th className={`py-4 px-3 text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>Posisi</th>
                        <th className={`py-4 px-3 text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>Link</th>
                        <th className={`py-4 px-3 text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>Progress</th>
                        <th className={`py-4 px-3 text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>Status</th>
                        <th className={`py-4 px-3 text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRoles.map((role) => {
                        const status = normalizeDecision(role.decision);
                        const roleProgress = Number(role.progress) || 0;
                        return (
                          <tr key={role.id} className={`border-b ${theme === "dark" ? "border-gray-700 hover:bg-gray-700/50" : "border-gray-100 hover:bg-gray-50"} transition`}>
                            <td className="py-3 px-3">
                              <RoleAvatar project={role} theme={theme} />
                            </td>
                            <td className={`py-3 px-3 ${theme === "dark" ? "text-gray-200" : "text-gray-700"}`}>
                              <div className="text-sm font-medium">{role.user?.email || "-"}</div>
                              <div className={`text-[11px] ${theme === "dark" ? "text-blue-400" : "text-blue-600"}`}>{role.user?.role || "member"}</div>
                            </td>
                            <td className={`py-3 px-3 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>{role.user?.position || role.position || "-"}</td>
                            <td className="py-3 px-3">
                              {role.repoLink ? (
                                <a href={role.repoLink} target="_blank" rel="noreferrer" className={`text-sm ${theme === "dark" ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:underline"}`}>
                                  Buka Link
                                </a>
                              ) : (
                                <span className={`text-sm ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`}>Tidak ada</span>
                              )}
                            </td>
                            <td className="py-3 px-3">
                              <div className="flex items-center gap-3 min-w-[120px]">
                                <span className={`text-sm font-semibold ${
                                  roleProgress === 100 
                                    ? "text-green-600" 
                                    : theme === "dark" ? "text-blue-400" : "text-[#001d55]"
                                }`}>
                                  {roleProgress}%
                                </span>
                                <div className={`w-full ${theme === "dark" ? "bg-gray-700" : "bg-gray-200"} h-2 rounded-full overflow-hidden`}>
                                  <div 
                                    className={`h-2 rounded-full transition-all duration-500 ${
                                      roleProgress === 100 
                                        ? "bg-green-600" 
                                        : roleProgress >= 70 
                                        ? "bg-blue-600" 
                                        : roleProgress >= 40 
                                        ? "bg-yellow-600" 
                                        : "bg-red-600"
                                    }`} 
                                    style={{ width: `${roleProgress}%` }} 
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-3">
                              <span className={`text-xs px-2 py-1 rounded-full border ${decisionBadgeClass(status, theme)}`}>
                                {getDecisionIcon(status)} {getDecisionLabel(status)}
                              </span>
                            </td>
                            <td className="py-3 px-3">
                              <RoleDropdown
                                role={role}
                                theme={theme}
                                onDecision={handleRoleDecision}
                                onDelete={handleDeleteRole}
                                onViewDetail={(r) => setDetailRoleId(r.id)}
                                isAdmin={isAdmin}
                              />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {detailRole && (
        <RoleDetailModal
          role={detailRole}
          theme={theme}
          onClose={() => setDetailRoleId(null)}
          onDecision={handleRoleDecision}
          onAttachmentStatus={handleAttachmentStatus}
          onApproveAll={handleApproveAllAttachmentsForRole}
          onResetAll={handleResetAllForRole}
          isAdmin={isAdmin}
        />
      )}
    </div>
  );
}

export default Progres;

export {
  getRoleAttachments,
  normalizeAttachmentStatus,
  getAttachmentStatusLabel,
  formatDate,
  normalizeDecision,
  getDecisionLabel,
  getDecisionIcon,
  decisionBadgeClass,
  RoleAvatar,
  RoleDropdown,
  RoleDetailModal,
  showToast,
  addNotificationToUser,
  addNotificationToAdmin,
  addNotificationToMember,
  getNotificationLink,
};