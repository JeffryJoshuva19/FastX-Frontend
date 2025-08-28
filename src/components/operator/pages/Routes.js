import React, { useEffect, useState } from "react";
import { FaTrash, FaEdit } from "react-icons/fa";
import "./Pages.css";

function Routes() {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("add"); // "add" or "edit"
  const [currentRoute, setCurrentRoute] = useState(null);

  const [originId, setOriginId] = useState("");
  const [destinationId, setDestinationId] = useState("");
  const [distanceKm, setDistanceKm] = useState("");
  const [estimatedTime, setEstimatedTime] = useState("");

  const [locations, setLocations] = useState([]);

  const API_ROUTE_URL = "http://localhost:5227/api/Admin/routes";
  const API_LOC_URL = "http://localhost:5227/api/Admin/locations";
  const token = sessionStorage.getItem("token") || localStorage.getItem("token");

  // Fetch routes and locations
  const fetchRoutesAndLocations = async () => {
    try {
      setLoading(true);

      const [resRoutes, resLoc] = await Promise.all([
        fetch(API_ROUTE_URL, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(API_LOC_URL, { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      if (!resRoutes.ok) throw new Error("Failed to fetch routes");
      if (!resLoc.ok) throw new Error("Failed to fetch locations");

      const dataRoutes = await resRoutes.json();
      const dataLoc = await resLoc.json();

      setRoutes(dataRoutes);
      setLocations(dataLoc);
    } catch (err) {
      console.error(err);
      alert("Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoutesAndLocations();
  }, []);

  // Open modal
  const openModal = (type, route = null) => {
    setModalType(type);
    setCurrentRoute(route);

    if (type === "edit" && route) {
      setOriginId(route.originId);
      setDestinationId(route.destinationId);
      setDistanceKm(route.distanceKm);
      setEstimatedTime(route.estimatedTime);
    } else {
      setOriginId("");
      setDestinationId("");
      setDistanceKm("");
      setEstimatedTime("");
    }
    setShowModal(true);
  };

  // Handle add/edit
  const handleSubmit = async () => {
    if (!originId || !destinationId || !distanceKm || !estimatedTime) {
      alert("All fields are required");
      return;
    }

    const payload = {
      originId: Number(originId),
      destinationId: Number(destinationId),
      distanceKm: Number(distanceKm),
      estimatedTime,
    };

    try {
      let res;
      if (modalType === "add") {
        res = await fetch(API_ROUTE_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
      } else if (modalType === "edit" && currentRoute) {
        res = await fetch(`${API_ROUTE_URL}/${currentRoute.routeId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) throw new Error("Failed to save route");

      // Re-fetch all routes to ensure correct structure
      await fetchRoutesAndLocations();
      alert(`Route ${modalType === "add" ? "added" : "updated"} successfully!`);
      setShowModal(false);
      setCurrentRoute(null);
      setOriginId("");
      setDestinationId("");
      setDistanceKm("");
      setEstimatedTime("");
    } catch (err) {
      console.error(err);
      alert("Failed to save route");
    }
  };

  // Delete route
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this route?")) return;
    try {
      const res = await fetch(`${API_ROUTE_URL}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete route");
      await fetchRoutesAndLocations();
      alert("Route deleted successfully!");
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  if (loading) return <p>Loading routes...</p>;

  return (
    <div className="admin-page">
      <h1>Manage Routes</h1>
      <button className="admin-button add" onClick={() => openModal("add")}>
        Add Route
      </button>

      {/* Modal */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>{modalType === "add" ? "Add Route" : "Edit Route"}</h2>

            <label>Origin:</label>
            <select value={originId} onChange={(e) => setOriginId(e.target.value)}>
              <option value="">Select Origin</option>
              {locations.map((loc) => (
                <option key={loc.locationId} value={loc.locationId}>
                  {loc.cityName}
                </option>
              ))}
            </select>

            <label>Destination:</label>
            <select
              value={destinationId}
              onChange={(e) => setDestinationId(e.target.value)}
            >
              <option value="">Select Destination</option>
              {locations.map((loc) => (
                <option key={loc.locationId} value={loc.locationId}>
                  {loc.cityName}
                </option>
              ))}
            </select>

            <label>Distance (km):</label>
            <input
              type="number"
              value={distanceKm}
              onChange={(e) => setDistanceKm(e.target.value)}
              placeholder="Distance in km"
            />

            <label>Estimated Time:</label>
            <input
              type="text"
              value={estimatedTime}
              onChange={(e) => setEstimatedTime(e.target.value)}
              placeholder="Estimated time"
            />

            <div className="modal-buttons">
              <button onClick={handleSubmit}>
                {modalType === "add" ? "Add" : "Save"}
              </button>
              <button
                onClick={() => {
                  setShowModal(false);
                  setCurrentRoute(null);
                }}
              >
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
            <th>Origin</th>
            <th>Destination</th>
            <th>Distance (km)</th>
            <th>Estimated Time</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {routes.map((r) => (
            <tr key={r.routeId}>
              <td>{r.routeId}</td>
              <td>{r.origin?.cityName || "N/A"}</td>
              <td>{r.destination?.cityName || "N/A"}</td>
              <td>{r.distanceKm}</td>
              <td>{r.estimatedTime}</td>
              <td>
                <button className="admin-button edit" onClick={() => openModal("edit", r)}>
                  <FaEdit /> Edit
                </button>
                <button className="admin-button delete" onClick={() => handleDelete(r.routeId)}>
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

export default Routes;
