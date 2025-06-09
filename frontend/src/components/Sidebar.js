// frontend/src/components/Sidebar.js
import React from 'react';
import { NavLink } from 'react-router-dom'; // <--- Link ऐवजी NavLink इम्पोर्ट करा
import './Sidebar.css';

const Sidebar = () => {
  return (
    <div className="sidebar">
      {/* प्रत्येक NavLink साठी className ऍड करा */}
      <NavLink
        to="/dashboard"
        className={({ isActive }) => (isActive ? "sidebar-btn active-sidebar-btn" : "sidebar-btn")}
      >
        Dashboard
      </NavLink>
      <NavLink
        to="/schedule-payment"
        className={({ isActive }) => (isActive ? "sidebar-btn active-sidebar-btn" : "sidebar-btn")}
      >
        Schedule Payment
      </NavLink>
      <NavLink
        to="/payment-list"
        className={({ isActive }) => (isActive ? "sidebar-btn active-sidebar-btn" : "sidebar-btn")}
      >
        Payment List
      </NavLink>
      <NavLink
        to="/reschedule-update"
        className={({ isActive }) => (isActive ? "sidebar-btn active-sidebar-btn" : "sidebar-btn")}
      >
        Reschedule/Update
      </NavLink>
      <NavLink
        to="/bulk-upload"
        className={({ isActive }) => (isActive ? "sidebar-btn active-sidebar-btn" : "sidebar-btn")}
      >
        Bulk Upload
      </NavLink>
      <NavLink
        to="/reports"
        className={({ isActive }) => (isActive ? "sidebar-btn active-sidebar-btn" : "sidebar-btn")}
      >
        Reports
      </NavLink>
      <NavLink
        to="/settings"
        className={({ isActive }) => (isActive ? "sidebar-btn active-sidebar-btn" : "sidebar-btn")}
      >
        Settings
      </NavLink>
      {/* Logout साठी active-sidebar-btn ची गरज नाही, कारण ते पेज नाही */}
      <NavLink
        to="/logout"
        className="sidebar-btn logout-btn"
      >
        Logout
      </NavLink>
    </div>
  );
};

export default Sidebar;