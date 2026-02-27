import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import EmployeeLogin from "./pages/EmployeeLogin";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import Profile from "./pages/Profile";

// ✅ ADMIN PAGES
import Dashboard from "./pages/admin/Dashboard";
import ManageEmployees from "./pages/admin/ManageEmployees";
import AddEmployee from "./pages/admin/AddEmployee";
import LeaveRequests from "./pages/admin/LeaveRequests";
import Reports from "./pages/admin/Reports";
import Attendance from "./pages/admin/Attendance";
import Payroll from "./pages/admin/Payroll";
import Performance from "./pages/admin/Performance";
import Announcements from "./pages/admin/Announcements";
import Assets from "./pages/admin/Assets";
import Recruitment from "./pages/admin/Recruitment";

/* ✅ NEW PAGES */
import LeaveHistory from "./pages/admin/LeaveHistory";
import Departments from "./pages/admin/Departments";
import LeaveBalance from "./pages/admin/LeaveBalance";
import CalendarView from "./pages/admin/CalendarView";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/employee-login" element={<EmployeeLogin />} />
        <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin-login" element={<AdminLogin />} />

        <Route path="/admin-dashboard" element={<AdminDashboard />}>

          <Route index element={<Dashboard />} />

          <Route path="manage-employees" element={<ManageEmployees />} />
          <Route path="add-employee" element={<AddEmployee />} />
          <Route path="leave-requests" element={<LeaveRequests />} />
          <Route path="leave-history" element={<LeaveHistory />} />
          <Route path="departments" element={<Departments />} />
          <Route path="leave-balance" element={<LeaveBalance />} />
          <Route path="calendar" element={<CalendarView />} />

          <Route path="reports" element={<Reports />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="payroll" element={<Payroll />} />
          <Route path="performance" element={<Performance />} />
          <Route path="announcements" element={<Announcements />} />
          <Route path="assets" element={<Assets />} />
          <Route path="recruitment" element={<Recruitment />} />

        </Route>

      </Routes>
    </Router>
  );
}

export default App;