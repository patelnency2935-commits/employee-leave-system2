import React from 'react';
import { FiCheckCircle, FiClock, FiXCircle, FiTrendingUp } from 'react-icons/fi';

const StatusBadge = ({ status }) => {
  const configs = {
    Approved: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      border: 'border-emerald-100',
      icon: <FiCheckCircle size={12} />,
      label: 'Authorized'
    },
    Rejected: {
      bg: 'bg-rose-50',
      text: 'text-rose-700',
      border: 'border-rose-100',
      icon: <FiXCircle size={12} />,
      label: 'Declined'
    },
    Pending: {
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      border: 'border-amber-100',
      icon: <FiClock size={12} />,
      label: 'In Audit'
    },
  };

  const config = configs[status] || configs.Pending;

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border transition-all duration-300 ${config.bg} ${config.text} ${config.border}`}>
      <span className="mr-1.5">{config.icon}</span>
      {config.label}
    </span>
  );
};

const LeaveTable = ({ leaves, formatDate }) => {
  return (
    <div className="overflow-x-auto custom-scrollbar">
      <table className="w-full text-left border-separate border-spacing-0">
        <thead>
          <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
            <th className="px-6 py-4 border-b border-slate-50">Origin Date</th>
            <th className="px-6 py-4 border-b border-slate-50">Classification</th>
            <th className="px-6 py-4 border-b border-slate-50">Audit Status</th>
            <th className="px-6 py-4 border-b border-slate-50">Administrator Logs</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {leaves.length === 0 ? (
            <tr>
              <td colSpan="4" className="px-6 py-20 text-center">
                <div className="flex flex-col items-center opacity-30">
                  <FiClock size={32} className="mb-3" />
                  <p className="text-[10px] font-black uppercase tracking-widest">No transaction history detected</p>
                </div>
              </td>
            </tr>
          ) : (
            leaves.map((leave) => (
              <tr key={leave._id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-6 py-5">
                   <span className="text-xs font-black text-slate-500 bg-slate-100 px-3 py-1 rounded-lg group-hover:bg-white transition-colors">{formatDate(leave.createdAt)}</span>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center space-x-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
                    <span className="text-sm font-black text-slate-900 tracking-tight">{leave.type}</span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <StatusBadge status={leave.status} />
                </td>
                <td className="px-6 py-5 text-[11px] font-bold text-slate-400 italic">
                  {leave.managerComment || "Logs clear — awaiting review"}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default LeaveTable;

