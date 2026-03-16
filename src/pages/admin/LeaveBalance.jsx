import React, { useState, useEffect } from "react";
import { FiSearch, FiFilter, FiCalendar, FiPlus, FiUser, FiBarChart2, FiCheckCircle, FiXCircle, FiInfo, FiLayers } from "react-icons/fi";

function LeaveBalance() {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("All");
  const [showHolidayModal, setShowHolidayModal] = useState(false);
  const [holidayForm, setHolidayForm] = useState({ title: "", date: "" });
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  useEffect(() => {
    const storedEmployees = JSON.parse(localStorage.getItem("employees")) || [];
    setEmployees(storedEmployees);
  }, []);

  const filteredEmployees = employees.filter((emp) => {
    const matchSearch = String(emp.name).toLowerCase().includes(search.toLowerCase());
    const matchDept = department === "All" || emp.department === department;
    return matchSearch && matchDept;
  });

  const departments = [...new Set(employees.map(emp => emp.department))];

  const addHoliday = () => {
    if (!holidayForm.title || !holidayForm.date) return;
    const holidays = JSON.parse(localStorage.getItem("holidays")) || [];
    const newHoliday = { id: Date.now(), ...holidayForm };
    localStorage.setItem("holidays", JSON.stringify([...holidays, newHoliday]));
    setShowHolidayModal(false);
    setHolidayForm({ title: "", date: "" });
    alert("Holiday Added Successfully");
  };

  const openReview = (emp) => {
    setSelectedEmployee(emp);
    setShowReviewModal(true);
  };

  return (
    <div className="bg-white rounded-[40px] border border-slate-100 shadow-2xl shadow-slate-200/50 p-10 min-h-[80vh] animate-in fade-in duration-700">
      <div className="flex flex-col xl:flex-row xl:items-end justify-between mb-12 space-y-6 xl:space-y-0">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter flex items-center">
            <FiBarChart2 className="mr-4 text-primary-600" />
            Threshold & Quotas
          </h2>
          <p className="text-slate-500 mt-2 font-bold text-lg">Detailed audit of available leave reserves across the organization.</p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="relative group">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
            <input
              className="pl-12 pr-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl w-full md:w-64 text-sm focus:ring-4 focus:ring-primary-500/10 focus:bg-white focus:border-primary-500 outline-none transition-all font-black text-slate-700"
              placeholder="Query staff name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="relative group">
            <FiFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors pointer-events-none" />
            <select
              className="pl-12 pr-10 py-4 bg-white border-2 border-slate-100 rounded-2xl text-sm focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all font-black text-slate-700 appearance-none cursor-pointer min-w-[180px]"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            >
              <option value="All">All Divisions</option>
              {departments.map((dept, i) => <option key={i} value={dept}>{dept}</option>)}
            </select>
          </div>

          <button
            onClick={() => setShowHolidayModal(true)}
            className="flex items-center space-x-2 bg-slate-900 hover:bg-primary-600 text-white px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-slate-200 hover:shadow-primary-100 active:scale-95"
          >
            <FiPlus strokeWidth={4} />
            <span>Provision Holiday</span>
          </button>
        </div>
      </div>

      <div className="border border-slate-50 rounded-[32px] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                <th className="px-10 py-6">Staff Member</th>
                <th className="px-10 py-6">Division</th>
                <th className="px-8 py-6 text-center">Sick</th>
                <th className="px-8 py-6 text-center">Casual</th>
                <th className="px-8 py-6 text-center">Vacation</th>
                <th className="px-8 py-6 text-center">History</th>
                <th className="px-10 py-6 text-right">Audit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-10 py-32 text-center">
                    <div className="flex flex-col items-center opacity-20">
                      <FiUser size={64} className="mb-4" />
                      <p className="font-black uppercase tracking-widest text-xs leading-loose text-slate-500">
                        Zero identities match <br /> your current filters
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-10 py-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 font-black group-hover:bg-primary-600 group-hover:text-white transition-all shadow-sm">
                           {emp.name.charAt(0)}
                        </div>
                        <span className="font-black text-slate-900 tracking-tight text-lg">{emp.name}</span>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                       <span className="bg-slate-100 text-slate-500 px-3 py-1.5 rounded-xl font-black text-[10px] uppercase tracking-widest">
                          {emp.department}
                       </span>
                    </td>
                    <td className="px-8 py-6 text-center">
                       <span className="bg-rose-50 text-rose-600 px-3 py-1.5 rounded-xl font-black text-sm border border-rose-100 min-w-[40px] inline-block">{emp.sick || 0}</span>
                    </td>
                    <td className="px-8 py-6 text-center">
                       <span className="bg-amber-50 text-amber-600 px-3 py-1.5 rounded-xl font-black text-sm border border-amber-100 min-w-[40px] inline-block">{emp.casual || 0}</span>
                    </td>
                    <td className="px-8 py-6 text-center">
                       <span className="bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-xl font-black text-sm border border-emerald-100 min-w-[40px] inline-block">{emp.paid || 0}</span>
                    </td>
                    <td className="px-8 py-6 text-center">
                       <span className="bg-slate-50 text-slate-400 px-3 py-1.5 rounded-xl font-black text-sm border border-slate-100 min-w-[40px] inline-block">{emp.history || 0}</span>
                    </td>
                    <td className="px-10 py-6 text-right">
                      <button
                        onClick={() => openReview(emp)}
                        className="bg-white border-2 border-slate-100 hover:border-primary-500 hover:text-primary-600 px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 shadow-sm"
                      >
                        Run Audit
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Holiday Modal */}
      {showHolidayModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-10 space-y-8">
              <div className="flex items-center space-x-4">
                 <div className="w-12 h-12 bg-primary-50 text-primary-600 rounded-2xl flex items-center justify-center">
                    <FiCalendar size={24} />
                 </div>
                 <h3 className="text-2xl font-black text-slate-900 tracking-tight">Provision Holiday</h3>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Observed Title</label>
                  <input
                    className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-primary-500 transition-all font-bold"
                    placeholder="e.g. Founders Day"
                    value={holidayForm.title}
                    onChange={(e) => setHolidayForm({...holidayForm, title: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Calendar Date</label>
                  <input
                    type="date"
                    className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-primary-500 transition-all font-bold cursor-pointer"
                    value={holidayForm.date}
                    onChange={(e) => setHolidayForm({...holidayForm, date: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex space-x-4 pt-4">
                <button 
                  onClick={addHoliday}
                  className="flex-1 bg-primary-600 hover:bg-primary-700 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary-100 transition-all active:scale-95"
                >
                  Authorize
                </button>
                <button
                  onClick={() => setShowHolidayModal(false)}
                  className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-500 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Leave Review Modal */}
      {showReviewModal && selectedEmployee && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-300">
             <div className="p-10 space-y-10">
                <div className="flex items-center space-x-5">
                   <div className="w-16 h-16 bg-slate-900 rounded-[24px] flex items-center justify-center text-white font-black text-2xl">
                      {selectedEmployee.name.charAt(0)}
                   </div>
                   <div>
                      <h3 className="text-2xl font-black text-slate-900 tracking-tight">{selectedEmployee.name}</h3>
                      <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">{selectedEmployee.department} Strategy Unit</p>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                   <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex flex-col justify-center text-center">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Sick Reserves</span>
                      <span className="text-3xl font-black text-rose-600">{selectedEmployee.sick || 0}</span>
                      <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest mt-1">Days Rem.</span>
                   </div>
                   <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex flex-col justify-center text-center">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Casual Quota</span>
                      <span className="text-3xl font-black text-amber-600">{selectedEmployee.casual || 0}</span>
                      <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest mt-1">Days Rem.</span>
                   </div>
                   <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex flex-col justify-center text-center">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Vacation Balance</span>
                      <span className="text-3xl font-black text-emerald-600">{selectedEmployee.paid || 0}</span>
                      <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest mt-1">Days Rem.</span>
                   </div>
                   <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex flex-col justify-center text-center">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Historical Log</span>
                      <span className="text-3xl font-black text-slate-900">{selectedEmployee.history || 0}</span>
                      <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest mt-1">Total Apps.</span>
                   </div>
                </div>

                <button
                  onClick={() => setShowReviewModal(false)}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black py-5 rounded-2xl shadow-xl shadow-slate-200 transition-all uppercase tracking-[0.2em] text-xs"
                >
                  Close Audit View
                </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LeaveBalance;