import { useState, useEffect, useRef } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
  ROLES,
  ROLE_LABELS,
  ROLE_COLORS,
  SENDER_TARGET_MAP,
  ISSUE_TYPES,
  ISSUE_TYPE_LABELS,
  PROGRESS_LABELS,
  APPROVAL_LABELS,
} from "../../../lib/revisionConfig.js";

// ─── Helpers ─────────────────────────────────────────────────────────────────

const isImageFile = (name) => /\.(jpe?g|png|gif|webp|svg)$/i.test(name ?? "");
const isPdfFile   = (name) => /\.pdf$/i.test(name ?? "");

const formatDate = (iso) => {
  try {
    return new Date(iso).toLocaleDateString("id-ID", {
      day: "2-digit", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  } catch {
    return iso;
  }
};

const approvalColor = (a, theme) =>
  a === "APPROVED" 
    ? theme === 'dark' ? "bg-emerald-900 text-emerald-300" : "bg-emerald-100 text-emerald-700"
    : a === "REJECTED" 
      ? theme === 'dark' ? "bg-red-900 text-red-300" : "bg-red-100 text-red-700"
      : theme === 'dark' ? "bg-amber-900 text-amber-300" : "bg-amber-100 text-amber-700";

// ─── Komponen kecil ───────────────────────────────────────────────────────────

function RoleBadge({ role, size = "sm", theme = "light" }) {
  const c = ROLE_COLORS[role] ?? { bg: "bg-gray-100", text: "text-gray-600" };
  const darkStyles = theme === 'dark' ? {
    bg: c.bg.replace('bg-gray-100', 'bg-gray-700').replace('bg-blue-100', 'bg-blue-900').replace('bg-green-100', 'bg-green-900').replace('bg-red-100', 'bg-red-900').replace('bg-purple-100', 'bg-purple-900').replace('bg-indigo-100', 'bg-indigo-900').replace('bg-pink-100', 'bg-pink-900').replace('bg-yellow-100', 'bg-yellow-900'),
    text: c.text.replace('text-gray-600', 'text-gray-300').replace('text-blue-700', 'text-blue-300').replace('text-green-700', 'text-green-300').replace('text-red-700', 'text-red-300').replace('text-purple-700', 'text-purple-300').replace('text-indigo-700', 'text-indigo-300').replace('text-pink-700', 'text-pink-300').replace('text-yellow-700', 'text-yellow-300')
  } : c;
  
  return (
    <span className={`inline-flex items-center rounded-full font-semibold ${darkStyles.bg} ${darkStyles.text} ${
      size === "sm" ? "px-2.5 py-0.5 text-xs" : "px-3 py-1 text-sm"
    }`}>
      {role}
    </span>
  );
}

// ─── API helpers ──────────────────────────────────────────────────────────────

async function apiFetch(url, options) {
  try {
    const res = await fetch(url, options);
    
    const text = await res.text();
    
    let json;
    try {
      json = JSON.parse(text);
    } catch (parseError) {
      console.error("Response bukan JSON:", text.substring(0, 200));
      throw new Error(`Server error: ${res.status} - ${res.statusText}`);
    }
    
    if (!res.ok) {
      throw new Error(json.error || json.message || `HTTP ${res.status}: ${res.statusText}`);
    }
    
    return json;
  } catch (error) {
    console.error("API Fetch Error:", error);
    throw error;
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function Revision({ userRole = "QA", userName = "User", theme = "light", setTheme }) {
  const myRole = userRole;

  // Tab
  const [activeTab, setActiveTab] = useState("inbox");

  // ── State inbox ──
  const [inboxReports,  setInboxReports]  = useState([]);
  const [inboxMeta,     setInboxMeta]     = useState({ total: 0, page: 1, totalPages: 1 });
  const [inboxLoading,  setInboxLoading]  = useState(false);
  const [inboxError,    setInboxError]    = useState("");
  const [filterSearch,  setFilterSearch]  = useState("");
  const [filterApproval,setFilterApproval]= useState("");
  const [inboxPage,     setInboxPage]     = useState(1);

  // ── State sent ──
  const [sentReports,  setSentReports]  = useState([]);
  const [sentLoading,  setSentLoading]  = useState(false);

  // ── State form ──
  const [projectName,    setProjectName]    = useState("");
  const [issueType,      setIssueType]      = useState("MODUL");
  const [description,    setDescription]    = useState("");
  const [progress,       setProgress]       = useState("BELUM_DILAKUKAN");
  const [targetRole,     setTargetRole]     = useState("FRONTEND");
  const [attachmentName, setAttachmentName] = useState("");
  const [attachmentData, setAttachmentData] = useState("");
  const [submitting,     setSubmitting]     = useState(false);
  const [submitError,    setSubmitError]    = useState("");

  // Preview gambar
  const [previewImage, setPreviewImage] = useState("");

  const fileRef = useRef(null);

  // ── Reset target ketika myRole berubah ──
  useEffect(() => {
    if (myRole) {
      const targets = SENDER_TARGET_MAP[myRole];
      if (targets && targets.length > 0) {
        setTargetRole(targets[0]);
      } else {
        setTargetRole("FRONTEND");
      }
    }
  }, [myRole]);

  // ── Fetch inbox ──
  const fetchInbox = async () => {
    if (!myRole) return;
    
    setInboxLoading(true);
    setInboxError("");

    const params = new URLSearchParams({
      targetRole: myRole,
      page:       String(inboxPage),
      limit:      "10",
    });
    if (filterSearch)   params.set("search",   filterSearch);
    if (filterApproval) params.set("approval", filterApproval);

    try {
      const json = await apiFetch(`/api/revisions?${params}`);
      setInboxReports(json.data || []);
      setInboxMeta(json.meta || { total: 0, page: 1, totalPages: 1 });
    } catch (err) {
      console.error("Fetch inbox error:", err);
      setInboxError(err.message || "Gagal mengambil data inbox");
      setInboxReports([]);
    } finally {
      setInboxLoading(false);
    }
  };

  // ── Fetch sent ──
  const fetchSent = async () => {
    if (!myRole) return;
    
    setSentLoading(true);
    const params = new URLSearchParams({ 
      senderRole: myRole, 
      limit: "50" 
    });
    try {
      const json = await apiFetch(`/api/revisions?${params}`);
      setSentReports(json.data || []);
    } catch (err) {
      console.error("Fetch sent error:", err);
      setSentReports([]);
    } finally {
      setSentLoading(false);
    }
  };

  // Panggil fetch saat filter/page/role berubah
  useEffect(() => { 
    if (activeTab === "inbox" && myRole) {
      fetchInbox(); 
    }
  }, [myRole, filterSearch, filterApproval, inboxPage, activeTab]);
  
  useEffect(() => { 
    if (activeTab === "sent" && myRole) {
      fetchSent(); 
    }
  }, [myRole, activeTab]);

  // ── File attachment ──
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) { 
      setAttachmentName(""); 
      setAttachmentData(""); 
      return; 
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Ukuran file terlalu besar. Maksimal 5MB.");
      e.target.value = "";
      return;
    }
    setAttachmentName(file.name);
    const reader = new FileReader();
    reader.onload = () => setAttachmentData(reader.result);
    reader.onerror = () => {
      toast.error("Gagal membaca file");
    };
    reader.readAsDataURL(file);
  };

  // ── Submit form ──
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!projectName.trim()) {
      setSubmitError("Nama project wajib diisi");
      toast.error("Nama project wajib diisi");
      return;
    }
    if (!myRole) {
      setSubmitError("Role tidak ditemukan");
      toast.error("Role tidak ditemukan");
      return;
    }
    setSubmitting(true);
    setSubmitError("");
    
    const loadingToast = toast.loading("Mengirim revisi...");

    try {
      const payload = {
        projectName: projectName.trim(),
        issueType,
        description: description.trim() || null,
        progress,
        senderRole: myRole,
        targetRole,
        attachmentName: attachmentName || null,
        attachmentData: attachmentData || null,
      };

      console.log("Submitting payload:", payload);

      const result = await apiFetch("/api/revisions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      console.log("Submit success:", result);

      toast.dismiss(loadingToast);

      if (result.email && result.email.success) {
        toast.success(
          `✅ Revisi berhasil dikirim! Notifikasi email terkirim ke ${result.email.users?.length || 0} penerima.`,
          { duration: 5000 }
        );
      } else {
        toast.success(
          `✅ Revisi berhasil dikirim!`,
          { duration: 4000 }
        );
      }

      // Reset form
      setProjectName("");
      setDescription("");
      setAttachmentName("");
      setAttachmentData("");
      setProgress("BELUM_DILAKUKAN");
      setIssueType("MODUL");
      if (fileRef.current) fileRef.current.value = "";
      
      try {
        await fetchSent();
      } catch (fetchError) {
        console.error("Error fetching sent after submit:", fetchError);
      }
      setActiveTab("sent");
      
    } catch (err) {
      console.error("Submit error:", err);
      toast.dismiss(loadingToast);
      toast.error(`❌ Gagal mengirim revisi: ${err.message}`);
      setSubmitError(err.message || "Gagal mengirim revisi");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Update report (progress / approval) ──
  const updateReport = async (id, changes) => {
    console.log("🔄 Update report - ID:", id);
    console.log("🔄 Changes:", changes);
    
    const loadingToast = toast.loading("Mengupdate revisi...");
    
    try {
      const result = await apiFetch(`/api/revisions?id=${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(changes),
      });
      
      console.log("✅ Update result:", result);
      
      toast.dismiss(loadingToast);
      toast.success("✅ Revisi berhasil diupdate!");
      
      if (result.data) {
        setInboxReports((prev) => 
          prev.map((r) => r.id === id ? { ...r, ...result.data } : r)
        );
        
        setSentReports((prev) => 
          prev.map((r) => r.id === id ? { ...r, ...result.data } : r)
        );
        
        setTimeout(async () => {
          try {
            if (activeTab === "inbox") {
              await fetchInbox();
            }
            if (activeTab === "sent") {
              await fetchSent();
            }
          } catch (refreshError) {
            console.error("Error refreshing after update:", refreshError);
          }
        }, 500);
      }
      
    } catch (err) {
      console.error("❌ Update error:", err);
      toast.dismiss(loadingToast);
      toast.error(`❌ Gagal update: ${err.message}`);
    }
  };

  // ── Delete ──
  const deleteReport = async (id, source) => {
    if (!window.confirm("Yakin hapus laporan ini?")) return;
    
    const loadingToast = toast.loading("Menghapus revisi...");
    
    try {
      await apiFetch(`/api/revisions?id=${id}`, { 
        method: "DELETE" 
      });
      
      toast.dismiss(loadingToast);
      toast.success("✅ Revisi berhasil dihapus!");
      
      if (source === "inbox") {
        setInboxReports((prev) => prev.filter((r) => r.id !== id));
        try {
          await fetchInbox();
        } catch (err) {
          console.error("Error refreshing inbox after delete:", err);
        }
      } else if (source === "sent") {
        setSentReports((prev) => prev.filter((r) => r.id !== id));
        try {
          await fetchSent();
        } catch (err) {
          console.error("Error refreshing sent after delete:", err);
        }
      }
    } catch (err) {
      console.error("Delete error:", err);
      toast.dismiss(loadingToast);
      toast.error(`❌ Gagal hapus: ${err.message}`);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-[#1a1a2e]' : 'bg-[#f4f7fb]'} p-4 md:p-8 transition-colors duration-200`}>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: theme === 'dark' ? '#1a1a2e' : '#363636',
            color: '#fff',
            borderRadius: '12px',
            padding: '16px',
          },
          success: {
            duration: 5000,
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 5000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className={`text-xs font-semibold tracking-widest ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} uppercase`}>
              Revision Issue
            </p>
            <h1 className={`text-3xl md:text-4xl font-bold ${theme === 'dark' ? 'text-white' : 'text-[#001d55]'} mt-1`}>
              Halaman Revision
            </h1>
            <p className={`mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} text-sm`}>
              Laporan masalah modul/project berdasarkan role tim.
            </p>
          </div>

          <div className={`flex items-center gap-3 rounded-2xl border ${theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'} px-4 py-3 shadow-sm transition-colors duration-200`}>
            <span className={`text-sm font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Role saya:</span>
            <RoleBadge role={myRole} size="md" theme={theme} />
            <span className={`text-sm ${theme === 'dark' ? 'text-gray-400 border-gray-700' : 'text-gray-500 border-gray-200'} border-l pl-3`}>
              {userName}
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className={`mb-6 flex gap-2 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} overflow-x-auto`}>
          {[
            { key: "inbox", label: "Inbox",        count: inboxMeta.total },
            { key: "sent",  label: "Terkirim",     count: sentReports.length },
            { key: "new",   label: "Buat Revisi",  count: null },
          ].map((tab) => (
            <button 
              key={tab.key} 
              onClick={() => {
                setActiveTab(tab.key);
                if (tab.key === "inbox") fetchInbox();
                if (tab.key === "sent") fetchSent();
              }}
              className={`pb-3 px-4 text-sm font-semibold transition border-b-2 whitespace-nowrap ${
                activeTab === tab.key
                  ? "border-blue-600 text-blue-600"
                  : `border-transparent ${theme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-800'}`
              }`}
            >
              {tab.label}
              {tab.count !== null && (
                <span className={`ml-2 rounded-full px-2 py-0.5 text-xs ${
                  activeTab === tab.key 
                    ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300" 
                    : theme === 'dark' ? "bg-gray-700 text-gray-400" : "bg-gray-100 text-gray-600"
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ══ TAB INBOX ══ */}
        {activeTab === "inbox" && (
          <section className="space-y-5">
            <div className={`flex flex-wrap gap-3 rounded-3xl border ${theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'} p-4 shadow-sm transition-colors duration-200`}>
              <input
                type="text"
                value={filterSearch}
                onChange={(e) => { setFilterSearch(e.target.value); setInboxPage(1); }}
                placeholder="Cari nama project atau deskripsi..."
                className={`flex-1 min-w-[200px] h-10 rounded-xl border ${theme === 'dark' ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' : 'border-gray-200 bg-white text-gray-900 placeholder-gray-400'} px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors duration-200`}
              />
              <select
                value={filterApproval}
                onChange={(e) => { setFilterApproval(e.target.value); setInboxPage(1); }}
                className={`h-10 rounded-xl border ${theme === 'dark' ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-200 bg-white text-gray-900'} px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors duration-200`}
              >
                <option value="">Semua status</option>
                <option value="PENDING">Pending</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
              </select>
              <button
                onClick={fetchInbox}
                className={`h-10 rounded-xl border ${theme === 'dark' ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'} px-3 text-sm transition`}
              >
                Refresh
              </button>
            </div>

            {inboxLoading && (
              <div className={`rounded-3xl border ${theme === 'dark' ? 'border-gray-700 bg-gray-800 text-gray-400' : 'border bg-white text-gray-400'} p-10 text-center`}>
                Memuat laporan...
              </div>
            )}
            {inboxError && (
              <div className={`rounded-3xl border ${theme === 'dark' ? 'border-red-700 bg-red-900/30 text-red-300' : 'border-red-200 bg-red-50 text-red-700'} p-4 text-sm`}>
                ⚠️ {inboxError}
              </div>
            )}
            {!inboxLoading && !inboxError && inboxReports.length === 0 && (
              <div className={`rounded-3xl border border-dashed ${theme === 'dark' ? 'border-gray-700 bg-gray-800 text-gray-400' : 'border-gray-300 bg-white text-gray-500'} p-12 text-center`}>
                <p className="text-4xl mb-3">📭</p>
                <p className={`font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Belum ada laporan masuk</p>
                <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  Laporan yang ditujukan ke <strong>{ROLE_LABELS[myRole] || myRole}</strong> akan muncul di sini.
                </p>
              </div>
            )}

            <div className="space-y-4">
              {inboxReports.map((report) => (
                <div key={report.id} className={`rounded-3xl border ${theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'} p-5 shadow-sm transition-colors duration-200`}>
                  <div className="flex flex-wrap gap-2 items-start justify-between mb-3">
                    <div className="flex flex-wrap gap-2 items-center">
                      <span className={`text-base font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{report.projectName}</span>
                      <RoleBadge role={report.senderRole} theme={theme} />
                      <span className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>→</span>
                      <RoleBadge role={report.targetRole} theme={theme} />
                      <span className={`rounded-full ${theme === 'dark' ? 'bg-indigo-900 text-indigo-300' : 'bg-indigo-100 text-indigo-700'} px-2.5 py-0.5 text-xs font-semibold`}>
                        {ISSUE_TYPE_LABELS[report.issueType] ?? report.issueType}
                      </span>
                    </div>
                    <div className="flex gap-2 items-center flex-wrap">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${approvalColor(report.approval, theme)}`}>
                        {APPROVAL_LABELS[report.approval] ?? report.approval}
                      </span>
                      <span className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>{formatDate(report.createdAt)}</span>
                    </div>
                  </div>

                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
                    {report.description || <span className={`italic ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>Tidak ada deskripsi.</span>}
                  </p>

                  <div className="grid gap-3 md:grid-cols-3">
                    <div>
                      <label className={`block text-xs font-semibold ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mb-1.5`}>
                        Ubah Progress
                      </label>
                      <select
                        value={report.progress}
                        onChange={(e) => updateReport(report.id, { progress: e.target.value })}
                        className={`w-full h-10 rounded-xl border ${theme === 'dark' ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-200 bg-white text-gray-900'} px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors duration-200`}
                      >
                        <option value="BELUM_DILAKUKAN">Belum dilakukan</option>
                        <option value="SEDANG_DIKERJAKAN">Sedang dikerjakan</option>
                        <option value="SELESAI">Selesai</option>
                      </select>
                    </div>

                    <div>
                      <label className={`block text-xs font-semibold ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mb-1.5`}>
                        Approval
                      </label>
                      <div className="flex gap-2">
                        <button
                          onClick={() => updateReport(report.id, { approval: "APPROVED" })}
                          className="flex-1 h-10 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition"
                        >
                          ✓ Approve
                        </button>
                        <button
                          onClick={() => updateReport(report.id, { approval: "REJECTED" })}
                          className="flex-1 h-10 rounded-xl bg-red-600 text-white text-xs font-semibold hover:bg-red-700 transition"
                        >
                          ✕ Reject
                        </button>
                        <button
                          onClick={() => updateReport(report.id, { approval: "PENDING" })}
                          className={`h-10 px-3 rounded-xl border ${theme === 'dark' ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'} text-xs transition`}
                        >
                          ↩
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      {(report.attachmentData || report.attachmentUrl) && (
                        <div className={`rounded-2xl border border-dashed ${theme === 'dark' ? 'border-gray-600 bg-gray-700/50' : 'border-gray-200 bg-gray-50'} p-3 flex items-center justify-center min-h-[56px] transition-colors duration-200`}>
                          {report.attachmentData && isImageFile(report.attachmentName) ? (
                            <button onClick={() => setPreviewImage(report.attachmentData)}>
                              <img src={report.attachmentData} alt="attachment"
                                className="max-h-16 rounded-xl object-contain" />
                            </button>
                          ) : report.attachmentData && isPdfFile(report.attachmentName) ? (
                            <a href={report.attachmentData} download={report.attachmentName}
                              className={`text-sm ${theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:underline'} flex items-center gap-2`}>
                              <span className={`rounded ${theme === 'dark' ? 'bg-red-900 text-red-300' : 'bg-red-100 text-red-700'} px-1.5 py-0.5 text-xs font-bold`}>PDF</span>
                              {report.attachmentName}
                            </a>
                          ) : report.attachmentUrl ? (
                            <a href={report.attachmentUrl} target="_blank" rel="noreferrer"
                              className={`text-sm ${theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:underline'}`}>
                              {report.attachmentName ?? "Buka lampiran"}
                            </a>
                          ) : null}
                        </div>
                      )}
                      <button
                        onClick={() => deleteReport(report.id, "inbox")}
                        className={`h-9 rounded-2xl border ${theme === 'dark' ? 'border-red-700 bg-red-900/30 text-red-300 hover:bg-red-900/50' : 'border-red-200 bg-red-50 text-red-700 hover:bg-red-100'} text-xs font-semibold transition`}
                      >
                        Hapus laporan
                      </button>
                    </div>
                  </div>

                  {report.sentBy && (
                    <p className={`mt-3 text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                      Dikirim oleh{" "}
                      <span className={`font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{report.sentBy.name}</span>
                    </p>
                  )}
                </div>
              ))}
            </div>

            {inboxMeta.totalPages > 1 && (
              <div className="flex justify-center gap-2 pt-2">
                <button
                  disabled={inboxPage === 1}
                  onClick={() => setInboxPage((p) => p - 1)}
                  className={`px-4 py-2 rounded-xl border ${theme === 'dark' ? 'border-gray-700 text-gray-300 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-50'} text-sm disabled:opacity-40 transition`}
                >
                  ← Sebelumnya
                </button>
                <span className={`px-4 py-2 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  {inboxPage} / {inboxMeta.totalPages}
                </span>
                <button
                  disabled={inboxPage >= inboxMeta.totalPages}
                  onClick={() => setInboxPage((p) => p + 1)}
                  className={`px-4 py-2 rounded-xl border ${theme === 'dark' ? 'border-gray-700 text-gray-300 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-50'} text-sm disabled:opacity-40 transition`}
                >
                  Berikutnya →
                </button>
              </div>
            )}
          </section>
        )}

        {/* ══ TAB SENT ══ */}
        {activeTab === "sent" && (
          <section className="space-y-4">
            {sentLoading && (
              <div className={`rounded-3xl border ${theme === 'dark' ? 'border-gray-700 bg-gray-800 text-gray-400' : 'border bg-white text-gray-400'} p-10 text-center`}>
                Memuat...
              </div>
            )}
            {!sentLoading && sentReports.length === 0 && (
              <div className={`rounded-3xl border border-dashed ${theme === 'dark' ? 'border-gray-700 bg-gray-800 text-gray-400' : 'border-gray-300 bg-white text-gray-500'} p-12 text-center`}>
                <p className="text-4xl mb-3">📤</p>
                <p className={`font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Belum ada laporan terkirim</p>
                <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Buat laporan di tab <strong>Buat Revisi</strong>.</p>
              </div>
            )}
            {sentReports.map((report) => (
              <div key={report.id} className={`rounded-3xl border ${theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'} p-5 shadow-sm transition-colors duration-200`}>
                <div className="flex flex-wrap gap-2 items-center justify-between mb-2">
                  <div className="flex flex-wrap gap-2 items-center">
                    <span className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{report.projectName}</span>
                    <span className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>→</span>
                    <RoleBadge role={report.targetRole} theme={theme} />
                    <span className={`rounded-full ${theme === 'dark' ? 'bg-indigo-900 text-indigo-300' : 'bg-indigo-100 text-indigo-700'} px-2.5 py-0.5 text-xs font-semibold`}>
                      {ISSUE_TYPE_LABELS[report.issueType] ?? report.issueType}
                    </span>
                  </div>
                  <div className="flex gap-2 items-center flex-wrap">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${approvalColor(report.approval, theme)}`}>
                      {APPROVAL_LABELS[report.approval] ?? report.approval}
                    </span>
                    <span className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>{formatDate(report.createdAt)}</span>
                  </div>
                </div>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} mb-2`}>
                  {report.description || <span className={`italic ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>Tidak ada deskripsi.</span>}
                </p>
                <div className="flex gap-2 items-center">
                  <span className={`text-xs rounded-full ${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'} px-2.5 py-1 font-medium`}>
                    {PROGRESS_LABELS[report.progress] ?? report.progress}
                  </span>
                  {!!report._count?.comments && (
                    <span className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>💬 {report._count.comments} komentar</span>
                  )}
                  <button
                    onClick={() => deleteReport(report.id, "sent")}
                    className={`ml-auto h-8 px-3 rounded-xl border ${theme === 'dark' ? 'border-red-700 bg-red-900/30 text-red-300 hover:bg-red-900/50' : 'border-red-200 bg-red-50 text-red-700 hover:bg-red-100'} text-xs transition`}
                  >
                    Hapus
                  </button>
                </div>
              </div>
            ))}
          </section>
        )}

        {/* ══ TAB NEW ══ */}
        {activeTab === "new" && (
          <section className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-3xl border p-6 shadow-sm transition-colors duration-200`}>
            <div className="mb-6">
              <h2 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>Buat Revisi Baru</h2>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
                Laporan dikirim dari <RoleBadge role={myRole} theme={theme} /> ke role tujuan yang dipilih.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-5">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="block">
                  <span className={`text-sm font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Nama Project *</span>
                  <input
                    type="text"
                    value={projectName}
                    required
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="Nama project..."
                    className={`mt-2 w-full h-11 rounded-xl border ${theme === 'dark' ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' : 'border-gray-300 bg-white text-gray-900 placeholder-gray-400'} px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200`}
                  />
                </label>
                <label className="block">
                  <span className={`text-sm font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Ditujukan ke *</span>
                  <select
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    className={`mt-2 w-full h-11 rounded-xl border ${theme === 'dark' ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'} px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200`}
                  >
                    {(SENDER_TARGET_MAP[myRole] || ["FRONTEND", "BACKEND", "QA"]).map((r) => (
                      <option key={r} value={r}>{ROLE_LABELS[r] || r}</option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="block">
                  <span className={`text-sm font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Tipe Masalah</span>
                  <select
                    value={issueType}
                    onChange={(e) => setIssueType(e.target.value)}
                    className={`mt-2 w-full h-11 rounded-xl border ${theme === 'dark' ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'} px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200`}
                  >
                    {ISSUE_TYPES.map((t) => (
                      <option key={t} value={t}>{ISSUE_TYPE_LABELS[t]}</option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className={`text-sm font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Label Progress</span>
                  <select
                    value={progress}
                    onChange={(e) => setProgress(e.target.value)}
                    className={`mt-2 w-full h-11 rounded-xl border ${theme === 'dark' ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'} px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200`}
                  >
                    <option value="BELUM_DILAKUKAN">Belum dilakukan</option>
                    <option value="SEDANG_DIKERJAKAN">Sedang dikerjakan</option>
                    <option value="SELESAI">Selesai</option>
                  </select>
                </label>
              </div>

              <label className="block">
                <span className={`text-sm font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Keterangan</span>
                <textarea
                  value={description}
                  rows={4}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Jelaskan masalah, lokasi modul, dan detail lainnya..."
                  className={`mt-2 w-full rounded-2xl border ${theme === 'dark' ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' : 'border-gray-300 bg-white text-gray-900 placeholder-gray-400'} px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none transition-colors duration-200`}
                />
              </label>

              <div>
                <span className={`text-sm font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Lampiran (max 5MB)</span>
                <div className={`mt-2 rounded-2xl border border-dashed ${theme === 'dark' ? 'border-gray-600 bg-gray-700/50' : 'border-gray-300 bg-gray-50'} p-4 transition-colors duration-200`}>
                  <input
                    ref={fileRef}
                    type="file"
                    onChange={handleFileChange}
                    accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
                    className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} w-full`}
                  />
                  {attachmentName && (
                    <p className={`mt-2 text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>✅ {attachmentName}</p>
                  )}
                </div>
              </div>

              <div className={`rounded-2xl ${theme === 'dark' ? 'bg-blue-900/30 border-blue-700 text-blue-300' : 'bg-blue-50 border-blue-100 text-blue-800'} border px-4 py-3 text-sm`}>
                Laporan ini akan dikirim dari <strong>{ROLE_LABELS[myRole] || myRole}</strong> ke{" "}
                <strong>{ROLE_LABELS[targetRole] || targetRole}</strong>.
              </div>

              {submitError && (
                <div className={`rounded-2xl ${theme === 'dark' ? 'bg-red-900/30 border-red-700 text-red-300' : 'bg-red-50 border-red-200 text-red-700'} border px-4 py-3 text-sm`}>
                  ⚠️ {submitError}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting || !projectName.trim()}
                className="h-12 rounded-2xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 disabled:opacity-50 transition"
              >
                {submitting ? "Mengirim..." : "Kirim Revisi →"}
              </button>
            </form>
          </section>
        )}
      </div>

      {/* Modal preview gambar */}
      {previewImage && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center ${theme === 'dark' ? 'bg-black/80' : 'bg-black/70'} p-4`}
          onClick={() => setPreviewImage("")}
        >
          <div
            className={`relative max-w-4xl w-full rounded-3xl overflow-hidden ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-2xl`}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setPreviewImage("")}
              className={`absolute right-4 top-4 z-10 h-9 w-9 rounded-full ${theme === 'dark' ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-white/90 text-gray-800 hover:bg-white'} shadow text-lg font-bold transition`}
            >
              ×
            </button>
            <div className="p-4">
              <img src={previewImage} alt="Preview"
                className="w-full max-h-[80vh] object-contain rounded-3xl" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}