import React from "react";
import BusCard from "../components/BusCard";
import "../user.css";

const SearchResults = () => {
  const buses = [
    { id: 1, name: "Volvo AC", from: "Chennai", to: "Bangalore", departure: "10:00 AM", fare: 500 },
    { id: 2, name: "Sleeper", from: "Chennai", to: "Coimbatore", departure: "11:00 PM", fare: 700 }
  ];

  return (
    <div className="results-page">
      <h2>Available Buses</h2>
      <div className="bus-list">
        {buses.map((bus) => <BusCard key={bus.id} bus={bus} />)}
      </div>
    </div>
  );
};

export default SearchResults;
