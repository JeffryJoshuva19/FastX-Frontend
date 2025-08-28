import React, { useState } from "react";
import { FaUsers, FaBus, FaMapMarkedAlt, FaRoute, FaBook, FaChartLine, FaBars,FaChair,FaClipboardList } from "react-icons/fa";
import "./sidebar.css";

function Sidebar({ activePage, setActivePage }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`admin-sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        <h2>FastX Bus-Operator</h2>
        <FaBars onClick={() => setCollapsed(!collapsed)} className="collapse-icon" />
      </div>
      <ul>
        <li onClick={() => setActivePage("dashboard")} className={activePage === "dashboard" ? "active" : ""}><FaChartLine /> Dashboard</li>
        <li onClick={() => setActivePage("buses")} className={activePage === "buses" ? "active" : ""}><FaBus /> Manage Buses</li>
        <li onClick={() => setActivePage("schedules")} className={activePage === "schedules" ? "active" : ""}><FaClipboardList /> Manage Schedules</li>
        <li onClick={() => setActivePage("seats")} className={activePage === "seats" ? "active" : ""}><FaChair /> Seats</li>
        <li onClick={() => setActivePage("amenities")} className={activePage === "amenities" ? "active" : ""}><FaRoute /> Amenities</li>
        <li onClick={() => setActivePage("bookings")} className={activePage === "bookings" ? "active" : ""}><FaBook /> Bookings</li>
      </ul>
    </div>
  );
}

export default Sidebar;
