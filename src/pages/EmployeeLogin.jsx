import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FiUser, FiArrowRight, FiMail, FiLock, FiActivity, FiZap } from "react-icons/fi";

export default function EmployeeLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Enter email and password");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/employees/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          name: email.split("@")[0],
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Login failed");
        setLoading(false);
        return;
      }

      localStorage.setItem("user", JSON.stringify(data.employee));
      localStorage.setItem("role", "employee");

      navigate("/employee-dashboard");

    } catch (err) {
      console.error(err);
      alert("Could not connect to server. Make sure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6 relative overflow-hidden font-inter">
      {/* Decorative Orbs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-100/30 rounded-full blur-[140px] translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary-100/20 rounded-full blur-[100px] -translate-x-1/3 translate-y-1/3"></div>

      <div className="w-full max-w-[480px] relative z-10">
        <div className="bg-white rounded-[40px] shadow-2xl shadow-slate-200/60 border border-white p-10 md:p-14 animate-in fade-in zoom-in duration-700">
          <div className="flex flex-col items-center text-center mb-10">
            <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center text-white shadow-xl mb-6 group-hover:bg-slate-900 transition-colors duration-500">
              <FiUser size={28} strokeWidth={2.5} />
            </div>
            
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full mb-3">
              <FiActivity size={12} strokeWidth={3} />
              <span className="text-[10px] font-black uppercase tracking-widest">Employee Portal</span>
            </div>
            
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase mb-2">Member Login</h1>
            <p className="text-slate-500 font-medium text-sm leading-relaxed max-w-[280px]">
              Access your personal workspace, manage leave requests, and track performance.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Work Email</label>
              <div className="relative group">
                <FiMail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary-500 transition-colors" />
                <input
                  type="email"
                  placeholder="name@company.com"
                  className="w-full pl-12 pr-6 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl outline-none focus:border-primary-500 focus:bg-white transition-all font-black text-sm text-slate-700 shadow-inner"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Credentials</label>
              <div className="relative group">
                <FiLock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary-500 transition-colors" />
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full pl-12 pr-6 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl outline-none focus:border-primary-500 focus:bg-white transition-all font-black text-sm text-slate-700 shadow-inner"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 hover:bg-slate-900 text-white font-black py-5 rounded-[24px] shadow-2xl shadow-primary-200 transition-all active:scale-[0.98] flex items-center justify-center space-x-3 uppercase text-xs tracking-[0.2em] group mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>{loading ? "Authenticating..." : "Establish Access"}</span>
              {!loading && <FiArrowRight className="group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          <div className="mt-10 pt-10 border-t border-slate-50 text-center">
            <Link to="/" className="text-xs font-black text-slate-400 hover:text-blue-600 transition-colors uppercase tracking-widest flex items-center justify-center space-x-2 w-fit mx-auto group">
              <span className="group-hover:-translate-x-1 transition-transform inline-block">←</span>
              <span>Back to Portal</span>
            </Link>
          </div>
        </div>
        
        <div className="flex items-center justify-center space-x-6 mt-8">
           <div className="flex items-center space-x-2">
              <FiZap className="text-blue-400" size={12} />
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Project Build v1.0.4</span>
           </div>
           <div className="w-1 h-1 rounded-full bg-slate-200"></div>
           <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Secure Authentication</span>
        </div>
      </div>
    </div>
  );
}