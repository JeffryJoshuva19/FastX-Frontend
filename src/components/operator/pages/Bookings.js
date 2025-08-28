import React, { useEffect, useState } from "react";
import { FaEye } from "react-icons/fa";
import "./Pages.css";

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const API_URL = "http://localhost:5227/api/BusOperator/my-passenger-bookings"; // ✅ Your endpoint for logged-in user's bookings
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch(API_URL, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setBookings(data);
      } catch (err) {
        console.error(err);
        alert("Failed to fetch bookings");
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  if (loading) return <p>Loading your bookings...</p>;
  if (bookings.length === 0) return <p>You have no bookings yet.</p>;

  return (
    <div className="admin-page">
      <h1>My Bookings</h1>
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Bus</th>
            <th>Route</th>
            <th>Departure</th>
            <th>Arrival</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b) => (
            <tr key={b.bookingId}>
              <td>{b.bookingId}</td>
              <td>{b.busName}</td>
              <td>{b.route}</td>
              <td>{new Date(b.departure).toLocaleString()}</td>
              <td>{new Date(b.arrival).toLocaleString()}</td>
              <td>₹{b.amount}</td>
             <td>
  <span
    className={`status-badge ${
      b.status?.statusName === "Booked"
        ? "booked"
        : b.status?.statusName === "Cancelled"
        ? "cancelled"
        : "pending"
    }`}
  >
    {b.status?.statusName || "Pending"}
  </span>
</td>

              <td>
                <button
                  className="admin-button view"
                  onClick={() => setSelectedBooking(b)}
                >
                  <FaEye /> View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      {selectedBooking && (
        <div className="modal-overlay" onClick={() => setSelectedBooking(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Booking Details</h2>
            <p><strong>Booking ID:</strong> {selectedBooking.bookingId}</p>
            <p><strong>Passenger:</strong> {selectedBooking.passengerName}</p>
            <p><strong>Bus Number:</strong> {selectedBooking.busNumber}</p>
            <p><strong>Departure:</strong> {new Date(selectedBooking.departure).toLocaleString()}</p>
            <p><strong>Arrival:</strong> {new Date(selectedBooking.arrival).toLocaleString()}</p>
            <p><strong>Seats Booked:</strong> {selectedBooking.seatsBooked}</p>
            <p><strong>Amount:</strong> ₹{selectedBooking.amount}</p>
            <p><strong>Status:</strong> {selectedBooking.status.statusName}</p>
            <button onClick={() => setSelectedBooking(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyBookings;
