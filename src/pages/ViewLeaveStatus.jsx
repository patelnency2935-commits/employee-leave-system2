import { useEffect, useState } from "react";

export default function ViewLeaveStatus() {

  const [leaves, setLeaves] = useState([]);

  const loadLeaves = () => {
    const data = JSON.parse(localStorage.getItem("leaves")) || [];
    setLeaves(data);
  };

  useEffect(() => {
    loadLeaves();
    window.addEventListener("storage", loadLeaves);

    return () => window.removeEventListener("storage", loadLeaves);
  }, []);

  return (
    <div className="status-container">
      <h2>My Leave Status</h2>

      {leaves.length === 0 ? (
        <p className="no-leave">No leave applied yet</p>
      ) : (
        leaves.map((leave) => (
          <div className="leave-card" key={leave.id}>
            <div className="card-header">
              <h4>{leave.type}</h4>

              <span className={`status-badge ${leave.status.toLowerCase()}`}>
                {leave.status}
              </span>
            </div>

            <p><strong>From:</strong> {leave.from}</p>
            <p><strong>To:</strong> {leave.to}</p>
            <p><strong>Reason:</strong> {leave.reason}</p>

            {/* ✅ Medical Certificate View Added */}
            {leave.document && (
              <p>
                <strong>Medical Certificate:</strong>{" "}
                <a href={leave.document} target="_blank" rel="noreferrer">
                  View Document
                </a>
              </p>
            )}

          </div>
        ))
      )}
    </div>
  );
}
