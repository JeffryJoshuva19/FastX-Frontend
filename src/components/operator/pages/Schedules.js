import React, { useEffect, useState } from "react";
import { FaTrash, FaEdit } from "react-icons/fa";
import "./Pages.css";

function ManageSchedules() {
  const [schedules, setSchedules] = useState([]);
  const [buses, setBuses] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("add");
  const [currentSchedule, setCurrentSchedule] = useState(null);

  // Form fields
  const [busId, setBusId] = useState(0);
  const [routeId, setRouteId] = useState(0);
  const [departureDateTime, setDepartureDateTime] = useState("");
  const [arrivalDateTime, setArrivalDateTime] = useState("");
  const [fare, setFare] = useState("");
  const [availableSeats, setAvailableSeats] = useState("");

  const API_URL = "http://localhost:5227/api";
  const token = sessionStorage.getItem("token") || localStorage.getItem("token");

  // Fetch schedules, buses, routes
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [sRes, bRes, rRes] = await Promise.all([
          fetch(`${API_URL}/Schedule`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API_URL}/Bus`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API_URL}/Route/routes`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        if (!sRes.ok || !bRes.ok || !rRes.ok) throw new Error("Failed to fetch data");

        const [sData, bData, rData] = await Promise.all([sRes.json(), bRes.json(), rRes.json()]);

        setSchedules(sData);
        setBuses(bData);
        setRoutes(rData);
      } catch (err) {
        console.error(err);
        alert("Error fetching schedules/buses/routes");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  // Open modal
  const openModal = (type, schedule = null) => {
    setModalType(type);
    setCurrentSchedule(schedule);

    if (type === "edit" && schedule) {
      setBusId(schedule.busId);
      setRouteId(schedule.routeId);
      setDepartureDateTime(schedule.departureDateTime.slice(0, 16));
      setArrivalDateTime(schedule.arrivalDateTime.slice(0, 16));
      setFare(schedule.fare);
      setAvailableSeats(schedule.availableSeats);
    } else {
      setBusId(0);
      setRouteId(0);
      setDepartureDateTime("");
      setArrivalDateTime("");
      setFare("");
      setAvailableSeats("");
    }

    setShowModal(true);
  };

  // Add / Edit
  const handleSubmit = async () => {
    if (!busId || !routeId || !departureDateTime || !arrivalDateTime || !fare || !availableSeats) {
      alert("All fields are required");
      return;
    }

    const payload = {
      busId: Number(busId),
      routeId: Number(routeId),
      departureDateTime,
      arrivalDateTime,
      fare: Number(fare),
      availableSeats: Number(availableSeats),
    };

    try {
      let res;
      if (modalType === "add") {
        res = await fetch(`${API_URL}/Schedule`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify(payload),
        });
      } else if (modalType === "edit" && currentSchedule) {
        res = await fetch(`${API_URL}/Schedule/${currentSchedule.scheduleId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) throw new Error("Failed to save schedule");

      const savedSchedule = await res.json();

      if (modalType === "add") {
        setSchedules([...schedules, savedSchedule]);
        alert("Schedule added successfully!");
      } else {
        setSchedules(
          schedules.map((s) => (s.scheduleId === savedSchedule.scheduleId ? savedSchedule : s))
        );
        alert("Schedule updated successfully!");
      }

      setShowModal(false);
      setCurrentSchedule(null);
    } catch (err) {
      console.error(err);
      alert("Error saving schedule");
    }
  };

  // Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this schedule?")) return;

    try {
      const res = await fetch(`${API_URL}/Schedule/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Delete failed");

      setSchedules(schedules.filter((s) => s.scheduleId !== id));
      alert("Schedule deleted successfully!");
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  if (loading) return <p>Loading schedules...</p>;
  if (schedules.length === 0) return <p>No schedules found.</p>;

  return (
    <div className="admin-page">
      <h1>Manage Schedules</h1>
      <button className="admin-button add" onClick={() => openModal("add")}>
        Add Schedule
      </button>

{showModal && (
  <div className="modal-overlay" onClick={() => setShowModal(false)}>
    <div className="modal" onClick={(e) => e.stopPropagation()}>
      <h2>{modalType === "add" ? "Add Schedule" : "Edit Schedule"}</h2>

      <label>Bus:</label>
      <select value={busId} onChange={(e) => setBusId(Number(e.target.value))}>
        <option value="">-- Select Bus --</option>
        {buses.map((b) => (
          <option key={b.busId} value={b.busId}>
            {b.busName} ({b.busNumber})
          </option>
        ))}
      </select>

      <label>Route:</label>
      <select value={routeId} onChange={(e) => setRouteId(Number(e.target.value))}>
        <option value="">-- Select Route --</option>
        {routes.map((r) => (
          <option key={r.routeId} value={r.routeId}>
            {r.origin?.cityName} ({r.origin?.state}) → {r.destination?.cityName} ({r.destination?.state})
          </option>
        ))}
      </select>

      <label>Departure:</label>
      <input
        type="datetime-local"
        value={departureDateTime}
        onChange={(e) => setDepartureDateTime(e.target.value)}
      />

      <label>Arrival:</label>
      <input
        type="datetime-local"
        value={arrivalDateTime}
        onChange={(e) => setArrivalDateTime(e.target.value)}
      />

      <label>Fare:</label>
      <input
        type="number"
        value={fare}
        onChange={(e) => setFare(e.target.value)}
      />

      <label>Available Seats:</label>
      <input
        type="number"
        value={availableSeats}
        onChange={(e) => setAvailableSeats(e.target.value)}
      />

      <div className="modal-actions">
        <button className="admin-button approve" onClick={handleSubmit}>
          {modalType === "add" ? "Add" : "Save"}
        </button>
        <button className="admin-button reject" onClick={() => setShowModal(false)}>
          Cancel
        </button>
      </div>
    </div>
  </div>
)}


      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Bus</th>
            <th>Route</th>
            <th>Departure</th>
            <th>Arrival</th>
            <th>Fare</th>
            <th>Seats</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {schedules.map((s) => {
            const bus = buses.find((b) => b.busId === s.busId);
            const route = routes.find((r) => r.routeId === s.routeId);
            return (
              <tr key={s.scheduleId}>
                <td>{s.scheduleId}</td>
                <td>{bus ? `${bus.busName} (${bus.busNumber})` : s.busId}</td>
                <td>{route ? `${route.origin?.cityName} → ${route.destination?.cityName}` : s.routeId}</td>
                <td>{new Date(s.departureDateTime).toLocaleString()}</td>
                <td>{new Date(s.arrivalDateTime).toLocaleString()}</td>
                <td>{s.fare}</td>
                <td>{s.availableSeats}</td>
                <td>
                  <button className="admin-button edit" onClick={() => openModal("edit", s)}>
                    <FaEdit /> Edit
                  </button>
                  <button className="admin-button delete" onClick={() => handleDelete(s.scheduleId)}>
                    <FaTrash /> Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default ManageSchedules;
