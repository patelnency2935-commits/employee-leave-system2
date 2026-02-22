import React from "react";

function Sidebar({ setActivePage }) {
  return (
    <div className="sidebar">
      <h2>Admin Panel</h2>

      <button onClick={() => setActivePage("dashboard")}>
        Dashboard
      </button>

      <button onClick={() => setActivePage("employees")}>
        Manage Employees
      </button>

      <button onClick={() => setActivePage("addEmployee")}>
        Add Employee
      </button>

      <button onClick={() => setActivePage("leaves")}>
        Leave Requests
      </button>

      <button onClick={() => setActivePage("reports")}>
        Reports
      </button>

      <button className="logout-btn">Logout</button>
    </div>
  );
}

export default Sidebar;