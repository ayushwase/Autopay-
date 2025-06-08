// File: frontend/src/pages/Dashboard.js
// Ismein user ka data fetch karne ka logic update kiya gaya hai aur failed payment ka alert add kiya hai.

import React, { useEffect, useState } from 'react';
import api from '../api';

// Demo ke liye, hum user ID 1 use kar rahe hain.
const USER_ID = 1;

function Dashboard() {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState('');

  const fetchUserData = () => {
    api.get(`/user/${USER_ID}`)
      .then(res => setUserData(res.data))
      .catch(err => {
        console.error('Error fetching user info:', err);
        setError('Could not fetch user data.');
      });
  };

  // Is function ko call karke hum manual payment processing trigger kar sakte hain.
  const handleProcessPayments = () => {
    alert("Simulating daily automatic payment processing...");
    api.post('/process-due-payments')
      .then(res => {
        alert(`Processing Complete! \nPaid: ${res.data.processed}\nFailed: ${res.data.failed}`);
        // Refresh user data to show updated balance
        fetchUserData();
      })
      .catch(err => {
        console.error('Error processing payments:', err);
        alert('Could not process payments.');
      });
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!userData) return <div>Loading...</div>;

  return (
    <div className="container mt-4">
      {userData.failed_payments_count > 0 && (
        <div className="alert alert-danger">
          <strong>Alert:</strong> You have {userData.failed_payments_count} failed payment(s). Please check your Payment List.
        </div>
      )}

      <h2 className="mb-3">Welcome, {userData.name}</h2>
      <p><strong>Bank:</strong> {userData.bankName || 'N/A'}</p>
      <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
      <p><strong>Balance:</strong> ₹{userData.balance.toFixed(2)}</p>

      <div className="mt-4">
        {/* Maine yahan ek naya button add kiya hai, taki aap automatic payment ko manually test kar sakein */}
        <button className="btn btn-info me-2" onClick={handleProcessPayments}>
          Process Due Payments (Simulate)
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
