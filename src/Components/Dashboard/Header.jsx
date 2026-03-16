import React from 'react';
import { FiBell, FiSearch, FiPlus, FiCommand } from 'react-icons/fi';

const Header = ({ title, subtitle, onActionClick, user }) => {
  return (
    <header className="h-24 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-10 sticky top-0 z-10">
      <div className="animate-in fade-in slide-in-from-left-4 duration-500">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">{title}</h1>
        {subtitle && <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{subtitle}</p>}
      </div>

      <div className="flex items-center space-x-8">
        {/* Search Bar - Mac Style */}
        <div className="relative hidden lg:block group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center space-x-2 text-slate-400">
            <FiSearch size={16} />
          </div>
          <input
            type="text"
            placeholder="Quick search... (⌘K)"
            className="pl-11 pr-14 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold text-slate-600 focus:ring-4 focus:ring-primary-500/10 focus:bg-white focus:border-primary-500 transition-all w-72 outline-none shadow-inner"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center space-x-1 px-1.5 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-black text-slate-400 shadow-sm">
            <FiCommand size={10} />
            <span>K</span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button className="relative p-3 bg-slate-50 text-slate-500 hover:text-primary-600 hover:bg-white hover:shadow-lg transition-all rounded-2xl border border-slate-100 group">
            <FiBell size={20} className="group-hover:rotate-12 transition-transform" />
            <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white animate-pulse"></span>
          </button>

          {/* Action Button */}
          {onActionClick && (
            <button
              onClick={onActionClick}
              className="flex items-center space-x-2 bg-slate-900 hover:bg-primary-600 text-white px-6 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-slate-200 hover:shadow-primary-100 transition-all active:scale-95 group"
            >
              <FiPlus size={16} strokeWidth={3} className="group-hover:rotate-90 transition-transform" />
              <span>Initiate Request</span>
            </button>
          )}
        </div>

        {/* User Profile */}
        <div className="flex items-center space-x-4 pl-8 border-l border-slate-100 cursor-pointer group">
          <div className="text-right hidden xl:block">
            <p className="text-sm font-black text-slate-900 group-hover:text-primary-600 transition-colors leading-none">
              {user?.name || "Executive"}
            </p>
            <p className="text-[10px] font-black text-slate-400 tracking-widest uppercase mt-1">{user?.role || "Member"}</p>
          </div>
          <div className="w-12 h-12 rounded-2xl border-2 border-slate-100 p-0.5 group-hover:border-primary-500/50 transition-all shadow-sm group-hover:shadow-lg group-hover:shadow-primary-100">
            <div className="w-full h-full rounded-[14px] overflow-hidden bg-slate-100">
               <img
                 src={`https://ui-avatars.com/api/?name=${user?.name || "User"}&background=f8fafc&color=0f172a&bold=true&font-size=0.35`}
                 alt="Avatar"
                 className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
               />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

