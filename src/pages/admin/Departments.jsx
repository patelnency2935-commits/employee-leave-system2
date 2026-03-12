import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaBuilding, FaTag, FaEdit, FaTrash, FaSearch, FaPlus, FaSave, FaExclamationCircle, FaInbox } from "react-icons/fa";

export default function Departments() {
  const [depts, setDepts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [form, setForm] = useState({ name: "", shortName: "", status: "Active" });
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [duplicateError, setDuplicateError] = useState("");

  useEffect(() => {
    fetchDepts();
  }, []);

  useEffect(() => {
    if (form.name && !editing) {
      const exists = depts.some(d => d.name.toLowerCase() === form.name.toLowerCase());
      if (exists) {
        setDuplicateError("This department already exists in the system.");
      } else {
        setDuplicateError("");
      }
    } else {
      setDuplicateError("");
    }
  }, [form.name, depts, editing]);

  const fetchDepts = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/departments");
      // Simulate slight delay for skeleton test if needed, but usually real fetch is fine
      setDepts(res.data);
    } catch (err) { 
      console.error("Fetch error:", err); 
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (duplicateError) return;
    if (!form.name || !form.shortName) return alert("Please fill all required fields");
    
    try {
      if (editing) {
        await axios.put(`http://localhost:5000/api/departments/${editing}`, form);
        alert("Department updated! ✅");
      } else {
        await axios.post("http://localhost:5000/api/departments", form);
        alert("Department added! 🚀");
      }
      setForm({ name: "", shortName: "", status: "Active" });
      setEditing(null);
      fetchDepts();
    } catch (err) { 
        console.error("Submit error:", err); 
        alert(err.response?.data?.error || "Error saving department");
    }
  };

  const deleteDept = async (id) => {
    if (!window.confirm("Remove this department? This might affect employee associations.")) return;
    try {
      await axios.delete(`http://localhost:5000/api/departments/${id}`);
      fetchDepts();
    } catch (err) { console.error(err); }
  };

  const editDept = (d) => {
    setEditing(d._id);
    setForm({ name: d.name, shortName: d.shortName, status: d.status || "Active" });
  };

  const cancelEdit = () => {
    setEditing(null);
    setForm({ name: "", shortName: "", status: "Active" });
  };

  const filteredDepts = depts.filter(d => 
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    d.shortName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const SkeletonRow = () => (
    <tr className="skeleton-row">
      <td style={{ padding: "20px" }}><div className="skeleton skeleton-text" style={{ width: "60px" }}></div></td>
      <td style={{ padding: "20px" }}><div className="skeleton skeleton-text" style={{ width: "150px" }}></div></td>
      <td style={{ padding: "20px" }}><div className="skeleton skeleton-text" style={{ width: "40px", margin: "0 auto" }}></div></td>
      <td style={{ padding: "20px" }}><div className="skeleton skeleton-text" style={{ width: "80px" }}></div></td>
      <td style={{ padding: "20px" }}><div className="skeleton skeleton-text" style={{ width: "100px" }}></div></td>
      <td style={{ padding: "20px" }}><div className="skeleton skeleton-text" style={{ width: "100px", float: "right" }}></div></td>
    </tr>
  );

  return (
    <div className="admin-section" style={{ minHeight: "80vh", border: "1px solid #e2e8f0", borderRadius: "16px", boxShadow: "0 10px 25px -5px rgba(0,0,0,0.05), 0 8px 10px -6px rgba(0,0,0,0.05)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
        <div>
          <h2 className="admin-section-title" style={{ margin: 0, fontSize: "22px" }}>🏢 Organization Structure</h2>
          <p style={{ margin: "5px 0 0 0", opacity: 0.6, fontSize: "14px" }}>Manage company departments and track headcount.</p>
        </div>
        <div style={{ position: "relative" }}>
             <FaSearch style={{ position: "absolute", left: "15px", top: "14px", opacity: 0.4, color: "#2563eb" }} />
             <input 
                style={{ 
                    padding: "12px 15px 12px 40px", 
                    borderRadius: "12px", 
                    border: "1px solid #e2e8f0", 
                    width: "280px",
                    outline: "none",
                    fontSize: "14px",
                    background: "#fff",
                    boxShadow: "inset 0 2px 4px rgba(0,0,0,0.02)"
                }} 
                placeholder="Search departments..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
             />
        </div>
      </div>
      
      <form onSubmit={handleSubmit} style={{ 
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        marginBottom: "40px", 
        background: "#f8fafc", 
        padding: "30px", 
        borderRadius: "16px",
        border: "1px solid #e2e8f0",
        boxShadow: "0 4px 6px -1px rgba(0,0,0,0.02)"
      }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 200px", gap: "20px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label style={{ fontSize: "11px", fontWeight: "800", color: "#64748b", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "6px" }}>
              <FaBuilding /> Full Name
            </label>
            <input 
              style={{ 
                padding: "12px 15px", 
                borderRadius: "12px", 
                border: duplicateError ? "1px solid #ef4444" : "1px solid #cbd5e1", 
                outline: "none", 
                width: "100%",
                fontSize: "15px",
                background: "#fff"
              }} 
              placeholder="e.g. Creative Design" 
              value={form.name} 
              onChange={e => setForm({...form, name: e.target.value})} 
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label style={{ fontSize: "11px", fontWeight: "800", color: "#64748b", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "6px" }}>
              <FaTag /> Short Code
            </label>
            <input 
              style={{ padding: "12px 15px", borderRadius: "12px", border: "1px solid #cbd5e1", outline: "none", fontSize: "15px", background: "#fff" }} 
              placeholder="e.g. CD" 
              value={form.shortName} 
              onChange={e => setForm({...form, shortName: e.target.value})} 
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label style={{ fontSize: "11px", fontWeight: "800", color: "#64748b", textTransform: "uppercase" }}>Status</label>
            <select 
              style={{ padding: "12px 15px", borderRadius: "12px", border: "1px solid #cbd5e1", outline: "none", background: "white", cursor: "pointer", fontSize: "15px" }} 
              value={form.status} 
              onChange={e => setForm({...form, status: e.target.value})}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        {duplicateError && (
          <div style={{ color: "#ef4444", fontSize: "13px", display: "flex", alignItems: "center", gap: "6px", fontWeight: "600", marginTop: "-10px" }}>
            <FaExclamationCircle /> {duplicateError}
          </div>
        )}

        <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
          {editing && (
            <button type="button" onClick={cancelEdit} style={{ 
              padding: "12px 24px", 
              background: "#fff", 
              color: "#64748b", 
              border: "1px solid #cbd5e1", 
              borderRadius: "12px", 
              fontWeight: "700",
              cursor: "pointer"
            }}>Cancel</button>
          )}
          <button type="submit" disabled={!!duplicateError} style={{ 
            padding: "12px 30px", 
            background: editing ? "#1e293b" : "#2563eb", 
            color: "#fff", 
            border: "none", 
            borderRadius: "12px", 
            fontWeight: "bold",
            cursor: duplicateError ? "not-allowed" : "pointer",
            transition: "0.2s",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            opacity: duplicateError ? 0.6 : 1,
            boxShadow: editing ? "none" : "0 4px 12px rgba(37, 99, 235, 0.2)"
          }}>
            {editing ? <><FaSave /> Save Changes</> : <><FaPlus /> Add Department</>}
          </button>
        </div>
      </form>

      <div className="admin-table-container" style={{ background: "#fff", borderRadius: "16px", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
        <table className="admin-table">
          <thead>
            <tr style={{ background: "#f8fafc" }}>
              <th style={{ padding: "20px" }}>Dept Code</th>
              <th style={{ padding: "20px" }}>Department Name</th>
              <th style={{ padding: "20px", textAlign: "center" }}>Headcount</th>
              <th style={{ padding: "20px" }}>Status</th>
              <th style={{ padding: "20px" }}>Created At</th>
              <th style={{ padding: "20px", textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
                <>
                  <SkeletonRow />
                  <SkeletonRow />
                  <SkeletonRow />
                </>
            ) : filteredDepts.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center", padding: "80px 40px" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "15px" }}>
                      <div style={{ width: "80px", height: "80px", background: "#f1f5f9", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8", fontSize: "32px" }}>
                        <FaInbox />
                      </div>
                      <h3 style={{ margin: 0, color: "#1e293b" }}>No Departments Found</h3>
                      <p style={{ margin: 0, color: "#64748b", fontSize: "14px" }}>Start by adding one using the form above!</p>
                    </div>
                  </td>
                </tr>
            ) : (
              filteredDepts.map(d => (
                <tr key={d._id}>
                  <td style={{ padding: "20px" }}>
                    <span style={{ fontWeight: 800, color: "#1e293b", background: "#f1f5f9", padding: "8px 14px", borderRadius: "10px", fontSize: "13px" }}>{d.shortName}</span>
                  </td>
                  <td style={{ padding: "20px" }}>
                    <div style={{ fontWeight: "700", color: "#1e293b" }}>{d.name}</div>
                  </td>
                  <td style={{ padding: "20px", textAlign: "center" }}>
                     <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", minWidth: "80px" }}>
                        <span style={{ fontWeight: "900", fontSize: "18px", color: "#2563eb" }}>{d.employeeCount || 0}</span>
                        <span style={{ fontSize: "10px", color: "#94a3b8", fontWeight: "700", textTransform: "uppercase" }}>Staff Members</span>
                     </div>
                  </td>
                  <td style={{ padding: "20px" }}>
                    <span className={`badge ${d.status === "Active" ? "badge-green" : "badge-gray"}`} style={d.status !== "Active" ? { background: "#f1f5f9", color: "#64748b" } : {}}>
                      <span style={{ fontSize: "8px", marginRight: "6px" }}>●</span>
                      {d.status || "Active"}
                    </span>
                  </td>
                  <td style={{ padding: "20px", fontSize: "13px", color: "#94a3b8" }}>
                    {new Date(d.createdAt).toLocaleDateString()}
                  </td>
                  <td style={{ padding: "20px", textAlign: "right" }}>
                    <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                        <button title="Edit" onClick={() => editDept(d)} style={{ 
                            width: "38px",
                            height: "38px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: "#eff6ff", 
                            color: "#2563eb",
                            border: "1px solid #dbeafe", 
                            borderRadius: "10px", 
                            cursor: "pointer",
                            transition: "0.2s"
                        }} className="btn-icon-hover"><FaEdit /></button>
                        <button title="Delete" onClick={() => deleteDept(d._id)} style={{ 
                            width: "38px",
                            height: "38px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: "#fff1f2", 
                            color: "#e11d48", 
                            border: "1px solid #fee2e2", 
                            borderRadius: "10px", 
                            cursor: "pointer",
                            transition: "0.2s"
                        }} className="btn-icon-hover"><FaTrash /></button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <style>{`
        .btn-icon-hover:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
        .badge-gray { background: #f1f5f9 !important; color: #64748b !important; }
        
        @keyframes skeleton-loading {
          0% { background-color: #f1f5f9; }
          100% { background-color: #e2e8f0; }
        }
        
        .skeleton {
          animation: skeleton-loading 1s linear infinite alternate;
          border-radius: 4px;
        }
        
        .skeleton-text {
          height: 12px;
          margin-bottom: 4px;
        }
      `}</style>
    </div>
  );
}