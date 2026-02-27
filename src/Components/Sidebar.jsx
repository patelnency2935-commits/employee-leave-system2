import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();

  return (
    <div style={styles.sidebar}>
      
      {/* TOP MENU */}
      <div>
        <h2 style={styles.title}>Leave System</h2>

        <Link
          to="/employee-dashboard"
          style={
            location.pathname === "/employee-dashboard"
              ? { ...styles.link, ...styles.active }
              : styles.link
          }
        >
          Dashboard
        </Link>

        <Link to="/apply-leave" style={styles.link}>
          Apply Leave
        </Link>

        <Link to="/leave-status" style={styles.link}>
          My Leave History
        </Link>

        <Link to="/holidays" style={styles.link}>
          Holidays
        </Link>
      </div>

      {/* BOTTOM PROFILE */}
      <Link
        to="/profile"
        style={
          location.pathname === "/profile"
            ? { ...styles.profile, ...styles.active }
            : styles.profile
        }
      >
        👤 Profile
      </Link>
    </div>
  );
}

const styles = {
  sidebar: {
    width: "250px",
    height: "100vh",
    background: "#0f172a",
    color: "white",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",   // 👈 IMPORTANT
  },
  title: {
    marginBottom: "30px",
    fontSize: "20px",
    fontWeight: "bold",
    color: "white",

  },
  link: {
    display: "block",
    color: "#cbd5e1",
    textDecoration: "none",
    marginBottom: "15px",
    padding: "10px",
    borderRadius: "8px",
  },
  profile: {
    display: "block",
    color: "#cbd5e1",
    textDecoration: "none",
    padding: "12px",
    borderRadius: "8px",
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  active: {
    backgroundColor: "#2563eb",
    color: "white",
  },
};