import { useEffect, useState } from "react";
import React from "react";
import ApplyLeave from "./ApplyLeave";
import MyLeaveHistory from "./MyLeaveHistory";
import ApproveReject from "./ApproveReject";
import EmployeeDirectory from "./EmployeeDirectory";
import LeaveTypes from "./LeaveTypes";
import Holidays from "./Holidays";
import Profile from "./Profile";

export default function EmployeeDashboard() {
  const [activePage, setActivePage] = useState("dashboard");

  const [pending, setPending] = useState(0);
  const [approved, setApproved] = useState(0);
  const [rejected, setRejected] = useState(0);
  const [totalLeaves, setTotalLeaves] = useState(0);
  const [recentLeaves, setRecentLeaves] = useState([]);

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("en-GB");
  };

  // ===============================
  // FETCH DASHBOARD DATA
  // ===============================
  const fetchDashboardData = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const employeeId = user?._id;

      if (!employeeId) return;

      // ✅ Fetch employee stats
      const statsRes = await fetch(
        `http://localhost:5000/api/leaves/employee-stats/${employeeId}`
      );
      const statsData = await statsRes.json();

      setPending(statsData.pendingLeaves || 0);
      setApproved(statsData.approvedLeaves || 0);
      setRejected(statsData.rejectedLeaves || 0);
      setTotalLeaves(statsData.totalLeaves || 0);

      // ✅ Fetch only employee leaves directly
      const leavesRes = await fetch(
        `http://localhost:5000/api/leaves/employee/${employeeId}`
      );
      const leavesData = await leavesRes.json();

      const lastThree = [...leavesData]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 3);

      setRecentLeaves(lastThree);

    } catch (err) {
      console.error("Dashboard Error:", err);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    if (activePage === "dashboard") {
      fetchDashboardData();
    }
  }, [activePage]);

  return (
    <div style={styles.container}>
      <div style={styles.sidebar}>
        <div>
          <h2 style={styles.logo}>Leave System</h2>

          {[
            ["dashboard", "Dashboard"],
            ["applyLeave", "Apply Leave"],
            ["history", "My Leave History"],
            ["approveReject", "Approve / Reject"],
            ["directory", "Employee Directory"],
            ["leaveTypes", "Leave Types"],
            ["holidays", "Holidays"],
          ].map(([key, label]) => (
            <div
              key={key}
              style={{
                ...styles.link,
                ...(activePage === key && styles.activeLink),
              }}
              onClick={() => setActivePage(key)}
            >
              {label}
            </div>
          ))}
        </div>

        <div
          style={{
            ...styles.profileLink,
            ...(activePage === "profile" && styles.activeLink),
          }}
          onClick={() => setActivePage("profile")}
        >
          👤 Profile
        </div>
      </div>

      <div style={styles.main}>
        {activePage === "dashboard" && (
          <>
            <div style={styles.header}>
              <h1 style={styles.heading}>Dashboard Overview</h1>
              <button
                style={styles.button}
                onClick={() => setActivePage("applyLeave")}
              >
                Request Leave
              </button>
            </div>

            <div style={styles.cards}>
              <div style={styles.card}>
                <h4>Total Leaves</h4>
                <p>{totalLeaves}</p>
              </div>

              <div style={styles.card}>
                <h4>Approved Leaves</h4>
                <p>{approved}</p>
              </div>

              <div style={styles.card}>
                <h4>Pending Requests</h4>
                <p>{pending}</p>
              </div>

              <div style={styles.card}>
                <h4>Rejected Requests</h4>
                <p>{rejected}</p>
              </div>
            </div>

            <div style={styles.tableSection}>
              <h2 style={styles.subHeading}>Recent Leave Status</h2>

              {recentLeaves.length === 0 ? (
                <p style={{ marginTop: "20px" }}>
                  No recent leave requests
                </p>
              ) : (
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>Date</th>
                      <th style={styles.th}>Type</th>
                      <th style={styles.th}>Status</th>
                      <th style={styles.th}>Manager Comment</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentLeaves.map((leave) => (
                      <tr key={leave._id}>
                        <td style={styles.td}>
                          {formatDate(leave.createdAt)}
                        </td>
                        <td style={styles.td}>{leave.type}</td>
                        <td style={styles.td}>{leave.status}</td>
                        <td style={styles.td}>
                          {leave.managerComment || "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}

        {activePage === "applyLeave" && <ApplyLeave />}
        {activePage === "history" && <MyLeaveHistory />}
        {activePage === "approveReject" && <ApproveReject />}
        {activePage === "directory" && <EmployeeDirectory />}
        {activePage === "leaveTypes" && <LeaveTypes />}
        {activePage === "holidays" && <Holidays />}
        {activePage === "profile" && <Profile />}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    minHeight: "100vh",
    fontFamily: "Inter, sans-serif",
    background: "#f3f6fb",
  },
  sidebar: {
    width: "260px",
    background: "linear-gradient(180deg,#1e293b,#0f172a)",
    color: "white",
    padding: "30px 20px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  logo: {
    marginBottom: "40px",
    fontSize: "22px",
    fontWeight: "600",
  },
  link: {
    padding: "12px 16px",
    borderRadius: "8px",
    marginBottom: "12px",
    cursor: "pointer",
  },
  profileLink: {
    padding: "14px 16px",
    borderRadius: "10px",
    cursor: "pointer",
    background: "rgba(255,255,255,0.05)",
  },
  activeLink: {
    background: "#2563eb",
  },
  main: {
    flex: 1,
    padding: "40px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  heading: {
    fontSize: "28px",
    fontWeight: "600",
  },
  button: {
    padding: "10px 20px",
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
  cards: {
    display: "flex",
    gap: "20px",
    marginTop: "30px",
    flexWrap: "wrap",
  },
  card: {
    background: "white",
    padding: "25px",
    borderRadius: "14px",
    width: "220px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
  },
  tableSection: {
    marginTop: "50px",
    background: "white",
    padding: "30px",
    borderRadius: "14px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
  },
  subHeading: {
    fontSize: "20px",
    marginBottom: "20px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    textAlign: "left",
    padding: "12px",
    borderBottom: "2px solid #e2e8f0",
  },
  td: {
    padding: "12px",
    borderBottom: "1px solid #e2e8f0",
  },
};