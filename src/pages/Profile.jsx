import React, { useEffect, useState } from "react";

export default function Profile() {
  const [user, setUser] = useState({});

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>My Profile</h2>

      <div style={styles.card}>
        <p>
          <strong>Name:</strong> {user.name || ""}
        </p>
        <p>
          <strong>Email:</strong> {user.email || ""}
        </p>
        <p>
          <strong>Role:</strong> {user.role || "Employee"}
        </p>

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
  );
}

const styles = {
  container: {
    padding: "40px",
  },
  heading: {
    fontSize: "26px",
    marginBottom: "20px",
  },
  card: {
    background: "white",
    padding: "30px",
    borderRadius: "14px",
    width: "400px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
  },
  button: {
    marginTop: "20px",
    padding: "10px 20px",
    background: "#ef4444",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
};