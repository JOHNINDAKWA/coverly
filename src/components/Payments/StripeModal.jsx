// src/components/Payments/StripeModal.jsx
import React from "react";
import { useAppStore } from "../../state/useAppStore";
import "./modal.css";

export default function StripeModal({ onClose, onPay }) {
  const docType = useAppStore((s) => s.docType);
  const label = docType === "cv" ? "Resume" : "Cover Letter";

  const handleSubmit = (e) => {
    e.preventDefault();
    onPay();
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Secure Card Payment</h2>
        <p className="muted">Pay safely with Stripe.</p>

        <form onSubmit={handleSubmit} className="stripe-form">
          <label>
            Full Name
            <input type="text" placeholder="John Doe" className="input" />
          </label>
          <label>
            Email Address
            <input type="email" placeholder="john@example.com" className="input" />
          </label>

          <label>
            Card Number
            <input type="text" placeholder="1234 1234 1234 1234" className="input" />
          </label>

          <div className="grid-2">
            <label>
              Expiry Date
              <input type="text" placeholder="MM/YY" className="input" />
            </label>
            <label>
              CVC
              <input type="text" placeholder="123" className="input" />
            </label>
          </div>

          <div className="order-summary">
            <h3>Order Summary</h3>
            <ul>
              <li>
                <span>{label}</span>
                <span>Ksh 50</span>
              </li>
              <li>
                <span>Total</span>
                <span className="total">Ksh 50</span>
              </li>
            </ul>
          </div>

          <div className="modal-actions">
            <button type="submit" className="btn btn-primary">
              Pay Ksh 50
            </button>
            <button type="button" className="btn" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>

        <p className="safe-note">🔒 Payments are encrypted and secure.</p>
      </div>
    </div>
  );
}
