import React, { useState, useEffect } from "react";
import { FiCheckCircle, FiXCircle, FiClock, FiMessageCircle } from 'react-icons/fi';

function ApproveReject() {
  const [leaves, setLeaves] = useState([]);

  const fetchLeaves = () => {
    fetch("http://localhost:5000/api/leaves")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setLeaves(data);
        } else if (Array.isArray(data.leaves)) {
          setLeaves(data.leaves);
        } else {
          setLeaves([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching leaves:", err);
        setLeaves([]);
      });
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const StatusBadge = ({ status }) => {
    const styles = {
      approved: 'bg-green-100 text-green-700 border-green-200',
      rejected: 'bg-red-100 text-red-700 border-red-200',
      pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    };
    const icons = {
      approved: <FiCheckCircle size={14} className="mr-1.5" />,
      rejected: <FiXCircle size={14} className="mr-1.5" />,
      pending: <FiClock size={14} className="mr-1.5" />,
    };
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border capitalize ${styles[status?.toLowerCase()] || styles.pending}`}>
        {icons[status?.toLowerCase()] || icons.pending}
        {status || "Pending"}
      </span>
    );
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900">Leave Applications</h2>
        <p className="text-slate-500 mt-1">Review and manage pending leave requests from the team.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">Leave Type</th>
                <th className="px-6 py-4 font-semibold">Duration</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Manager Comment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {!Array.isArray(leaves) || leaves.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center">
                      <FiClock size={32} className="mb-2 opacity-20" />
                      <p className="font-medium">No leave applications found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                leaves.map((leave) => (
                  <tr key={leave._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900">{leave.type || "Special Leave"}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-700 font-medium flex items-center">
                        {formatDate(leave.startDate)} 
                        <span className="mx-2 text-slate-300">→</span> 
                        {formatDate(leave.endDate)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={leave.status} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm text-slate-500 italic">
                        <FiMessageCircle className="mr-2 opacity-50" />
                        {leave.status?.toLowerCase() === "rejected"
                          ? leave.managerComment || "No reason provided"
                          : "Not applicable"}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ApproveReject;

