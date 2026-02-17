import { useNavigate } from "react-router-dom";
import "./LandingPage.css";
import dashboardImg from "../assets/dashboard.png";

export default function LandingPage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/employee-login", { replace: true });

  };

  return (
    <div className="landing-container">
      
      {/* ===== Navbar ===== */}
      <div className="navbar">
        <h1>Employee Leave Management</h1>

        {/* ✅ Logout Button Added (Right Side) */}
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* ===== Hero Section ===== */}
      <div className="hero">
        <div className="hero-left">
          <h2>Smart Employee Leave Management</h2>
          <p>
            Easily apply for leave, track approvals, and manage employee records
            with a simple and efficient system.
          </p>

          <div className="hero-buttons">
            <button
              className="employee-btn"
              onClick={() => navigate("/employee-login")}
            >
              Employee Login
            </button>

            <button
              className="admin-btn"
              onClick={() => navigate("/admin-login")}
            >
              Admin Login
            </button>
          </div>
        </div>

        <div className="hero-right">
          <div className="mock-card">
            <div className="mock-line primary"></div>
            <div className="mock-line"></div>
            <div className="mock-line"></div>
            <div className="mock-line small"></div>
          </div>
        </div>
      </div>

      {/* ===== Screenshot Section (NEW) ===== */}
      <div className="screenshot-section">
        <h2>Dashboard Preview</h2>
        <div className="image-container">
          <img src={dashboardImg} alt="Dashboard Preview" />
        </div>
      </div>

    </div>
  );
}
