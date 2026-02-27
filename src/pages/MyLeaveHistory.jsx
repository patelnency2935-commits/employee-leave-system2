import { useEffect, useState } from "react";

export default function MyLeaveHistory() {
  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/leaves")
      .then((res) => res.json())
      .then((data) => {
        // ✅ SAFE FIX
        if (Array.isArray(data)) {
          setLeaves(data);
        } else if (Array.isArray(data.leaves)) {
          setLeaves(data.leaves);
        } else {
          setLeaves([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching leaves:", err);
        setLeaves([]);
      });
  }, []);

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const calculateDays = (from, to) => {
    if (!from || !to) return "-";
    const start = new Date(from);
    const end = new Date(to);
    const diffTime = end - start;
    return diffTime / (1000 * 60 * 60 * 24) + 1;
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>My Leave History</h2>

      {!Array.isArray(leaves) || leaves.length === 0 ? (
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
                <tr key={leave._id} style={styles.tr}>
                  <td style={styles.td}>{leave.type}</td>
                  <td style={styles.td}>{formatDate(leave.from)}</td>
                  <td style={styles.td}>{formatDate(leave.to)}</td>
                  <td style={styles.td}>
                    {calculateDays(leave.from, leave.to)}
                  </td>
                  <td style={styles.td}>{leave.status}</td>
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
  tableWrapper: { overflowX: "auto" },
  table: { width: "100%", borderCollapse: "collapse" },
  tableHeaderRow: { backgroundColor: "#f1f5f9" },
  th: {
    padding: "12px",
    textAlign: "left",
    borderBottom: "2px solid #e2e8f0",
  },
  tr: { borderBottom: "1px solid #e2e8f0" },
  td: { padding: "12px" },
  emptyBox: {
    padding: "20px",
    background: "#f8fafc",
    borderRadius: "10px",
    textAlign: "center",
  },
};