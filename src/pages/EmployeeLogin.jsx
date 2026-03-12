import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./AdminLogin.css";

export default function EmployeeLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Enter email and password");
      return;
    }

    setLoading(true);

    try {
      // Upsert employee in DB — gets back a real MongoDB _id
      const res = await fetch("http://localhost:5000/api/employees/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          name: email.split("@")[0],
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Login failed");
        setLoading(false);
        return;
      }

      // Store real employee (with real MongoDB _id)
      localStorage.setItem("user", JSON.stringify(data.employee));
      localStorage.setItem("role", "employee");

      navigate("/employee-dashboard");

    } catch (err) {
      console.error(err);
      alert("Could not connect to server. Make sure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-wrapper">
      <div className="admin-login-card">
        <span className="admin-login-badge">👤 Employee Portal</span>
        <h2>Employee Login</h2>
        <p>Sign in to access your leave dashboard</p>

        <form onSubmit={handleLogin}>
          <div className="admin-field">
            <label htmlFor="emp-email">Email address</label>
            <input
              id="emp-email"
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="admin-field">
            <label htmlFor="emp-password">Password</label>
            <input
              id="emp-password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <button type="submit" className="admin-login-btn" disabled={loading}>
            {loading ? "Signing in…" : "Sign In →"}
          </button>
        </form>

        <Link to="/" className="back-link">← Back to home</Link>
      </div>
    </div>
  );
}