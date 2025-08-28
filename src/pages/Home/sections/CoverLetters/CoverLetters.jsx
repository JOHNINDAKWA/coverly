import React from 'react';
import { Link } from 'react-router-dom';
import {
  LuPenLine,
  LuSparkles,
  LuBuilding2,
  LuSearch,
  LuSend,
  LuChevronRight,
} from 'react-icons/lu';
import clImg from '../../../../assets/images/cl3.jpg';
import { LiaCheckCircleSolid } from "react-icons/lia";
import './CoverLetters.css';

export default function CoverLetters() {
  return (
    <section className="covers">
      <div className="container">
        <div className="covers__grid">
          {/* Image / showcase (left on desktop, top on mobile) */}
          <div className="covers__visual" aria-hidden="true">
            <div className="paper">
              <img src={clImg} alt="" loading="eager" decoding="async" />
              {/* floating chips */}
              <div className="paper__chip chip--fit">
                <LuBuilding2 /> Company fit
              </div>
              <div className="paper__chip chip--tone">
                <LuSparkles /> Right tone
              </div>
            </div>
          </div>

          {/* Copy / value prop */}
          <div className="covers__copy">
            <span className="eyebrow">Cover Letters</span>
            <h2>
              Win attention with a letter that{' '}
              <span className="grad">sounds like you</span>
            </h2>
            <p className="lead">
              We turn your experience + the job ad into a concise, authentic
              letter. No fluff, no clichés—just relevant impact that gets you
              to the interview stage.
            </p>

            {/* Tone presets (visual only here; wire later) */}
            <div className="tone">
              <span className="tone__label">Tones</span>
              <div className="tone__chips">
                <button className="tone__chip is-active">Professional</button>
                <button className="tone__chip">Friendly</button>
                <button className="tone__chip">Confident</button>
                <button className="tone__chip">Academic</button>
              </div>
            </div>

            {/* Feature points */}
            <div className="cl-features">
              <div className="cl-feature">
                <div className="ico"><LuSearch /></div>
                <div>
                  <strong>Matches the role</strong>
                  <p>Pulls key requirements from the job description and mirrors them clearly.</p>
                </div>
              </div>
              <div className="cl-feature">
                <div className="ico"><LiaCheckCircleSolid /></div>
                <div>
                  <strong>No hallucinations</strong>
                  <p>Only uses facts from your CV; flags anything missing as [EDITABLE].</p>
                </div>
              </div>
              <div className="cl-feature">
                <div className="ico"><LuSparkles /></div>
                <div>
                  <strong>Impactful & concise</strong>
                  <p>Short paragraphs, quantified wins, and strong verbs that read naturally.</p>
                </div>
              </div>
            </div>

            {/* Steps */}
            <ol className="steps" aria-label="How it works">
              <li><span>1</span> Upload old CV</li>
              <li><span>2</span> Paste job ad</li>
              <li><span>3</span> Pick tone & template</li>
              <li><span>4</span> Download PDF</li>
            </ol>

            {/* CTAs */}
            <div className="covers__cta">
              <Link to="/upload?type=cover-letter" className="btn-cta primary">
                <LuPenLine /> Write my Cover Letter <LuChevronRight className="chev" />
              </Link>
              <Link to="/upload?type=cv" className="btn-cta ghost">
                Build my Resume
              </Link>
            </div>

            {/* Trust line */}
            <p className="micro">
              <LuSend /> Email-ready & ATS-friendly formatting. Your data stays private.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
