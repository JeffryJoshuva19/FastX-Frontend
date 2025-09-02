import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();

  // State for search inputs
  const [fromCity, setFromCity] = useState("");
  const [toCity, setToCity] = useState("");
  const [journeyDate, setJourneyDate] = useState("");

  // State for popular routes
  const [popularRoutes, setPopularRoutes] = useState([]);

  // ✅ Fetch popular routes from backend on load
  useEffect(() => {
    const fetchPopularRoutes = async () => {
      try {
        const res = await axios.get("http://localhost:5227/api/routes/popular");
        setPopularRoutes(res.data); // Assuming API returns array of routes
      } catch (err) {
        console.error("Error fetching popular routes:", err);
      }
    };
    fetchPopularRoutes();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault(); // ✅ prevent form reload
    try {
      const response = await axios.post("http://localhost:5227/api/Schedule/search", {
        origin: fromCity,
        destination: toCity,
        travelDate: new Date(journeyDate).toISOString()
      });

      console.log("Available buses:", response.data);

      // Navigate to results page:
      navigate("/user/search-results", { state: { buses: response.data } });
    } catch (error) {
      console.error("Error searching buses:", error.response?.data || error.message);
    }
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay">
          <h1>Book Your Bus Tickets Effortlessly</h1>
          <p>Fast, Secure, Comfortable Travel Across Cities</p>
        </div>

        {/* Search Form */}
        <div className="search-form-container">
          <form className="search-form" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="From City"
              value={fromCity}
              onChange={(e) => setFromCity(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="To City"
              value={toCity}
              onChange={(e) => setToCity(e.target.value)}
              required
            />
            <input
              type="date"
              value={journeyDate}
              onChange={(e) => setJourneyDate(e.target.value)}
              required
            />
            <button type="submit">Search Buses</button>
          </form>
        </div>
      </section>

     {/* Popular Routes */}
<section className="popular-routes">
  <h2>Popular Routes</h2>
  <div className="route-cards">
    {[
      {
        from: "Chennai",
        to: "Bangalore",
        description: "Comfortable overnight bus service between Chennai and Bangalore.",
        imageUrl: "https://picsum.photos/400/200?random=11",
      },
      {
        from: "Hyderabad",
        to: "Chennai",
        description: "Fast travel from Hyderabad to Chennai with luxury seating.",
        imageUrl: "https://picsum.photos/400/200?random=12",
      },
      {
        from: "Mumbai",
        to: "Pune",
        description: "Quick and frequent city-to-city buses.",
        imageUrl: "https://picsum.photos/400/200?random=13",
      },
      {
        from: "Delhi",
        to: "Jaipur",
        description: "Popular tourist route with AC buses.",
        imageUrl: "https://picsum.photos/400/200?random=14",
      },
      {
        from: "Kolkata",
        to: "Digha",
        description: "Beach destination route, perfect weekend trips.",
        imageUrl: "https://picsum.photos/400/200?random=15",
      },
    ].map((route, idx) => (
      <div key={idx} className="route-card">
        <img src={route.imageUrl} alt={`${route.from} to ${route.to}`} />
        <h3>
          {route.from} → {route.to}
        </h3>
        <p>{route.description}</p>
      </div>
    ))}
  </div>
</section>


      {/* Why Choose Us */}
      <section className="why-choose-us">
        <h2>Why Choose FastX?</h2>
        <div className="features">
          <div className="feature-card">
            <h3>🚌 Comfortable Buses</h3>
            <p>Enjoy a smooth ride with spacious seating and AC buses.</p>
          </div>
          <div className="feature-card">
            <h3>💳 Secure Payments</h3>
            <p>All transactions are encrypted and safe with multiple options.</p>
          </div>
          <div className="feature-card">
            <h3>⏱️ On-Time Schedules</h3>
            <p>We value your time. Buses always depart and arrive on schedule.</p>
          </div>
          <div className="feature-card">
            <h3>📱 Easy Booking</h3>
            <p>Book tickets in just a few clicks from any device.</p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps">
          <div className="step">
            <span>1️⃣</span>
            <h3>Search Routes</h3>
            <p>Enter your origin, destination and travel date.</p>
          </div>
          <div className="step">
            <span>2️⃣</span>
            <h3>Choose Seats</h3>
            <p>Select your preferred bus and seats.</p>
          </div>
          <div className="step">
            <span>3️⃣</span>
            <h3>Pay & Travel</h3>
            <p>Complete payment securely and enjoy your trip.</p>
          </div>
        </div>
      </section>

      

      {/* Footer */}
      <footer className="home-footer">
        <p>&copy; 2025 FastX Bus Booking. All rights reserved.</p>
        <div className="social-icons">
          <a href="#">Facebook</a>
          <a href="#">Twitter</a>
          <a href="#">Instagram</a>
        </div>
      </footer>
    </div>
  );
};

export default Home;
