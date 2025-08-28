import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SeatSelection from "../components/SeatSelection";
import "../user.css";

const BookingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedSeats, setSelectedSeats] = useState([]);

  const handleBooking = () => {
    if (selectedSeats.length === 0) {
      alert("Please select at least one seat!");
      return;
    }
    navigate(`/payment/${id}`, { state: { seats: selectedSeats } });
  };

  return (
    <div className="booking-page">
      <h2>Booking for Bus {id}</h2>
      <SeatSelection onSelect={setSelectedSeats} />
      <button className="confirm-btn" onClick={handleBooking}>Proceed to Payment</button>
    </div>
  );
};

export default BookingPage;
