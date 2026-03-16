import { useEffect, useState } from "react";
import React from "react";
import { FiCalendar, FiCheckCircle, FiClock, FiXCircle, FiTrendingUp, FiActivity, FiArrowUpRight, FiUsers } from 'react-icons/fi';
import ApplyLeave from "./ApplyLeave";
import MyLeaveHistory from "./MyLeaveHistory";
import ApproveReject from "./ApproveReject";
import EmployeeDirectory from "./EmployeeDirectory";
import LeaveTypes from "./LeaveTypes";
import Holidays from "./Holidays";
import Profile from "./Profile";
import AddEmployee from "./admin/AddEmployee";
import ManageEmployees from "./admin/ManageEmployees";

import Layout from "../Components/Dashboard/Layout";
import StatCard from "../Components/Dashboard/StatCard";
import LeaveTable from "../Components/Dashboard/LeaveTable";

export default function EmployeeDashboard() {
  const [activePage, setActivePage] = useState("dashboard");
  const [pending, setPending] = useState(0);
  const [approved, setApproved] = useState(0);
  const [rejected, setRejected] = useState(0);
  const [totalLeaves, setTotalLeaves] = useState(0);
  const [recentLeaves, setRecentLeaves] = useState([]);
  const [user, setUser] = useState(null);

  const formatDate = (date) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("en-GB", {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const fetchDashboardData = async () => {
    try {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) return;
      
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      let employeeId = parsedUser._id;
      
      const statsRes = await fetch(`http://localhost:5000/api/leaves/employee-stats/${employeeId}`);
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setPending(statsData.pendingLeaves || 0);
        setApproved(statsData.approvedLeaves || 0);
        setRejected(statsData.rejectedLeaves || 0);
        setTotalLeaves(statsData.totalLeaves || 0);
      }

      const leavesRes = await fetch(`http://localhost:5000/api/leaves/employee/${employeeId}`);
      if (leavesRes.ok) {
        const leavesData = await leavesRes.json();
        const sorted = [...leavesData].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setRecentLeaves(sorted.slice(0, 5));
      }
    } catch (err) {
      console.error("Dashboard Error:", err);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => { if (activePage === "dashboard") fetchDashboardData(); }, [activePage]);

  useEffect(() => {
    const handler = () => {
      fetchDashboardData();
      setActivePage("dashboard");
    };
    window.addEventListener("leaveUpdated", handler);
    return () => window.removeEventListener("leaveUpdated", handler);
  }, []);

  const getPageConfig = () => {
    const configs = {
      dashboard: { title: "Management Overview", subtitle: "Real-time leave analytics and request status." },
      applyLeave: { title: "Leave Application", subtitle: "Submit departmental leave applications." },
      history: { title: "Leave History", subtitle: "Audit your historical leave records." },
      approveReject: { title: "Request Approvals", subtitle: "Review and process pending requisitions." },
      directory: { title: "Employee Directory", subtitle: "Search for colleagues across divisions." },
      leaveTypes: { title: "Policy Manual", subtitle: "Official company leave threshold guidelines." },
      holidays: { title: "Holiday Calendar", subtitle: "Upcoming observed company holidays." },
      profile: { title: "User Profile", subtitle: "Manage your personal credentials." },
      addEmployee: { title: "Onboarding Portal", subtitle: "Register new personnel into the system." },
      manageEmployees: { title: "Staff Directory", subtitle: "Maintain employee profiles and access." },
    };
    return configs[activePage] || configs.dashboard;
  };

  const pageConfig = getPageConfig();

  return (
    <Layout
      activePage={activePage}
      setActivePage={setActivePage}
      user={user}
      onActionClick={() => setActivePage("applyLeave")}
      title={pageConfig.title}
      subtitle={pageConfig.subtitle}
    >
      {activePage === "dashboard" ? (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {/* Main Welcome Section */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-[32px] p-10 text-white shadow-2xl shadow-slate-200 relative overflow-hidden group">
             <div className="relative z-10">
                <div className="flex items-center space-x-4 mb-4">
                   <span className="px-3 py-1 bg-primary-500 rounded-lg text-[10px] font-black uppercase tracking-widest">System Online</span>
                   <span className="text-slate-400 text-xs font-bold">{new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                <h1 className="text-4xl font-black tracking-tight mb-2 uppercase">Welcome back, {user?.name?.split(' ')[0]}</h1>
                <p className="text-slate-400 font-medium max-w-xl leading-relaxed">Your dashboard is synchronized. You have <span className="text-amber-400 font-black">{pending} pending requests</span> awaiting management review.</p>
                
                <div className="mt-8 flex space-x-4">
                   <button onClick={() => setActivePage("applyLeave")} className="bg-white text-slate-900 px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-primary-500 hover:text-white transition-all active:scale-95 flex items-center">
                      Request Leave <FiArrowUpRight className="ml-2" />
                   </button>
                   <button onClick={() => setActivePage("history")} className="bg-slate-700/50 text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-700 transition-all border border-slate-600/50">
                      Audit Logs
                   </button>
                </div>
             </div>
             {/* Abstract backdrop icons */}
             <FiActivity className="absolute right-[-20px] bottom-[-20px] text-white/[0.03] w-64 h-64 rotate-12 group-hover:rotate-45 transition-transform duration-1000" />
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard 
              label="Cumulative Apps" 
              value={totalLeaves} 
              icon={<FiCalendar size={20} />} 
              color="blue" 
              trend="+2 this month"
            />
            <StatCard 
              label="Authorized" 
              value={approved} 
              icon={<FiCheckCircle size={20} />} 
              color="green" 
              trend="100% success"
            />
            <StatCard 
              label="Pending Audit" 
              value={pending} 
              icon={<FiClock size={20} />} 
              color="yellow" 
              trend="Awaiting review"
            />
            <StatCard 
              label="Declined" 
              value={rejected} 
              icon={<FiXCircle size={20} />} 
              color="red" 
              trend="View details"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Recent Table */}
            <div className="lg:col-span-8 bg-white rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
               <div className="px-10 py-8 border-b border-slate-50 flex items-center justify-between">
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">Recent Activity Log</h3>
                  <button onClick={() => setActivePage("history")} className="text-[10px] font-black uppercase tracking-widest text-primary-600 hover:text-primary-700">View All Records</button>
               </div>
               <div className="p-4">
                  <LeaveTable leaves={recentLeaves} formatDate={formatDate} />
               </div>
            </div>

            {/* Analytics Sidebar */}
            <div className="lg:col-span-4 space-y-8">
              <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/50">
                <div className="flex items-center space-x-3 mb-8">
                  <div className="p-3 bg-primary-50 text-primary-600 rounded-2xl">
                    <FiTrendingUp size={24} />
                  </div>
                  <h3 className="font-black text-slate-900 text-lg tracking-tight">Threshold Analysis</h3>
                </div>
                
                <div className="space-y-8">
                  <div className="group">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-3">
                      <span className="text-slate-400 group-hover:text-slate-900">Entitlement Used</span>
                      <span className="text-slate-900">12 / 24 <span className="text-slate-300">Days</span></span>
                    </div>
                    <div className="w-full h-3 bg-slate-50 border border-slate-100 rounded-full overflow-hidden shadow-inner">
                      <div className="h-full bg-gradient-to-r from-primary-600 to-primary-400 rounded-full shadow-lg shadow-primary-200" style={{ width: '50%' }}></div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-6 bg-slate-50/50 rounded-3xl border border-slate-100 hover:bg-white hover:shadow-lg hover:shadow-slate-200 transition-all group">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                        <FiActivity size={18} />
                      </div>
                      <div>
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Next Observed</p>
                         <p className="text-sm font-black text-slate-900 uppercase">Holi Festival</p>
                      </div>
                    </div>
                    <span className="bg-white px-3 py-1.5 rounded-xl text-emerald-600 text-xs font-black shadow-sm">Mar 25</span>
                  </div>
                </div>
              </div>

              <div className="bg-primary-600 p-10 rounded-[40px] text-white shadow-2xl shadow-primary-200 relative overflow-hidden group">
                <div className="relative z-10">
                   <h3 className="text-xl font-black uppercase tracking-tight mb-3">Policy Support?</h3>
                   <p className="text-primary-100 text-sm font-medium mb-8 leading-relaxed italic opacity-80">
                     "Need clarification on maternity cycles or sick leave accruals? Our dedicated assistance channel is available 24/7."
                   </p>
                   <button className="w-full bg-white text-primary-700 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl hover:shadow-primary-400/50 transition-all active:scale-95">
                      Open Support Ticket
                   </button>
                </div>
                {/* Patterns */}
                <div className="absolute top-[-20px] right-[-20px] w-40 h-40 bg-white/5 rounded-full blur-3xl group-hover:scale-110 transition-transform"></div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-[40px] border border-slate-100 shadow-2xl shadow-slate-200/50 min-h-[700px] overflow-hidden animate-in zoom-in-95 duration-500">
          {activePage === "applyLeave" && <ApplyLeave />}
          {activePage === "history" && <MyLeaveHistory />}
          {activePage === "approveReject" && <ApproveReject />}
          {activePage === "directory" && <EmployeeDirectory />}
          {activePage === "leaveTypes" && <LeaveTypes />}
          {activePage === "holidays" && <Holidays />}
          {activePage === "profile" && <Profile />}
          {activePage === "addEmployee" && <AddEmployee />}
          {activePage === "manageEmployees" && <ManageEmployees />}
        </div>
      )}
    </Layout>
  );
}