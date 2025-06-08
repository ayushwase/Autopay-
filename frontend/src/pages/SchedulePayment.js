// File: frontend/src/pages/SchedulePayment.js
import React, { useState } from 'react';
import api from '../api'; // Import our API

function SchedulePayment() {
  const [formData, setFormData] = useState({
    // 'payer' field hata diya gaya hai, kyunki backend ab user_id se link karega
    payee: '',
    amount: '',
    due_date: '',
    method: ''
  });

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Default form submission ko rokein

    try {
      // Data ko backend par bhejte samay console mein log karein debugging ke liye
      console.log("Sending data to backend:", formData);

      const res = await api.post('/schedule-payment', formData);
      alert(res.data.message); // Success message dikhayein

      // Successful submission ke baad form ko clear karein
      setFormData({
        payee: '',
        amount: '',
        due_date: '',
        method: ''
      });
    } catch (err) {
      console.error("Error scheduling payment:", err.response ? err.response.data : err);
      // Backend se specific error message display karein agar available ho
      alert(`Failed to schedule payment: ${err.response?.data?.error || err.message || 'Unknown error'}`);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Schedule New Payment</h2>
      <form onSubmit={handleSubmit} className="card p-4 shadow-sm"> {/* Bootstrap classes for styling */}
        <div className="mb-3">
          <label htmlFor="payee" className="form-label">Payee</label>
          <input
            type="text"
            className="form-control"
            id="payee"
            name="payee"
            placeholder="e.g., Landlord, Electricity Company"
            value={formData.payee}
            onChange={handleChange}
            required // Yeh field bharna zaroori hai
          />
        </div>
        <div className="mb-3">
          <label htmlFor="amount" className="form-label">Amount</label>
          <input
            type="number" // Numeric input ke liye
            step="0.01" // Decimal values allow karein
            className="form-control"
            id="amount"
            name="amount"
            placeholder="e.g., 1500.00"
            value={formData.amount}
            onChange={handleChange}
            required // Yeh field bharna zaroori hai
          />
        </div>
        <div className="mb-3">
          <label htmlFor="due_date" className="form-label">Due Date</label>
          <input
            type="date" // Calendar picker aur YYYY-MM-DD format ke liye
            className="form-control"
            id="due_date"
            name="due_date"
            value={formData.due_date}
            onChange={handleChange}
            required // Yeh field bharna zaroori hai
          />
          <small className="form-text text-muted">Format: YYYY-MM-DD (automatically picked)</small>
        </div>
        <div className="mb-3">
          <label htmlFor="method" className="form-label">Payment Method</label>
          <input
            type="text"
            className="form-control"
            id="method"
            name="method"
            placeholder="e.g., Bank Transfer, Credit Card"
            value={formData.method}
            onChange={handleChange}
            required // Yeh field bharna zaroori hai
          />
        </div>
        <button type="submit" className="btn btn-primary">Schedule Payment</button>
      </form>
    </div>
  );
}

export default SchedulePayment;