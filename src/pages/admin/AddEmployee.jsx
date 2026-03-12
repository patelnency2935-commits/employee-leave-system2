import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaUserPlus, FaEnvelope, FaBriefcase, FaBuilding, FaShieldAlt, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";

export default function AddEmployee() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    department: ""
  });

  const [departments, setDepartments] = useState([]);
  const [activePolicies, setActivePolicies] = useState([]);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMeta();
  }, []);

  const fetchMeta = async () => {
    try {
      const deptsRes = await axios.get("http://localhost:5000/api/departments");
      setDepartments(deptsRes.data);
      
      const typesRes = await axios.get("http://localhost:5000/api/leave-types");
      setActivePolicies(typesRes.data);
    } catch (err) { console.error("Error fetching metadata:", err); }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });
    try {
      await axios.post("http://localhost:5000/api/employees", formData);
      setMessage({ text: "Employee successfully registered! All leave balances have been initialized.", type: "success" });
      setFormData({ name: "", email: "", role: "", department: "" });
      
      // Clear message after 5 seconds
      setTimeout(() => setMessage({ text: "", type: "" }), 5000);
    } catch (err) {
      setMessage({ text: err.response?.data?.message || "Failed to register employee. Check if email is unique.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-section" style={{ 
        padding: "40px", 
        background: "#fff", 
        minHeight: "80vh", 
        borderRadius: "20px", 
        boxShadow: "0 10px 40px -10px rgba(0,0,0,0.05)",
        border: "1px solid #e2e8f0"
    }}>
      <div style={{ marginBottom: "40px" }}>
        <h2 className="admin-section-title" style={{ margin: 0, fontSize: "26px" }}>👤 Personnel Registration</h2>
        <p style={{ margin: "5px 0 0 0", opacity: 0.6, fontSize: "14px" }}>Onboard new staff members and automatically assign leave policies.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "11fr 350px", gap: "35px", maxWidth: "1250px" }}>
        {/* Left: Registration Form */}
        <div style={{ 
            background: "#f8fafc", 
            padding: "40px", 
            borderRadius: "16px", 
            border: "1px solid #e2e8f0",
            boxShadow: "0 4px 6px rgba(0,0,0,0.01)"
        }}>
          {message.text && (
            <div style={{ 
                padding: "16px", 
                borderRadius: "12px", 
                marginBottom: "30px", 
                fontSize: "14px", 
                fontWeight: "600",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                background: message.type === 'success' ? '#dcfce7' : '#fee2e2', 
                color: message.type === 'success' ? '#166534' : '#991b1b',
                border: `1px solid ${message.type === 'success' ? '#bbf7d0' : '#fecaca'}`
            }}>
              {message.type === "success" ? <FaCheckCircle /> : <FaExclamationTriangle />}
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "25px", marginBottom: "35px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <label style={{ fontSize: "11px", fontWeight: "900", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", display: "flex", alignItems: "center", gap: "6px" }}>
                    <FaUserPlus style={{ color: "#2563eb" }} /> Full Name
                </label>
                <input 
                    style={{ padding: "14px 18px", borderRadius: "12px", border: "1px solid #cbd5e1", fontSize: "15px", width: "100%", outline: "none", transition: "0.2s" }} 
                    className="input-focus-effect"
                    name="name" 
                    placeholder="e.g. Alexander Pierce" 
                    value={formData.name} 
                    onChange={handleChange} 
                    required 
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <label style={{ fontSize: "11px", fontWeight: "900", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", display: "flex", alignItems: "center", gap: "6px" }}>
                    <FaEnvelope style={{ color: "#2563eb" }} /> Work Email
                </label>
                <input 
                    style={{ padding: "14px 18px", borderRadius: "12px", border: "1px solid #cbd5e1", fontSize: "15px", width: "100%", outline: "none", transition: "0.2s" }} 
                    className="input-focus-effect"
                    name="email" 
                    type="email" 
                    placeholder="apierce@company.com" 
                    value={formData.email} 
                    onChange={handleChange} 
                    required 
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <label style={{ fontSize: "11px", fontWeight: "900", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", display: "flex", alignItems: "center", gap: "6px" }}>
                    <FaBriefcase style={{ color: "#2563eb" }} /> Job Role
                </label>
                <input 
                    style={{ padding: "14px 18px", borderRadius: "12px", border: "1px solid #cbd5e1", fontSize: "15px", width: "100%", outline: "none", transition: "0.2s" }} 
                    className="input-focus-effect"
                    name="role" 
                    placeholder="e.g. Lead UI Engineer" 
                    value={formData.role} 
                    onChange={handleChange} 
                    required 
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <label style={{ fontSize: "11px", fontWeight: "900", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", display: "flex", alignItems: "center", gap: "6px" }}>
                    <FaBuilding style={{ color: "#2563eb" }} /> Department
                </label>
                <select 
                    style={{ padding: "14px 18px", borderRadius: "12px", border: "1px solid #cbd5e1", fontSize: "15px", width: "100%", outline: "none", background: "#fff", cursor: "pointer" }} 
                    className="input-focus-effect"
                    name="department" 
                    value={formData.department} 
                    onChange={handleChange} 
                    required
                >
                  <option value="">Choose Department...</option>
                  {departments.map(d => <option key={d._id} value={d.name}>{d.name} ({d.shortName})</option>)}
                </select>
              </div>
            </div>

            <button type="submit" style={{ 
                background: "#2563eb", 
                color: "#fff", 
                border: "none", 
                padding: "18px 30px", 
                borderRadius: "14px", 
                cursor: loading ? "not-allowed" : "pointer", 
                fontSize: "16px", 
                fontWeight: "800", 
                width: "100%", 
                opacity: loading ? 0.7 : 1, 
                transition: "0.3s", 
                boxShadow: "0 8px 15px rgba(37, 99, 235, 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px"
            }} disabled={loading}>
              {loading ? "Processing..." : <><FaUserPlus /> Finalize Registration</>}
            </button>
          </form>
        </div>

        {/* Right: Policy Summary */}
        <div>
            <div style={{ background: "#fff", padding: "30px", borderRadius: "16px", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px rgba(0,0,0,0.01)" }}>
                <h3 style={{ fontSize: "16px", marginBottom: "10px", color: "#1e293b", display: "flex", alignItems: "center", gap: "8px" }}>
                    <FaShieldAlt style={{ color: "#2563eb" }} /> Policy Assignment
                </h3>
                <p style={{ fontSize: "13px", color: "#64748b", marginBottom: "25px", lineHeight: "1.5" }}>Upon registration, the system will automatically allocate the following yearly leave quotas:</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {activePolicies.map(p => (
                        <div key={p._id} style={{ 
                            display: "flex", 
                            justifyContent: "space-between", 
                            alignItems: "center",
                            padding: "12px 15px", 
                            background: "#f8fafc",
                            borderRadius: "10px",
                            border: "1px solid #f1f5f9"
                        }}>
                            <span style={{ fontSize: "13px", fontWeight: "700", color: "#334155" }}>{p.name}</span>
                            <span style={{ fontSize: "12px", fontWeight: "800", color: "#2563eb", background: "#eff6ff", padding: "4px 10px", borderRadius: "20px" }}>{p.defaultQuota} Days</span>
                        </div>
                    ))}
                    {activePolicies.length === 0 && <div style={{ fontSize: "13px", color: "#94a3b8", textAlign: "center", padding: "20px", background: "#f8fafc", borderRadius: "12px" }}>No policies defined.</div>}
                </div>
            </div>
            
            <div style={{ marginTop: "25px", padding: "20px", background: "#fffbeb", borderRadius: "16px", border: "1px solid #fef3c7" }}>
                 <p style={{ margin: 0, fontSize: "12px", color: "#92400e", lineHeight: "1.5" }}>
                     <b>💡 Pro-tip:</b> Ensure the email address is correct. The employee will use this email to access their personalized dashboard.
                 </p>
            </div>
        </div>
      </div>
      <style>{`
        .input-focus-effect:focus { border-color: #2563eb !important; box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1); }
      `}</style>
    </div>
  );
}