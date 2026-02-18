import React, { useState } from "react";

function EmployeeDirectory() {
  const [employees] = useState([
    {
      id: "EMP001",
      name: "Rahul Sharma",
      role: "Software Engineer",
      department: "IT",
      joiningDate: "2023-04-12",
      leaveBalance: { sick: 5, casual: 3, annual: 10 },
      status: "Present",
    },
    {
      id: "EMP002",
      name: "Priya Singh",
      role: "HR Manager",
      department: "HR",
      joiningDate: "2022-01-20",
      leaveBalance: { sick: 2, casual: 1, annual: 6 },
      status: "On Leave",
    },
  ]);

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Employee Directory</h2>

      <div style={styles.card}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Employee</th>
              <th style={styles.th}>Department</th>
              <th style={styles.th}>Leave Balance</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {employees.map((emp) => (
              <tr key={emp.id} style={styles.tr}>
                <td style={styles.td}>
                  <strong>{emp.name}</strong>
                  <div style={styles.subText}>{emp.role}</div>
                  <div style={styles.subText}>ID: {emp.id}</div>
                </td>

                <td style={styles.td}>
                  {emp.department}
                  <div style={styles.subText}>
                    Joined: {emp.joiningDate}
                  </div>
                </td>

                <td style={styles.td}>
                  Sick: {emp.leaveBalance?.sick ?? 0} | Casual:{" "}
                  {emp.leaveBalance?.casual ?? 0} | Annual:{" "}
                  {emp.leaveBalance?.annual ?? 0}
                </td>

                <td style={styles.td}>
                  <span
                    style={{
                      ...styles.statusBadge,
                      backgroundColor:
                        emp.status === "Present"
                          ? "#d4edda"
                          : "#f8d7da",
                      color:
                        emp.status === "Present"
                          ? "#155724"
                          : "#721c24",
                    }}
                  >
                    {emp.status}
                  </span>
                </td>

                <td style={styles.td}>
                  <button style={styles.viewBtn}>
                    View
                  </button>
                  <button style={styles.editBtn}>
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {employees.length === 0 && (
          <p style={{ textAlign: "center", padding: "20px" }}>
            No Employees Found
          </p>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "30px",
  },
  heading: {
    fontSize: "24px",
    fontWeight: "600",
    marginBottom: "20px",
    color: "#2c3e50",
  },
  card: {
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
    textAlign: "left",
    padding: "12px",
    borderBottom: "2px solid #eee",
    fontSize: "14px",
    backgroundColor: "#f9fafb",
  },
  tr: {
    borderBottom: "1px solid #eee",
  },
  td: {
    padding: "12px",
    fontSize: "14px",
  },
  subText: {
    fontSize: "12px",
    color: "#777",
  },
  statusBadge: {
    padding: "5px 10px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "500",
  },
  viewBtn: {
    backgroundColor: "#2563eb",
    color: "#fff",
    border: "none",
    padding: "6px 10px",
    borderRadius: "5px",
    marginRight: "6px",
    cursor: "pointer",
  },
  editBtn: {
    backgroundColor: "#f59e0b",
    color: "#fff",
    border: "none",
    padding: "6px 10px",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default EmployeeDirectory;
