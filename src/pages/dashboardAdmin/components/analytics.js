import React, { useState, useRef } from 'react'
import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import html2canvas from 'html2canvas'

export default function Analytics() {
  const [showExportMenu, setShowExportMenu] = useState(false)
  const chartRef = useRef(null)
  const programStats = [
    { label: 'IoT', count: 14, bg: 'bg-blue-600', stroke: '#2563eb' },
    { label: 'Website', count: 9, bg: 'bg-green-600', stroke: '#16a34a' },
    { label: 'Mobile App', count: 6, bg: 'bg-orange-500', stroke: '#f97316' },
    { label: 'API', count: 4, bg: 'bg-purple-600', stroke: '#7c3aed' },
  ]

  const memberStats = [
    { label: 'Frontend', count: 8, bg: 'bg-sky-500', stroke: '#0ea5e9' },
    { label: 'Backend', count: 6, bg: 'bg-cyan-600', stroke: '#0891b2' },
    { label: 'UI/UX', count: 5, bg: 'bg-violet-500', stroke: '#8b5cf6' },
    { label: 'QA', count: 3, bg: 'bg-amber-500', stroke: '#f59e0b' },
  ]

  const maxProgram = Math.max(...programStats.map((item) => item.count), 1)
  const maxMember = Math.max(...memberStats.map((item) => item.count), 1)

  const exportToExcel = async () => {
    try {
      const programData = programStats.map((item) => ({
        Kategori: item.label,
        'Jumlah Program': item.count,
      }))

      const memberData = memberStats.map((item) => ({
        Posisi: item.label,
        'Jumlah Member': item.count,
      }))

      const workbook = XLSX.utils.book_new()
      const programSheet = XLSX.utils.json_to_sheet(programData)
      const memberSheet = XLSX.utils.json_to_sheet(memberData)

      XLSX.utils.book_append_sheet(workbook, programSheet, 'Program Stats')
      XLSX.utils.book_append_sheet(workbook, memberSheet, 'Member Stats')

      // Add summary sheet
      const summaryData = [
        { Metrik: 'Total Program', Nilai: programStats.reduce((sum, item) => sum + item.count, 0) },
        { Metrik: 'Total Member', Nilai: memberStats.reduce((sum, item) => sum + item.count, 0) },
        { Metrik: 'Program Terbanyak', Nilai: programStats[0].label },
        { Metrik: 'Member Terbanyak', Nilai: memberStats[0].label },
      ]
      const summarySheet = XLSX.utils.json_to_sheet(summaryData)
      XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary')

      XLSX.writeFile(workbook, 'Analytics_Report.xlsx')
      setShowExportMenu(false)
    } catch (error) {
      console.error('Error generating Excel:', error)
      alert('Error exporting to Excel')
    }
  }

  const exportToPDF = async () => {
    try {
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      })

      let currentY = 20

      // Header
      pdf.setFontSize(16)
      pdf.text('Analytics Report', 15, currentY)
      currentY += 10

      pdf.setFontSize(11)
      pdf.text('Analisis Program dan Member', 15, currentY)
      currentY += 15

      // Summary section
      pdf.setFontSize(12)
      pdf.text('Summary:', 15, currentY)
      currentY += 8

      const summaryText = [
        `Total Program: ${programStats.reduce((sum, item) => sum + item.count, 0)}`,
        `Total Member: ${memberStats.reduce((sum, item) => sum + item.count, 0)}`,
        `Program Terbanyak: ${programStats[0].label} (${programStats[0].count})`,
        `Member Terbanyak: ${memberStats[0].label} (${memberStats[0].count})`,
      ]

      pdf.setFontSize(10)
      summaryText.forEach((text) => {
        pdf.text(text, 15, currentY)
        currentY += 6
      })

      currentY += 5

      // Program Stats Table
      pdf.setFontSize(11)
      pdf.text('Program Statistics:', 15, currentY)
      currentY += 8

      pdf.setFontSize(9)
      const programTableData = programStats.map((item) => [item.label, item.count.toString()])
      pdf.autoTable({
        head: [['Kategori', 'Jumlah']],
        body: programTableData,
        startY: currentY,
        margin: { left: 15, right: 15 },
        styles: { cellPadding: 3, fontSize: 9 },
        headStyles: { fillColor: [0, 29, 85], textColor: 255 },
        alternateRowStyles: { fillColor: [245, 245, 245] },
      })

      currentY = pdf.lastAutoTable.finalY + 10

      // Member Stats Table
      pdf.setFontSize(11)
      pdf.text('Member Statistics:', 15, currentY)
      currentY += 8

      pdf.setFontSize(9)
      const memberTableData = memberStats.map((item) => [item.label, item.count.toString()])
      pdf.autoTable({
        head: [['Posisi', 'Jumlah']],
        body: memberTableData,
        startY: currentY,
        margin: { left: 15, right: 15 },
        styles: { cellPadding: 3, fontSize: 9 },
        headStyles: { fillColor: [0, 29, 85], textColor: 255 },
        alternateRowStyles: { fillColor: [245, 245, 245] },
      })

      // Footer
      const pageHeight = pdf.internal.pageSize.getHeight()
      pdf.setFontSize(8)
      pdf.text(
        `Generated: ${new Date().toLocaleDateString('id-ID')} - Page 1`,
        15,
        pageHeight - 10
      )

      pdf.save('Analytics_Report.pdf')
      setShowExportMenu(false)
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Error exporting to PDF: ' + error.message)
    }
  }

  return (
    <div className="min-h-screen bg-[#eef2f7] p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold tracking-widest text-gray-500 uppercase">
              Analytics Dashboard
            </p>
            <h1 className="text-3xl md:text-4xl font-bold text-[#001d55] mt-2">
              Analisis Program dan Member
            </h1>
          </div>
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="flex items-center gap-2 bg-[#001d55] hover:bg-[#001d55]/90 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200"
            >
              <span>📥 Export</span>
            </button>
            {showExportMenu && (
              <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                <button
                  onClick={exportToExcel}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 text-gray-700 font-medium transition-colors border-b"
                >
                  📊 Export Excel
                </button>
                <button
                  onClick={exportToPDF}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 text-gray-700 font-medium transition-colors"
                >
                  📄 Export PDF
                </button>
              </div>
            )}
          </div>
        </div>

        <div ref={chartRef} className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-gray-400 uppercase">Program Terbanyak</p>
                  <h2 className="mt-3 text-2xl font-bold text-[#001d55]">{programStats.reduce((sum, item) => sum + item.count, 0)} Program</h2>
                  <p className="mt-2 text-sm text-gray-500">Analisis jenis program yang paling sering dibuat.</p>
                </div>
                <div className="rounded-3xl bg-[#001d55] px-4 py-3 text-white text-sm font-semibold">
                  Top: {programStats[0].label}
                </div>
              </div>

              <div className="mt-8 flex items-end justify-between gap-4 h-80">
                {programStats.map((item) => (
                  <div key={item.label} className="flex flex-col items-center justify-end gap-2 flex-1 h-full">
                    <span className="text-xl font-bold text-gray-900">{item.count}</span>
                    <div className="w-full bg-gray-100 rounded-t-lg overflow-hidden flex items-end flex-1">
                      <div
                        className={`${item.bg} w-full transition-all duration-300 hover:opacity-80 cursor-pointer rounded-t-lg`}
                        style={{ height: `${(item.count / maxProgram) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-600 text-center">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-gray-400 uppercase">Member Terbanyak</p>
                  <h2 className="mt-3 text-2xl font-bold text-[#001d55]">{memberStats.reduce((sum, item) => sum + item.count, 0)} Anggota</h2>
                  <p className="mt-2 text-sm text-gray-500">Jumlah member berdasarkan posisi paling banyak.</p>
                </div>
                <div className="rounded-3xl bg-[#001d55] px-4 py-3 text-white text-sm font-semibold">
                  Top: {memberStats[0].label}
                </div>
              </div>

              <div className="mt-8 flex items-end justify-between gap-4 h-80">
                {memberStats.map((item) => (
                  <div key={item.label} className="flex flex-col items-center justify-end gap-2 flex-1 h-full">
                    <span className="text-xl font-bold text-gray-900">{item.count}</span>
                    <div className="w-full bg-gray-100 rounded-t-lg overflow-hidden flex items-end flex-1">
                      <div
                        className={`${item.bg} w-full transition-all duration-300 hover:opacity-80 cursor-pointer rounded-t-lg`}
                        style={{ height: `${(item.count / maxMember) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-600 text-center">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900">Perbandingan Program</h3>
              <p className="mt-2 text-sm text-gray-500">Dari data ini, IoT menjadi kategori program terbanyak.</p>
              <div className="mt-6 flex items-end justify-between gap-3 h-72">
                {programStats.map((item) => (
                  <div key={item.label} className="flex flex-col items-center justify-end gap-2 flex-1 h-full">
                    <span className="text-sm font-bold text-gray-900">{item.count}</span>
                    <div className="w-full bg-gray-100 rounded-t-md overflow-hidden flex items-end flex-1">
                      <div
                        className={`${item.bg} w-full transition-all duration-300 hover:opacity-80 cursor-pointer rounded-t-md`}
                        style={{ height: `${(item.count / maxProgram) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-gray-600 text-center">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900">Perbandingan Member</h3>
              <p className="mt-2 text-sm text-gray-500">Posisi frontend dan backend memiliki jumlah member tertinggi.</p>
              <div className="mt-6 flex items-end justify-between gap-3 h-72">
                {memberStats.map((item) => (
                  <div key={item.label} className="flex flex-col items-center justify-end gap-2 flex-1 h-full">
                    <span className="text-sm font-bold text-gray-900">{item.count}</span>
                    <div className="w-full bg-gray-100 rounded-t-md overflow-hidden flex items-end flex-1">
                      <div
                        className={`${item.bg} w-full transition-all duration-300 hover:opacity-80 cursor-pointer rounded-t-md`}
                        style={{ height: `${(item.count / maxMember) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-gray-600 text-center">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
