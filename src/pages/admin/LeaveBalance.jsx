import React, { useState } from "react";

function LeaveBalance() {
  const [annualLeaves, setAnnualLeaves] = useState(20);

  return (
    <div className="manage-container">
      <h2 className="manage-title">Leave Balance Settings</h2>

      <input
        type="number"
        className="search-input"
        value={annualLeaves}
        onChange={(e) => setAnnualLeaves(e.target.value)}
      />

      <p>Each employee gets {annualLeaves} leaves per year.</p>
    </div>
  );
}

export default LeaveBalance;