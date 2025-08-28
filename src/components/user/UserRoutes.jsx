import React from "react";
import { Routes, Route } from "react-router-dom";
import UserLayout from "./UserLayout";
import Home from "./pages/HomePage";
import SearchResults from "./pages/SearchResults";
import BookingPage from "./pages/BookingPage";
import PaymentPage from "./pages/PaymentPage";
import MyBookings from "./pages/MyBookings";
import ProfilePage from "./pages/ProfilePage";
import HomePage from "./pages/HomePage";

function UserRoutes() {
  return (
    <Routes>
      <Route path="/" element={<UserLayout />}>
        <Route index element={<HomePage />} />
        <Route path="search" element={<SearchResults />} />
        <Route path="booking/:id" element={<BookingPage />} />
        <Route path="payment/:id" element={<PaymentPage />} />
        <Route path="my-bookings" element={<MyBookings />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>
    </Routes>
  );
}

export default UserRoutes;
