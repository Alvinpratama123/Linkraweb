"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "revisionReports";

const loadSavedReports = () => {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch (e) {
    return [];
  }
};

const isImageFile = (name) => /\.(jpe?g|png|gif|webp|svg)$/i.test(name);
const isPdfFile = (name) => /\.pdf$/i.test(name);
const formatDateShort = (iso) => {
  try {
    return new Date(iso).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch (e) {
    return iso || "";
  }
};

export default function Revision() {
  const [reports, setReports] = useState([]);
  const [projectName, setProjectName] = useState("");
  const [position, setPosition] = useState("Frontend");
  const [issueType, setIssueType] = useState("Modul");
  const [description, setDescription] = useState("");
  const [progress, setProgress] = useState("Belum dilakukan");
  const [attachmentName, setAttachmentName] = useState("");
  const [attachmentData, setAttachmentData] = useState("");
  const [attachmentFile, setAttachmentFile] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [filterText, setFilterText] = useState("");

  useEffect(() => {
    setReports(loadSavedReports());
  }, []);

  const saveReports = (nextReports) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextReports));
    setReports(nextReports);
  };

  const handleAttachmentChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      setAttachmentName("");
      setAttachmentData("");
      setAttachmentFile(null);
      return;
    }
    setAttachmentName(file.name);
    setAttachmentFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setAttachmentData(reader.result || "");
    };
    reader.readAsDataURL(file);
  };

  const readFileDataUrl = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result || "");
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!projectName.trim()) return;

    let finalAttachmentData = attachmentData;
    if (attachmentFile && !attachmentData) {
      finalAttachmentData = await readFileDataUrl(attachmentFile);
    }

    const newReport = {
      id: Date.now(),
      projectName: projectName.trim(),
      position,
      issueType,
      description: description.trim(),
      progress,
      approval: "Pending",
      attachmentName,
      attachmentData: finalAttachmentData,
      createdAt: new Date().toISOString(),
    };

    const nextReports = [newReport, ...reports];
    saveReports(nextReports);
    setProjectName("");
    setDescription("");
    setAttachmentName("");
    setAttachmentData("");
    setAttachmentFile(null);
    setProgress("Belum dilakukan");
    setIssueType("Modul");
  };

  const updateReport = (id, changes) => {
    const nextReports = reports.map((report) => (report.id === id ? { ...report, ...changes } : report));
    saveReports(nextReports);
  };

  const deleteReport = (id) => {
    const nextReports = reports.filter((report) => report.id !== id);
    saveReports(nextReports);
  };

  const filteredReports = reports.filter((report) => {
    const search = filterText.trim().toLowerCase();
    if (!search) return true;
    return (
      report.projectName.toLowerCase().includes(search) ||
      report.position.toLowerCase().includes(search) ||
      report.issueType.toLowerCase().includes(search) ||
      report.description.toLowerCase().includes(search)
    );
  });

  return (
    <div className="min-h-screen bg-[#f4f7fb] p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <p className="text-xs font-semibold tracking-widest text-gray-500 uppercase">
            Revision Issue
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-[#001d55] mt-2">
            Halaman Revision
          </h1>
          <p className="mt-2 text-gray-600 max-w-2xl">
            Laporkan masalah modul atau project, pilih posisi frontend/backend/project, tambahkan keterangan, progress, dan lampiran file.
          </p>
        </div>

        <section className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm mb-8">
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Tambah Revisi Baru</h2>
              <p className="text-sm text-gray-500">Isi detail masalah dan upload lampiran jika perlu.</p>
            </div>
            <div className="w-full md:w-80">
              <label className="text-sm font-semibold text-gray-700">Cari laporan</label>
              <input
                type="text"
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                placeholder="Cari nama project, posisi, atau tipe..."
                className="mt-2 w-full h-12 border border-gray-300 rounded-xl px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <form className="grid gap-4" onSubmit={handleSubmit}>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="text-sm font-semibold text-gray-700">Nama Project</span>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="Nama project..."
                  className="mt-2 w-full h-12 border border-gray-300 rounded-xl px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-gray-700">Posisi</span>
                <select
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  className="mt-2 w-full h-12 border border-gray-300 rounded-xl px-4 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>Frontend</option>
                  <option>Backend</option>
                  <option>Project</option>
                  <option>UI/UX</option>
                  <option>DevOps</option>
                </select>
              </label>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="text-sm font-semibold text-gray-700">Tipe masalah</span>
                <select
                  value={issueType}
                  onChange={(e) => setIssueType(e.target.value)}
                  className="mt-2 w-full h-12 border border-gray-300 rounded-xl px-4 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>Modul</option>
                  <option>Project</option>
                  <option>Integrasi</option>
                  <option>Bug</option>
                  <option>Lainnya</option>
                </select>
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-gray-700">Label progress</span>
                <select
                  value={progress}
                  onChange={(e) => setProgress(e.target.value)}
                  className="mt-2 w-full h-12 border border-gray-300 rounded-xl px-4 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>Belum dilakukan</option>
                  <option>Sedang dikerjakan</option>
                  <option>Selesai</option>
                </select>
              </label>
            </div>

            <label className="block">
              <span className="text-sm font-semibold text-gray-700">Keterangan</span>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder="Jelaskan masalah, lokasi modul, dan detail lain..."
                className="mt-2 w-full border border-gray-300 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </label>

            <div className="grid gap-4 md:grid-cols-2 items-end">
              <label className="block">
                <span className="text-sm font-semibold text-gray-700">Lampiran</span>
                <input
                  type="file"
                  onChange={handleAttachmentChange}
                  className="mt-2 w-full text-sm text-gray-600"
                />
                {attachmentName ? (
                  <p className="mt-2 text-sm text-gray-500">File terpilih: {attachmentName}</p>
                ) : (
                  <p className="mt-2 text-sm text-gray-400">Tidak ada lampiran</p>
                )}
              </label>
              <button
                type="submit"
                className="h-12 rounded-2xl bg-blue-600 px-6 text-white font-semibold hover:bg-blue-700 transition"
              >
                Tambah Revisi
              </button>
            </div>
          </form>
        </section>

        <section className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm">
          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Daftar Revisi</h2>
              <p className="text-sm text-gray-500">Kelola status approval dan progress tiap laporan.</p>
            </div>
            <div className="text-sm text-gray-500">
              Total laporan: <span className="font-semibold text-gray-700">{filteredReports.length}</span>
            </div>
          </div>

          {filteredReports.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-gray-300 p-10 text-center text-gray-500">
              Belum ada laporan revisi. Tambahkan laporan di formulir di atas.
            </div>
          ) : (
            <div className="space-y-4">
              {filteredReports.map((report) => (
                <div key={report.id} className="rounded-3xl border border-gray-200 p-5 shadow-sm bg-[#fcfdff]">
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-2 items-center">
                        <span className="text-lg font-semibold text-gray-900">{report.projectName}</span>
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{report.position}</span>
                        <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">{report.issueType}</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <span className="text-xs uppercase tracking-[0.2em] text-gray-400">Tanggal</span>
                        <span className="text-xs text-gray-500">{formatDateShort(report.createdAt)}</span>
                      </div>
                      <p className="text-sm text-gray-600">{report.description || "Tidak ada deskripsi tambahan."}</p>
                    </div>
                    <div className="grid gap-2 text-right">
                      <div>
                        <span className="text-xs uppercase tracking-[0.2em] text-gray-400">Progress</span>
                        <div className="mt-1 rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-700">{report.progress}</div>
                      </div>
                      <div>
                        <span className="text-xs uppercase tracking-[0.2em] text-gray-400">Approval</span>
                        <div className={`mt-1 inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${report.approval === "Approved" ? "bg-emerald-100 text-emerald-700" : report.approval === "Rejected" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}`}>
                          {report.approval}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-4 md:grid-cols-3">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700">Ubah progress</label>
                      <select
                        value={report.progress}
                        onChange={(e) => updateReport(report.id, { progress: e.target.value })}
                        className="mt-2 w-full h-11 border border-gray-300 rounded-xl px-4 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option>Belum dilakukan</option>
                        <option>Sedang dikerjakan</option>
                        <option>Selesai</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700">Approval</label>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => updateReport(report.id, { approval: "Approved" })}
                          className="h-11 rounded-2xl bg-emerald-600 px-4 text-white text-sm hover:bg-emerald-700 transition"
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => updateReport(report.id, { approval: "Rejected" })}
                          className="h-11 rounded-2xl bg-red-600 px-4 text-white text-sm hover:bg-red-700 transition"
                        >
                          Reject
                        </button>
                        <button
                          type="button"
                          onClick={() => updateReport(report.id, { approval: "Pending" })}
                          className="h-11 rounded-2xl bg-gray-200 px-4 text-gray-700 text-sm hover:bg-gray-300 transition"
                        >
                          Reset
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-col gap-3 md:col-span-2">
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700">Lampiran</label>
                          <div className="mt-2 rounded-3xl border border-dashed border-gray-200 bg-gray-50 p-4 min-h-[120px] flex items-center justify-center">
                            {report.attachmentData ? (
                              isImageFile(report.attachmentName) ? (
                                <button
                                  type="button"
                                  onClick={() => setPreviewImage(report.attachmentData)}
                                  className="block rounded-2xl overflow-hidden border border-gray-200 hover:shadow-lg transition"
                                >
                                  <img
                                    src={report.attachmentData}
                                    alt={report.attachmentName}
                                    className="w-full max-h-72 object-contain"
                                  />
                                </button>
                              ) : isPdfFile(report.attachmentName) ? (
                                <div className="flex flex-col items-center gap-2 text-gray-700">
                                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-700 text-2xl font-bold">PDF</div>
                                  <a
                                    href={report.attachmentData}
                                    download={report.attachmentName}
                                    className="text-sm font-medium text-blue-600 hover:underline"
                                  >
                                    {report.attachmentName}
                                  </a>
                                </div>
                              ) : (
                                <a
                                  href={report.attachmentData}
                                  download={report.attachmentName}
                                  className="text-sm font-medium text-blue-600 hover:underline"
                                >
                                  {report.attachmentName}
                                </a>
                              )
                            ) : report.attachmentName ? (
                              <div className="text-sm text-gray-500">
                                File terdaftar: <span className="font-medium text-gray-900">{report.attachmentName}</span>
                              </div>
                            ) : (
                              <p className="text-sm text-gray-500">Tidak ada lampiran</p>
                            )}
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div>
                            <span className="text-sm font-semibold text-gray-700">Informasi cepat</span>
                            <div className="mt-2 grid gap-2 sm:grid-cols-2">
                              <div className="rounded-2xl bg-white border border-gray-200 px-4 py-3 text-sm text-gray-600">
                                <span className="block text-xs text-gray-400">Posisi</span>
                                <span className="font-semibold text-gray-900">{report.position}</span>
                              </div>
                              <div className="rounded-2xl bg-white border border-gray-200 px-4 py-3 text-sm text-gray-600">
                                <span className="block text-xs text-gray-400">Tipe</span>
                                <span className="font-semibold text-gray-900">{report.issueType}</span>
                              </div>
                            </div>
                          </div>
                          <div className="rounded-2xl bg-white border border-gray-200 p-4 text-sm text-gray-600">
                            <span className="block text-xs text-gray-400">Deskripsi singkat</span>
                            <p className="mt-2 text-sm text-gray-700">{report.description || "Tidak ada deskripsi tambahan."}</p>
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => deleteReport(report.id)}
                        className="h-11 w-full rounded-2xl border border-red-300 bg-red-50 text-red-700 text-sm hover:bg-red-100 transition"
                      >
                        Hapus laporan
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {previewImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="relative max-w-5xl w-full rounded-3xl overflow-hidden bg-white shadow-2xl">
            <button
              type="button"
              onClick={() => setPreviewImage("")}
              className="absolute right-4 top-4 z-10 h-10 w-10 rounded-full bg-white/90 text-gray-800 shadow hover:bg-white"
            >
              ×
            </button>
            <div className="p-4">
              <img
                src={previewImage}
                alt="Preview lampiran"
                className="w-full max-h-[85vh] object-contain rounded-3xl"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
