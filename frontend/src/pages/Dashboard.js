import React, { useEffect, useState } from 'react';
import api from '../api';

function Dashboard() {
  const [userData, setUserData] = useState({});
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    // Fetch user info
    api.get('/user-info')
      .then(res => setUserData(res.data))
      .catch(err => console.error('Error fetching user info:', err));

    // Fetch balance
    api.get('/account/balance')
      .then(res => setBalance(res.data.balance))
      .catch(err => console.error('Error fetching balance:', err));
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Welcome, {userData.name || 'User'}</h2>
      <p><strong>Bank:</strong> {userData.bankName || 'N/A'}</p>
      <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
      <p><strong>Balance:</strong> ₹{balance}</p>

      <div className="mt-4">
        <button className="btn btn-primary me-2" onClick={() => window.location.href = "/auto-payment"}>
          Set Auto Payment
        </button>
        <button className="btn btn-secondary" onClick={() => window.location.href = "/transfer"}>
          Transfer Money
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
