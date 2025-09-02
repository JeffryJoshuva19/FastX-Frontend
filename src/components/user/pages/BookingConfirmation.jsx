import React from "react";
import { useNavigate } from "react-router-dom";
import "./BookingConfirmation.css";

const BookingConfirmation = ({ booking }) => {
  const navigate = useNavigate();

  // Sample booking object if not passed via props
  const data = booking || {
    busName: "FastX Express",
    busNumber: "FX123",
    from: "New York",
    to: "Boston",
    departure: "08:00 AM",
    arrival: "02:00 PM",
    seats: [3, 5, 7],
    fare: 75,
    bookingId: "FX20250829ABC",
    journeyDate: "2025-09-01",
  };

  const handleGoHome = () => navigate("/user/home");
  const handleMyBookings = () => navigate("/user/bookings");

  return (
    <div className="confirmation-page">
      <div className="confirmation-card">
        <h2>Booking Confirmed!</h2>
        <p className="booking-id">Booking ID: {data.bookingId}</p>

        <div className="booking-details">
          <p><strong>Bus:</strong> {data.busName} ({data.busNumber})</p>
          <p><strong>Route:</strong> {data.from} → {data.to}</p>
          <p><strong>Date:</strong> {data.journeyDate}</p>
          <p><strong>Departure:</strong> {data.departure}</p>
          <p><strong>Arrival:</strong> {data.arrival}</p>
          <p><strong>Seats:</strong> {data.seats.join(", ")}</p>
          <p><strong>Total Fare:</strong> ${data.fare}</p>
        </div>

        <div className="confirmation-actions">
          <button className="btn-home" onClick={handleGoHome}>
            Back to Home
          </button>
          <button className="btn-bookings" onClick={handleMyBookings}>
            My Bookings
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;
