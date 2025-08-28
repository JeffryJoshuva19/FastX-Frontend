import React, { useState } from "react";
import "./register.model.css";
import { registerUser } from "../../services/register.service";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phoneNumber: "",
    gender: "",
    address: "",
    roleId: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await registerUser(formData);
      console.log("✅ Registered:", response.data);
      alert("Registration Successful!");
      window.location.href = "/login";
    } catch (error) {
      console.error("❌ Registration Failed:", error);
      alert("Registration Failed, please try again.");
    }
  };

  return (
    <div className="register-page">
      <div className="register-box">
        {/* Left section with image */}
        <div className="register-left">
          <img
            src="/bus-removebg-preview.png" // 👈 place bus image in public folder
            alt="Bus"
            className="register-image"
          />
          <h2 className="register-title">Join FastX Today!</h2>
        </div>

        {/* Right section with form */}
        <div className="register-right">
          <h2 className="form-title">Create Account</h2>
          <form onSubmit={handleSubmit} className="register-form">
            <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required className="form-input" />

            <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} required className="form-input" />

            <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required className="form-input" />

            <input type="text" name="phoneNumber" placeholder="Phone Number" value={formData.phoneNumber} onChange={handleChange} required className="form-input" />

            <select name="gender" value={formData.gender} onChange={handleChange} required className="form-input">
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>

            <textarea name="address" placeholder="Address" value={formData.address} onChange={handleChange} required className="form-input"></textarea>

            <select name="roleId" value={formData.roleId} onChange={handleChange} required className="form-input">
              <option value="">Select Role</option>
              <option value="1">Admin</option>
              <option value="2">Bus Operator</option>
              <option value="3">User</option>
            </select>

            <div className="form-buttons">
              <button type="submit" className="btn-primary">Register</button>
              <button type="button" className="btn-secondary" onClick={() => (window.location.href = "/login")}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
