import React, { useEffect, useState } from "react";
import axios from "axios";
import "./LeaveRequests.css";

function LeaveRequests() {
  const [leaves, setLeaves] = useState([]);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    const res = await axios.get("http://localhost:5000/api/leaves");
    setLeaves(res.data);
  };

  const updateStatus = async (id, status) => {
    await axios.put(`http://localhost:5000/api/leaves/${id}`, { status });
    fetchLeaves();
  };

  const filteredLeaves =
    filter === "All"
      ? leaves
      : leaves.filter((leave) => leave.status === filter);

  return (
    <div className="leave-container">
      <div className="leave-header">
        <h2>Leave Requests</h2>

        <select
          className="filter-dropdown"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      <div className="leave-list">
        {filteredLeaves.map((leave) => (
          <div key={leave._id} className="leave-card">
            <div className="leave-details">
              <h4>{leave.employee}</h4>

              <p><strong>Leave Type:</strong> {leave.type}</p>
              <p><strong>From:</strong> {new Date(leave.from).toLocaleDateString()}</p>
              <p><strong>To:</strong> {new Date(leave.to).toLocaleDateString()}</p>
              <p><strong>Reason:</strong> {leave.reason}</p>
            </div>

            <div className="leave-actions">
              <span className={`status-badge ${leave.status.toLowerCase()}`}>
                {leave.status}
              </span>

              {leave.status === "Pending" && (
                <div className="action-buttons">
                  <button
                    className="btn approve"
                    onClick={() => updateStatus(leave._id, "Approved")}
                  >
                    Approve
                  </button>

                  <button
                    className="btn reject"
                    onClick={() => updateStatus(leave._id, "Rejected")}
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LeaveRequests;