import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  FiSearch, FiEdit2, FiTrash2, FiSave, FiX, FiUser, FiHome, FiMail, FiLoader, FiTerminal, FiUsers 
} from "react-icons/fi";

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
    const colors = ['bg-blue-500', 'bg-emerald-500', 'bg-amber-500', 'bg-violet-500', 'bg-pink-500', 'bg-cyan-500'];
    const index = (name?.charCodeAt(0) || 0) % colors.length;
    return colors[index];
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 p-8 min-h-[70vh]">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 space-y-4 md:space-y-0 text-center md:text-left">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center justify-center md:justify-start">
            <FiUsers className="mr-3 text-primary-600" />
            Workforce Directory
          </h2>
          <p className="text-slate-500 mt-1 font-medium text-sm">Manage employee profiles and system access permissions.</p>
        </div>
        
        <div className="relative group">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
          <input
            className="pl-11 pr-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl w-full md:w-80 text-sm focus:ring-4 focus:ring-primary-500/10 focus:bg-white focus:border-primary-500 outline-none transition-all font-mediumShadow"
            placeholder="Search by name, email or department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="border border-slate-50 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">
                <th className="px-8 py-5">Employee Profile</th>
                <th className="px-8 py-5">Role & Placement</th>
                <th className="px-8 py-5">Contact Details</th>
                <th className="px-8 py-5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan="4" className="px-8 py-20 text-center"><FiLoader className="animate-spin mx-auto text-primary-600 mb-2" size={24} /><p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Directory Syncing...</p></td></tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-8 py-24 text-center">
                    <div className="flex flex-col items-center opacity-30">
                        <FiTerminal size={48} className="mb-4" />
                        <p className="font-black uppercase tracking-widest text-xs">No records found matching criteria</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map(emp => (
                  <tr key={emp._id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center space-x-4">
                         <div className={`w-12 h-12 rounded-2xl ${getInitialsColor(emp.name)} flex items-center justify-center text-white font-black text-lg shadow-lg shadow-slate-200 group-hover:scale-110 transition-transform duration-300`}>
                            {emp.name?.charAt(0)}
                         </div>
                         <div>
                            {editId === emp._id ? (
                              <input 
                                  className="px-3 py-2 bg-white border-2 border-primary-500 rounded-xl outline-none text-sm font-bold w-40 animate-in zoom-in-95"
                                  value={editData.name} 
                                  onChange={e => setEditData({...editData, name: e.target.value})} 
                              />
                            ) : (
                              <div className="font-black text-slate-900 leading-tight">{emp.name}</div>
                            )}
                            <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">ID: {emp._id.slice(-6)}</div>
                         </div>
                      </div>
                    </td>
                    
                    <td className="px-8 py-6">
                      {editId === emp._id ? (
                        <div className="space-y-2 max-w-[200px] animate-in slide-in-from-left-2 transition-all">
                           <input 
                              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold focus:ring-2 focus:ring-primary-500 outline-none"
                              value={editData.role} 
                              placeholder="Job Title"
                              onChange={e => setEditData({...editData, role: e.target.value})} 
                           />
                            <select 
                              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold focus:ring-2 focus:ring-primary-500 outline-none cursor-pointer"
                              value={editData.department} 
                              onChange={e => setEditData({...editData, department: e.target.value})}
                            >
                               {departments.map(d => <option key={d._id} value={d.name}>{d.name}</option>)}
                            </select>
                        </div>
                      ) : (
                        <div>
                          <span className="inline-block px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-wider mb-1">
                            {emp.role || "Staff Member"}
                          </span>
                          <div className="text-sm font-bold text-slate-400 flex items-center">
                            <FiHome className="mr-1.5 opacity-50" size={12} />
                            {emp.department || "General"}
                          </div>
                        </div>
                      )}
                    </td>

                    <td className="px-8 py-6">
                       {editId === emp._id ? (
                         <input 
                            className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold focus:ring-2 focus:ring-primary-500 outline-none w-full animate-in slide-in-from-left-2"
                            value={editData.email} 
                            onChange={e => setEditData({...editData, email: e.target.value})} 
                         />
                       ) : (
                          <div className="text-sm font-bold text-slate-700 flex items-center">
                            <FiMail className="mr-2 opacity-30 text-primary-600" />
                            {emp.email}
                          </div>
                       )}
                    </td>

                    <td className="px-8 py-6 text-center">
                      <div className="flex items-center justify-center space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
                          {editId === emp._id ? (
                              <>
                                <button title="Save" onClick={saveEdit} className="p-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 shadow-lg shadow-emerald-200 transition-all active:scale-90">
                                  <FiSave size={18} />
                                </button>
                                <button title="Cancel" onClick={cancelEdit} className="p-3 bg-slate-100 text-slate-500 rounded-xl hover:bg-slate-200 transition-all active:scale-90">
                                  <FiX size={18} />
                                </button>
                              </>
                          ) : (
                              <>
                                <button title="Edit" onClick={() => startEdit(emp)} className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white border border-blue-100 transition-all active:scale-90">
                                  <FiEdit2 size={18} />
                                </button>
                                <button title="Delete" onClick={() => deleteEmployee(emp._id)} className="p-3 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white border border-rose-100 transition-all active:scale-90">
                                  <FiTrash2 size={18} />
                                </button>
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
      </div>
    </div>
  );
}

export default ManageEmployees;