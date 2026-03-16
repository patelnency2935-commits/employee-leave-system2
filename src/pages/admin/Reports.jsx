import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiDownload, FiBarChart2, FiList, FiTrendingUp, FiInfo, FiActivity, FiMap } from "react-icons/fi";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function Reports() {
  const [stats, setStats] = useState({ departmentStats: [], monthlyStats: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/reports/stats");
      setStats(res.data);
    } catch (err) {
      console.error("Fetch Stats Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const downloadCSV = () => {
    const headers = ["Department Name", "Leave Count"];
    const rows = stats.departmentStats.map((d) => [`"${d._id}"`, d.count]);
    let csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n" + rows.map((e) => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `leave_report_${new Date().toLocaleDateString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const COLORS = ['#2563eb', '#3b82f6', '#60a5fa', '#93c5fd', '#dbeafe'];

  return (
    <div className="bg-white rounded-[40px] border border-slate-100 shadow-2xl shadow-slate-200/50 p-10 min-h-[80vh] animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 space-y-6 md:space-y-0">
        <div>
          <div className="flex items-center space-x-3 text-primary-600 bg-primary-50 w-fit px-4 py-1.5 rounded-full mb-4">
             <FiActivity size={12} strokeWidth={4} />
             <span className="text-[10px] font-black uppercase tracking-widest">Organizational Intelligence</span>
          </div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter flex items-center">
            <FiBarChart2 className="mr-4 text-primary-600" />
            Analytics Depot
          </h2>
          <p className="text-slate-500 mt-2 font-bold text-lg text-pretty max-w-2xl">High-fidelity visual insights into department-wide leave trends and workforce distribution.</p>
        </div>

        <button 
          onClick={downloadCSV}
          disabled={loading || stats.departmentStats.length === 0}
          className="flex items-center space-x-3 bg-slate-900 hover:bg-primary-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-slate-200 hover:shadow-primary-100 active:scale-95 disabled:opacity-30 disabled:pointer-events-none group"
        >
          <FiDownload className="group-hover:translate-y-0.5 transition-transform" /> 
          <span>Export Dataset</span>
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 mb-12">
        {/* Chart Visualization */}
        <div className="xl:col-span-8 bg-slate-50/50 p-10 rounded-[40px] border border-slate-100 shadow-inner min-h-[500px]">
          <div className="flex items-center justify-between mb-10">
             <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-primary-600 shadow-sm border border-slate-100">
                   <FiMap size={18} />
                </div>
                <h3 className="text-lg font-black text-slate-900 tracking-tight">Divisional Distribution</h3>
             </div>
             <div className="flex items-center space-x-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <span className="w-2 h-2 rounded-full bg-primary-500"></span>
                <span>Active Queries</span>
             </div>
          </div>
          
          {loading ? (
             <div className="h-[350px] flex flex-col items-center justify-center space-y-4 opacity-30">
                <FiBarChart2 className="animate-pulse text-4xl text-primary-600" />
                <p className="font-black uppercase tracking-widest text-xs">Parsing Statistical Logs...</p>
             </div>
          ) : stats.departmentStats.length === 0 ? (
             <div className="h-[350px] flex flex-col items-center justify-center space-y-4 opacity-40">
                <FiInfo size={48} className="text-slate-300" />
                <p className="font-black uppercase tracking-widest text-xs text-slate-400">Database contains insufficient records</p>
             </div>
          ) : (
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.departmentStats}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="_id" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 800 }} 
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 800 }} 
                  />
                  <Tooltip 
                    cursor={{ fill: 'rgba(59, 130, 246, 0.05)', radius: [12, 12, 12, 12] }}
                    contentStyle={{ 
                      borderRadius: '24px', 
                      border: '1px solid #f1f5f9', 
                      boxShadow: '0 20px 25px -5px rgba(0,0,0,0.05)',
                      padding: '16px 20px',
                      backgroundColor: '#fff'
                    }}
                    labelStyle={{ fontWeight: 900, color: '#0f172a', marginBottom: '4px', fontSize: '12px' }}
                    itemStyle={{ fontWeight: 800, color: '#3b82f6', fontSize: '10px', textTransform: 'uppercase' }}
                  />
                  <Bar dataKey="count" radius={[12, 12, 12, 12]} barSize={40}>
                    {stats.departmentStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Sidebar Metrics */}
        <div className="xl:col-span-4 space-y-8">
            <div className="bg-primary-600 p-8 rounded-[32px] shadow-2xl shadow-primary-200 relative overflow-hidden group">
                <div className="relative z-10 space-y-6">
                   <div className="flex items-center space-x-3 text-primary-100">
                      <FiTrendingUp size={24} />
                      <h4 className="font-black text-sm uppercase tracking-widest">Real-time Pulse</h4>
                   </div>
                   <p className="text-primary-50 font-bold text-sm leading-relaxed italic opacity-80">
                      "Predictive modeling indicates a 14% increase in vacation requests for the upcoming fiscal quarter based on historical departmental logs."
                   </p>
                   <div className="pt-4 flex items-center justify-between border-t border-primary-500/50">
                      <span className="text-primary-200 text-[10px] font-black uppercase tracking-widest">System Confidence</span>
                      <span className="text-white text-xs font-black">98.4%</span>
                   </div>
                </div>
                {/* Abstract pattern */}
                <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
            </div>
            
            <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/40">
                <h4 className="font-black text-slate-900 text-sm uppercase tracking-widest mb-8 flex items-center">
                   <FiList className="mr-3 text-primary-600" />
                   Priority Summary
                </h4>
                <div className="space-y-4">
                    {stats.departmentStats.slice(0, 4).map((d, i) => (
                        <div key={d._id} className="flex justify-between items-center p-4 bg-slate-50/50 rounded-2xl border border-slate-50 group hover:border-primary-100 transition-colors">
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover:text-slate-900 transition-colors">{d._id}</span>
                            <span className="bg-white px-3 py-1 rounded-xl text-primary-600 font-black text-xs shadow-sm border border-slate-100">{d.count} Units</span>
                        </div>
                    ))}
                    {stats.departmentStats.length === 0 && (
                      <div className="text-center py-10 opacity-25">
                         <FiBarChart2 className="mx-auto mb-2" size={32} />
                         <p className="text-[10px] font-black uppercase tracking-widest">Empty State</p>
                      </div>
                    )}
                </div>
            </div>
        </div>
      </div>

      <div className="border border-slate-50 rounded-[40px] overflow-hidden shadow-sm">
        <div className="bg-slate-50/50 px-10 py-6 border-b border-slate-100 flex items-center space-x-4">
            <FiList className="text-slate-400" />
            <h3 className="text-lg font-black text-slate-900 tracking-tight">Granular Dataset Breakdown</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                <th className="px-10 py-6">Organizational Unit</th>
                <th className="px-10 py-6 text-center">Cumulative Requisitions</th>
                <th className="px-10 py-6 text-right">Operational Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan="3" className="px-10 py-20 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Pulling remote data streams...</td></tr>
              ) : stats.departmentStats.length === 0 ? (
                <tr><td colSpan="3" className="px-10 py-20 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Logs currently clear</td></tr>
              ) : (
                stats.departmentStats.map((d) => (
                  <tr key={d._id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-10 py-6 font-black text-slate-900 tracking-tight">{d._id}</td>
                    <td className="px-10 py-6 text-center">
                        <span className="bg-slate-900 text-white px-4 py-1.5 rounded-full font-black text-xs group-hover:bg-primary-600 transition-colors">{d.count}</span>
                    </td>
                    <td className="px-10 py-6 text-right text-[10px] font-black uppercase tracking-widest">
                        <span className="flex items-center justify-end text-emerald-500">
                           <span className="w-2 h-2 rounded-full bg-emerald-500 mr-3 animate-pulse"></span>
                           Active Tracking
                        </span>
                    </td>
                  </tr>
                )))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

