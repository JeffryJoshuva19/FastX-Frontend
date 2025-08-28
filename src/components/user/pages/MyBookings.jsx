import React from "react";
import "../user.css";

const MyBookings = () => {
  const bookings = [
    { id: 1, bus: "Volvo AC", date: "20-08-2025", seats: [5, 6] },
    { id: 2, bus: "Sleeper", date: "22-08-2025", seats: [10] }
  ];

  return (
    <div className="my-bookings">
      <h2>My Bookings</h2>
      <ul>
        {bookings.map((b) => (
          <li key={b.id}>
            {b.bus} - {b.date} - Seats: {b.seats.join(", ")}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyBookings;
