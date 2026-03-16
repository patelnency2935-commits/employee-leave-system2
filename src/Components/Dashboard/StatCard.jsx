import React from 'react';

const StatCard = ({ label, value, icon, color, trend }) => {
  const iconColorMap = {
    blue: 'bg-indigo-50 text-indigo-600 ring-indigo-500/10',
    green: 'bg-emerald-50 text-emerald-600 ring-emerald-500/10',
    yellow: 'bg-amber-50 text-amber-600 ring-amber-500/10',
    red: 'bg-rose-50 text-rose-600 ring-rose-500/10',
  };

  return (
    <div className="p-8 rounded-[32px] bg-white border border-slate-100 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:shadow-primary-100/30 transition-all duration-500 group relative overflow-hidden">
      <div className="flex justify-between items-start mb-6 relative z-10">
        <div className={`p-4 rounded-[20px] ring-4 ${iconColorMap[color] || iconColorMap.blue} group-hover:scale-110 transition-transform duration-500 shadow-sm`}>
          {icon}
        </div>
        {trend && (
          <div className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
            trend.startsWith('+') || trend.includes('100%') 
              ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
              : 'bg-amber-50 text-amber-600 border border-amber-100'
          }`}>
            {trend}
          </div>
        )}
      </div>
      
      <div className="relative z-10">
        <h3 className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">{label}</h3>
        <p className="text-4xl font-black text-slate-900 tracking-tighter leading-none">{value}</p>
      </div>

      {/* Abstract decorative element */}
      <div className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full opacity-[0.03] group-hover:scale-150 transition-transform duration-1000 ${
        color === 'green' ? 'bg-emerald-600' : color === 'red' ? 'bg-rose-600' : 'bg-primary-600'
      }`}></div>
    </div>
  );
};

export default StatCard;

