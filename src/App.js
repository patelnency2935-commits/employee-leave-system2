import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


import LandingPage from "./pages/LandingPage";
import EmployeeLogin from "./pages/EmployeeLogin";
import AdminLogin from "./pages/AdminLogin";
import Dashboard from "./pages/Dashboard";
import AdminReport from "./pages/AdminReport";
import ApplyLeave from "./pages/ApplyLeave";
import ViewLeaveStatus from "./pages/ViewLeaveStatus";
import AdminLeave from "./pages/AdminLeave";


import ProtectedRoute from "./Components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        
        <Route path="/" element={<LandingPage />} />

        
        <Route path="/employee-login" element={<EmployeeLogin />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin-report" element={<AdminReport />} />


        
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute role="employee">
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/apply-leave"
          element={
            <ProtectedRoute role="employee">
              <ApplyLeave />
            </ProtectedRoute>
          }
        />

        <Route
          path="/leave-status"
          element={
            <ProtectedRoute role="employee">
              <ViewLeaveStatus />
            </ProtectedRoute>
          }
        />

        
        <Route
          path="/admin-leaves"
          element={
            <ProtectedRoute role="admin">
              <AdminLeave />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
