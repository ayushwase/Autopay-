import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import './BulkUpload.css';

const BulkUpload = () => {
  const [data, setData] = useState([]);
  const [message, setMessage] = useState('');

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    const isExcel = file.name.endsWith('.xlsx') || file.name.endsWith('.xls');

    if (isExcel || file.name.endsWith('.csv')) {
      reader.onload = (event) => {
        const workbook = XLSX.read(event.target.result, { type: 'binary' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const parsedData = XLSX.utils.sheet_to_json(sheet);
        setData(parsedData);
        setMessage('File uploaded successfully!');
      };
      reader.readAsBinaryString(file);
    } else {
      setMessage('Please upload a .csv or .xlsx file.');
    }
  };

  return (
    <div className="bulk-upload-container">
      <h2>Bulk Upload Payment Schedule</h2>

      <input type="file" accept=".csv,.xlsx,.xls" onChange={handleFileUpload} />
      {message && <p className="message">{message}</p>}

      {data.length > 0 && (
        <table>
          <thead>
            <tr>
              {Object.keys(data[0]).map((key, idx) => (
                <th key={idx}>{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={i}>
                {Object.values(row).map((val, j) => (
                  <td key={j}>{val}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default BulkUpload;
