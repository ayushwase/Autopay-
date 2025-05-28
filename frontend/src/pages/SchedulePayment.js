// src/pages/SchedulePayment.js
import React, { useState } from 'react';
import './SchedulePayment.css';

const SchedulePayment = () => {
  const [form, setForm] = useState({
    payee: '',
    amount: '',
    date: '',
    frequency: 'one-time', // one-time or recurring
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Payment Scheduled:', form);
    alert('Payment scheduled successfully!');
    setForm({
      payee: '',
      amount: '',
      date: '',
      frequency: 'one-time',
    });
  };

  return (
    <div className="schedule-container">
      <h2>Schedule a Payment</h2>
      <form onSubmit={handleSubmit}>
        <label>Payee Name</label>
        <input
          type="text"
          name="payee"
          value={form.payee}
          onChange={handleChange}
          required
        />

        <label>Amount (₹)</label>
        <input
          type="number"
          name="amount"
          value={form.amount}
          onChange={handleChange}
          required
        />

        <label>Payment Date</label>
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          required
        />

        <label>Frequency</label>
        <select name="frequency" value={form.frequency} onChange={handleChange}>
          <option value="one-time">One-time</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>

        <button type="submit">Schedule Payment</button>
      </form>
    </div>
  );
};

export default SchedulePayment;
