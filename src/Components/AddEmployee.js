import React, { useState } from "react";
import "../pages/AdminDashboard.css";

function AddEmployee({ addEmployee }) {
  const [employee, setEmployee] = useState({
    name: "",
    email: "",
    designation: "",
    status: "Active",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployee({
      ...employee,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!employee.name || !employee.email || !employee.designation) {
      alert("Please fill all fields");
      return;
    }

    addEmployee(employee);

    setEmployee({
      name: "",
      email: "",
      designation: "",
      status: "Active",
    });
  };

  return (
    <div className="page-container">
      <div className="form-card">
        <h2 className="form-title">Add Employee</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              value={employee.name}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={employee.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Designation</label>
            <input
              type="text"
              name="designation"
              value={employee.designation}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Status</label>
            <select
              name="status"
              value={employee.status}
              onChange={handleChange}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <button type="submit" className="primary-btn">
            Add Employee
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddEmployee;