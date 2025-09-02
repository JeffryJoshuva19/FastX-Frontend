import React, { useEffect, useState } from "react";
import "./UserProfile.css";
import axios from "axios";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    password: "",
    address: "",
  });

  useEffect(() => {
    const token = sessionStorage.getItem("token"); // JWT token from login
    if (!token) {
      alert("Please login to view your profile.");
      return;
    }

    // Ensure axios uses the correct backend URL (HTTP or HTTPS)
    axios
      .get("http://localhost:5227/api/User/Profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        const data = res.data;
        setUser(data);
        setFormData({
          name: data.name || "",
          phone: data.phone || "",
          password: "",
          address: data.address || "",
        });
      })
      .catch((err) => {
        console.error("Error fetching profile:", err);
        alert("Failed to fetch profile. Please login again.");
      });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = () => {
    // Optional: API call to update
    alert("Profile updated successfully!");
    setUser({ ...user, ...formData });
    setEditMode(false);
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div className="profile-container">
      <h2 className="profile-title">My Profile</h2>

      <div className="profile-card">
        {/* Profile Avatar */}
        <div className="profile-avatar">
          <img
            src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            alt="profile avatar"
          />
        </div>

        {/* Profile Info */}
        <div className="profile-info">
          <label>Name:</label>
          {editMode ? (
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          ) : (
            <p>{user.name}</p>
          )}

          <label>Email:</label>
          <p>{user.email}</p>

          <label>Phone:</label>
          {editMode ? (
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          ) : (
            <p>{user.phone}</p>
          )}

          <label>Address:</label>
          {editMode ? (
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
          ) : (
            <p>{user.address}</p>
          )}

          {editMode && (
            <>
              <label>New Password:</label>
              <input
                type="password"
                name="password"
                placeholder="Leave blank if unchanged"
                value={formData.password}
                onChange={handleChange}
              />
            </>
          )}
        </div>

        {/* Actions */}
        <div className="profile-actions">
          {editMode ? (
            <>
              <button className="save-btn" onClick={handleUpdate}>
                Save
              </button>
              <button className="cancel-btn" onClick={() => setEditMode(false)}>
                Cancel
              </button>
            </>
          ) : (
            <button className="edit-btn" onClick={() => setEditMode(true)}>
              Edit Profile
            </button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="profile-stats">
        <h3>Booking Summary</h3>
        <p>
          Total Bookings: <span>{user.bookingsCount || 0}</span>
        </p>
        <p>
          Joined On: <span>{user.joinedDate || "N/A"}</span>
        </p>
      </div>
    </div>
  );
};

export default UserProfile;
