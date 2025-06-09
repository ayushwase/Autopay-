// src/pages/SchedulePayment.js
import React, { useState } from 'react';
import api from '../api'; // <--- API इम्पोर्ट करा
import './SchedulePayment.css';

const SchedulePayment = () => {
  const [formData, setFormData] = useState({ // form ऐवजी formData वापरू
    payee: '',
    amount: '',
    due_date: '', // 'date' ऐवजी 'due_date' वापरा, backend ला अपेक्षित आहे
    method: '',   // 'frequency' ऐवजी 'method' वापरा, backend ला अपेक्षित आहे
                  // frequency फील्ड काढून टाका किंवा method मध्ये रूपांतरित करा
  });

  const handleChange = (e) => {
    setFormData(prev => ({ // setForm ऐवजी setFormData
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => { // async फंक्शन करा
    e.preventDefault();
    try {
      // console.log('Payment Scheduled:', formData); // ही लाइन debugging साठी ठेवा
      const res = await api.post('/schedule-payment', formData); // Backend ला डेटा पाठवा
      alert(res.data.message); // Backend कडून आलेला मेसेज दाखवा

      // फॉर्म रिसेट करा
      setFormData({
        payee: '',
        amount: '',
        due_date: '',
        method: '',
      });
    } catch (err) {
      console.error("Error scheduling payment:", err.response ? err.response.data : err);
      alert(`Failed to schedule payment: ${err.response?.data?.error || err.message || 'Unknown error'}`);
    }
  };

  return (
    <div className="schedule-container">
      <h2>Schedule a Payment</h2>
      <form onSubmit={handleSubmit}>
        <label>Payee Name</label>
        <input
          type="text"
          name="payee"
          value={formData.payee} // form.payee ऐवजी formData.payee
          onChange={handleChange}
          required
        />

        <label>Amount (₹)</label>
        <input
          type="number"
          name="amount"
          value={formData.amount} // form.amount ऐवजी formData.amount
          onChange={handleChange}
          required
        />

        <label>Payment Date</label>
        <input
          type="date"
          name="due_date" // name="date" ऐवजी name="due_date"
          value={formData.due_date} // form.date ऐवजी formData.due_date
          onChange={handleChange}
          required
        />

        <label>Payment Method</label> {/* "Frequency" ऐवजी "Payment Method" */}
        <input
          type="text" // select ऐवजी text input, कारण backend ला string 'method' अपेक्षित आहे
          name="method"
          value={formData.method}
          onChange={handleChange}
          required
          placeholder="e.g., Bank Transfer, Credit Card"
        />
        {/* <select name="frequency" value={form.frequency} onChange={handleChange}>
          <option value="one-time">One-time</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select> */} 

        <button type="submit">Schedule Payment</button>
      </form>
    </div>
  );
};

export default SchedulePayment;