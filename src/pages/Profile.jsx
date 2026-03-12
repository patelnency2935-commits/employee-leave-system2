import React, { useEffect, useState } from "react";

export default function Profile() {

  const [user, setUser] = useState({});
  const [stats, setStats] = useState({
    totalLeaves: 0,
    approvedLeaves: 0,
    pendingLeaves: 0,
    rejectedLeaves: 0
  });

  useEffect(() => {

    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (storedUser) {

      setUser(storedUser);

      fetch(`http://localhost:5000/api/leaves/employee-stats/${storedUser._id}`)
        .then(res => res.json())
        .then(data => {
          setStats(data);
        })
        .catch(err => {
          console.error("Stats error:", err);
        });

    }

  }, []);

  const leaveUsage =
    stats.totalLeaves > 0
      ? Math.round((stats.approvedLeaves / stats.totalLeaves) * 100)
      : 0;

  const attendance = 100 - leaveUsage;

  return (

    <div style={styles.container}>

      <h2 style={styles.heading}>My Profile</h2>

      {/* Profile Card */}

      <div style={styles.profileCard}>

        <div style={styles.avatar}>
          {user.name ? user.name.charAt(0).toUpperCase() : "E"}
        </div>

        <div>

          <p><strong>Name:</strong> {user.name || ""}</p>
          <p><strong>Email:</strong> {user.email || ""}</p>
          <p><strong>Role:</strong> {user.role || "Employee"}</p>
          <p><strong>Department:</strong> {user.department || "IT"}</p>
          <p><strong>Contact:</strong> {user.phone || "Not Available"}</p>

          <button
            style={styles.button}
            onClick={() => {
              localStorage.removeItem("user");
              window.location.href = "/employee-login";
            }}
          >
            Logout
          </button>

        </div>

      </div>


      {/* Statistics */}

      <div style={styles.statsContainer}>

        <h3 style={styles.statsTitle}>My Statistics</h3>

        <div style={styles.statsGrid}>

          <div style={styles.statCard}>
            <p>Total Leaves</p>
            <h2>{stats.totalLeaves}</h2>
          </div>

          <div style={styles.statCard}>
            <p>Approved</p>
            <h2>{stats.approvedLeaves}</h2>
          </div>

          <div style={styles.statCard}>
            <p>Pending</p>
            <h2>{stats.pendingLeaves}</h2>
          </div>

          <div style={styles.statCard}>
            <p>Rejected</p>
            <h2>{stats.rejectedLeaves}</h2>
          </div>

        </div>

      </div>


      {/* Performance Section */}

      <div style={styles.performanceCard}>

        <h3 style={styles.statsTitle}>Performance Tracking</h3>

        <div style={styles.progressBox}>

          <p>Leave Utilization ({leaveUsage}%)</p>

          <div style={styles.progressBar}>
            <div
              style={{
                ...styles.progressFill,
                width: `${leaveUsage}%`,
                background: "#f59e0b"
              }}
            ></div>
          </div>

        </div>


        <div style={styles.progressBox}>

          <p>Attendance ({attendance}%)</p>

          <div style={styles.progressBar}>
            <div
              style={{
                ...styles.progressFill,
                width: `${attendance}%`,
                background: "#10b981"
              }}
            ></div>
          </div>

        </div>

      </div>

    </div>

  );

}

const styles = {

  container: {
    padding: "40px",
    background: "#f8fafc",
    minHeight: "100vh"
  },

  heading: {
    fontSize: "28px",
    marginBottom: "25px",
    fontWeight: "600"
  },

  profileCard: {
    display: "flex",
    alignItems: "center",
    gap: "30px",
    background: "white",
    padding: "30px",
    borderRadius: "14px",
    width: "500px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
    marginBottom: "30px"
  },

  avatar: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    background: "#3b82f6",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "32px",
    fontWeight: "bold"
  },

  button: {
    marginTop: "15px",
    padding: "10px 20px",
    background: "#ef4444",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer"
  },

  statsContainer: {
    background: "white",
    padding: "25px",
    borderRadius: "14px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
    marginBottom: "30px",
    maxWidth: "800px"
  },

  statsTitle: {
    fontSize: "20px",
    marginBottom: "20px"
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4,1fr)",
    gap: "20px"
  },

  statCard: {
    background: "#f1f5f9",
    padding: "20px",
    borderRadius: "10px",
    textAlign: "center"
  },

  performanceCard: {
    background: "white",
    padding: "25px",
    borderRadius: "14px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
    maxWidth: "800px"
  },

  progressBox: {
    marginBottom: "20px"
  },

  progressBar: {
    height: "12px",
    background: "#e5e7eb",
    borderRadius: "10px",
    overflow: "hidden"
  },

  progressFill: {
    height: "100%",
    borderRadius: "10px"
  }

};
