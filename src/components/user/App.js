import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import SearchBus from "./pages/SearchResults";
import SearchForm from "./pages/SearchForm";
import BookingConfirmation from "./pages/BookingConfirmation";
import BusResults from "./pages/BusResults";
import SeatSelection from "./pages/SeatSelection";
import PaymentPage from "./pages/PaymentPage";
import MyBookings from "./pages/MyBookings";
import TicketPage from "./pages/TicketPage";
import UserProfile from "./pages/UserProfile";
import "./App.css";

function UserApp() {
  return (
    <div className="user-app">
      <Navbar />
      <Routes>
        <Route path="home" element={<Home />} />
        <Route path="search-results" element={<SearchBus />} />
        <Route path="search" element={<SearchForm />} />
        <Route path="results" element={<BusResults />} />
        <Route path="seat-selection/:busId" element={<SeatSelection />} />
        <Route path="payment/:bookingId" element={<PaymentPage />} />
        <Route path="booking-confirmation" element={<BookingConfirmation />} />
        <Route path="bookings" element={<MyBookings />} />
        <Route path="ticket/:bookingId" element={<TicketPage />} />
        <Route path="userprofile" element={<UserProfile/>}/>

      </Routes>
    </div>
  );
}

export default UserApp;
