import React from "react";
import "./Dashboard.css";
import { FaMoneyCheckAlt, FaCalendarAlt, FaWallet } from "react-icons/fa";

const Dashboard = () => {
  const today = new Date().toLocaleDateString();

  return (
    <div className="dashboard-no-sidebar">
      <header className="topbar">
        <h1>Welcome, User</h1>
        <p>{today}</p>
      </header>

      <section className="cards">
        <div className="card">
          <h3><FaWallet /> Balance</h3>
          <p>₹0</p>
        </div>
        <div className="card">
          <h3><FaCalendarAlt /> Auto Payment</h3>
          <p>No Active Plans</p>
        </div>
        <div className="card full-width">
          <h3><FaMoneyCheckAlt /> Transfers</h3>
          <p>0 Scheduled</p>
        </div>
      </section>

      <section className="actions">
        <button className="btn primary">Set Auto Payment</button>
        <button className="btn secondary">Transfer Money</button>
      </section>
    </div>
  );
};

export default Dashboard;
