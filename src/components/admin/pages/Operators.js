import React, { useEffect, useState } from "react";
import { FaTrash, FaCheck, FaBus } from "react-icons/fa";
import "./Pages.css";

function Operators() {
  const [operators, setOperators] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = "http://localhost:5227/api/Admin/all-bus-operators"; 
const token = localStorage.getItem("token") || sessionStorage.getItem("token");

  useEffect(() => {
    const fetchOperators = async () => {
      try {
        const res = await fetch(API_URL, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });
        if (!res.ok) throw new Error("Failed to fetch operators");
        const data = await res.json();
        setOperators(data);
      } catch (err) {
        console.error(err);
        alert("Error fetching operators");
      } finally {
        setLoading(false);
      }
    };
    fetchOperators();
  }, []);

  const handleApprove = async (busOperatorId) => {
  try {
    const res = await fetch(`http://localhost:5227/api/Admin/update-operator-status/${busOperatorId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify("Approved") // <-- send as a plain string
    });

    if (!res.ok) {
      const errMsg = await res.text();
      throw new Error(errMsg || "Failed to approve operator");
    }

    setOperators(operators.map(op =>
      op.operatorId === busOperatorId ? { ...op, status: "Approved" } : op
    ));

    alert("Operator approved successfully!");
  } catch (err) {
    console.error(err);
    alert("Approve failed: " + err.message);
  }
};




  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this operator?")) return;
    try {
      const res = await fetch(`http://localhost:5227/api/Admin/delete-operator/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to delete operator");
      setOperators(operators.filter(op => op.operatorId !== id));
      alert("Operator deleted successfully!");
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  if (loading) return (
    <div className="spinner">
      <FaBus />
    </div>
  );
  if (operators.length === 0) return <p>No operators found.</p>;

  return (
    <div className="admin-page">
      <h1>Bus Operators</h1>
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th><th>Name</th><th>Email</th>
            <th>Address</th><th>Phone</th><th>Status</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {operators.map((op) => (
            <tr key={op.operatorId}>
              <td>{op.operatorId}</td>
              <td>{op.operatorName}</td>
              <td>{op.email}</td>
              <td>{op.address}</td>
              <td>{op.phoneNumber}</td>
              <td>
                <span className={`status-badge ${op.status === "Approved" ? "approved" : "pending"}`}>
                  {op.status}
                </span>
              </td>
              <td>
                {op.status !== "Approved" && (
                  <button className="admin-button approve" onClick={() => handleApprove(op.operatorId)}>
                    <FaCheck /> Approve
                  </button>
                )}
                <button className="admin-button delete" onClick={() => handleDelete(op.operatorId)}>
                  <FaTrash /> Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Operators;
