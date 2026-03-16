import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiClock, FiCheck, FiX, FiCalendar, FiUser, FiInfo, FiLayers, FiActivity, FiFilter, FiArrowUpRight } from "react-icons/fi";

function LeaveRequests() {
  const [leaves, setLeaves] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/leaves");
      setLeaves(res.data);
    } catch (err) {
      console.error("Fetch leaves error:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`http://localhost:5000/api/leaves/${id}`, { status });
      fetchLeaves();
    } catch (err) {
      console.error("Update status error:", err);
    }
  };

  const filteredLeaves =
    filter === "All"
      ? leaves
      : leaves.filter((leave) => leave.status === filter);

  const getStatusConfig = (status) => {
    switch (status) {
      case "Approved": return { bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-100", dot: "bg-emerald-500" };
      case "Rejected": return { bg: "bg-rose-50", text: "text-rose-600", border: "border-rose-100", dot: "bg-rose-500" };
      default: return { bg: "bg-amber-50", text: "text-amber-600", border: "border-amber-100", dot: "bg-amber-500" };
    }
  };

  return (
    <div className="bg-white rounded-[40px] border border-slate-100 shadow-2xl shadow-slate-200/50 p-10 min-h-[70vh] animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 space-y-6 md:space-y-0">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter flex items-center">
            <FiActivity className="mr-4 text-primary-600" />
            Leave Applications
          </h2>
          <p className="text-slate-500 mt-3 font-bold text-lg">Manage current workforce requests and maintain operational balance.</p>
        </div>

        <div className="relative group">
          <FiFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
          <select
            className="pl-12 pr-10 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all font-black text-sm text-slate-700 appearance-none min-w-[200px] cursor-pointer"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="All">All Requests</option>
            <option value="Pending">Pending Only</option>
            <option value="Approved">Approved Archives</option>
            <option value="Rejected">Rejected Archives</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {loading ? (
          <div className="col-span-full py-20 text-center opacity-30">
            <FiClock className="animate-spin mx-auto text-4xl mb-4" />
            <p className="font-black uppercase tracking-widest text-xs">Processing Logistical Queue...</p>
          </div>
        ) : filteredLeaves.length === 0 ? (
          <div className="col-span-full py-24 text-center bg-slate-50/50 rounded-[40px] border-2 border-dashed border-slate-200 opacity-40">
            <FiInfo size={48} className="mx-auto mb-4" />
            <p className="font-black uppercase tracking-widest text-xs">No matching applications found</p>
          </div>
        ) : (
          filteredLeaves.map((leave) => {
            const statusStyle = getStatusConfig(leave.status);
            return (
              <div key={leave._id} className="group bg-white rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/30 overflow-hidden hover:scale-[1.02] transition-all hover:shadow-2xl hover:shadow-primary-100/20">
                <div className="p-8 space-y-6">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-4">
                      <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-slate-200 group-hover:bg-primary-600 transition-all">
                        {leave.employee.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-xl font-black text-slate-900 tracking-tight leading-none">{leave.employee}</h4>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1 inline-block">Staff Member</span>
                      </div>
                    </div>
                    <span className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border} flex items-center`}>
                      <span className={`w-1.5 h-1.5 rounded-full mr-2 ${statusStyle.dot} ${leave.status === 'Pending' ? 'animate-pulse' : ''}`}></span>
                      {leave.status}
                    </span>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-slate-50">
                    <div className="flex items-center text-sm font-bold text-slate-600">
                      <FiLayers className="mr-3 text-slate-400" />
                      <span className="text-xs uppercase tracking-widest font-black text-slate-400 mr-2">Category:</span>
                      {leave.type}
                    </div>
                    <div className="flex items-center text-sm font-bold text-slate-600">
                      <FiCalendar className="mr-3 text-slate-400" />
                      <span className="text-xs uppercase tracking-widest font-black text-slate-400 mr-2">Interval:</span>
                      {new Date(leave.from).toLocaleDateString()} — {new Date(leave.to).toLocaleDateString()}
                    </div>
                    <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 italic text-slate-500 text-sm leading-relaxed">
                      "{leave.reason}"
                    </div>
                  </div>

                  {leave.status === "Pending" && (
                    <div className="grid grid-cols-2 gap-4 pt-4">
                      <button
                        onClick={() => updateStatus(leave._id, "Approved")}
                        className="flex items-center justify-center space-x-2 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-emerald-100 transition-all active:scale-95"
                      >
                        <FiCheck strokeWidth={4} />
                        <span>Authorize</span>
                      </button>

                      <button
                        onClick={() => updateStatus(leave._id, "Rejected")}
                        className="flex items-center justify-center space-x-2 py-4 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-rose-100 transition-all active:scale-95"
                      >
                        <FiX strokeWidth={4} />
                        <span>Decline</span>
                      </button>
                    </div>
                  )}
                  
                  {leave.status !== "Pending" && (
                    <div className="pt-4 flex justify-end">
                       <button className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 group-hover:text-primary-600 transition-all">
                          <span>Archive Details</span>
                          <FiArrowUpRight className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                       </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default LeaveRequests;