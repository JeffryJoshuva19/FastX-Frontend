import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./SearchResults.css";

const SearchResults = () => {
  const location = useLocation();
  const buses = location.state?.buses || [];

  return (
    <div className="search-results-page">
      <h2>Available Buses</h2>
      <div className="search-results-wrapper">
        <div className="bus-cards">
          {buses.length > 0 ? (
            buses.map((bus) => (
              <div key={bus.scheduleId} className="bus-card">
                <div className="bus-left">
                  <h3>{bus.busName}</h3>
                  <p className="bus-type">{bus.busType}</p>
                  <p className="timing">
                    {new Date(bus.departureDateTime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}{" "}
                    -{" "}
                    {new Date(bus.arrivalDateTime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  <p className="seats">Seats Available: {bus.availableSeats}</p>
                </div>
                
                <div className="bus-right">
                  <h3 className="fare">₹{bus.fare}</h3>
                  <Link
                    to={`/user/seat-selection/${bus.scheduleId}`}
                    state={{ bus }} // Pass the bus info here
                    className="book-btn"
                  >
                    Book Now
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <p>No buses found for the selected route.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
