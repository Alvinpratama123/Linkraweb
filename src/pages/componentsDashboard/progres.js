// pages/dashboardAdmin/components/progres.js
"use client";

import { useEffect, useState } from "react";

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

const normalizeAttachmentStatus = (value) => {
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

const getAttachmentStatusLabel = (value) => {
  const normalized = normalizeAttachmentStatus(value);
  if (normalized === "approved") return "Approved";
  if (normalized === "rejected") return "Rejected";
  return "Pending";
};

// 🔥 Komponen untuk menampilkan attachment detail - TANPA TOMBOL
const AttachmentDetail = ({ attachment, theme }) => {
  if (!attachment) {
    return (
      <div className={`text-center py-12 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
        <p className="text-4xl mb-3">📎</p>
        <p>Pilih lampiran untuk melihat detail</p>
      </div>
    );
  }

  const attachmentUrl = attachment.url || attachment.data || "";
  const statusLabel = normalizeAttachmentStatus(attachment.status);
  const statusColors = {
    approved: theme === 'dark' ? "bg-green-900 text-green-200 border-green-700" : "bg-green-100 text-green-700 border-green-200",
    rejected: theme === 'dark' ? "bg-red-900 text-red-200 border-red-700" : "bg-red-100 text-red-700 border-red-200",
    pending: theme === 'dark' ? "bg-yellow-900 text-yellow-200 border-yellow-700" : "bg-yellow-50 text-yellow-700 border-yellow-200",
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "approved": return "✅";
      case "rejected": return "❌";
      default: return "⏳";
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {attachment.description && (
        <div className={`${theme === 'dark' ? 'bg-blue-900/30 border-blue-700' : 'bg-blue-50 border-blue-200'} border rounded-xl p-4`}>
          <div className="flex items-start gap-2">
            <span className="text-blue-500 text-lg">📝</span>
            <div>
              <p className={`text-xs font-semibold ${theme === 'dark' ? 'text-blue-300' : 'text-blue-700'} uppercase tracking-wide`}>Keterangan</p>
              <p className={`text-sm ${theme === 'dark' ? 'text-blue-300' : 'text-blue-800'} mt-1`}>{attachment.description}</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center gap-3 flex-wrap">
        <span className={`text-xs px-3 py-1 rounded-full border ${statusColors[statusLabel] || statusColors.pending}`}>
          {getStatusIcon(statusLabel)} {getAttachmentStatusLabel(statusLabel)}
        </span>
        <span className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
          {formatDate(attachment.createdAt)}
        </span>
        {attachment.type === "link" && (
          <span className={`text-xs ${theme === 'dark' ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-700'} px-2 py-0.5 rounded-full`}>🔗 Link</span>
        )}
        {attachment.type === "image" && (
          <span className={`text-xs ${theme === 'dark' ? 'bg-purple-900 text-purple-300' : 'bg-purple-100 text-purple-700'} px-2 py-0.5 rounded-full`}>🖼️ Gambar</span>
        )}
        {attachment.type === "module" && (
          <span className={`text-xs ${theme === 'dark' ? 'bg-red-900 text-red-300' : 'bg-red-100 text-red-700'} px-2 py-0.5 rounded-full`}>📄 PDF</span>
        )}
      </div>

      {attachment.type === "image" ? (
        <div className={`relative rounded-2xl overflow-hidden ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-900'} min-h-[300px] flex items-center justify-center`}>
          <img
            src={attachmentUrl}
            alt={attachment.name || "Preview"}
            className="w-full max-h-[70vh] object-contain"
            onError={(e) => {
              e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect width='200' height='200' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%239ca3af' font-family='sans-serif' font-size='14'%3EGagal memuat gambar%3C/text%3E%3C/svg%3E";
            }}
          />
        </div>
      ) : attachment.type === "link" ? (
        <div className={`rounded-2xl border-2 border-dashed ${theme === 'dark' ? 'border-blue-700 bg-blue-900/20' : 'border-blue-300 bg-blue-50/50'} p-8 text-center min-h-[200px] flex flex-col items-center justify-center`}>
          <div className="text-5xl mb-4">🔗</div>
          <div className={`text-sm font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'} mb-2 break-all`}>
            {attachment.name || attachment.label}
          </div>
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mb-4`}>Klik tombol di bawah untuk membuka link</p>
          <a href={attachmentUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition">
            <span>🔗</span> Buka Link
          </a>
        </div>
      ) : (
        <div className={`rounded-2xl border-2 border-dashed ${theme === 'dark' ? 'border-gray-700 bg-gray-800/50' : 'border-gray-300 bg-gray-50'} p-8 text-center min-h-[200px] flex flex-col items-center justify-center`}>
          <div className="text-5xl mb-4">📄</div>
          <div className={`text-sm font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'} mb-2`}>
            {attachment.name || attachment.label}
          </div>
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mb-4`}>Klik tombol di bawah untuk mengunduh file</p>
          <a href={attachmentUrl} target="_blank" rel="noreferrer" download={attachment.name || "file"} className="inline-flex items-center gap-2 rounded-xl bg-gray-800 px-6 py-3 text-sm font-semibold text-white hover:bg-gray-900 transition">
            <span>⬇️</span> Unduh {attachment.name || "File"}
          </a>
        </div>
      )}
    </div>
  );
};

export default function Progres({ theme, setTheme }) {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedAttachmentIndex, setSelectedAttachmentIndex] = useState(0);
  const [filterDate, setFilterDate] = useState("");
  const [projectSearch, setProjectSearch] = useState("");
  const [attachmentSearch, setAttachmentSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid");

  // 🔥 Fungsi untuk menambahkan notifikasi ke database
  const addNotification = async (title, message, type = "info", link = null) => {
    try {
      const res = await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          title,
          message,
          type,
          link,
          icon: type === "success" ? "✅" : type === "error" ? "❌" : type === "warning" ? "⚠️" : "📢",
          color: type === "success" ? "green" : type === "error" ? "red" : type === "warning" ? "orange" : "blue",
        }),
      });
      const data = await res.json();
      if (!data.success) {
        console.error("Failed to add notification:", data.message);
      }
      return data;
    } catch (error) {
      console.error("Add notification error:", error);
    }
  };

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/projects");
      const data = await res.json();
      if (data.success) {
        const nextProjects = data.projects || [];
        setProjects(nextProjects);
        if (selectedProject?.id) {
          const freshSelected = nextProjects.find((project) => project.id === selectedProject.id);
          if (freshSelected) {
            setSelectedProject({ ...freshSelected });
          }
        }
        return nextProjects;
      }
      return [];
    } catch (error) {
      console.error("Fetch projects error:", error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (selectedProject) {
      setSelectedAttachmentIndex(0);
      setAttachmentSearch("");
    }
  }, [selectedProject?.id]);

  const syncProjectState = (updatedProject) => {
    if (!updatedProject?.id) return;

    const normalizedProject = {
      ...updatedProject,
      decision: normalizeDecision(updatedProject.decision),
      attachments: updatedProject.attachments || [],
      user: updatedProject.user || null,
      attachmentStatusOverrides: updatedProject.attachmentStatusOverrides || {},
    };

    setProjects((prev) => prev.map((project) => (project.id === normalizedProject.id ? { ...project, ...normalizedProject } : project)));
    setSelectedProject((prev) => (prev?.id === normalizedProject.id ? { ...prev, ...normalizedProject } : prev));
  };

  // 🔥 Fungsi untuk mendapatkan semua attachment dari project
  const getProjectAttachments = (project) => {
    if (!project) return [];

    const attachments = [];

    const attachmentStatusOverrides = project.attachmentStatusOverrides || {};

    if (project.attachments && project.attachments.length > 0) {
      project.attachments.forEach((item) => {
        attachments.push({
          ...item,
          status: normalizeAttachmentStatus(item.status || attachmentStatusOverrides[item.id] || "pending"),
          label: item.name || (item.type === "image" ? "Gambar" : item.type === "link" ? "Link" : "File"),
          data: item.url || null,
          description: item.description || null,
        });
      });
    }

    if (project.imageUrl) {
      const exists = attachments.some(a => a.url === project.imageUrl);
      if (!exists) {
        attachments.push({
          id: `image-${project.id}`,
          type: "image",
          name: "Gambar Project",
          label: "Gambar Project",
          url: project.imageUrl,
          data: project.imageUrl,
          description: project.imageDescription || null,
          createdAt: project.createdAt || project.date,
          status: normalizeAttachmentStatus(attachmentStatusOverrides[`image-${project.id}`] || "pending"),
        });
      }
    }

    if (project.imageDescription2) {
      attachments.push({
        id: `image2-${project.id}`,
        type: "image",
        name: "Keterangan Tambahan",
        label: "Keterangan Tambahan",
        url: project.imageUrl || "",
        data: project.imageUrl || "",
        description: project.imageDescription2,
        createdAt: project.createdAt || project.date,
        status: normalizeAttachmentStatus(attachmentStatusOverrides[`image2-${project.id}`] || "pending"),
        isAdditionalDescription: true,
      });
    }

    if (project.moduleUrl) {
      const exists = attachments.some(a => a.url === project.moduleUrl);
      if (!exists) {
        attachments.push({
          id: `module-${project.id}`,
          type: "module",
          name: "Modul Project",
          label: "Modul Project",
          url: project.moduleUrl,
          data: project.moduleUrl,
          description: "Modul pembelajaran",
          createdAt: project.createdAt || project.date,
          status: normalizeAttachmentStatus(attachmentStatusOverrides[`module-${project.id}`] || "pending"),
        });
      }
    }

    if (project.repoLink) {
      attachments.push({
        id: `repo-${project.id}`,
        type: "link",
        name: project.repoLink,
        label: "Project Link",
        data: project.repoLink,
        url: project.repoLink,
        createdAt: project.date || project.createdAt || "",
        status: normalizeAttachmentStatus(attachmentStatusOverrides[`repo-${project.id}`] || "pending"),
        description: "Link repository / demo project",
      });
    }

    return attachments;
  };

  // 🔥 Fungsi untuk approve semua attachment sekaligus
  const approveAllAttachments = async () => {
    if (!selectedProject) return;

    const allAttachments = getProjectAttachments(selectedProject);
    const overrides = { ...(selectedProject.attachmentStatusOverrides || {}) };

    allAttachments.forEach(att => {
      overrides[att.id] = "approved";
    });

    const optimisticProject = {
      ...selectedProject,
      decision: "approved",
      finished: false,
      attachmentStatusOverrides: overrides,
    };

    syncProjectState(optimisticProject);

    try {
      await fetch(`/api/projects/${selectedProject.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          decision: "approved",
          finished: false,
          attachmentStatusOverrides: overrides 
        }),
      });

      // 🔥 Notifikasi Approve All
      await addNotification(
        `✅ Semua lampiran di-approve`,
        `Semua lampiran pada project "${selectedProject.name}" telah di-approve`,
        "success",
        `/dashboardAdmin/progres`
      );

      const updatedProjects = await fetchProjects();
      const updatedProject = updatedProjects.find((p) => p.id === selectedProject.id);
      if (updatedProject) {
        syncProjectState(updatedProject);
      }
    } catch (error) {
      console.error("Approve all error:", error);
    }
  };

  // 🔥 Fungsi Reset - mereset semua status
  const handleResetAll = async () => {
    if (!selectedProject) return;
    if (!window.confirm("Yakin ingin mereset semua status project ini?")) return;

    const allAttachments = getProjectAttachments(selectedProject);
    const overrides = { ...(selectedProject.attachmentStatusOverrides || {}) };

    allAttachments.forEach(att => {
      overrides[att.id] = "pending";
    });

    const optimisticProject = {
      ...selectedProject,
      decision: "pending",
      finished: false,
      attachmentStatusOverrides: overrides,
    };

    syncProjectState(optimisticProject);

    try {
      await fetch(`/api/projects/${selectedProject.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          decision: "pending",
          finished: false,
          attachmentStatusOverrides: overrides 
        }),
      });

      // 🔥 Notifikasi Reset All
      await addNotification(
        `↩️ Semua status di-reset`,
        `Semua status pada project "${selectedProject.name}" telah di-reset ke Pending`,
        "info",
        `/dashboardAdmin/progres`
      );

      const updatedProjects = await fetchProjects();
      const updatedProject = updatedProjects.find((p) => p.id === selectedProject.id);
      if (updatedProject) {
        syncProjectState(updatedProject);
      }
    } catch (error) {
      console.error("Reset all error:", error);
    }
  };

  const handleDecision = async (decision) => {
    if (!selectedProject) return;
    
    const normalizedDecision = normalizeDecision(decision);
    const decisionLabel = getDecisionLabel(decision);
    
    try {
      const res = await fetch(`/api/projects/${selectedProject.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ decision, finished: false }),
      });
      const data = await res.json();
      if (data.success) {
        if (normalizedDecision === "approved") {
          const allAttachments = getProjectAttachments(selectedProject);
          const overrides = { ...(selectedProject.attachmentStatusOverrides || {}) };
          
          allAttachments.forEach(att => {
            overrides[att.id] = "approved";
          });
          
          const projectWithOverrides = {
            ...data.project,
            finished: false,
            attachmentStatusOverrides: overrides,
          };
          
          syncProjectState(projectWithOverrides);
          
          try {
            await fetch(`/api/projects/${selectedProject.id}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ 
                finished: false,
                attachmentStatusOverrides: overrides 
              }),
            });
          } catch (err) {
            console.error("Error saving attachment overrides:", err);
          }
        } else {
          syncProjectState(data.project);
        }

        // 🔥 Notifikasi Decision
        const statusIcon = normalizedDecision === "approved" ? "✅" : normalizedDecision === "rejected" ? "❌" : "↩️";
        const notifType = normalizedDecision === "approved" ? "success" : normalizedDecision === "rejected" ? "error" : "info";
        await addNotification(
          `${statusIcon} Decision ${decisionLabel}`,
          `Project "${selectedProject.name}" telah di-${decisionLabel.toLowerCase()}`,
          notifType,
          `/dashboardAdmin/progres`
        );
      }
    } catch (error) {
      console.error("Decision error:", error);
    }
  };

  const handleFinish = async () => {
    if (!selectedProject) return;
    try {
      const res = await fetch(`/api/projects/${selectedProject.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ finished: true }),
      });
      const data = await res.json();
      if (data.success) {
        syncProjectState(data.project);

        // 🔥 Notifikasi Finish
        await addNotification(
          `🎉 Project Selesai`,
          `Project "${selectedProject.name}" telah ditandai sebagai selesai`,
          "success",
          `/dashboardAdmin/progres`
        );
      }
    } catch (error) {
      console.error("Finish error:", error);
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm("Yakin ingin menghapus project ini?")) return;
    try {
      const projectToDelete = projects.find(p => p.id === projectId);
      await fetch(`/api/projects/${projectId}`, { method: "DELETE" });
      setProjects((prev) => prev.filter((p) => p.id !== projectId));
      if (selectedProject?.id === projectId) setSelectedProject(null);

      // 🔥 Notifikasi Delete
      if (projectToDelete) {
        await addNotification(
          `🗑️ Project Dihapus`,
          `Project "${projectToDelete.name}" telah dihapus`,
          "error",
          `/dashboardAdmin/progres`
        );
      }
    } catch (error) {
      console.error("Delete project error:", error);
    }
  };

  // 🔥 setAttachmentStatus TIDAK mengubah decision project
  const setAttachmentStatus = async (attachment, status) => {
    if (!attachment) return;

    const normalizedStatus = normalizeAttachmentStatus(status);
    const statusLabel = getAttachmentStatusLabel(status);
    const isGeneratedAttachment = attachment.type === "link" ||
      attachment.id?.toString?.().startsWith?.("image-") ||
      attachment.id?.toString?.().startsWith?.("module-") ||
      attachment.id?.toString?.().startsWith?.("repo-");

    const nextOverrides = {
      ...(selectedProject?.attachmentStatusOverrides || {}),
    };

    nextOverrides[attachment.id] = normalizedStatus;

    const optimisticProject = {
      ...selectedProject,
      attachmentStatusOverrides: nextOverrides,
      attachments: (selectedProject?.attachments || []).map((item) =>
        item.id === attachment.id ? { ...item, status: normalizedStatus } : item
      ),
    };

    syncProjectState(optimisticProject);

    // 🔥 Notifikasi perubahan status attachment
    const statusIcon = normalizedStatus === "approved" ? "✅" : normalizedStatus === "rejected" ? "❌" : "↩️";
    const notifType = normalizedStatus === "approved" ? "success" : normalizedStatus === "rejected" ? "error" : "info";
    await addNotification(
      `${statusIcon} ${attachment.label} ${statusLabel}`,
      `Lampiran "${attachment.label}" pada project "${selectedProject?.name}" telah di-${statusLabel.toLowerCase()}`,
      notifType,
      `/dashboardAdmin/progres`
    );

    if (isGeneratedAttachment) {
      try {
        await fetch(`/api/projects/${selectedProject.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ attachmentStatusOverrides: nextOverrides }),
        });
      } catch (error) {
        console.error("Update overrides error:", error);
      }
      return;
    }

    try {
      const res = await fetch(`/api/projects/attachments/${attachment.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: normalizedStatus }),
      });
      const result = await res.json();
      if (result.success) {
        const updatedProjects = await fetchProjects();
        const updatedProject = updatedProjects.find((p) => p.id === selectedProject.id);
        if (updatedProject) {
          syncProjectState(updatedProject);
        }
      }
    } catch (error) {
      console.error("Update attachment status error:", error);
    }
  };

  const filteredProjects = projects.filter((project) => {
    const matchesDate = !filterDate || project.date === filterDate;
    const searchTerm = projectSearch.trim().toLowerCase();
    const matchesName = !searchTerm || project.name?.toLowerCase().includes(searchTerm);
    return matchesDate && matchesName;
  });

  const renderImageCell = (project) => {
    const imageAttachment = project.attachments?.find((a) => a.type === "image");
    const imageUrl = project.imageUrl || imageAttachment?.url;

    if (imageUrl) {
      return (
        <button
          type="button"
          onClick={() => setSelectedProject(project)}
          className="group inline-flex items-center rounded-lg overflow-hidden"
        >
          <img
            src={imageUrl}
            alt={project.name}
            className="w-20 h-14 object-cover rounded-lg transition duration-200 group-hover:scale-105"
            onError={(e) => {
              e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='56'%3E%3Crect width='80' height='56' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%239ca3af' font-family='sans-serif' font-size='10'%3ENo Image%3C/text%3E%3C/svg%3E";
            }}
          />
        </button>
      );
    }
    return <span className={`text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>Tidak ada</span>;
  };

  const renderModuleCell = (project) => {
    const moduleUrl = project.moduleUrl;

    if (moduleUrl) {
      return (
        <div className="space-y-1">
          <a
            href={moduleUrl}
            target="_blank"
            rel="noreferrer"
            download
            className={`text-sm ${theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:underline'}`}
          >
            📄 Download Modul
          </a>
        </div>
      );
    }

    const moduleAttachment = project.attachments?.find((item) => item.type === "module");
    if (moduleAttachment) {
      return (
        <div className="space-y-1">
          <a
            href={moduleAttachment.url}
            target="_blank"
            rel="noreferrer"
            download={moduleAttachment.name}
            className={`text-sm ${theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:underline'}`}
          >
            {moduleAttachment.name || "Download"}
          </a>
        </div>
      );
    }

    return <span className={`text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>Tidak ada</span>;
  };

  const areAllAttachmentsApproved = () => {
    if (!selectedProject) return false;
    const allAttachments = getProjectAttachments(selectedProject);
    if (allAttachments.length === 0) return false;
    return allAttachments.every(att => normalizeAttachmentStatus(att.status) === "approved");
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-[#1a1a2e]' : 'bg-[#eef2f7]'} p-4 md:p-8 transition-colors duration-200`}>
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className={`text-xs font-semibold tracking-widest ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} uppercase`}>
              Progress Project
            </p>
            <h1 className={`text-3xl md:text-4xl font-bold ${theme === 'dark' ? 'text-white' : 'text-[#001d55]'} mt-2`}>
              Daftar Progress Project
            </h1>
          </div>
          <div className={`flex items-center gap-2 rounded-xl border ${theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'} p-1`}>
            <button
              onClick={() => setViewMode("grid")}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                viewMode === "grid" 
                  ? "bg-blue-600 text-white" 
                  : theme === 'dark' ? "text-gray-400 hover:bg-gray-700" : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              📊 Grid
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                viewMode === "list" 
                  ? "bg-blue-600 text-white" 
                  : theme === 'dark' ? "text-gray-400 hover:bg-gray-700" : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              📋 List
            </button>
          </div>
        </div>

        <div className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-sm border p-5 md:p-8 transition-colors duration-200`}>
          {projects.length > 0 && (
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div className="grid gap-4 md:grid-cols-2 w-full md:w-auto">
                <div className="flex flex-col gap-2">
                  <label className={`text-sm font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Filter Tanggal</label>
                  <input
                    type="date"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                    className={`w-full h-12 border ${theme === 'dark' ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'} rounded-xl px-4 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors duration-200`}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className={`text-sm font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Cari Nama Project</label>
                  <input
                    type="text"
                    value={projectSearch}
                    onChange={(e) => setProjectSearch(e.target.value)}
                    placeholder="Cari project..."
                    className={`w-full h-12 border ${theme === 'dark' ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' : 'border-gray-300 bg-white text-gray-900 placeholder-gray-400'} rounded-xl px-4 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors duration-200`}
                  />
                </div>
              </div>
              {(filterDate || projectSearch) && (
                <button
                  type="button"
                  onClick={() => { setFilterDate(""); setProjectSearch(""); }}
                  className={`h-12 px-4 rounded-xl border ${theme === 'dark' ? 'border-gray-600 bg-gray-700 text-gray-300 hover:bg-gray-600' : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'} transition`}
                >
                  Reset filter
                </button>
              )}
            </div>
          )}

          {loading ? (
            <div className={`text-center py-16 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Memuat data...</div>
          ) : projects.length === 0 ? (
            <div className={`text-center py-16 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              Belum ada project yang diupload. Silakan tambah project di halaman Projects.
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className={`text-center py-16 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              Tidak ada project untuk tanggal {filterDate}. Silakan hapus filter atau pilih tanggal lain.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className={`border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                    <th className={`py-4 px-3 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Gambar</th>
                    <th className={`py-4 px-3 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Nama Project</th>
                    <th className={`py-4 px-3 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Pemilik</th>
                    <th className={`py-4 px-3 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Posisi</th>
                    <th className={`py-4 px-3 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Tanggal</th>
                    <th className={`py-4 px-3 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Link</th>
                    <th className={`py-4 px-3 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Progress</th>
                    <th className={`py-4 px-3 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Modul</th>
                    <th className={`py-4 px-3 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Status</th>
                    <th className={`py-4 px-3 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProjects.map((project) => {
                    return (
                      <tr key={project.id} className={`border-b ${theme === 'dark' ? 'border-gray-700 hover:bg-gray-700/50' : 'border-gray-100 hover:bg-gray-50'} transition`}>
                        <td className="py-4 px-3">{renderImageCell(project)}</td>
                        <td className={`py-4 px-3 font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>{project.name}</td>
                        <td className={`py-4 px-3 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                          <div className="space-y-1">
                            <div className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                              {project.user?.email || '-'}
                            </div>
                            <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                              {project.user?.position || project.position || '-'}
                            </div>
                            <div className={`text-[11px] ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>
                              {project.user?.role || 'member'}
                            </div>
                          </div>
                        </td>
                        <td className={`py-4 px-3 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{project.position}</td>
                        <td className={`py-4 px-3 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                          {project.date ? new Date(project.date).toLocaleDateString('id-ID') : '-'}
                        </td>
                        <td className="py-4 px-3">
                          {project.repoLink ? (
                            <a href={project.repoLink} target="_blank" rel="noreferrer" className={`text-sm ${theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:underline'}`}>
                              Buka Link
                            </a>
                          ) : (
                            <span className={`text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>Tidak ada</span>
                          )}
                        </td>
                        <td className="py-4 px-3">
                          <div className="flex items-center gap-3 min-w-[120px]">
                            <span className={`text-sm font-semibold ${theme === 'dark' ? 'text-blue-400' : 'text-[#001d55]'}`}>{project.progress}%</span>
                            <div className={`w-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} h-2 rounded-full overflow-hidden`}>
                              <div className="h-2 rounded-full bg-[#001d55]" style={{ width: `${project.progress}%` }} />
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-3">{renderModuleCell(project)}</td>
                        <td className="py-4 px-3">
                          <span className={`text-xs px-2 py-1 rounded ${
                            normalizeDecision(project.decision) === "approved" ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" :
                            normalizeDecision(project.decision) === "rejected" ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300" :
                            "bg-yellow-50 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                          }`}>
                            {getDecisionLabel(project.decision)}
                          </span>
                        </td>
                        <td className="py-4 px-3">
                          <div className="flex items-center gap-2">
                            <button onClick={() => setSelectedProject(project)} className={`text-sm ${theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:underline'}`}>Lihat</button>
                            <button onClick={() => handleDeleteProject(project.id)} className={`text-sm ${theme === 'dark' ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-800'} px-2 py-1 rounded`}>Hapus</button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* 🔥 MODAL DETAIL PROJECT */}
        {selectedProject && (
          <div
            className={`fixed inset-0 z-50 flex items-center justify-center ${theme === 'dark' ? 'bg-black/80' : 'bg-black/60'} p-2 sm:p-4`}
            role="dialog"
            aria-modal="true"
            onClick={() => setSelectedProject(null)}
          >
            <div
              className={`relative max-w-6xl w-full max-h-[95vh] rounded-2xl overflow-hidden ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-2xl`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* HEADER MODAL */}
              <div className={`sticky top-0 z-10 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} border-b px-4 sm:px-6 py-4 flex items-center justify-between`}>
                <div className="flex-1 min-w-0">
                  <h2 className={`text-lg sm:text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} truncate`}>
                    {selectedProject.name}
                  </h2>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    {selectedProject.position} • {selectedProject.date ? new Date(selectedProject.date).toLocaleDateString('id-ID') : '-'}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                  <button
                    type="button"
                    onClick={() => setSelectedProject(null)}
                    className={`w-10 h-10 rounded-full ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'} flex items-center justify-center text-xl transition`}
                  >
                    ×
                  </button>
                </div>
              </div>

              {/* BODY MODAL */}
              <div className="flex flex-col lg:flex-row gap-4 p-4 sm:p-6 overflow-y-auto max-h-[calc(95vh-80px)]">
                {/* LEFT - List Attachment dengan tombol Approve/Reject per item */}
                <div className="lg:w-80 flex-shrink-0 space-y-4">
                  <div>
                    <input
                      type="search"
                      value={attachmentSearch}
                      onChange={(e) => { setAttachmentSearch(e.target.value); setSelectedAttachmentIndex(0); }}
                      placeholder="Cari lampiran..."
                      className={`w-full h-11 border ${theme === 'dark' ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' : 'border-gray-300 bg-white text-gray-900 placeholder-gray-400'} rounded-xl px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors duration-200`}
                    />
                  </div>

                  <div className={`space-y-3 max-h-[50vh] lg:max-h-[60vh] overflow-y-auto pr-1 ${theme === 'dark' ? 'scrollbar-thin scrollbar-thumb-gray-600' : ''}`}>
                    {(() => {
                      const allAttachments = getProjectAttachments(selectedProject);
                      const filteredAttachments = allAttachments.filter((item) => {
                        const search = attachmentSearch.trim().toLowerCase();
                        if (!search) return true;
                        return item.name?.toLowerCase().includes(search) || 
                               item.label?.toLowerCase().includes(search) ||
                               item.description?.toLowerCase().includes(search);
                      });

                      if (filteredAttachments.length === 0) {
                        return (
                          <div className={`text-center py-8 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'} text-sm`}>
                            <p>Tidak ada lampiran</p>
                            <p className="text-xs mt-1">Coba kata kunci lain</p>
                          </div>
                        );
                      }

                      return filteredAttachments.map((item, idx) => {
                        const globalIndex = filteredAttachments.indexOf(item);
                        const isActive = selectedAttachmentIndex === globalIndex;
                        const itemStatus = normalizeAttachmentStatus(item.status);

                        return (
                          <div
                            key={`attach-${item.id || idx}`}
                            className={`w-full rounded-xl border-2 transition-all ${
                              isActive 
                                ? `border-blue-600 ${theme === 'dark' ? 'bg-blue-900/30 shadow-lg shadow-blue-900/20' : 'bg-blue-50 shadow-md'}`
                                : theme === 'dark' 
                                  ? `border-gray-700 hover:border-gray-600` 
                                  : `border-gray-200 hover:border-gray-300`
                            }`}
                          >
                            {/* Bagian header attachment - bisa diklik untuk lihat detail */}
                            <button
                              onClick={() => setSelectedAttachmentIndex(globalIndex)}
                              className="w-full text-left p-3"
                            >
                              <div className="flex items-start gap-3">
                                {item.type === "image" ? (
                                  <img src={item.url || item.data} alt={item.name} className="w-12 h-10 object-cover rounded-lg flex-shrink-0" />
                                ) : item.type === "link" ? (
                                  <div className={`w-12 h-10 flex items-center justify-center rounded-lg text-lg flex-shrink-0 ${theme === 'dark' ? 'bg-blue-900/50 text-blue-400' : 'bg-blue-100 text-blue-700'}`}>🔗</div>
                                ) : (
                                  <div className={`w-12 h-10 flex items-center justify-center rounded-lg text-lg flex-shrink-0 ${theme === 'dark' ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-600'}`}>📄</div>
                                )}
                                <div className="flex-1 min-w-0">
                                  <div className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'} truncate`}>{item.label}</div>
                                  <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                                      itemStatus === "approved" ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" :
                                      itemStatus === "rejected" ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300" :
                                      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                                    }`}>
                                      {itemStatus === "approved" ? "✅" : itemStatus === "rejected" ? "❌" : "⏳"} {getAttachmentStatusLabel(item.status)}
                                    </span>
                                    {item.description && (
                                      <span className={`text-[10px] ${theme === 'dark' ? 'text-blue-400' : 'text-blue-500'}`} title={item.description}>💬</span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </button>

                            {/* 🔥 Tombol Approve/Reject per attachment */}
                            <div className={`flex gap-1 px-3 pb-3 ${isActive ? 'border-t pt-2' : ''} ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setAttachmentStatus(item, "approved");
                                }}
                                disabled={itemStatus === "approved"}
                                className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center justify-center gap-1 ${
                                  itemStatus === "approved"
                                    ? 'bg-green-200 text-green-500 dark:bg-green-900 dark:text-green-300 cursor-not-allowed opacity-50'
                                    : 'bg-green-600 text-white hover:bg-green-700'
                                }`}
                              >
                                ✅ Approve
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setAttachmentStatus(item, "rejected");
                                }}
                                disabled={itemStatus === "rejected"}
                                className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center justify-center gap-1 ${
                                  itemStatus === "rejected"
                                    ? 'bg-red-200 text-red-500 dark:bg-red-900 dark:text-red-300 cursor-not-allowed opacity-50'
                                    : 'bg-red-600 text-white hover:bg-red-700'
                                }`}
                              >
                                ❌ Reject
                              </button>
                            </div>
                          </div>
                        );
                      });
                    })()}
                  </div>
                </div>

                {/* RIGHT - Detail Attachment TANPA TOMBOL */}
                <div className="flex-1 min-w-0">
                  {(() => {
                    const allAttachments = getProjectAttachments(selectedProject);
                    const filteredAttachments = allAttachments.filter((item) => {
                      const search = attachmentSearch.trim().toLowerCase();
                      if (!search) return true;
                      return item.name?.toLowerCase().includes(search) || 
                             item.label?.toLowerCase().includes(search) ||
                             item.description?.toLowerCase().includes(search);
                    });
                    const attachment = filteredAttachments[selectedAttachmentIndex];

                    return (
                      <div className={`${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'} rounded-2xl p-4 sm:p-6 min-h-[300px] transition-colors duration-200`}>
                        <AttachmentDetail 
                          attachment={attachment} 
                          theme={theme}
                        />
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* FOOTER MODAL - Tombol untuk seluruh project */}
              <div className={`sticky bottom-0 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} border-t px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-3`}>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Decision:</span>
                  <span className={`text-xs px-3 py-1 rounded-full ${
                    normalizeDecision(selectedProject.decision) === "approved" ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" :
                    normalizeDecision(selectedProject.decision) === "rejected" ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300" :
                    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                  }`}>
                    {getDecisionLabel(selectedProject.decision)}
                  </span>
                  {selectedProject.finished && (
                    <span className="text-xs px-3 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">✅ Selesai</span>
                  )}
                  {areAllAttachmentsApproved() && (
                    <span className="text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                      ✅ Semua lampiran approved
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={approveAllAttachments}
                    className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={areAllAttachmentsApproved()}
                  >
                    ✅ Approve All
                  </button>
                  <button
                    onClick={() => handleDecision("approved")}
                    className="px-4 py-2 rounded-xl bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition"
                  >
                    ✅ Approve
                  </button>
                  <button
                    onClick={() => handleDecision("rejected")}
                    className="px-4 py-2 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition"
                  >
                    ❌ Reject
                  </button>
                  <button
                    onClick={handleResetAll}
                    className={`px-4 py-2 rounded-xl border ${theme === 'dark' ? 'border-gray-600 bg-gray-700 text-gray-200 hover:bg-gray-600' : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'} text-sm font-semibold transition`}
                  >
                    ↩️ Reset All
                  </button>
                  <button
                    onClick={handleFinish}
                    className="px-4 py-2 rounded-xl bg-[#001d55] text-white text-sm font-semibold hover:bg-[#00327a] transition"
                  >
                    ✅ Finish
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}