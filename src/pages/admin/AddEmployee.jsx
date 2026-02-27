import React, { useState } from "react";
import axios from "axios";
import "./AddEmployee.css";

function AddEmployee() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    department: "",
    sickLeaves: "",
    casualLeaves: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post("http://localhost:5000/api/employees", formData);
    alert("Employee Added Successfully");
    setFormData({
      name: "",
      email: "",
      role: "",
      department: "",
      sickLeaves: "",
      casualLeaves: ""
    });
  };

  return (
    <div className="add-container">
      <div className="form-card">
        <h2>Add Employee</h2>

        <form onSubmit={handleSubmit} className="employee-form">

          <div className="form-grid">

            <input
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <input
              name="email"
              type="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <input
              name="role"
              placeholder="Role"
              value={formData.role}
              onChange={handleChange}
              required
            />

            <input
              name="department"
              placeholder="Department"
              value={formData.department}
              onChange={handleChange}
              required
            />

            <input
              name="sickLeaves"
              type="number"
              placeholder="Sick Leaves"
              value={formData.sickLeaves}
              onChange={handleChange}
            />

            <input
              name="casualLeaves"
              type="number"
              placeholder="Casual Leaves"
              value={formData.casualLeaves}
              onChange={handleChange}
            />

          </div>

          <button type="submit" className="submit-btn">
            Add Employee
          </button>

        </form>
      </div>
    </div>
  );
}

export default AddEmployee;