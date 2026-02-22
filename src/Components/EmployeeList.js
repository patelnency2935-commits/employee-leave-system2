import React, { useEffect, useState } from "react";
import "../pages/AdminDashboard.css";

function EmployeeList() {
  const [employees, setEmployees] = useState([]);

  const loadEmployees = () => {
    const storedEmployees =
      JSON.parse(localStorage.getItem("employees")) || [];
    setEmployees(storedEmployees);
  };

  useEffect(() => {
    loadEmployees();

    // Auto update when localStorage changes
    window.addEventListener("storage", loadEmployees);

    return () => {
      window.removeEventListener("storage", loadEmployees);
    };
  }, []);

  const handleDelete = (index) => {
    const updatedEmployees = employees.filter((_, i) => i !== index);

    setEmployees(updatedEmployees);
    localStorage.setItem("employees", JSON.stringify(updatedEmployees));
  };

  const toggleStatus = (index) => {
    const updatedEmployees = [...employees];

    updatedEmployees[index].status =
      updatedEmployees[index].status === "Active"
        ? "Inactive"
        : "Active";

    setEmployees(updatedEmployees);
    localStorage.setItem("employees", JSON.stringify(updatedEmployees));
  };

  return (
    <div className="employee-container">
      <h2>Employee List</h2>

      <table className="employee-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Designation</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {employees.length === 0 ? (
            <tr>
              <td colSpan="5">No employees found</td>
            </tr>
          ) : (
            employees.map((emp, index) => (
              <tr key={index}>
                <td>{emp.name}</td>
                <td>{emp.email}</td>
                <td>{emp.designation}</td>
                <td>
                  <span
                    className={
                      emp.status === "Active"
                        ? "status-active"
                        : "status-inactive"
                    }
                  >
                    {emp.status}
                  </span>
                </td>
                <td>
                  <button
                    className={`action-btn ${
                      emp.status === "Active"
                        ? "deactivate-btn"
                        : "activate-btn"
                    }`}
                    onClick={() => toggleStatus(index)}
                  >
                    {emp.status === "Active" ? "Deactivate" : "Activate"}
                  </button>

                  <button
                    className="action-btn delete-btn"
                    onClick={() => handleDelete(index)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default EmployeeList;