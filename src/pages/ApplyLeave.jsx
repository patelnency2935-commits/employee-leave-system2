import { useState } from "react";
import "./ApplyLeave.css";

export default function ApplyLeave() {
  const [leaveType, setLeaveType] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [reason, setReason] = useState("");
  const [documentPreview, setDocumentPreview] = useState("");

  const applyLeave = async () => {
    if (!leaveType || !from || !to || !reason) {
      alert("Please fill all fields");
      return;
    }

    const startDate = new Date(from);
    const endDate = new Date(to);
    const today = new Date();

    if (endDate < startDate) {
      alert("End date cannot be before start date.");
      return;
    }

    const diffTime = endDate - startDate;
    const totalDays = diffTime / (1000 * 60 * 60 * 24) + 1;
    const noticeDays = (startDate - today) / (1000 * 60 * 60 * 24);

    if (leaveType === "Casual Leave" && noticeDays < 2) {
      alert("Casual Leave requires minimum 2 days advance notice.");
      return;
    }

    if (leaveType === "Maternity Leave" && totalDays > 90) {
      alert("Maternity Leave cannot exceed 90 days.");
      return;
    }

    if (leaveType === "Sick Leave" && totalDays > 2 && !documentPreview) {
      alert("Medical certificate required for Sick Leave more than 2 days.");
      return;
    }

    try {
      // ✅ GET LOGGED IN USER
      const user = JSON.parse(localStorage.getItem("user"));
      const employeeName = user?.name;

      await fetch("http://localhost:5000/api/leaves", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          employee: employeeName,   // ✅ IMPORTANT FIX
          type: leaveType,
          from,
          to,
          reason,
          totalDays,
          status: "Pending",
          medicalDocument: documentPreview || null,
        }),
      });

      alert("Leave applied successfully!");

      setLeaveType("");
      setFrom("");
      setTo("");
      setReason("");
      setDocumentPreview("");
    } catch (error) {
      console.error("Error applying leave:", error);
      alert("Error applying leave");
    }
  };

  return (
    <div className="apply-container">
      <h2>Apply Leave</h2>

      <div className="form-group">
        <label>Leave Type</label>
        <select
          value={leaveType}
          onChange={(e) => setLeaveType(e.target.value)}
        >
          <option value="">Select Leave Type</option>
          <option value="Casual Leave">Casual Leave</option>
          <option value="Sick Leave">Sick Leave</option>
          <option value="Paid Leave">Paid Leave</option>
          <option value="Unpaid Leave">Unpaid Leave</option>
          <option value="Maternity Leave">Maternity Leave</option>
        </select>
      </div>

      <div className="form-group">
        <label>From Date</label>
        <input
          type="date"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>To Date</label>
        <input
          type="date"
          value={to}
          onChange={(e) => setTo(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Reason</label>
        <textarea
          rows="3"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Enter reason for leave"
        />
      </div>

      {leaveType === "Sick Leave" && (
        <div className="form-group">
          <label>
            Upload Medical Certificate (Required if &gt; 2 days)
          </label>
          <input
            type="file"
            accept="image/*,.pdf"
            onChange={(e) => {
              const file = e.target.files[0];
              if (!file) return;

              const reader = new FileReader();
              reader.onloadend = () => {
                setDocumentPreview(reader.result);
              };
              reader.readAsDataURL(file);
            }}
          />
        </div>
      )}

      <button className="submit-btn" onClick={applyLeave}>
        Submit Leave
      </button>
    </div>
  );
}