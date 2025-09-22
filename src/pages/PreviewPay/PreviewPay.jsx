// src/pages/PreviewPay/PreviewPay.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../../state/useAppStore";
import PdfPreview from "../../components/PdfPreview/PdfPreview";
import MpesaModal from "../../components/Payments/MpesaModal";
import StripeModal from "../../components/Payments/StripeModal";
import { LuCreditCard } from "react-icons/lu";
import "./PreviewPay.css";
import Mpesa from '../../assets/images/mpesa.png'


export default function PreviewPay() {
  const html = useAppStore((s) => s.previewHTML);
  const navigate = useNavigate();
  const [showMpesa, setShowMpesa] = useState(false);
  const [showStripe, setShowStripe] = useState(false);

  const completePayment = (method) => {
    alert(`✅ ${method} payment successful!`);
    useAppStore.setState({ stage: 4 });
    navigate("/done");
  };

  return (
    <section className="preview">
      <div className="container">
        <h2>Preview your document</h2>
        <PdfPreview html={html} />

        <div className="pay-box">
          <h3>Proceed to Payment</h3>
          <p className="muted">Each document costs <strong>Ksh 50</strong>.</p>

          <div className="pay-options">
            <button className="btn btn-primary pay-btn" onClick={() => setShowStripe(true)}>
              <LuCreditCard /> Pay with Stripe
            </button>

            <button className="mpesa-btn" onClick={() => setShowMpesa(true)}>
               <img src={Mpesa} alt="Mpesa" />
              Buy with Mpesa
            </button>
          </div>
        </div>

        {showMpesa && (
          <MpesaModal onClose={() => setShowMpesa(false)} onPay={() => completePayment("Mpesa")} />
        )}
        {showStripe && (
          <StripeModal onClose={() => setShowStripe(false)} onPay={() => completePayment("Stripe")} />
        )}
      </div>
    </section>
  );
}
