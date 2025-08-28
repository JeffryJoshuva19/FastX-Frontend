import React, { useEffect, useState } from "react";
import { FaTrash, FaEdit } from "react-icons/fa";
import "./Pages.css";

function Locations() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("add"); // "add" or "edit"
  const [currentLocation, setCurrentLocation] = useState(null);
  const [cityName, setCityName] = useState("");
  const [stateName, setStateName] = useState("");
  const [pincode, setPincode] = useState("");

  const API_URL = "http://localhost:5227/api/Admin/locations";
  const token = sessionStorage.getItem("token") || localStorage.getItem("token");

  // Fetch all locations
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await fetch(API_URL, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch locations");
        const data = await res.json();
        setLocations(data);
      } catch (err) {
        console.error(err);
        alert("Error fetching locations");
      } finally {
        setLoading(false);
      }
    };
    fetchLocations();
  }, []);

  // Open modal for Add or Edit
  const openModal = (type, location = null) => {
    setModalType(type);
    setCurrentLocation(location);
    if (type === "edit" && location) {
      setCityName(location.cityName);
      setStateName(location.state);
      setPincode(location.pincode);
    } else {
      setCityName("");
      setStateName("");
      setPincode("");
    }
    setShowModal(true);
  };

  // Handle Add or Edit submission
  const handleSubmit = async () => {
  if (!cityName || !stateName || !pincode) {
    alert("All fields are required");
    return;
  }

  try {
    if (modalType === "add") {
      // Add new location
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ cityName, state: stateName, pincode }),
      });

      if (!res.ok) throw new Error("Failed to add location");

      const savedLocation = await res.json();
      setLocations([...locations, savedLocation]);
      alert("Location added successfully!");
    } else if (modalType === "edit" && currentLocation) {
      // Edit existing location
      const res = await fetch(`${API_URL}/${currentLocation.locationId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({locationId: currentLocation.locationId, cityName, state: stateName, pincode }),
      });

      if (!res.ok) throw new Error("Failed to update location");

      // Update frontend state manually (no JSON returned)
      setLocations(
        locations.map((loc) =>
          loc.locationId === currentLocation.locationId
            ? { ...loc, cityName, state: stateName, pincode }
            : loc
        )
      );
      alert("Location updated successfully!");
    }

    // Reset modal and form fields
    setShowModal(false);
    setCityName("");
    setStateName("");
    setPincode("");
    setCurrentLocation(null);
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};


  // Handle delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this location?")) return;
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete location");
      setLocations(locations.filter((l) => l.locationId !== id));
      alert("Location deleted successfully!");
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  if (loading) return <p>Loading locations...</p>;
  if (locations.length === 0) return <p>No locations found.</p>;

  return (
    <div className="admin-page">
      <h1>Manage Locations</h1>
      <button className="admin-button add" onClick={() => openModal("add")}>
        Add Location
      </button>

      {/* Modal */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>{modalType === "add" ? "Add Location" : "Edit Location"}</h2>
            <input
              type="text"
              placeholder="City Name"
              value={cityName}
              onChange={(e) => setCityName(e.target.value)}
            />
            <input
              type="text"
              placeholder="State"
              value={stateName}
              onChange={(e) => setStateName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Pincode"
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
            />
            <div className="modal-buttons">
              <button onClick={handleSubmit}>
                {modalType === "add" ? "Add" : "Save"}
              </button>
              <button
                onClick={() => {
                  setShowModal(false);
                  setCurrentLocation(null);
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
            <th>City</th>
            <th>State</th>
            <th>Pincode</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {locations.map((l) => (
            <tr key={l.locationId}>
              <td>{l.locationId}</td>
              <td>{l.cityName}</td>
              <td>{l.state}</td>
              <td>{l.pincode}</td>
              <td>
                <button className="admin-button edit" onClick={() => openModal("edit", l)}>
                  <FaEdit /> Edit
                </button>
                <button className="admin-button delete" onClick={() => handleDelete(l.locationId)}>
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

export default Locations;
