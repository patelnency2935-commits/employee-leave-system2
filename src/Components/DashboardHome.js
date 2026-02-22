import React, { useEffect, useState } from "react";
import "../pages/AdminDashboard.css";

function DashboardHome() {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalLeaves: 0,
    pendingLeaves: 0,
    approvedLeaves: 0,
  });

  useEffect(() => {
    const employees = JSON.parse(localStorage.getItem("employees")) || [];
    const leaves = JSON.parse(localStorage.getItem("leaves")) || [];

    const pending = leaves.filter((leave) => leave.status === "Pending");
    const approved = leaves.filter((leave) => leave.status === "Approved");

    setStats({
      totalEmployees: employees.length,
      totalLeaves: leaves.length,
      pendingLeaves: pending.length,
      approvedLeaves: approved.length,
    });
  }, []);

  return (
    <div className="dashboard-home">
      <h2>Dashboard Overview</h2>

      <div className="stats-container">
        <div className="stat-card">
          <h3>Total Employees</h3>
          <p>{stats.totalEmployees}</p>
        </div>

        <div className="stat-card">
          <h3>Total Leave Requests</h3>
          <p>{stats.totalLeaves}</p>
        </div>

        <div className="stat-card">
          <h3>Pending Requests</h3>
          <p>{stats.pendingLeaves}</p>
        </div>

        <div className="stat-card">
          <h3>Approved Requests</h3>
          <p>{stats.approvedLeaves}</p>
        </div>
      </div>
    </div>
  );
}

export default DashboardHome;