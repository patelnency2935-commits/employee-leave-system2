import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import "../pages/AdminDashboard.css";

function AdminDashboard() {
  return (
    <div className="admin-container">

      {/* ===== SIDEBAR ===== */}
      <div className="sidebar">
        <h2 className="logo">Admin Panel</h2>

        <nav className="nav-links">

          {/* OLD FEATURES (AS IT IS) */}
          <NavLink to="" end className="nav-item">Dashboard</NavLink>
          <NavLink to="manage-employees" className="nav-item">Manage Employees</NavLink>
          <NavLink to="add-employee" className="nav-item">Add Employee</NavLink>
          <NavLink to="leave-requests" className="nav-item">Leave Requests</NavLink>
          <NavLink to="reports" className="nav-item">Reports</NavLink>

          {/* ===== NEW 6 FEATURES ===== */}
          <NavLink to="attendance" className="nav-item">Attendance & Timesheets</NavLink>
          <NavLink to="payroll" className="nav-item">Payroll Management</NavLink>
          <NavLink to="performance" className="nav-item">Performance & Reviews</NavLink>
          <NavLink to="announcements" className="nav-item">Announcements</NavLink>
          <NavLink to="assets" className="nav-item">Assets Management</NavLink>
          <NavLink to="recruitment" className="nav-item">Recruitment</NavLink>

        </nav>

        <button className="logout-btn">Logout</button>
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <div className="main-content">
        <Outlet />
      </div>

    </div>
  );
}

export default AdminDashboard;