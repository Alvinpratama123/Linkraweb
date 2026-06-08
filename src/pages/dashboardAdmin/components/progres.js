"use client";

import { useEffect, useState } from "react";
import { sampleMembers } from "./memberData";

const STORAGE_KEY = "projectProgressList";

const DB_NAME = "projectAttachmentsDB";
const DB_VERSION = 1;
const ATTACHMENT_STORE = "attachments";

const openAttachmentDB = () =>
  new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(ATTACHMENT_STORE)) {
        db.createObjectStore(ATTACHMENT_STORE, { keyPath: "id" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

const getAttachmentById = async (id) => {
  if (!id) return null;
  const db = await openAttachmentDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(ATTACHMENT_STORE, "readonly");
    const store = tx.objectStore(ATTACHMENT_STORE);
    const request = store.get(id);
    request.onsuccess = () => {
      resolve(request.result || null);
      db.close();
    };
    request.onerror = () => {
      reject(request.error);
      db.close();
    };
  });
};

const deleteAttachmentById = async (id) => {
  if (!id) return true;
  const db = await openAttachmentDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(ATTACHMENT_STORE, "readwrite");
    const store = tx.objectStore(ATTACHMENT_STORE);
    const request = store.delete(id);
    request.onsuccess = () => {
      resolve(true);
      db.close();
    };
    request.onerror = () => {
      reject(request.error);
      db.close();
    };
  });
};

const formatDate = (iso) => {
  try {
    return new Date(iso).toLocaleString();
  } catch (e) {
    return iso || "";
  }
};

