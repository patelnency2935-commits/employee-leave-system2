import { useState, useEffect } from "react";   // ✅ useEffect add kiya
import { useNavigate } from "react-router-dom";
import "./AdminLogin.css";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // ✅ If already logged in, don't open login page
  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role === "admin") {
      navigate("/admin-leaves");
    }
  }, [navigate]);

  const login = () => {
    if (username === "" || password === "") {
      alert("Please fill all fields");
      return;
    }

    if (username === "admin" && password === "admin123") {
      localStorage.setItem("role", "admin");   // already present (unchanged)
      navigate("/admin-leaves");
    } else {
      alert("Invalid Admin Credentials");
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-card">
        <h2>Admin Login</h2>

        <input
          type="text"
          placeholder="Admin Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Admin Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={login}>Login</button>

      </div>
    </div>
  );
}
