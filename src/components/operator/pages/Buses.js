import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import "./Pages.css";

function ManageBuses() {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("add"); // add or edit
  const [currentBus, setCurrentBus] = useState(null);

  const [busNumber, setBusNumber] = useState("");
  const [busType, setBusType] = useState("");
  const [totalSeats, setTotalSeats] = useState("");

  const [busName, setBusName] = useState("");
const [busTypeId, setBusTypeId] = useState(0);
const [busTypes, setBusTypes] = useState([]);
const operatorId = sessionStorage.getItem("operatorId"); 

  const token = sessionStorage.getItem("token");
  const API_URL = "http://localhost:5227/api/Bus";

  // Fetch buses
  const fetchBuses = async () => {
    try {
      const res = await fetch(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch buses");
      const data = await res.json();      
      setBuses(data);
    } catch (err) {
      console.error(err);
      alert("Error fetching buses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBuses();
  }, []);

// Open modal
const openModal = (type, bus = null) => {
  setModalType(type);
  setCurrentBus(bus);
  if (type === "edit" && bus) {
    setBusName(bus.busName);
    setBusNumber(bus.busNumber);
    setBusTypeId(bus.busTypeId);
    
    setTotalSeats(bus.totalSeats);
  } else {
    setBusName("");
    setBusNumber("");
    setBusTypeId(0);
    setTotalSeats("");
  }
  setShowModal(true);
};

// Submit Add/Edit
const handleSubmit = async () => {
  if (!busName || !busNumber || !busTypeId || !totalSeats) {
    alert("All fields are required");
    return;
  }

  const payload = {
    operatorId: Number(operatorId), // current logged-in operator
    busName,
    busNumber,
    busTypeId: Number(busTypeId),
    totalSeats: Number(totalSeats),
    isActive: true
  };

  try {
    let res;
    if (modalType === "add") {
      res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
    } else if (modalType === "edit" && currentBus) {
      res = await fetch(`${API_URL}/${currentBus.busId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
    }

    if (!res.ok) throw new Error("Failed to save bus");
    const savedBus = await res.json();

    if (modalType === "add") {
      setBuses([...buses, savedBus]);
      alert("Bus added successfully!");
    } else {
      setBuses(buses.map((b) => (b.busId === savedBus.busId ? savedBus : b)));
      alert("Bus updated successfully!");
    }

    setShowModal(false);
    setCurrentBus(null);
    setBusName("");
    setBusNumber("");
    setBusTypeId(0);
    setTotalSeats("");
  } catch (err) {
    console.error(err);
    alert("Error saving bus");
  }
};

  // Delete bus
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this bus?")) return;

    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Delete failed");
      setBuses(buses.filter((b) => b.busId !== id));
      alert("Bus deleted successfully!");
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  if (loading) return <div className="spinner">🚌</div>;
  if (buses.length === 0) return <p className="admin-page">No buses found.</p>;

  return (
    <div className="admin-page">
      <h1>Manage Buses</h1>
      <button className="admin-button edit" onClick={() => openModal("add")}>Add Bus</button>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{modalType === "add" ? "Add Bus" : "Edit Bus"}</h2>

            <label>Bus Name:</label>
            <input value={busName} onChange={(e) => setBusName(e.target.value)} />

            <label>Bus Number:</label>
            <input value={busNumber} onChange={(e) => setBusNumber(e.target.value)} />

            <label>Bus Type ID:</label>
            <input type="number" value={busTypeId} onChange={(e) => setBusTypeId(e.target.value)} />

            <label>Total Seats:</label>
            <input type="number" value={totalSeats} onChange={(e) => setTotalSeats(e.target.value)} />


            <div className="modal-actions">
              <button className="admin-button approve" onClick={handleSubmit}>{modalType === "add" ? "Add" : "Save"}</button>
              <button className="admin-button reject" onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Bus Number</th>
            <th>Bus Type</th>
            <th>Total Seats</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {buses.map((b) => (
            <tr key={b.busId}>
              <td>{b.busId}</td>
              <td>{b.busNumber}</td>
              <td>{b.TypeName}</td>
              <td>{b.totalSeats}</td>
              <td>
                <button className="admin-button edit" onClick={() => openModal("edit", b)}><FaEdit /> Edit</button>
                <button className="admin-button delete" onClick={() => handleDelete(b.busId)}><FaTrash /> Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ManageBuses;
