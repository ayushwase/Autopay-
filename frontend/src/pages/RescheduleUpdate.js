// File: frontend/src/pages/RescheduleUpdate.js
// 'FAILED' payments automatic fetch karun display karnyasathi ani update karnyasathi updated code

import React, { useState, useEffect } from 'react'; // useEffect import kara
import api from '../api'; // api client import kara
import './RescheduleUpdate.css'; // तुमचा CSS फाईलचा मार्ग

const USER_ID = 1; // Demo user ID

const RescheduleUpdate = () => {
  const [payments, setPayments] = useState([]); // initialData काढून टाका, empty array set kara
  const [editId, setEditId] = useState(null);
  // 'date' ला 'due_date' मध्ये बदला, payee पण editData मध्ये असावे
  const [editData, setEditData] = useState({ amount: '', due_date: '', method: '', payee: '' });

  // FAILED payments fetch karanyasahti useEffect
  useEffect(() => {
    fetchFailedPayments();
  }, []);

  const fetchFailedPayments = () => {
    api.get(`/failed-payments/${USER_ID}`) // नवा API endpoint call kara
      .then(res => {
        // Res.data empty asel tar empty array set kara, ani jar 'FAILED' status nahiye tar filter kara
        const failedPayments = Array.isArray(res.data) ? res.data.filter(p => p.status === 'FAILED') : [];
        setPayments(failedPayments);
      })
      .catch(err => {
        console.error('Error fetching failed payments:', err);
        setPayments([]); // Error asel tar empty array set kara
        alert('Failed to fetch failed payments.');
      });
  };

  const startEdit = (payment) => {
    setEditId(payment.id);
    // 'due_date' ला 'date' च्या ऐवजी use करा, payee पण ऍड करा
    setEditData({ amount: payment.amount, due_date: payment.due_date, method: payment.method, payee: payment.payee });
  };

  const handleChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const saveUpdate = (id) => {
    // Backend API call karnyasathi logic ithe add kara
    api.put(`/payment/${id}`, { // Nava PUT endpoint call kara
        amount: parseFloat(editData.amount), // amount ला float मध्ये convert करा
        due_date: editData.due_date,
        method: editData.method,
        // Payee update karaycha asel tar include kara, nahitar remove kara
        // payee: editData.payee,
        status: 'SCHEDULED' // 'FAILED' status update झाल्यावर 'PENDING' kara
    })
      .then(res => {
        alert('Payment updated successfully!');
        setEditId(null);
        fetchFailedPayments(); // List refresh kara
      })
      .catch(err => {
        console.error('Error updating payment:', err);
        alert(err.response?.data?.error || 'Failed to update payment');
      });
  };

  return (
    <div className="reschedule-container">
      <h2>Reschedule/Update Failed Payments</h2> {/* Title update kara */}
      {payments.length === 0 ? (
        <p>No failed payments to display.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th> {/* ID column add kara */}
              <th>Payee</th> {/* Payee column add kara */}
              <th>Amount</th>
              <th>Due Date</th> {/* 'Date' ला 'Due Date' मध्ये बदला */}
              <th>Method</th>
              <th>Status</th> {/* Status column add kara */}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.id}>
                <td>{payment.id}</td>
                <td>{payment.payee}</td>
                <td>
                  {editId === payment.id ? (
                    <input
                      type="number"
                      name="amount"
                      value={editData.amount}
                      onChange={handleChange}
                    />
                  ) : (
                    `₹${payment.amount.toFixed(2)}` // amount ला दोन दशमान पर्यंत फॉरमॅट करा
                  )}
                </td>
                <td>
                  {editId === payment.id ? (
                    <input
                      type="date"
                      name="due_date" // name ला 'due_date' करा
                      value={editData.due_date}
                      onChange={handleChange}
                    />
                  ) : (
                    payment.due_date
                  )}
                </td>
                <td>
                  {editId === payment.id ? (
                    <select name="method" value={editData.method} onChange={handleChange}>
                      <option value="UPI">UPI</option>
                      <option value="Bank Transfer">Bank Transfer</option>
                      <option value="Credit Card">Credit Card</option>
                      <option value="Other">Other</option> {/* 'Other' option add kara */}
                    </select>
                  ) : (
                    payment.method
                  )}
                </td>
                <td>{payment.status}</td> {/* Status display kara */}
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
      )}
    </div>
  );
};

export default RescheduleUpdate;
