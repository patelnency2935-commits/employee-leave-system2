import React, { useState, useEffect } from "react";

export default function Holidays() {
  const [holidays, setHolidays] = useState([]);
  const [viewMode, setViewMode] = useState("monthly");
  const [filterType, setFilterType] = useState("All");
  const [filterMonth, setFilterMonth] = useState("All");

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("holidays")) || [];
    setHolidays(stored);
  }, []);

  const saveData = (data) => {
    localStorage.setItem("holidays", JSON.stringify(data));
  };

  const deleteHoliday = (id) => {
    const updated = holidays.filter((h) => h.id !== id);
    setHolidays(updated);
    saveData(updated);
  };

  const filtered = holidays.filter((h) => {
    const monthMatch =
      filterMonth === "All" ||
      new Date(h.date).getMonth() + 1 === Number(filterMonth);

    const typeMatch =
      filterType === "All" || h.type === filterType;

    return monthMatch && typeMatch;
  });

  return (
    <div style={styles.wrapper}>
      <h1 style={styles.heading}>📅 Holiday Management</h1>

      {/* Filters */}
      <div style={styles.card}>
        <h3 style={styles.cardTitle}>Search & Filter</h3>

        <select
          style={styles.input}
          onChange={(e) => setFilterMonth(e.target.value)}
        >
          <option value="All">All Months</option>
          {[...Array(12)].map((_, i) => (
            <option key={i} value={i + 1}>
              Month {i + 1}
            </option>
          ))}
        </select>

        <select
          style={styles.input}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="All">All Types</option>
          <option>Public</option>
          <option>Optional</option>
          <option>Regional</option>
        </select>

        <div style={styles.buttonRow}>
          <button
            style={
              viewMode === "monthly"
                ? styles.activeBtn
                : styles.secondaryBtn
            }
            onClick={() => setViewMode("monthly")}
          >
            Monthly View
          </button>

          <button
            style={
              viewMode === "yearly"
                ? styles.activeBtn
                : styles.secondaryBtn
            }
            onClick={() => setViewMode("yearly")}
          >
            Yearly View
          </button>
        </div>
      </div>

      {/* Holiday List */}
      <div style={styles.card}>
        <h3 style={styles.cardTitle}>
          {viewMode === "monthly"
            ? "📆 Monthly View"
            : "📅 Yearly View"}
        </h3>

        {filtered.length === 0 && (
          <p style={styles.empty}>No holidays found</p>
        )}

        {filtered.map((holiday) => (
          <div key={holiday.id} style={styles.row}>
            <div>
              <strong style={styles.holidayName}>
                {holiday.name}
              </strong>
              <p style={styles.dateText}>{holiday.date}</p>
              <small style={styles.meta}>
                {holiday.type} | {holiday.region}
              </small>
            </div>

            <button
              style={styles.deleteBtn}
              onClick={() => deleteHoliday(holiday.id)}
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
    padding: "40px 60px",
    background: "linear-gradient(to right, #f8fafc, #eef2f7)",
    minHeight: "100vh",
  },

  heading: {
    fontSize: "28px",
    fontWeight: "600",
    marginBottom: "25px",
    color: "#1e293b",
  },

  card: {
    background: "#ffffff",
    padding: "30px 35px",
    marginTop: "25px",
    borderRadius: "18px",
    display: "grid",
    gap: "15px",
    boxShadow: "0 15px 40px rgba(0,0,0,0.05)",
    border: "1px solid #f1f5f9",
  },

  cardTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#0f172a",
  },

  input: {
    padding: "12px 14px",
    borderRadius: "10px",
    border: "1px solid #e2e8f0",
    fontSize: "14px",
    outline: "none",
    transition: "0.2s",
  },

  secondaryBtn: {
    background: "#e2e8f0",
    color: "#1e293b",
    padding: "10px 16px",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "500",
  },

  activeBtn: {
    background: "#0f172a",
    color: "white",
    padding: "10px 16px",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "600",
  },

  buttonRow: {
    display: "flex",
    gap: "10px",
  },

  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid #f1f5f9",
    padding: "15px 0",
  },

  holidayName: {
    fontSize: "15px",
    color: "#0f172a",
  },

  dateText: {
    margin: "4px 0",
    color: "#64748b",
  },

  meta: {
    color: "#94a3b8",
  },

  deleteBtn: {
    background: "linear-gradient(135deg, #ef4444, #dc2626)",
    color: "white",
    border: "none",
    padding: "8px 16px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "600",
    boxShadow: "0 6px 15px rgba(239,68,68,0.3)",
  },

  empty: {
    color: "#94a3b8",
    textAlign: "center",
    padding: "10px 0",
  },
};