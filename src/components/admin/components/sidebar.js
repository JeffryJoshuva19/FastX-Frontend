import React, { useState } from "react";
import { FaUsers, FaBus, FaMapMarkedAlt, FaRoute, FaBook, FaChartLine, FaBars } from "react-icons/fa";
import "./sidebar.css";

function Sidebar({ activePage, setActivePage }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`admin-sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        <h2>FastX Admin</h2>
        <FaBars onClick={() => setCollapsed(!collapsed)} className="collapse-icon" />
      </div>
      <ul>
        <li onClick={() => setActivePage("dashboard")} className={activePage === "dashboard" ? "active" : ""}><FaChartLine /> Dashboard</li>
        <li onClick={() => setActivePage("users")} className={activePage === "users" ? "active" : ""}><FaUsers /> Users</li>
        <li onClick={() => setActivePage("operators")} className={activePage === "operators" ? "active" : ""}><FaBus /> Operators</li>
        <li onClick={() => setActivePage("locations")} className={activePage === "locations" ? "active" : ""}><FaMapMarkedAlt /> Locations</li>
        <li onClick={() => setActivePage("routes")} className={activePage === "routes" ? "active" : ""}><FaRoute /> Routes</li>
        <li onClick={() => setActivePage("bookings")} className={activePage === "bookings" ? "active" : ""}><FaBook /> Bookings</li>
      </ul>
    </div>
  );
}

export default Sidebar;
