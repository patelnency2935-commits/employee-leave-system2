import React from "react";
import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <div className="sidebar">
      <h2>Admin Panel</h2>

      <Link to="/admin-dashboard">
        <button>Dashboard</button>
      </Link>

      <Link to="/admin-dashboard/manage-employees">
        <button>Manage Employees</button>
      </Link>

      <Link to="/admin-dashboard/add-employee">
        <button>Add Employee</button>
      </Link>

      <Link to="/admin-dashboard/leave-requests">
        <button>Leave Requests</button>
      </Link>

      {/* ✅ NEW FEATURES */}

      <Link to="/admin-dashboard/leave-history">
        <button>Leave History</button>
      </Link>

      <Link to="/admin-dashboard/departments">
        <button>Departments</button>
      </Link>

      <Link to="/admin-dashboard/leave-balance">
        <button>Leave Balance</button>
      </Link>

      <Link to="/admin-dashboard/calendar">
        <button>Calendar View</button>
      </Link>

      <button className="logout-btn">Logout</button>
    </div>
  );
}

export default Sidebar;