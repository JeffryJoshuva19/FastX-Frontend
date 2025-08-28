import React from "react";
import { Link } from "react-router-dom";
import "../../user/user.css";

const Navbar = () => {
  return (
    <nav className="user-navbar">
      <div className="nav-logo">FastX</div>
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/my-bookings">My Bookings</Link></li>
        <li><Link to="/profile">Profile</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
