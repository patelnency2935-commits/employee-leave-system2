import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaDownload, FaChartBar, FaTable, FaFileAlt, FaInfoCircle } from "react-icons/fa";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function Reports() {
  const [stats, setStats] = useState({ departmentStats: [], monthlyStats: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/reports/stats");
      setStats(res.data);
    } catch (err) {
      console.error("Fetch Stats Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const downloadCSV = () => {
    const headers = ["Department Name", "Leave Count"];
    const rows = stats.departmentStats.map((d) => [`"${d._id}"`, d.count]);
    let csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n" + rows.map((e) => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `leave_report_${new Date().toLocaleDateString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const COLORS = ['#2563eb', '#3b82f6', '#60a5fa', '#93c5fd', '#dbeafe'];

  return (
    <div className="admin-section" style={{ 
        minHeight: "80vh", 
        borderRadius: "16px", 
        border: "1px solid #e2e8f0", 
        boxShadow: "0 10px 25px -5px rgba(0,0,0,0.05)",
        background: "#fff"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px" }}>
        <div>
          <h2 className="admin-section-title" style={{ margin: 0, fontSize: "24px" }}>📊 Analytics & Insights</h2>
          <p style={{ margin: "5px 0 0 0", opacity: 0.6, fontSize: "14px" }}>Visual representation of leave trends across various departments.</p>
        </div>
        <button 
          onClick={downloadCSV}
          disabled={loading || stats.departmentStats.length === 0}
          style={{ 
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "12px 24px", 
            background: "#2563eb", 
            color: "#fff", 
            border: "none", 
            borderRadius: "12px", 
            fontWeight: "bold", 
            cursor: "pointer",
            transition: "0.2s",
            boxShadow: "0 4px 12px rgba(37, 99, 235, 0.2)"
          }}
          className="btn-hover-effect"
        >
          <FaDownload /> Export CSV Report
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 350px", gap: "30px", marginBottom: "40px" }}>
        {/* Chart Card */}
        <div style={{ 
            background: "#f8fafc", 
            padding: "30px", 
            borderRadius: "20px", 
            border: "1px solid #e2e8f0",
            minHeight: "400px"
        }}>
          <h3 style={{ margin: "0 0 25px 0", fontSize: "16px", color: "#1e293b", display: "flex", alignItems: "center", gap: "10px" }}>
            <FaChartBar style={{ color: "#2563eb" }} /> Department-wise Leave Distribution
          </h3>
          
          {loading ? (
             <div style={{ height: "300px", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b" }}>
                Pulsing analytics engine...
             </div>
          ) : stats.departmentStats.length === 0 ? (
             <div style={{ height: "300px", display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8" }}>
                Insufficient data to generate chart.
             </div>
          ) : (
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={stats.departmentStats}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="_id" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip 
                    cursor={{ fill: '#f1f5f9' }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]} barSize={40}>
                  {stats.departmentStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Info Card */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={{ background: "#eff6ff", padding: "24px", borderRadius: "16px", border: "1px solid #dbeafe" }}>
                <h4 style={{ margin: "0 0 10px 0", color: "#1e40af", fontSize: "15px", display: "flex", alignItems: "center", gap: "8px" }}>
                    <FaInfoCircle /> Quick Insight
                </h4>
                <p style={{ margin: 0, fontSize: "13px", color: "#1e40af", opacity: 0.8, lineHeight: "1.6" }}>
                    The data above shows cumulative leave requests. Departments with higher counts might require resource optimization or workload review.
                </p>
            </div>
            
            <div style={{ background: "#fff", padding: "24px", borderRadius: "16px", border: "1px solid #e2e8f0", flex: 1 }}>
                <h4 style={{ margin: "0 0 15px 0", color: "#1e293b", fontSize: "15px" }}>Summary Metrics</h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {stats.departmentStats.slice(0, 3).map((d, i) => (
                        <div key={d._id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span style={{ fontSize: "13px", color: "#64748b", fontWeight: "600" }}>{d._id}</span>
                            <span style={{ fontSize: "14px", color: "#1e293b", fontWeight: "800" }}>{d.count} reqs</span>
                        </div>
                    ))}
                    {stats.departmentStats.length === 0 && <p style={{ fontSize: "13px", color: "#94a3b8" }}>No records yet.</p>}
                </div>
            </div>
        </div>
      </div>

      <div className="admin-table-container" style={{ border: "1px solid #f1f5f9", borderRadius: "16px" }}>
        <h3 style={{ padding: "20px 24px", margin: 0, fontSize: "16px", background: "#f8fafc", borderBottom: "1px solid #f1f5f9", borderRadius: "16px 16px 0 0", display: "flex", alignItems: "center", gap: "10px" }}>
            <FaTable style={{ color: "#64748b" }} /> Detailed Breakdown
        </h3>
        <table className="admin-table">
          <thead>
            <tr>
              <th style={{ padding: "15px 24px" }}>Department Name</th>
              <th style={{ padding: "15px 24px" }}>Total Leave Requests</th>
              <th style={{ padding: "15px 24px" }}>Growth Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
                <tr><td colSpan="3" style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>Loading detailed distribution...</td></tr>
            ) : stats.departmentStats.length === 0 ? (
                <tr><td colSpan="3" style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>No data points available.</td></tr>
            ) : (
                stats.departmentStats.map((d) => (
                <tr key={d._id}>
                    <td style={{ padding: "15px 24px", fontWeight: "700", color: "#1e293b" }}>{d._id}</td>
                    <td style={{ padding: "15px 24px" }}>
                        <span style={{ background: "#f1f5f9", padding: "6px 12px", borderRadius: "20px", fontWeight: "800", color: "#475569" }}>{d.count}</span>
                    </td>
                    <td style={{ padding: "15px 24px" }}>
                        <span style={{ color: "#10b981", fontSize: "12px", fontWeight: "700" }}>● Active Tracking</span>
                    </td>
                </tr>
              )))}
          </tbody>
        </table>
      </div>
      <style>{`
        .btn-hover-effect:hover { transform: translateY(-2px); box-shadow: 0 6px 15px rgba(37, 99, 235, 0.3); }
        .btn-hover-effect:active { transform: translateY(0); }
      `}</style>
    </div>
  );
}
