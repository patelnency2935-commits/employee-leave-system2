import { useState } from "react";
import { FiSend, FiAlertCircle, FiCheckCircle, FiCalendar, FiMessageSquare, FiInfo } from 'react-icons/fi';

const isValidObjectId = (id) => /^[a-f\d]{24}$/i.test(id);

async function getValidUser() {
  const userData = localStorage.getItem("user");
  if (!userData) return null;
  let user = JSON.parse(userData);
  if (!isValidObjectId(user._id)) {
    try {
      const emailToUse = user.email || `employee_${Date.now()}@company.com`;
      const nameToUse  = user.name || "Employee";

      const res = await fetch("http://localhost:5000/api/employees/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailToUse, name: nameToUse }),
      });
      const data = await res.json();
      if (res.ok && data.employee) {
        user = data.employee;
        localStorage.setItem("user", JSON.stringify(user));
      }
    } catch (e) {
      console.error("Re-register error:", e);
    }
  }
  return user;
}

export default function ApplyLeave() {
  const [leaveType, setLeaveType] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const applyLeave = async (e) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");

    if (!leaveType || !from || !to || !reason) {
      setErrorMsg("Missing mandatory fields.");
      return;
    }

    const startDate = new Date(from);
    const endDate = new Date(to);
    const today = new Date();
    const totalDays = (endDate - startDate) / (1000 * 60 * 60 * 24) + 1;
    const noticeDays = (startDate - today) / (1000 * 60 * 60 * 24);

    if (endDate < startDate) {
      setErrorMsg("Chronological error: End date precedes start date.");
      return;
    }
    if (leaveType === "Casual" && noticeDays < 2) {
      setErrorMsg("Policy violation: Casual Leave requires 48hr notice.");
      return;
    }
    if (leaveType === "Maternity" && totalDays > 90) {
      setErrorMsg("Policy violation: Maternity cycle exceeds 90-day limit.");
      return;
    }

    setLoading(true);
    const user = await getValidUser();

    if (!user || user._id === undefined || !isValidObjectId(user._id)) {
      setErrorMsg("Identity verification failed. Please re-authenticate.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/leaves", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employee: user._id,
          type: leaveType,
          startDate: from,
          endDate: to,
          reason: reason,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMsg(data.message || "Protocol failure: Transmission rejected.");
        setLoading(false);
        return;
      }

      setSuccessMsg("Requisition broadcasted successfully. Awaiting audit.");
      setLeaveType("");
      setFrom("");
      setTo("");
      setReason("");

      setTimeout(() => {
        window.dispatchEvent(new Event("leaveUpdated"));
        setSuccessMsg("");
      }, 1800);

    } catch (error) {
      console.error("Error:", error);
      setErrorMsg("Network latency detected. Verify server synchronization.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="flex flex-col md:flex-row gap-12">
        <div className="flex-1">
          <div className="mb-10">
            <div className="flex items-center space-x-3 text-primary-600 bg-primary-50 w-fit px-4 py-1.5 rounded-full mb-4">
               <FiSend size={12} strokeWidth={4} />
               <span className="text-[10px] font-black uppercase tracking-widest">Requisition Form</span>
            </div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Time Off Request</h2>
            <p className="text-slate-500 mt-2 font-bold text-lg text-pretty">Submit your absence parameters for organizational review and approval.</p>
          </div>

          {successMsg && (
            <div className="mb-8 p-6 bg-emerald-50 border border-emerald-100 rounded-[24px] flex items-center space-x-4 text-emerald-700 animate-in zoom-in-95 shadow-lg shadow-emerald-100/50">
              <div className="p-2 bg-emerald-100 rounded-xl">
                 <FiCheckCircle size={24} />
              </div>
              <span className="text-xs font-black uppercase tracking-widest">{successMsg}</span>
            </div>
          )}
          
          {errorMsg && (
            <div className="mb-8 p-6 bg-rose-50 border border-rose-100 rounded-[24px] flex items-center space-x-4 text-rose-700 animate-in zoom-in-95 shadow-lg shadow-rose-100/50">
              <div className="p-2 bg-rose-100 rounded-xl">
                 <FiAlertCircle size={24} />
              </div>
              <span className="text-xs font-black uppercase tracking-widest">{errorMsg}</span>
            </div>
          )}

          <form onSubmit={applyLeave} className="space-y-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Classification</label>
              <div className="relative group">
                <FiInfo className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors" />
                <select 
                  value={leaveType} 
                  onChange={(e) => setLeaveType(e.target.value)} 
                  required
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl text-slate-900 font-bold focus:ring-4 focus:ring-primary-500/10 focus:bg-white focus:border-primary-500 transition-all outline-none appearance-none cursor-pointer"
                >
                  <option value="">Select Requisition Type...</option>
                  <option value="Casual">Casual Leave (48h Notice)</option>
                  <option value="Sick">Medical / Wellness</option>
                  <option value="Paid">Advanced Paid Leave</option>
                  <option value="Unpaid">Unpaid Sabbatical</option>
                  <option value="Maternity">Maternity Cycle (90d max)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Commencement</label>
                <div className="relative group">
                  <FiCalendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors" />
                  <input 
                    type="date" 
                    value={from} 
                    onChange={(e) => setFrom(e.target.value)} 
                    required 
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl text-slate-900 font-bold focus:ring-4 focus:ring-primary-500/10 focus:bg-white focus:border-primary-500 transition-all outline-none"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Conclusion</label>
                <div className="relative group">
                  <FiCalendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors" />
                  <input 
                    type="date" 
                    value={to} 
                    onChange={(e) => setTo(e.target.value)} 
                    required 
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl text-slate-900 font-bold focus:ring-4 focus:ring-primary-500/10 focus:bg-white focus:border-primary-500 transition-all outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Justification</label>
              <div className="relative group">
                <FiMessageSquare className="absolute left-4 top-6 text-slate-400 group-focus-within:text-primary-600 transition-colors" />
                <textarea
                  rows="4"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Provide essential context for this request..."
                  required
                  className="w-full pl-12 pr-4 py-5 bg-slate-50 border-2 border-slate-50 rounded-2xl text-slate-900 font-bold focus:ring-4 focus:ring-primary-500/10 focus:bg-white focus:border-primary-500 transition-all outline-none resize-none"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-slate-900 hover:bg-primary-600 text-white py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center space-x-3 group"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <FiSend className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  <span>Transmit Application</span>
                </>
              )}
            </button>
          </form>
        </div>

        <div className="hidden lg:block w-72 space-y-8">
           <div className="p-8 bg-slate-50/50 rounded-[32px] border border-slate-100 shadow-inner">
              <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] mb-6">Quick Overview</h4>
              <div className="space-y-6">
                 <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-primary-600 shadow-sm border border-slate-200">
                       <FiInfo size={14} />
                    </div>
                    <div>
                       <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Processing Time</p>
                       <p className="text-xs font-black text-slate-900 uppercase">~ 24 Hours</p>
                    </div>
                 </div>
                 <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-emerald-600 shadow-sm border border-slate-200">
                       <FiCheckCircle size={14} />
                    </div>
                    <div>
                       <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Success Rate</p>
                       <p className="text-xs font-black text-slate-900 uppercase">98.2% Avg.</p>
                    </div>
                 </div>
              </div>
           </div>

           <div className="p-8 bg-gradient-to-br from-primary-600 to-primary-700 rounded-[32px] text-white shadow-xl shadow-primary-200">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-4 opacity-60">Pro Tip</p>
              <p className="font-bold text-sm leading-relaxed italic">
                 "Applying at least 2 weeks in advance significantly improves authorization probability for extended cycles."
              </p>
           </div>
        </div>
      </div>
    </div>
  );
}


