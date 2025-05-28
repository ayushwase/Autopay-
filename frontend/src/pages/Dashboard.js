// src/components/Dashboard.js
import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import './Dashboard.css';

const data = [
  {
    name: 'Jan', Scheduled: 30, Completed: 20, Failed: 5
  },
  {
    name: 'Feb', Scheduled: 40, Completed: 30, Failed: 8
  },
  {
    name: 'Mar', Scheduled: 50, Completed: 40, Failed: 3
  },
  {
    name: 'Apr', Scheduled: 45, Completed: 42, Failed: 2
  },
];

const Dashboard = () => {
  const totalScheduled = data.reduce((acc, cur) => acc + cur.Scheduled, 0);
  const totalCompleted = data.reduce((acc, cur) => acc + cur.Completed, 0);
  const totalFailed = data.reduce((acc, cur) => acc + cur.Failed, 0);

  return (
    <div className="dashboard-container">
      <h2>Dashboard Overview</h2>
      <div className="kpi-container">
        <div className="kpi-box scheduled">
          <h3>Scheduled</h3>
          <p>{totalScheduled}</p>
        </div>
        <div className="kpi-box completed">
          <h3>Completed</h3>
          <p>{totalCompleted}</p>
        </div>
        <div className="kpi-box failed">
          <h3>Failed</h3>
          <p>{totalFailed}</p>
        </div>
      </div>

      <div className="chart-container">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Scheduled" fill="#8884d8" />
            <Bar dataKey="Completed" fill="#82ca9d" />
            <Bar dataKey="Failed" fill="#ff6f61" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;
