// src/components/Payments/MpesaModal.jsx
import React, { useState } from "react";
import { useAppStore } from "../../state/useAppStore";
import "./modal.css";

export default function MpesaModal({ onClose, onPay }) {
  const [phone, setPhone] = useState("");
  const docType = useAppStore((s) => s.docType); // 'cv' or 'cover-letter'

  const label = docType === "cv" ? "Resume" : "Cover Letter";

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!phone) return alert("Please enter your phone number");
    onPay(phone);
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Pay with Mpesa</h2>
        <p className="muted">
          Enter your Safaricom number. You’ll receive a prompt on your phone to
          complete payment.
        </p>

        <form onSubmit={handleSubmit} className="mpesa-form">
          <label>
            Phone Number (Safaricom)
            <input
              type="tel"
              placeholder="+2547XXXXXXXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="input"
            />
          </label>

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
            <button type="submit" className="btn btn-accent">
              Pay Ksh 50
            </button>
            <button type="button" className="btn" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>

        <p className="mpesa-instructions">
          <strong>Instructions:</strong>
          <br />
          1. Enter your Safaricom phone number above.
          <br />
          2. You will get a pop-up on your phone.
          <br />
          3. Enter your Mpesa PIN to authorize.
          <br />
          4. Payment confirmation will appear instantly.
        </p>
      </div>
    </div>
  );
}
