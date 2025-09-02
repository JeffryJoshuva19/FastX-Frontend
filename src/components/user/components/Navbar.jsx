import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import "./Navbar.css";

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleDropdown = () => setDropdownOpen(!dropdownOpen);
  const handleMenuToggle = () => setMenuOpen(!menuOpen);

  const handleLogout = () => {
    sessionStorage.clear();
    localStorage.clear();
    window.location.href = "/"; // redirect to login
  };

  return (
    <nav className="user-navbar">
      {/* Logo */}
      <div className="navbar-left">
        <h2 className="logo">
          <img
            src="../bus-removebg-preview.png"
            alt="Bus"
            className="bus-image"
          />
          FastX
        </h2>
      </div>

      {/* Links */}
      <ul className={`navbar-links ${menuOpen ? "active" : ""}`}>
        <li><Link to="/user/home" onClick={() => setMenuOpen(false)}>Home</Link></li>
        <li><Link to="/user/bookings" onClick={() => setMenuOpen(false)}>My Bookings</Link></li>
        <li><Link to ="/user/userprofile" onClick={()=>setMenuOpen(false)}>Profile</Link>  </li>
      </ul>

      {/* Profile */}
      <div className="navbar-right">
        <div className="navbar-profile" onClick={handleDropdown}>
          <img
            src="https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg"
            alt="Profile"
          />
          {dropdownOpen && (
            <div className="profile-dropdown">
              <Link to="/user/profile">Profile</Link>
              <button onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>

        {/* Hamburger Icon */}
        <div className="menu-toggle" onClick={handleMenuToggle}>
          {menuOpen ? <FaTimes /> : <FaBars />}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
