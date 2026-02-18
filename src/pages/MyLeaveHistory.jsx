import { useEffect, useState } from "react";

export default function MyLeaveHistory() {
  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    const storedLeaves = JSON.parse(localStorage.getItem("leaves")) || [];
    setLeaves(storedLeaves);
  }, []);

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>My Leave History</h2>

      {leaves.length === 0 ? (
        <div style={styles.emptyBox}>
          No leave records found.
        </div>
      ) : (
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeaderRow}>
                <th style={styles.th}>Leave Type</th>
                <th style={styles.th}>From</th>
                <th style={styles.th}>To</th>
                <th style={styles.th}>Days</th>
                <th style={styles.th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {leaves.map((leave) => (
                <tr key={leave.id} style={styles.tr}>
                  <td style={styles.td}>{leave.type}</td>
                  <td style={styles.td}>{leave.from}</td>
                  <td style={styles.td}>{leave.to}</td>
                  <td style={styles.td}>{leave.totalDays}</td>
                  <td style={styles.td}>
                    <span
                      style={{
                        ...styles.statusBadge,
                        backgroundColor:
                          leave.status === "Approved"
                            ? "#dcfce7"
                            : leave.status === "Rejected"
                            ? "#fee2e2"
                            : "#fef9c3",
                        color:
                          leave.status === "Approved"
                            ? "#15803d"
                            : leave.status === "Rejected"
                            ? "#b91c1c"
                            : "#b45309",
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

const styles = {
  container: {
    background: "white",
    padding: "25px",
    borderRadius: "12px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
  },
  heading: {
    marginBottom: "20px",
    fontSize: "22px",
    fontWeight: "600",
  },
  tableWrapper: {
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  tableHeaderRow: {
    backgroundColor: "#f1f5f9",
  },
  th: {
    padding: "12px",
    textAlign: "left",
    fontWeight: "600",
    fontSize: "14px",
    color: "#334155",
    borderBottom: "2px solid #e2e8f0",
  },
  tr: {
    borderBottom: "1px solid #e2e8f0",
  },
  td: {
    padding: "12px",
    fontSize: "14px",
    color: "#475569",
  },
  statusBadge: {
    padding: "5px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600",
    display: "inline-block",
  },
  emptyBox: {
    padding: "20px",
    background: "#f8fafc",
    borderRadius: "10px",
    textAlign: "center",
    color: "#64748b",
  },
};
