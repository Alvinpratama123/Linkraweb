"use client";

import { useEffect, useState } from "react";

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

const saveAttachment = async (attachment) => {
  const db = await openAttachmentDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(ATTACHMENT_STORE, "readwrite");
    const store = tx.objectStore(ATTACHMENT_STORE);
    const request = store.put(attachment);
    request.onsuccess = () => resolve(true);
    request.onerror = () => reject(request.error);
    tx.oncomplete = () => db.close();
  });
};

export default function UploadProjectPage() {
  const [projectName, setProjectName] = useState("");
  const [position, setPosition] = useState("Frontend");
  const [repoLink, setRepoLink] = useState("");
  const [inputDate, setInputDate] = useState("");
  const [progress, setProgress] = useState(75);
  const [imageFile, setImageFile] = useState(null);
  const [imageData, setImageData] = useState("");
  const [moduleFile, setModuleFile] = useState(null);
  const [moduleFileName, setModuleFileName] = useState("Belum ada file terpilih");
  const [moduleData, setModuleData] = useState("");
  const [savedMessage, setSavedMessage] = useState("");

  useEffect(() => {
    if (!inputDate) {
      const today = new Date().toISOString().slice(0, 10);
      setInputDate(today);
    }
  }, [inputDate]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setImageData(reader.result || "");
    };
    reader.readAsDataURL(file);
  };

  const handleModuleChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setModuleFile(file);
    setModuleFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      setModuleData(reader.result || "");
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    const projectNameValue = projectName.trim() || "Project Baru";
    const normalizedProjectName = projectNameValue.toLowerCase();
    const normalizedPosition = (position || "Frontend").trim();

    const imageEntry = imageFile
      ? {
          id: `${projectNameValue}-img-${Date.now()}`,
          type: "image",
          name: imageFile.name || `Gambar ${Date.now()}`,
          label: imageFile.name || `Gambar ${Date.now()}`,
          blob: imageFile,
          createdAt: new Date().toISOString(),
        }
      : null;
    const moduleEntry = moduleFile
      ? {
          id: `${projectNameValue}-mod-${Date.now()}`,
          type: "module",
          name: moduleFileName,
          label: moduleFileName,
          blob: moduleFile,
          createdAt: new Date().toISOString(),
        }
      : null;

    const currentList = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    const existingIndex = currentList.findIndex((item) => {
      const itemName = (item.name || "").trim().toLowerCase();
      const itemPosition = (item.position || "Frontend").trim();
      return itemName === normalizedProjectName && itemPosition === normalizedPosition;
    });

    const buildAttachmentArray = (item) => {
      if (Array.isArray(item?.attachments)) return item.attachments;
      const attachments = [];
      if (item?.imageData) {
        attachments.push({
          id: null,
          type: "image",
          name: item.imageName || "Gambar 1",
          label: item.imageName || "Gambar 1",
          data: item.imageData,
        });
      }
      if (item?.moduleData) {
        attachments.push({
          id: null,
          type: "module",
          name: item.moduleFileName || "Modul 1",
          label: item.moduleFileName || "Modul 1",
          data: item.moduleData,
        });
      }
      return attachments;
    };

    const baseProject = {
      name: projectNameValue,
      position: normalizedPosition,
      repoLink,
      date: inputDate,
      progress,
    };

    let updatedList;

    const saveAttachments = async () => {
      if (imageEntry) {
        await saveAttachment(imageEntry);
      }
      if (moduleEntry) {
        await saveAttachment(moduleEntry);
      }
    };

    const attachments = [];
    if (existingIndex >= 0) {
      const existingProject = currentList[existingIndex];
      attachments.push(...buildAttachmentArray(existingProject));
      if (imageEntry) attachments.push(imageEntry);
      if (moduleEntry) attachments.push(moduleEntry);

      const updatedProject = {
        ...existingProject,
        ...baseProject,
        id: existingProject.id,
        attachments,
      };

      updatedList = currentList.map((item, index) =>
        index === existingIndex ? updatedProject : item
      );
    } else {
      if (imageEntry) attachments.push(imageEntry);
      if (moduleEntry) attachments.push(moduleEntry);

      updatedList = [
        {
          id: Date.now(),
          ...baseProject,
          attachments,
        },
        ...currentList,
      ];
    }

    await saveAttachments();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));

    setSavedMessage("Project disimpan. Buka halaman Progress untuk melihat daftar.");
    setProjectName("");
    setPosition("");
    setRepoLink("");
    setProgress(75);
    setImageFile(null);
    setImageData("");
    setModuleFile(null);
    setModuleFileName("Belum ada file terpilih");
    setModuleData("");
  };

  return (
    <div className="min-h-screen bg-[#eef2f7] p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="mb-6">
          <p className="text-xs font-semibold tracking-widest text-gray-500 uppercase">
            Upload Project Baru
          </p>

          <h1 className="text-3xl md:text-4xl font-bold text-[#001d55] mt-2">
            Upload Project Baru
          </h1>
        </div>

        {/* CARD */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 md:p-8">
          {savedMessage && (
            <div className="mb-6 rounded-2xl bg-green-50 border border-green-200 p-4 text-green-700">
              {savedMessage}
            </div>
          )}

          {/* NAMA PROJECT */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              NAMA PROJECT
            </label>

            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Masukkan Nama Project"
              className="w-full h-12 border border-gray-300 rounded-xl px-4 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* POSISI PROJECT */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              POSISI PROJECT
            </label>

            <select
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              className="w-full h-12 border border-gray-300 rounded-xl px-4 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="" disabled>
                Pilih Posisi
              </option>
              <option value="Frontend">Frontend</option>
              <option value="Backend">Backend</option>
              <option value="Fullstack">Fullstack</option>
              <option value="UI/UX">UI/UX</option>
              <option value="DevOps">DevOps</option>
            </select>
          </div>

          {/* UPLOAD GAMBAR */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              UPLOAD GAMBAR PROJECT
            </label>

            <div className="border-2 border-dashed border-gray-300 rounded-2xl p-10 flex flex-col items-center justify-center text-center">
              <div className="text-4xl mb-3">📷</div>

              <label
                htmlFor="project-image"
                className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-5 py-2 rounded-lg text-sm font-medium"
              >
                Pilih Gambar (max 10MB)
              </label>
              <input
                id="project-image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <p className="text-sm text-gray-500 mt-3">
                {imageFile ? imageFile.name : "Belum ada gambar terpilih"}
              </p>
            </div>
          </div>

          {/* PREVIEW IMAGE */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Gambar Terpilih
            </label>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-gray-100 rounded-xl h-28 flex items-center justify-center overflow-hidden">
                {imageData ? (
                  <img
                    src={imageData}
                    alt="Preview Gambar Project"
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <span className="text-gray-400">Preview Gambar</span>
                )}
              </div>

              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Keterangan Gambar..."
                  className="w-full h-12 border rounded-xl px-4"
                />

                <input
                  type="text"
                  placeholder="Keterangan Gambar..."
                  className="w-full h-12 border rounded-xl px-4"
                />
              </div>
            </div>
          </div>

          {/* LINK */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              LINK PROGRAM / REPOSITORY
            </label>

            <input
              type="text"
              value={repoLink}
              onChange={(e) => setRepoLink(e.target.value)}
              placeholder="https://github.com/user/repo"
              className="w-full h-12 border border-gray-300 rounded-xl px-4"
            />
          </div>

          {/* FILE MODUL */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              UPLOAD MODUL (PDF, WORD)
            </label>

            <div className="flex flex-col md:flex-row gap-3 items-start md:items-center">
              <label
                htmlFor="module-file"
                className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <span>📄</span> Upload Modul
              </label>

              <input
                id="module-file"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleModuleChange}
                className="hidden"
              />

              <span className="text-sm text-gray-500">
                {moduleFileName}
              </span>
            </div>
          </div>

          {/* TANGGAL */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              TANGGAL INPUT
            </label>

            <input
              type="date"
              value={inputDate}
              onChange={(e) => setInputDate(e.target.value)}
              className="w-full md:w-72 h-12 border border-gray-300 rounded-xl px-4"
            />
          </div>

          {/* PROGRESS */}
          <div className="mb-10">
            <label className="block text-sm font-semibold text-gray-700 mb-5">
              PERSENTASE PROGRES HILANG (%)
            </label>

            <div className="flex justify-between text-sm mb-2">
              <span>0%</span>
              <span className="bg-[#001d55] text-white px-3 py-1 rounded-lg">
                {progress}%
              </span>
              <span>100%</span>
            </div>

            <input
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={(e) => setProgress(Number(e.target.value))}
              className="w-full accent-blue-600"
            />
          </div>

          {/* BUTTON */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleSubmit}
              className="bg-[#0066ff] hover:bg-[#0052cc] text-white px-8 py-3 rounded-xl font-semibold shadow-md transition"
            >
              SEND PROJECT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
