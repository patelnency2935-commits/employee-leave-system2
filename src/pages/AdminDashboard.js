import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AdminDashboard() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("dashboard");

  const [stats, setStats] = useState({
    totalEmployees: 0,
    pendingLeaves: 0,
    todayAbsentees: 0,
  });

  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/dashboard");

      setStats({
        totalEmployees: res.data.totalEmployees,
        pendingLeaves: res.data.pendingLeaves,
        todayAbsentees: res.data.todayAbsentees,
      });

      setRecentActivity(res.data.recentActivity);
    } catch (error) {
      console.error("Error fetching dashboard data", error);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/admin-login");
  };

  const renderContent = () => {
    if (activeSection === "dashboard") {
      return (
        <div>
          <h2 style={styles.sectionTitle}>📊 Overview</h2>

          <div style={styles.cardContainer}>
            <div style={styles.card}>
              <h4>Total Employees</h4>
              <p style={styles.cardNumber}>{stats.totalEmployees}</p>
            </div>

            <div style={styles.card}>
              <h4>Pending Leaves</h4>
              <p style={styles.cardNumber}>{stats.pendingLeaves}</p>
            </div>

            <div style={styles.card}>
              <h4>On Leave Today</h4>
              <p style={styles.cardNumber}>{stats.todayAbsentees}</p>
            </div>
          </div>

          <h3 style={styles.tableTitle}>Recent Leave Activity</h3>

          {recentActivity.length === 0 ? (
            <p>No recent activity</p>
          ) : (
            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Leave Type</th>
                    <th style={styles.th}>From</th>
                    <th style={styles.th}>To</th>
                    <th style={styles.th}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentActivity.map((leave, index) => (
                    <tr key={index}>
                      <td style={styles.td}>{leave.type}</td>

                      <td style={styles.td}>
                        {leave.from
                          ? new Date(leave.from).toLocaleDateString()
                          : "N/A"}
                      </td>

                      <td style={styles.td}>
                        {leave.to
                          ? new Date(leave.to).toLocaleDateString()
                          : "N/A"}
                      </td>

                      <td style={styles.td}>
                        <span
                          style={{
                            ...styles.statusBadge,
                            backgroundColor:
                              leave.status === "Approved"
                                ? "#16a34a"
                                : leave.status === "Rejected"
                                ? "#dc2626"
                                : "#f59e0b",
                          }}
                        >
                          {leave.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      );
    }

    if (activeSection === "leaveHistory") {
      return <h2 style={styles.sectionTitle}>📜 Leave History Page</h2>;
    }

    if (activeSection === "departments") {
      return <h2 style={styles.sectionTitle}>🏢 Department Management</h2>;
    }

    if (activeSection === "leaveBalance") {
      return <h2 style={styles.sectionTitle}>📅 Leave Balance Tracking</h2>;
    }

    if (activeSection === "calendar") {
      return <h2 style={styles.sectionTitle}>🗓 Calendar View</h2>;
    }

    if (activeSection === "notifications") {
      return <h2 style={styles.sectionTitle}>📧 Email Notifications</h2>;
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.sidebar}>
        <h2 style={styles.logo}>Admin Panel</h2>

        <ul style={styles.menu}>
          <li style={styles.menuItem} onClick={() => setActiveSection("dashboard")}>
            Dashboard
          </li>
          <li style={styles.menuItem} onClick={() => setActiveSection("leaveHistory")}>
            Leave History
          </li>
          <li style={styles.menuItem} onClick={() => setActiveSection("departments")}>
            Departments
          </li>
          <li style={styles.menuItem} onClick={() => setActiveSection("leaveBalance")}>
            Leave Balance
          </li>
          <li style={styles.menuItem} onClick={() => setActiveSection("calendar")}>
            Calendar View
          </li>
          <li style={styles.menuItem} onClick={() => setActiveSection("notifications")}>
            Email Notifications
          </li>
        </ul>

        <button style={styles.logout} onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div style={styles.content}>
        <h1 style={styles.mainHeading}>Admin Dashboard</h1>
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
    backgroundColor: "#f3f4f6",
  },
  sidebar: {
    width: "260px",
    background: "linear-gradient(180deg, #1e293b, #0f172a)",
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
    borderRadius: "8px",
    cursor: "pointer",
    backgroundColor: "#2563eb",
    textAlign: "center",
    fontWeight: "500",
  },
  logout: {
    backgroundColor: "#ef4444",
    border: "none",
    padding: "12px",
    borderRadius: "8px",
    color: "white",
    cursor: "pointer",
    fontWeight: "bold",
  },
  content: {
    flex: 1,
    padding: "40px",
    overflowY: "auto",
  },
  mainHeading: {
    marginBottom: "20px",
  },
  sectionTitle: {
    marginBottom: "20px",
  },
  cardContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
    gap: "20px",
    marginTop: "20px",
  },
  card: {
    backgroundColor: "white",
    padding: "25px",
    borderRadius: "12px",
    boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
    textAlign: "center",
  },
  cardNumber: {
    fontSize: "24px",
    fontWeight: "bold",
    marginTop: "10px",
    color: "#1e293b",
  },
  tableTitle: {
    marginTop: "40px",
    marginBottom: "15px",
  },
  tableWrapper: {
    backgroundColor: "white",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    overflow: "hidden",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    backgroundColor: "#1f2937",
    color: "white",
    padding: "12px",
    textAlign: "left",
  },
  td: {
    padding: "12px",
    borderBottom: "1px solid #eee",
  },
  statusBadge: {
    padding: "5px 12px",
    borderRadius: "20px",
    color: "white",
    fontSize: "12px",
    fontWeight: "bold",
  },
};

export default AdminDashboard;