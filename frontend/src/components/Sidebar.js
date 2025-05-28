import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css'; // optional styling

const Sidebar = () => {
  return (
    <div className="sidebar">
      <Link to="/dashboard" className="sidebar-btn">Dashboard</Link>
      <Link to="/schedule-payment" className="sidebar-btn">Schedule Payment</Link>
      <Link to="/payment-list" className="sidebar-btn">Payment List</Link>
      <Link to="/reschedule-update" className="sidebar-btn">Reschedule/Update</Link>
      <Link to="/bulk-upload" className="sidebar-btn">Bulk Upload</Link>
      <Link to="/reports" className="sidebar-btn">Reports</Link>
      <Link to="/settings" className="sidebar-btn">Settings</Link>
      <Link to="/logout" className="sidebar-btn logout-btn">Logout</Link>
    </div>
  );
};

export default Sidebar;
