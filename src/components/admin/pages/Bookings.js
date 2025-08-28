import React, { useEffect, useState } from "react";
import { FaEye } from "react-icons/fa";
import "./Pages.css";

function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const API_URL = "http://localhost:5227/api/Admin/all-bookings";
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

  if (loading) return <p>Loading bookings...</p>;
  if (bookings.length === 0) return <p>No bookings found.</p>;

  return (
    <div className="admin-page">
      <h1>View Bookings</h1>
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>User</th>
            <th>Bus</th>
            <th>Route</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b) => (
            <tr key={b.bookingId}>
              <td>{b.bookingId}</td>
              <td>{b.userName}</td>
              <td>{b.busName}</td>
              <td>{b.route}</td>
              <td>
                <span
                  className={`status-badge ${
                    b.paymentStatus.statusName === "Confirmed"
                      ? "approved"
                      : "pending"
                  }`}
                >
                  {b.paymentStatus.statusName}
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
            <p><strong>User:</strong> {selectedBooking.userName} ({selectedBooking.userEmail})</p>
            <p><strong>Bus:</strong> {selectedBooking.busName}</p>
            <p><strong>Route:</strong> {selectedBooking.route}</p>
            <p><strong>Departure:</strong> {new Date(selectedBooking.departureDateTime).toLocaleString()}</p>
            <p><strong>Arrival:</strong> {new Date(selectedBooking.arrivalDateTime).toLocaleString()}</p>
            <p><strong>Total Amount:</strong> ₹{selectedBooking.totalAmount}</p>
            <p><strong>Payment Status:</strong> {selectedBooking.paymentStatus.statusName}</p>
            <button onClick={() => setSelectedBooking(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Bookings;
