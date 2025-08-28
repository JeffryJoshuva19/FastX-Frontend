import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import "./user.css";

function UserLayout() {
  return (
    <div className="user-layout">
      <Navbar />
      <main className="user-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default UserLayout;
