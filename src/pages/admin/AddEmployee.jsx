import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiUserPlus, FiMail, FiBriefcase, FiLayers, FiShield, FiCheckCircle, FiAlertTriangle, FiInfo, FiLoader } from "react-icons/fi";

export default function AddEmployee() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    department: ""
  });

  const [departments, setDepartments] = useState([]);
  const [activePolicies, setActivePolicies] = useState([]);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMeta();
  }, []);

  const fetchMeta = async () => {
    try {
      const deptsRes = await axios.get("http://localhost:5000/api/departments");
      setDepartments(deptsRes.data);
      
      const typesRes = await axios.get("http://localhost:5000/api/leave-types");
      setActivePolicies(typesRes.data);
    } catch (err) { console.error("Error fetching metadata:", err); }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });
    try {
      await axios.post("http://localhost:5000/api/employees", formData);
      setMessage({ text: "Employee successfully registered! All leave balances have been initialized.", type: "success" });
      setFormData({ name: "", email: "", role: "", department: "" });
      
      setTimeout(() => setMessage({ text: "", type: "" }), 5000);
    } catch (err) {
      setMessage({ text: err.response?.data?.message || "Failed to register employee. Check if email is unique.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 p-8 min-h-[70vh] animate-in fade-in duration-700">
      <div className="mb-10">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center">
            <FiUserPlus className="mr-3 text-primary-600" />
            Personnel Onboarding
        </h2>
        <p className="text-slate-500 mt-2 font-medium">Initialize new employee accounts and automate leave threshold assignments.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Registration Form */}
        <div className="lg:col-span-8 bg-slate-50/50 p-8 rounded-[32px] border border-slate-100 shadow-inner">
          {message.text && (
            <div className={`flex items-center space-x-4 p-5 rounded-2xl border mb-8 animate-in slide-in-from-top-4 duration-300 ${
              message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-rose-50 text-rose-700 border-rose-100'
            }`}>
              <div className={`p-2 rounded-xl scale-125 ${message.type === 'success' ? 'bg-emerald-100' : 'bg-rose-100'}`}>
                {message.type === "success" ? <FiCheckCircle /> : <FiAlertTriangle />}
              </div>
              <span className="text-sm font-black uppercase tracking-widest">{message.text}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Legal Full Name</label>
                <div className="relative group">
                  <FiUserPlus className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors" />
                  <input 
                    name="name"
                    placeholder="e.g. Sebastian Vael"
                    className="w-full pl-12 pr-4 py-4 bg-white border-2 border-slate-100 rounded-2xl outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all font-bold text-slate-700"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Institutional Email</label>
                <div className="relative group">
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors" />
                  <input 
                    name="email"
                    type="email"
                    placeholder="name@company.com"
                    className="w-full pl-12 pr-4 py-4 bg-white border-2 border-slate-100 rounded-2xl outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all font-bold text-slate-700"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Professional Job Role</label>
                <div className="relative group">
                  <FiBriefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors" />
                  <input 
                    name="role"
                    placeholder="e.g. Senior Software Architect"
                    className="w-full pl-12 pr-4 py-4 bg-white border-2 border-slate-100 rounded-2xl outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all font-bold text-slate-700"
                    value={formData.role}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Organizational Unit</label>
                <div className="relative group">
                  <FiLayers className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors" />
                  <select 
                    name="department"
                    className="w-full pl-12 pr-4 py-4 bg-white border-2 border-slate-100 rounded-2xl outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all font-bold text-slate-700 cursor-pointer appearance-none"
                    value={formData.department}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Unit...</option>
                    {departments.map(d => <option key={d._id} value={d.name}>{d.name} ({d.shortName})</option>)}
                  </select>
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-black py-5 rounded-2xl shadow-xl shadow-primary-200 transition-all active:scale-[0.98] flex items-center justify-center space-x-3 group"
            >
              {loading ? (
                <FiLoader className="animate-spin text-2xl" />
              ) : (
                <>
                  <FiUserPlus className="text-xl group-hover:scale-110 transition-transform" />
                  <span className="text-lg uppercase tracking-[0.2em]">Authorize Registration</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Policy Summary */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/50">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                <FiShield size={20} />
              </div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight">Policy Allocation</h3>
            </div>
            
            <p className="text-xs font-bold text-slate-400 leading-relaxed mb-6 uppercase tracking-wider italic">
              * Automatic assignment of standard annual entitlement upon identity verification.
            </p>

            <div className="space-y-3">
              {activePolicies.map(p => (
                <div key={p._id} className="flex justify-between items-center p-4 bg-slate-50/50 rounded-2xl border border-slate-50 hover:border-primary-100 transition-colors group">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover:text-slate-900 transition-colors">{p.name}</span>
                  <span className="bg-white px-3 py-1.5 rounded-xl border border-slate-100 text-primary-600 font-black text-[10px] tracking-widest shadow-sm">
                    {p.defaultQuota} DAYS
                  </span>
                </div>
              ))}
              {activePolicies.length === 0 && (
                <div className="text-center py-8 opacity-40">
                  <FiInfo size={32} className="mx-auto mb-2" />
                  <p className="text-[10px] font-black uppercase tracking-widest">No Active Policies</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="p-6 bg-amber-50/50 rounded-3xl border border-amber-100/50 flex items-start space-x-4">
             <div className="p-2 bg-amber-100 text-amber-600 rounded-xl">
                <FiInfo />
             </div>
             <p className="text-[10px] text-amber-800 font-bold leading-relaxed uppercase tracking-widest">
                <b>Configuration Notice:</b> Credentials will be dispatched to the provided email instantly upon authorization.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}