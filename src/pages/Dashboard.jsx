import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Dashboard.css";

export default function Dashboard() {
  const navigate = useNavigate();
  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    const storedLeaves = JSON.parse(localStorage.getItem("leaves")) || [];
    setLeaves(storedLeaves);
  }, []);

  const pending = leaves.filter(l => l.status === "Pending").length;
  const approved = leaves.filter(l => l.status === "Approved").length;
  const rejected = leaves.filter(l => l.status === "Rejected").length;

  
  const logout = () => {
    localStorage.removeItem("employeeLoggedIn");
    localStorage.removeItem("lastEmployeePage");
    localStorage.removeItem("role");
    navigate("/");

    
    
    
  };

  return (
    <div className="dashboard-container">
      
      <div className="dashboard-header">
        <h2>👋 Welcome, Employee</h2>
        <p>Here’s your leave overview</p>
      </div>

      <div className="summary-cards">
        <div className="card pending">
          <h3>Pending</h3>
          <p>{pending}</p>
        </div>

        <div className="card approved">
          <h3>Approved</h3>
          <p>{approved}</p>
        </div>

        <div className="card rejected">
          <h3>Rejected</h3>
          <p>{rejected}</p>
        </div>

        <div className="card total">
          <h3>Total Applied</h3>
          <p>{leaves.length}</p>
        </div>
      </div>

      <div className="actions">
        <button onClick={() => navigate("/apply-leave")}>
          Apply Leave
        </button>

        <button onClick={() => navigate("/leave-status")}>
          View Leave Status
        </button>
      </div>

      <div className="recent">
        <h3>Recent Leaves</h3>

        {leaves.length === 0 ? (
          <p>No leaves applied yet.</p>
        ) : (
          leaves
            .slice(-3)
            .reverse()
            .map((leave, index) => (
              <div
                key={index}
                className={`leave-item ${leave.status.toLowerCase()}`}
              >
                <span>{leave.type}</span>
                <span>{leave.from} → {leave.to}</span>
                <span>{leave.status}</span>
              </div>
            ))
        )}
      </div>

      <button className="logout-btn" onClick={logout}>
        Logout
      </button>
    </div>
  );
}
