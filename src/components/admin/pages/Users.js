import React, { useEffect, useState } from "react";
import {  FaBus,FaTrash } from "react-icons/fa";
import "./Pages.css";

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = "http://localhost:5227/api/Admin/all-users"; // replace with your API endpoint

  // Your JWT token
const token = localStorage.getItem("token") || sessionStorage.getItem("token");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(API_URL, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });
        if (!res.ok) throw new Error("Failed to fetch users");
        const data = await res.json();
        console.log("Fetched users:", data); // debug
        setUsers(data);
      } catch (err) {
        console.error(err);
        alert("Error fetching users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error("Failed to delete user");

      setUsers(users.filter(u => u.id !== id)); // remove deleted user from table
      alert("User deleted successfully!");
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

if (loading) return (
    <div className="spinner">
      <FaBus />
    </div>
  );  if (users.length === 0) return <p>No users found.</p>;

  return (
    <div className="admin-page">
      <h1>Users</h1>
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.userId}</td>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.phoneNumber}</td>
              <td>{u.address}</td>
              <td>{u.role}</td>
              <td>
                <button className="admin-button delete" onClick={() => handleDelete(u.id)}>
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

export default Users;
