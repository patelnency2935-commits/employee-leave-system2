import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import EmployeeLogin from "./pages/EmployeeLogin";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AddEmployee from "./Components/AddEmployee";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/employee-login" element={<EmployeeLogin />} />
        <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
        <Route path="/admin-login" element={<AdminLogin />} />

        {/* ✅ ADMIN DASHBOARD WITH SIDEBAR LAYOUT */}
        <Route path="/admin-dashboard" element={<AdminDashboard />}>
          <Route index element={<h1>Welcome Admin</h1>} />
          <Route path="manage-employees" element={<h1>Manage Employees Page</h1>} />
          <Route path="add-employee" element={<AddEmployee />} />
          <Route path="leave-requests" element={<h1>Leave Requests Page</h1>} />
          <Route path="reports" element={<h1>Reports Page</h1>} />
          <Route path="attendance" element={<h1>Attendance & Timesheets</h1>} />
          <Route path="payroll" element={<h1>Payroll Management</h1>} />
          <Route path="performance" element={<h1>Performance & Reviews</h1>} />
          <Route path="announcements" element={<h1>Announcements / Notice Board</h1>} />
          <Route path="assets" element={<h1>Assets Management</h1>} />
          <Route path="recruitment" element={<h1>Recruitment (Hiring)</h1>} />

          
          
          
          
          
        </Route>
      </Routes>
    </Router>
  );
}

export default App;