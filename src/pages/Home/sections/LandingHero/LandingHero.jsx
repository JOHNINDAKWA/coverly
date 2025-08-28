import React from 'react';
import { Link } from 'react-router-dom';
import { LuFileText, LuPenLine, LuChevronRight } from 'react-icons/lu';
import cvImg from '../../../../assets/images/cv2.png';
import clImg from '../../../../assets/images/cl.png';
import './LandingHero.css';

export default function LandingHero() {
  return (
    <section className="hero">
      <div className="hero__inner">
                {/* Right: stacked documents */}
        <div className="hero__showcase" aria-hidden="true">
          {/* Background glow & shapes */}
          <div className="hero__glow" />
          <div className="hero__rings">
            <span />
            <span />
            <span />
          </div>

          {/* Cards */}
          <figure className="doc-card doc-card--cv">
            <img src={clImg} alt="" />
          </figure>

          <figure className="doc-card doc-card--cl">
            <img src={cvImg} alt="" />
          </figure>
        </div>

        
        {/* Left: copy & CTAs */}
        <div className="hero__copy">
          <span className="chip">Resumes & Cover Letters</span>
          <h1>
            Land the interview with
            <br />
            <span className="brand">tailored documents</span>
          </h1>
          <p className="lead">
            Upload your old CV or cover letter, paste the job description, pick a template,
            and download a beautiful, ATS-friendly PDF.
          </p>

          <div className="hero__cta">
            <Link to="/upload?type=cv" className="cta cta--primary">
              <LuFileText /> Build my Resume <LuChevronRight className="chev" />
            </Link>
            <Link to="/upload?type=cover-letter" className="cta cta--ghost">
              <LuPenLine /> Write a Cover Letter
            </Link>
          </div>

          <div className="hero__notes">
            <span className="badge">Fast</span>
            <span className="badge">ATS Friendly</span>
            <span className="badge">PDF Export</span>
          </div>
        </div>


      </div>
    </section>
  );
}
