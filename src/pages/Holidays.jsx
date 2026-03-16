import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiCalendar, FiMapPin, FiActivity, FiGlobe, FiLoader, FiAlertCircle } from 'react-icons/fi';

export default function Holidays() {
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterType, setFilterType] = useState("All");
  const [filterMonth, setFilterMonth] = useState("All");

  useEffect(() => {
    fetchHolidays();
  }, []);

  const fetchHolidays = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/holidays");
      setHolidays(res.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching holidays:", err);
      setError("Unable to synchronize with temporal server.");
    } finally {
      setLoading(false);
    }
  };

  const filtered = holidays.filter((h) => {
    const holidayDate = new Date(h.date);
    const monthMatch =
      filterMonth === "All" ||
      holidayDate.getMonth() + 1 === Number(filterMonth);
    
    // Note: Backend currently doesn't have 'type', defaulting to Public for UI
    const typeMatch = filterType === "All" || "Public" === filterType;
    return monthMatch && typeMatch;
  });

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  if (loading) {
    return (
      <div className="bg-white rounded-[40px] border border-slate-100 shadow-2xl shadow-slate-200/50 p-10 min-h-[80vh] flex flex-col items-center justify-center space-y-4 animate-in fade-in duration-500">
        <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-600 shadow-inner">
          <FiLoader className="animate-spin" size={32} />
        </div>
        <p className="font-black uppercase tracking-[0.3em] text-[10px] text-slate-400">Synchronizing Temporal Grid...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[40px] border border-slate-100 shadow-2xl shadow-slate-200/50 p-10 min-h-[80vh] animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 space-y-6 md:space-y-0 text-center md:text-left">
        <div className="flex-1">
          <div className="flex items-center space-x-3 text-primary-600 bg-primary-50 w-fit px-4 py-1.5 rounded-full mb-4 mx-auto md:mx-0">
             <FiGlobe size={12} strokeWidth={4} />
             <span className="text-[10px] font-black uppercase tracking-widest">Global Observed Days</span>
          </div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter flex items-center justify-center md:justify-start">
            <FiCalendar className="mr-4 text-primary-600" />
            Temporal Calendar
          </h2>
          <p className="text-slate-500 mt-2 font-bold text-lg text-pretty max-w-2xl">
            Official organizational downtime and recognized public observed events for the current cycle.
          </p>
        </div>

        <div className="flex items-center space-x-4 bg-slate-50 p-3 rounded-[24px] border border-slate-100 shadow-inner">
           <div className="flex flex-col">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Timeline</label>
              <select
                className="bg-white border-2 border-slate-100 rounded-xl px-4 py-2 text-xs font-black text-slate-700 outline-none focus:border-primary-500 transition-all cursor-pointer"
                value={filterMonth}
                onChange={(e) => setFilterMonth(e.target.value)}
              >
                <option value="All">Full Year</option>
                {months.map((month, i) => (
                  <option key={i} value={i + 1}>{month}</option>
                ))}
              </select>
           </div>
           <div className="flex flex-col">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Classification</label>
              <select
                className="bg-white border-2 border-slate-100 rounded-xl px-4 py-2 text-xs font-black text-slate-700 outline-none focus:border-primary-500 transition-all cursor-pointer"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="All">All Tiers</option>
                <option>Public</option>
                <option>Optional</option>
                <option>Regional</option>
              </select>
           </div>
        </div>
      </div>

      {error ? (
        <div className="py-40 border-2 border-dashed border-rose-100 rounded-[40px] bg-rose-50/20 flex flex-col items-center justify-center animate-in zoom-in-95 duration-500">
           <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-rose-500 shadow-sm mb-6 border border-rose-50">
              <FiAlertCircle size={32} />
           </div>
           <p className="font-black uppercase tracking-widest text-[10px] text-rose-500 mb-2">{error}</p>
           <button onClick={fetchHolidays} className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary-600 transition-colors">Retry Connection</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filtered.length === 0 ? (
            <div className="col-span-full py-40 border-2 border-dashed border-slate-100 rounded-[40px] bg-slate-50/30 flex flex-col items-center justify-center">
               <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-slate-300 shadow-sm mb-6">
                  <FiActivity size={32} />
               </div>
               <p className="font-black uppercase tracking-widest text-xs text-slate-400">No observed events detected in this range</p>
            </div>
          ) : (
            filtered.map((holiday) => (
              <div key={holiday._id} className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/30 hover:shadow-2xl hover:shadow-primary-100/20 transition-all group flex items-center space-x-8">
                 {/* Date Engine */}
                 <div className="relative">
                    <div className="bg-slate-900 text-white w-24 h-24 rounded-[30px] flex flex-col items-center justify-center shadow-2xl group-hover:bg-primary-600 transition-colors duration-500 relative z-10">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] mb-1 opacity-60">
                         {new Date(holiday.date).toLocaleString('default', { month: 'short' })}
                      </span>
                      <span className="text-3xl font-black tracking-tighter">
                         {new Date(holiday.date).getDate()}
                      </span>
                    </div>
                    <div className="absolute -right-2 -bottom-2 w-12 h-12 bg-primary-100 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                 </div>

                 <div className="flex-1">
                    <h3 className="text-xl font-black text-slate-900 tracking-tight mb-2 group-hover:text-primary-600 transition-colors uppercase">
                      {holiday.occasion || holiday.name}
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      <span className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border shadow-sm bg-emerald-50 text-emerald-700 border-emerald-100`}>
                        {holiday.type || "Public"} Status
                      </span>
                      <span className="flex items-center text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                        <FiMapPin className="mr-1.5 text-primary-500" />
                        {holiday.region || "Global Domain"}
                      </span>
                    </div>
                 </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}


