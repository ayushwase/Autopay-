import React, { useState } from 'react';
import './RescheduleUpdate.css';

const initialData = [
  {
    id: 1,
    recipient: 'John Doe',
    amount: 500,
    date: '2025-06-01',
    method: 'UPI',
  },
  {
    id: 2,
    recipient: 'Jane Smith',
    amount: 1000,
    date: '2025-06-10',
    method: 'Bank Transfer',
  },
];

const RescheduleUpdate = () => {
  const [payments, setPayments] = useState(initialData);
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({ amount: '', date: '', method: '' });

  const startEdit = (payment) => {
    setEditId(payment.id);
    setEditData({ amount: payment.amount, date: payment.date, method: payment.method });
  };

  const handleChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const saveUpdate = (id) => {
    const updated = payments.map((payment) =>
      payment.id === id ? { ...payment, ...editData } : payment
    );
    setPayments(updated);
    setEditId(null);
  };

  return (
    <div className="reschedule-container">
      <h2>Reschedule/Update Payments</h2>
      <table>
        <thead>
          <tr>
            <th>Recipient</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Method</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment) => (
            <tr key={payment.id}>
              <td>{payment.recipient}</td>
              <td>
                {editId === payment.id ? (
                  <input
                    type="number"
                    name="amount"
                    value={editData.amount}
                    onChange={handleChange}
                  />
                ) : (
                  `₹${payment.amount}`
                )}
              </td>
              <td>
                {editId === payment.id ? (
                  <input
                    type="date"
                    name="date"
                    value={editData.date}
                    onChange={handleChange}
                  />
                ) : (
                  payment.date
                )}
              </td>
              <td>
                {editId === payment.id ? (
                  <select name="method" value={editData.method} onChange={handleChange}>
                    <option value="UPI">UPI</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Credit Card">Credit Card</option>
                  </select>
                ) : (
                  payment.method
                )}
              </td>
              <td>
                {editId === payment.id ? (
                  <button onClick={() => saveUpdate(payment.id)} className="save-btn">Save</button>
                ) : (
                  <button onClick={() => startEdit(payment)} className="edit-btn">Edit</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RescheduleUpdate;
