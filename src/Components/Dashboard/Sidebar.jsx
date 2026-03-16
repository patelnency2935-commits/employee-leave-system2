import React from 'react';
import { 
  FiGrid, FiEdit, FiClock, FiCheckSquare, FiUsers, FiFolder, FiSun, FiUser, FiLogOut, FiUserPlus, FiLayers, FiSettings 
} from 'react-icons/fi';

const Sidebar = ({ activePage, setActivePage, user }) => {
  const isAdmin = user?.role === "Admin" || user?.isAdmin;

  const employeeMenu = [
    { key: "dashboard", label: "Overview", icon: <FiGrid size={18} /> },
    { key: "applyLeave", label: "Apply Leave", icon: <FiEdit size={18} /> },
    { key: "history", label: "My History", icon: <FiClock size={18} /> },
    { key: "directory", label: "Directory", icon: <FiUsers size={18} /> },
    { key: "holidays", label: "Holidays", icon: <FiSun size={18} /> },
  ];

  const adminMenu = [
    { key: "addEmployee", label: "Add Employee", icon: <FiUserPlus size={18} /> },
    { key: "manageEmployees", label: "Manage Staff", icon: <FiLayers size={18} /> },
    { key: "approveReject", label: "Requests", icon: <FiCheckSquare size={18} /> },
    { key: "leaveTypes", label: "Policies", icon: <FiFolder size={18} /> },
  ];

  return (
    <aside className="w-72 bg-[#020617] h-screen flex flex-col fixed left-0 top-0 z-20 overflow-hidden border-r border-slate-800/50">
      {/* Premium Header */}
      <div className="p-8 pb-10">
        <div className="flex items-center space-x-3 group cursor-pointer" onClick={() => setActivePage("dashboard")}>
          <div className="w-11 h-11 bg-gradient-to-tr from-blue-700 to-blue-500 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-blue-500/20 group-hover:scale-105 transition-all duration-500 ring-4 ring-blue-500/10">
            <FiClock size={24} strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black text-white tracking-tighter leading-none">Manage<span className="text-blue-500">.</span>Leave</span>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mt-1">Project Portal</span>
          </div>
        </div>
      </div>

      <div className="flex-1 px-4 overflow-y-auto custom-scrollbar space-y-8">
        {/* Employee Section */}
        <div>
          <p className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-4 opacity-50">Personnel Area</p>
          <div className="space-y-1.5">
            {employeeMenu.map((item) => (
              <SidebarItem 
                key={item.key} 
                item={item} 
                active={activePage === item.key} 
                onClick={() => setActivePage(item.key)} 
              />
            ))}
          </div>
        </div>

        {/* Admin Section (Conditional) */}
        {isAdmin && (
          <div className="animate-in fade-in slide-in-from-left-4 duration-500">
            <p className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-4 opacity-50">Administration</p>
            <div className="space-y-1.5">
              {adminMenu.map((item) => (
                <SidebarItem 
                  key={item.key} 
                  item={item} 
                  active={activePage === item.key} 
                  onClick={() => setActivePage(item.key)} 
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modern Profile Footer */}
      <div className="p-4 bg-slate-900/40 border-t border-slate-800/50 backdrop-blur-xl">
        <div className="px-4 py-4 flex items-center space-x-3 mb-4 bg-white/5 rounded-[20px] border border-white/5">
           <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center text-white font-black text-xs shadow-lg">
              {user?.name?.charAt(0) || "U"}
           </div>
           <div className="flex-1 min-w-0">
              <p className="text-xs font-black text-white truncate">{user?.name || "Member"}</p>
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest truncate">{user?.role || "Employee"}</p>
           </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setActivePage("profile")}
            className={`flex items-center justify-center space-x-2 p-3 rounded-xl transition-all duration-300 ${
              activePage === "profile" ? 'bg-primary-600 text-white shadow-xl shadow-primary-600/20' : 'bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <FiSettings size={16} />
            <span className="font-bold text-[10px] uppercase tracking-widest">Settings</span>
          </button>
          
          <button
            className="flex items-center justify-center space-x-2 p-3 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white transition-all duration-300"
            onClick={() => {
              localStorage.removeItem("user");
              window.location.reload();
            }}
          >
            <FiLogOut size={16} />
            <span className="font-bold text-[10px] uppercase tracking-widest">Exit</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

const SidebarItem = ({ item, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-2xl transition-all duration-300 group relative ${
      active
        ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-xl shadow-primary-900/40 border border-white/10'
        : 'text-slate-500 hover:bg-white/5 hover:text-slate-100'
    }`}
  >
    <span className={`${active ? 'text-white' : 'text-slate-600 group-hover:text-primary-400'} transition-all duration-300 group-hover:scale-110`}>
      {item.icon}
    </span>
    <span className="font-black text-[12px] uppercase tracking-widest">{item.label}</span>
    {active && (
      <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-white animate-pulse"></div>
    )}
  </button>
);

export default Sidebar;

