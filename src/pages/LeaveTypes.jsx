import React, { useState, useEffect } from "react";

export default function LeaveTypes() {
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    defaultCount: "",
    carryForward: false,
    encashable: false,
    gender: "All",
    accrualRule: "",
    maxLimit: "",
    visibility: "Visible to Employees",
  });

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("leaveTypes")) || [];
    setLeaveTypes(stored);
  }, []);

  const saveToStorage = (data) => {
    localStorage.setItem("leaveTypes", JSON.stringify(data));
  };

  const handleSubmit = () => {
    if (!formData.name) return alert("Leave name required");

    const updated = [...leaveTypes, { ...formData, id: Date.now() }];
    setLeaveTypes(updated);
    saveToStorage(updated);

    setFormData({
      name: "",
      description: "",
      defaultCount: "",
      carryForward: false,
      encashable: false,
      gender: "All",
      accrualRule: "",
      maxLimit: "",
      visibility: "Visible to Employees",
    });
  };

  const deleteLeave = (id) => {
    const filtered = leaveTypes.filter((item) => item.id !== id);
    setLeaveTypes(filtered);
    saveToStorage(filtered);
  };

  return (
    <div style={styles.wrapper}>
      <h1 style={styles.heading}>📑 Leave Types Management</h1>

      {/* FORM */}
      <div style={styles.form}>
        <input
          style={styles.input}
          placeholder="Leave Name"
          value={formData.name}
          onChange={(e) =>
            setFormData({ ...formData, name: e.target.value })
          }
        />

        <input
          style={styles.input}
          placeholder="Description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />

        <input
          style={styles.input}
          type="number"
          placeholder="Default Leave Count"
          value={formData.defaultCount}
          onChange={(e) =>
            setFormData({ ...formData, defaultCount: e.target.value })
          }
        />

        <input
          style={styles.input}
          placeholder="Accrual Rule (e.g., 1 per month)"
          value={formData.accrualRule}
          onChange={(e) =>
            setFormData({ ...formData, accrualRule: e.target.value })
          }
        />

        <input
          style={styles.input}
          type="number"
          placeholder="Maximum Accumulation"
          value={formData.maxLimit}
          onChange={(e) =>
            setFormData({ ...formData, maxLimit: e.target.value })
          }
        />

        <select
          style={styles.input}
          value={formData.gender}
          onChange={(e) =>
            setFormData({ ...formData, gender: e.target.value })
          }
        >
          <option>All</option>
          <option>Male</option>
          <option>Female</option>
        </select>

        <select
          style={styles.input}
          value={formData.visibility}
          onChange={(e) =>
            setFormData({ ...formData, visibility: e.target.value })
          }
        >
          <option>Visible to Employees</option>
          <option>Admin Only</option>
        </select>

        <label style={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={formData.carryForward}
            onChange={(e) =>
              setFormData({
                ...formData,
                carryForward: e.target.checked,
              })
            }
          />
          Carry Forward
        </label>

        <label style={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={formData.encashable}
            onChange={(e) =>
              setFormData({
                ...formData,
                encashable: e.target.checked,
              })
            }
          />
          Encashable
        </label>

        <button style={styles.addBtn} onClick={handleSubmit}>
          Add Leave Type
        </button>
      </div>

      {/* TABLE */}
      <div style={styles.table}>
        <h2 style={styles.reportHeading}>📊 Leave Type Report</h2>

        {leaveTypes.map((leave) => (
          <div key={leave.id} style={styles.row}>
            <div style={styles.leftSection}>
              <strong style={styles.leaveName}>{leave.name}</strong>
              <p style={styles.description}>{leave.description}</p>
              <small style={styles.meta}>
                Default: {leave.defaultCount} | Accrual: {leave.accrualRule} |
                Max: {leave.maxLimit}
              </small>
            </div>

            <div style={styles.middleSection}>
              <p>Gender: {leave.gender}</p>
              <p>Visibility: {leave.visibility}</p>
              <p>
                Carry: {leave.carryForward ? "Yes" : "No"} |
                Encash: {leave.encashable ? "Yes" : "No"}
              </p>
            </div>

            <button
              style={styles.deleteBtn}
              onClick={() => deleteLeave(leave.id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    padding: "50px 70px",
    background: "linear-gradient(to right, #f8fafc, #eef2f7)",
    minHeight: "100vh",
  },

  heading: {
    fontSize: "28px",
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: "25px",
  },

  form: {
    display: "grid",
    gap: "16px",
    background: "#ffffff",
    padding: "35px 40px",
    borderRadius: "18px",
    boxShadow: "0 20px 45px rgba(0, 0, 0, 0.06)",
    border: "1px solid #f1f5f9",
  },

  input: {
    padding: "12px 14px",
    borderRadius: "10px",
    border: "1px solid #e2e8f0",
    fontSize: "14px",
    outline: "none",
  },

  checkboxLabel: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "14px",
    color: "#334155",
  },

  addBtn: {
    background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
    color: "#ffffff",
    padding: "12px",
    border: "none",
    borderRadius: "10px",
    fontWeight: "600",
    cursor: "pointer",
    boxShadow: "0 6px 15px rgba(37, 99, 235, 0.3)",
  },

  table: {
    marginTop: "50px",
    background: "#ffffff",
    padding: "35px 40px",
    borderRadius: "18px",
    boxShadow: "0 20px 45px rgba(0, 0, 0, 0.06)",
    border: "1px solid #f1f5f9",
  },

  reportHeading: {
    fontSize: "22px",
    marginBottom: "25px",
    color: "#1e293b",
  },

  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 0",
    borderBottom: "1px solid #f1f5f9",
  },

  leftSection: {
    flex: 2,
  },

  middleSection: {
    flex: 1.5,
    fontSize: "14px",
    color: "#475569",
  },

  leaveName: {
    fontSize: "16px",
    color: "#0f172a",
  },

  description: {
    margin: "6px 0",
    color: "#64748b",
  },

  meta: {
    color: "#94a3b8",
  },

  deleteBtn: {
    background: "linear-gradient(135deg, #ef4444, #dc2626)",
    color: "#ffffff",
    border: "none",
    padding: "8px 16px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "600",
    boxShadow: "0 6px 15px rgba(239, 68, 68, 0.3)",
  },
};
