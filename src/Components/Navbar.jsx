import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div
      style={{
        background: "#1976d2",
        padding: "15px 30px",
        color: "white",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      
      <h3
  style={{ margin: 0, cursor: "pointer" }}
  onClick={() => navigate("/")}
>
  Leave Management System
</h3>


      <button
        onClick={logout}
        style={{
          background: "white",
          color: "#1976d2",
          border: "none",
          padding: "6px 14px",
          borderRadius: "5px",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        Logout
      </button>
    </div>
  );
}
