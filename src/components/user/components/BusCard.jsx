import React from "react";
import { Link } from "react-router-dom";
import "../../user/user.css";

const BusCard = ({ bus }) => {
  return (
    <div className="bus-card">
      <h3>{bus.name}</h3>
      <p>From: {bus.from} → To: {bus.to}</p>
      <p>Departure: {bus.departure}</p>
      <p>Fare: ₹{bus.fare}</p>
      <Link to={`/booking/${bus.id}`} className="book-btn">Book Now</Link>
    </div>
  );
};

export default BusCard;
