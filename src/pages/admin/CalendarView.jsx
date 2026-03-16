import React, { useState, useEffect } from "react";
import { FiCalendar, FiChevronLeft, FiChevronRight, FiPlus, FiX, FiActivity, FiTag } from "react-icons/fi";

export default function CalendarView() {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [holidays, setHolidays] = useState([]);
  const [holidayName, setHolidayName] = useState("");
  const [holidayDate, setHolidayDate] = useState("");

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("holidays")) || [];
    setHolidays(saved);
  }, []);

  const saveHolidays = (data) => {
    localStorage.setItem("holidays", JSON.stringify(data));
    setHolidays(data);
  };

  const addHoliday = () => {
    if (!holidayName || !holidayDate) return;
    const exists = holidays.find(h => h.date === holidayDate);
    if (exists) {
      alert("Holiday already exists");
      return;
    }
    const newHoliday = { name: holidayName, date: holidayDate };
    saveHolidays([...holidays, newHoliday]);
    setHolidayName("");
    setHolidayDate("");
  };

  const deleteHoliday = (date) => {
    saveHolidays(holidays.filter(h => h.date !== date));
  };

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  const goToday = () => setCurrentDate(new Date());

  const renderCells = () => {
    const cells = [];
    for (let i = 0; i < firstDay; i++) {
      cells.push(<div key={`empty-${i}`} className="bg-slate-50/30 rounded-2xl min-h-[120px]"></div>);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      const holiday = holidays.find(h => h.date === dateStr);
      const isToday = d === today.getDate() && currentDate.getMonth() === today.getMonth() && currentDate.getFullYear() === today.getFullYear();

      cells.push(
        <div key={d} className={`min-h-[120px] p-4 rounded-2xl border transition-all group relative overflow-hidden ${
          isToday ? 'bg-primary-50 border-primary-200 shadow-lg shadow-primary-100/50' : 
          holiday ? 'bg-rose-50 border-rose-100' : 'bg-white border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 hover:scale-[1.02]'
        }`}>
          <div className="flex justify-between items-start">
             <span className={`text-sm font-black ${isToday ? 'text-primary-600' : 'text-slate-400 group-hover:text-slate-900'}`}>{d}</span>
             {isToday && <span className="text-[10px] font-black uppercase text-primary-500 tracking-tighter">Today</span>}
          </div>

          {holiday && (
            <div className="mt-3 p-2 bg-rose-500 text-white rounded-xl text-[10px] font-bold leading-tight flex items-center justify-between shadow-lg shadow-rose-200 animate-in zoom-in-95 duration-200">
              <div className="flex items-center">
                 <span className="mr-1">🎉</span>
                 <span className="truncate max-w-[80px]">{holiday.name}</span>
              </div>
              <button 
                onClick={() => deleteHoliday(holiday.date)}
                className="ml-1 p-0.5 hover:bg-white/20 rounded transition-colors"
              >
                <FiX size={10} strokeWidth={3} />
              </button>
            </div>
          )}
        </div>
      );
    }
    return cells;
  };

  return (
    <div className="bg-white rounded-[40px] border border-slate-100 shadow-2xl shadow-slate-200/50 p-10 min-h-[80vh] animate-in fade-in duration-700">
      <div className="flex flex-col xl:flex-row xl:items-end justify-between mb-12 space-y-8 xl:space-y-0">
        <div>
          <div className="flex items-center space-x-3 text-primary-600 bg-primary-50 w-fit px-4 py-1.5 rounded-full mb-4">
             <FiActivity size={12} strokeWidth={4} />
             <span className="text-[10px] font-black uppercase tracking-widest">Temporal Logistics</span>
          </div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter flex items-center">
            <FiCalendar className="mr-4 text-primary-600" />
            Seasonal Overlay
          </h2>
          <p className="text-slate-500 mt-2 font-bold text-lg">Visualize holidays and company-wide events across the year.</p>
        </div>

        <div className="flex items-center bg-slate-50 p-2 rounded-3xl border border-slate-100 shadow-inner">
           <button onClick={prevMonth} className="p-3 hover:bg-white hover:shadow-md rounded-2xl text-slate-400 hover:text-primary-600 transition-all active:scale-90">
             <FiChevronLeft size={24} strokeWidth={3} />
           </button>
           <div className="px-8 text-center min-w-[200px]">
              <h3 className="text-xl font-black text-slate-900 tracking-tight">
                {currentDate.toLocaleString("default", { month: "long" })} {currentDate.getFullYear()}
              </h3>
           </div>
           <button onClick={nextMonth} className="p-3 hover:bg-white hover:shadow-md rounded-2xl text-slate-400 hover:text-primary-600 transition-all active:scale-90">
             <FiChevronRight size={24} strokeWidth={3} />
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Main Calendar Grid */}
        <div className="lg:col-span-9">
          <div className="grid grid-cols-7 gap-6 mb-6 px-4">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
              <div key={day} className="text-center text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">{day}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-6">
            {renderCells()}
          </div>
        </div>

        {/* Action Sidebar */}
        <div className="lg:col-span-3 space-y-8">
           <button 
             onClick={goToday}
             className="w-full py-4 bg-primary-50 text-primary-600 font-black text-xs uppercase tracking-widest rounded-2xl border border-primary-100 hover:bg-primary-600 hover:text-white transition-all shadow-sm active:scale-95"
           >
             Return to Today
           </button>

           <div className="bg-slate-50/50 p-8 rounded-[32px] border border-slate-100 space-y-6">
              <div className="flex items-center space-x-3 text-slate-900">
                 <FiPlus size={18} strokeWidth={3} />
                 <h4 className="font-black text-sm uppercase tracking-widest">New Holiday</h4>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Observed Event</label>
                  <div className="relative group">
                    <FiTag className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary-500 transition-colors" />
                    <input
                      className="w-full pl-11 pr-4 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all font-bold text-sm"
                      placeholder="Title..."
                      value={holidayName}
                      onChange={(e) => setHolidayName(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Effective Date</label>
                  <div className="relative group">
                    <FiCalendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary-500 transition-colors" />
                    <input
                      type="date"
                      className="w-full pl-11 pr-4 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all font-bold text-sm cursor-pointer"
                      value={holidayDate}
                      onChange={(e) => setHolidayDate(e.target.value)}
                    />
                  </div>
                </div>

                <button 
                  onClick={addHoliday}
                  className="w-full py-5 bg-slate-900 hover:bg-primary-600 text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-slate-200 hover:shadow-primary-100 transition-all active:scale-[0.98]"
                >
                  Confirm Provision
                </button>
              </div>
           </div>

           <div className="bg-amber-50/50 p-6 rounded-3xl border border-amber-100 shadow-sm flex items-start space-x-3">
              <FiX className="text-amber-600 mt-1 shrink-0" />
              <p className="text-[10px] text-amber-800 font-bold leading-relaxed uppercase tracking-widest">
                 <b>Notice:</b> Public holidays automatically adjust leave balance calculations for all active personnel.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
}