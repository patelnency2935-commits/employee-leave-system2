import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  FiBriefcase, FiTag, FiEdit2, FiTrash2, FiSearch, FiPlus, FiSave, FiAlertCircle, FiInbox, FiLoader, FiTerminal 
} from "react-icons/fi";

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

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 p-8 min-h-[70vh]">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 space-y-4 md:space-y-0">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center">
            <FiBriefcase className="mr-3 text-primary-600" />
            Organization Architecture
          </h2>
          <p className="text-slate-500 mt-1 font-medium text-sm">Define company departments and monitor workforce distribution.</p>
        </div>
        
        <div className="relative group">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
          <input
            className="pl-11 pr-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl w-full md:w-80 text-sm focus:ring-4 focus:ring-primary-500/10 focus:bg-white focus:border-primary-500 outline-none transition-all font-mediumShadow"
            placeholder="Search departments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* FORM SECTION */}
      <form onSubmit={handleSubmit} className="bg-slate-50/50 p-8 rounded-3xl border border-slate-100 mb-10 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Full Designation</label>
            <input 
              className={`w-full px-4 py-3 bg-white border-2 rounded-2xl outline-none transition-all font-bold text-sm ${duplicateError ? 'border-rose-400 focus:ring-rose-400/10' : 'border-slate-100 focus:border-primary-500 focus:ring-primary-500/10'}`} 
              placeholder="e.g. Creative Production" 
              value={form.name} 
              onChange={e => setForm({...form, name: e.target.value})} 
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Short Code</label>
            <input 
              className="w-full px-4 py-3 bg-white border-2 border-slate-100 rounded-2xl outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all font-bold text-sm" 
              placeholder="e.g. CP" 
              value={form.shortName} 
              onChange={e => setForm({...form, shortName: e.target.value})} 
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Operational Status</label>
            <select 
              className="w-full px-4 py-3 bg-white border-2 border-slate-100 rounded-2xl outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all font-bold text-sm cursor-pointer" 
              value={form.status} 
              onChange={e => setForm({...form, status: e.target.value})}
            >
              <option value="Active">Operational</option>
              <option value="Inactive">Suspended</option>
            </select>
          </div>
        </div>

        {duplicateError && (
          <div className="flex items-center space-x-2 text-rose-500 bg-rose-50 p-3 rounded-xl border border-rose-100 animate-in fade-in slide-in-from-left-2">
            <FiAlertCircle />
            <span className="text-xs font-black uppercase tracking-widest">{duplicateError}</span>
          </div>
        )}

        <div className="flex justify-end space-x-3">
          {editing && (
            <button type="button" onClick={cancelEdit} className="px-6 py-3 bg-white border-2 border-slate-100 text-slate-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all">
              Discard Changes
            </button>
          )}
          <button 
            type="submit" 
            disabled={!!duplicateError} 
            className={`px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center space-x-2 shadow-lg active:scale-95 ${editing ? 'bg-slate-900 shadow-slate-200 text-white' : 'bg-primary-600 shadow-primary-100 text-white hover:bg-primary-700'} ${duplicateError ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            {editing ? <><FiSave /> <span>Synchronize Data</span></> : <><FiPlus /> <span>Initialize Unit</span></>}
          </button>
        </div>
      </form>

      {/* TABLE SECTION */}
      <div className="border border-slate-50 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">
                <th className="px-8 py-5">Unit Identifier</th>
                <th className="px-8 py-5">Designation Name</th>
                <th className="px-8 py-5 text-center">Headcount</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5 text-right">Administrative Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan="5" className="px-8 py-20 text-center"><FiLoader className="animate-spin mx-auto text-primary-600 mb-2" size={24} /><p className="text-xs font-bold text-slate-400 uppercase tracking-widest text-[10px]">Processing Structure...</p></td></tr>
              ) : filteredDepts.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-8 py-24 text-center">
                    <div className="flex flex-col items-center opacity-30">
                        <FiTerminal size={48} className="mb-4" />
                        <p className="font-black uppercase tracking-widest text-xs">No designation matches found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredDepts.map(d => (
                  <tr key={d._id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-8 py-6">
                      <span className="bg-slate-900 border border-slate-800 text-white px-3 py-1.5 rounded-xl font-black text-xs tracking-widest group-hover:bg-primary-600 group-hover:border-primary-600 transition-all duration-300">
                        {d.shortName}
                      </span>
                    </td>
                    <td className="px-8 py-6 font-black text-slate-900 tracking-tight">{d.name}</td>
                    <td className="px-8 py-6 text-center">
                       <div className="flex flex-col items-center">
                          <span className="text-xl font-black text-primary-600">{d.employeeCount || 0}</span>
                          <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Active Members</span>
                       </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${d.status === "Active" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-slate-50 text-slate-400 border-slate-100"}`}>
                        <span className={`w-1.5 h-1.5 rounded-full mr-2 ${d.status === "Active" ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`}></span>
                        {d.status || "Active"}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
                        <button title="Edit Unit" onClick={() => editDept(d)} className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white border border-blue-100 transition-all active:scale-90 shadow-sm">
                          <FiEdit2 size={16} />
                        </button>
                        <button title="Dissolve Unit" onClick={() => deleteDept(d._id)} className="p-3 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white border border-rose-100 transition-all active:scale-90 shadow-sm">
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}