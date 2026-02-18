import { useEffect, useState } from "react";
import React from "react";
import ApplyLeave from "./ApplyLeave";
import MyLeaveHistory from "./MyLeaveHistory";
import ApproveReject from "./ApproveReject"; // ✅ added
import EmployeeDirectory from "./EmployeeDirectory"; // ✅ added

export default function EmployeeDashboard() {

  const [activePage, setActivePage] = useState("dashboard");

  // ===== STATES =====
  const [totalEmployees] = useState(10);
  const [pending, setPending] = useState(0);
  const [rejected, setRejected] = useState(0);
  const [onLeaveToday, setOnLeaveToday] = useState(0);
  const [leaveBalance, setLeaveBalance] = useState(12);

  // ===== LOAD DATA FROM LOCALSTORAGE =====
  useEffect(() => {
    const leaves =
      JSON.parse(localStorage.getItem("leaves")) || [];

    const pendingCount = leaves.filter(
      (leave) => leave.status === "Pending"
    ).length;

    const rejectedCount = leaves.filter(
      (leave) => leave.status === "Rejected"
    ).length;

    const storedBalance =
      parseInt(localStorage.getItem("leaveBalance")) || 12;

    setPending(pendingCount);
    setRejected(rejectedCount);
    setOnLeaveToday(pendingCount);
    setLeaveBalance(storedBalance);
  }, []);

  return (
    <div style={styles.container}>
      
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <h2 style={{ marginBottom: "30px" }}>Leave System</h2>

        <p style={styles.link} onClick={() => setActivePage("dashboard")}>
          Dashboard
        </p>

        <p style={styles.link} onClick={() => setActivePage("applyLeave")}>
          Apply Leave
        </p>

        <p style={styles.link} onClick={() => setActivePage("history")}>
          My Leave History
        </p>

        {/* ✅ FIXED */}
        <p
          style={styles.link}
          onClick={() => setActivePage("approveReject")}
        >
          Approve / Reject
        </p>
        
        {/* ✅ THIS WAS MISSING */}
        <p 
          style={styles.link} 
          onClick={() => setActivePage("directory")}
        >
          Employee Directory
        </p>
      

        <p style={styles.link}>Employee Directory</p>
        <p style={styles.link}>Leave Types</p>
        <p style={styles.link}>Holidays</p>
        <p style={styles.link}>Reports</p>
      </div>

      {/* Main Content */}
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
                <select style={styles.input}>
                  <option>Filter by Department</option>
                  <option>IT</option>
                  <option>HR</option>
                  <option>Sales</option>
                </select>

                <select style={styles.input}>
                  <option>Filter by Status</option>
                  <option>Approved</option>
                  <option>Pending</option>
                  <option>Rejected</option>
                </select>

                <input type="date" style={styles.input} />
                <input type="date" style={styles.input} />

                <button style={styles.downloadBtn}>
                  Download Report
                </button>
              </div>
            </div>
          </>
        )}

        {activePage === "applyLeave" && <ApplyLeave />}
        {activePage === "history" && <MyLeaveHistory />}
        {activePage === "approveReject" && <ApproveReject />} {/* ✅ added */}
        {activePage === "directory" && <EmployeeDirectory />}


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
    width: "250px",
    background: "#1e293b",
    color: "white",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
  },
  link: {
    color: "white",
    textDecoration: "none",
    marginBottom: "15px",
    cursor: "pointer",
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
    borderRadius: "10px",
    width: "180px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    textAlign: "center",
  },
  reportSection: {
    marginTop: "50px",
    background: "white",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  },
  filters: {
    display: "flex",
    gap: "15px",
    marginTop: "20px",
    flexWrap: "wrap",
  },
  input: {
    padding: "8px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  downloadBtn: {
    padding: "8px 15px",
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};
