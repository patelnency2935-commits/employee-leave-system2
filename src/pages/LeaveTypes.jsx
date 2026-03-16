import React, { useState, useEffect } from "react";
import { FiPlus, FiTrash2, FiInfo, FiTag, FiEye, FiSettings, FiBriefcase, FiLayers, FiShield, FiArrowRight, FiActivity } from "react-icons/fi";

export default function LeaveTypes() {
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    defaultCount: "",
    carryForward: false,
    encashable: false,
    gender: "All",
    accrualRule: "",
    maxLimit: "",
    visibility: "Visible to Employees",
  });

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("leaveTypes")) || [];
    setLeaveTypes(stored);
  }, []);

  const saveToStorage = (data) => {
    localStorage.setItem("leaveTypes", JSON.stringify(data));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name) return alert("Leave name required");

    const updated = [...leaveTypes, { ...formData, id: Date.now() }];
    setLeaveTypes(updated);
    saveToStorage(updated);

    setFormData({
      name: "",
      description: "",
      defaultCount: "",
      carryForward: false,
      encashable: false,
      gender: "All",
      accrualRule: "",
      maxLimit: "",
      visibility: "Visible to Employees",
    });
  };

  const deleteLeave = (id) => {
    if (window.confirm("Are you sure you want to delete this leave type?")) {
      const filtered = leaveTypes.filter((item) => item.id !== id);
      setLeaveTypes(filtered);
      saveToStorage(filtered);
    }
  };

  return (
    <div className="bg-white rounded-[40px] border border-slate-100 shadow-2xl shadow-slate-200/50 p-10 min-h-[80vh] animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 space-y-6 md:space-y-0">
        <div>
          <div className="flex items-center space-x-3 text-primary-600 bg-primary-50 w-fit px-4 py-1.5 rounded-full mb-4 mx-auto md:mx-0">
             <FiShield size={12} strokeWidth={4} />
             <span className="text-[10px] font-black uppercase tracking-widest">Protocol Engine</span>
          </div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter flex items-center justify-center md:justify-start uppercase">
            <FiSettings className="mr-4 text-primary-600" />
            Policy Framework
          </h2>
          <p className="text-slate-500 mt-2 font-bold text-lg text-pretty max-w-2xl text-center md:text-left">
            Structural definitions for organization-wide leave categories, accrual thresholds, and visibility logic.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Form Engine */}
        <div className="lg:col-span-4 h-fit">
          <div className="bg-slate-50 p-10 rounded-[40px] border border-slate-100 shadow-inner group">
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-10 h-10 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:bg-primary-600 transition-colors">
                <FiPlus size={20} strokeWidth={3} />
              </div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight uppercase">Define Strategy</h3>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Protocol Identifier</label>
                <input
                  className="w-full px-6 py-4 bg-white border-2 border-slate-100 rounded-2xl focus:border-primary-500 transition-all outline-none font-black text-sm text-slate-700 shadow-sm"
                  placeholder="e.g. Sabbatical Cycle"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Intent/Rationale</label>
                <textarea
                  className="w-full px-6 py-4 bg-white border-2 border-slate-100 rounded-2xl focus:border-primary-500 transition-all outline-none font-black text-sm text-slate-700 shadow-sm min-h-[100px]"
                  placeholder="Operational purpose..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Days/Cycle</label>
                  <input
                    type="number"
                    className="w-full px-6 py-4 bg-white border-2 border-slate-100 rounded-2xl focus:border-primary-500 transition-all outline-none font-black text-sm text-slate-700 shadow-sm"
                    value={formData.defaultCount}
                    onChange={(e) => setFormData({ ...formData, defaultCount: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Accrual Cap</label>
                  <input
                    type="number"
                    className="w-full px-6 py-4 bg-white border-2 border-slate-100 rounded-2xl focus:border-primary-500 transition-all outline-none font-black text-sm text-slate-700 shadow-sm"
                    value={formData.maxLimit}
                    onChange={(e) => setFormData({ ...formData, maxLimit: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-200/50">
                <label className="flex items-center space-x-4 group cursor-pointer">
                  <div className={`w-10 h-6 rounded-full transition-all relative ${formData.carryForward ? 'bg-primary-600' : 'bg-slate-200'}`}>
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={formData.carryForward}
                      onChange={(e) => setFormData({ ...formData, carryForward: e.target.checked })}
                    />
                    <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-all ${formData.carryForward ? 'translate-x-4 shadow-[0_0_10px_rgba(255,255,255,0.8)]' : ''}`}></div>
                  </div>
                  <span className="text-[11px] font-black text-slate-600 uppercase tracking-widest">Carry Forward Protocol</span>
                </label>

                <label className="flex items-center space-x-4 group cursor-pointer">
                  <div className={`w-10 h-6 rounded-full transition-all relative ${formData.encashable ? 'bg-emerald-600' : 'bg-slate-200'}`}>
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={formData.encashable}
                      onChange={(e) => setFormData({ ...formData, encashable: e.target.checked })}
                    />
                    <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-all ${formData.encashable ? 'translate-x-4 shadow-[0_0_10px_rgba(255,255,255,0.8)]' : ''}`}></div>
                  </div>
                  <span className="text-[11px] font-black text-slate-600 uppercase tracking-widest">Monetary Encashment</span>
                </label>
              </div>

              <button 
                type="submit"
                className="w-full mt-6 bg-slate-900 hover:bg-primary-600 text-white font-black py-5 rounded-[24px] shadow-2xl shadow-slate-300 transition-all active:scale-[0.98] flex items-center justify-center space-x-3 uppercase text-xs tracking-[0.2em] group"
              >
                <span>Authorize Protocol</span>
                <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          </div>
        </div>

        {/* Archives/List */}
        <div className="lg:col-span-8 space-y-8">
          <div className="flex items-end justify-between px-2">
            <div>
               <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase">Active Frameworks</h3>
               <p className="text-xs font-black text-slate-400 uppercase tracking-widest mt-1">Currently compiled and active logic</p>
            </div>
            <span className="bg-slate-100 text-slate-900 text-[10px] font-black px-4 py-1.5 rounded-full border border-slate-200">{leaveTypes.length} DEPLOYED</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {leaveTypes.length === 0 ? (
              <div className="col-span-full py-40 border-2 border-dashed border-slate-100 rounded-[40px] bg-slate-50/30 flex flex-col items-center justify-center">
                 <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-slate-300 shadow-sm mb-6">
                    <FiActivity size={32} />
                 </div>
                 <p className="font-black uppercase tracking-widest text-xs text-slate-400 text-center px-10">No protocol tiers detected in core memory. Define a strategy to initialize.</p>
              </div>
            ) : (
              leaveTypes.map((leave) => (
                <div key={leave.id} className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/30 hover:shadow-2xl hover:shadow-primary-100/20 transition-all group relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary-600/5 rounded-full -mr-10 -mt-10 blur-3xl group-hover:bg-primary-600/10 transition-colors"></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-8">
                      <div className="w-16 h-16 rounded-[22px] bg-slate-900 text-white flex items-center justify-center font-black text-2xl shadow-xl group-hover:bg-primary-600 transition-colors duration-500">
                        {leave.name[0]}
                      </div>
                      <button
                        className="w-10 h-10 flex items-center justify-center text-rose-300 hover:text-rose-600 bg-rose-50/50 hover:bg-rose-50 rounded-xl transition-all"
                        onClick={() => deleteLeave(leave.id)}
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>

                    <h4 className="text-2xl font-black text-slate-900 mb-3 tracking-tight uppercase">{leave.name}</h4>
                    <p className="text-sm font-bold text-slate-400 mb-8 line-clamp-3 leading-relaxed italic opacity-80 group-hover:opacity-100">"{leave.description || "No strategic intent documented."}"</p>
                    
                    <div className="grid grid-cols-3 gap-4 p-4 bg-slate-50 rounded-[24px] border border-slate-100">
                      <div className="text-center">
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Capital</p>
                        <p className="text-lg font-black text-slate-900 tracking-tighter">{leave.defaultCount}D</p>
                      </div>
                      <div className="w-px h-8 bg-slate-200 mx-auto self-center"></div>
                      <div className="text-center">
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Accrual</p>
                        <p className={`text-lg font-black tracking-tighter ${leave.carryForward ? 'text-emerald-500' : 'text-slate-300 line-through decoration-2'}`}>
                          {leave.carryForward ? 'ON' : 'OFF'}
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 flex items-center space-x-2 text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] group-hover:text-primary-600 transition-colors">
                       <FiEye size={14} />
                       <span>Visible to {leave.visibility.split(' ')[0]} Units</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


