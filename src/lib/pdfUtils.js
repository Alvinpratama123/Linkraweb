// lib/pdfUtils.js
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generatePDF = (title, data, filename) => {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(18);
  doc.text(title, 20, 30);
  
  // Gunakan autoTable
  autoTable(doc, {
    head: [['Column 1', 'Column 2']],
    body: data,
    startY: 40,
  });
  
  doc.save(filename);
};

export { autoTable, jsPDF };