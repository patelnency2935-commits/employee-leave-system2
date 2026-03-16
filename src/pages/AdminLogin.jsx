import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FiShield, FiArrowRight, FiMail, FiLock, FiCheckCircle } from "react-icons/fi";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    if (email === "admin@gmail.com" && password === "1234") {
      localStorage.setItem("role", "admin");
      navigate("/admin-dashboard");
    } else {
      alert("Invalid Admin Credentials");
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6 relative overflow-hidden font-inter">
      {/* Decorative Orbs */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary-100/30 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-indigo-100/30 rounded-full blur-[100px] translate-x-1/3 translate-y-1/3"></div>

      <div className="w-full max-w-[480px] relative z-10">
        <div className="bg-white rounded-[40px] shadow-2xl shadow-slate-200/60 border border-white p-10 md:p-14 animate-in fade-in zoom-in duration-700">
          <div className="flex flex-col items-center text-center mb-10">
            <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-xl mb-6 group-hover:bg-primary-600 transition-colors duration-500">
              <FiShield size={28} strokeWidth={2.5} />
            </div>
            
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-primary-50 text-primary-600 rounded-full mb-3">
              <FiCheckCircle size={12} strokeWidth={3} />
              <span className="text-[10px] font-black uppercase tracking-widest">Authorized Access Only</span>
            </div>
            
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase mb-2">Admin Engine</h1>
            <p className="text-slate-500 font-medium text-sm leading-relaxed max-w-[280px]">
              Authenticate to initialize administrative protocols and manage systems.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Command Identity</label>
              <div className="relative group">
                <FiMail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary-500 transition-colors" />
                <input
                  type="email"
                  placeholder="admin@console.net"
                  className="w-full pl-12 pr-6 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl outline-none focus:border-primary-500 focus:bg-white transition-all font-black text-sm text-slate-700 shadow-inner"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Access Token</label>
              <div className="relative group">
                <FiLock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary-500 transition-colors" />
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full pl-12 pr-6 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl outline-none focus:border-primary-500 focus:bg-white transition-all font-black text-sm text-slate-700 shadow-inner"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-slate-900 hover:bg-primary-600 text-white font-black py-5 rounded-[24px] shadow-2xl shadow-slate-300 transition-all active:scale-[0.98] flex items-center justify-center space-x-3 uppercase text-xs tracking-[0.2em] group mt-4"
            >
              <span>Initialize Session</span>
              <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-10 pt-10 border-t border-slate-50 text-center">
            <Link to="/" className="text-xs font-black text-slate-400 hover:text-blue-600 transition-colors uppercase tracking-widest flex items-center justify-center space-x-2 w-fit mx-auto group">
              <span className="group-hover:-translate-x-1 transition-transform inline-block">←</span>
              <span>Back to Portal</span>
            </Link>
          </div>
        </div>
        
        <p className="text-center mt-8 text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">
          Project Build v1.0.4 • Secure Session
        </p>
      </div>
    </div>
  );
}