export default function Progres() {
  const [projects, setProjects] = useState([]);
  const [projectThumbnails, setProjectThumbnails] = useState({});
  const [attachmentURLs, setAttachmentURLs] = useState({});
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedAttachmentIndex, setSelectedAttachmentIndex] = useState(0);
  const [selectedAttachmentURL, setSelectedAttachmentURL] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [projectSearch, setProjectSearch] = useState("");
  const [attachmentSearch, setAttachmentSearch] = useState("");

  const getProjectAttachments = (project) => {
    if (!project) return [];

    const attachments = [
      ...(project.attachments || []).map((item, index) => ({
        ...item,
        status: item.status || "pending",
        label:
          item.label ||
          (item.type === "image"
            ? `Gambar ${index + 1}`
            : item.type === "link"
            ? `Link ${index + 1}`
            : `PDF ${index + 1}`),
      })),
    ];

    if (project.repoLink) {
      attachments.push({
        id: `repo-${project.id}`,
        type: "link",
        name: project.repoLink,
        label: "Project Link",
        data: project.repoLink,
        createdAt: project.date || project.createdAt || "",
        status: "pending",
      });
    }

    return [
      ...attachments,
      ...(project.images || []).map((item, index) => ({
        ...item,
        id: item.id || `legacy-image-${project.id}-${index}`,
        type: "image",
        status: item.status || "pending",
        label: `Gambar ${attachments.length + index + 1}`,
      })),
      ...(project.imageData
        ? [
            {
              id: `legacy-image-data-${project.id}`,
              name: project.imageName || "Gambar 1",
              data: project.imageData,
              type: "image",
              status: "pending",
              label: `Gambar ${attachments.length + (project.images || []).length + 1}`,
              createdAt: project.date || project.createdAt || "",
            },
          ]
        : []),
      ...(project.modules || []).map((item, index) => ({
        ...item,
        id: item.id || `legacy-module-${project.id}-${index}`,
        type: "module",
        status: item.status || "pending",
        label: `PDF ${attachments.length + (project.images || []).length + (project.imageData ? 1 : 0) + index + 1}`,
      })),
      ...(project.moduleData
        ? [
            {
              id: `legacy-module-data-${project.id}`,
              name: project.moduleFileName || "Modul 1",
              data: project.moduleData,
              type: "module",
              status: "pending",
              label: `PDF ${attachments.length + (project.images || []).length + (project.imageData ? 1 : 0) + (project.modules || []).length + 1}`,
              createdAt: project.date || project.createdAt || "",
            },
          ]
        : []),
    ];
  };

  useEffect(() => {
    // replace initial thumbnail loading with refresh helper
    let active = true;
    const cleanupUrls = [];
    const refreshThumbnails = async () => {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      setProjects(saved);
      const thumbMap = {};
      const urlMap = {};
      for (const project of saved) {
        const attachments = Array.isArray(project.attachments) ? project.attachments : [];
        // prefer first image in attachments
        const imageMeta = attachments.find((item) => item.type === "image" && (item.data || item.id));
        if (imageMeta) {
          if (imageMeta.data) {
            thumbMap[project.id] = imageMeta.data;
          } else if (imageMeta.id) {
            const attachment = await getAttachmentById(imageMeta.id);
            if (attachment?.blob) {
              const url = URL.createObjectURL(attachment.blob);
              thumbMap[project.id] = url;
              cleanupUrls.push(url);
              urlMap[imageMeta.id] = url;
            }
          }
        }
        // also create urls for module attachments
        for (const m of attachments.filter((it) => it.type === 'module' && it.id)) {
          const record = await getAttachmentById(m.id);
          if (record?.blob) {
            const url = URL.createObjectURL(record.blob);
            urlMap[m.id] = url;
            cleanupUrls.push(url);
          }
        }
      }
      if (!active) {
        cleanupUrls.forEach(URL.revokeObjectURL);
        return;
      }
      setProjectThumbnails(thumbMap);
      setAttachmentURLs(urlMap);
    };
    refreshThumbnails();

    return () => {
      active = false;
      cleanupUrls.forEach((u) => { try { if (u && u.startsWith && u.startsWith('blob:')) URL.revokeObjectURL(u); } catch(e){} });
    };
  }, []);

  useEffect(() => {
    if (selectedProject) {
      setSelectedAttachmentIndex(0);
      setAttachmentSearch("");
    }
  }, [selectedProject]);

  useEffect(() => {
    let active = true;
    let url = "";
    const loadSelectedAttachment = async () => {
      if (!selectedProject) {
        setSelectedAttachmentURL("");
        return;
      }
      const attachments = getProjectAttachments(selectedProject).filter((item) => {
        const search = attachmentSearch.trim().toLowerCase();
        if (!search) return true;
        return (
          item.name?.toLowerCase().includes(search) ||
          item.label?.toLowerCase().includes(search)
        );
      });
      const attachment = attachments[selectedAttachmentIndex];
      if (!attachment) {
        setSelectedAttachmentURL("");
        return;
      }
      if (attachment.data) {
        setSelectedAttachmentURL(attachment.data);
        return;
      }
      if (attachment.id) {
        const record = await getAttachmentById(attachment.id);
        if (active && record?.blob) {
          url = URL.createObjectURL(record.blob);
          setSelectedAttachmentURL(url);
        }
      }
    };
    loadSelectedAttachment();
    return () => {
      active = false;
      if (url) URL.revokeObjectURL(url);
    };
  }, [selectedProject, selectedAttachmentIndex, attachmentSearch]);

  const setAttachmentStatus = async (attachment, status) => {
    if (!selectedProject || !attachment) return;
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    const idx = saved.findIndex((p) => p.id === selectedProject.id);
    if (idx === -1) return;
    const proj = saved[idx];
    const attachments = Array.isArray(proj.attachments) ? [...proj.attachments] : [];
    const updated = attachments.map((item) => {
      if (attachment.id && item.id === attachment.id) {
        return { ...item, status };
      }
      if (!attachment.id && !item.id && item.type === attachment.type && item.name === attachment.name) {
        return { ...item, status };
      }
      return item;
    });

    if (!updated.some((item) => item.id === attachment.id || (!attachment.id && item.type === attachment.type && item.name === attachment.name))) {
      updated.push({ ...attachment, status, id: attachment.id || `status-${selectedProject.id}-${attachment.type}-${Date.now()}` });
    }

    proj.attachments = updated;
    saved[idx] = proj;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    setProjects(saved);
    setSelectedProject(proj);
  };

  const handleDeleteAttachment = async (attachment) => {
    if (!selectedProject || !attachment) return;
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    const idx = saved.findIndex((p) => p.id === selectedProject.id);
    if (idx === -1) return;
    const proj = saved[idx];

    if (attachment.type === "link") {
      proj.repoLink = "";
    } else {
      if (attachment.id) {
        try {
          await deleteAttachmentById(attachment.id);
        } catch (e) {
          console.error("Failed to delete attachment", e);
        }
      }
      proj.attachments = (proj.attachments || []).filter((a) => (attachment.id ? a.id !== attachment.id : a.name !== attachment.name));
    }

    saved[idx] = proj;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    setProjects(saved);
    setSelectedProject(proj);
    setSelectedAttachmentIndex(0);

    if (attachment.id && attachmentURLs[attachment.id]) {
      try {
        URL.revokeObjectURL(attachmentURLs[attachment.id]);
      } catch (e) {}
    }

    const refresh = async () => {
      const saved2 = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      setProjects(saved2);
      const urlMap = { ...attachmentURLs };
      if (attachment.id) delete urlMap[attachment.id];
      setAttachmentURLs(urlMap);
    };
    refresh();
  };

  const handleDecision = (decision) => {
    if (!selectedProject) return;
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    const idx = saved.findIndex((p) => p.id === selectedProject.id);
    if (idx === -1) return;
    saved[idx].decision = decision;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    setSelectedProject(saved[idx]);
    setProjects(saved);
  };

  const handleDeleteProject = async (projectId) => {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    const idx = saved.findIndex((p) => p.id === projectId);
    if (idx === -1) return;
    const proj = saved[idx];
    // delete attachment blobs from IndexedDB
    const attachments = Array.isArray(proj.attachments) ? proj.attachments : [];
    for (const a of attachments) {
      if (a?.id) {
        try {
          await deleteAttachmentById(a.id);
        } catch (e) {
          console.error("Failed to delete attachment blob for project", proj.id, e);
        }
      }
    }
    // remove project metadata
    saved.splice(idx, 1);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    setProjects(saved);
    if (selectedProject?.id === projectId) {
      setSelectedProject(null);
    }
    // revoke any blob URLs we were tracking
    const urls = Object.values(attachmentURLs || {});
    urls.forEach((u) => {
      try {
        if (u && u.startsWith && u.startsWith("blob:")) URL.revokeObjectURL(u);
      } catch (e) {}
    });
  };

  const filteredProjects = projects.filter((project) => {
    const matchesDate = !filterDate || project.date === filterDate;
    const searchTerm = projectSearch.trim().toLowerCase();
    const matchesName = !searchTerm || project.name?.toLowerCase().includes(searchTerm);
    return matchesDate && matchesName;
  });

  const renderModuleCell = (project) => {
    const matchingMembers = sampleMembers.filter((member) => member.position === project.position);
    const memberEmails = matchingMembers.map((member) => member.email).join(", ");
    const moduleAttachment = project.attachments?.find((item) => item.type === "module");

    const renderMemberInfo = () => {
      if (!matchingMembers.length) return null;
      return (
        <div className="text-xs text-gray-500 mt-1">
          {matchingMembers.length} {project.position} member{matchingMembers.length > 1 ? "s" : ""}: {memberEmails}
        </div>
      );
    };

    if (moduleAttachment) {
      return (
        <div className="space-y-1">
          <a
            href={attachmentURLs[moduleAttachment.id] || moduleAttachment.data}
            download={moduleAttachment.name || "modul.pdf"}
            className="text-sm text-blue-600 hover:underline"
          >
            {moduleAttachment.name || "Download"}
          </a>
          {renderMemberInfo()}
        </div>
      );
    }

    if (project.modules?.length > 0) {
      const module = project.modules[0];
      return (
        <div className="space-y-1">
          <a
            href={module.data}
            download={module.name || "modul.pdf"}
            className="text-sm text-blue-600 hover:underline"
          >
            {module.name || "Download"}
          </a>
          {renderMemberInfo()}
        </div>
      );
    }

    if (project.moduleData) {
      return (
        <div className="space-y-1">
          <a
            href={project.moduleData}
            download={project.moduleFileName || "modul.pdf"}
            className="text-sm text-blue-600 hover:underline"
          >
            {project.moduleFileName || "Download"}
          </a>
          {renderMemberInfo()}
        </div>
      );
    }

    return <span className="text-sm text-gray-400">Tidak ada</span>;
  };

  return (
    <div className="min-h-screen bg-[#eef2f7] p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <p className="text-xs font-semibold tracking-widest text-gray-500 uppercase">
            Progress Project
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-[#001d55] mt-2">
            Daftar Progress Project
          </h1>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 md:p-8">
          {projects.length > 0 && (
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-700">Filter Tanggal</label>
                  <input
                    type="date"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                    className="w-full h-12 border border-gray-300 rounded-xl px-4 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-700">Cari Nama Project</label>
                  <input
                    type="text"
                    value={projectSearch}
                    onChange={(e) => setProjectSearch(e.target.value)}
                    placeholder="Cari project..."
                    className="w-full h-12 border border-gray-300 rounded-xl px-4 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>
              {(filterDate || projectSearch) && (
                <button
                  type="button"
                  onClick={() => {
                    setFilterDate("");
                    setProjectSearch("");
                  }}
                  className="h-12 px-4 rounded-xl border border-gray-300 bg-white text-sm text-gray-700 hover:bg-gray-50"
                >
                  Reset filter
                </button>
              )}
            </div>
          )}
          {projects.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              Belum ada project yang diupload. Silakan tambah project di halaman Projects.
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              Tidak ada project untuk tanggal {filterDate}. Silakan hapus filter atau pilih tanggal lain.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-4 px-3 text-sm text-gray-500">Gambar</th>
                    <th className="py-4 px-3 text-sm text-gray-500">Nama Project</th>
                    <th className="py-4 px-3 text-sm text-gray-500">Posisi</th>
                    <th className="py-4 px-3 text-sm text-gray-500">Tanggal</th>
                    <th className="py-4 px-3 text-sm text-gray-500">Link</th>
                    <th className="py-4 px-3 text-sm text-gray-500">Progress</th>
                    <th className="py-4 px-3 text-sm text-gray-500">Modul</th>
                    <th className="py-4 px-3 text-sm text-gray-500">Status</th>
                    <th className="py-4 px-3 text-sm text-gray-500">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProjects.map((project) => (
                    <tr key={project.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                      <td className="py-4 px-3">
                        {projectThumbnails[project.id] || project.images?.length > 0 || project.imageData ? (
                          <button
                            type="button"
                            onClick={() => setSelectedProject(project)}
                            className="group inline-flex items-center rounded-lg overflow-hidden"
                          >
                            <img
                              src={projectThumbnails[project.id] || project.images?.[0]?.data || project.imageData}
                              alt={project.images?.[0]?.name || project.imageName || project.name}
                              className="w-20 h-14 object-cover rounded-lg transition duration-200 group-hover:scale-105"
                            />
                          </button>
                        ) : (
                          <span className="text-sm text-gray-400">Tidak ada</span>
                        )}
                      </td>
                      <td className="py-4 px-3 font-medium text-gray-700">{project.name}</td>
                      <td className="py-4 px-3 text-gray-600">{project.position}</td>
                      <td className="py-4 px-3 text-gray-600">{project.date}</td>
                      <td className="py-4 px-3 text-gray-600">
                        {project.repoLink ? (
                          <a
                            href={project.repoLink}
                            target="_blank"
                            rel="noreferrer"
                            className="text-sm text-blue-600 hover:underline"
                          >
                            Buka Link
                          </a>
                        ) : (
                          <span className="text-sm text-gray-400">Tidak ada</span>
                        )}
                      </td>
                      <td className="py-4 px-3">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-semibold text-[#001d55]">{project.progress}%</span>
                          <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                            <div
                              className="h-2 rounded-full bg-[#001d55]"
                              style={{ width: `${project.progress}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-3">
                        {renderModuleCell(project)}
                      </td>
                      <td className="py-4 px-3">
                        <span className={`text-xs px-2 py-1 rounded ${project.decision === 'approved' ? 'bg-green-100 text-green-700' : project.decision === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-50 text-yellow-700'}`}>{project.decision || 'pending'}</span>
                      </td>
                      <td className="py-4 px-3">
                        <div className="flex items-center gap-2">
                          <button onClick={() => setSelectedProject(project)} className="text-sm text-blue-600 hover:underline">Lihat</button>
                          <button onClick={() => handleDeleteProject(project.id)} className="text-red-600 hover:text-red-800 text-sm px-2 py-1 rounded">Hapus</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      {selectedProject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => setSelectedProject(null)}
        >
          <div
            className="relative max-w-5xl w-full rounded-3xl overflow-hidden bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedProject(null)}
              className="absolute top-4 right-4 z-10 rounded-full bg-black/60 px-3 py-1 text-white text-xl"
            >
              ×
            </button>
            <div className="grid md:grid-cols-[250px_1fr] gap-4 p-6">
              {(() => {
                const allAttachments = getProjectAttachments(selectedProject);
                const filteredAttachments = allAttachments.filter((item) => {
                  const search = attachmentSearch.trim().toLowerCase();
                  if (!search) return true;
                  return (
                    item.name?.toLowerCase().includes(search) ||
                    item.label?.toLowerCase().includes(search)
                  );
                });
                const attachment = filteredAttachments[selectedAttachmentIndex];

                const groupedAttachments = {
                  link: filteredAttachments.filter((item) => item.type === "link"),
                  image: filteredAttachments.filter((item) => item.type === "image"),
                  module: filteredAttachments.filter((item) => item.type === "module"),
                  other: filteredAttachments.filter((item) => !["link", "image", "module"].includes(item.type)),
                };

                return (
                  <>
                    <div className="space-y-4 overflow-y-auto max-h-[75vh]">
                      <div className="space-y-3">
                        <div className="text-sm font-semibold text-gray-700">Cari lampiran</div>
                        <input
                          type="search"
                          value={attachmentSearch}
                          onChange={(e) => {
                            setAttachmentSearch(e.target.value);
                            setSelectedAttachmentIndex(0);
                          }}
                          placeholder="Cari PDF, gambar, atau link..."
                          className="w-full h-12 border border-gray-300 rounded-xl px-4 focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                      </div>

                      <div className="space-y-4">
                        {Object.entries(groupedAttachments).map(([groupKey, items]) => {
                          const label =
                            groupKey === "link"
                              ? "Link"
                              : groupKey === "image"
                              ? "Gambar"
                              : groupKey === "module"
                              ? "PDF"
                              : "Lainnya";
                          if (!items.length) return null;
                          return (
                            <div key={groupKey} className="space-y-2">
                              <div className="text-sm font-semibold text-gray-600 uppercase tracking-wide">{label}</div>
                              <div className="space-y-2">
                                {items.map((item) => {
                                  const globalIndex = filteredAttachments.indexOf(item);
                                  return (
                                    <div
                                      key={`attach-${groupKey}-${globalIndex}`}
                                      className={`w-full rounded-xl border p-3 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-2 justify-between min-w-0 ${selectedAttachmentIndex === globalIndex ? "border-blue-600 bg-blue-50" : "border-gray-200 bg-white hover:bg-gray-50"}`}
                                    >
                                      <button
                                        type="button"
                                        onClick={() => setSelectedAttachmentIndex(globalIndex)}
                                        className="flex items-center gap-3 text-left flex-1 min-w-0"
                                      >
                                        {item.type === "image" ? (
                                          <img src={item.data || attachmentURLs[item.id] || ""} alt={item.name} className="w-14 h-10 object-cover rounded-md" />
                                        ) : item.type === "link" ? (
                                          <div className="w-14 h-10 flex items-center justify-center bg-blue-100 rounded-md text-xs text-blue-700">LINK</div>
                                        ) : (
                                          <div className="w-14 h-10 flex items-center justify-center bg-gray-100 rounded-md text-sm">PDF</div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                          <div className="text-sm font-semibold text-gray-800 truncate">{item.label}</div>
                                          <div className="flex flex-wrap gap-2 items-center text-xs text-gray-500 mt-1">
                                            <span className="truncate">{item.name || item.label}</span>
                                            <span>•</span>
                                            <span>{formatDate(item.createdAt)}</span>
                                            <span>•</span>
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] ${item.status === 'approved' ? 'bg-green-100 text-green-700' : item.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-50 text-yellow-700'}`}>{item.status || 'pending'}</span>
                                          </div>
                                        </div>
                                      </button>
                                      <div className="flex-none flex gap-2">
                                        <button
                                          type="button"
                                          onClick={() => handleDeleteAttachment(item)}
                                          className="text-red-600 hover:text-red-800 text-sm px-2 py-1 rounded-xl border border-red-200 bg-red-50"
                                          title="Hapus lampiran"
                                        >
                                          Hapus
                                        </button>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      {!filteredAttachments.length && (
                        <div className="text-sm text-gray-500">Tidak ada lampiran yang cocok dengan pencarian.</div>
                      )}
                    </div>

                    <div className="rounded-3xl bg-slate-900/5 p-4 min-h-[40vh] flex flex-col gap-4">
                      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between md:flex-wrap">
                        <div>
                          <div className="text-lg font-semibold text-gray-900 break-words">{selectedProject.name}</div>
                          <div className="text-sm text-gray-600">{selectedProject.position} • {selectedProject.date}</div>
                        </div>
                        <div className="flex flex-col items-start gap-3 md:items-end">
                          <div className="text-sm font-semibold text-[#001d55]">{selectedProject.progress}%</div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs text-gray-500">Decision:</span>
                            <span className={`text-xs px-2 py-1 rounded ${selectedProject.decision === 'approved' ? 'bg-green-100 text-green-700' : selectedProject.decision === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-50 text-yellow-700'}`}>{selectedProject.decision || 'pending'}</span>
                            <button onClick={() => handleDecision('approved')} className="text-white bg-green-600 hover:bg-green-700 px-2 py-1 rounded text-xs whitespace-nowrap">Approve</button>
                            <button onClick={() => handleDecision('rejected')} className="text-white bg-red-600 hover:bg-red-700 px-2 py-1 rounded text-xs whitespace-nowrap">Reject</button>
                            <button onClick={() => handleDecision('pending')} className="text-sm text-gray-600 px-2 py-1 rounded text-xs border whitespace-nowrap">Reset</button>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
                                const idx = saved.findIndex((p) => p.id === selectedProject.id);
                                if (idx === -1) return;
                                const proj = saved[idx];
                                proj.finished = true;
                                saved[idx] = proj;
                                localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
                                setProjects(saved);
                                setSelectedProject(proj);
                              }}
                              className="rounded-xl bg-[#001d55] px-4 py-2 text-sm font-semibold text-white hover:bg-[#00327a]"
                            >
                              Finish
                            </button>
                            {selectedProject.finished && (
                              <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-700">Selesai</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {!attachment ? (
                        <div className="text-sm text-gray-500">Pilih lampiran untuk melihat detail.</div>
                      ) : (() => {
                        const attachmentUrl =
                          attachment.data ||
                          selectedAttachmentURL ||
                          attachmentURLs[attachment.id] ||
                          "";
                        const approvalLabel = attachment.status || "pending";
                        return (
                          <div className="flex flex-col gap-4">
                            {attachment.type === "image" ? (
                              <img
                                src={attachmentUrl}
                                alt={attachment.name || selectedProject.name}
                                className="w-full h-[60vh] object-contain rounded-3xl bg-black"
                              />
                            ) : attachment.type === "link" ? (
                              <div className="rounded-3xl border border-dashed border-blue-300 p-8 text-center bg-blue-50">
                                <div className="text-4xl">🔗</div>
                                <div className="mt-4 text-sm font-semibold text-gray-800">{attachment.name || attachment.label}</div>
                                <p className="mt-2 text-sm text-gray-500">Klik tombol di bawah untuk membuka link.</p>
                              </div>
                            ) : (
                              <div className="rounded-3xl border border-dashed border-gray-300 p-8 text-center">
                                <div className="text-4xl">📄</div>
                                <div className="mt-4 text-sm font-semibold text-gray-800">{attachment.name || attachment.label}</div>
                                <p className="mt-2 text-sm text-gray-500">Klik tombol di bawah untuk mengunduh file.</p>
                              </div>
                            )}

                            <div className="flex flex-wrap items-center gap-3">
                              <span className={`text-xs px-2 py-1 rounded ${approvalLabel === 'approved' ? 'bg-green-100 text-green-700' : approvalLabel === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-50 text-yellow-700'}`}>{approvalLabel}</span>
                              <button
                                type="button"
                                onClick={() => setAttachmentStatus(attachment, 'approved')}
                                className="rounded-xl bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
                              >
                                Approve Lampiran
                              </button>
                              <button
                                type="button"
                                onClick={() => setAttachmentStatus(attachment, 'rejected')}
                                className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
                              >
                                Reject Lampiran
                              </button>
                              {attachment.type === 'link' ? (
                                <a
                                  href={attachmentUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="rounded-xl border border-blue-600 px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50"
                                >
                                  Buka Link
                                </a>
                              ) : attachment.type === 'image' ? null : (
                                <a
                                  href={attachmentUrl}
                                  download={attachment.name || 'modul.pdf'}
                                  className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                                >
                                  Unduh {attachment.name || attachment.label}
                                </a>
                              )}
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
