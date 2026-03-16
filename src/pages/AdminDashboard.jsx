import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  FiGrid, FiClipboard, FiUsers, FiPlus, FiBriefcase, FiFolder, FiCalendar, FiFileText, 
  FiActivity, FiLogOut, FiTrendingUp, FiClock, FiAlertCircle 
} from 'react-icons/fi';

import LeaveHistory from "./admin/LeaveHistory";
import ManageEmployees from "./admin/ManageEmployees";
import AddEmployee from "./admin/AddEmployee";
import Departments from "./admin/Departments";
import LeaveTypes from "./admin/LeaveTypes";
import Holidays from "./admin/Holidays";
import AuditLogs from "./admin/AuditLogs";
import Reports from "./admin/Reports";

const navGroups = [
  {
    title: "Core Management",
    items: [
      { key: "dashboard",         label: "Dashboard",            icon: <FiGrid size={18} /> },
      { key: "leaveHistory",      label: "Leave Requests",       icon: <FiClipboard size={18} /> },
    ]
  },
  {
    title: "Employee Center",
    items: [
      { key: "manageEmployees",   label: "Manage Employees",     icon: <FiUsers size={18} /> },
      { key: "addEmployee",       label: "Add Employee",         icon: <FiPlus size={18} /> },
    ]
  },
  {
    title: "Organization",
    items: [
      { key: "departments",       label: "Departments",          icon: <FiBriefcase size={18} /> },
      { key: "leaveTypes",        label: "Leave Policies",       icon: <FiFolder size={18} /> },
      { key: "holidays",          label: "Holiday Calendar",     icon: <FiCalendar size={18} /> },
    ]
  },
  {
    title: "System & Insights",
    items: [
      { key: "reports",           label: "Reports & Analytics",  icon: <FiFileText size={18} /> },
      { key: "auditLogs",         label: "System Logs",           icon: <FiActivity size={18} /> },
    ]
  }
];

