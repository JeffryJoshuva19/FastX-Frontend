import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./MyBookings.css";

const MyBookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  // 🔹 Get token from sessionStorage
  const token = sessionStorage.getItem("token");

  useEffect(() => {
    const fetchBookings = async () => {
      if (!token) {
        setIsLoggedIn(false);
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          "http://localhost:5227/api/Booking/my-bookings",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        console.log("📌 Raw bookings from backend:", response.data);
        setBookings(response.data || []);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        if (error.response && error.response.status === 401) {
          setIsLoggedIn(false);
          sessionStorage.removeItem("token");
        }
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [token]);

  // 🔹 Cancel booking handler
  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;

    try {
      await axios.post(
        `http://localhost:5227/api/Booking/cancel/${bookingId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Booking cancelled successfully!");
      // ✅ Update UI instantly
      setBookings((prev) =>
        prev.map((b) =>
          b.bookingId === bookingId
            ? { ...b, bookingStatus: "Cancelled" }
            : b
        )
      );
    } catch (error) {
      console.error("Error cancelling booking:", error);
      alert("Failed to cancel booking. Try again later.");
    }
  };

  if (loading) {
    return (
      <div className="my-bookings">
        <p>Loading your bookings...</p>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="my-bookings">
        <h2>My Bookings</h2>
        <p>Please log in to view your bookings.</p>
        <button className="action-btn" onClick={() => navigate("/")}>
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="my-bookings">
      <h2>My Bookings</h2>
      <div className="bookings-list">
        {bookings.length === 0 ? (
          <p>No bookings found.</p>
        ) : (
          bookings.map((booking) => (
            <div key={booking.bookingId} className="booking-card">
              <div className="booking-header">
                <h3>
                  {booking.busName} ({booking.busNumber})
                </h3>
                <span
                  className={`status ${
                    booking.bookingStatus === "Booked"
                      ? "confirmed"
                      : booking.bookingStatus === "Pending"
                      ? "pending"
                      : "cancelled"
                  }`}
                >
                  {booking.bookingStatus}
                </span>
              </div>

              <div className="booking-details">
                <p>
                  <strong>Passenger:</strong> {booking.passengerName}
                </p>
                <p>
                  <strong>Route:</strong> {booking.origin} →{" "}
                  {booking.destination}
                </p>
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(booking.travelDate).toLocaleDateString()}
                </p>
                <p>
                  <strong>Seats:</strong> {booking.seatNumbers?.join(", ")}
                </p>
                <p>
                  <strong>Amount:</strong> ₹{booking.totalAmount}
                </p>
              </div>

              {/* 🔹 Action buttons */}
              {booking.bookingStatus === "Pending" && (
                <button
                  className="action-btn payment-btn"
                  onClick={() =>
                    navigate(`/user/payment/${booking.bookingId}`, {
                      state: {
                        bookingId: booking.bookingId,
                        amount: booking.totalAmount,
                      },
                    })
                  }
                >
                  Make Payment
                </button>
              )}

              {booking.bookingStatus === "Booked" && (
                <>
                  <button
                    className="action-btn ticket-btn"
                    onClick={() =>
                      navigate(`/user/ticket/${booking.bookingId}`, {
                        state: { booking },
                      })
                    }
                  >
                    View Ticket
                  </button>
                  <button
                    className="action-btn cancel-btn"
                    onClick={() => handleCancelBooking(booking.bookingId)}
                  >
                    Cancel Booking
                  </button>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyBookings;
