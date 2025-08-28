import React from "react";
import { useLocation } from "react-router-dom";
import "../user.css";

const PaymentPage = () => {
  const location = useLocation();
  const seats = location.state?.seats || [];

  return (
    <div className="payment-page">
      <h2>Payment</h2>
      <p>Seats Selected: {seats.join(", ")}</p>
      <button className="pay-btn">Pay Now</button>
    </div>
  );
};

export default PaymentPage;
