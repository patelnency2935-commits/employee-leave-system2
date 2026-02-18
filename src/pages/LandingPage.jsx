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

    if (formData.role === "employee") {
      localStorage.setItem("role", "employee");
      navigate("/employee-login");
    } else {
      localStorage.setItem("role", "admin");
      navigate("/admin-login");
    }
  };

  return (
    <div className="landing-container">
      <div className="left-section">
        <h1>Smart Employee Leave Management</h1>
        <p>
          Easily apply for leave, track approvals, and manage employee records
          with a simple and efficient system.
        </p>
      </div>

      <div className="right-section">
        <div className="login-card">
          <h2>Login</h2>

          <form onSubmit={handleLogin}>
            <input
              type="email"
              name="email"
              placeholder="Enter Email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Enter Password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="employee">Employee Login</option>
              <option value="admin">Admin Login</option>
            </select>

            <button type="submit">Login</button>
          </form>
        </div>
      </div>
    </div>
  );
}
