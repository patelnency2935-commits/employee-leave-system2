import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

export default function AdminReport() {
  const [leaveTypeData, setLeaveTypeData] = useState([]);
  const [statusData, setStatusData] = useState([]);
  const [summary, setSummary] = useState({
    total: 0,
    approved: 0,
    pending: 0,
    rejected: 0
  });

  useEffect(() => {
    const leaves = JSON.parse(localStorage.getItem("leaves")) || [];

    const typeCounts = {};
    const statusCounts = {};

    leaves.forEach((leave) => {
      typeCounts[leave.type] = (typeCounts[leave.type] || 0) + 1;
      statusCounts[leave.status] = (statusCounts[leave.status] || 0) + 1;
    });

    const formattedTypeData = Object.keys(typeCounts).map((key) => ({
      name: key,
      value: typeCounts[key],
    }));

    const formattedStatusData = Object.keys(statusCounts).map((key) => ({
      status: key,
      count: statusCounts[key],
    }));

    setLeaveTypeData(formattedTypeData);
    setStatusData(formattedStatusData);

    // Summary Calculation
    const total = leaves.length;
    const approved = statusCounts["Approved"] || 0;
    const pending = statusCounts["Pending"] || 0;
    const rejected = statusCounts["Rejected"] || 0;

    setSummary({
      total,
      approved,
      pending,
      rejected
    });

  }, []);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  const cardStyle = (color) => ({
    flex: "1",
    minWidth: "180px",
    background: color,
    color: "white",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
    textAlign: "center"
  });

  return (
    <div style={{
      padding: "40px",
      backgroundColor: "#f4f6f9",
      minHeight: "100vh"
    }}>
      <h2 style={{ marginBottom: "30px" }}>
        Admin Analytics Dashboard
      </h2>

      {/* Summary Cards */}
      <div style={{
        display: "flex",
        gap: "20px",
        marginBottom: "40px",
        flexWrap: "wrap"
      }}>

        <div style={cardStyle("#2196F3")}>
          <h4>Total Leaves</h4>
          <h2>{summary.total}</h2>
        </div>

        <div style={cardStyle("#4CAF50")}>
          <h4>Approved</h4>
          <h2>{summary.approved}</h2>
        </div>

        <div style={cardStyle("#FF9800")}>
          <h4>Pending</h4>
          <h2>{summary.pending}</h2>
        </div>

        <div style={cardStyle("#F44336")}>
          <h4>Rejected</h4>
          <h2>{summary.rejected}</h2>
        </div>

      </div>

      <div style={{
        display: "flex",
        gap: "30px",
        flexWrap: "wrap",
        justifyContent: "center"
      }}>

        {/* Pie Chart */}
        <div style={{
          background: "white",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
        }}>
          <h3 style={{ textAlign: "center" }}>
            Leave Types Distribution
          </h3>

          <PieChart width={350} height={300}>
            <Pie
              data={leaveTypeData}
              dataKey="value"
              nameKey="name"
              outerRadius={100}
              label
            >
              {leaveTypeData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>

        {/* Bar Chart */}
        <div style={{
          background: "white",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
        }}>
          <h3 style={{ textAlign: "center" }}>
            Leave Status Overview
          </h3>

          <BarChart width={400} height={300} data={statusData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="status" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#4CAF50" />
          </BarChart>
        </div>

      </div>
    </div>
  );
}
