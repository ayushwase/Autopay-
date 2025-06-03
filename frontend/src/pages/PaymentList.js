import React, { useEffect, useState } from 'react';
import api from '../api';

function PaymentList() {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    api.get('/payments')
      .then(res => setPayments(res.data))
      .catch(err => console.error('Error fetching payments:', err));
  }, []);

  const handleCancel = (id) => {
    // Call API to cancel payment (only if it's scheduled)
    api.post(`/payments/${id}/cancel`)
      .then(() => {
        // Refresh list after cancel
        setPayments(prev =>
          prev.map(p =>
            p.id === id ? { ...p, status: 'Cancelled' } : p
          )
        );
      })
      .catch(err => console.error('Error cancelling payment:', err));
  };

  return (
    <div className="container mt-4">
      <h2>Payment List</h2>
      <table className="table table-bordered mt-3">
        <thead className="table-light">
          <tr>
            <th>ID</th>
            <th>Recipient</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {payments.map(payment => (
            <tr key={payment.id}>
              <td>{payment.id}</td>
              <td>{payment.payee}</td>
              <td>₹{payment.amount}</td>
              <td>{payment.due_date}</td>
              <td>{payment.status}</td>
              <td>
                <button
                  className="btn btn-danger btn-sm me-2"
                  onClick={() => handleCancel(payment.id)}
                  disabled={payment.status !== 'Scheduled'}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-success btn-sm"
                  onClick={() => window.location.href = `/edit-payment/${payment.id}`}
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PaymentList;
