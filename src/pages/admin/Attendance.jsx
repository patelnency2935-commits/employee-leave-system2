import React, { useEffect, useState } from "react";
import axios from "axios";

function Attendance() {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    const res = await axios.get("http://localhost:5000/api/attendance");
    setRecords(res.data);
  };

  return (
    <div>
      <h2>Attendance & Timesheets</h2>

      <table border="1" width="100%">
        <thead>
          <tr>
            <th>Date</th>
            <th>Check In</th>
            <th>Check Out</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {records.map(rec => (
            <tr
              key={rec._id}
              style={{
                backgroundColor: rec.isLate ? "#ffcccc" : "white"
              }}
            >
              <td>{new Date(rec.date).toLocaleDateString()}</td>
              <td>{rec.checkIn}</td>
              <td>{rec.checkOut}</td>
              <td>{rec.isLate ? "Late" : "On Time"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Attendance;