import React from 'react';
import { Link } from 'react-router-dom';
import { useAppStore } from '../../state/useAppStore';
import './PostPay.css';

export default function PostPay() {
  const url = useAppStore(s => s.finalPdfUrl);

  return (
    <section className="postpay">
      <div className="container">
        <h2>Payment successful 🎉</h2>
        <p className="muted">Your PDF is ready to download.</p>

        <div className="pp-actions">
          <a className="btn btn-primary" href={url || '#'} download>
            Download PDF
          </a>
          <Link className="btn" to="/signup">Create an account</Link>
          <Link className="btn" to="/portfolio/johnindakwa">Share portfolio</Link>
        </div>
      </div>
    </section>
  );
}
