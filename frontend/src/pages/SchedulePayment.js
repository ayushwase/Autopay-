import React, { useState } from 'react';
import api from '../api'; // <- Import our API

function SchedulePayment() {
  const [formData, setFormData] = useState({
    payer: '',
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
    e.preventDefault();
    try {
      const res = await api.post('/schedule-payment', formData);
      alert(res.data.message);
    } catch (err) {
      console.error(err);
      alert('Failed to schedule payment');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="payer" placeholder="Payer" onChange={handleChange} />
      <input name="payee" placeholder="Payee" onChange={handleChange} />
      <input name="amount" placeholder="Amount" onChange={handleChange} />
      <input name="due_date" placeholder="YYYY-MM-DD" onChange={handleChange} />
      <input name="method" placeholder="Method" onChange={handleChange} />
      <button type="submit">Schedule</button>
    </form>
  );
}

export default SchedulePayment;
