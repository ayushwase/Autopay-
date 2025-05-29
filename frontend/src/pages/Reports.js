// src/pages/Reports.js
import React from 'react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { saveAs } from 'file-saver';
import './Reports.css';

const sampleData = [
  { id: 1, name: 'John Doe', date: '2025-05-01', amount: 2000, status: 'Completed' },
  { id: 2, name: 'Jane Smith', date: '2025-05-05', amount: 3000, status: 'Failed' },
  { id: 3, name: 'Alice', date: '2025-05-07', amount: 1500, status: 'Scheduled' },
];

const Reports = () => {
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(sampleData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'PaymentHistory');
    XLSX.writeFile(workbook, 'Payment_Report.xlsx');
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text('Payment Report', 14, 16);
    doc.autoTable({
      startY: 20,
      head: [['ID', 'Name', 'Date', 'Amount', 'Status']],
      body: sampleData.map(row => [row.id, row.name, row.date, row.amount, row.status]),
    });
    doc.save('Payment_Report.pdf');
  };

  return (
    <div className="reports-container" style={{ padding: '20px' }}>
      <h2>Reports</h2>
      <p>Download your payment history in Excel or PDF format.</p>
      <button onClick={exportToExcel} style={{ marginRight: '10px' }}>Export to Excel</button>
      <button onClick={exportToPDF}>Export to PDF</button>
    </div>
  );
};

export default Reports;
