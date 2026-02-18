import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div style={styles.sidebar}>
      <h2 style={styles.title}>Leave System</h2>

      <Link to="/employee-dashboard" style={styles.link}>
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

      <Link to="/reports" style={styles.link}>
        Reports
      </Link>
    </div>
  );
}

const styles = {
  sidebar: {
    width: "250px",
    height: "100vh",
    background: "#1e293b",
    color: "white",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
  },
  title: {
    marginBottom: "30px",
  },
  link: {
    color: "white",
    textDecoration: "none",
    marginBottom: "15px",
  },
};
