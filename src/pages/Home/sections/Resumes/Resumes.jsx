import React from 'react';
import { Link } from 'react-router-dom';
import {
  LuZap,
  LuShield,
  LuSparkles,
  LuFileText,
  LuChevronRight,
} from 'react-icons/lu';
import { LiaCheckCircleSolid } from "react-icons/lia";
import { GiFairyWand } from "react-icons/gi";


import resumesImg from '../../../../assets/images/resume3.png'; // <- rename if needed
import './Resumes.css';

export default function Resumes() {
  return (
    <section className="resumes">
      <div className="container">
        <div className="resumes__grid">
          {/* Copy / Value prop */}
          <div className="resumes__left">
            <span className="eyebrow">Why Coverly</span>
            <h2>
              Resumes that actually{' '}
              <span className="grad">get interviews</span>
            </h2>
            <p className="lead">
              We don’t just re-format your CV. We extract your real experience,
              tailor bullet points to the job, and deliver an ATS-friendly PDF
              that recruiters can skim in seconds.
            </p>

            {/* Feature grid */}
            <div className="features">
              <div className="feature">
                <span className="icon">
                  <GiFairyWand />
                </span>
                <div>
                  <strong>Tailored to each job</strong>
                  <p>Role-specific bullets mapped to the job description.</p>
                </div>
              </div>

              <div className="feature">
                <span className="icon">
                  <LiaCheckCircleSolid />
                </span>
                <div>
                  <strong>ATS-friendly structure</strong>
                  <p>Clean sections, real text (not images), smart keywords.</p>
                </div>
              </div>

              <div className="feature">
                <span className="icon">
                  <LuZap />
                </span>
                <div>
                  <strong>Draft in minutes</strong>
                  <p>Upload old CV → review → download. It’s that quick.</p>
                </div>
              </div>

              <div className="feature">
                <span className="icon">
                  <LuFileText />
                </span>
                <div>
                  <strong>Designer templates</strong>
                  <p>Modern, readable layouts that stand out professionally.</p>
                </div>
              </div>

              <div className="feature">
                <span className="icon">
                  <LuSparkles />
                </span>
                <div>
                  <strong>Impactful wording</strong>
                  <p>Action verbs + quantified achievements (you approve).</p>
                </div>
              </div>

              <div className="feature">
                <span className="icon">
                  <LuShield />
                </span>
                <div>
                  <strong>Privacy by default</strong>
                  <p>Your data stays yours. No noisy trackers or spam.</p>
                </div>
              </div>
            </div>

            {/* Stats bar */}
            <div className="stats">
              <div className="stat">
                <span className="big">2–5&nbsp;min</span>
                <span className="label">to first draft</span>
              </div>
              <div className="divider" />
              <div className="stat">
                <span className="big">10+</span>
                <span className="label">resume templates</span>
              </div>
              <div className="divider" />
              <div className="stat">
                <span className="big">99%</span>
                <span className="label">export success</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="cta-row">
              <Link to="/upload?type=cv" className="btn-cta primary">
                Build my Resume <LuChevronRight className="chev" />
              </Link>
              <Link to="/templates" className="btn-cta ghost">
                View Templates
              </Link>
            </div>
          </div>

          {/* Image / Showcase */}
          <div className="resumes__right" aria-hidden="true">
            <div className="img-card">
              <img
                src={resumesImg}
                alt=""
                loading="eager"
                decoding="async"
              />
              {/* soft shadows + ring accent */}
              <span className="ring ring--1" />
              <span className="ring ring--2" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
