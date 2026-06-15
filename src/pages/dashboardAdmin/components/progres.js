"use client";

import { useEffect, useState } from "react";
import { sampleMembers } from "./memberData";

const formatDate = (iso) => {
  try {
    return new Date(iso).toLocaleString();
  } catch (e) {
    return iso || "";
  }
};

export default function Progres() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedAttachmentIndex, setSelectedAttachmentIndex] = useState(0);
  const [filterDate, setFilterDate] = useState("");
  const [projectSearch, setProjectSearch] = useState("");
  const [attachmentSearch, setAttachmentSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/projects");
      const data = await res.json();
      if (data.success) {
        setProjects(data.projects);
        return data.projects;
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

  const getProjectAttachments = (project) => {
    if (!project) return [];

    const attachments = (project.attachments || []).map((item, index) => ({
      ...item,
      status: item.status || "pending",
      label: item.name || (item.type === "image" ? `Gambar ${index + 1}` : item.type === "link" ? `Link ${index + 1}` : `PDF ${index + 1}`),
      data: item.url || null,
    }));

    if (project.repoLink) {
      attachments.push({
        id: `repo-${project.id}`,
        type: "link",
        name: project.repoLink,
        label: "Project Link",
        data: project.repoLink,
        url: project.repoLink,
        createdAt: project.date || project.createdAt || "",
        status: "pending",
      });
    }

    return attachments;
  };

  const handleDecision = async (decision) => {
    if (!selectedProject) return;
    try {
      const res = await fetch(`/api/projects/${selectedProject.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ decision }),
      });
      const data = await res.json();
      if (data.success) {
        setSelectedProject(data.project);
        setProjects((prev) => prev.map((p) => p.id === data.project.id ? data.project : p));
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
        setSelectedProject(data.project);
        setProjects((prev) => prev.map((p) => p.id === data.project.id ? data.project : p));
      }
    } catch (error) {
      console.error("Finish error:", error);
    }
  };

  const handleDeleteProject = async (projectId) => {
    try {
      await fetch(`/api/projects/${projectId}`, { method: "DELETE" });
      setProjects((prev) => prev.filter((p) => p.id !== projectId));
      if (selectedProject?.id === projectId) setSelectedProject(null);
    } catch (error) {
      console.error("Delete project error:", error);
    }
  };

  const handleDeleteAttachment = async (attachment) => {
    if (!selectedProject || !attachment) return;
    if (attachment.type === "link") {
      await fetch(`/api/projects/${selectedProject.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoLink: "" }),
      });
    } else {
      await fetch(`/api/projects/attachments/${attachment.id}`, { method: "DELETE" });
    }
    const updated = await fetchProjects();
    const updatedProject = updated.find((p) => p.id === selectedProject.id);
    setSelectedProject(updatedProject || null);
    setSelectedAttachmentIndex(0);
  };

  const setAttachmentStatus = async (attachment, status) => {
    if (!attachment || attachment.type === "link") return;
    try {
      await fetch(`/api/projects/attachments/${attachment.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const updated = await fetchProjects();
      const updatedProject = updated.find((p) => p.id === selectedProject.id);
      if (updatedProject) setSelectedProject({ ...updatedProject });
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
            href={moduleAttachment.url}
            target="_blank"
            rel="noreferrer"
            download={moduleAttachment.name}
            className="text-sm text-blue-600 hover:underline"
          >
            {moduleAttachment.name || "Download"}
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
          <p className="text-xs font-semibold tracking-widest text-gray-500 uppercase">Progress Project</p>
          <h1 className="text-3xl md:text-4xl font-bold text-[#001d55] mt-2">Daftar Progress Project</h1>
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
                  onClick={() => { setFilterDate(""); setProjectSearch(""); }}
                  className="h-12 px-4 rounded-xl border border-gray-300 bg-white text-sm text-gray-700 hover:bg-gray-50"
                >
                  Reset filter
                </button>
              )}
            </div>
          )}

          {loading ? (
            <div className="text-center py-16 text-gray-500">Memuat data...</div>
          ) : projects.length === 0 ? (
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
                  {filteredProjects.map((project) => {
                    const imageAttachment = project.attachments?.find((a) => a.type === "image");
                    return (
                      <tr key={project.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                        <td className="py-4 px-3">
                          {imageAttachment ? (
                            <button
                              type="button"
                              onClick={() => setSelectedProject(project)}
                              className="group inline-flex items-center rounded-lg overflow-hidden"
                            >
                              <img
                                src={imageAttachment.url}
                                alt={imageAttachment.name}
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
                            <a href={project.repoLink} target="_blank" rel="noreferrer" className="text-sm text-blue-600 hover:underline">
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
                              <div className="h-2 rounded-full bg-[#001d55]" style={{ width: `${project.progress}%` }} />
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-3">{renderModuleCell(project)}</td>
                        <td className="py-4 px-3">
                          <span className={`text-xs px-2 py-1 rounded ${
                            project.decision === "approved" ? "bg-green-100 text-green-700" :
                            project.decision === "rejected" ? "bg-red-100 text-red-700" :
                            "bg-yellow-50 text-yellow-700"
                          }`}>
                            {project.decision || "pending"}
                          </span>
                        </td>
                        <td className="py-4 px-3">
                          <div className="flex items-center gap-2">
                            <button onClick={() => setSelectedProject(project)} className="text-sm text-blue-600 hover:underline">Lihat</button>
                            <button onClick={() => handleDeleteProject(project.id)} className="text-red-600 hover:text-red-800 text-sm px-2 py-1 rounded">Hapus</button>
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
                    return item.name?.toLowerCase().includes(search) || item.label?.toLowerCase().includes(search);
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
                            onChange={(e) => { setAttachmentSearch(e.target.value); setSelectedAttachmentIndex(0); }}
                            placeholder="Cari PDF, gambar, atau link..."
                            className="w-full h-12 border border-gray-300 rounded-xl px-4 focus:outline-none focus:ring-2 focus:ring-blue-600"
                          />
                        </div>
                        <div className="space-y-4">
                          {Object.entries(groupedAttachments).map(([groupKey, items]) => {
                            const label = groupKey === "link" ? "Link" : groupKey === "image" ? "Gambar" : groupKey === "module" ? "PDF" : "Lainnya";
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
                                        className={`w-full rounded-xl border p-3 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-2 justify-between min-w-0 ${
                                          selectedAttachmentIndex === globalIndex
                                            ? "border-blue-600 bg-blue-50"
                                            : "border-gray-200 bg-white hover:bg-gray-50"
                                        }`}
                                      >
                                        <button
                                          type="button"
                                          onClick={() => setSelectedAttachmentIndex(globalIndex)}
                                          className="flex items-center gap-3 text-left flex-1 min-w-0"
                                        >
                                          {item.type === "image" ? (
                                            <img src={item.url || item.data} alt={item.name} className="w-14 h-10 object-cover rounded-md" />
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
                                              <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                                                item.status === "approved" ? "bg-green-100 text-green-700" :
                                                item.status === "rejected" ? "bg-red-100 text-red-700" :
                                                "bg-yellow-50 text-yellow-700"
                                              }`}>
                                                {item.status || "pending"}
                                              </span>
                                            </div>
                                          </div>
                                        </button>
                                        <div className="flex-none flex gap-2">
                                          <button
                                            type="button"
                                            onClick={() => handleDeleteAttachment(item)}
                                            className="text-red-600 hover:text-red-800 text-sm px-2 py-1 rounded-xl border border-red-200 bg-red-50"
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
                              <span className={`text-xs px-2 py-1 rounded ${
                                selectedProject.decision === "approved" ? "bg-green-100 text-green-700" :
                                selectedProject.decision === "rejected" ? "bg-red-100 text-red-700" :
                                "bg-yellow-50 text-yellow-700"
                              }`}>
                                {selectedProject.decision || "pending"}
                              </span>
                              <button onClick={() => handleDecision("approved")} className="text-white bg-green-600 hover:bg-green-700 px-2 py-1 rounded text-xs whitespace-nowrap">Approve</button>
                              <button onClick={() => handleDecision("rejected")} className="text-white bg-red-600 hover:bg-red-700 px-2 py-1 rounded text-xs whitespace-nowrap">Reject</button>
                              <button onClick={() => handleDecision("pending")} className="text-gray-600 px-2 py-1 rounded text-xs border whitespace-nowrap">Reset</button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              <button
                                type="button"
                                onClick={handleFinish}
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
                          const attachmentUrl = attachment.url || attachment.data || "";
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
                                <span className={`text-xs px-2 py-1 rounded ${
                                  approvalLabel === "approved" ? "bg-green-100 text-green-700" :
                                  approvalLabel === "rejected" ? "bg-red-100 text-red-700" :
                                  "bg-yellow-50 text-yellow-700"
                                }`}>
                                  {approvalLabel}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => setAttachmentStatus(attachment, "approved")}
                                  className="rounded-xl bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
                                >
                                  Approve Lampiran
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setAttachmentStatus(attachment, "rejected")}
                                  className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
                                >
                                  Reject Lampiran
                                </button>
                                {attachment.type === "link" ? (
                                  <a
                                    href={attachmentUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="rounded-xl border border-blue-600 px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50"
                                  >
                                    Buka Link
                                  </a>
                                ) : attachment.type === "image" ? null : (
                                  <a
                                    href={attachmentUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    download={attachment.name || "modul.pdf"}
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