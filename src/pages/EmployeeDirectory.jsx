import React, { useState } from "react";

function EmployeeDirectory() {
  const [employees, setEmployees] = useState([
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

  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [mode, setMode] = useState("");

  const handleView = (emp) => {
    setSelectedEmployee(emp);
    setMode("view");
  };

  const handleEdit = (emp) => {
    setSelectedEmployee({ ...emp });
    setMode("edit");
  };

  const closeModal = () => {
    setSelectedEmployee(null);
    setMode("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "department" || name === "status") {
      setSelectedEmployee({ ...selectedEmployee, [name]: value });
    } else {
      setSelectedEmployee({
        ...selectedEmployee,
        leaveBalance: {
          ...selectedEmployee.leaveBalance,
          [name]: Number(value),
        },
      });
    }
  };

  const handleSave = () => {
    const updated = employees.map((emp) =>
      emp.id === selectedEmployee.id ? selectedEmployee : emp
    );
    setEmployees(updated);
    closeModal();
  };

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
              <tr key={emp.id}>
                <td style={styles.td}>
                  <strong>{emp.name}</strong>
                  <div style={styles.subText}>{emp.role}</div>
                  <div style={styles.subText}>ID: {emp.id}</div>
                </td>

                <td style={styles.td}>{emp.department}</td>

                <td style={styles.td}>
                  Sick: {emp.leaveBalance.sick} | Casual:{" "}
                  {emp.leaveBalance.casual} | Annual:{" "}
                  {emp.leaveBalance.annual}
                </td>

                <td style={styles.td}>
                  <span
                    style={{
                      ...styles.statusBadge,
                      backgroundColor:
                        emp.status === "Present"
                          ? "#dcfce7"
                          : "#fee2e2",
                      color:
                        emp.status === "Present"
                          ? "#166534"
                          : "#991b1b",
                    }}
                  >
                    {emp.status}
                  </span>
                </td>

                <td style={styles.td}>
                  <button
                    style={styles.viewBtn}
                    onClick={() => handleView(emp)}
                  >
                    View
                  </button>

                  <button
                    style={styles.editBtn}
                    onClick={() => handleEdit(emp)}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {selectedEmployee && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3>
              {mode === "view" ? "Employee Details" : "Edit Employee"}
            </h3>

            <p><strong>Name:</strong> {selectedEmployee.name}</p>
            <p><strong>ID:</strong> {selectedEmployee.id}</p>
            <p><strong>Role:</strong> {selectedEmployee.role}</p>
            <p><strong>Joining Date:</strong> {selectedEmployee.joiningDate}</p>

            {mode === "view" ? (
              <>
                <p><strong>Department:</strong> {selectedEmployee.department}</p>
                <p><strong>Status:</strong> {selectedEmployee.status}</p>
                <p>
                  <strong>Leave Balance:</strong> Sick {selectedEmployee.leaveBalance.sick},
                  Casual {selectedEmployee.leaveBalance.casual},
                  Annual {selectedEmployee.leaveBalance.annual}
                </p>
              </>
            ) : (
              <>
                <label>Department</label>
                <input
                  style={styles.input}
                  name="department"
                  value={selectedEmployee.department}
                  onChange={handleChange}
                />

                <label>Status</label>
                <select
                  style={styles.input}
                  name="status"
                  value={selectedEmployee.status}
                  onChange={handleChange}
                >
                  <option>Present</option>
                  <option>On Leave</option>
                </select>

                <label>Sick</label>
                <input
                  type="number"
                  style={styles.input}
                  name="sick"
                  value={selectedEmployee.leaveBalance.sick}
                  onChange={handleChange}
                />

                <label>Casual</label>
                <input
                  type="number"
                  style={styles.input}
                  name="casual"
                  value={selectedEmployee.leaveBalance.casual}
                  onChange={handleChange}
                />

                <label>Annual</label>
                <input
                  type="number"
                  style={styles.input}
                  name="annual"
                  value={selectedEmployee.leaveBalance.annual}
                  onChange={handleChange}
                />

                <button style={styles.saveBtn} onClick={handleSave}>
                  Save Changes
                </button>
              </>
            )}

            <button style={styles.closeBtn} onClick={closeModal}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { padding: "30px" },

  heading: {
    fontSize: "26px",
    fontWeight: "600",
    marginBottom: "20px",
    color: "#1f2937",
  },

  card: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
  },

  table: { width: "100%", borderCollapse: "collapse" },

  th: {
    textAlign: "left",
    padding: "14px",
    borderBottom: "2px solid #e5e7eb",
    backgroundColor: "#f9fafb",
  },

  td: {
    padding: "14px",
    borderBottom: "1px solid #f1f1f1",
  },

  subText: {
    fontSize: "12px",
    color: "#6b7280",
  },

  statusBadge: {
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600",
  },

  viewBtn: {
    backgroundColor: "#2563eb",
    color: "#fff",
    border: "none",
    padding: "6px 12px",
    borderRadius: "6px",
    marginRight: "8px",
    cursor: "pointer",
  },

  editBtn: {
    backgroundColor: "#f59e0b",
    color: "#fff",
    border: "none",
    padding: "6px 12px",
    borderRadius: "6px",
    cursor: "pointer",
  },

  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.55)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },

  modal: {
    background: "#fff",
    padding: "25px",
    borderRadius: "14px",
    width: "420px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  input: {
    padding: "8px",
    borderRadius: "6px",
    border: "1px solid #d1d5db",
  },

  saveBtn: {
    backgroundColor: "#16a34a",
    color: "#fff",
    padding: "8px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },

  closeBtn: {
    backgroundColor: "#ef4444",
    color: "#fff",
    padding: "8px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    marginTop: "5px",
  },
};

export default EmployeeDirectory;
