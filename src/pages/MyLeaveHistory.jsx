import { useEffect, useState } from "react";
import { FiClock, FiCheckCircle, FiXCircle, FiCalendar, FiArrowRight, FiActivity, FiSearch, FiFilter } from 'react-icons/fi';

export default function MyLeaveHistory() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      const storedUser = localStorage.getItem("user");
      if (!storedUser) return;
      let user = JSON.parse(storedUser);
      let employeeId = user._id;

      const res = await fetch(`http://localhost:5000/api/leaves/employee/${employeeId}`);
      if (res.ok) {
        const data = await res.json();
        const sorted = (Array.isArray(data) ? data : []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setLeaves(sorted);
      }
    } catch (error) {
      console.error("Error fetching leaves:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
    const interval = setInterval(fetchLeaves, 30000);
    window.addEventListener("leaveUpdated", fetchLeaves);
    window.addEventListener("adminLeaveUpdated", fetchLeaves);
    return () => {
      clearInterval(interval);
      window.removeEventListener("leaveUpdated", fetchLeaves);
      window.removeEventListener("adminLeaveUpdated", fetchLeaves);
    };
  }, []);

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  const calculateDays = (startDate, endDate) => {
    if (!startDate || !endDate) return "-";
    const start = new Date(startDate);
    const end = new Date(endDate);
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
  };

  const StatusBadge = ({ status }) => {
    const configs = {
      approved: {
        bg: 'bg-emerald-50',
        text: 'text-emerald-700',
        border: 'border-emerald-100',
        icon: <FiCheckCircle size={14} />,
        label: 'Authorized'
      },
      rejected: {
        bg: 'bg-rose-50',
        text: 'text-rose-700',
        border: 'border-rose-100',
        icon: <FiXCircle size={14} />,
        label: 'Declined'
      },
      pending: {
        bg: 'bg-amber-50',
        text: 'text-amber-700',
        border: 'border-amber-100',
        icon: <FiClock size={14} />,
        label: 'In Review'
      },
    };
    
    const config = configs[status.toLowerCase()] || configs.pending;
    
    return (
      <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all duration-300 ${config.bg} ${config.text} ${config.border} shadow-sm`}>
        <span className="mr-2">{config.icon}</span>
        {config.label}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-[40px] border border-slate-100 shadow-2xl shadow-slate-200/50 p-10 min-h-[80vh] animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 space-y-6 md:space-y-0">
        <div>
          <div className="flex items-center space-x-3 text-primary-600 bg-primary-50 w-fit px-4 py-1.5 rounded-full mb-4">
             <FiActivity size={12} strokeWidth={4} />
             <span className="text-[10px] font-black uppercase tracking-widest">Audit Terminal</span>
          </div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter flex items-center">
            <FiClock className="mr-4 text-primary-600" />
            Leave Ledger
          </h2>
          <p className="text-slate-500 mt-2 font-bold text-lg text-pretty max-w-2xl">
            Comprehensive history of your absence requisitions and authorization statuses.
          </p>
        </div>

        <div className="flex items-center space-x-4 bg-slate-50 p-2 rounded-2xl border border-slate-100 shadow-inner">
           <div className="flex items-center px-4 py-2 space-x-2 text-slate-400">
              <FiSearch size={16} />
              <input type="text" placeholder="Search log..." className="bg-transparent text-sm font-bold outline-none placeholder:text-slate-300 w-32 focus:w-48 transition-all" />
           </div>
           <button className="bg-white p-2.5 rounded-xl shadow-sm border border-slate-100 text-slate-400 hover:text-primary-600 transition-colors">
              <FiFilter size={18} />
           </button>
        </div>
      </div>

      {loading ? (
        <div className="py-40 flex flex-col items-center justify-center space-y-4 opacity-30">
           <FiActivity size={48} className="animate-pulse text-primary-600" />
           <p className="text-[10px] font-black uppercase tracking-widest">Synchronizing records...</p>
        </div>
      ) : leaves.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-40 border-2 border-dashed border-slate-100 rounded-[40px] bg-slate-50/30 group">
          <div className="w-20 h-20 bg-white rounded-[32px] flex items-center justify-center text-slate-300 shadow-xl border border-slate-100 mb-8 group-hover:scale-110 transition-transform duration-500">
            <FiCalendar size={40} />
          </div>
          <p className="font-black uppercase tracking-[0.2em] text-sm text-slate-400">Zero Records Found</p>
          <p className="text-slate-400 text-xs mt-2 font-bold mb-8 italic">"No active or historical leave requisitions detected."</p>
          <button className="bg-primary-600 text-white px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-primary-200 hover:shadow-primary-400 transition-all active:scale-95">
             Submit First Application
          </button>
        </div>
      ) : (
        <div className="border border-slate-50 rounded-[40px] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  <th className="px-10 py-6">Classification</th>
                  <th className="px-10 py-6">Temporal Range</th>
                  <th className="px-10 py-6 text-center">Units</th>
                  <th className="px-10 py-6">Audit Status</th>
                  <th className="px-10 py-6 text-right">Submission</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {leaves.map((leave) => (
                  <tr key={leave._id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-10 py-8">
                      <div className="font-black text-slate-900 tracking-tight text-lg mb-1">{leave.type}</div>
                      <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest flex items-center">
                         <span className="w-1.5 h-1.5 rounded-full bg-primary-400 mr-2 group-hover:animate-ping"></span>
                         {leave.reason ? (leave.reason.length > 50 ? leave.reason.substring(0, 50) + "..." : leave.reason) : "Generic Requisition"}
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <div className="flex items-center space-x-3 text-sm font-black text-slate-700">
                        <span className="bg-white px-3 py-1.5 rounded-xl border border-slate-100 shadow-sm">{formatDate(leave.startDate)}</span>
                        <FiArrowRight className="text-slate-300" />
                        <span className="bg-white px-3 py-1.5 rounded-xl border border-slate-100 shadow-sm">{formatDate(leave.endDate)}</span>
                      </div>
                    </td>
                    <td className="px-10 py-8 text-center">
                       <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex flex-col items-center justify-center shadow-lg group-hover:bg-primary-600 transition-colors">
                          <span className="text-xs font-black">{calculateDays(leave.startDate, leave.endDate)}</span>
                          <span className="text-[8px] uppercase tracking-tighter opacity-70">Unit</span>
                       </div>
                    </td>
                    <td className="px-10 py-8">
                      <StatusBadge status={leave.status} />
                    </td>
                    <td className="px-10 py-8 text-right">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em] bg-white px-4 py-2 rounded-xl border border-slate-100 shadow-sm group-hover:bg-slate-50 transition-colors inline-block">{formatDate(leave.createdAt)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}


