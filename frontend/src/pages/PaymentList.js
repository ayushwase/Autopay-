import React, { useState } from 'react';
import './PaymentList.css';

const initialPayments = [
  { id: 1, recipient: 'gaurav', amount: '₹123654', date: '2025-07-03', status: 'Pending' },
  { id: 2, recipient: 'gaurav', amount: '₹123654', date: '2025-07-03', status: 'Pending' },
  { id: 3, recipient: 'gaurav', amount: '₹123654', date: '2025-07-07', status: 'Pending' },
  { id: 4, recipient: 'gaurav', amount: '₹123654', date: '2025-07-07', status: 'Pending' },
  { id: 5, recipient: 'gaurav', amount: '₹123654', date: '2025-07-07', status: 'Pending' },
];

export default function PaymentList() {
  const [payments, setPayments] = useState(initialPayments);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentEdit, setCurrentEdit] = useState(null);

  const handleEditClick = (payment) => {
    setCurrentEdit(payment);
    setEditModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentEdit((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = () => {
    const updated = payments.map((pay) =>
      pay.id === currentEdit.id ? currentEdit : pay
    );
    setPayments(updated);
    setEditModalOpen(false);
  };

  return (
    <div className="payment-container">
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
              <td>{payment.amount}</td>
              <td>{payment.date}</td>
              <td>{payment.status}</td>
              <td>
                <button
                  className="edit-btn"
                  onClick={() => handleEditClick(payment)}
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit Modal */}
      {editModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>Edit Payment</h3>
            <label>
              Recipient:
              <input
                type="text"
                name="recipient"
                value={currentEdit.recipient}
                onChange={handleChange}
              />
            </label>
            <label>
              Amount:
              <input
                type="text"
                name="amount"
                value={currentEdit.amount}
                onChange={handleChange}
              />
            </label>
            <label>
              Date:
              <input
                type="date"
                name="date"
                value={currentEdit.date}
                onChange={handleChange}
              />
            </label>
            <div className="modal-buttons">
              <button onClick={handleUpdate}>Update</button>
              <button className="cancel" onClick={() => setEditModalOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
