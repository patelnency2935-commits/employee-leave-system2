import React, { useEffect, useState } from "react";
import axios from "axios";

function ManageEmployees() {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    const res = await axios.get("http://localhost:5000/api/employees");
    setEmployees(res.data);
  };

  const deleteEmployee = async (id) => {
    await axios.delete(`http://localhost:5000/api/employees/${id}`);
    fetchEmployees();
  };

  const startEdit = (emp) => {
    setEditId(emp._id);
    setEditData(emp);
  };

  const saveEdit = async () => {
    await axios.put(
      `http://localhost:5000/api/employees/${editId}`,
      editData
    );
    setEditId(null);
    fetchEmployees();
  };

  const filtered = employees.filter(emp =>
    emp.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
  <div className="manage-container">
    <h2 className="manage-title">Manage Employees</h2>

    <input
      className="search-input"
      placeholder="Search Employee..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />

    <table className="employee-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Role</th>
          <th>Department</th>
          <th>Action</th>
        </tr>
      </thead>

      <tbody>
        {filtered.map(emp => (
          <tr key={emp._id}>
            <td>
              {editId === emp._id ? (
                <input
                  className="edit-input"
                  value={editData.name}
                  onChange={(e) =>
                    setEditData({ ...editData, name: e.target.value })
                  }
                />
              ) : emp.name}
            </td>

            <td>{emp.email}</td>
            <td>{emp.role}</td>
            <td>{emp.department}</td>

            <td>
              {editId === emp._id ? (
                <button className="btn btn-save" onClick={saveEdit}>
                  Save
                </button>
              ) : (
                <button
                  className="btn btn-edit"
                  onClick={() => startEdit(emp)}
                >
                  Edit
                </button>
              )}
              <button
                className="btn btn-delete"
                onClick={() => deleteEmployee(emp._id)}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

    
}

export default ManageEmployees;