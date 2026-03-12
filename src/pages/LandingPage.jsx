import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";

export default function LandingPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "employee",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    localStorage.setItem("role", formData.role);
    if (formData.role === "admin") {
      navigate("/admin-login");
    } else {
      navigate("/employee-login");
    }
  };

  return (
    <div className="landing-wrapper">
      {/* ===== LEFT PANEL ===== */}
      <div className="landing-left">
        <div className="landing-brand">
          <div className="brand-icon">📋</div>
          <span className="brand-name">LeaveSync</span>
        </div>

        <div className="landing-left-content">
          <h1>
            Smart <span>Employee Leave</span> Management
          </h1>
          <p>
            A unified platform to apply for leave, track approvals, and manage
            your team — all in one streamlined workspace.
          </p>

          <ul className="feature-list">
            <li>
              <span className="feature-icon">✅</span>
              One-click leave applications & instant status tracking
            </li>
            <li>
              <span className="feature-icon">📊</span>
              Real-time admin analytics & leave balance reports
            </li>
            <li>
              <span className="feature-icon">📅</span>
              Holiday calendar & team absence visibility
            </li>
            <li>
              <span className="feature-icon">🔔</span>
              Automated email notifications for approvals
            </li>
          </ul>
        </div>
      </div>

      {/* ===== RIGHT PANEL ===== */}
      <div className="landing-right">
        <div className="login-card">
          <div className="login-card-header">
            <h2>Welcome back</h2>
            <p>Sign in to continue to your workspace</p>
          </div>

          <form onSubmit={handleLogin}>
            <div className="field-group">
              <label htmlFor="email">Email address</label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="you@company.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="field-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="field-group">
              <label htmlFor="role">Login as</label>
              <div className="select-wrapper">
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                >
                  <option value="employee">Employee</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>
            </div>

            <button type="submit" className="login-btn">
              Continue →
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
