import React, { useEffect, useState } from 'react';
import api from '../api';
import './Dashboard.css';

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

  const handleProcessPayments = () => {
    alert("Simulating daily automatic payment processing...");
    api.post('/process-due-payments')
      .then(res => {
        alert(`Processing Complete!\nPaid: ${res.data.processed}\nFailed: ${res.data.failed}`);
        fetchUserData();
      })
      .catch(err => {
        console.error('Error processing payments:', err);
        alert('Could not process payments.');
      });
  };

  const formatDate = (date) => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

  useEffect(() => {
    fetchUserData();
  }, []);

  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!userData) return <div>Loading...</div>;

  return (
    <div className="dashboard-container">
      {/* Failed Payments Alert Section */}
      {/* {userData.failed_payments_count > 0 && (
        <div className="alert alert-danger">
          <strong>Alert:</strong> You have {userData.failed_payments_count} failed payment(s). Please check your Payment List.
        </div>
      )} */}


      <div className="header-section">
        <h2 className="greeting">Welcome, {userData.name}</h2>
        <p className="date">📅 {formatDate(new Date())}</p>
      </div>

      <div className="kpi-container">
        <div className="kpi-box scheduled">
          <h5>Bank</h5>
          <p>{userData.bankName || 'N/A'}</p>
        </div>
        <div className="kpi-box completed">
          <h5>Current Balance</h5>
          <p>₹{userData.balance.toFixed(2)}</p>
        </div>
        <div className="kpi-box failed">
          <h5>Failed Payments</h5>
          <p>{userData.failed_payments_count}</p>
        </div>
      </div>

      <div className="actions">
        <button className="btn-process" onClick={handleProcessPayments}>
          Simulate Due Payment Processing
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
