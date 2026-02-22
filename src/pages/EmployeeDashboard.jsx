import { useEffect, useState, useMemo } from "react";
import React from "react";
import ApplyLeave from "./ApplyLeave";
import MyLeaveHistory from "./MyLeaveHistory";
import ApproveReject from "./ApproveReject";
import EmployeeDirectory from "./EmployeeDirectory";
import LeaveTypes from "./LeaveTypes";
import Holidays from "./Holidays";
import Reports from "./Reports";

export default function EmployeeDashboard() {
  const [activePage, setActivePage] = useState("dashboard");

  const [totalEmployees] = useState(10);
  const [pending, setPending] = useState(0);
  const [rejected, setRejected] = useState(0);
  const [onLeaveToday, setOnLeaveToday] = useState(0);
  const [leaveBalance, setLeaveBalance] = useState(12);

  const [leaves, setLeaves] = useState([]);

  const [departmentFilter, setDepartmentFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // 🔥 FETCH DATA FROM BACKEND
  const fetchLeaves = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/leaves");
      const data = await res.json();

      setLeaves(data);

      const pendingCount = data.filter(
        (leave) => leave.status === "Pending"
      ).length;

      const rejectedCount = data.filter(
        (leave) => leave.status === "Rejected"
      ).length;

      const today = new Date().toISOString().split("T")[0];

      const todayCount = data.filter(
        (leave) =>
          leave.status === "Approved" &&
          leave.date === today
      ).length;

      setPending(pendingCount);
      setRejected(rejectedCount);
      setOnLeaveToday(todayCount);

    } catch (err) {
      console.error("Error fetching leaves:", err);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  useEffect(() => {
    fetchLeaves();
  }, [activePage]);

  const filteredLeaves = useMemo(() => {
    return leaves.filter((leave) => {
      const matchDepartment =
        !departmentFilter || leave.department === departmentFilter;

      const matchStatus =
        !statusFilter || leave.status === statusFilter;

      const matchFrom =
        !fromDate || new Date(leave.date) >= new Date(fromDate);

      const matchTo =
        !toDate || new Date(leave.date) <= new Date(toDate);

      return matchDepartment && matchStatus && matchFrom && matchTo;
    });
  }, [leaves, departmentFilter, statusFilter, fromDate, toDate]);

  const downloadReport = () => {
    if (filteredLeaves.length === 0) {
      alert("No data available for selected filters");
      return;
    }

    const headers = ["Employee", "Department", "Type", "Status", "Date"];

    const rows = filteredLeaves.map((leave) => [
      leave.employee,
      leave.department,
      leave.type,
      leave.status,
      leave.date,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((e) => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "leave_report.csv");
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div style={styles.container}>
      <div style={styles.sidebar}>
        <h2 style={styles.logo}>Leave System</h2>

        {[
          ["dashboard", "Dashboard"],
          ["applyLeave", "Apply Leave"],
          ["history", "My Leave History"],
          ["approveReject", "Approve / Reject"],
          ["directory", "Employee Directory"],
          ["leaveTypes", "Leave Types"],
          ["holidays", "Holidays"],
          ["reports", "Reports"],
        ].map(([key, label]) => (
          <p
            key={key}
            style={{
              ...styles.link,
              ...(activePage === key && styles.activeLink),
            }}
            onClick={() => setActivePage(key)}
          >
            {label}
          </p>
        ))}
      </div>

      <div style={styles.main}>
        {activePage === "dashboard" && (
          <>
            <h1>📊 Dashboard Overview</h1>

            <div style={styles.cardContainer}>
              <div style={styles.card}>
                <h3>Total Employees</h3>
                <p>{totalEmployees}</p>
              </div>

              <div style={styles.card}>
                <h3>Pending Requests</h3>
                <p>{pending}</p>
              </div>

              <div style={styles.card}>
                <h3>On Leave Today</h3>
                <p>{onLeaveToday}</p>
              </div>

              <div style={styles.card}>
                <h3>Rejected Requests</h3>
                <p>{rejected}</p>
              </div>

              <div style={styles.card}>
                <h3>Total Leave Balance</h3>
                <p>{leaveBalance} Days</p>
              </div>
            </div>

            <div style={styles.reportSection}>
              <h2>📅 Reports & Filtering</h2>

              <div style={styles.filters}>
                <select
                  style={styles.input}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                >
                  <option value="">Filter by Department</option>
                  <option value="IT">IT</option>
                  <option value="HR">HR</option>
                  <option value="Sales">Sales</option>
                </select>

                <select
                  style={styles.input}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="">Filter by Status</option>
                  <option value="Approved">Approved</option>
                  <option value="Pending">Pending</option>
                  <option value="Rejected">Rejected</option>
                </select>

                <input
                  type="date"
                  style={styles.input}
                  onChange={(e) => setFromDate(e.target.value)}
                />

                <input
                  type="date"
                  style={styles.input}
                  onChange={(e) => setToDate(e.target.value)}
                />

                <button style={styles.downloadBtn} onClick={downloadReport}>
                  Download Report
                </button>
              </div>
            </div>
          </>
        )}

        {activePage === "applyLeave" && <ApplyLeave />}
        {activePage === "history" && <MyLeaveHistory />}
        {activePage === "approveReject" && <ApproveReject />}
        {activePage === "directory" && <EmployeeDirectory />}
        {activePage === "leaveTypes" && <LeaveTypes />}
        {activePage === "holidays" && <Holidays />}
        {activePage === "reports" && <Reports />}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    minHeight: "100vh",
    fontFamily: "Arial, sans-serif",
  },
  sidebar: {
    width: "260px",
    background: "#1e293b",
    color: "white",
    padding: "30px 20px",
    display: "flex",
    flexDirection: "column",
  },
  logo: {
    marginBottom: "40px",
    textAlign: "center",
    fontSize: "22px",
    fontWeight: "600",
    letterSpacing: "1px",
    color: "white",
  },
  link: {
    padding: "12px 15px",
    borderRadius: "8px",
    marginBottom: "10px",
    cursor: "pointer",
  },
  activeLink: {
    background: "#2563eb",
  },
  main: {
    flex: 1,
    padding: "30px",
    background: "#f1f5f9",
  },
  cardContainer: {
    display: "flex",
    gap: "20px",
    marginTop: "20px",
    flexWrap: "wrap",
  },
  card: {
    background: "white",
    padding: "20px",
    borderRadius: "12px",
    width: "190px",
    boxShadow: "0 6px 15px rgba(0,0,0,0.08)",
    textAlign: "center",
  },
  reportSection: {
    marginTop: "50px",
    background: "white",
    padding: "25px",
    borderRadius: "12px",
    boxShadow: "0 6px 15px rgba(0,0,0,0.08)",
  },
  filters: {
    display: "flex",
    gap: "15px",
    marginTop: "20px",
    flexWrap: "wrap",
  },
  input: {
    padding: "8px 10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
  downloadBtn: {
    padding: "8px 15px",
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
};