import React, { useState } from 'react';
import './PaymentList.css';

const initialPayments = [
  {
    id: 1,
    recipient: 'John Doe',
    amount: 500,
    date: '2025-06-01',
    status: 'Scheduled',
  },
  {
    id: 2,
    recipient: 'Jane Smith',
    amount: 1000,
    date: '2025-05-20',
    status: 'Completed',
  },
  {
    id: 3,
    recipient: 'ABC Corp',
    amount: 750,
    date: '2025-05-10',
    status: 'Failed',
  },
];

const PaymentList = () => {
  const [payments, setPayments] = useState(initialPayments);

  const cancelPayment = (id) => {
    const updated = payments.map((payment) =>
      payment.id === id ? { ...payment, status: 'Cancelled' } : payment
    );
    setPayments(updated);
  };

  return (
    <div className="payment-list-container">
      <h2>Payment List</h2>
      <table>
        <thead>
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
          {payments.map((payment) => (
            <tr key={payment.id}>
              <td>{payment.id}</td>
              <td>{payment.recipient}</td>
              <td>${payment.amount}</td>
              <td>{payment.date}</td>
              <td>{payment.status}</td>
              <td>
                <button
                  onClick={() => cancelPayment(payment.id)}
                  disabled={payment.status !== 'Scheduled'}
                  className="cancel-btn"
                >
                  Cancel
                </button>
                <button className="edit-btn">Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PaymentList;
