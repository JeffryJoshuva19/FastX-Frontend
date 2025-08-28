import React, { useEffect, useState } from "react";
import { FaTrash, FaEdit } from "react-icons/fa";
import "./Pages.css";

function ManageSeats() {
  const [buses, setBuses] = useState([]);
  const [selectedBus, setSelectedBus] = useState(null);
  const [seats, setSeats] = useState([]);
  const [loading, setLoading] = useState(false);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("add");
  const [currentSeat, setCurrentSeat] = useState(null);

  // Form fields
  const [seatNumber, setSeatNumber] = useState("");
  const [isSleeper, setIsSleeper] = useState(false);
  const [isWindow, setIsWindow] = useState(false);

  const API_URL = "http://localhost:5227/api";
  const token = sessionStorage.getItem("token") || localStorage.getItem("token");

  // Fetch buses owned by operator
  useEffect(() => {
    const fetchBuses = async () => {
      try {
        const res = await fetch(`${API_URL}/Bus`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch buses");
        const data = await res.json();
        setBuses(data);
      } catch (err) {
        console.error(err);
        alert("Error fetching buses");
      }
    };
    fetchBuses();
  }, []);

  // Fetch seats for selected bus
  const fetchSeats = async (busId) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/Seat/bus/${busId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch seats");
      const data = await res.json();
      setSeats(data);
    } catch (err) {
      console.error(err);
      alert("Error fetching seats");
    } finally {
      setLoading(false);
    }
  };

  // Select bus
  const handleBusSelect = (busId) => {
    setSelectedBus(busId);
    fetchSeats(busId);
  };

  // Open modal
  const openModal = (type, seat = null) => {
    setModalType(type);
    setCurrentSeat(seat);

    if (type === "edit" && seat) {
      setSeatNumber(seat.seatNumber);
      setIsSleeper(seat.isSleeper);
      setIsWindow(seat.isWindow);
    } else {
      setSeatNumber("");
      setIsSleeper(false);
      setIsWindow(false);
    }
    setShowModal(true);
  };

  // Add / Edit seat
  const handleSubmit = async () => {
    if (!seatNumber) {
      alert("Seat number is required");
      return;
    }

    const payload = {
      seatNumber,
      busId: selectedBus,
      isSleeper,
      isWindow,
    };

    try {
      let res;
      if (modalType === "add") {
        res = await fetch(`${API_URL}/Seat`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch(`${API_URL}/Seat/${currentSeat.seatId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) throw new Error("Failed to save seat");

      fetchSeats(selectedBus);
      setShowModal(false);
    } catch (err) {
      console.error(err);
      alert("Error saving seat");
    }
  };

  // Delete seat
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this seat?")) return;
    try {
      const res = await fetch(`${API_URL}/Seat/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Delete failed");

      setSeats(seats.filter((s) => s.seatId !== id));
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  return (
    <div className="admin-page">
      <h1>Manage Seats</h1>

      {/* Select Bus */}
      <label>Select Bus:</label>
      <select
        value={selectedBus || ""}
        onChange={(e) => handleBusSelect(Number(e.target.value))}
      >
        <option value="">-- Select Bus --</option>
        {buses.map((b) => (
          <option key={b.busId} value={b.busId}>
            {b.busName} ({b.busNumber})
          </option>
        ))}
      </select>

      {selectedBus && (
        <>
          <button className="admin-button add" onClick={() => openModal("add")}>
            Add Seat
          </button>

          {loading ? (
            <p>Loading seats...</p>
          ) : seats.length === 0 ? (
            <p>No seats found.</p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Seat Number</th>
                  <th>Sleeper</th>
                  <th>Window</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {seats.map((s) => (
                  <tr key={s.seatId}>
                    <td>{s.seatId}</td>
                    <td>{s.seatNumber}</td>
                    <td>{s.isSleeper ? "Yes" : "No"}</td>
                    <td>{s.isWindow ? "Yes" : "No"}</td>
                    <td>
                      <button
                        className="admin-button edit"
                        onClick={() => openModal("edit", s)}
                      >
                        <FaEdit /> Edit
                      </button>
                      <button
                        className="admin-button delete"
                        onClick={() => handleDelete(s.seatId)}
                      >
                        <FaTrash /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{modalType === "add" ? "Add Seat" : "Edit Seat"}</h2>

            <label>Seat Number:</label>
            <input
              type="text"
              value={seatNumber}
              onChange={(e) => setSeatNumber(e.target.value)}
            />

            <label>
              <input
                type="checkbox"
                checked={isSleeper}
                onChange={(e) => setIsSleeper(e.target.checked)}
              />{" "}
              Sleeper
            </label>

            <label>
              <input
                type="checkbox"
                checked={isWindow}
                onChange={(e) => setIsWindow(e.target.checked)}
              />{" "}
              Window
            </label>

            <div className="modal-actions">
              <button className="admin-button approve" onClick={handleSubmit}>
                {modalType === "add" ? "Add" : "Save"}
              </button>
              <button
                className="admin-button reject"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageSeats;
