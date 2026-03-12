import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaCalendarAlt, FaPlus, FaTrash, FaChevronLeft, FaChevronRight, FaDotCircle, FaEdit } from "react-icons/fa";

export default function Holidays() {
  const [holidays, setHolidays] = useState([]);
  const [form, setForm] = useState({ occasion: "", date: "" });
  const [editingId, setEditingId] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const today = new Date();

  useEffect(() => {
    fetchHolidays();
  }, []);

  const fetchHolidays = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/holidays");
      setHolidays(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (e) => {
    e.preventDefault();
    if (!form.occasion || !form.date) return alert("Please enter both occasion and date!");

    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/api/holidays/${editingId}`, form);
        alert("Holiday updated! ✅");
        setEditingId(null);
      } else {
        await axios.post("http://localhost:5000/api/holidays", form);
        alert("Holiday added! 🎉");
      }
      setForm({ occasion: "", date: "" });
      fetchHolidays();
    } catch (err) {
      console.error("Action Error:", err);
      const errMsg = err.response?.data?.error || err.message || "Connection refused";
      alert(`Error saving holiday: ${errMsg}. Check if the Backend Server is running.`);
    }
  };

  const deleteHoliday = async (id) => {
    if (!window.confirm("Remove this holiday permanently?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/holidays/${id}`);
      fetchHolidays();
    } catch (err) {
      console.error(err);
    }
  };

  const editHoliday = (h) => {
    setEditingId(h._id);
    const d = new Date(h.date);
    const dateStr = d.getUTCFullYear() + "-" + 
                   String(d.getUTCMonth() + 1).padStart(2, "0") + "-" + 
                   String(d.getUTCDate()).padStart(2, "0");
    setForm({ occasion: h.occasion, date: dateStr });
  };

  // Calendar Helpers
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  const resetToToday = () => setCurrentDate(new Date());

  const renderDays = () => {
    const cells = [];
    for (let i = 0; i < firstDay; i++) {
      cells.push(<div key={`empty-${i}`} className="calendar-cell empty"></div>);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const yyyy = currentDate.getFullYear();
      const mm = String(currentDate.getMonth() + 1).padStart(2, '0');
      const dd = String(d).padStart(2, '0');
      const dateStr = `${yyyy}-${mm}-${dd}`;
      
      const dayHolidays = holidays.filter(h => {
        const hDate = new Date(h.date);
        const hStr = hDate.getUTCFullYear() + "-" + 
                    String(hDate.getUTCMonth() + 1).padStart(2, "0") + "-" + 
                    String(hDate.getUTCDate()).padStart(2, "0");
        return hStr === dateStr;
      });

      const isToday = d === today.getDate() && currentDate.getMonth() === today.getMonth() && currentDate.getFullYear() === today.getFullYear();

      cells.push(
        <div 
          key={d} 
          className={`calendar-cell ${isToday ? "today" : ""} ${dayHolidays.length > 0 ? "has-holiday" : ""}`}
          onClick={() => { setForm({ ...form, date: dateStr }); setEditingId(null); }}
        >
          <span className="day-number">{d}</span>
          {dayHolidays.map(h => (
            <div key={h._id} className="holiday-mini-tag" onClick={(e) => { e.stopPropagation(); editHoliday(h); }}>
              {h.occasion}
            </div>
          ))}
        </div>
      );
    }
    return cells;
  };

  return (
    <div className="admin-section" style={{ 
        padding: "30px", 
        minHeight: "80vh", 
        borderRadius: "20px", 
        boxShadow: "0 10px 40px -10px rgba(0,0,0,0.05)",
        background: "#fff",
        border: "1px solid #e2e8f0"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
        <div>
           <h2 className="admin-section-title" style={{ margin: 0, fontSize: "24px" }}>📅 Holiday Calendar</h2>
           <p style={{ margin: "5px 0 0 0", opacity: 0.6, fontSize: "14px" }}>Plan and broadcast corporate holidays to your organization.</p>
        </div>
        <div className="calendar-nav-pro">
          <button onClick={resetToToday} className="nav-btn-pro active">Today</button>
          <button onClick={prevMonth} className="nav-btn-pro"><FaChevronLeft /></button>
          <span className="current-month-label-pro">
            {currentDate.toLocaleString("default", { month: "long" })} {currentDate.getFullYear()}
          </span>
          <button onClick={nextMonth} className="nav-btn-pro"><FaChevronRight /></button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "30px" }}>
        {/* Left: Interactive Calendar */}
        <div className="calendar-card-pro" style={{ border: "1px solid #f1f5f9", borderRadius: "16px", overflow: "hidden", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.02)" }}>
          <div className="calendar-grid-header-pro">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
              <div key={day} className="grid-header-cell-pro">{day}</div>
            ))}
          </div>
          <div className="calendar-grid-body-pro">
            {renderDays()}
          </div>
        </div>

        {/* Right: Management Panel */}
        <div className="control-panel-pro" style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
          <div style={{ padding: "24px", background: "#f8fafc", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
            <h3 style={{ marginTop: 0, fontSize: "15px", marginBottom: "15px", display: "flex", alignItems: "center", gap: "8px" }}>
                {editingId ? <FaEdit style={{ color: "#2563eb" }} /> : <FaPlus style={{ color: "#10b981" }} />}
                {editingId ? "Edit Holiday" : "New Holiday"}
            </h3>
            <form onSubmit={handleAction} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
              <input 
                className="calendar-input-pro"
                placeholder="e.g. Independence Day" 
                value={form.occasion} 
                onChange={e => setForm({...form, occasion: e.target.value})} 
                required 
              />
              <input 
                className="calendar-input-pro"
                type="date" 
                value={form.date} 
                onChange={e => setForm({...form, date: e.target.value})} 
                required 
              />
              <div style={{ display: "flex", gap: "8px" }}>
                <button type="submit" className="submit-btn-pro">
                  {editingId ? "Update" : "Confirm"}
                </button>
                {editingId && (
                  <button type="button" onClick={() => { setEditingId(null); setForm({occasion:"", date:""}); }} className="cancel-btn-pro">✕</button>
                )}
              </div>
            </form>
          </div>

          <div>
            <h3 style={{ fontSize: "15px", marginBottom: "15px", color: "#1e293b", fontWeight: "700" }}>📌 Upcoming Dates</h3>
            <div className="upcoming-list-pro">
              {loading ? <p style={{ fontSize: "13px", color: "#64748b" }}>Syncing...</p> : holidays
                .filter(h => new Date(h.date) >= new Date().setHours(0,0,0,0))
                .sort((a,b) => new Date(a.date) - new Date(b.date))
                .slice(0, 4)
                .map(h => (
                <div key={h._id} className="upcoming-item-pro">
                  <div style={{ flex: 1 }}>
                     <div style={{ fontWeight: "700", fontSize: "14px", color: "#1e293b" }}>{h.occasion}</div>
                     <div style={{ fontSize: "11px", color: "#94a3b8", textTransform: "uppercase", fontWeight: "600" }}>{new Date(h.date).toLocaleDateString(undefined, { month: 'long', day: 'numeric' })}</div>
                  </div>
                  <button onClick={() => deleteHoliday(h._id)} className="delete-btn-pro"><FaTrash /></button>
                </div>
              ))}
              {holidays.length === 0 && <p style={{ fontSize: "13px", color: "#94a3b8", textAlign: "center", padding: "20px" }}>No holidays found.</p>}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .calendar-nav-pro { display: flex; align-items: center; gap: 8px; background: #f8fafc; padding: 6px; border-radius: 14px; border: 1px solid #e2e8f0; }
        .nav-btn-pro { background: #fff; border: 1px solid #e2e8f0; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; border-radius: 10px; cursor: pointer; color: #1e293b; transition: 0.2s; font-size: 12px; }
        .nav-btn-pro.active { width: auto; padding: 0 15px; background: #fff; font-weight: 700; color: #2563eb; border-color: #2563eb; }
        .nav-btn-pro:hover { background: #eff6ff; border-color: #2563eb; color: #2563eb; }
        .current-month-label-pro { font-weight: 800; color: #1e293b; min-width: 140px; text-align: center; font-size: 15px; }
        
        .calendar-grid-header-pro { display: grid; grid-template-columns: repeat(7, 1fr); background: #f8fafc; border-bottom: 2px solid #f1f5f9; }
        .grid-header-cell-pro { padding: 15px; text-align: center; font-size: 10px; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.12em; }
        
        .calendar-grid-body-pro { display: grid; grid-template-columns: repeat(7, 1fr); gap: 1px; background: #f1f5f9; }
        .calendar-cell { background: #fff; height: 100px; padding: 10px; display: flex; flex-direction: column; gap: 6px; position: relative; transition: 0.2s; cursor: pointer; }
        .calendar-cell:hover { background: #fdfdfd; z-index: 2; box-shadow: inset 0 0 0 2px #2563eb; }
        .calendar-cell.empty { background: #fafafa; pointer-events: none; }
        .calendar-cell.today { background: #eff6ff; }
        .calendar-cell.today .day-number { background: #2563eb; color: #fff; width: 22px; height: 22px; border-radius: 6px; }
        
        .day-number { font-size: 12px; font-weight: 800; color: #64748b; width: 22px; height: 22px; display: flex; align-items: center; justify-content: center; }
        .has-holiday { background: #fffbeb !important; }
        
        .holiday-mini-tag { background: #10b981; color: #fff; padding: 4px 8px; border-radius: 6px; font-size: 10px; font-weight: 800; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; box-shadow: 0 2px 4px rgba(16, 185, 129, 0.2); }
        
        .calendar-input-pro { padding: 12px 15px; border-radius: 12px; border: 1px solid #cbd5e1; outline: none; transition: 0.2s; font-size: 14px; background: #fff; }
        .calendar-input-pro:focus { border-color: #2563eb; box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1); }
        
        .submit-btn-pro { flex: 1; background: #2563eb; color: #fff; border: none; padding: 14px; border-radius: 12px; font-weight: 800; cursor: pointer; transition: 0.2s; font-size: 14px; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2); }
        .submit-btn-pro:hover { background: #1d4ed8; transform: translateY(-2px); }
        .cancel-btn-pro { background: #fff; border: 1px solid #e2e8f0; width: 46px; border-radius: 12px; cursor: pointer; color: #64748b; font-weight: bold; }
        
        .upcoming-item-pro { display: flex; align-items: center; background: #fff; padding: 15px; border-radius: 14px; border: 1px solid #f1f5f9; transition: 0.2s; margin-bottom: 10px; }
        .upcoming-item-pro:hover { transform: scale(1.02); border-color: #2563eb; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.05); }
        .delete-btn-pro { background: #fff1f2; border: 1px solid #fee2e2; width: 34px; height: 34px; border-radius: 8px; color: #e11d48; cursor: pointer; transition: 0.2s; display: flex; align-items: center; justify-content: center; font-size: 12px; }
        .delete-btn-pro:hover { background: #e11d48; color: #fff; transform: rotate(15deg); }
      `}</style>
    </div>
  );
}
