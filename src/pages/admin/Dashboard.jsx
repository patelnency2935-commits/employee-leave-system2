import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Dashboard.css";

function Dashboard() {
  const [stats, setStats] = useState({});
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/dashboard");
      setStats(res.data);
      setRecentActivity(res.data.recentActivity || []);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Admin Dashboard</h1>

      <div className="stats-grid">
        <div className="card">
          <h3>Total Employees</h3>
          <p>{stats.totalEmployees || 0}</p>
        </div>

        <div className="card">
          <h3>Pending Leaves</h3>
          <p>{stats.pendingLeaves || 0}</p>
        </div>

        <div className="card">
          <h3>Today's Absentees</h3>
          <p>{stats.todayAbsentees || 0}</p>
        </div>
      </div>

      <div className="recent-section">
        <h2>Recent Activity</h2>

        {recentActivity.length === 0 ? (
          <p className="no-data">No Recent Activity</p>
        ) : (
          <div className="activity-list">
            {recentActivity.map((item) => (
              <div key={item._id} className="activity-item">
                <span className="emp-name">{item.employee}</span>
                <span className={`status ${item.status.toLowerCase()}`}>
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;