import React, { useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import "./TicketPage.css";

const TicketPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const ticketRef = useRef(null); // ✅ Ref for html2canvas

  const booking = location.state?.booking;

  if (!booking) {
    return (
      <div className="ticket-wrapper">
        <p>Booking not found.</p>
        <button onClick={() => navigate("/my-bookings")}>Back to Bookings</button>
      </div>
    );
  }

  const qrData = `
    Passenger: ${booking.passengerName}
    From: ${booking.origin}
    To: ${booking.destination}
    Date: ${new Date(booking.travelDate).toLocaleDateString()}
    Time: ${new Date(booking.travelDate).toLocaleTimeString()}
    Bus: ${booking.busName} (${booking.busNumber})
    Ticket No: ${booking.bookingId}
    Seats: ${booking.seatNumbers.join(", ")}
    Total: ₹${booking.totalAmount}
  `;

  // ✅ Function to download ticket
  const downloadTicket = async () => {
    if (ticketRef.current) {
      try {
        const canvas = await html2canvas(ticketRef.current, {
          useCORS: true,    // allow cross-origin images
          allowTaint: false, 
        });
        const link = document.createElement("a");
        link.download = `Ticket_${booking.bookingId}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
      } catch (err) {
        console.error("Failed to download ticket:", err);
      }
    }
  };

  return (
    <div className="ticket-wrapper">
      <div className="ticket" ref={ticketRef}>
        {/* Passenger Info */}
        <div className="ticket-header">
          
          <div>
            <h3>{booking.passengerName}</h3>
            <p>Passenger</p>
          </div>
        </div>

        <hr className="dashed-line" />

        {/* Route */}
        <div className="ticket-route">
          <div>
            <h4>{booking.origin}</h4>
            <p>Boarding Point</p>
          </div>
          <div className="bus-icon">🚌</div>
          <div>
            <h4>{booking.destination}</h4>
            <p>Destination</p>
          </div>
        </div>

        {/* Date & Time */}
        <div className="ticket-datetime">
          <div className="box">
            <p>📅 {new Date(booking.travelDate).toLocaleDateString()}</p>
          </div>
          <div className="box">
            <p>⏰ {new Date(booking.travelDate).toLocaleTimeString()}</p>
          </div>
        </div>

        <hr className="dashed-line" />

        {/* Ticket Details */}
        <div className="ticket-details">
          <p><strong>Bus:</strong> {booking.busName}</p>
          <p><strong>Bus No:</strong> {booking.busNumber}</p>
          <p><strong>Ticket No:</strong> {booking.bookingId}</p>
          <p><strong>Seats:</strong> {booking.seatNumbers.join(", ")}</p>
          <p><strong>Total:</strong> ₹{booking.totalAmount}</p>
        </div>

        {/* QR Code */}
        <div className="qr-section">
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
              qrData
            )}`}
            alt="QR Code"
            crossOrigin="anonymous" // ✅ Required for html2canvas
          />
        </div>
      </div>

      <button className="download-btn" onClick={downloadTicket}>
        Download Ticket
      </button>
    </div>
  );
};

export default TicketPage;
