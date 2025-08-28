import React from "react";
import { Link } from "react-router-dom";
import "../user.css";

const HomePage = () => {
  return (
    <div className="home-page">
      <h1>Welcome to FastX</h1>
      <p>Book your bus tickets easily and quickly.</p>
      <Link to="/search" className="search-btn">Search Buses</Link>
    </div>
  );
};

export default HomePage;
