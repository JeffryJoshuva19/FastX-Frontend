import React, { useState } from "react";
import "../../user/user.css";

const SeatSelection = ({ totalSeats = 30, onSelect }) => {
  const [selected, setSelected] = useState([]);

  const toggleSeat = (seat) => {
    const updated = selected.includes(seat)
      ? selected.filter((s) => s !== seat)
      : [...selected, seat];
    setSelected(updated);
    onSelect(updated);
  };

  return (
    <div className="seat-container">
      {Array.from({ length: totalSeats }, (_, i) => i + 1).map((seat) => (
        <div
          key={seat}
          className={`seat ${selected.includes(seat) ? "selected" : ""}`}
          onClick={() => toggleSeat(seat)}
        >
          {seat}
        </div>
      ))}
    </div>
  );
};

export default SeatSelection;
