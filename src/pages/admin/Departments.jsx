import React, { useState } from "react";

function Departments() {
  const [departments, setDepartments] = useState(["HR", "Sales", "Tech"]);
  const [newDept, setNewDept] = useState("");

  const addDepartment = () => {
    if (newDept.trim() !== "") {
      setDepartments([...departments, newDept]);
      setNewDept("");
    }
  };

  const deleteDepartment = (index) => {
    const updated = departments.filter((_, i) => i !== index);
    setDepartments(updated);
  };

  return (
    <div className="manage-container">
      <h2 className="manage-title">Department Management</h2>

      <input
        className="search-input"
        placeholder="New Department"
        value={newDept}
        onChange={(e) => setNewDept(e.target.value)}
      />

      <button className="btn btn-save" onClick={addDepartment}>
        Add
      </button>

      <ul>
        {departments.map((dept, index) => (
          <li key={index}>
            {dept}
            <button
              className="btn btn-delete"
              onClick={() => deleteDepartment(index)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Departments;