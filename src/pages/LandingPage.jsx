import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowRight, FiShield, FiUser, FiMail, FiLock, FiCalendar, FiCheckCircle, FiLoader, FiClock } from "react-icons/fi";

export default function LandingPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "employee",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (formData.role === "admin") {
        if (formData.email === "admin@gmail.com" && formData.password === "1234") {
          localStorage.setItem("role", "admin");
          navigate("/admin-dashboard");
        } else {
          alert("Invalid Admin Credentials");
        }
      } else {
        const res = await fetch("http://localhost:5000/api/employees/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email.trim().toLowerCase(),
            name: formData.email.split("@")[0],
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
      }
    } catch (err) {
      console.error(err);
      alert("Server connection failed. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfdfe] flex items-center justify-center p-6 font-inter overflow-hidden relative">
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-blue-50 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 -z-10"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-50/50 rounded-full blur-[120px] translate-x-1/4 translate-y-1/4 -z-10"></div>

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-white/40 backdrop-blur-2xl rounded-[40px] border border-white shadow-2xl p-8 lg:p-16">
        
        {/* Left Section: Information */}
        <div className="flex flex-col justify-center">
          <div className="flex items-center space-x-3 text-blue-600 mb-8">
            <FiCalendar size={24} strokeWidth={2.5} />
            <span className="text-xs font-black uppercase tracking-[0.3em]">Management Suite</span>
          </div>

          <h1 className="text-5xl lg:text-6xl font-black text-slate-900 leading-[1.1] tracking-tighter mb-8">
            Employee Leave <br />
            <span className="text-blue-600">Management System.</span>
          </h1>
          
          <p className="text-lg text-slate-500 font-medium leading-relaxed mb-10 max-w-md">
            A comprehensive solution for managing employee presence, streamlining request workflows, and maintaining organizational schedules.
          </p>

          <div className="space-y-6">
            {[
              { icon: <FiClock />, text: "Real-time Leave Tracking & Requests", color: "bg-blue-50 text-blue-600" },
              { icon: <FiCheckCircle />, text: "Automated Approval Workflows", color: "bg-emerald-50 text-emerald-600" },
              { icon: <FiCalendar />, text: "Institutional Holiday Calendar", color: "bg-indigo-50 text-indigo-600" }
            ].map((feature, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm ${feature.color}`}>
                  {feature.icon}
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-slate-600">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Section: Login Panel */}
        <div className="flex flex-col items-center">
          <div className="w-full max-w-[440px] bg-white rounded-[32px] shadow-2xl shadow-slate-200/50 border border-slate-50 p-10 md:p-12">
            <div className="mb-10">
              <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase mb-2">System Portal</h2>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Please select your access role</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="grid grid-cols-2 gap-3 mb-8">
                <button 
                  type="button"
                  disabled={loading}
                  onClick={() => setFormData({...formData, role: 'employee'})}
                  className={`flex items-center justify-center space-x-2 py-4 rounded-2xl border-2 transition-all font-black text-[10px] uppercase tracking-widest ${formData.role === 'employee' ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-md' : 'border-slate-50 bg-slate-50 text-slate-400 hover:border-slate-200'}`}
                >
                  <FiUser size={18} />
                  <span>Employee Login</span>
                </button>
                <button 
                  type="button"
                  disabled={loading}
                  onClick={() => setFormData({...formData, role: 'admin'})}
                  className={`flex items-center justify-center space-x-2 py-4 rounded-2xl border-2 transition-all font-black text-[10px] uppercase tracking-widest ${formData.role === 'admin' ? 'border-slate-900 bg-slate-900 text-white shadow-xl' : 'border-slate-50 bg-slate-50 text-slate-400 hover:border-slate-200'}`}
                >
                  <FiShield size={18} />
                  <span>Admin Login</span>
                </button>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Account Email</label>
                  <div className="relative group">
                    <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                    <input
                      type="email"
                      name="email"
                      className="w-full pl-11 pr-5 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl outline-none focus:border-blue-600 focus:bg-white transition-all font-black text-sm text-slate-700 shadow-inner"
                      placeholder="email@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
                  <div className="relative group">
                    <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                    <input
                      type="password"
                      name="password"
                      className="w-full pl-11 pr-5 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl outline-none focus:border-blue-600 focus:bg-white transition-all font-black text-sm text-slate-700 shadow-inner"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className={`w-full mt-8 flex items-center justify-center space-x-3 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all active:scale-[0.98] shadow-2xl ${
                  formData.role === 'admin' 
                  ? 'bg-slate-900 hover:bg-slate-800 text-white shadow-slate-200' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200'
                } disabled:opacity-50`}
              >
                <span>{loading ? "Establishing Connection..." : "Login to Dashboard"}</span>
                {loading ? <FiLoader className="animate-spin" /> : <FiArrowRight className="group-hover:translate-x-1" />}
              </button>
            </form>
          </div>
          
          <div className="mt-8 flex items-center space-x-2">
             <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
             <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">
               College Project Build v1.0.4
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}






