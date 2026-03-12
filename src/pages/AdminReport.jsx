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
  CartesianGrid
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

    fetch("http://localhost:5000/api/leaves")

      .then((res) => res.json())

      .then((leaves) => {

        const typeCounts = {};
        const statusCounts = {};

        leaves.forEach((leave) => {

          typeCounts[leave.type] =
            (typeCounts[leave.type] || 0) + 1;

          statusCounts[leave.status] =
            (statusCounts[leave.status] || 0) + 1;

        });

        const formattedTypeData =
          Object.keys(typeCounts).map((key) => ({

            name: key,
            value: typeCounts[key]

          }));

        const formattedStatusData =
          Object.keys(statusCounts).map((key) => ({

            status: key,
            count: statusCounts[key]

          }));

        setLeaveTypeData(formattedTypeData);
        setStatusData(formattedStatusData);

        setSummary({
          total: leaves.length,
          approved: statusCounts["approved"] || 0,
          pending: statusCounts["pending"] || 0,
          rejected: statusCounts["rejected"] || 0
        });

      });

  }, []);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (

    <div style={{
      padding: "40px",
      backgroundColor: "#f4f6f9",
      minHeight: "100vh"
    }}>

      <h2>Admin Analytics Dashboard</h2>

      <div style={{
        display: "flex",
        gap: "20px",
        marginBottom: "40px"
      }}>

        <div style={{
          background: "#2196F3",
          padding: "20px",
          color: "white",
          borderRadius: "10px"
        }}>
          <h4>Total Leaves</h4>
          <h2>{summary.total}</h2>
        </div>

        <div style={{
          background: "#4CAF50",
          padding: "20px",
          color: "white",
          borderRadius: "10px"
        }}>
          <h4>Approved</h4>
          <h2>{summary.approved}</h2>
        </div>

        <div style={{
          background: "#FF9800",
          padding: "20px",
          color: "white",
          borderRadius: "10px"
        }}>
          <h4>Pending</h4>
          <h2>{summary.pending}</h2>
        </div>

        <div style={{
          background: "#F44336",
          padding: "20px",
          color: "white",
          borderRadius: "10px"
        }}>
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

        <div style={{
          background: "white",
          padding: "20px",
          borderRadius: "10px"
        }}>

          <h3>Leave Types Distribution</h3>

          <PieChart width={350} height={300}>

            <Pie
              data={leaveTypeData}
              dataKey="value"
              nameKey="name"
              outerRadius={100}
              label
            >

              {leaveTypeData.map((entry, index) => (

                <Cell
                  key={index}
                  fill={COLORS[index % COLORS.length]}
                />

              ))}

            </Pie>

            <Tooltip />
            <Legend />

          </PieChart>

        </div>

        <div style={{
          background: "white",
          padding: "20px",
          borderRadius: "10px"
        }}>

          <h3>Leave Status Overview</h3>

          <BarChart
            width={400}
            height={300}
            data={statusData}
          >

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