import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaHistory, FaUserShield, FaClock, FaInfoCircle, FaSearch, FaFilter, FaInbox } from "react-icons/fa";

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/audit-logs");
      setLogs(res.data);
    } catch (err) {
      console.error("Log Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const getActionColor = (action) => {
    const act = action.toLowerCase();
    if (act.includes("delete") || act.includes("remove") || act.includes("reject")) return "#ef4444";
    if (act.includes("create") || act.includes("add") || act.includes("approve")) return "#10b981";
    if (act.includes("update") || act.includes("edit")) return "#3b82f6";
    return "#64748b";
  };

  const filteredLogs = logs.filter(log => 
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.details?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.performedBy.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-section" style={{ 
        minHeight: "80vh", 
        borderRadius: "20px", 
        boxShadow: "0 10px 30px -5px rgba(0,0,0,0.05)",
        border: "1px solid #e2e8f0"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
        <div>
          <h2 className="admin-section-title" style={{ margin: 0, fontSize: "24px" }}>📜 System Audit Logs</h2>
          <p style={{ margin: "5px 0 0 0", opacity: 0.6, fontSize: "14px" }}>Security trail of all administrative actions performed in the system.</p>
        </div>
        
        <div style={{ display: "flex", gap: "10px" }}>
            <div style={{ position: "relative" }}>
                <FaSearch style={{ position: "absolute", left: "15px", top: "14px", opacity: 0.3 }} />
                <input 
                    style={{ 
                        padding: "12px 15px 12px 40px", 
                        borderRadius: "12px", 
                        border: "1px solid #e2e8f0", 
                        width: "280px",
                        outline: "none",
                        fontSize: "14px"
                    }} 
                    placeholder="Search logs (Action, User, Details)..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <button onClick={fetchLogs} style={{ 
                padding: "10px 20px", 
                background: "#f1f5f9", 
                border: "1px solid #e2e8f0", 
                borderRadius: "12px", 
                cursor: "pointer",
                fontWeight: "600",
                display: "flex",
                alignItems: "center",
                gap: "8px"
            }}>
                <FaHistory style={{ color: "#2563eb" }} /> Refresh
            </button>
        </div>
      </div>
      
      {loading ? (
        <div style={{ padding: "100px 0", textAlign: "center" }}>
             <div className="pulsing-loader" style={{ marginBottom: "20px" }}>🔄</div>
             <p style={{ color: "#64748b", fontWeight: "600" }}>Securing logs...</p>
        </div>
      ) : filteredLogs.length === 0 ? (
        <div className="admin-empty" style={{ padding: "100px" }}>
          <FaInbox style={{ fontSize: "48px", marginBottom: "15px", opacity: 0.2 }} />
          <h3>No activity recorded yet</h3>
          <p>Actions like adding employees or managing departments will appear here.</p>
        </div>
      ) : (
        <div className="admin-table-container" style={{ background: "#fff", borderRadius: "16px", border: "1px solid #f1f5f9" }}>
          <table className="admin-table">
            <thead>
              <tr style={{ background: "#f8fafc" }}>
                <th style={{ padding: "18px 24px" }}><FaHistory /> Action</th>
                <th style={{ padding: "18px 24px" }}><FaUserShield /> User</th>
                <th style={{ padding: "18px 24px" }}><FaInfoCircle /> Details</th>
                <th style={{ padding: "18px 24px" }}><FaClock /> Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => (
                <tr key={log._id} style={{ transition: "0.2s" }}>
                  <td style={{ padding: "18px 24px" }}>
                    <span style={{ 
                        padding: "6px 12px", 
                        borderRadius: "8px", 
                        background: `${getActionColor(log.action)}15`, 
                        color: getActionColor(log.action),
                        fontWeight: "800",
                        fontSize: "12px",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        border: `1px solid ${getActionColor(log.action)}30`
                    }}>
                        {log.action}
                    </span>
                  </td>
                  <td style={{ padding: "18px 24px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: "14px", color: "#64748b" }}>
                            {log.performedBy.charAt(0)}
                        </div>
                        <span style={{ fontWeight: "700", color: "#1e293b" }}>{log.performedBy}</span>
                    </div>
                  </td>
                  <td style={{ padding: "18px 24px" }}>
                    <div style={{ maxWidth: "450px", color: "#64748b", fontSize: "14px", lineHeight: "1.5" }}>
                        {log.details || "System automated log entry"}
                    </div>
                  </td>
                  <td style={{ padding: "18px 24px" }}>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <span style={{ fontWeight: "600", fontSize: "14px", color: "#1e293b" }}>{new Date(log.timestamp).toLocaleDateString()}</span>
                        <span style={{ fontSize: "12px", color: "#94a3b8" }}>{new Date(log.timestamp).toLocaleTimeString()}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <style>{`
        .pulsing-loader {
            display: inline-block;
            font-size: 40px;
            animation: rotate 2s linear infinite;
        }
        @keyframes rotate {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
        .admin-table tbody tr:hover {
            background: #fafafa !important;
            transform: scale(1.002);
            box-shadow: 0 4px 12px rgba(0,0,0,0.02);
        }
      `}</style>
    </div>
  );
}
