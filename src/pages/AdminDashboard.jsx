import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import LeaveHistory from "./admin/LeaveHistory";
import ManageEmployees from "./admin/ManageEmployees";
import AddEmployee from "./admin/AddEmployee";
import Departments from "./admin/Departments";
import LeaveTypes from "./admin/LeaveTypes";
import Holidays from "./admin/Holidays";
import AuditLogs from "./admin/AuditLogs";
import Reports from "./admin/Reports";
import "./AdminDashboard.css";

const navGroups = [
  {
    title: "Core Management",
    items: [
      { key: "dashboard",         label: "Dashboard",            icon: "📊" },
      { key: "leaveHistory",      label: "Leave Requests",       icon: "📋" },
    ]
  },
  {
    title: "Employee Center",
    items: [
      { key: "manageEmployees",   label: "Manage Employees",     icon: "👥" },
      { key: "addEmployee",       label: "Add Employee",         icon: "➕" },
    ]
  },
  {
    title: "Organization",
    items: [
      { key: "departments",       label: "Departments",          icon: "🏢" },
      { key: "leaveTypes",        label: "Leave Types",          icon: "⚖️" },
      { key: "holidays",          label: "Holiday Calendar",     icon: "📅" },
    ]
  },
  {
    title: "System & Insights",
    items: [
      { key: "reports",           label: "Reports & Analytics",  icon: "📈" },
      { key: "auditLogs",         label: "Audit Logs",           icon: "📜" },
    ]
  }
];

function StatusBadge({ status }) {
  const s = (status || "").toLowerCase();
  const label = s.charAt(0).toUpperCase() + s.slice(1);
  
  return (
    <span className={`badge badge-${s === "approved" ? "green" : s === "rejected" ? "red" : "yellow"}`}>
      {label}
    </span>
  );
}

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
    const interval = setInterval(fetchDashboardData, 30000);
    window.addEventListener("adminLeaveUpdated", fetchDashboardData);
    window.addEventListener("leaveUpdated", fetchDashboardData);
    return () => {
      clearInterval(interval);
      window.removeEventListener("adminLeaveUpdated", fetchDashboardData);
      window.removeEventListener("leaveUpdated", fetchDashboardData);
    };
  }, []);

  const fetchDashboardData = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/leaves/admin-stats");
      const holidaysRes = await axios.get("http://localhost:5000/api/holidays");
      
      const upcoming = (holidaysRes.data || []).filter(h => new Date(h.date) >= new Date()).length;

      setStats({
        totalEmployees: res.data.totalEmployees || 0,
        pendingLeaves:  res.data.pendingLeaves  || 0,
        todayAbsentees: res.data.onLeaveToday   || 0,
        upcomingHolidays: upcoming || 0,
      });

      const leavesRes = await axios.get("http://localhost:5000/api/leaves");
      const sortedLeaves = (Array.isArray(leavesRes.data) ? leavesRes.data : (leavesRes.data.leaves || []))
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 8);
      setRecentActivity(sortedLeaves);
    } catch (error) {
      console.log(error);
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
          <>
            <div className="admin-topbar">
              <div>
                <h1 className="admin-page-title">Admin Command Center</h1>
                <p className="admin-page-subtitle">Real-time overview of your workforce and leave operations</p>
              </div>
            </div>

            <div className="admin-cards">
              <div className="admin-card blue">
                <div className="admin-card-icon">👥</div>
                <div className="admin-card-value">{stats.totalEmployees}</div>
                <div className="admin-card-label">Total Workforce</div>
              </div>
              <div className="admin-card yellow">
                <div className="admin-card-icon">⏳</div>
                <div className="admin-card-value">{stats.pendingLeaves}</div>
                <div className="admin-card-label">Pending Approval</div>
              </div>
              <div className="admin-card green">
                <div className="admin-card-icon">🌈</div>
                <div className="admin-card-value">{stats.todayAbsentees}</div>
                <div className="admin-card-label">Away Today</div>
              </div>
              <div className="admin-card purple">
                <div className="admin-card-icon">📅</div>
                <div className="admin-card-value">{stats.upcomingHolidays}</div>
                <div className="admin-card-label">Public Holidays</div>
              </div>
            </div>

            <div className="admin-section">
              <h3 className="admin-section-title">🕒 Recent Activities</h3>
              {recentActivity.length === 0 ? (
                <div className="admin-empty">No recent leave requests recorded.</div>
              ) : (
                <div className="admin-table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Employee</th>
                        <th>Type</th>
                        <th>Applied On</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentActivity.map((leave, index) => (
                        <tr key={leave._id || index}>
                          <td>
                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "bold" }}>
                                {leave.employee?.name?.charAt(0) || "E"}
                              </div>
                              {leave.employee?.name || "Anonymous"}
                            </div>
                          </td>
                          <td>{leave.type}</td>
                          <td>{new Date(leave.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                          <td>
                            <StatusBadge status={leave.status} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        );

      case "leaveHistory":      return <LeaveHistory />;
      case "manageEmployees":   return <ManageEmployees />;
      case "addEmployee":       return <AddEmployee />;
      case "departments":       return <Departments />;
      case "leaveTypes":        return <LeaveTypes />;
      case "holidays":          return <Holidays />;
      case "reports":           return <Reports />;
      case "auditLogs":         return <AuditLogs />;
      default:                  return null;
    }
  };

  return (
    <div className="admin-container">
      <aside className="admin-sidebar" style={{overflowX: 'hidden'}}>
        <div className="admin-sidebar-top">
          <div className="admin-logo">
            <div className="admin-logo-icon">✨</div>
            <span className="admin-logo-text">LeaveSync <span style={{fontSize: 10, opacity: 0.5}}>Pro</span></span>
          </div>

          {navGroups.map((group) => (
            <React.Fragment key={group.title}>
              <span className="admin-nav-label" style={{marginTop: '15px'}}>{group.title}</span>
              {group.items.map(({ key, label, icon }) => (
                <button
                  key={key}
                  className={`admin-nav-item${activeSection === key ? " active" : ""}`}
                  onClick={() => setActiveSection(key)}
                  style={{marginBottom: '2px'}}
                >
                  <span className="admin-nav-icon">{icon}</span>
                  <span style={{fontSize: '13px'}}>{label}</span>
                </button>
              ))}
            </React.Fragment>
          ))}
        </div>

        <div className="admin-sidebar-bottom">
          <button className="admin-logout-btn" onClick={handleLogout}>
            <span>🚪</span>
            <span>Logout Account</span>
          </button>
        </div>
      </aside>

      <main className="admin-main">
        {renderContent()}
      </main>
    </div>
  );
}

export default AdminDashboard;