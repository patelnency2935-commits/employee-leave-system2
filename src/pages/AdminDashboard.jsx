import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AdminDashboard() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalEmployees: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    onLeaveToday: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/dashboard/stats"
      );
      setStats(res.data);
    } catch (error) {
      console.error("Error fetching dashboard stats", error);
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
                Total Employees: {stats.totalEmployees}
              </div>
              <div style={styles.card}>
                Pending Requests: {stats.pending}
              </div>
              <div style={styles.card}>
                Approved: {stats.approved}
              </div>
              <div style={styles.card}>
                Rejected: {stats.rejected}
              </div>
              <div style={styles.card}>
                On Leave Today: {stats.onLeaveToday}
              </div>
              <div style={styles.card}>Leave Balance Summary</div>
            </div>
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
              <li>Filter by Date / Department</li>
            </ul>
          </div>
        );

      case "approveReject":
        return (
          <div>
            <h2>✔️ Approval Panel</h2>
            <ul>
              <li>View Request Details</li>
              <li>Approve</li>
              <li>Reject with Reason</li>
            </ul>
          </div>
        );

      case "employeeDirectory":
        return (
          <div>
            <h2>📋 Employee Directory</h2>
            <ul>
              <li>Search Employee</li>
              <li>Filter by Department</li>
              <li>View Profile</li>
            </ul>
          </div>
        );

      case "leaveTypes":
        return (
          <div>
            <h2>📝 Leave Types</h2>
            <ul>
              <li>Add Leave Type</li>
              <li>Edit Leave Days</li>
              <li>Delete Leave Type</li>
            </ul>
          </div>
        );

      case "holidays":
        return (
          <div>
            <h2>📅 Company Holidays</h2>
            <ul>
              <li>Add Holiday</li>
              <li>Edit Holiday</li>
              <li>Delete Holiday</li>
            </ul>
          </div>
        );

      case "reports":
        return (
          <div>
            <h2>📊 Reports</h2>
            <ul>
              <li>Monthly Leave Report</li>
              <li>Department-wise Report</li>
              <li>Export CSV / PDF</li>
            </ul>
          </div>
        );

      case "settings":
        return (
          <div>
            <h2>⚙️ Settings</h2>
            <ul>
              <li>Change Password</li>
              <li>Update Profile</li>
              <li>System Settings</li>
            </ul>
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
    color: "white",
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