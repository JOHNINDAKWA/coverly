import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../state/useAppStore';
import { LuSparkles, LuMail, LuPhone, LuMapPin } from 'react-icons/lu';
import { RxMagicWand } from "react-icons/rx";

import './Generate.css';

function ContactLine({ email, phone, location }) {
  const bits = [email, phone, location].filter(Boolean);
  if (!bits.length) return null;
  return <div className="doc-contact">{bits.join(' • ')}</div>;
}

function Skills({ skills }) {
  if (!skills?.length) return null;
  return (
    <section className="doc-section">
      <h3>Skills</h3>
      <ul className="tags">
        {skills.map((s, i) => <li key={i} className="tag">{s}</li>)}
      </ul>
    </section>
  );
}

function Achievements({ achievements }) {
  if (!achievements?.length) return null;
  return (
    <section className="doc-section">
      <h3>Achievements</h3>
      <ul className="bullets">
        {achievements.map((a, i) => <li key={i}>{a}</li>)}
      </ul>
    </section>
  );
}

function Certifications({ certifications }) {
  const items = (certifications || []).filter(c => c.name || c.issuer || c.year);
  if (!items.length) return null;
  return (
    <section className="doc-section">
      <h3>Certifications</h3>
      <ul className="bullets">
        {items.map((c, i) => (
          <li key={i}>
            <strong>{c.name}</strong>
            {c.issuer ? <> &nbsp;<span className="dim">({c.issuer})</span></> : null}
            {c.year ? <> &nbsp;•&nbsp; <span className="dim">{c.year}</span></> : null}
          </li>
        ))}
      </ul>
    </section>
  );
}

function References({ references }) {
  const items = (references || []).filter(r => r.name || r.email || r.phone || r.title || r.company);
  if (!items.length) return null;
  return (
    <section className="doc-section">
      <h3>References</h3>
      <div className="ref-grid">
        {items.map((r, i) => (
          <article key={i} className="ref-card">
            <div className="ref-name">{r.name}</div>
            <div className="ref-meta dim">
              {[r.title, r.company].filter(Boolean).join(' • ')}
            </div>
            <div className="ref-contact">
              {r.email && (<span><LuMail /> <div> {r.email}</div></span>)}
              {r.phone && (<span><LuPhone /> <div>{r.phone}</div></span>)}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function Experience({ experience }) {
  const jobs = (experience || []).filter(j => j.role || j.company || j.bullets?.length);
  if (!jobs.length) return null;
  return (
    <section className="doc-section">
      <h3>Experience</h3>
      <div className="timeline">
        {jobs.map((j, i) => (
          <div className="tl-item" key={i}>
            <div className="tl-dot" />
            <header className="tl-head">
              <div className="tl-title">
                <strong>{j.role}</strong>
                {j.company ? <> &nbsp;•&nbsp; <span className="dim">{j.company}</span></> : null}
                {j.city ? <> &nbsp;•&nbsp; <span className="dim">{j.city}</span></> : null}
              </div>
              <div className="tl-dates dim">{[j.start, j.end || 'Present'].filter(Boolean).join(' – ')}</div>
            </header>
            {Array.isArray(j.bullets) && j.bullets.length > 0 && (
              <ul className="bullets">
                {j.bullets.map((b, k) => <li key={k}>{b}</li>)}
              </ul>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

function Education({ education }) {
  const items = (education || []).filter(ed => ed.school || ed.degree || ed.field);
  if (!items.length) return null;
  return (
    <section className="doc-section">
      <h3>Education</h3>
      <ul className="edu-list">
        {items.map((ed, i) => (
          <li key={i}>
            <div className="edu-title">
              <strong>{ed.degree || ed.certificate}</strong>
              {ed.field ? <> &nbsp;—&nbsp; {ed.field}</> : null}
            </div>
            <div className="dim">
              {[ed.school, [ed.startYear, ed.endYear].filter(Boolean).join('–')].filter(Boolean).join(' • ')}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function Generate() {
  const navigate = useNavigate();
  const docType = useAppStore(s => s.docType);
  const profile = useAppStore(s => s.extractedProfile) || {};
  const drafts = useAppStore(s => s.drafts);
  const preparePreview = useAppStore(s => s.preparePreview);

  if (!drafts) return null;

  // ---- Static professional summary fallback ----
  const defaultSummary = useMemo(() => {
    const title = profile.title || 'Professional';
    const years = (() => {
      const exp = Array.isArray(profile.experience) ? profile.experience : [];
      if (!exp.length) return null;
      const total = exp.reduce((sum, e) => {
        const sy = parseInt(String(e.start || '').slice(0, 4), 10);
        const ey = String(e.end).toLowerCase() === 'present'
          ? new Date().getFullYear()
          : parseInt(String(e.end || '').slice(0, 4), 10);
        if (!sy || !ey || ey < sy) return sum;
        return sum + (ey - sy);
      }, 0);
      return total || null;
    })();
    const skillBits = (profile.skills || []).slice(0, 4);
    const skillLine = skillBits.length ? ` Skilled in ${skillBits.join(', ')}.` : '';
    return `${title} with${years ? ` ${years}+ years of` : ''} hands-on experience delivering measurable outcomes across fast-paced environments.${skillLine} Known for ownership, clarity, and a bias for impact.`;
  }, [profile.title, profile.experience, profile.skills]);

  const letterBody = useMemo(() => {
    if (docType !== 'cover-letter') return null;
    const body = drafts.primary || '';
    return body
      .split(/\n{2,}/)
      .map(p => p.trim())
      .filter(Boolean);
  }, [docType, drafts]);

  const onContinue = async () => {
    await preparePreview();
    navigate('/templates');
  };

  return (
    <section className="generate">
      <div className="container">
        <header className="g-head">
          <div className="g-head__left">
            <LuSparkles className="g-head__icon" aria-hidden />
            <div>
              <h2>{docType === 'cv' ? 'Review your resume draft' : 'Review your letter draft'}</h2>
              <p className="muted">Crafted from your profile and job context.</p>
            </div>
          </div>
          <span className="ai-badge">
          <RxMagicWand aria-hidden />
            AI Generated
          </span>
        </header>

        <div className="doc-card">
          <div className="doc-card__glow" aria-hidden />
          <article className="doc">
            {/* Header */}
            <header className="doc-header">
              <h1 className="doc-name">{profile.name || 'Your Name'}</h1>
              {profile.title && <div className="doc-title">{profile.title}</div>}
              <ContactLine email={profile.email} phone={profile.phone} location={profile.location} />
            </header>

            {/* Body */}
            {docType === 'cv' ? (
              <>
                {/* Professional Summary (always present with fallback) */}
                <section className="doc-section">
                  <h3>Professional Summary</h3>
                  <p className="lead">{(profile.summary || '').trim() || defaultSummary}</p>
                </section>

                <Skills skills={profile.skills} />
                <Experience experience={profile.experience} />
                <Education education={profile.education} />
                <Achievements achievements={profile.achievements} />
                <Certifications certifications={profile.certifications} />
                <References references={profile.references} />
              </>
            ) : (
              <section className="doc-letter">
                {letterBody?.map((p, i) => <p key={i}>{p}</p>)}
                <p>—</p>
                <p className="dim"><LuMail /> {profile.email} &nbsp; <LuPhone /> {profile.phone} &nbsp; <LuMapPin /> {profile.location}</p>
              </section>
            )}
          </article>

          <div className="draft-actions">
            <button className="btn btn-primary" onClick={onContinue}>
              Continue
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
