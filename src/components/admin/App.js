import React, { useState } from "react";
import Sidebar from "./components/sidebar";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Operators from "./pages/Operators";
import Locations from "./pages/Locations";
import Routes from "./pages/Routes";
import Bookings from "./pages/Bookings";
import "./App.css";

function AdminApp() {
  const [activePage, setActivePage] = useState("dashboard");

  const renderPage = () => {
    switch (activePage) {
      case "dashboard": return <Dashboard />;
      case "users": return <Users />;
      case "operators": return <Operators />;
      case "locations": return <Locations />;
      case "routes": return <Routes />;
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
