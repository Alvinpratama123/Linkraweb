import ExcelJS from "exceljs";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const ExportService = {
  async toExcel(projects) {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Laporan Proyek");

    sheet.columns = [
      { header: "Nama", key: "name", width: 30 },
      { header: "Posisi", key: "position", width: 20 },
      { header: "Progress", key: "progress", width: 10 },
      { header: "Decision", key: "decision", width: 15 },
      { header: "Selesai", key: "finished", width: 10 },
      { header: "Tanggal", key: "date", width: 20 },
    ];

    if (Array.isArray(projects)) {
      projects.forEach(p => sheet.addRow(p));
    }

    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;
  },

  async toPdf(projects) {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Laporan Proyek - Lintas Wahana", 14, 20);
    doc.setFontSize(10);
    doc.text(`Dicetak: ${new Date().toLocaleDateString("id-ID")}`, 14, 28);

    const rows = Array.isArray(projects)
      ? projects.map(p => [p.name, p.position, `${p.progress}%`, p.decision, p.finished ? "Ya" : "Tidak", new Date(p.date).toLocaleDateString("id-ID")])
      : [];

    autoTable(doc, {
      startY: 35,
      head: [["Nama", "Posisi", "Progress", "Decision", "Selesai", "Tanggal"]],
      body: rows,
    });

    return Buffer.from(doc.output("arraybuffer"));
  },
};
