import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppStore } from "../../state/useAppStore";
import html2pdf from "html2pdf.js";
import { LiaCheckCircle } from "react-icons/lia";
import { LuDownload, LuMaximize2, LuUserPlus } from "react-icons/lu";
import { FaFileSignature } from "react-icons/fa";
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
      margin: [0, 0, 0, 0],
      filename: `${docType === "cv" ? "Resume" : "CoverLetter"}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        allowTaint: false,
        imageTimeout: 0,
        logging: false,
      },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };
    html2pdf().set(opt).from(element).save();
  };

  const handleUpsell = () => {
    const nextDoc = docType === "cv" ? "cover-letter" : "cv";
    switchDocType(nextDoc);
    navigate("/generate");
  };

  return (
    <section className="pp2-page">
      <div className="pp2-container">
        {/* Success ribbon (wide + short + green) */}
        <div className="pp2-ribbon">
          <LiaCheckCircle className="pp2-ribbon__icon" />
          <div className="pp2-ribbon__text">
            Payment Success! We did the hard part. Now you get the glory...
          </div>
        </div>

        {/* Main layout */}
        <div className="pp2-main">
          {/* Left column */}
          <aside className="pp2-panel">
            <h2 className="pp2-panel__title">Download & Preview</h2>
            <p className="pp2-panel__sub">
              Review your document and grab the PDF.
            </p>

            <div className="pp2-actions">
              <button
                className="pp2-btn pp2-btn-primary"
                onClick={handleDownload}
              >
                <LuDownload aria-hidden /> Download PDF
              </button>

            </div>

            {/* Upsell */}
            <div className="pp2-card">
              <h3 className="pp2-card__title">
                <FaFileSignature aria-hidden /> Want a{" "}
                {docType === "cv" ? "Cover Letter" : "Resume"} too?
              </h3>
              <p className="pp2-card__text">
                Generate a professional{" "}
                {docType === "cv" ? "Cover Letter" : "Resume"} tailored from
                your details for just{" "}
                <span className="pp2-price-badge">Ksh25</span>.
              </p>
              <button
                className="pp2-btn pp2-btn-primary"
                onClick={handleUpsell}
              >
                Create my {docType === "cv" ? "Cover Letter" : "Resume"}
              </button>
            </div>

            {/* Account */}
            <div className="pp2-card">
              <h3 className="pp2-card__title">
                <LuUserPlus aria-hidden /> Create an Account
              </h3>
              <ul className="pp2-list pp2-list--ticks">
                <li>Reuse your saved details</li>
                <li>Generate documents faster</li>
                <li>Access past downloads</li>
              </ul>
              <Link className="pp2-btn pp2-btn-primary" to="/signup">
                Create My Free Account
              </Link>
            </div>
          </aside>

          {/* Right: preview */}
          <div className="pp2-preview-wrap">
            <div
              className="pp2-preview-card"
              onClick={() => setShowFullPreview(true)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) =>
                (e.key === "Enter" || e.key === " ") && setShowFullPreview(true)
              }
              aria-label="Open full preview"
            >
              <div className="pp2-preview-glow" aria-hidden />
              <iframe
                className="pp2-preview"
                title="Document Preview"
                srcDoc={html}
              />
              <div className="pp2-preview__hint">Click to open full page</div>
            </div>
          </div>
        </div>

        {/* Floating Download (mobile) */}
        <div className="pp2-fab">
          <button className="pp2-btn pp2-btn-primary" onClick={handleDownload}>
            <LuDownload aria-hidden /> Download
          </button>
        </div>

        {/* Full-screen modal */}
        {showFullPreview && (
          <div
            className="pp2-modal-overlay"
            role="dialog"
            aria-modal="true"
            aria-label="Full document preview"
          >
            <div className="pp2-modal pp2-modal--doc">
              <button
                className="pp2-close"
                onClick={() => setShowFullPreview(false)}
                aria-label="Close preview"
              >
                ✕
              </button>
              <div className="pp2-docframe">
                <PdfPreview html={html} />
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
