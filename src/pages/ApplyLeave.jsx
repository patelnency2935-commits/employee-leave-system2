import { useState } from "react";
import "./ApplyLeave.css";

// MongoDB ObjectId is exactly 24 hex characters
const isValidObjectId = (id) => /^[a-f\d]{24}$/i.test(id);

// If user has a stale fake ID (e.g. from Date.now()), quietly fetch the real one from DB
async function getValidUser() {
  const userData = localStorage.getItem("user");
  if (!userData) return null;

  let user = JSON.parse(userData);

  if (!isValidObjectId(user._id)) {
    try {
      const emailToUse = user.email || `employee_${Date.now()}@company.com`;
      const nameToUse  = user.name || "Employee";

      const res = await fetch("http://localhost:5000/api/employees/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailToUse, name: nameToUse }),
      });
      const data = await res.json();
      if (res.ok && data.employee) {
        user = data.employee;
        localStorage.setItem("user", JSON.stringify(user));
      }
    } catch (e) {
      console.error("Re-register error:", e);
    }
  }

  return user;
}

export default function ApplyLeave() {
  const [leaveType, setLeaveType] = useState("");
  const [from, setFrom]           = useState("");
  const [to, setTo]               = useState("");
  const [reason, setReason]       = useState("");
  const [loading, setLoading]     = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg]     = useState("");

  const applyLeave = async (e) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");

    if (!leaveType || !from || !to || !reason) {
      setErrorMsg("Please fill in all fields.");
      return;
    }

    const startDate  = new Date(from);
    const endDate    = new Date(to);
    const today      = new Date();
    const totalDays  = (endDate - startDate) / (1000 * 60 * 60 * 24) + 1;
    const noticeDays = (startDate - today) / (1000 * 60 * 60 * 24);

    if (endDate < startDate) {
      setErrorMsg("End date cannot be before start date.");
      return;
    }
    if (leaveType === "Casual" && noticeDays < 2) {
      setErrorMsg("Casual Leave requires at least 2 days' notice.");
      return;
    }
    if (leaveType === "Maternity" && totalDays > 90) {
      setErrorMsg("Maternity leave cannot exceed 90 days.");
      return;
    }

    setLoading(true);

    // Auto-fix stale/fake IDs before submitting leave
    const user = await getValidUser();

    if (!user || !user._id || !isValidObjectId(user._id)) {
      setErrorMsg("Could not verify your account. Please logout and login again.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/leaves", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employee: user._id,
          type: leaveType,
          startDate: from,
          endDate: to,
          reason: reason,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMsg(data.message || "Failed to apply leave.");
        setLoading(false);
        return;
      }

      setSuccessMsg("✅ Leave applied successfully! Redirecting to dashboard…");
      setLeaveType("");
      setFrom("");
      setTo("");
      setReason("");

      setTimeout(() => {
        window.dispatchEvent(new Event("leaveUpdated"));
        setSuccessMsg("");
      }, 1800);

    } catch (error) {
      console.error("Error:", error);
      setErrorMsg("Server error. Please make sure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="apply-container">
      <h2>Apply for Leave</h2>
      <p className="apply-subtitle">Fill in the details below to submit your leave request.</p>

      {successMsg && <div className="apply-alert apply-alert-success">{successMsg}</div>}
      {errorMsg   && <div className="apply-alert apply-alert-error">{errorMsg}</div>}

      <form onSubmit={applyLeave}>
        <div className="form-group">
          <label>Leave Type</label>
          <select value={leaveType} onChange={(e) => setLeaveType(e.target.value)} required>
            <option value="">Select Leave Type</option>
            <option value="Casual">Casual Leave</option>
            <option value="Sick">Sick Leave</option>
            <option value="Paid">Paid Leave</option>
            <option value="Unpaid">Unpaid Leave</option>
            <option value="Maternity">Maternity Leave</option>
          </select>
        </div>

        <div className="form-group">
          <label>From Date</label>
          <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} required />
        </div>

        <div className="form-group">
          <label>To Date</label>
          <input type="date" value={to} onChange={(e) => setTo(e.target.value)} required />
        </div>

        <div className="form-group">
          <label>Reason</label>
          <textarea
            rows="3"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Briefly describe the reason for your leave request…"
            required
          />
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Submitting…" : "Submit Leave Request"}
        </button>
      </form>
    </div>
  );
}
