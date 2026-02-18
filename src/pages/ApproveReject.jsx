import React, { useState, useEffect } from "react";

function ApproveReject() {
  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    const storedLeaves = JSON.parse(localStorage.getItem("leaves")) || [];
    setLeaves(storedLeaves);
  }, []);

  const handleAction = (index, status) => {
    const updatedLeaves = [...leaves];
    updatedLeaves[index].status = status;
    localStorage.setItem("leaves", JSON.stringify(updatedLeaves));
    setLeaves(updatedLeaves);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Approve / Reject Leaves</h2>

      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Type</th>
              <th style={styles.th}>From</th>
              <th style={styles.th}>To</th>
              <th style={styles.th}>Days</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Action</th>
            </tr>
          </thead>
          <tbody>
            {leaves.length === 0 ? (
              <tr>
                <td colSpan="6" style={styles.noData}>
                  No Leave Requests Found
                </td>
              </tr>
            ) : (
              leaves.map((leave, index) => (
                <tr key={index} style={styles.tr}>
                  <td style={styles.td}>{leave.type}</td>
                  <td style={styles.td}>{leave.from}</td>
                  <td style={styles.td}>{leave.to}</td>
                  <td style={styles.td}>{leave.days}</td>
                  <td style={styles.td}>
                    <span
                      style={{
                        ...styles.statusBadge,
                        backgroundColor:
                          leave.status === "Approved"
                            ? "#d4edda"
                            : leave.status === "Rejected"
                            ? "#f8d7da"
                            : "#fff3cd",
                        color:
                          leave.status === "Approved"
                            ? "#155724"
                            : leave.status === "Rejected"
                            ? "#721c24"
                            : "#856404",
                      }}
                    >
                      {leave.status || "Pending"}
                    </span>
                  </td>
                  <td style={styles.td}>
                    {leave.status ? (
                      <span style={styles.completed}>
                        Action Completed
                      </span>
                    ) : (
                      <>
                        <button
                          style={styles.approveBtn}
                          onClick={() => handleAction(index, "Approved")}
                        >
                          Approve
                        </button>
                        <button
                          style={styles.rejectBtn}
                          onClick={() => handleAction(index, "Rejected")}
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "30px",
  },
  heading: {
    marginBottom: "20px",
    fontSize: "24px",
    fontWeight: "600",
    color: "#2c3e50",
  },
  tableWrapper: {
    backgroundColor: "#ffffff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    backgroundColor: "#f4f6f9",
    padding: "12px",
    textAlign: "left",
    fontWeight: "600",
    fontSize: "14px",
    borderBottom: "2px solid #e0e0e0",
  },
  tr: {
    borderBottom: "1px solid #eee",
  },
  td: {
    padding: "12px",
    fontSize: "14px",
  },
  noData: {
    textAlign: "center",
    padding: "20px",
    color: "#888",
  },
  approveBtn: {
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    padding: "6px 12px",
    borderRadius: "5px",
    cursor: "pointer",
    marginRight: "8px",
  },
  rejectBtn: {
    backgroundColor: "#dc3545",
    color: "#fff",
    border: "none",
    padding: "6px 12px",
    borderRadius: "5px",
    cursor: "pointer",
  },
  completed: {
    color: "#6c757d",
    fontWeight: "500",
  },
  statusBadge: {
    padding: "5px 10px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "500",
  },
};

export default ApproveReject;
