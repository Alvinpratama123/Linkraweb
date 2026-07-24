// src/pages/dashboardAdmin/components/analytics.js
'use client';

import React, { useState, useEffect, useRef } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function Analytics({ theme = "light" }) {
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [members, setMembers] = useState([]);
  const chartRef = useRef(null);

  const isDark = theme === "dark";

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch projects
        const projectsRes = await fetch('/api/projects');
        const projectsData = await projectsRes.json();
        if (projectsData.success) {
          setProjects(projectsData.projects || []);
        }

        // Fetch members
        try {
          const membersRes = await fetch('/api/members');
          const membersData = await membersRes.json();
          if (membersData.success && membersData.members) {
            setMembers(membersData.members);
          }
        } catch (memberError) {
          console.error('Error fetching members:', memberError);
          setMembers([]);
        }

      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Program Analytics
  const categoryKeywords = {
    IoT: ['iot', 'sensor', 'arduino', 'raspberry'],
    Website: ['web', 'website', 'landing', 'portal', 'dashboard', 'erp', 'hr', 'cms'],
    'Mobile App': ['mobile', 'android', 'ios', 'flutter', 'react native', 'app'],
    API: ['api', 'backend', 'service', 'rest', 'graphql'],
  };

  const categoryCounts = Object.entries(categoryKeywords).reduce((acc, [cat, keywords]) => {
    acc[cat] = projects.filter((p) =>
      keywords.some((kw) => p.name?.toLowerCase().includes(kw))
    ).length;
    return acc;
  }, {});

  const otherCount = projects.filter((p) => {
    const allKw = Object.values(categoryKeywords).flat();
    return !allKw.some((kw) => p.name?.toLowerCase().includes(kw));
  }).length;
  if (otherCount > 0) categoryCounts['Lainnya'] = otherCount;

  const programStats = Object.entries(categoryCounts)
    .filter(([, count]) => count > 0)
    .map(([label, count]) => ({ label, count }));
  const maxProgram = Math.max(...programStats.map((item) => item.count), 1);

  // Member Analytics - dari data members
  const memberPositionCounts = members.reduce((acc, member) => {
    const pos = member.position || 'Lainnya';
    acc[pos] = (acc[pos] || 0) + 1;
    return acc;
  }, {});

  const memberStats = Object.entries(memberPositionCounts)
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count);
  const maxMember = Math.max(...memberStats.map((item) => item.count), 1);

  // Module Progress - Group projects by name (module)
  const moduleProjects = (() => {
    const grouped = new Map();

    projects.forEach((project) => {
      const moduleName = (project.name || "Untitled Module").trim();

      if (!grouped.has(moduleName)) {
        grouped.set(moduleName, {
          name: moduleName,
          projects: [],
          totalProgress: 0,
          count: 0,
          decisions: [],
        });
      }

      const mod = grouped.get(moduleName);
      mod.projects.push(project);
      mod.totalProgress += (project.progress || 0);
      mod.count += 1;
      mod.decisions.push(project.decision || "pending");
    });

    return Array.from(grouped.values())
      .map((module) => {
        const avgProgress = module.count > 0 ? Math.round(module.totalProgress / module.count) : 0;

        const allApproved = module.decisions.every((d) => d === "approved");
        const hasRejected = module.decisions.some((d) => d === "rejected");

        let status = "pending";
        if (allApproved && module.count > 0) status = "approved";
        else if (hasRejected) status = "rejected";

        return { ...module, avgProgress, status };
      })
      .sort((a, b) => b.avgProgress - a.avgProgress);
  })();

  const topModules = moduleProjects.slice(0, 5);

  const getStatusBadge = (status) => {
    if (status === "approved") return isDark ? "bg-green-900/50 text-green-300" : "bg-green-50 text-green-700";
    if (status === "rejected") return isDark ? "bg-red-900/50 text-red-300" : "bg-red-50 text-red-700";
    return isDark ? "bg-yellow-900/50 text-yellow-300" : "bg-yellow-50 text-yellow-700";
  };

  const getStatusLabel = (status) => {
    if (status === "approved") return "Approved";
    if (status === "rejected") return "Rejected";
    return "Pending";
  };

  // 🔥 WARNA BIRU GELAP UNTUK LIGHT MODE, BIRU TERANG UNTUK DARK MODE
  const colorMap = {
    IoT: { bg: isDark ? 'bg-blue-500' : 'bg-[#001d55]', stroke: isDark ? '#3b82f6' : '#001d55' },
    Website: { bg: isDark ? 'bg-blue-500' : 'bg-[#001d55]', stroke: isDark ? '#3b82f6' : '#001d55' },
    'Mobile App': { bg: isDark ? 'bg-blue-500' : 'bg-[#001d55]', stroke: isDark ? '#3b82f6' : '#001d55' },
    API: { bg: isDark ? 'bg-blue-500' : 'bg-[#001d55]', stroke: isDark ? '#3b82f6' : '#001d55' },
    'Lainnya': { bg: isDark ? 'bg-blue-500' : 'bg-[#001d55]', stroke: isDark ? '#3b82f6' : '#001d55' },
    Frontend: { bg: isDark ? 'bg-blue-500' : 'bg-[#001d55]', stroke: isDark ? '#3b82f6' : '#001d55' },
    Backend: { bg: isDark ? 'bg-blue-500' : 'bg-[#001d55]', stroke: isDark ? '#3b82f6' : '#001d55' },
    'UI/UX': { bg: isDark ? 'bg-blue-500' : 'bg-[#001d55]', stroke: isDark ? '#3b82f6' : '#001d55' },
    QA: { bg: isDark ? 'bg-blue-500' : 'bg-[#001d55]', stroke: isDark ? '#3b82f6' : '#001d55' },
    PM: { bg: isDark ? 'bg-blue-500' : 'bg-[#001d55]', stroke: isDark ? '#3b82f6' : '#001d55' },
  };

  const exportToExcel = () => {
    try {
      setShowExportMenu(false);

      const wb = XLSX.utils.book_new();

      // Summary Sheet
      const summaryData = [
        ['LAPORAN ANALYTICS'],
        [''],
        ['METRIK', 'NILAI'],
        ['Total Program', projects.length],
        ['Total Member', members.length],
        ['Program Terbanyak', programStats[0]?.label || '-'],
        ['Program Terbanyak (Jumlah)', programStats[0]?.count || 0],
        ['Member Terbanyak', memberStats[0]?.label || '-'],
        ['Member Terbanyak (Jumlah)', memberStats[0]?.count || 0],
        [''],
        ['Tanggal Laporan', new Date().toLocaleDateString('id-ID')],
        ['Waktu Laporan', new Date().toLocaleTimeString('id-ID')],
      ];

      const ws1 = XLSX.utils.aoa_to_sheet(summaryData);
      ws1['!cols'] = [{ wch: 35 }, { wch: 25 }];
      XLSX.utils.book_append_sheet(wb, ws1, 'Summary');

      // Program Stats
      const programData = [
        ['PROGRAM STATISTICS'],
        [''],
        ['No', 'Kategori Program', 'Jumlah', 'Persentase'],
        ...programStats.map((item, index) => [
          index + 1,
          item.label,
          item.count,
          `${((item.count / (projects.length || 1)) * 100).toFixed(1)}%`
        ]),
        ['', 'TOTAL', projects.length, '100%']
      ];

      const ws2 = XLSX.utils.aoa_to_sheet(programData);
      ws2['!cols'] = [{ wch: 8 }, { wch: 30 }, { wch: 15 }, { wch: 15 }];
      XLSX.utils.book_append_sheet(wb, ws2, 'Program Stats');

      // Member Stats
      const memberData = [
        ['MEMBER STATISTICS'],
        [''],
        ['No', 'Posisi Member', 'Jumlah', 'Persentase'],
        ...memberStats.map((item, index) => [
          index + 1,
          item.label,
          item.count,
          `${((item.count / (members.length || 1)) * 100).toFixed(1)}%`
        ]),
        ['', 'TOTAL', members.length, '100%']
      ];

      const ws3 = XLSX.utils.aoa_to_sheet(memberData);
      ws3['!cols'] = [{ wch: 8 }, { wch: 30 }, { wch: 15 }, { wch: 15 }];
      XLSX.utils.book_append_sheet(wb, ws3, 'Member Stats');

      // Project Details
      const projectDetailData = [
        ['PROJECT DETAILS'],
        [''],
        ['No', 'Nama Project', 'Posisi', 'Progress', 'Status', 'Tanggal'],
        ...projects.map((p, index) => [
          index + 1,
          p.name,
          p.position || '-',
          `${p.progress || 0}%`,
          p.decision || 'pending',
          new Date(p.date).toLocaleDateString('id-ID')
        ]),
      ];

      const ws4 = XLSX.utils.aoa_to_sheet(projectDetailData);
      ws4['!cols'] = [{ wch: 6 }, { wch: 35 }, { wch: 15 }, { wch: 12 }, { wch: 15 }, { wch: 15 }];
      XLSX.utils.book_append_sheet(wb, ws4, 'Project Details');

      // Member Details
      const memberDetailData = [
        ['MEMBER DETAILS'],
        [''],
        ['No', 'Nama Member', 'Posisi', 'Email', 'Profile'],
        ...members.map((m, index) => [
          index + 1,
          m.name,
          m.position,
          m.email,
          m.profile || '-'
        ]),
      ];

      const ws5 = XLSX.utils.aoa_to_sheet(memberDetailData);
      ws5['!cols'] = [{ wch: 6 }, { wch: 25 }, { wch: 15 }, { wch: 35 }, { wch: 35 }];
      XLSX.utils.book_append_sheet(wb, ws5, 'Member Details');

      // Module Progress
      const moduleProgressData = [
        ['MODULE PROGRESS'],
        [''],
        ['No', 'Nama Module', 'Jumlah Role', 'Rata-rata Progress', 'Status'],
        ...topModules.map((module, index) => [
          index + 1,
          module.name,
          module.count,
          `${module.avgProgress}%`,
          getStatusLabel(module.status)
        ]),
      ];

      const ws6 = XLSX.utils.aoa_to_sheet(moduleProgressData);
      ws6['!cols'] = [{ wch: 6 }, { wch: 35 }, { wch: 15 }, { wch: 20 }, { wch: 15 }];
      XLSX.utils.book_append_sheet(wb, ws6, 'Module Progress');

      XLSX.writeFile(wb, `Analytics_Report_${new Date().toISOString().slice(0,10)}.xlsx`);
      toast.success(`Laporan Excel berhasil diekspor. Total Program: ${projects.length}, Total Member: ${members.length}`, {
        duration: 3000,
        position: 'top-center',
      });

    } catch (error) {
      console.error('Error generating Excel:', error);
      toast.error(`Gagal mengekspor Excel: ${error.message}`, {
        duration: 4000,
        position: 'top-center',
      });
    }
  };

  const exportToPDF = () => {
    try {
      setShowExportMenu(false);

      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      let currentY = 20;

      doc.setFontSize(22);
      doc.setTextColor(0, 29, 85);
      doc.text('LAPORAN ANALYTICS', 15, currentY);
      currentY += 12;

      doc.setFontSize(11);
      doc.setTextColor(100);
      doc.text(`Generated: ${new Date().toLocaleDateString('id-ID')} ${new Date().toLocaleTimeString('id-ID')}`, 15, currentY);
      currentY += 15;

      // Summary
      doc.setFontSize(14);
      doc.setTextColor(0, 29, 85);
      doc.text('RINGKASAN', 15, currentY);
      currentY += 8;

      const summaryData = [
        ['Metrik', 'Nilai'],
        ['Total Program', projects.length],
        ['Total Member', members.length],
        ['Program Terbanyak', programStats[0]?.label || '-'],
        ['Program Terbanyak (Jumlah)', programStats[0]?.count || 0],
        ['Member Terbanyak', memberStats[0]?.label || '-'],
        ['Member Terbanyak (Jumlah)', memberStats[0]?.count || 0],
      ];

      autoTable(doc, {
        head: [summaryData[0]],
        body: summaryData.slice(1),
        startY: currentY,
        margin: { left: 15, right: 15 },
        styles: { cellPadding: 5, fontSize: 10 },
        headStyles: { fillColor: [0, 29, 85], textColor: 255, fontSize: 11 },
        alternateRowStyles: { fillColor: [240, 244, 248] },
      });

      currentY = doc.lastAutoTable.finalY + 15;

      // Program Stats
      doc.setFontSize(14);
      doc.setTextColor(0, 29, 85);
      doc.text('STATISTIK PROGRAM', 15, currentY);
      currentY += 8;

      const programTableData = programStats.map((item) => [
        item.label,
        item.count,
        `${((item.count / (projects.length || 1)) * 100).toFixed(1)}%`
      ]);

      autoTable(doc, {
        head: [['Kategori Program', 'Jumlah', 'Persentase']],
        body: programTableData,
        startY: currentY,
        margin: { left: 15, right: 15 },
        styles: { cellPadding: 4, fontSize: 10 },
        headStyles: { fillColor: [0, 29, 85], textColor: 255, fontSize: 11 },
        alternateRowStyles: { fillColor: [240, 244, 248] },
        foot: [['TOTAL', projects.length, '100%']],
        footStyles: { fillColor: [220, 230, 240], textColor: [0, 0, 0], fontStyle: 'bold' },
      });

      currentY = doc.lastAutoTable.finalY + 15;

      // Member Stats
      doc.setFontSize(14);
      doc.setTextColor(0, 29, 85);
      doc.text('STATISTIK MEMBER', 15, currentY);
      currentY += 8;

      const memberTableData = memberStats.map((item) => [
        item.label,
        item.count,
        `${((item.count / (members.length || 1)) * 100).toFixed(1)}%`
      ]);

      autoTable(doc, {
        head: [['Posisi Member', 'Jumlah', 'Persentase']],
        body: memberTableData,
        startY: currentY,
        margin: { left: 15, right: 15 },
        styles: { cellPadding: 4, fontSize: 10 },
        headStyles: { fillColor: [0, 29, 85], textColor: 255, fontSize: 11 },
        alternateRowStyles: { fillColor: [240, 244, 248] },
        foot: [['TOTAL', members.length, '100%']],
        footStyles: { fillColor: [220, 230, 240], textColor: [0, 0, 0], fontStyle: 'bold' },
      });

      currentY = doc.lastAutoTable.finalY + 15;

      // Module Progress
      if (topModules.length > 0) {
        doc.setFontSize(14);
        doc.setTextColor(0, 29, 85);
        doc.text('PROGRESS MODULE', 15, currentY);
        currentY += 8;

        const moduleTableData = topModules.map((module, index) => [
          `#${index + 1}`,
          module.name,
          module.count,
          `${module.avgProgress}%`,
          getStatusLabel(module.status)
        ]);

        autoTable(doc, {
          head: [['Rank', 'Nama Module', 'Jumlah Role', 'Rata-rata Progress', 'Status']],
          body: moduleTableData,
          startY: currentY,
          margin: { left: 15, right: 15 },
          styles: { cellPadding: 4, fontSize: 10 },
          headStyles: { fillColor: [0, 29, 85], textColor: 255, fontSize: 11 },
          alternateRowStyles: { fillColor: [240, 244, 248] },
        });

        currentY = doc.lastAutoTable.finalY + 15;
      }

      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        const pageHeight = doc.internal.pageSize.getHeight();
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text(`Page ${i} of ${pageCount} | Generated: ${new Date().toLocaleDateString('id-ID')}`, 15, pageHeight - 10);
      }

      doc.save(`Analytics_Report_${new Date().toISOString().slice(0,10)}.pdf`);
      toast.success('Laporan PDF berhasil diekspor.', {
        duration: 3000,
        position: 'top-center',
      });

    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error(`Gagal mengekspor PDF: ${error.message}`, {
        duration: 4000,
        position: 'top-center',
      });
    }
  };

  if (loading) {
    return (
      <>
        <Toaster position="top-center" reverseOrder={false} />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#001d55] mx-auto"></div>
            <p className="mt-4 text-gray-500">Memuat data analytics...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <div className={`min-h-screen p-4 md:p-8 ${isDark ? 'bg-slate-950 text-white' : 'bg-[#eef2f7]'}`}>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className={`text-xs font-semibold tracking-widest uppercase ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
              Analytics Dashboard
            </p>
            <h1 className={`text-3xl md:text-4xl font-bold ${isDark ? 'text-white' : 'text-[#001d55]'} mt-2`}>
              Analisis Program dan Member
            </h1>
            <div className="mt-2 flex flex-wrap gap-4 text-sm">
              <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${isDark ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-50 text-blue-600'}`}>
                📊 Total Program: <strong>{projects.length}</strong>
              </span>
              <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${isDark ? 'bg-green-900/30 text-green-300' : 'bg-green-50 text-green-600'}`}>
                👥 Total Member: <strong>{members.length}</strong>
              </span>
            </div>
          </div>
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="flex items-center gap-2 bg-[#001d55] hover:bg-[#001d55]/90 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200"
            >
              <span>📥 Export</span>
            </button>
            {showExportMenu && (
              <div className={`absolute right-0 mt-2 w-52 rounded-lg shadow-lg z-10 border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
                <button 
                  onClick={exportToExcel} 
                  className={`w-full text-left px-4 py-3 font-medium transition-colors border-b flex items-center gap-2 ${isDark ? 'text-slate-200 hover:bg-slate-700 border-slate-700' : 'text-gray-700 hover:bg-gray-50 border-gray-200'}`}
                >
                  <span>📊</span> Export Excel
                </button>
                <button 
                  onClick={exportToPDF} 
                  className={`w-full text-left px-4 py-3 font-medium transition-colors flex items-center gap-2 ${isDark ? 'text-slate-200 hover:bg-slate-700' : 'text-gray-700 hover:bg-gray-50'}`}
                >
                  <span>📄</span> Export PDF
                </button>
              </div>
            )}
          </div>
        </div>

        <div ref={chartRef} className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Program Chart */}
            <div className={`rounded-3xl border p-6 shadow-sm ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className={`text-sm font-semibold uppercase ${isDark ? 'text-slate-400' : 'text-gray-400'}`}>
                    Program Terbanyak
                  </p>
                  <h2 className={`mt-3 text-2xl font-bold ${isDark ? 'text-white' : 'text-[#001d55]'}`}>
                    {projects.length} Program
                  </h2>
                  <p className={`mt-2 text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                    Analisis jenis program yang paling sering dibuat.
                  </p>
                </div>
                <div className="rounded-3xl bg-[#001d55] px-4 py-3 text-white text-sm font-semibold">
                  Top: {programStats[0]?.label || '-'}
                </div>
              </div>

              <div className="mt-8 flex items-end justify-between gap-4 h-80">
                {programStats.length === 0 ? (
                  <div className={`w-full text-center ${isDark ? 'text-slate-400' : 'text-gray-400'}`}>Belum ada data program</div>
                ) : (
                  programStats.map((item) => {
                    const color = colorMap[item.label] || { bg: isDark ? 'bg-blue-500' : 'bg-[#001d55]' };
                    return (
                      <div key={item.label} className="flex flex-col items-center justify-end gap-2 flex-1 h-full">
                        <span className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {item.count}
                        </span>
                        <div className={`w-full rounded-t-lg overflow-hidden flex items-end flex-1 ${isDark ? 'bg-slate-700' : 'bg-gray-100'}`}>
                          <div
                            className={`${color.bg} w-full transition-all duration-300 hover:opacity-80 cursor-pointer rounded-t-lg`}
                            style={{ height: `${(item.count / maxProgram) * 100}%` }}
                          />
                        </div>
                        <span className={`text-sm font-medium text-center ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
                          {item.label}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Member Chart */}
            <div className={`rounded-3xl border p-6 shadow-sm ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className={`text-sm font-semibold uppercase ${isDark ? 'text-slate-400' : 'text-gray-400'}`}>
                    Member Terbanyak
                  </p>
                  <h2 className={`mt-3 text-2xl font-bold ${isDark ? 'text-white' : 'text-[#001d55]'}`}>
                    {members.length} Anggota
                  </h2>
                  <p className={`mt-2 text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                    Jumlah member berdasarkan posisi paling banyak.
                  </p>
                </div>
                <div className="rounded-3xl bg-[#001d55] px-4 py-3 text-white text-sm font-semibold">
                  Top: {memberStats[0]?.label || '-'}
                </div>
              </div>

              <div className="mt-8 flex items-end justify-between gap-4 h-80">
                {memberStats.length === 0 ? (
                  <div className={`w-full text-center ${isDark ? 'text-slate-400' : 'text-gray-400'}`}>Belum ada data member</div>
                ) : (
                  memberStats.map((item) => {
                    const color = colorMap[item.label] || { bg: isDark ? 'bg-blue-500' : 'bg-[#001d55]' };
                    return (
                      <div key={item.label} className="flex flex-col items-center justify-end gap-2 flex-1 h-full">
                        <span className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {item.count}
                        </span>
                        <div className={`w-full rounded-t-lg overflow-hidden flex items-end flex-1 ${isDark ? 'bg-slate-700' : 'bg-gray-100'}`}>
                          <div
                            className={`${color.bg} w-full transition-all duration-300 hover:opacity-80 cursor-pointer rounded-t-lg`}
                            style={{ height: `${(item.count / maxMember) * 100}%` }}
                          />
                        </div>
                        <span className={`text-sm font-medium text-center ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
                          {item.label}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Module Progress - Top 5 */}
          <div className={`rounded-3xl border p-6 shadow-sm ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className={`text-sm font-semibold uppercase ${isDark ? 'text-slate-400' : 'text-gray-400'}`}>
                  Module Progress
                </p>
                <h2 className={`mt-3 text-2xl font-bold ${isDark ? 'text-white' : 'text-[#001d55]'}`}>
                  Top 5 Module berdasarkan Progress
                </h2>
                <p className={`mt-2 text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                  Rata-rata progress seluruh role dalam setiap module.
                </p>
              </div>
              <div className={`rounded-3xl px-4 py-3 text-sm font-semibold ${isDark ? 'bg-blue-900/40 text-blue-300' : 'bg-[#001d55] text-white'}`}>
                Total: {moduleProjects.length} Module
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {moduleProjects.length === 0 ? (
                <div className={`text-center py-8 ${isDark ? 'text-slate-400' : 'text-gray-400'}`}>
                  Belum ada data module
                </div>
              ) : (
                topModules.map((module, index) => (
                  <div
                    key={module.name}
                    className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                      isDark
                        ? 'bg-slate-700/50 border-slate-600 hover:bg-slate-700'
                        : 'bg-gray-50 border-gray-200 hover:bg-white hover:shadow-sm'
                    }`}
                  >
                    <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                      index === 0 ? (isDark ? 'bg-yellow-900/50 text-yellow-300' : 'bg-yellow-100 text-yellow-700') :
                      index === 1 ? (isDark ? 'bg-slate-600 text-slate-300' : 'bg-gray-200 text-gray-600') :
                      index === 2 ? (isDark ? 'bg-orange-900/50 text-orange-300' : 'bg-orange-100 text-orange-700') :
                      (isDark ? 'bg-slate-700 text-slate-400' : 'bg-gray-100 text-gray-500')
                    }`}>
                      #{index + 1}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <h4 className={`font-semibold truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {module.name}
                          </h4>
                          <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                            {module.count} role &bull; {module.avgProgress}% rata-rata
                          </p>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${getStatusBadge(module.status)}`}>
                            {getStatusLabel(module.status)}
                          </span>
                          <span className={`text-sm font-bold ${isDark ? 'text-white' : 'text-[#001d55]'}`}>
                            {module.avgProgress}%
                          </span>
                        </div>
                      </div>
                      <div className={`mt-2 h-2 rounded-full overflow-hidden ${isDark ? 'bg-slate-600' : 'bg-gray-200'}`}>
                        <div
                          className="h-full rounded-full bg-[#001d55] transition-all duration-500"
                          style={{ width: `${module.avgProgress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  </>
  );
}