import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./SeatSelection.css";

const SeatSelection = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const bus = location.state?.bus; // Bus info passed from search
  const scheduleId = bus?.scheduleId;

  const [allSeats, setAllSeats] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  if (!bus || !scheduleId) return;

  const fetchSeats = async () => {
    try {
      const token = sessionStorage.getItem("token"); // JWT from login

      const res = await axios.get(
        `http://localhost:5227/api/BusSeat/availableSeats?scheduleId=${scheduleId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // 🔹 pass token
          },
        }
      );

      console.log("Seats API response:", res.data); // Debug
      setAllSeats(res.data.allSeats || []);
      setBookedSeats(res.data.bookedSeatIds || []);
    } catch (error) {
      console.error("Error fetching seats:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchSeats();
}, [bus, scheduleId]);

  const toggleSeat = (seatId) => {
    if (bookedSeats.includes(seatId)) return;
    setSelectedSeats((prev) =>
      prev.includes(seatId)
        ? prev.filter((s) => s !== seatId)
        : [...prev, seatId]
    );
  };

const handleProceedToBooking = async () => {
  try {
    const token = sessionStorage.getItem("token");
    if (!token) {
      alert("Please log in to continue");
      navigate("/");
      return;
    }

    // Dummy paymentMethodId for now (say 1 = UPI, 2 = Card, etc.)
    const bookingRequest = {
      scheduleId,
      seatIds: selectedSeats,
      paymentMethodId: 1, 
    };

    const res = await axios.post(
      "http://localhost:5227/api/Booking",
      bookingRequest,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("Booking created:", res.data);

    // ✅ Redirect to MyBookings instead of payment
    navigate("/user/bookings");
  } catch (error) {
    console.error("Error creating booking:", error);
    alert("Booking failed. Try again.");
  }
};


  if (loading) return <p>Loading seats...</p>;
  if (!bus) return <p>No bus info found!</p>;

  return (
    <div className="seat-selection-page">
      <h2>
        Select Your Seats for {bus.busName} ({bus.busType})
      </h2>



      <div className="bus-layout">
        {allSeats.map((seat) => (
          <div
            key={seat.seatId}
            className={`seat 
              ${bookedSeats.includes(seat.seatId) ? "booked" : ""} 
              ${selectedSeats.includes(seat.seatId) ? "selected" : ""}`}
            onClick={() => toggleSeat(seat.seatId)}
          >
            {seat.seatNumber}
          </div>
        ))}
      </div>
            {/* Legend for user */}
<div className="seat-legend">
  <div className="legend-item">
    <div className="legend-color available"></div> Available
  </div>
  <div className="legend-item">
    <div className="legend-color selected"></div> Selected
  </div>
  <div className="legend-item">
    <div className="legend-color booked"></div> Booked
  </div>
</div>

      <div className="selected-info">
        <p>Selected Seats: {selectedSeats.join(", ") || "None"}</p>
        <p>Total Fare: ₹{selectedSeats.length * (bus?.fare || 0)}</p>
        <button
  className="confirm-btn"
  disabled={selectedSeats.length === 0}
  onClick={handleProceedToBooking}
>
  Confirm Booking
</button>

      </div>
    </div>
  );
};

export default SeatSelection;
