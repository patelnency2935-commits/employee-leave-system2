import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";
import "./AdminLeave.css";

export default function AdminLeave() {
  const [leaves, setLeaves] = useState([]);
  const navigate = useNavigate();

  
  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "admin") {
      navigate("/admin-login");
    }
  }, [navigate]);

  useEffect(() => {
    const loadLeaves = () => {
      const data = JSON.parse(localStorage.getItem("leaves") || "[]");
      setLeaves(data);
    };

    loadLeaves();
    window.addEventListener("storage", loadLeaves);

    return () => {
      window.removeEventListener("storage", loadLeaves);
    };
  }, []);

  const updateStatus = (id, newStatus) => {
    const updatedLeaves = leaves.map((leave) =>
      leave.id === id ? { ...leave, status: newStatus } : leave
    );

    setLeaves(updatedLeaves);
    localStorage.setItem("leaves", JSON.stringify(updatedLeaves));
  };

  return (
    <>
      <Navbar />

      <div className="admin-leave-container">
        <h2>Admin – Leave Requests</h2>

        <button
          onClick={() => navigate("/admin-report")}
          style={{
            padding: "10px 20px",
            marginBottom: "20px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          View Reports
        </button>

        {leaves.length === 0 && <p>No leave requests found</p>}

        {leaves.map((leave) => (
          <div key={leave.id} className="leave-card">
            <p><b>From:</b> {leave.from}</p>
            <p><b>To:</b> {leave.to}</p>
            <p><b>Type:</b> {leave.type}</p>

            <p><b>Reason:</b> {leave.reason}</p>

            
            {leave.medicalDocument && (
              <p>
                <b>Medical Certificate:</b>{" "}
                <a href={leave.medicalDocument} target="_blank" rel="noreferrer">
                  View Document
                </a>
              </p>
            )}

            <p>
              <b>Status:</b>{" "}
              <span className={`status-badge ${leave.status.toLowerCase()}`}>
                {leave.status}
              </span>
            </p>

            {leave.status === "Pending" && (
              <div className="btn-group">
                <button onClick={() => updateStatus(leave.id, "Approved")}>
                  Approve
                </button>
                <button onClick={() => updateStatus(leave.id, "Rejected")}>
                  Reject
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
