import React, { useState } from "react";
import axios from "axios";

function Payroll() {
  const [form, setForm] = useState({
    employeeId: "",
    baseSalary: "",
    leaveDays: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const generatePayroll = async () => {
    const res = await axios.post(
      "http://localhost:5000/api/payroll/generate",
      form
    );

    alert("Final Salary: ₹ " + res.data.finalSalary);
  };

  return (
    <div>
      <h2>Payroll Management</h2>

      <input
        name="employeeId"
        placeholder="Employee ID"
        onChange={handleChange}
      />
      <input
        name="baseSalary"
        placeholder="Base Salary"
        onChange={handleChange}
      />
      <input
        name="leaveDays"
        placeholder="Leave Without Pay Days"
        onChange={handleChange}
      />

      <button onClick={generatePayroll}>Generate Payroll</button>
    </div>
  );
}

export default Payroll;