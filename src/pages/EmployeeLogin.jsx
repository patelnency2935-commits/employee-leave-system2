import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function EmployeeLogin() {
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("employeeLoggedIn");

    if (isLoggedIn) {
      // ✅ ADDED: redirect to last visited page
      const lastPage =
        localStorage.getItem("lastEmployeePage") || "/dashboard";

      navigate(lastPage, { replace: true });
    }
  }, [navigate]);

  const [empId, setEmpId] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (empId && password) {
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("role", "employee");
      localStorage.setItem("employeeLoggedIn", "true");

      // ✅ ADDED: redirect to last visited page
      const lastPage =
        localStorage.getItem("lastEmployeePage") || "/dashboard";

      navigate(lastPage);
    } else {
      alert("Please enter Employee ID and Password");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.heading}>Employee Login</h2>

        <input
          type="text"
          placeholder="Employee ID"
          value={empId}
          onChange={(e) => setEmpId(e.target.value)}
          style={styles.input}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />

        <button onClick={handleLogin} style={styles.button}>
          Login
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(to right, #dbeafe, #93c5fd)",
  },
  card: {
    background: "#ffffff",
    padding: "40px 35px",
    width: "350px",
    borderRadius: "12px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
    textAlign: "center",
  },
  heading: {
    marginBottom: "25px",
    color: "#1e3a8a",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "15px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "14px",
    outline: "none",
  },
  button: {
    width: "100%",
    padding: "10px",
    backgroundColor: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "6px",
    fontSize: "15px",
    cursor: "pointer",
    transition: "0.3s",
  },
};
