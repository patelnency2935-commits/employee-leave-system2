import React, { useEffect, useState } from "react";

function LeaveHistory() {

  const [leaves, setLeaves] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedLeave, setSelectedLeave] = useState(null);

  const fetchLeaves = async () => {

    try {

      const res = await fetch("http://localhost:5000/api/leaves");
      const data = await res.json();

      if (Array.isArray(data)) {
        setLeaves(data);
      } else if (Array.isArray(data.leaves)) {
        setLeaves(data.leaves);
      } else {
        setLeaves([]);
      }

    } catch (err) {
      console.log(err);
    }

  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  // APPROVE / REJECT

  const updateStatus = async (id, status) => {

    try {

      await fetch(`http://localhost:5000/api/leaves/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ status })
      });

      setLeaves((prev) =>
        prev.map((leave) =>
          leave._id === id ? { ...leave, status } : leave
        )
      );

    } catch (error) {
      console.log(error);
    }

  };

  // DELETE

  const deleteLeave = async (id) => {

    const confirmDelete = window.confirm("Delete this leave request?");

    if (!confirmDelete) return;

    try {

      await fetch(`http://localhost:5000/api/leaves/${id}`, {
        method: "DELETE"
      });

      setLeaves((prev) => prev.filter((leave) => leave._id !== id));

    } catch (error) {
      console.log(error);
    }

  };

  const filteredLeaves = leaves.filter((leave) => {

    const employeeName =
      leave.employee?.name || leave.employee || "";

    const matchSearch =
      employeeName.toLowerCase().includes(search.toLowerCase());

    const matchStatus =
      statusFilter === "" ||
      leave.status?.toLowerCase() === statusFilter;

    return matchSearch && matchStatus;

  });

  const styles = {

    container: {
      padding: "30px",
      background: "#f4f6f9",
      minHeight: "100vh",
      fontFamily: "Arial"
    },

    title: {
      fontSize: "28px",
      marginBottom: "20px",
      fontWeight: "bold"
    },

    controls: {
      marginBottom: "15px",
      display: "flex",
      gap: "10px"
    },

    input: {
      padding: "8px",
      borderRadius: "5px",
      border: "1px solid #ccc"
    },

    table: {
      width: "100%",
      borderCollapse: "collapse",
      background: "#fff",
      borderRadius: "8px",
      overflow: "hidden",
      boxShadow: "0 5px 15px rgba(0,0,0,0.08)"
    },

    th: {
      background: "#2c3e50",
      color: "#fff",
      padding: "12px",
      fontSize: "14px"
    },

    td: {
      padding: "10px",
      textAlign: "center",
      borderBottom: "1px solid #eee"
    },

    approve: {
      background: "#28a745",
      color: "#fff",
      border: "none",
      padding: "6px 12px",
      borderRadius: "4px",
      cursor: "pointer",
      marginRight: "5px"
    },

    reject: {
      background: "#dc3545",
      color: "#fff",
      border: "none",
      padding: "6px 12px",
      borderRadius: "4px",
      cursor: "pointer"
    },

    delete: {
      background: "#6c757d",
      color: "#fff",
      border: "none",
      padding: "6px 12px",
      borderRadius: "4px",
      cursor: "pointer",
      marginRight: "5px"
    },

    view: {
      background: "#34495e",
      color: "#fff",
      border: "none",
      padding: "6px 12px",
      borderRadius: "4px",
      cursor: "pointer"
    },

    approvedText: {
      color: "#28a745",
      fontWeight: "bold"
    },

    rejectedText: {
      color: "#dc3545",
      fontWeight: "bold"
    },

    modal: {
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      background: "#fff",
      padding: "25px",
      borderRadius: "8px",
      boxShadow: "0 0 20px rgba(0,0,0,0.2)",
      width: "300px"
    }

  };

  return (

    <div style={styles.container}>

      <h2 style={styles.title}>Leave History</h2>

      <div style={styles.controls}>

        <input
          style={styles.input}
          placeholder="Search Employee"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          style={styles.input}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>

      </div>

      <table style={styles.table}>

        <thead>

          <tr>
            <th style={styles.th}>Employee</th>
            <th style={styles.th}>Leave Type</th>
            <th style={styles.th}>Start Date</th>
            <th style={styles.th}>End Date</th>
            <th style={styles.th}>Days</th>
            <th style={styles.th}>Status</th>
            <th style={styles.th}>Approve / Reject</th>
            <th style={styles.th}>Actions</th>
          </tr>

        </thead>

        <tbody>

          {filteredLeaves.map((leave) => {

            const startDate = leave.startDate || leave.from;
            const endDate = leave.endDate || leave.to;

            const start = startDate ? new Date(startDate) : null;
            const end = endDate ? new Date(endDate) : null;

            let days = "-";

            if (start && end) {
              days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
            }

            return (

              <tr key={leave._id}>

                <td style={styles.td}>
                  {leave.employee?.name || leave.employee}
                </td>

                <td style={styles.td}>{leave.type}</td>

                <td style={styles.td}>
                  {start ? start.toLocaleDateString() : "-"}
                </td>

                <td style={styles.td}>
                  {end ? end.toLocaleDateString() : "-"}
                </td>

                <td style={styles.td}>{days}</td>

                <td style={styles.td}>{leave.status}</td>

                <td style={styles.td}>

                  {leave.status?.toLowerCase() === "pending" ? (

                    <>
                      <button
                        style={styles.approve}
                        onClick={() => updateStatus(leave._id, "approved")}
                      >
                        Approve
                      </button>

                      <button
                        style={styles.reject}
                        onClick={() => updateStatus(leave._id, "rejected")}
                      >
                        Reject
                      </button>
                    </>

                  ) : leave.status?.toLowerCase() === "approved" ? (

                    <span style={styles.approvedText}>Approved</span>

                  ) : (

                    <span style={styles.rejectedText}>Rejected</span>

                  )}

                </td>

                <td style={styles.td}>

                  <button
                    style={styles.delete}
                    onClick={() => deleteLeave(leave._id)}
                  >
                    Delete
                  </button>

                  <button
                    style={styles.view}
                    onClick={() => setSelectedLeave(leave)}
                  >
                    View
                  </button>

                </td>

              </tr>

            );

          })}

        </tbody>

      </table>

      {selectedLeave && (

        <div style={styles.modal}>

          <h3>Leave Details</h3>

          <p><b>Employee:</b> {selectedLeave.employee?.name || selectedLeave.employee}</p>
          <p><b>Leave Type:</b> {selectedLeave.type}</p>
          <p><b>Status:</b> {selectedLeave.status}</p>

          <button
            style={styles.delete}
            onClick={() => setSelectedLeave(null)}
          >
            Close
          </button>

        </div>

      )}

    </div>

  );

}

export default LeaveHistory;
