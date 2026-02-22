import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
} from "recharts";

export default function Reports() {
  const [leaves, setLeaves] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("leaves")) || [];
    setLeaves(stored);
  }, []);

  // Date Filter
  const filteredLeaves = leaves.filter((leave) => {
    if (!fromDate || !toDate) return true;
    return (
      new Date(leave.from) >= new Date(fromDate) &&
      new Date(leave.to) <= new Date(toDate)
    );
  });

  // Only Approved Leaves
  const approvedLeaves = filteredLeaves.filter(
    (leave) => leave.status === "Approved"
  );

  const totalLeaves = approvedLeaves.length;

  // Employees on Leave Today
  const today = new Date();
  const employeesToday = approvedLeaves.filter((leave) => {
    const start = new Date(leave.from);
    const end = new Date(leave.to);
    return today >= start && today <= end;
  }).length;

  // Leave Type Count
  const typeCount = {};
  approvedLeaves.forEach((leave) => {
    const type = leave.type || "Other";
    typeCount[type] = (typeCount[type] || 0) + 1;
  });

  const typeData = Object.keys(typeCount).map((key) => ({
    name: key,
    value: typeCount[key],
  }));

  const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#3b82f6"];

  // Department Count
  const deptCount = {};
  approvedLeaves.forEach((leave) => {
    const dept = leave.department || "Unknown";
    deptCount[dept] = (deptCount[dept] || 0) + 1;
  });

  const departmentData = Object.keys(deptCount).map((key) => ({
    name: key,
    leaves: deptCount[key],
  }));

  // Monthly Trend
  const monthCount = {};
  approvedLeaves.forEach((leave) => {
    const month = new Date(leave.from).toLocaleString("default", {
      month: "short",
    });
    monthCount[month] = (monthCount[month] || 0) + 1;
  });

  const monthlyTrend = Object.keys(monthCount).map((key) => ({
    month: key,
    leaves: monthCount[key],
  }));

  const exportCSV = () => {
    const csv = approvedLeaves
      .map(
        (l) =>
          `${l.name},${l.type},${l.department},${l.from},${l.to},${l.status}`
      )
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "leave-report.csv";
    link.click();
  };

  return (
    <div style={styles.wrapper}>
      <h1 style={styles.heading}>📊 Reports & Analytics</h1>

      {/* Date Filter */}
      <div style={styles.card}>
        <h3 style={styles.cardTitle}>Custom Date Range</h3>
        <div style={styles.row}>
          <input
            style={styles.input}
            type="date"
            onChange={(e) => setFromDate(e.target.value)}
          />
          <input
            style={styles.input}
            type="date"
            onChange={(e) => setToDate(e.target.value)}
          />
          <button style={styles.primaryBtn} onClick={exportCSV}>
            Export to CSV
          </button>
        </div>
      </div>

      {/* Leave Summary */}
      <div style={styles.card}>
        <h3 style={styles.cardTitle}>Employee Leave Summary</h3>
        <div style={styles.summaryBox}>
          <div style={styles.summaryItem}>
            <p style={styles.summaryLabel}>Total Approved Leaves</p>
            <h2 style={styles.summaryValue}>{totalLeaves}</h2>
          </div>
          <div style={styles.summaryItem}>
            <p style={styles.summaryLabel}>Employees on Leave Today</p>
            <h2 style={styles.summaryValue}>{employeesToday}</h2>
          </div>
        </div>
      </div>

      {/* Leave Type Usage */}
      <div style={styles.card}>
        <h3 style={styles.cardTitle}>Leave Type Usage</h3>
        <div style={styles.chartContainer}>
          <PieChart width={300} height={250}>
            <Pie data={typeData} dataKey="value" outerRadius={80} label>
              {typeData.map((entry, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </div>
      </div>

      {/* Department Report */}
      <div style={styles.card}>
        <h3 style={styles.cardTitle}>Department-wise Report</h3>
        <div style={styles.chartContainer}>
          <BarChart width={450} height={250} data={departmentData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="leaves" fill="#2563eb" radius={[6, 6, 0, 0]} />
          </BarChart>
        </div>
      </div>

      {/* Monthly Trend */}
      <div style={styles.card}>
        <h3 style={styles.cardTitle}>Leave Trend</h3>
        <div style={styles.chartContainer}>
          <LineChart width={450} height={250} data={monthlyTrend}>
            <XAxis dataKey="month" />
            <YAxis />
            <CartesianGrid stroke="#e5e7eb" />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="leaves"
              stroke="#f97316"
              strokeWidth={3}
            />
          </LineChart>
        </div>
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
    boxShadow: "0 15px 40px rgba(0,0,0,0.05)",
    border: "1px solid #f1f5f9",
  },
  cardTitle: {
    fontSize: "18px",
    fontWeight: "600",
    marginBottom: "20px",
    color: "#0f172a",
  },
  row: {
    display: "flex",
    gap: "15px",
    alignItems: "center",
    flexWrap: "wrap",
  },
  input: {
    padding: "10px 14px",
    borderRadius: "10px",
    border: "1px solid #e2e8f0",
    fontSize: "14px",
    outline: "none",
  },
  primaryBtn: {
    background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
    color: "#ffffff",
    padding: "10px 18px",
    border: "none",
    borderRadius: "10px",
    fontWeight: "600",
    cursor: "pointer",
    boxShadow: "0 6px 15px rgba(37,99,235,0.3)",
  },
  summaryBox: {
    display: "flex",
    gap: "40px",
    flexWrap: "wrap",
  },
  summaryItem: {
    background: "#f1f5f9",
    padding: "20px 30px",
    borderRadius: "14px",
    minWidth: "200px",
  },
  summaryLabel: {
    color: "#64748b",
    fontSize: "14px",
  },
  summaryValue: {
    marginTop: "5px",
    color: "#0f172a",
  },
  chartContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
};
