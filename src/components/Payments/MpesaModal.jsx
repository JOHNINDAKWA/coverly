import React, { useMemo, useState } from "react";
import { useAppStore } from "../../state/useAppStore";
import MpesaLogo from "../../assets/images/mpesa.png"; // <- your logo image
import "./modal.css";

export default function MpesaModal({ onClose, onPay }) {
  const [raw, setRaw] = useState("");
  const docType = useAppStore((s) => s.docType);
  const label = docType === "cv" ? "Resume" : "Cover Letter";

  // Normalize to +2547XXXXXXXX
  const phone = useMemo(() => {
    let v = (raw || "").replace(/\s+/g, "");
    if (v.startsWith("07")) v = "+254" + v.slice(1);
    else if (v.startsWith("7")) v = "+254" + v;
    else if (v.startsWith("2547")) v = "+" + v;
    return v;
  }, [raw]);

  const canPay = /^\+2547\d{8}$/.test(phone);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canPay) return alert("Enter a valid Safaricom number e.g. +254712345678");
    onPay(phone);
  };

  return (
    <div className="modal-overlay">
      <div className="modal mpesa saf-theme">
        <header className="mp-head">
          <div className="mp-brand">
            <img src={MpesaLogo} alt="M-PESA" />
          </div>
          <div className="mp-head__text">
            <div className="mp-title">M-PESA Payment</div>
            <div className="mp-secure" aria-label="Secure payment">
              <span className="mp-lock" aria-hidden>🔒</span> Secure STK Push
            </div>
          </div>
        </header>

        <p className="muted mp-intro">
          Enter your Safaricom number and approve the pop-up on your phone.
        </p>

        <form onSubmit={handleSubmit} className="mp-form">
          <label className="mp-label">
            Payment Number
            <div className="mp-inputwrap">
              <div className="mp-sim" aria-hidden />
              <input
                type="tel"
                inputMode="numeric"
                autoComplete="tel"
                placeholder="+254712345678"
                className="input mp-input"
                value={raw}
                onChange={(e) => setRaw(e.target.value)}
                aria-label="Safaricom phone number"
              />
            </div>
         
          </label>

          <div className="order-summary mp-summary">
            <div className="mp-summary__title">Order Summary</div>
            <ul>
              <li><span>{label}</span><span>Ksh 50</span></li>
              <li className="divider" aria-hidden="true"></li>
              <li><span>Total</span><span className="total">Ksh 50</span></li>
            </ul>
          </div>

          <div className="modal-actions mp-actions">
            <button className="btn mp-pay" type="submit" disabled={!canPay}>
              Initiate Payment
            </button>
            <button className="btn" type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>

        {/* <div className="mp-help">
          Having issues with STK Push?{" "}
          <button
            className="mp-link"
            type="button"
            onClick={() => alert("Use Paybill 123456 • Account: YOURNAME • Amount: 50")}
          >
            Click here to use Paybill
          </button>
        </div> */}
      </div>
    </div>
  );
}
