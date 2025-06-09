// frontend/src/pages/PaymentList.js
import React, { useState, useEffect } from 'react';
import api from '../api'; // API इम्पोर्ट करा
import './PaymentList.css';

const PaymentList = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const userId = 1; // तुमच्या demo_user ची ID, जी backend मध्ये 1 आहे
      const response = await api.get(`/payments/${userId}`);
      setPayments(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching payments:", err);
      setError("Failed to fetch payments. Please try again later.");
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const cancelPayment = async (id) => {
    try {
      const res = await api.post(`/payment/${id}/cancel`);
      alert(res.data.message);
      fetchPayments(); // पेमेंट कॅन्सल झाल्यावर लिस्ट रिफ्रेश करा
    } catch (err) {
      console.error("Error cancelling payment:", err.response ? err.response.data : err);
      alert(`Failed to cancel payment: ${err.response?.data?.error || err.message || 'Unknown error'}`);
    }
  };

  if (loading) {
    return <div className="payment-list-container">Loading payments...</div>;
  }

  if (error) {
    return <div className="payment-list-container" style={{ color: 'red' }}>Error: {error}</div>;
  }

  return (
    <div className="payment-list-container">
      <h2>Payment List</h2>
      {payments.length === 0 ? (
        <p>No payments scheduled yet.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Payee</th>
              <th>Amount</th>
              <th>Due Date</th>
              <th>Method</th>
              <th>Status</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.id}>
                <td>{payment.id}</td>
                <td>{payment.payee}</td>
                <td>₹{payment.amount}</td>
                <td>{payment.due_date}</td>
                <td>{payment.method}</td>
                <td>{payment.status}</td>
                <td>{payment.created_at}</td>
                <td>
                  <button
                    onClick={() => cancelPayment(payment.id)}
                    // 'PAID', 'FAILED' किंवा 'CANCELLED' असल्यास बटन डिसेबल करा.
                    // याचा अर्थ 'SCHEDULED' आणि 'PENDING' स्टेटससाठी ते सक्षम (enabled) असेल.
                    disabled={['PAID', 'FAILED', 'CANCELLED'].includes(payment.status)}
                    className="cancel-btn"
                  >
                    Cancel
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PaymentList;