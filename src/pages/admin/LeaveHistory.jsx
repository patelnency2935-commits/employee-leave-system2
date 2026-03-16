import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiSearch, FiFilter, FiCheck, FiX, FiTrash2, FiUser, FiCalendar, FiInfo, FiInbox, FiSlash, FiDatabase, FiLayers } from "react-icons/fi";

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
    if (!window.confirm(`Are you sure you want to ${status} this request?`)) return;

    try {
       await axios.put(`http://localhost:5000/api/leaves/${id}`, { status });
       fetchLeaves();
       window.dispatchEvent(new Event("adminLeaveUpdated"));
    } catch (error) {
       console.error("Update status error:", error);
       alert("Error updating status.");
    }
  };

  const deleteLeave = async (id) => {
    if (!window.confirm("🔴 Permenently delete this record from centralized history?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/leaves/${id}`);
      fetchLeaves();
      window.dispatchEvent(new Event("adminLeaveUpdated"));
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const filteredLeaves = leaves.filter((leave) => {
    const employeeName = leave.employee?.name || leave.employee || "Unknown User";
    const matchSearch = String(employeeName).toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "" || leave.status?.toLowerCase() === statusFilter;
    return matchSearch && matchStatus;
  });

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'rejected': return 'bg-rose-50 text-rose-600 border-rose-100';
      case 'pending': return 'bg-amber-50 text-amber-600 border-amber-100';
      default: return 'bg-slate-50 text-slate-400 border-slate-100';
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 p-8 min-h-[70vh] animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 space-y-4 md:space-y-0">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center">
            <FiDatabase className="mr-3 text-primary-600" />
            Leave Ledger
          </h2>
          <p className="text-slate-500 mt-1 font-medium text-sm">Review historical leave logs and manage legacy request statuses.</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="relative group">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
            <input
              className="pl-11 pr-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl w-full md:w-64 text-sm focus:ring-4 focus:ring-primary-500/10 focus:bg-white focus:border-primary-500 outline-none transition-all font-bold text-slate-700"
              placeholder="Filter by staff..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <div className="relative group">
             <FiFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors pointer-events-none" />
             <select
                className="pl-11 pr-8 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all font-bold text-slate-700 appearance-none cursor-pointer"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Logs</option>
                <option value="pending">⏳ Pending</option>
                <option value="approved">✅ Approved</option>
                <option value="rejected">❌ Rejected</option>
             </select>
          </div>
        </div>
      </div>

      <div className="border border-slate-50 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">
                <th className="px-8 py-5">Requesting Identity</th>
                <th className="px-8 py-5">Category</th>
                <th className="px-8 py-5">Timeline</th>
                <th className="px-8 py-5">Context / Reason</th>
                <th className="px-8 py-5 text-center">Status</th>
                <th className="px-8 py-5 text-right">Process</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan="6" className="px-8 py-20 text-center text-xs font-bold text-slate-400 uppercase tracking-widest">Querying central records...</td></tr>
              ) : filteredLeaves.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-8 py-24 text-center">
                    <div className="flex flex-col items-center opacity-30">
                        <FiInbox size={48} className="mb-4" />
                        <p className="font-black uppercase tracking-widest text-xs">Ledger is currently empty</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredLeaves.map((leave) => {
                   const employeeName = leave.employee?.name || leave.employee || "Historical Staff";
                   const start = new Date(leave.startDate || leave.from);
                   const end = new Date(leave.endDate || leave.to);
                   const status = leave.status?.toLowerCase() || 'pending';

                   return (
                    <tr key={leave._id} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-8 py-6">
                         <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white font-black text-sm group-hover:bg-primary-600 transition-all">
                               {String(employeeName).charAt(0)}
                            </div>
                            <div>
                              <p className="font-black text-slate-900 tracking-tight leading-none">{employeeName}</p>
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                                 {leave.employee?.department || "General Personnel"}
                              </p>
                            </div>
                         </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="bg-indigo-50 border border-indigo-100 text-indigo-600 px-3 py-1 rounded-lg font-black text-[10px] uppercase tracking-widest">
                           {leave.type}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                         <div className="flex flex-col">
                            <span className="font-black text-slate-900 tracking-tight flex items-center">
                               <FiCalendar className="mr-2 text-slate-300" size={12} />
                               {start.toLocaleDateString(undefined, { month: 'short', day: 'numeric'})}
                            </span>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">
                               until {end.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric'})}
                            </span>
                         </div>
                      </td>
                      <td className="px-8 py-6 max-w-xs">
                        <p className="text-xs font-bold text-slate-500 line-clamp-2 italic">"{leave.reason}"</p>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${getStatusStyle(status)}`}>
                            {status}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end space-x-2">
                           {status === 'pending' ? (
                             <>
                               <button onClick={() => updateStatus(leave._id, 'Approved')} className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white border border-emerald-100 transition-all active:scale-95 shadow-sm">
                                  <FiCheck size={14} strokeWidth={3} />
                               </button>
                               <button onClick={() => updateStatus(leave._id, 'Rejected')} className="p-2.5 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white border border-rose-100 transition-all active:scale-95 shadow-sm">
                                  <FiX size={14} strokeWidth={3} />
                               </button>
                             </>
                           ) : (
                             <button onClick={() => deleteLeave(leave._id)} className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-900 hover:text-white border border-slate-100 transition-all active:scale-95 shadow-sm">
                                <FiTrash2 size={14} />
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
      </div>
    </div>
  );
}

export default LeaveHistory;