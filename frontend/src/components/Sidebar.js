import React from 'react';
// Link ऐवजी NavLink इंपोर्ट करा
import { NavLink } from 'react-router-dom';
import './Sidebar.css'; // optional styling

const Sidebar = () => {
  return (
    <div className="sidebar">
      {/* प्रत्येक Link ला NavLink मध्ये बदला आणि end prop ऍड करा */}
      <NavLink to="/dashboard" className="sidebar-btn" activeClassName="active" end>Dashboard</NavLink>
      <NavLink to="/schedule-payment" className="sidebar-btn" activeClassName="active" end>Schedule Payment</NavLink>
      <NavLink to="/payment-list" className="sidebar-btn" activeClassName="active" end>Payment List</NavLink>
      <NavLink to="/reschedule-update" className="sidebar-btn" activeClassName="active" end>Reschedule/Update</NavLink>
      <NavLink to="/bulk-upload" className="sidebar-btn" activeClassName="active" end>Bulk Upload</NavLink>
      <NavLink to="/reports" className="sidebar-btn" activeClassName="active" end>Reports</NavLink>
      <NavLink to="/settings" className="sidebar-btn" activeClassName="active" end>Settings</NavLink>
      {/* Logout बटणासाठी वेगळा क्लास असेल तर तो तसाच राहू द्या */}
      <NavLink to="/logout" className="sidebar-btn logout-btn" activeClassName="active" end>Logout</NavLink>
    </div>
  );
};

export default Sidebar;