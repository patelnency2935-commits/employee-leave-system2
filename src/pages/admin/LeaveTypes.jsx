import React, { useState, useEffect } from "react";
import axios from "axios";

export default function LeaveTypes() {
  const [types, setTypes] = useState([]);
  const [form, setForm] = useState({ name: "", defaultQuota: 0, purpose: "" });
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTypes();
  }, []);

  const fetchTypes = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/leave-types");
      setTypes(res.data);
    } catch (err) { 
      console.error(err); 
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || form.defaultQuota < 0) return alert("Please fill valid details");
    
    try {
      if (editing) {
        await axios.put(`http://localhost:5000/api/leave-types/${editing}`, form);
        alert("Policy updated successfully! ✅");
      } else {
        await axios.post("http://localhost:5000/api/leave-types", form);
        alert("New policy defined! 🚀");
      }
      setForm({ name: "", defaultQuota: 0, purpose: "" });
      setEditing(null);
      fetchTypes();
    } catch (err) { 
      console.error(err); 
      alert(err.response?.data?.error || "Error saving policy");
    }
  };

  const deleteType = async (id) => {
    if (!window.confirm("Remove this leave policy permanently?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/leave-types/${id}`);
      fetchTypes();
    } catch (err) { console.error(err); }
  };

  const editType = (t) => {
    setEditing(t._id);
    setForm({ name: t.name, defaultQuota: t.defaultQuota, purpose: t.purpose || "" });
  };

  return (
    <div className="admin-section" style={{ minHeight: "80vh" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <div>
          <h2 className="admin-section-title" style={{ margin: 0 }}>⚖️ Leave Policies & Quotas</h2>
          <p style={{ margin: 0, opacity: 0.6, fontSize: "14px" }}>Configure organizational leave types and yearly allotments.</p>
        </div>
      </div>
      
      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: "25px", marginBottom: "30px" }}>
        <form onSubmit={handleSubmit} style={{ 
          display: "flex",
          flexDirection: "column",
          gap: "15px", 
          background: "#f8fafc", 
          padding: "24px", 
          borderRadius: "16px",
          border: "1px solid #e2e8f0"
        }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 140px", gap: "15px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              <label style={{ fontSize: "11px", fontWeight: "800", color: "#64748b", textTransform: "uppercase" }}>LEAVE TYPE</label>
              <input 
                style={{ padding: "12px", borderRadius: "10px", border: "1px solid #cbd5e1", outline: "none" }} 
                placeholder="e.g. Casual Leave" 
                value={form.name} 
                onChange={e => setForm({...form, name: e.target.value})} 
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              <label style={{ fontSize: "11px", fontWeight: "800", color: "#64748b", textTransform: "uppercase" }}>QUOTA (DAYS)</label>
              <input 
                type="number" 
                style={{ padding: "12px", borderRadius: "10px", border: "1px solid #cbd5e1", outline: "none" }} 
                placeholder="0" 
                value={form.defaultQuota} 
                onChange={e => setForm({...form, defaultQuota: e.target.value})} 
              />
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
            <label style={{ fontSize: "11px", fontWeight: "800", color: "#64748b", textTransform: "uppercase" }}>PURPOSE / DESCRIPTION</label>
            <textarea 
              style={{ padding: "12px", borderRadius: "10px", border: "1px solid #cbd5e1", outline: "none", minHeight: "60px", fontFamily: "inherit" }} 
              placeholder="Explain the purpose of this leave (e.g., Medical reasons, vacations...)" 
              value={form.purpose} 
              onChange={e => setForm({...form, purpose: e.target.value})} 
            />
          </div>
          <button type="submit" style={{ 
            padding: "14px", 
            background: editing ? "#1e293b" : "#2563eb", 
            color: "#fff", 
            border: "none", 
            borderRadius: "10px", 
            fontWeight: "bold",
            cursor: "pointer",
            transition: "0.2s"
          }}>
            {editing ? "💾 Update Leave Policy" : "➕ Define New Policy"}
          </button>
        </form>

        <div style={{ background: "#fffbeb", border: "1px solid #fde68a", padding: "20px", borderRadius: "16px" }}>
          <h4 style={{ margin: "0 0 10px 0", fontSize: "14px", color: "#92400e" }}>💡 Standard Policy Guide</h4>
          <ul style={{ padding: 0, margin: 0, listStyle: "none", fontSize: "12px", color: "#b45309", display: "flex", flexDirection: "column", gap: "8px" }}>
            <li><b>Casual:</b> 12 Days (Personal work)</li>
            <li><b>Sick:</b> 10-12 Days (Medical)</li>
            <li><b>Earned:</b> 15-18 Days (Vacations)</li>
            <li><b>Maternity:</b> 90-180 Days (Special)</li>
            <li><b>Bereavement:</b> 3-5 Days (Emergency)</li>
            <li><b>LOP:</b> 0 Days (Unlimited)</li>
          </ul>
        </div>
      </div>

      <div className="admin-table-container" style={{ background: "#fff", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
        <table className="admin-table">
          <thead>
            <tr style={{ background: "#f8fafc" }}>
              <th style={{ padding: "15px" }}>Leave Type</th>
              <th style={{ padding: "15px" }}>Default Quota (Per Year)</th>
              <th style={{ padding: "15px" }}>Purpose / Brief</th>
              <th style={{ padding: "15px", textAlign: "right" }}>Manage</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
                <tr><td colSpan="4" style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>Synchronizing policies...</td></tr>
            ) : types.length === 0 ? (
                <tr><td colSpan="4" style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>No leave policies defined yet.</td></tr>
            ) : (
                types.map(t => (
                <tr key={t._id}>
                    <td style={{ padding: "15px" }}>
                        <div style={{ fontWeight: 800, color: "#1e293b", fontSize: "15px" }}>{t.name}</div>
                    </td>
                    <td style={{ padding: "15px" }}>
                        <span style={{ 
                            background: "#eff6ff", 
                            color: "#2563eb", 
                            padding: "4px 10px", 
                            borderRadius: "20px", 
                            fontSize: "13px", 
                            fontWeight: "700" 
                        }}>
                            {t.defaultQuota === 0 ? "Unlimited" : `${t.defaultQuota} Days`}
                        </span>
                    </td>
                    <td style={{ padding: "15px", color: "#64748b", fontSize: "14px", maxWidth: "400px" }}>
                        {t.purpose || "No description provided."}
                    </td>
                    <td style={{ padding: "15px", textAlign: "right" }}>
                        <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                            <button onClick={() => editType(t)} style={{ 
                                padding: "8px 14px", 
                                background: "#f1f5f9", 
                                border: "1px solid #e2e8f0", 
                                borderRadius: "8px", 
                                cursor: "pointer",
                                fontSize: "13px",
                                fontWeight: "600"
                            }}>Settings</button>
                            <button onClick={() => deleteType(t._id)} style={{ 
                                padding: "8px 14px", 
                                background: "#fff1f2", 
                                color: "#e11d48", 
                                border: "1px solid #fda4af", 
                                borderRadius: "8px", 
                                cursor: "pointer",
                                fontSize: "13px",
                                fontWeight: "600"
                            }}>Delete</button>
                        </div>
                    </td>
                </tr>
                ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
