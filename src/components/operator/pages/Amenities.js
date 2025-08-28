import React, { useEffect, useState } from "react";
import { FaTrash, FaPlus, FaBus } from "react-icons/fa";
import "./Pages.css";

function Amenities() {
  const [buses, setBuses] = useState([]);
  const [selectedBus, setSelectedBus] = useState("");
  const [busAmenities, setBusAmenities] = useState([]);
  const [allAmenities, setAllAmenities] = useState([]);
  const [selectedAmenity, setSelectedAmenity] = useState("");
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  const API_URL = "http://localhost:5227/api"; // adjust backend url

  // Fetch operator buses
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
      } finally {
        setLoading(false);
      }
    };
    fetchBuses();
  }, []);

  // Fetch global amenities list
  useEffect(() => {
    const fetchAllAmenities = async () => {
      try {
        const res = await fetch(`${API_URL}/Bus/Amenities`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch amenities");
        const data = await res.json();
        setAllAmenities(data);
      } catch (err) {
        console.error(err);
        alert("Error fetching amenities list");
      }
    };
    fetchAllAmenities();
  }, []);

  // 🔹 define outside useEffect
const fetchBusAmenities = async (busId) => {
  try {
    const res = await fetch(`${API_URL}/Bus/${busId}/amenities`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Failed to fetch bus amenities");
    const data = await res.json();
    setBusAmenities(data);
  } catch (err) {
    console.error(err);
    alert("Error fetching bus amenities");
  }
};

useEffect(() => {
  if (selectedBus) {
    fetchBusAmenities(selectedBus); // call here
  }
}, [selectedBus]);

const handleAddAmenity = async () => {
  try {
    const res = await fetch(`${API_URL}/Bus/${selectedBus}/amenities`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify([Number(selectedAmenity)]),
    });

    if (!res.ok) {
      throw new Error("Failed to add amenity");
    }

    alert("Amenity added successfully!");

    // ✅ refresh amenities after adding
    if (selectedBus) {
      await fetchBusAmenities(selectedBus);
    }

    setSelectedAmenity(""); // reset dropdown
  } catch (error) {
    console.error(error);
    alert("Error adding amenity");
  }
};



  // Remove amenity from bus
  const handleDeleteAmenity = async (amenityId) => {
    if (!window.confirm("Remove this amenity from bus?")) return;
    try {
      const res = await fetch(`${API_URL}/Bus/${selectedBus}/amenities/${amenityId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete amenity");
      setBusAmenities(busAmenities.filter((a) => a.amenityId !== amenityId));
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  if (loading) return <div className="spinner"><FaBus /></div>;

  return (
    <div className="admin-page">
      <h1>Manage Bus Amenities</h1>

      {/* Select bus */}
      <label>Select Bus:</label>
      <select value={selectedBus} onChange={(e) => setSelectedBus(e.target.value)}>
        <option value="">-- Choose Bus --</option>
        {buses.map((b) => (
          <option key={b.busId} value={b.busId}>
            {b.busName} ({b.busNumber})
          </option>
        ))}
      </select>

      {/* Add amenity to bus */}
      {selectedBus && (
        <>
          <div className="add-amenity">
            <select
              value={selectedAmenity}
              onChange={(e) => setSelectedAmenity(e.target.value)}
            >
              <option value="">-- Select Amenity --</option>
              {allAmenities
                .filter((a) => !busAmenities.some((ba) => ba.amenityId === a.amenityId)) // exclude already added
                .map((a) => (
                  <option key={a.amenityId} value={a.amenityId}>
                    {a.amenityName}
                  </option>
                ))}
            </select>
            <button className="admin-button approve" onClick={handleAddAmenity}>
              <FaPlus /> Add
            </button>
          </div>

          {/* Bus amenities table */}
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th><th>Name</th><th>Action</th>
              </tr>
            </thead>
            <tbody>
              {busAmenities.map((a) => (
                <tr key={a.amenityId}>
                  <td>{a.amenityId}</td>
                  <td>{a.amenityName}</td>
                  <td>
                    <button
                      className="admin-button delete"
                      onClick={() => handleDeleteAmenity(a.amenityId)}
                    >
                      <FaTrash /> Remove
                    </button>
                  </td>
                </tr>
              ))}
              {busAmenities.length === 0 && (
                <tr><td colSpan="3">No amenities added yet</td></tr>
              )}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

export default Amenities;
