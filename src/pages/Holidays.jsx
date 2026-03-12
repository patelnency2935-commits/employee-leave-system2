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

    const typeMatch = filterType === "All" || h.type === filterType;

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
          {viewMode === "monthly" ? "📆 Monthly View" : "📅 Yearly View"}
        </h3>

        {filtered.length === 0 && (
          <p style={styles.empty}>No holidays found</p>
        )}

        {filtered.map((holiday) => (
          <div key={holiday.id} style={styles.row}>
            <div>
              <strong style={styles.holidayName}>{holiday.name}</strong>

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
    padding: "40px",
    background: "#f5f7fb",
    minHeight: "100vh",
  },

  heading: {
    fontSize: "26px",
    fontWeight: "600",
    marginBottom: "25px",
    color: "#1e293b",
  },

  card: {
    background: "#ffffff",
    padding: "28px",
    marginTop: "20px",
    borderRadius: "14px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
  },

  cardTitle: {
    fontSize: "17px",
    fontWeight: "600",
    color: "#0f172a",
    marginBottom: "8px",
  },

  input: {
    padding: "10px 12px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    fontSize: "14px",
    outline: "none",
    background: "#fafafa",
  },

  buttonRow: {
    display: "flex",
    gap: "10px",
    marginTop: "5px",
  },

  activeBtn: {
    background: "#0f172a",
    color: "#ffffff",
    padding: "9px 18px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
  },

  secondaryBtn: {
    background: "#e5e7eb",
    color: "#111827",
    padding: "9px 18px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "500",
  },

  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 0",
    borderBottom: "1px solid #f1f5f9",
  },

  holidayName: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#111827",
  },

  dateText: {
    fontSize: "14px",
    margin: "4px 0",
    color: "#6b7280",
  },

  meta: {
    fontSize: "12px",
    color: "#9ca3af",
  },

  deleteBtn: {
    background: "#ef4444",
    color: "white",
    border: "none",
    padding: "8px 14px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
  },

  empty: {
    textAlign: "center",
    padding: "20px",
    color: "#9ca3af",
    fontSize: "14px",
  },
};
