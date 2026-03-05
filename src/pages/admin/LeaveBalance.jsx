import React, { useState, useEffect } from "react";

function LeaveBalance() {

  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("All");
  const [showHolidayModal, setShowHolidayModal] = useState(false);

  const [holidayForm, setHolidayForm] = useState({
    title: "",
    date: ""
  });

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  useEffect(() => {

    const storedEmployees = JSON.parse(localStorage.getItem("employees")) || [];
    setEmployees(storedEmployees);

  }, []);

  const filteredEmployees = employees.filter((emp) => {

    const matchSearch = emp.name?.toLowerCase().includes(search.toLowerCase());
    const matchDept = department === "All" || emp.department === department;

    return matchSearch && matchDept;

  });

  const departments = [...new Set(employees.map(emp => emp.department))];

  const handleHolidayChange = (e) => {

    setHolidayForm({
      ...holidayForm,
      [e.target.name]: e.target.value
    });

  };

  const addHoliday = () => {

    if (!holidayForm.title || !holidayForm.date) return;

    const holidays = JSON.parse(localStorage.getItem("holidays")) || [];

    const newHoliday = {
      id: Date.now(),
      ...holidayForm
    };

    const updated = [...holidays, newHoliday];

    localStorage.setItem("holidays", JSON.stringify(updated));

    setShowHolidayModal(false);

    setHolidayForm({
      title: "",
      date: ""
    });

    alert("Holiday Added Successfully");

  };

  const openReview = (emp) => {
    setSelectedEmployee(emp);
    setShowReviewModal(true);
  };

  const approveLeave = () => {
    alert("Leave Approved");
    setShowReviewModal(false);
  };

  const rejectLeave = () => {
    alert("Leave Rejected");
    setShowReviewModal(false);
  };

  return (

    <div style={styles.container}>

      <h2 style={styles.title}>Leave Balance</h2>

      <div style={styles.topBar}>

        <input
          placeholder="Search employee..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.search}
        />

        <select
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          style={styles.select}
        >

          <option value="All">All Departments</option>

          {departments.map((dept, index) => (
            <option key={index}>{dept}</option>
          ))}

        </select>

        <button
          style={styles.holidayBtn}
          onClick={() => setShowHolidayModal(true)}
        >
          Add Holiday
        </button>

      </div>

      <div style={styles.card}>

        <table style={styles.table}>

          <thead>

            <tr style={styles.headerRow}>
              <th style={styles.th}>Employee</th>
              <th style={styles.th}>Department</th>
              <th style={styles.th}>Sick</th>
              <th style={styles.th}>Casual</th>
              <th style={styles.th}>Paid</th>
              <th style={styles.th}>History</th>
              <th style={styles.th}>Review</th>
            </tr>

          </thead>

          <tbody>

            {filteredEmployees.length === 0 ? (
              <tr>
                <td colSpan="7" style={styles.empty}>
                  No Employees Found
                </td>
              </tr>
            ) : (
              filteredEmployees.map((emp) => (

                <tr key={emp.id}>

                  <td style={styles.td}>{emp.name}</td>
                  <td style={styles.td}>{emp.department}</td>
                  <td style={styles.td}>{emp.sick || 0}</td>
                  <td style={styles.td}>{emp.casual || 0}</td>
                  <td style={styles.td}>{emp.paid || 0}</td>
                  <td style={styles.td}>{emp.history || 0}</td>

                  <td style={styles.td}>
                    <button
                      style={styles.reviewBtn}
                      onClick={() => openReview(emp)}
                    >
                      Review
                    </button>
                  </td>

                </tr>

              ))
            )}

          </tbody>

        </table>

      </div>

      {/* Holiday Modal */}

      {showHolidayModal && (

        <div style={styles.modalOverlay}>

          <div style={styles.modal}>

            <h3>Add Holiday</h3>

            <input
              placeholder="Holiday Title"
              name="title"
              value={holidayForm.title}
              onChange={handleHolidayChange}
              style={styles.modalInput}
            />

            <input
              type="date"
              name="date"
              value={holidayForm.date}
              onChange={handleHolidayChange}
              style={styles.modalInput}
            />

            <div style={styles.modalButtons}>

              <button style={styles.saveBtn} onClick={addHoliday}>
                Save
              </button>

              <button
                style={styles.cancelBtn}
                onClick={() => setShowHolidayModal(false)}
              >
                Cancel
              </button>

            </div>

          </div>

        </div>

      )}

      {/* Leave Review Modal */}

      {showReviewModal && selectedEmployee && (

        <div style={styles.modalOverlay}>

          <div style={styles.modal}>

            <h3>Leave Review</h3>

            <p><b>Employee :</b> {selectedEmployee.name}</p>
            <p><b>Department :</b> {selectedEmployee.department}</p>
            <p><b>Sick Leave :</b> {selectedEmployee.sick || 0}</p>
            <p><b>Casual Leave :</b> {selectedEmployee.casual || 0}</p>
            <p><b>Paid Leave :</b> {selectedEmployee.paid || 0}</p>

            <div style={styles.modalButtons}>

              <button style={styles.saveBtn} onClick={approveLeave}>
                Approve
              </button>

              <button style={styles.cancelBtn} onClick={rejectLeave}>
                Reject
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default LeaveBalance;

const styles = {

  container: {
    padding: "30px",
    background: "#f4f6f9",
    minHeight: "100vh"
  },

  title: {
    fontSize: "28px",
    marginBottom: "20px"
  },

  topBar: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px"
  },

  search: {
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    width: "220px"
  },

  select: {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc"
  },

  holidayBtn: {
    background: "#22c55e",
    color: "white",
    border: "none",
    padding: "10px 18px",
    borderRadius: "6px",
    cursor: "pointer"
  },

  reviewBtn: {
    background: "#2563eb",
    color: "white",
    border: "none",
    padding: "6px 12px",
    borderRadius: "5px",
    cursor: "pointer"
  },

  card: {
    background: "white",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.08)"
  },

  table: {
    width: "100%",
    borderCollapse: "collapse"
  },

  headerRow: {
    background: "#f1f5f9"
  },

  th: {
    padding: "12px",
    textAlign: "left"
  },

  td: {
    padding: "12px",
    borderTop: "1px solid #eee"
  },

  empty: {
    textAlign: "center",
    padding: "20px",
    color: "gray"
  },

  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.4)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },

  modal: {
    background: "white",
    padding: "25px",
    borderRadius: "10px",
    width: "320px",
    display: "flex",
    flexDirection: "column",
    gap: "10px"
  },

  modalInput: {
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "6px"
  },

  modalButtons: {
    display: "flex",
    gap: "10px",
    marginTop: "10px"
  },

  saveBtn: {
    background: "#22c55e",
    color: "white",
    border: "none",
    padding: "8px 12px",
    borderRadius: "5px",
    cursor: "pointer"
  },

  cancelBtn: {
    background: "#ef4444",
    color: "white",
    border: "none",
    padding: "8px 12px",
    borderRadius: "5px",
    cursor: "pointer"
  }

};