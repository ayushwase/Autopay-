// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import SchedulePayment from './pages/SchedulePayment';

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
            {/* Add more routes as needed */}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
