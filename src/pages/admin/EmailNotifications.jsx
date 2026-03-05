import React, { useState, useEffect } from "react";

function EmailNotifications() {

  const [employeeEmail, setEmployeeEmail] = useState("");
  const [employeeName, setEmployeeName] = useState("");
  const [leaveType, setLeaveType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [status, setStatus] = useState("");
  const [logs, setLogs] = useState([]);

  const template =
`Hello {{employee_name}},

Your {{leave_type}} leave starting from {{start_date}} has been {{status}}.

Thank You
HR Team`;

  const sendEmail = async () => {

    const response = await fetch("http://localhost:5000/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        to: employeeEmail,
        subject: "Leave Request Update",
        message: template,
        employee_name: employeeName,
        leave_type: leaveType,
        start_date: startDate,
        status: status
      })
    });

    if (response.ok) {
      alert("Email Sent Successfully");
      fetchLogs();
    }
  };

  const fetchLogs = async () => {
    const res = await fetch("http://localhost:5000/email-logs");
    const data = await res.json();
    setLogs(data);
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="manage-container">

      <style>{`
      .manage-container{
        width:90%;
        margin:auto;
        margin-top:30px;
        font-family:Arial, Helvetica, sans-serif;
      }

      .manage-container h2{
        font-size:28px;
        margin-bottom:20px;
      }

      .manage-container h3{
        margin-top:30px;
        margin-bottom:10px;
        font-size:20px;
      }

      .manage-container input,
      .manage-container select{
        display:block;
        width:300px;
        padding:10px;
        margin-bottom:10px;
        border:1px solid #ccc;
        border-radius:6px;
        font-size:14px;
        outline:none;
        transition:0.2s;
      }

      .manage-container input:focus,
      .manage-container select:focus{
        border-color:#2563eb;
        box-shadow:0 0 3px rgba(37,99,235,0.4);
      }

      .manage-container button{
        background:#2563eb;
        color:white;
        padding:10px 20px;
        border:none;
        border-radius:6px;
        cursor:pointer;
        font-size:14px;
        transition:0.2s;
        margin-top:5px;
      }

      .manage-container button:hover{
        background:#1e40af;
      }

      .manage-container table{
        width:100%;
        margin-top:15px;
        border-collapse:collapse;
        background:white;
        box-shadow:0 2px 8px rgba(0,0,0,0.1);
      }

      .manage-container th{
        background:#2563eb;
        color:white;
        padding:12px;
        text-align:left;
      }

      .manage-container td{
        padding:10px;
        border-bottom:1px solid #eee;
      }

      .manage-container tr:hover{
        background:#f3f4f6;
      }
      `}</style>

      <h2>Email Notifications</h2>

      <input
        placeholder="Employee Email"
        value={employeeEmail}
        onChange={(e) => setEmployeeEmail(e.target.value)}
      />

      <input
        placeholder="Employee Name"
        value={employeeName}
        onChange={(e) => setEmployeeName(e.target.value)}
      />

      <input
        placeholder="Leave Type"
        value={leaveType}
        onChange={(e) => setLeaveType(e.target.value)}
      />

      <input
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
      />

      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
      >
        <option>Approved</option>
        <option>Rejected</option>
        <option>Pending</option>
      </select>

      <button onClick={sendEmail}>
        Send Email
      </button>

      <h3>Email Logs</h3>

      <table>

        <thead>
          <tr>
            <th>Email</th>
            <th>Subject</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>

        <tbody>

          {logs.map((log, index) => (
            <tr key={index}>
              <td>{log.to}</td>
              <td>{log.subject}</td>
              <td>{log.status}</td>
              <td>{new Date(log.date).toLocaleString()}</td>
            </tr>
          ))}

        </tbody>

      </table>

    </div>
  );
}

export default EmailNotifications;