import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AdminDashboard() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalEmployees: 0,
    pendingLeaves: 0,
    todayAbsentees: 0,
    upcomingHolidays: 0,
  });

  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // ✅ UPDATED API ROUTE
  const fetchDashboardData = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/leaves/admin-stats"
      );

      setStats({
        totalEmployees: res.data.totalEmployees || 0,
        pendingLeaves: res.data.pendingLeaves || 0,
        todayAbsentees: res.data.onLeaveToday || 0,
        upcomingHolidays: 0,
      });

      // Optional: fetch recent leaves
      const leavesRes = await axios.get(
        "http://localhost:5000/api/leaves"
      );

      const sortedLeaves = leavesRes.data
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

      setRecentActivity(sortedLeaves);

    } catch (error) {
      console.error("Error fetching dashboard data", error);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/admin-login");
  };

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <div>
            <h2>📊 Overview</h2>

            <div style={styles.cardContainer}>
              <div style={styles.card}>
                <h3>Total Employees</h3>
                <p>{stats.totalEmployees}</p>
              </div>

              <div style={styles.card}>
                <h3>Pending Requests</h3>
                <p>{stats.pendingLeaves}</p>
              </div>

              <div style={styles.card}>
                <h3>On Leave Today</h3>
                <p>{stats.todayAbsentees}</p>
              </div>

              <div style={styles.card}>
                <h3>Upcoming Holidays</h3>
                <p>{stats.upcomingHolidays}</p>
              </div>
            </div>

            <h3 style={{ marginTop: "30px" }}>
              Recent Leave Activity
            </h3>

            {recentActivity.length === 0 ? (
              <p>No recent activity</p>
            ) : (
              <ul>
                {recentActivity.map((leave, index) => (
                  <li key={index}>
                    {leave.employee} — {leave.type} — {leave.status}
                  </li>
                ))}
              </ul>
            )}
          </div>
        );

      case "manageEmployees":
        return (
          <div>
            <h2>👩‍💼 Employee Management</h2>
            <ul>
              <li>Add Employee</li>
              <li>Edit Employee</li>
              <li>Delete Employee</li>
              <li>Activate / Deactivate</li>
            </ul>
          </div>
        );

      case "leaveRequests":
        return (
          <div>
            <h2>📩 Leave Applications</h2>
            <ul>
              <li>All Requests</li>
              <li>Pending</li>
              <li>Approved</li>
              <li>Rejected</li>
            </ul>
          </div>
        );

      case "approveReject":
        return (
          <div>
            <h2>✔️ Approval Panel</h2>
          </div>
        );

      case "employeeDirectory":
        return (
          <div>
            <h2>📋 Employee Directory</h2>
          </div>
        );

      case "leaveTypes":
        return (
          <div>
            <h2>📝 Leave Types</h2>
          </div>
        );

      case "holidays":
        return (
          <div>
            <h2>📅 Company Holidays</h2>
          </div>
        );

      case "reports":
        return (
          <div>
            <h2>📊 Reports</h2>
          </div>
        );

      case "settings":
        return (
          <div>
            <h2>⚙️ Settings</h2>
          </div>
        );

      default:
        return <h2>Welcome</h2>;
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.sidebar}>
        <h2 style={styles.logo}>Admin Panel</h2>

        <ul style={styles.menu}>
          {[
            { key: "dashboard", label: "Dashboard" },
            { key: "manageEmployees", label: "Manage Employees" },
            { key: "leaveRequests", label: "Leave Requests" },
            { key: "approveReject", label: "Approve / Reject" },
            { key: "employeeDirectory", label: "Employee Directory" },
            { key: "leaveTypes", label: "Leave Types" },
            { key: "holidays", label: "Holidays" },
            { key: "reports", label: "Reports" },
            { key: "settings", label: "Settings" },
          ].map((item) => (
            <li
              key={item.key}
              onClick={() => setActiveSection(item.key)}
              style={{
                ...styles.menuItem,
                backgroundColor:
                  activeSection === item.key ? "#2563eb" : "transparent",
              }}
            >
              {item.label}
            </li>
          ))}
        </ul>

        <button style={styles.logout} onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div style={styles.content}>
        <h1>Admin Dashboard</h1>
        {renderContent()}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    height: "100vh",
    fontFamily: "Segoe UI, sans-serif",
    backgroundColor: "#f4f6f9",
  },
  sidebar: {
    width: "260px",
    backgroundColor: "#1f2937",
    color: "white",
    display: "flex",
    flexDirection: "column",
    padding: "25px 15px",
  },
  logo: {
    marginBottom: "30px",
    textAlign: "center",
  },
  menu: {
    listStyle: "none",
    padding: 0,
    flex: 1,
  },
  menuItem: {
    padding: "12px",
    marginBottom: "8px",
    borderRadius: "6px",
    cursor: "pointer",
  },
  logout: {
    backgroundColor: "#ef4444",
    border: "none",
    padding: "10px",
    borderRadius: "6px",
    color: "white",
    cursor: "pointer",
  },
  content: {
    flex: 1,
    padding: "40px",
  },
  cardContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: "20px",
    marginTop: "20px",
  },
  card: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
};

export default AdminDashboard;