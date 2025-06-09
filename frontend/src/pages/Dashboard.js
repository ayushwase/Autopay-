import React, { useEffect, useState } from 'react';
import api from '../api';
import './Dashboard.css';

const USER_ID = 1;

function Dashboard() {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState('');

  // डेट फॉरमॅट करण्यासाठी फंक्शन किंवा थेट रेंडरमध्ये वापरू शकता
  const getFormattedDate = () => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0'); // दिवस दोन अंकी करण्यासाठी (उदा. 01, 02)
    const month = String(today.getMonth() + 1).padStart(2, '0'); // महिना 0-इंडेक्स्ड असतो, म्हणून +1; दोन अंकी करण्यासाठी
    const year = today.getFullYear();
    return `${day}-${month}-${year}`; // DD-MM-YYYY फॉरमॅट
  };

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

  useEffect(() => {
    fetchUserData();
  }, []);

  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!userData) return <div>Loading...</div>;

  return (
    <div className="dashboard-container">
      {userData.failed_payments_count > 0 && (
        <div className="alert alert-danger">
          <strong>Alert:</strong> You have {userData.failed_payments_count} failed payment(s). Please check your Payment List.
        </div>
      )}

      <div className="header-section">
        <h2 className="greeting">Welcome, {userData.name}</h2>
        {/* इथे डेट फॉरमॅट बदलला आहे */}
        <p className="date">📅 {getFormattedDate()}</p>
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
          ⚙️ Simulate Due Payment Processing
        </button>
      </div>
    </div>
  );
}

export default Dashboard;