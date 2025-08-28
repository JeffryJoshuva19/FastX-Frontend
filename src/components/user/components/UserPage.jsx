import React from "react";
import "./user.css";

const UserPage = () => {
  return (
    <div className="user-page">
      {/* Navbar */}
      <nav className="user-navbar">
        <div className="logo">FastX</div>
        <ul className="nav-links">
          <li>Home</li>
          <li>Bookings</li>
          <li>Profile</li>
          <li>Logout</li>
        </ul>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <h1>Book Your Bus Tickets Easily</h1>
        <p>Travel safe, travel smart 🚍</p>
        <div className="search-box">
          <input type="text" placeholder="From" />
          <input type="text" placeholder="To" />
          <input type="date" />
          <button className="search-btn">Search Buses</button>
        </div>
      </section>

      {/* Bus Cards */}
      <section className="bus-section">
        <h2>Available Buses</h2>
        <div className="bus-list">
          <div className="bus-card">
            <h3>Chennai → Bangalore</h3>
            <p>Departure: 9:00 AM</p>
            <p>Fare: ₹ 800</p>
            <button className="book-btn">Book Now</button>
          </div>
          <div className="bus-card">
            <h3>Hyderabad → Chennai</h3>
            <p>Departure: 10:30 PM</p>
            <p>Fare: ₹ 1200</p>
            <button className="book-btn">Book Now</button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="user-footer">
        <p>© 2025 FastX Bus Booking. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default UserPage;
