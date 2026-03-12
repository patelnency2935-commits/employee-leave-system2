import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaUserPlus, FaSearch, FaEdit, FaTrash, FaSave, FaTimes, FaInbox, FaUserTie, FaBuilding, FaEnvelope } from "react-icons/fa";

function ManageEmployees() {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmployees();
    fetchMeta();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/employees");
      setEmployees(res.data);
    } catch (err) { 
      console.error("Fetch Error:", err); 
    } finally {
      setLoading(false);
    }
  };

  const fetchMeta = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/departments");
      setDepartments(res.data);
    } catch (err) { console.error(err); }
  };

  const deleteEmployee = async (id) => {
    if (!window.confirm("🔴 Warning: Removing this employee will also delete their leave history. Proceed?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/employees/${id}`);
      alert("Employee profile removed successfully. ✅");
      fetchEmployees();
    } catch (err) { 
        console.error(err); 
        alert("Failed to remove employee.");
    }
  };

  const startEdit = (emp) => {
    setEditId(emp._id);
    setEditData(emp);
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditData({});
  };

  const saveEdit = async () => {
    try {
      await axios.put(`http://localhost:5000/api/employees/${editId}`, editData);
      alert("Employee details updated! 💾");
      setEditId(null);
      fetchEmployees();
    } catch (err) { 
        console.error(err); 
        alert("Failed to update details.");
    }
  };

  const filtered = employees.filter(emp =>
    emp.name?.toLowerCase().includes(search.toLowerCase()) || 
    emp.email?.toLowerCase().includes(search.toLowerCase()) ||
    emp.department?.toLowerCase().includes(search.toLowerCase())
  );

  const getInitialsColor = (name) => {
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];
    const index = (name?.charCodeAt(0) || 0) % colors.length;
    return colors[index];
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
          <h2 className="admin-section-title" style={{ margin: 0, fontSize: "24px" }}>👥 Workforce Directory</h2>
          <p style={{ margin: "5px 0 0 0", opacity: 0.6, fontSize: "14px" }}>Manage employee profiles, roles, and departmental access.</p>
        </div>
        
        <div style={{ display: "flex", gap: "15px" }}>
          <div style={{ position: "relative" }}>
            <FaSearch style={{ position: "absolute", left: "15px", top: "14px", opacity: 0.3, color: "#2563eb" }} />
            <input
              style={{ 
                  padding: "12px 15px 12px 40px", 
                  borderRadius: "12px", 
                  border: "1px solid #e2e8f0", 
                  width: "300px",
                  outline: "none",
                  fontSize: "14px",
                  background: "#f8fafc",
                  transition: "0.2s"
              }}
              className="search-input-hover"
              placeholder="Search by name, email or dept..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="admin-table-container" style={{ border: "1px solid #f1f5f9", borderRadius: "16px", overflow: "visible" }}>
        <table className="admin-table">
          <thead>
            <tr style={{ background: "#f8fafc" }}>
              <th style={{ padding: "18px 24px" }}><FaUserTie style={{ marginRight: "8px" }} /> Employee Profile</th>
              <th style={{ padding: "18px 24px" }}><FaBuilding style={{ marginRight: "8px" }} /> Role & Placement</th>
              <th style={{ padding: "18px 24px" }}><FaEnvelope style={{ marginRight: "8px" }} /> Contact Details</th>
              <th style={{ padding: "18px 24px" }}>Account Status</th>
              <th style={{ padding: "18px 24px", textAlign: "right" }}>Action Center</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
                <tr><td colSpan="5" style={{ textAlign: "center", padding: "60px", color: "#64748b" }}>Synchronizing directory...</td></tr>
            ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center", padding: "80px" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", opacity: 0.4 }}>
                        <FaInbox style={{ fontSize: "40px" }} />
                        <p style={{ fontWeight: "700" }}>No staff members found matching your search.</p>
                    </div>
                  </td>
                </tr>
            ) : (
              filtered.map(emp => (
                <tr key={emp._id} style={{ transition: "0.2s" }}>
                  <td style={{ padding: "18px 24px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                       <div style={{ 
                           width: 42, 
                           height: 42, 
                           borderRadius: "14px", 
                           background: getInitialsColor(emp.name), 
                           display: "flex", 
                           alignItems: "center", 
                           justifyContent: "center", 
                           fontSize: "16px", 
                           fontWeight: "900", 
                           color: "#fff",
                           boxShadow: `0 4px 10px ${getInitialsColor(emp.name)}40`
                       }}>
                          {emp.name?.charAt(0)}
                       </div>
                       <div>
                          {editId === emp._id ? (
                            <input 
                                style={{ padding: "8px 12px", borderRadius: "8px", border: "2px solid #2563eb", outline: "none", fontSize: "14px", width: "160px" }} 
                                value={editData.name} 
                                onChange={e => setEditData({...editData, name: e.target.value})} 
                            />
                          ) : (
                            <div style={{ fontWeight: "800", color: "#1e293b", fontSize: "15px" }}>{emp.name}</div>
                          )}
                          <div style={{ fontSize: "11px", color: "#94a3b8", fontWeight: "700", textTransform: "uppercase", marginTop: "2px" }}>UID: {emp._id.slice(-8)}</div>
                       </div>
                    </div>
                  </td>
                  
                  <td style={{ padding: "18px 24px" }}>
                    {editId === emp._id ? (
                      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                         <input 
                            style={{ padding: "8px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", outline: "none", fontSize: "13px" }} 
                            value={editData.role} 
                            placeholder="Role"
                            onChange={e => setEditData({...editData, role: e.target.value})} 
                         />
                          <select 
                            style={{ padding: "8px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", outline: "none", fontSize: "13px", background: "white" }} 
                            value={editData.department} 
                            onChange={e => setEditData({...editData, department: e.target.value})}
                          >
                             {departments.map(d => <option key={d._id} value={d.name}>{d.name}</option>)}
                          </select>
                      </div>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                        <span style={{ 
                            padding: "4px 10px", 
                            borderRadius: "8px", 
                            background: "#f1f5f9", 
                            color: "#475569", 
                            fontSize: "11px", 
                            fontWeight: "800",
                            alignSelf: "flex-start",
                            textTransform: "uppercase",
                            letterSpacing: "0.02em"
                        }}>{emp.role || "Staff"}</span>
                        <div style={{ fontSize: "13px", color: "#64748b", fontWeight: "600", paddingLeft: "4px" }}>{emp.department || "General"}</div>
                      </div>
                    )}
                  </td>

                  <td style={{ padding: "18px 24px" }}>
                     {editId === emp._id ? (
                       <input 
                          style={{ padding: "8px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", outline: "none", fontSize: "13px", width: "100%" }} 
                          value={editData.email} 
                          onChange={e => setEditData({...editData, email: e.target.value})} 
                       />
                     ) : (
                        <div style={{ color: "#334155", fontWeight: "500", fontSize: "14px" }}>{emp.email}</div>
                     )}
                  </td>

                  <td style={{ padding: "18px 24px" }}>
                     <span className="badge badge-green" style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                        <div style={{ width: 6, height: 6, borderRadius: "50%", background: "currentColor" }}></div>
                        Active
                     </span>
                  </td>

                  <td style={{ padding: "18px 24px", textAlign: "right" }}>
                    <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                        {editId === emp._id ? (
                            <>
                                <button title="Save Changes" onClick={saveEdit} style={{ 
                                    width: 36, height: 36, borderRadius: "10px", background: "#2563eb", color: "#fff", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" 
                                }} className="action-btn-hover"><FaSave /></button>
                                <button title="Cancel Edit" onClick={cancelEdit} style={{ 
                                    width: 36, height: 36, borderRadius: "10px", background: "#f1f5f9", color: "#64748b", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" 
                                }} className="action-btn-hover"><FaTimes /></button>
                            </>
                        ) : (
                            <>
                                <button title="Edit Profile" onClick={() => startEdit(emp)} style={{ 
                                    width: 36, height: 36, borderRadius: "10px", background: "#eff6ff", color: "#2563eb", border: "1px solid #dbeafe", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" 
                                }} className="action-btn-hover"><FaEdit /></button>
                                <button title="Delete Profile" onClick={() => deleteEmployee(emp._id)} style={{ 
                                    width: 36, height: 36, borderRadius: "10px", background: "#fff1f2", color: "#e11d48", border: "1px solid #fee2e2", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" 
                                }} className="action-btn-hover"><FaTrash /></button>
                            </>
                        )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <style>{`
        .search-input-hover:focus { border-color: #2563eb !important; box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1); background: #fff !important; }
        .action-btn-hover { transition: 0.2s; }
        .action-btn-hover:hover { transform: translateY(-3px); box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
      `}</style>
    </div>
  );
}

export default ManageEmployees;