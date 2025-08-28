import React, { useState } from "react";
import Sidebar from "./components/sidebar";
import Dashboard from "./pages/Dashboard";
import Buses from "./pages/Buses";
import Amenities from "./pages/Amenities";
import Schedules from "./pages/Schedules";
import Seats from "./pages/Seats";
import Bookings from "./pages/Bookings";
import "./App.css";

function AdminApp() {
  const [activePage, setActivePage] = useState("dashboard");

  const renderPage = () => {
    switch (activePage) {
      case "dashboard": return <Dashboard />;
      case "buses": return <Buses />;
      case "amenities": return <Amenities />;
      case "schedules": return <Schedules />;
      case "seats": return <Seats />;
      case "bookings": return <Bookings />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="admin-app">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      <main className="admin-content">
        {renderPage()}
      </main>
    </div>
  );
}

export default AdminApp;
