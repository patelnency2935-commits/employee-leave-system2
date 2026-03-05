import React, { useState } from "react";

function Departments() {

  const [departments, setDepartments] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
    hod: "",
    leaveLimit: ""
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const openModal = () => {
    setShowModal(true);
    setError("");
    setSuccess("");
  };

  const closeModal = () => {
    setShowModal(false);
    setForm({
      name: "",
      description: "",
      hod: "",
      leaveLimit: ""
    });
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const addDepartment = () => {

    if (form.name.trim() === "") {
      setError("Please enter department name");
      return;
    }

    const duplicate = departments.find(
      (d) => d.name.toLowerCase() === form.name.toLowerCase()
    );

    if (duplicate) {
      setError("Department already exists");
      return;
    }

    const newDept = {
      id: Date.now(),
      ...form,
      employees: 0
    };

    setDepartments([...departments, newDept]);

    setSuccess("Department added successfully");

    setTimeout(() => {
      closeModal();
    }, 800);
  };

  const deleteDepartment = (id) => {
    setDepartments(departments.filter((d) => d.id !== id));
  };

  const filtered = departments.filter((dept) =>
    dept.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={styles.container}>

      <h2 style={styles.title}>Departments</h2>

      <div style={styles.topBar}>

        <input
          placeholder="Search Department"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.input}
        />

        <button style={styles.addBtn} onClick={openModal}>
          Add Department
        </button>

      </div>

      <div style={styles.card}>

        <table style={styles.table}>

          <thead>
            <tr style={styles.tableHeader}>
              <th style={styles.th}>Department</th>
              <th style={styles.th}>Employees</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>

          <tbody>

            {filtered.length === 0 ? (
              <tr>
                <td colSpan="3" style={styles.empty}>
                  No Departments Found
                </td>
              </tr>
            ) : (
              filtered.map((dept) => (
                <tr key={dept.id} style={styles.tr}>
                  <td style={styles.td}>{dept.name}</td>
                  <td style={styles.td}>{dept.employees}</td>

                  <td style={styles.td}>
                    <button
                      style={styles.deleteBtn}
                      onClick={() => deleteDepartment(dept.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}

          </tbody>

        </table>

      </div>

      {showModal && (

        <div style={styles.modalOverlay}>

          <div style={styles.modal}>

            <h3>Add Department</h3>

            <input
              name="name"
              placeholder="Department Name"
              value={form.name}
              onChange={handleChange}
              style={styles.modalInput}
            />

            <input
              name="description"
              placeholder="Department Description"
              value={form.description}
              onChange={handleChange}
              style={styles.modalInput}
            />

            <input
              name="hod"
              placeholder="Department Head"
              value={form.hod}
              onChange={handleChange}
              style={styles.modalInput}
            />

            <input
              name="leaveLimit"
              placeholder="Leave Limit"
              type="number"
              value={form.leaveLimit}
              onChange={handleChange}
              style={styles.modalInput}
            />

            {error && <p style={styles.error}>{error}</p>}
            {success && <p style={styles.success}>{success}</p>}

            <div style={styles.modalActions}>

              <button style={styles.saveBtn} onClick={addDepartment}>
                Save
              </button>

              <button style={styles.cancelBtn} onClick={closeModal}>
                Cancel
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default Departments;

const styles = {

  container: {
    padding: "30px",
    background: "#f3f4f6",
    minHeight: "100vh"
  },

  title: {
    fontSize: "28px",
    marginBottom: "20px",
    fontWeight: "600"
  },

  topBar: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px"
  },

  input: {
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    width: "220px"
  },

  addBtn: {
    background: "#2563eb",
    color: "white",
    border: "none",
    padding: "10px 18px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "500"
  },

  card: {
    background: "white",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
  },

  table: {
    width: "100%",
    borderCollapse: "collapse"
  },

  tableHeader: {
    background: "#f9fafb",
    borderBottom: "1px solid #e5e7eb"
  },

  th: {
    textAlign: "left",
    padding: "14px",
    fontWeight: "600",
    color: "#374151"
  },

  td: {
    padding: "14px",
    borderBottom: "1px solid #f1f1f1"
  },

  tr: {
    transition: "0.2s"
  },

  empty: {
    textAlign: "center",
    padding: "20px",
    color: "gray"
  },

  deleteBtn: {
    background: "#ef4444",
    border: "none",
    padding: "6px 12px",
    color: "white",
    borderRadius: "5px",
    cursor: "pointer"
  },

  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },

  modal: {
    background: "white",
    padding: "25px",
    borderRadius: "10px",
    width: "350px",
    display: "flex",
    flexDirection: "column",
    gap: "10px"
  },

  modalInput: {
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "6px"
  },

  modalActions: {
    display: "flex",
    gap: "10px",
    marginTop: "10px"
  },

  saveBtn: {
    background: "#22c55e",
    color: "white",
    border: "none",
    padding: "8px 14px",
    borderRadius: "5px",
    cursor: "pointer"
  },

  cancelBtn: {
    background: "#6b7280",
    color: "white",
    border: "none",
    padding: "8px 14px",
    borderRadius: "5px",
    cursor: "pointer"
  },

  error: {
    color: "red",
    fontSize: "14px"
  },

  success: {
    color: "green",
    fontSize: "14px"
  }

};