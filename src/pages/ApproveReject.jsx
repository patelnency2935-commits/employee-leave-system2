import React, { useState, useEffect } from "react";

function ApproveReject() {
  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/leaves")
      .then((res) => res.json())
      .then((data) => setLeaves(data))
      .catch((err) => console.error("Error fetching leaves:", err));
  }, []);

  const handleApprove = (id) => {
    fetch(`http://localhost:5000/api/leaves/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "Approved" }),
    })
      .then((res) => res.json())
      .then((updatedLeave) => {
        const updatedLeaves = leaves.map((leave) =>
          leave._id === id ? updatedLeave : leave
        );
        setLeaves(updatedLeaves);
      })
      .catch((err) => console.error("Error approving leave:", err));
  };

  const handleReject = (id) => {
    fetch(`http://localhost:5000/api/leaves/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "Rejected" }),
    })
      .then((res) => res.json())
      .then((updatedLeave) => {
        const updatedLeaves = leaves.map((leave) =>
          leave._id === id ? updatedLeave : leave
        );
        setLeaves(updatedLeaves);
      })
      .catch((err) => console.error("Error rejecting leave:", err));
  };

  // ✅ DATE FORMAT FUNCTION
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h2 style={styles.title}>Approve / Reject Leaves</h2>

        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Type</th>
                <th style={styles.th}>From</th>
                <th style={styles.th}>To</th>
                <th style={styles.th}>Status</th>
                <th style={{ ...styles.th, textAlign: "right" }}>Action</th>
              </tr>
            </thead>

            <tbody>
              {leaves.length === 0 ? (
                <tr>
                  <td colSpan="5" style={styles.noData}>
                    No Leave Applications Found
                  </td>
                </tr>
              ) : (
                leaves.map((leave) => (
                  <tr key={leave._id} style={styles.row}>
                    <td style={styles.typeCell}>{leave.type}</td>

                    {/* ✅ Date formatted here */}
                    <td style={styles.td}>{formatDate(leave.from)}</td>
                    <td style={styles.td}>{formatDate(leave.to)}</td>

                    <td style={styles.td}>
                      <span
                        style={
                          leave.status === "Approved"
                            ? styles.approved
                            : leave.status === "Rejected"
                            ? styles.rejected
                            : styles.pending
                        }
                      >
                        {leave.status}
                      </span>
                    </td>

                    <td style={{ ...styles.td, textAlign: "right" }}>
                      {leave.status === "Pending" ? (
                        <div style={styles.buttonGroup}>
                          <button
                            style={styles.approveBtn}
                            onClick={() => handleApprove(leave._id)}
                          >
                            Approve
                          </button>

                          <button
                            style={styles.rejectBtn}
                            onClick={() => handleReject(leave._id)}
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span style={styles.completed}>
                          Action Completed
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    padding: "60px 80px",
    background: "linear-gradient(to right, #f8fafc, #eef2f7)",
    minHeight: "100vh",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: "20px",
    padding: "40px",
    boxShadow: "0 25px 50px rgba(0, 0, 0, 0.08)",
  },
  title: {
    fontSize: "26px",
    fontWeight: "600",
    marginBottom: "30px",
    color: "#1e293b",
  },
  tableWrapper: { overflowX: "auto" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: {
    textAlign: "left",
    padding: "16px 12px",
    fontSize: "13px",
    fontWeight: "600",
    color: "#64748b",
    borderBottom: "2px solid #e2e8f0",
  },
  td: {
    padding: "16px 12px",
    fontSize: "14px",
    color: "#334155",
    borderBottom: "1px solid #f1f5f9",
  },
  row: { transition: "0.2s ease" },
  typeCell: { fontWeight: "600", color: "#0f172a" },
  approved: {
    backgroundColor: "#dcfce7",
    color: "#166534",
    padding: "6px 18px",
    borderRadius: "50px",
    fontSize: "12px",
    fontWeight: "600",
  },
  rejected: {
    backgroundColor: "#fee2e2",
    color: "#991b1b",
    padding: "6px 18px",
    borderRadius: "50px",
    fontSize: "12px",
    fontWeight: "600",
  },
  pending: {
    backgroundColor: "#fef3c7",
    color: "#92400e",
    padding: "6px 18px",
    borderRadius: "50px",
    fontSize: "12px",
    fontWeight: "600",
  },
  buttonGroup: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "12px",
  },
  approveBtn: {
    background: "linear-gradient(135deg, #22c55e, #16a34a)",
    border: "none",
    padding: "8px 18px",
    borderRadius: "10px",
    color: "#fff",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
  },
  rejectBtn: {
    background: "linear-gradient(135deg, #ef4444, #dc2626)",
    border: "none",
    padding: "8px 18px",
    borderRadius: "10px",
    color: "#fff",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
  },
  completed: {
    fontSize: "13px",
    color: "#94a3b8",
    fontWeight: "500",
  },
  noData: {
    textAlign: "center",
    padding: "30px",
    color: "#64748b",
    fontWeight: "500",
  },
};

export default ApproveReject;