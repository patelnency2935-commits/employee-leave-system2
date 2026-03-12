import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./AdminLogin.css";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    if (email === "admin@gmail.com" && password === "1234") {
      localStorage.setItem("role", "admin");
      navigate("/admin-dashboard");
    } else {
      alert("Invalid Admin Credentials");
    }
  };

  return (
    <div className="admin-login-wrapper">
      <div className="admin-login-card">
        <span className="admin-login-badge">🔐 Admin Access</span>
        <h2>Administrator Login</h2>
        <p>Enter your credentials to access the admin panel</p>

        <form onSubmit={handleLogin}>
          <div className="admin-field">
            <label htmlFor="admin-email">Email address</label>
            <input
              id="admin-email"
              type="email"
              placeholder="admin@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="admin-field">
            <label htmlFor="admin-password">Password</label>
            <input
              id="admin-password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="admin-login-btn">
            Sign In →
          </button>
        </form>

        <Link to="/" className="back-link">← Back to home</Link>
      </div>
    </div>
  );
}
