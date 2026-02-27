import React, { useEffect, useState } from "react";
import axios from "axios";

function LeaveHistory() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    const res = await axios.get("http://localhost:5000/api/leaves/history");
    setHistory(res.data);
  };

  return (
    <div className="manage-container">
      <h2 className="manage-title">Leave History</h2>

      <table className="employee-table">
        <thead>
          <tr>
            <th>Employee</th>
            <th>From</th>
            <th>To</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {history.map((leave) => (
            <tr key={leave._id}>
              <td>{leave.employeeName}</td>
              <td>{leave.fromDate}</td>
              <td>{leave.toDate}</td>
              <td>{leave.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default LeaveHistory;