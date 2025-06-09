// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import SchedulePayment from './pages/SchedulePayment';
import PaymentList  from './pages/PaymentList';
import RescheduleUpdate from './pages/RescheduleUpdate';
import BulkUpload from './pages/BulkUpload';
import Reports from './pages/Reports';
import Setting from './pages/Settings';


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      <div style={{ display: 'flex' }}>
        {/* Only show Sidebar if logged in */}
        {isLoggedIn && <Sidebar />}
        <div style={{ flex: 1, padding: '20px' }}>
          <Routes>
            {/* 👇 Pass onLogin as prop to Login */}
            <Route path="/" element={<Login onLogin={() => setIsLoggedIn(true)} />} />
            <Route path="/login" element={<Login onLogin={() => setIsLoggedIn(true)} />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/schedule-payment" element={<SchedulePayment />} />
            <Route path="/payment-list" element={<PaymentList />} />
            <Route path="/reschedule-update" element={<RescheduleUpdate />} />
            <Route path="/bulk-upload" element={<BulkUpload />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Setting />} />
            
            {/* Add more routes as needed */}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