function StatusBadge({ status }) {
  const s = (status || "").toLowerCase();
  const styles = {
    approved: "bg-green-100 text-green-700 border-green-200",
    rejected: "bg-red-100 text-red-700 border-red-200",
    pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
  };
  
  return (
    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider ${styles[s] || styles.pending}`}>
      {status || "Pending"}
    </span>
  );
}

function AdminDashboard() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalEmployees: 0,
    pendingLeaves: 0,
    todayAbsentees: 0,
    upcomingHolidays: 0,
  });

  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000);
    window.addEventListener("adminLeaveUpdated", fetchDashboardData);
    window.addEventListener("leaveUpdated", fetchDashboardData);
    return () => {
      clearInterval(interval);
      window.removeEventListener("adminLeaveUpdated", fetchDashboardData);
      window.removeEventListener("leaveUpdated", fetchDashboardData);
    };
  }, []);

  const fetchDashboardData = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/leaves/admin-stats");
      const holidaysRes = await axios.get("http://localhost:5000/api/holidays");
      
      const upcoming = (holidaysRes.data || []).filter(h => new Date(h.date) >= new Date()).length;

      setStats({
        totalEmployees: res.data.totalEmployees || 0,
        pendingLeaves:  res.data.pendingLeaves  || 0,
        todayAbsentees: res.data.onLeaveToday   || 0,
        upcomingHolidays: upcoming || 0,
      });

      const leavesRes = await axios.get("http://localhost:5000/api/leaves");
      const sortedLeaves = (Array.isArray(leavesRes.data) ? leavesRes.data : (leavesRes.data.leaves || []))
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 8);
      setRecentActivity(sortedLeaves);
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/admin-login");
  };

  const StatCard = ({ title, value, icon, color, trend }) => (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-2xl ${color} bg-opacity-10 text-${color.split('-')[1]}-600 group-hover:scale-110 transition-transform duration-300`}>
          {icon}
        </div>
        {trend && (
          <span className="flex items-center text-[10px] font-black text-green-500 bg-green-50 px-2 py-1 rounded-lg">
            <FiTrendingUp className="mr-1" />
            {trend}
          </span>
        )}
      </div>
      <div className="text-2xl font-black text-slate-900 mb-1">{value}</div>
      <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">{title}</div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Command Center</h1>
                <p className="text-slate-500 mt-1 font-medium">Real-time overview of your workforce operations.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard title="Total Workforce" value={stats.totalEmployees} icon={<FiUsers size={24} />} color="bg-blue-500" trend="+2.4%" />
              <StatCard title="Pending Review" value={stats.pendingLeaves} icon={<FiClock size={24} />} color="bg-yellow-500" />
              <StatCard title="Away Today" value={stats.todayAbsentees} icon={<FiAlertCircle size={24} />} color="bg-rose-500" />
              <StatCard title="Upcoming Holidays" value={stats.upcomingHolidays} icon={<FiCalendar size={24} />} color="bg-indigo-500" />
            </div>

            <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
              <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black text-slate-900">Recent Leave Activity</h3>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Latest incoming requests</p>
                </div>
                <button 
                  onClick={() => setActiveSection("leaveHistory")}
                  className="bg-slate-50 hover:bg-slate-100 text-slate-600 px-4 py-2 rounded-xl text-xs font-black transition-all"
                >
                  View All
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      <th className="px-8 py-4">Employee</th>
                      <th className="px-8 py-4">Leave Type</th>
                      <th className="px-8 py-4">Applied On</th>
                      <th className="px-8 py-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 text-sm">
                    {recentActivity.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="px-8 py-20 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">
                          No recent activity recorded
                        </td>
                      </tr>
                    ) : (
                      recentActivity.map((leave, index) => (
                        <tr key={leave._id || index} className="hover:bg-slate-50 transition-colors group">
                          <td className="px-8 py-5">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 font-black text-xs group-hover:bg-primary-600 group-hover:text-white group-hover:border-primary-600 transition-all">
                                {leave.employee?.name?.charAt(0) || "E"}
                              </div>
                              <div className="font-bold text-slate-900">{leave.employee?.name || "Member"}</div>
                            </div>
                          </td>
                          <td className="px-8 py-5 font-bold text-slate-600">{leave.type}</td>
                          <td className="px-8 py-5 text-slate-400 font-medium">
                            {new Date(leave.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                          </td>
                          <td className="px-8 py-5">
                            <StatusBadge status={leave.status} />
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case "leaveHistory":      return <LeaveHistory />;
      case "manageEmployees":   return <ManageEmployees />;
      case "addEmployee":       return <AddEmployee />;
      case "departments":       return <Departments />;
      case "leaveTypes":        return <LeaveTypes />;
      case "holidays":          return <Holidays />;
      case "reports":           return <Reports />;
      case "auditLogs":         return <AuditLogs />;
      default:                  return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-inter">
      {/* Sidebar */}
      <aside className="w-72 bg-[#0f172a] h-screen flex flex-col fixed left-0 top-0 z-20 text-slate-400">
        <div className="p-8">
          <div className="flex items-center space-x-3 group cursor-pointer">
            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary-900 group-hover:rotate-12 transition-transform duration-300">
              <FiBriefcase size={22} />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">Admin<span className="text-primary-500">Hub</span></span>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-6 overflow-y-auto mt-4 custom-scrollbar pb-10">
          {navGroups.map((group) => (
            <div key={group.title} className="space-y-1">
              <p className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-3 opacity-60">{group.title}</p>
              {group.items.map(({ key, label, icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveSection(key)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                    activeSection === key
                      ? 'bg-primary-600 text-white shadow-xl shadow-primary-900/40'
                      : 'hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span className={`${activeSection === key ? 'text-white' : 'text-slate-500 group-hover:text-primary-400'} transition-colors`}>
                    {icon}
                  </span>
                  <span className="font-bold text-sm tracking-tight">{label}</span>
                </button>
              ))}
            </div>
          ))}
        </nav>

        <div className="p-6 bg-slate-900/50 mt-auto border-t border-white/5">
          <button 
            className="w-full flex items-center justify-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 text-rose-400 hover:bg-rose-500/10 font-bold text-sm"
            onClick={handleLogout}
          >
            <FiLogOut size={18} />
            <span>Logout Account</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-72 min-h-screen p-10">
        <div className="max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;