import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppStore } from "../../state/useAppStore";
import html2pdf from "html2pdf.js";
import { LiaCheckCircle } from "react-icons/lia";
import PdfPreview from "../../components/PdfPreview/PdfPreview";
import "./PostPay.css";

export default function PostPay() {
  const html = useAppStore((s) => s.previewHTML);
  const docType = useAppStore((s) => s.docType);
  const switchDocType = useAppStore((s) => s.switchDocType);
  const [showFullPreview, setShowFullPreview] = useState(false);
  const navigate = useNavigate();

  const handleDownload = () => {
    if (!html) return;
    const element = document.createElement("div");
    element.innerHTML = html;

const opt = {
  margin: [0, 0, 0, 0], // no margin at all
  filename: `${docType === "cv" ? "Resume" : "CoverLetter"}.pdf`,
  image: { type: "jpeg", quality: 0.98 },
  html2canvas: { scale: 2, useCORS: true },
  jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
};


    html2pdf().set(opt).from(element).save();
  };

  const handleUpsell = () => {
    // If user had CV, upsell to cover letter; else upsell to CV
    const nextDoc = docType === "cv" ? "cover-letter" : "cv";
    switchDocType(nextDoc);
    navigate("/generate");
  };

  return (
    <section className="postpay">
      <div className="container">
        {/* Success Banner */}
        <div className="success-banner">
          <LiaCheckCircle className="success-icon" />
          <div>
            <h2>Payment Successful</h2>
            <p>Your {docType === "cv" ? "Resume" : "Cover Letter"} is ready.</p>
          </div>
        </div>

        {/* Mini Preview */}
        <div className="doc-preview-box">
          <iframe
            className="doc-preview"
            title="Document Preview"
            srcDoc={html}
          />
        </div>

        {/* Actions */}
        <div className="pp-actions">
          <button className="btn btn-primary" onClick={handleDownload}>
            Download PDF
          </button>
          <button className="btn" onClick={() => setShowFullPreview(true)}>
            View Full Preview
          </button>
        </div>

        {/* Full Preview Modal */}
        {showFullPreview && (
          <div className="modal-overlay">
            <div className="modal doc-modal">
              <button
                className="close-btn"
                onClick={() => setShowFullPreview(false)}
              >
                ✕
              </button>
              <div className="doc-frame">
                <PdfPreview html={html} />
              </div>
            </div>
          </div>
        )}

        {/* Upsell CTA */}
        <div className="upsell-card">
          <h3>Want a {docType === "cv" ? "Cover Letter" : "Resume"} too?</h3>
          <p>
            You can generate a professional{" "}
            {docType === "cv" ? "Cover Letter" : "Resume"} tailored from your
            details for just <strong>Ksh25</strong>.
          </p>
          <button className="btn btn-accent" onClick={handleUpsell}>
            Yes, create my {docType === "cv" ? "Cover Letter" : "Resume"}
          </button>
        </div>

        {/* Create Account CTA */}
        <div className="account-card">
          <h3>Create an Account</h3>
          <p>
            Save your details and generate future{" "}
            {docType === "cv" ? "resumes" : "cover letters"} instantly.
          </p>
          <ul>
            <li>Reuse saved profile details</li>
            <li>Generate documents faster</li>
            <li>Access your past downloads</li>
          </ul>
          <Link className="btn btn-accent cta-btn" to="/signup">
            Create My Free Account
          </Link>
        </div>
      </div>
    </section>
  );
}
