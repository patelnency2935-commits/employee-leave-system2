import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiUsers, FiClock, FiUserCheck, FiActivity, FiArrowUpRight, FiSearch } from "react-icons/fi";

function Dashboard() {
  const [stats, setStats] = useState({});
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/dashboard");
      setStats(res.data);
      setRecentActivity(res.data.recentActivity || []);
    } catch (err) {
      console.log(err);
    }
  };

  const statCards = [
    { label: "Total Workforce", value: stats.totalEmployees || 0, icon: FiUsers, color: "text-primary-600", bg: "bg-primary-50", trend: "+12%" },
    { label: "Pending Requests", value: stats.pendingLeaves || 0, icon: FiClock, color: "text-amber-600", bg: "bg-amber-50", trend: "Critical" },
    { label: "Operational Presence", value: stats.todayAbsentees || 0, icon: FiUserCheck, color: "text-emerald-600", bg: "bg-emerald-50", trend: "Optimal" },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Executive Overview</h1>
          <p className="text-slate-500 mt-2 font-medium">Real-time snapshots of organization-wide leave operations.</p>
        </div>
        <div className="hidden md:flex items-center space-x-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-2xl border border-emerald-100 text-xs font-black uppercase tracking-widest">
           <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
           <span>Live System Health</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {statCards.map((card, i) => (
          <div key={i} className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/40 relative overflow-hidden group hover:scale-[1.02] transition-all">
            <div className="relative z-10">
              <div className={`w-14 h-14 rounded-2xl ${card.bg} ${card.color} flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform shadow-sm`}>
                <card.icon size={28} />
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-4xl font-black text-slate-900 tracking-tighter">{card.value}</h4>
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest mt-2">{card.label}</p>
                </div>
                <div className="flex flex-col items-end">
                   <div className="flex items-center text-emerald-500 font-black text-xs space-x-1">
                      <FiArrowUpRight />
                      <span>{card.trend}</span>
                   </div>
                </div>
              </div>
            </div>
            {/* Abstract backgrounds */}
            <div className={`absolute -right-8 -bottom-8 w-32 h-32 rounded-full ${card.bg} opacity-10 group-hover:scale-150 transition-transform`}></div>
          </div>
        ))}
      </div>

      {/* Activity Section */}
      <div className="bg-white rounded-[40px] border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden">
        <div className="px-10 py-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-slate-200">
               <FiActivity />
            </div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Recent Logistical Updates</h2>
          </div>
          <button className="text-[10px] font-black uppercase tracking-widest text-primary-600 hover:underline">View Analytics Report</button>
        </div>

        <div className="p-2">
          {recentActivity.length === 0 ? (
            <div className="py-24 text-center opacity-20">
               <FiSearch size={48} className="mx-auto mb-4" />
               <p className="font-black uppercase tracking-widest text-xs">No active request logs</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-50">
              {recentActivity.map((item) => (
                <div key={item._id} className="group flex items-center justify-between px-8 py-6 hover:bg-slate-50 transition-all rounded-[24px]">
                  <div className="flex items-center space-x-5">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 font-bold group-hover:bg-primary-600 group-hover:text-white transition-all shadow-sm">
                      {item.employee.charAt(0)}
                    </div>
                    <div>
                      <p className="font-black text-slate-900 tracking-tight">{item.employee}</p>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Leave Request Submission</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-6">
                    <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border ${
                      item.status.toLowerCase() === 'approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                      item.status.toLowerCase() === 'pending' ? 'bg-amber-50 text-amber-600 border-amber-100' : 
                      'bg-rose-50 text-rose-600 border-rose-100'
                    }`}>
                      {item.status}
                    </span>
                    <FiArrowUpRight className="text-slate-300 group-hover:text-primary-600 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all cursor-pointer" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;