import React, { useEffect, useState } from "react";
import { FiUser, FiMail, FiLayers, FiFlag, FiPhone, FiLogOut, FiPieChart, FiCheckCircle, FiClock, FiXCircle, FiActivity, FiShield, FiCpu } from "react-icons/fi";

export default function Profile() {
  const [user, setUser] = useState({});
  const [stats, setStats] = useState({
    totalLeaves: 0,
    approvedLeaves: 0,
    pendingLeaves: 0,
    rejectedLeaves: 0
  });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
      fetch(`http://localhost:5000/api/leaves/employee-stats/${storedUser._id}`)
        .then(res => res.json())
        .then(data => {
          setStats(data);
        })
        .catch(err => {
          console.error("Stats error:", err);
        });
    }
  }, []);

  const leaveUsage =
    stats.totalLeaves > 0
      ? Math.round((stats.approvedLeaves / stats.totalLeaves) * 100)
      : 0;

  const attendance = 100 - leaveUsage;

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/employee-login";
  };

  const InfoRow = ({ icon: Icon, label, value }) => (
    <div className="flex items-center space-x-4 p-5 hover:bg-slate-50/80 rounded-[20px] transition-all group border border-transparent hover:border-slate-100">
      <div className="p-3 bg-white border border-slate-100 rounded-xl text-slate-400 group-hover:text-primary-600 group-hover:border-primary-100 transition-all shadow-sm">
        <Icon size={18} />
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{label}</p>
        <p className="text-sm font-black text-slate-900 tracking-tight mt-0.5">{value || "Unset"}</p>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-[40px] border border-slate-100 shadow-2xl shadow-slate-200/50 p-10 min-h-[80vh] animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 space-y-6 md:space-y-0">
        <div>
          <div className="flex items-center space-x-3 text-primary-600 bg-primary-50 w-fit px-4 py-1.5 rounded-full mb-4 mx-auto md:mx-0">
             <FiShield size={12} strokeWidth={4} />
             <span className="text-[10px] font-black uppercase tracking-widest">Credential Security</span>
          </div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter flex items-center justify-center md:justify-start uppercase">
            <FiUser className="mr-4 text-primary-600" />
            Identity Suite
          </h2>
          <p className="text-slate-500 mt-2 font-bold text-lg text-pretty max-w-2xl text-center md:text-left">
            Management of your personal workforce credentials and real-time performance metrics.
          </p>
        </div>

        <button 
          onClick={handleLogout}
          className="flex items-center justify-center space-x-3 px-8 py-4 bg-rose-50 text-rose-600 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-rose-600 hover:text-white transition-all active:scale-95 shadow-xl shadow-rose-100/50 group"
        >
          <FiLogOut className="group-hover:-translate-x-1 transition-transform" />
          <span>Exit Session</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Profile Card */}
        <div className="lg:col-span-4 lg:sticky lg:top-10 h-fit space-y-8">
          <div className="bg-slate-50 p-10 rounded-[40px] border border-slate-100 shadow-inner text-center relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-32 bg-primary-600 opacity-5 group-hover:opacity-10 transition-opacity"></div>
            
            <div className="relative mb-8 mx-auto w-32 h-32 rounded-[40px] bg-slate-900 flex items-center justify-center text-white font-black text-5xl shadow-2xl shadow-slate-300 border-4 border-white group-hover:bg-primary-600 transition-colors duration-500">
               <span className="relative z-10">{user.name ? user.name.charAt(0).toUpperCase() : "U"}</span>
            </div>
            
            <h3 className="text-2xl font-black text-slate-900 mb-1 tracking-tight uppercase">{user.name}</h3>
            <div className="inline-flex items-center px-4 py-1.5 bg-white shadow-sm border border-slate-100 text-primary-600 text-[10px] font-black uppercase tracking-[0.2em] rounded-full mb-10">
              <FiCpu className="mr-2" />
              {user.role || "Executive Member"}
            </div>

            <div className="space-y-2 text-left bg-white/50 p-4 rounded-[32px] border border-white">
              <InfoRow icon={FiMail} label="Access Channel" value={user.email} />
              <InfoRow icon={FiLayers} label="Department" value={user.department} />
              <InfoRow icon={FiPhone} label="Encryption Key" value={user.phone} />
            </div>
          </div>
        </div>

        {/* Analytics Zone */}
        <div className="lg:col-span-8 space-y-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: 'Cumulative', value: stats.totalLeaves, icon: FiPieChart, color: 'text-indigo-600', bg: 'bg-indigo-50' },
              { label: 'Authorized', value: stats.approvedLeaves, icon: FiCheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
              { label: 'Auditing', value: stats.pendingLeaves, icon: FiClock, color: 'text-amber-600', bg: 'bg-amber-50' },
              { label: 'Flagged', value: stats.rejectedLeaves, icon: FiXCircle, color: 'text-rose-600', bg: 'bg-rose-50' },
            ].map((stat, i) => (
              <div key={i} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/30 hover:shadow-2xl hover:shadow-primary-100/20 transition-all group overflow-hidden relative">
                <div className={`w-12 h-12 rounded-[18px] ${stat.bg} ${stat.color} flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 group-hover:rotate-6 transition-all`}>
                  <stat.icon size={22} strokeWidth={2.5} />
                </div>
                <div className="text-3xl font-black text-slate-900 tracking-tighter leading-none">{stat.value}</div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-3 group-hover:text-slate-900 transition-colors">{stat.label}</div>
                <div className={`absolute -right-2 -bottom-2 w-12 h-12 rounded-full ${stat.bg} opacity-20`}></div>
              </div>
            ))}
          </div>

          <div className="bg-slate-900 p-10 rounded-[40px] text-white shadow-2xl shadow-slate-300 relative overflow-hidden group">
            <div className="relative z-10 space-y-10">
               <div className="flex items-center space-x-4 mb-4">
                  <div className="p-3 bg-white/10 rounded-2xl border border-white/10 backdrop-blur-md">
                     <FiActivity className="text-primary-400 group-hover:animate-pulse" size={24} />
                  </div>
                  <h3 className="text-sm font-black uppercase tracking-[0.3em] opacity-60">Strategic Performance Benchmarks</h3>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-4">
                    <div className="flex justify-between items-end">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Resource Depletion</span>
                      <span className="text-2xl font-black text-primary-400">{leaveUsage}%</span>
                    </div>
                    <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden p-1 border border-white/5">
                      <div className="h-full bg-gradient-to-r from-primary-600 to-primary-400 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)] transition-all duration-1000" style={{ width: `${leaveUsage}%` }}></div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-end">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">System Presence Index</span>
                      <span className="text-2xl font-black text-emerald-400">{attendance}%</span>
                    </div>
                    <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden p-1 border border-white/5">
                      <div className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full shadow-[0_0_15px_rgba(52,211,153,0.5)] transition-all duration-1000" style={{ width: `${attendance}%` }}></div>
                    </div>
                  </div>
               </div>
            </div>
            
            {/* Background elements */}
            <div className="absolute top-[-50px] right-[-50px] w-96 h-96 bg-primary-600/10 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute bottom-[-20px] left-[-20px] w-64 h-64 bg-emerald-600/5 rounded-full blur-[80px] pointer-events-none"></div>
          </div>
        </div>
      </div>
    </div>
  );
}


