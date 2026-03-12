import { useEffect, useState } from "react";

export default function MyLeaveHistory() {

  const [leaves, setLeaves] = useState([]);

  const fetchLeaves = async () => {

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

      const res = await fetch(`http://localhost:5000/api/leaves/employee/${employeeId}`);

      if (res.ok) {
        const data = await res.json();
        setLeaves(Array.isArray(data) ? data : []);
      }

    } catch (error) {

      console.error("Error fetching leaves:", error);

    }

  };

  useEffect(() => {
    fetchLeaves();
    const interval = setInterval(fetchLeaves, 30000); // refresh every 30s
    window.addEventListener("leaveUpdated", fetchLeaves);
    window.addEventListener("adminLeaveUpdated", fetchLeaves);

    return () => {
      clearInterval(interval);
      window.removeEventListener("leaveUpdated", fetchLeaves);
      window.removeEventListener("adminLeaveUpdated", fetchLeaves);
    };
  }, []);

  const formatDate = (date) => {

    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });

  };

  const calculateDays = (startDate, endDate) => {

    if (!startDate || !endDate) return "-";

    const start = new Date(startDate);
    const end = new Date(endDate);

    const diff = end - start;

    return diff / (1000 * 60 * 60 * 24) + 1;

  };

  const statusStyle = (status) => {

    if (status === "approved") {
      return { background: "#ecfdf5", color: "#16a34a" };
    }

    if (status === "rejected") {
      return { background: "#fef2f2", color: "#dc2626" };
    }

    return { background: "#fff7ed", color: "#ea580c" };

  };

  return (

    <div style={styles.container}>

      <h2 style={styles.heading}>My Leave History</h2>

      {leaves.length === 0 ? (

        <div style={styles.emptyBox}>
          No leave records found
        </div>

      ) : (

        <div style={styles.tableWrapper}>

          <table style={styles.table}>

            <thead>

              <tr style={styles.headerRow}>
                <th style={styles.th}>Leave Type</th>
                <th style={styles.th}>From</th>
                <th style={styles.th}>To</th>
                <th style={styles.th}>Days</th>
                <th style={styles.th}>Status</th>
              </tr>

            </thead>

            <tbody>

              {leaves.map((leave) => (

                <tr key={leave._id} style={styles.row}>

                  <td style={styles.td}>{leave.type}</td>

                  <td style={styles.td}>
                    {formatDate(leave.startDate)}
                  </td>

                  <td style={styles.td}>
                    {formatDate(leave.endDate)}
                  </td>

                  <td style={styles.td}>
                    {calculateDays(leave.startDate, leave.endDate)}
                  </td>

                  <td style={styles.td}>

                    <span
                      style={{
                        ...styles.status,
                        ...statusStyle(leave.status)
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
    boxShadow: "0 6px 20px rgba(0,0,0,0.08)"
  },

  heading: {
    marginBottom: "20px",
    fontSize: "24px",
    fontWeight: "600"
  },

  tableWrapper: {
    overflowX: "auto"
  },

  table: {
    width: "100%",
    borderCollapse: "collapse"
  },

  headerRow: {
    background: "#f1f5f9"
  },

  th: {
    padding: "14px",
    textAlign: "left",
    fontSize: "14px",
    fontWeight: "600",
    borderBottom: "2px solid #e2e8f0"
  },

  row: {
    borderBottom: "1px solid #e2e8f0"
  },

  td: {
    padding: "14px",
    fontSize: "14px"
  },

  status: {
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "13px",
    fontWeight: "600",
    textTransform: "capitalize"
  },

  emptyBox: {
    padding: "20px",
    background: "#f8fafc",
    borderRadius: "10px",
    textAlign: "center"
  }

};
