import { useEffect, useState } from "react";
import React from "react";
import ApplyLeave from "./ApplyLeave";
import MyLeaveHistory from "./MyLeaveHistory";
import ApproveReject from "./ApproveReject";
import EmployeeDirectory from "./EmployeeDirectory";
import LeaveTypes from "./LeaveTypes";
import Holidays from "./Holidays";
import Profile from "./Profile";
import "./EmployeeDashboard.css";

const navItems = [
  { key: "dashboard",    label: "Dashboard",         icon: "📊" },
  { key: "applyLeave",   label: "Apply Leave",        icon: "✍️"  },
  { key: "history",      label: "My Leave History",   icon: "📋" },
  { key: "approveReject",label: "Approve / Reject",   icon: "✅" },
  { key: "directory",    label: "Employee Directory", icon: "👥" },
  { key: "leaveTypes",   label: "Leave Types",        icon: "🗂️"  },
  { key: "holidays",     label: "Holidays",           icon: "🏖️"  },
];

function StatusBadge({ status }) {
  const map = {
    Approved: "badge badge-green",
    Pending:  "badge badge-yellow",
    Rejected: "badge badge-red",
  };
  return <span className={map[status] || "badge badge-blue"}>{status}</span>;
}

export default function EmployeeDashboard() {
  const [activePage, setActivePage] = useState("dashboard");
  const [pending, setPending]       = useState(0);
  const [approved, setApproved]     = useState(0);
  const [rejected, setRejected]     = useState(0);
  const [totalLeaves, setTotalLeaves] = useState(0);
  const [recentLeaves, setRecentLeaves] = useState([]);

  const formatDate = (date) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("en-GB");
  };

  const fetchDashboardData = async () => {
    try {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) return;
      
      let user = JSON.parse(storedUser);
      let employeeId = user._id;
      
      // Auto-fix stale Date.now() fake IDs
      if (employeeId && !/^[a-f\d]{24}$/i.test(employeeId)) {
        try {
          const emailToUse = user.email || `employee_${Date.now()}@company.com`;
          const nameToUse  = user.name || "Employee";
          const res = await fetch("http://localhost:5000/api/employees/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: emailToUse, name: nameToUse }),
          });
          const data = await res.json();
          if (res.ok && data.employee) {
            user = data.employee;
            employeeId = user._id;
            localStorage.setItem("user", JSON.stringify(user));
          }
        } catch (e) {
          console.error("Auto-fix ID error:", e);
        }
      }

      const statsRes = await fetch(`http://localhost:5000/api/leaves/employee-stats/${employeeId}`);
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setPending(statsData.pendingLeaves || 0);
        setApproved(statsData.approvedLeaves || 0);
        setRejected(statsData.rejectedLeaves || 0);
        setTotalLeaves(statsData.totalLeaves || 0);
      }

      const leavesRes = await fetch(`http://localhost:5000/api/leaves/employee/${employeeId}`);
      if (leavesRes.ok) {
        const leavesData = await leavesRes.json();
        const lastThree = [...leavesData]
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 3);
        setRecentLeaves(lastThree);
      }
    } catch (err) {
      console.error("Dashboard Error:", err);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, []);

  useEffect(() => { if (activePage === "dashboard") fetchDashboardData(); }, [activePage]);

  // Auto-refresh whenever a leave is applied or modified from any sub-page or admin
  useEffect(() => {
    const handler = () => {
      fetchDashboardData();
      setActivePage("dashboard");
    };
    const updateHandler = () => fetchDashboardData();
    
    window.addEventListener("leaveUpdated", handler);
    window.addEventListener("adminLeaveUpdated", updateHandler);
    
    return () => {
      window.removeEventListener("leaveUpdated", handler);
      window.removeEventListener("adminLeaveUpdated", updateHandler);
    };
  }, []);

  return (
    <div className="emp-container">
      {/* ===== SIDEBAR ===== */}
      <aside className="emp-sidebar">
        <div className="emp-sidebar-top">
          <div className="emp-logo">
            <div className="emp-logo-icon">📋</div>
            <span className="emp-logo-text">LeaveSync</span>
          </div>

          <span className="admin-nav-label">Main Menu</span>
          {navItems.map(({ key, label, icon }) => (
            <div
              key={key}
              className={`emp-nav-item${activePage === key ? " active" : ""}`}
              onClick={() => setActivePage(key)}
            >
              <span className="emp-nav-icon">{icon}</span>
              {label}
            </div>
          ))}
        </div>

        <div className="emp-sidebar-bottom">
          <div
            className={`emp-profile-btn${activePage === "profile" ? " active" : ""}`}
            onClick={() => setActivePage("profile")}
          >
            <span className="emp-nav-icon">👤</span>
            Profile
          </div>
        </div>
      </aside>

      {/* ===== MAIN ===== */}
      <main className="emp-main">
        {activePage === "dashboard" && (
          <>
            <div className="emp-topbar">
              <div>
                <h1 className="emp-page-title">Dashboard Overview</h1>
                <p className="emp-page-subtitle">Welcome back! Here's your leave summary.</p>
              </div>
              <button className="emp-request-btn" onClick={() => setActivePage("applyLeave")}>
                ✍️ Request Leave
              </button>
            </div>

            {/* Stat Cards */}
            <div className="emp-cards">
              <div className="emp-card blue">
                <div className="emp-card-icon">📁</div>
                <div className="emp-card-value">{totalLeaves}</div>
                <div className="emp-card-label">Total Leaves</div>
              </div>
              <div className="emp-card green">
                <div className="emp-card-icon">✅</div>
                <div className="emp-card-value">{approved}</div>
                <div className="emp-card-label">Approved</div>
              </div>
              <div className="emp-card yellow">
                <div className="emp-card-icon">⏳</div>
                <div className="emp-card-value">{pending}</div>
                <div className="emp-card-label">Pending</div>
              </div>
              <div className="emp-card red">
                <div className="emp-card-icon">❌</div>
                <div className="emp-card-value">{rejected}</div>
                <div className="emp-card-label">Rejected</div>
              </div>
            </div>

            {/* Recent Leaves Table */}
            <div className="emp-table-section">
              <div className="emp-section-header">
                <span className="emp-section-title">Recent Leave Requests</span>
              </div>

              {recentLeaves.length === 0 ? (
                <div className="emp-empty">
                  <div className="emp-empty-icon">📭</div>
                  No recent leave requests found
                </div>
              ) : (
                <table className="emp-table">
                  <thead>
                    <tr>
                      <th>Date Applied</th>
                      <th>Leave Type</th>
                      <th>Status</th>
                      <th>Manager Comment</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentLeaves.map((leave) => (
                      <tr key={leave._id}>
                        <td>{formatDate(leave.createdAt)}</td>
                        <td>{leave.type}</td>
                        <td><StatusBadge status={leave.status} /></td>
                        <td>{leave.managerComment || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}

        {activePage === "applyLeave"    && <ApplyLeave />}
        {activePage === "history"       && <MyLeaveHistory />}
        {activePage === "approveReject" && <ApproveReject />}
        {activePage === "directory"     && <EmployeeDirectory />}
        {activePage === "leaveTypes"    && <LeaveTypes />}
        {activePage === "holidays"      && <Holidays />}
        {activePage === "profile"       && <Profile />}
      </main>
    </div>
  );
}