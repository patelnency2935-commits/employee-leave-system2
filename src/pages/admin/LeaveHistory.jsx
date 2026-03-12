import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaSearch, FaFilter, FaCheck, FaTimes, FaTrash, FaUserCircle, FaCalendarAlt, FaInfoCircle, FaInbox, FaUserSecret } from "react-icons/fa";

function LeaveHistory() {
  const [leaves, setLeaves] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/leaves");
      setLeaves(Array.isArray(res.data) ? res.data : (res.data.leaves || []));
    } catch (err) {
      console.error("Fetch leaves error:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    const confirmMsg = status === "approved" ? "Approve this leave request?" : "Reject this leave request?";
    if (!window.confirm(confirmMsg)) return;

    try {
      const res = await axios.put(`http://localhost:5000/api/leaves/${id}`, { status });
      console.log("Update Success:", res.data);
      fetchLeaves();
      window.dispatchEvent(new Event("adminLeaveUpdated"));
    } catch (error) {
      console.error("Update status error:", error);
      const backendError = error.response?.data?.message || error.message || "Failed to communicate with server";
      alert(`⚠️ ERROR: ${backendError}`);
    }
  };

  const deleteLeave = async (id) => {
    if (!window.confirm("🔴 Delete this record permanently from history?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/leaves/${id}`);
      fetchLeaves();
      window.dispatchEvent(new Event("adminLeaveUpdated"));
    } catch (error) {
      console.error("Delete request error:", error);
      alert("Failed to delete record.");
    }
  };

  const filteredLeaves = leaves.filter((leave) => {
    const employeeName = leave.employee?.name || "Deleted User";
    const matchSearch = employeeName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "" || leave.status?.toLowerCase() === statusFilter;
    return matchSearch && matchStatus;
  });

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved': return '#10b981';
      case 'rejected': return '#ef4444';
      case 'pending': return '#f59e0b';
      default: return '#64748b';
    }
  };

  return (
    <div className="admin-section" style={{ 
        minHeight: "80vh", 
        borderRadius: "20px", 
        boxShadow: "0 10px 40px -10px rgba(0,0,0,0.05)",
        background: "#fff",
        border: "1px solid #e2e8f0"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "35px" }}>
        <div>
          <h2 className="admin-section-title" style={{ margin: 0, fontSize: "24px" }}>📋 Leave Consolidation</h2>
          <p style={{ margin: "5px 0 0 0", opacity: 0.6, fontSize: "14px" }}>Manage the flow of leave requests and maintain organizational capacity.</p>
        </div>
        
        <div style={{ display: "flex", gap: "10px" }}>
          <div style={{ position: "relative" }}>
            <FaSearch style={{ position: "absolute", left: "14px", top: "14px", opacity: 0.3, color: "#2563eb" }} />
            <input
              style={{ 
                  padding: "12px 15px 12px 40px", 
                  borderRadius: "12px", 
                  border: "1px solid #e2e8f0", 
                  width: "250px",
                  outline: "none",
                  fontSize: "14px",
                  background: "#f8fafc"
              }}
              placeholder="Search employee..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <select
            style={{ 
                padding: "12px 15px", 
                borderRadius: "12px", 
                border: "1px solid #e2e8f0", 
                outline: "none",
                fontSize: "14px",
                background: "white",
                cursor: "pointer"
            }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="pending">⏳ Pending Only</option>
            <option value="approved">✅ Approved</option>
            <option value="rejected">❌ Rejected</option>
          </select>
        </div>
      </div>

      <div className="admin-table-container" style={{ border: "1px solid #f1f5f9", borderRadius: "16px" }}>
        <table className="admin-table">
          <thead>
            <tr style={{ background: "#f8fafc" }}>
              <th style={{ padding: "18px 20px" }}>Requesting Staff</th>
              <th style={{ padding: "18px 20px" }}>Leave Category</th>
              <th style={{ padding: "18px 20px" }}><FaCalendarAlt style={{marginRight: 6}}/> Schedule</th>
              <th style={{ padding: "18px 20px" }}><FaInfoCircle style={{marginRight: 6}}/> Reason / Narrative</th>
              <th style={{ padding: "18px 20px", textAlign: "center" }}>Status</th>
              <th style={{ padding: "18px 20px", textAlign: "right" }}>Process</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
                <tr><td colSpan="6" style={{ textAlign: "center", padding: "60px", color: "#64748b" }}>Processing request queue...</td></tr>
            ) : filteredLeaves.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center", padding: "100px" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", opacity: 0.3 }}>
                        <FaInbox style={{ fontSize: "40px" }} />
                        <h3 style={{ margin: 0 }}>Queue is clear!</h3>
                        <p style={{ fontSize: "14px" }}>No applications found matching your current filters.</p>
                    </div>
                  </td>
                </tr>
            ) : (
              filteredLeaves.map((leave) => {
                const start = new Date(leave.startDate);
                const end = new Date(leave.endDate);
                const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
                const status = leave.status?.toLowerCase() || 'pending';
                const hasEmployee = !!leave.employee;

                return (
                  <tr key={leave._id}>
                    <td style={{ padding: "18px 20px" }}>
                       <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                          <div style={{ 
                              width: 36, height: 36, borderRadius: "50%", 
                              background: hasEmployee ? "#f1f5f9" : "#fff1f2", 
                              display: "flex", 
                              alignItems: "center", justifyContent: "center",
                              fontSize: "14px", fontWeight: "800", color: hasEmployee ? "#64748b" : "#e11d48"
                          }}>
                             {hasEmployee ? leave.employee?.name?.charAt(0) : <FaUserSecret />}
                          </div>
                          <div>
                            <div style={{fontWeight: "800", color: hasEmployee ? "#1e293b" : "#e11d48", fontSize: "14px"}}>
                                {hasEmployee ? leave.employee?.name : "Deleted Staff Account"}
                            </div>
                            <div style={{fontSize: "12px", color: "#94a3b8", fontWeight: "600"}}>
                                {hasEmployee ? (leave.employee?.department || "General") : "Historical Record"}
                            </div>
                          </div>
                       </div>
                    </td>
                    <td style={{ padding: "18px 20px" }}>
                       <span style={{ 
                           padding: "4px 10px", 
                           borderRadius: "6px", 
                           background: "#edf2ff", 
                           color: "#4c6ef5", 
                           fontSize: "11px", 
                           fontWeight: "800",
                           textTransform: "uppercase"
                       }}>{leave.type}</span>
                    </td>
                    <td style={{ padding: "18px 20px" }}>
                       <div style={{fontWeight: "800", fontSize: "15px", color: "#1e293b"}}>{days} <span style={{fontSize: "11px", opacity: 0.5}}>Days</span></div>
                       <div style={{fontSize: "11px", color: "#64748b", fontWeight: "600"}}>{start.toLocaleDateString(undefined, { month: 'short', day: 'numeric'})} – {end.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric'})}</div>
                    </td>
                    <td style={{ padding: "18px 20px" }}>
                        <div style={{ 
                            fontSize: "13px", 
                            color: "#64748b", 
                            maxWidth: "250px", 
                            lineHeight: "1.4",
                            fontStyle: "italic"
                        }}>
                           "{leave.reason}"
                        </div>
                    </td>
                    <td style={{ padding: "18px 20px", textAlign: "center" }}>
                       <span className={`badge badge-${status === "approved" ? "green" : status === "rejected" ? "red" : "yellow"}`}>
                          <span style={{ fontSize: "8px", marginRight: "6px" }}>●</span>
                          {status}
                       </span>
                    </td>
                    <td style={{ padding: "18px 20px", textAlign: "right" }}>
                      <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                        {status === "pending" ? (
                          <>
                            <button 
                                onClick={() => updateStatus(leave._id, "approved")}
                                style={{ 
                                    width: 34, height: 34, borderRadius: "8px", 
                                    background: "#10b981", color: "#fff", 
                                    border: "none", cursor: "pointer",
                                    display: "flex", alignItems: "center", justifyContent: "center"
                                }} className="action-btn" title="Approve Request">
                                <FaCheck />
                            </button>
                            <button 
                                onClick={() => updateStatus(leave._id, "rejected")}
                                style={{ 
                                    width: 34, height: 34, borderRadius: "8px", 
                                    background: "#ef4444", color: "#fff", 
                                    border: "none", cursor: "pointer",
                                    display: "flex", alignItems: "center", justifyContent: "center"
                                }} className="action-btn" title="Reject Request">
                                <FaTimes />
                            </button>
                          </>
                        ) : (
                          <button 
                            onClick={() => deleteLeave(leave._id)}
                            style={{ 
                                width: 34, height: 34, borderRadius: "8px", 
                                background: "#f1f5f9", color: "#64748b", 
                                border: "1px solid #e2e8f0", cursor: "pointer",
                                display: "flex", alignItems: "center", justifyContent: "center"
                            }} className="action-btn" title="Archive / Delete Record">
                            <FaTrash />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      <style>{`
         .action-btn { transition: 0.2s; }
         .action-btn:hover { transform: translateY(-2px); box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
      `}</style>
    </div>
  );
}

export default LeaveHistory;