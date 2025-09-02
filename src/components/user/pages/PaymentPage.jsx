import React, { useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import "./PaymentPage.css";

const PaymentPage = () => {
  const { bookingId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { amount } = location.state || {};

  const [transactionId, setTransactionId] = useState("");
  const [paymentMethodId, setPaymentMethodId] = useState(1);

  if (!bookingId) {
    return <p style={{ color: "red" }}>❌ No bookingId provided</p>;
  }

  const handlePayment = async () => {
    const paymentData = {
      bookingId: parseInt(bookingId),
      amount: amount,
      transactionId: transactionId || `TXN-${Date.now()}`,
      paymentMethodId: paymentMethodId,
    };

    try {
      const response = await fetch("http://localhost:5227/api/Payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
        body: JSON.stringify(paymentData),
      });

      if (response.ok) {
        alert("✅ Payment successful!");
        navigate("/user/bookings");
      } else {
        alert("❌ Payment failed. Please try again.");
      }
    } catch (error) {
      console.error("Error making payment:", error);
      alert("❌ Something went wrong. Please try again.");
    }
  };

  return (
    <div className="payment-page">
      <div className="payment-container">
        <h2>Payment</h2>

        <p><strong>Booking ID:</strong> {bookingId}</p>
        <p><strong>Total Amount:</strong> ₹{amount ?? "Not provided"}</p>

        <div className="payment-methods">
          <label className={paymentMethodId === 1 ? "active" : ""}>
            <input
              type="radio"
              value={1}
              checked={paymentMethodId === 1}
              onChange={() => setPaymentMethodId(1)}
            /> UPI
          </label>
          <label className={paymentMethodId === 2 ? "active" : ""}>
            <input
              type="radio"
              value={2}
              checked={paymentMethodId === 2}
              onChange={() => setPaymentMethodId(2)}
            /> Credit Card
          </label>
          <label className={paymentMethodId === 3 ? "active" : ""}>
            <input
              type="radio"
              value={3}
              checked={paymentMethodId === 3}
              onChange={() => setPaymentMethodId(3)}
            /> Debit Card
          </label>
          <label className={paymentMethodId === 4 ? "active" : ""}>
            <input
              type="radio"
              value={4}
              checked={paymentMethodId === 4}
              onChange={() => setPaymentMethodId(4)}
            /> Net Banking
          </label>
        </div>

        <div className="card-form">
          <input
            type="text"
            placeholder="Transaction ID (optional)"
            value={transactionId}
            onChange={(e) => setTransactionId(e.target.value)}
          />
        </div>

        <button className="pay-btn" onClick={handlePayment}>
          Pay Now
        </button>
      </div>
    </div>
  );
};

export default PaymentPage;
