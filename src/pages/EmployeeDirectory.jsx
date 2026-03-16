import React, { useState, useEffect } from "react";
import { FiUsers, FiEye, FiEdit2, FiTrash2, FiSearch, FiX, FiActivity, FiBriefcase, FiZap, FiShield, FiHeart, FiCalendar } from 'react-icons/fi';

function EmployeeDirectory() {
  const defaultEmployees = [
    {
      id: "EMP001",
      name: "Rahul Sharma",
      role: "Software Engineer",
      department: "IT",
      joiningDate: "2023-04-12",
      leaveBalance: { sick: 5, casual: 3, annual: 10 },
      status: "Present",
    },
    {
      id: "EMP002",
      name: "Priya Singh",
      role: "HR Manager",
      department: "HR",
      joiningDate: "2022-01-20",
      leaveBalance: { sick: 2, casual: 1, annual: 6 },
      status: "On Leave",
    },
  ];

  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [mode, setMode] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const storedEmployees = JSON.parse(localStorage.getItem("employees"));
    if (storedEmployees) {
      setEmployees(storedEmployees);
    } else {
      setEmployees(defaultEmployees);
      localStorage.setItem("employees", JSON.stringify(defaultEmployees));
    }
  }, []);

  const saveEmployees = (data) => {
    setEmployees(data);
    localStorage.setItem("employees", JSON.stringify(data));
  };

  const closeModal = () => {
    setSelectedEmployee(null);
    setMode("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "department" || name === "status") {
      setSelectedEmployee({ ...selectedEmployee, [name]: value });
    } else {
      setSelectedEmployee({
        ...selectedEmployee,
        leaveBalance: {
          ...selectedEmployee.leaveBalance,
          [name]: Number(value),
        },
      });
    }
  };

  const handleSave = () => {
    const updatedEmployees = employees.map((emp) =>
      emp.id === selectedEmployee.id ? selectedEmployee : emp
    );
    saveEmployees(updatedEmployees);
    closeModal();
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to remove this employee?")) {
      const updatedEmployees = employees.filter(emp => emp.id !== id);
      saveEmployees(updatedEmployees);
    }
  };

  const filteredEmployees = employees.filter(emp => 
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-[40px] border border-slate-100 shadow-2xl shadow-slate-200/50 p-10 min-h-[80vh] animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 space-y-6 md:space-y-0">
        <div>
          <div className="flex items-center space-x-3 text-primary-600 bg-primary-50 w-fit px-4 py-1.5 rounded-full mb-4 mx-auto md:mx-0">
             <FiZap size={12} strokeWidth={4} />
             <span className="text-[10px] font-black uppercase tracking-widest">Enterprise Directory</span>
          </div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter flex items-center justify-center md:justify-start uppercase">
            <FiUsers className="mr-4 text-primary-600" />
            Workforce Index
          </h2>
          <p className="text-slate-500 mt-2 font-bold text-lg text-pretty max-w-2xl text-center md:text-left">
            Centralized registry of organization personnel, departmental categorization, and active status tracking.
          </p>
        </div>
        
        <div className="relative group">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Search credentials..." 
            className="pl-12 pr-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all font-black text-sm text-slate-700 w-full md:w-80 shadow-inner"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-separate border-spacing-0">
          <thead>
            <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
              <th className="px-6 py-4 border-b border-slate-50">Staff Member</th>
              <th className="px-6 py-4 border-b border-slate-50">Division</th>
              <th className="px-6 py-4 border-b border-slate-50">Accrued Capital</th>
              <th className="px-6 py-4 border-b border-slate-50 text-center">Status</th>
              <th className="px-6 py-4 border-b border-slate-50 text-right">Operations</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredEmployees.map((emp) => (
              <tr key={emp.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-6 py-5">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white font-black text-xs uppercase shadow-lg group-hover:bg-primary-600 transition-colors duration-500">
                      {emp.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="font-black text-slate-900 tracking-tight">{emp.name}</div>
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{emp.role} • {emp.id}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <span className="text-[10px] font-black text-primary-600 bg-primary-50 px-3 py-1.5 rounded-xl border border-primary-100 uppercase tracking-widest">
                    {emp.department} Core
                  </span>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center space-x-2">
                    <div className="flex flex-col items-center px-3 py-1 bg-white border border-slate-100 rounded-xl shadow-sm">
                       <span className="text-xs font-black text-slate-900">{emp.leaveBalance.sick}</span>
                       <span className="text-[8px] font-black text-slate-400 uppercase">Sick</span>
                    </div>
                    <div className="flex flex-col items-center px-3 py-1 bg-white border border-slate-100 rounded-xl shadow-sm">
                       <span className="text-xs font-black text-slate-900">{emp.leaveBalance.casual}</span>
                       <span className="text-[8px] font-black text-slate-400 uppercase">Cas</span>
                    </div>
                    <div className="flex flex-col items-center px-3 py-1 bg-white border border-slate-100 rounded-xl shadow-sm">
                       <span className="text-xs font-black text-slate-900">{emp.leaveBalance.annual}</span>
                       <span className="text-[8px] font-black text-slate-400 uppercase">Ann</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5 text-center">
                  <span className={`inline-flex items-center px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border ${
                    emp.status === "Present" ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-rose-50 text-rose-700 border-rose-100'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${emp.status === 'Present' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-rose-500'}`}></span>
                    {emp.status}
                  </span>
                </td>
                <td className="px-6 py-5 text-right">
                  <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-all">
                    <button 
                      onClick={() => { setSelectedEmployee(emp); setMode("view"); }}
                      className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-primary-600 bg-white border border-slate-100 hover:border-primary-100 rounded-xl transition-all shadow-sm active:scale-95"
                    >
                      <FiEye size={18} />
                    </button>
                    <button 
                      onClick={() => { setSelectedEmployee({ ...emp }); setMode("edit"); }}
                      className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-amber-600 bg-white border border-slate-100 hover:border-amber-100 rounded-xl transition-all shadow-sm active:scale-95"
                    >
                      <FiEdit2 size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(emp.id)}
                      className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-rose-600 bg-white border border-slate-100 hover:border-rose-100 rounded-xl transition-all shadow-sm active:scale-95"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modern Modal Implementation */}
      {selectedEmployee && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-500">
          <div className="bg-white w-full max-w-xl rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-white/20">
            <div className="px-10 py-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center space-x-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                 <FiBriefcase className="text-primary-500" />
                 <span>{mode === "view" ? "Accessing Core Profile" : "Modifying Personnel Data"}</span>
              </div>
              <button onClick={closeModal} className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-slate-900 bg-white rounded-xl transition-all shadow-sm border border-slate-100">
                <FiX size={20} />
              </button>
            </div>

            <div className="p-10 space-y-10">
              <div className="flex items-center space-x-8">
                <div className="w-24 h-24 rounded-[32px] bg-slate-900 flex items-center justify-center text-white text-4xl font-black shadow-2xl border-4 border-white">
                  {selectedEmployee.name[0]}
                </div>
                <div>
                  <h4 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">{selectedEmployee.name}</h4>
                  <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mt-1">{selectedEmployee.role}</p>
                  <div className="flex items-center space-x-4 mt-4">
                     <span className="flex items-center text-[10px] font-black text-slate-300 uppercase tracking-widest">
                        <FiCalendar className="mr-1.5" />
                        Init: {selectedEmployee.joiningDate}
                     </span>
                     <span className="w-1.5 h-1.5 rounded-full bg-slate-200"></span>
                     <span className="flex items-center text-[10px] font-black text-slate-300 uppercase tracking-widest">
                        <FiShield className="mr-1.5" />
                        ID: {selectedEmployee.id}
                     </span>
                  </div>
                </div>
              </div>

              {mode === "view" ? (
                <div className="grid grid-cols-2 gap-6 pt-10 border-t border-slate-50">
                  <div className="p-6 bg-slate-50 rounded-[24px] border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Division Unit</p>
                    <p className="font-black text-slate-900 uppercase tracking-tight">{selectedEmployee.department} Operations</p>
                  </div>
                  <div className="p-6 bg-slate-50 rounded-[24px] border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Operational Health</p>
                    <p className="font-black text-slate-900 uppercase tracking-tight flex items-center">
                       <FiActivity className="mr-2 text-emerald-500" />
                       {selectedEmployee.status}
                    </p>
                  </div>
                  <div className="col-span-2 p-8 bg-slate-900 rounded-[32px] shadow-xl relative overflow-hidden group">
                    <div className="relative z-10">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-8">Accrued Leave Capital Analysis</p>
                       <div className="flex justify-between items-center px-6">
                         <div className="text-center">
                           <p className="text-4xl font-black text-white tracking-tighter mb-2">{selectedEmployee.leaveBalance.sick}</p>
                           <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Medical</p>
                         </div>
                         <div className="w-px h-12 bg-white/10"></div>
                         <div className="text-center">
                           <p className="text-4xl font-black text-white tracking-tighter mb-2">{selectedEmployee.leaveBalance.casual}</p>
                           <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Optional</p>
                         </div>
                         <div className="w-px h-12 bg-white/10"></div>
                         <div className="text-center">
                           <p className="text-4xl font-black text-white tracking-tighter mb-2">{selectedEmployee.leaveBalance.annual}</p>
                           <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Incentive</p>
                         </div>
                       </div>
                    </div>
                    {/* Pattern */}
                    <FiZap className="absolute right-[-20px] bottom-[-20px] text-white/5 w-40 h-40 -rotate-12" />
                  </div>
                </div>
              ) : (
                <div className="space-y-8 pt-10 border-t border-slate-50">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Division Unit</label>
                      <input 
                        className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-primary-500 focus:bg-white transition-all outline-none font-black text-sm text-slate-700 shadow-inner"
                        name="department" value={selectedEmployee.department} onChange={handleChange} 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Operational Health</label>
                      <select 
                        className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-primary-500 focus:bg-white transition-all outline-none font-black text-sm text-slate-700 cursor-pointer shadow-inner"
                        name="status" value={selectedEmployee.status} onChange={handleChange}
                      >
                        <option>Present</option>
                        <option>On Leave</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="p-8 bg-slate-50 rounded-[32px] border border-slate-100 shadow-inner">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 text-center">Reallocate Capital Balances</p>
                    <div className="grid grid-cols-3 gap-6">
                      <div className="space-y-2 text-center">
                        <label className="text-[10px] font-black text-slate-500 uppercase">Medical</label>
                        <input type="number" name="sick" value={selectedEmployee.leaveBalance.sick} onChange={handleChange} className="w-full px-4 py-3 bg-white border-2 border-slate-100 rounded-xl text-center font-black text-slate-900 shadow-sm focus:border-primary-500 transition-all outline-none" />
                      </div>
                      <div className="space-y-2 text-center">
                        <label className="text-[10px] font-black text-slate-500 uppercase">Optional</label>
                        <input type="number" name="casual" value={selectedEmployee.leaveBalance.casual} onChange={handleChange} className="w-full px-4 py-3 bg-white border-2 border-slate-100 rounded-xl text-center font-black text-slate-900 shadow-sm focus:border-primary-500 transition-all outline-none" />
                      </div>
                      <div className="space-y-2 text-center">
                        <label className="text-[10px] font-black text-slate-500 uppercase">Incentive</label>
                        <input type="number" name="annual" value={selectedEmployee.leaveBalance.annual} onChange={handleChange} className="w-full px-4 py-3 bg-white border-2 border-slate-100 rounded-xl text-center font-black text-slate-900 shadow-sm focus:border-primary-500 transition-all outline-none" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex space-x-4 pt-4">
                {mode === "edit" ? (
                  <button onClick={handleSave} className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-black py-5 rounded-[24px] shadow-xl shadow-primary-200 transition-all active:scale-95 uppercase text-xs tracking-widest">
                    Authorize Commit
                  </button>
                ) : (
                  <button onClick={() => setMode("edit")} className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-black py-5 rounded-[24px] shadow-xl shadow-slate-200 transition-all active:scale-95 uppercase text-xs tracking-widest flex items-center justify-center space-x-3">
                    <FiEdit2 />
                    <span>Initiate Revision</span>
                  </button>
                )}
                <button onClick={closeModal} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 font-black py-5 rounded-[24px] transition-all uppercase text-xs tracking-widest">
                  Terminate Access
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EmployeeDirectory;

