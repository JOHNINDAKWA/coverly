// src/pages/PreviewPay/PreviewPay.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../../state/useAppStore";
import PdfPreview from "../../components/PdfPreview/PdfPreview";
import MpesaModal from "../../components/Payments/MpesaModal";
import StripeModal from "../../components/Payments/StripeModal";
import { LuCreditCard, LuShieldCheck, LuFileText } from "react-icons/lu";
import { LiaCheckCircle } from "react-icons/lia";
import "./PreviewPay.css";
import Mpesa from "../../assets/images/mpesa.png";

export default function PreviewPay() {
  const html = useAppStore((s) => s.previewHTML);
  const navigate = useNavigate();
  const [showMpesa, setShowMpesa] = useState(false);
  const [showStripe, setShowStripe] = useState(false);
  const [loading, setLoading] = useState(false);     // NEW

  // Show a sweet loader for ~2s, then finish
  const completePayment = async (method) => {
    // Close any open modal
    setShowMpesa(false);
    setShowStripe(false);

    setLoading(true);
    // simulate processing…
    await new Promise((r) => setTimeout(r, 4000));
    setLoading(false);

    useAppStore.setState({ stage: 4, lastPaymentMethod: method });
    navigate("/done");
  };

  return (
    <section className="pp">
      <div className="pp__container">
        {/* Header */}
        <header className="pp__head">
          <div className="pp__head-left">
            <div>
              <h2 className="pp__title">Preview your document</h2>
              <p className="pp__subtitle">Make sure everything looks perfect before checkout.</p>
            </div>
          </div>
        </header>

        {/* 2-column layout */}
        <div className="pp__grid">
          {/* Left: preview */}
          <div className="pp__left">
            <div className="pp__doccard">
              <PdfPreview html={html} />
            </div>
          </div>

          {/* Right: pay panel */}
          <aside className="pp__right">
            <div className="pp__paycard">
              <div className="pp__price-row">
                <div>
                  <h3 className="pp__pay-title">Proceed to Payment</h3>
                  <p className="pp__muted">Each document costs <strong>Ksh 50</strong>.</p>
                </div>
                <LuShieldCheck className="pp__shield" aria-hidden />
              </div>

              <ul className="pp__points" aria-label="What you get">
                <li><LiaCheckCircle aria-hidden /> High-quality PDF export</li>
                <li><LiaCheckCircle aria-hidden /> Unlimited re-downloads</li>
                <li><LiaCheckCircle aria-hidden /> Secure payment</li>
              </ul>

<div className="pp__buttons">
  <button
    className="btn btn-primary pp__btn"
    onClick={() => setShowStripe(true)}
    disabled={loading}
    aria-label="Pay with card"
  >
    <LuCreditCard /> Pay with Card
  </button>

  <button
    className="pp__btn-mpesa"
    onClick={() => setShowMpesa(true)}
    disabled={loading}
    aria-label="Lipa na M-Pesa"
  >
    <img src={Mpesa} alt="M-Pesa" aria-hidden="true" />
    Lipa na M-Pesa
  </button>
</div>


              <p className="pp__safe">
                Your payment is secured and your data is never shared.
              </p>
            </div>
          </aside>
        </div>
      </div>

      {/* Loading overlay */}
      {loading && (
        <div className="pp__loading" role="alert" aria-live="assertive">
          <div className="pp__loader">
            <span className="pp__spinner" />
            <span className="pp__dots">
              Processing payment<span>.</span><span>.</span><span>.</span>
            </span>
          </div>
        </div>
      )}

      {/* Modals */}
      {showMpesa && (
        <MpesaModal
          onClose={() => setShowMpesa(false)}
          onPay={() => completePayment("Mpesa")}
        />
      )}
      {showStripe && (
        <StripeModal
          onClose={() => setShowStripe(false)}
          onPay={() => completePayment("Stripe")}
        />
      )}
    </section>
  );
}
