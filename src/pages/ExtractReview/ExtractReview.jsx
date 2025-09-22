// src/pages/ExtractReview/ExtractReview.jsx
import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../state/useAppStore';
import ManualProfileModal from '../../components/ManualProfile/ManualProfile';
import {
  LuUser, LuMail, LuPhone, LuMapPin,
  LuSparkles, LuChevronRight, LuPlus, LuTrash2, LuBriefcase, LuGraduationCap
} from 'react-icons/lu';
import { CiEdit } from "react-icons/ci";
import './ExtractReview.css';

export default function ExtractReview() {
  const storeProfile = useAppStore(s => s.extractedProfile);
  const jdText = useAppStore(s => s.jdText);
  const setProfile = (p) => useAppStore.setState({ extractedProfile: p });
  const generateDrafts = useAppStore(s => s.generateDrafts);
  const navigate = useNavigate();

  const [local, setLocal] = useState(storeProfile || {});
  const [showManual, setShowManual] = useState(false);

  if (!storeProfile) return null;

  const initials = useMemo(() => {
    const parts = String(local.name || '').trim().split(/\s+/);
    return (parts[0]?.[0] || '') + (parts[1]?.[0] || '');
  }, [local.name]);

  const jdSnippet = (jdText || '').slice(0, 220).trim() + ((jdText || '').length > 220 ? '…' : '');

  const onContinue = async () => {
    setProfile(local);
    await generateDrafts();
    const current = useAppStore.getState().stage;
    if (current < 2) useAppStore.setState({ stage: 2 });
    navigate('/generate');
  };

  // === Skills handlers ===
  const addSkill = () => setLocal(prev => ({ ...prev, skills: [...(prev.skills || []), ''] }));
  const updateSkill = (i, v) =>
    setLocal(prev => ({ ...prev, skills: prev.skills.map((s, idx) => (idx === i ? v : s)) }));
  const removeSkill = (i) =>
    setLocal(prev => ({ ...prev, skills: prev.skills.filter((_, idx) => idx !== i) }));

  // === Experience handlers ===
  const updateJob = (i, patch) =>
    setLocal(prev => ({
      ...prev,
      experience: (prev.experience || []).map((j, idx) => (idx === i ? { ...j, ...patch } : j)),
    }));

  // === Education handlers ===
  const addEdu = () => setLocal(prev => ({ ...prev, education: [...(prev.education || []), {}] }));
  const updateEdu = (i, patch) =>
    setLocal(prev => ({
      ...prev,
      education: (prev.education || []).map((ed, idx) => (idx === i ? { ...ed, ...patch } : ed)),
    }));
  const removeEdu = (i) =>
    setLocal(prev => ({ ...prev, education: prev.education.filter((_, idx) => idx !== i) }));

  const canGenerate =
    String(local.name || '').trim().length > 1 &&
    String(local.email || '').includes('@') &&
    (local.experience || []).length > 0;

  return (
    <section className="extract">
      <div className="container">
        {/* Head */}
        <header className="xr-head">
          <div>
            <h2>Review your details</h2>
            <p className="muted">Make quick edits below. You can open the full form if needed.</p>
          </div>
          <button className="btn" onClick={() => setShowManual(true)}>
            <CiEdit /> Open full profile form
          </button>
        </header>

        {/* Grid */}
        <div className="xr-grid">
          {/* LEFT — Snapshot */}
          <aside className="xr-snapshot card">
            <div className="snap-top">
              <div className="avatar">{initials || 'U'}</div>
              <div className="who">
                <input
                  className="big"
                  value={local.name || ''}
                  placeholder="Your full name"
                  onChange={(e) => setLocal({ ...local, name: e.target.value })}
                />
                <input
                  className="sub"
                  value={local.title || ''}
                  placeholder="Your professional title (e.g. Software Developer)"
                  onChange={(e) => setLocal({ ...local, title: e.target.value })}
                />
                <div className="chips">
                  <span className="chip">
                    <LuMail /><input
                      value={local.email || ''}
                      placeholder="email@example.com"
                      onChange={(e) => setLocal({ ...local, email: e.target.value })}
                    />
                  </span>
                  <span className="chip">
                    <LuPhone /><input
                      value={local.phone || ''}
                      placeholder="+254 7xx xxx xxx"
                      onChange={(e) => setLocal({ ...local, phone: e.target.value })}
                    />
                  </span>
                  <span className="chip">
                    <LuMapPin /><input
                      value={local.location || ''}
                      placeholder="City, Country"
                      onChange={(e) => setLocal({ ...local, location: e.target.value })}
                    />
                  </span>
                </div>
              </div>
            </div>

            {/* Skills quick edit */}
            <div className="snap-skills">
              <div className="title"><LuSparkles /> Skills</div>
              <div className="skill-list">
                {(local.skills || []).map((s, i) => (
                  <label key={i} className="skill-pill">
                    <input
                      value={s}
                      placeholder="e.g. React"
                      onChange={(e) => updateSkill(i, e.target.value)}
                    />
                    <button type="button" className="pill-x" onClick={() => removeSkill(i)} aria-label="Remove skill">×</button>
                  </label>
                ))}
                <button type="button" className="mini" onClick={addSkill}><LuPlus /> Add skill</button>
              </div>
            </div>

            {/* Job ad snippet (readonly) */}
            {jdText && (
              <div className="snap-jd">
                <div className="title">Job description (snippet)</div>
                <p className="jd">{jdSnippet}</p>
              </div>
            )}
          </aside>

          {/* RIGHT — Experience + Education */}
          <section className="xr-main">
            {/* Experience */}
            <div className="card">
              <div className="card__title"><LuBriefcase /> Experience</div>
              <div className="jobs">
                {(local.experience || []).map((job, i) => (
                  <article className="job-card" key={i}>
                    <div className="row two">
                      <label>Role
                        <input
                          value={job.role || ''}
                          onChange={(e) => updateJob(i, { role: e.target.value })}
                          placeholder="e.g. Software Engineer"
                        />
                      </label>
                      <label>Company
                        <input
                          value={job.company || ''}
                          onChange={(e) => updateJob(i, { company: e.target.value })}
                          placeholder="e.g. IBM"
                        />
                      </label>
                    </div>
                    <div className="row three">
                      <label>City/Town
                        <input
                          value={job.city || ''}
                          onChange={(e) => updateJob(i, { city: e.target.value })}
                          placeholder="e.g. Nairobi"
                        />
                      </label>
                      <label>Start
                        <input
                          value={job.start || ''}
                          onChange={(e) => updateJob(i, { start: e.target.value })}
                          placeholder="YYYY-MM"
                        />
                      </label>
                      <label>End
                        <input
                          value={job.end || ''}
                          onChange={(e) => updateJob(i, { end: e.target.value })}
                          placeholder="YYYY-MM or Present"
                        />
                      </label>
                    </div>
                    <label>Key bullets (one per line)
                      <textarea
                        rows={6}
                        value={(job.bullets || []).join ? job.bullets.join('\n') : job.bullets || ''}
                        onChange={(e) =>
                          updateJob(i, {
                            bullets: e.target.value.split('\n').map(b => b.trim()).filter(Boolean),
                          })
                        }
                        placeholder={'Increased X by 20%\nShipped feature Y'}
                      />
                    </label>
                    {(local.experience || []).length > 1 && (
                      <button
                        type="button"
                        className="mini danger"
                        onClick={() =>
                          setLocal(prev => ({
                            ...prev,
                            experience: prev.experience.filter((_, idx) => idx !== i),
                          }))
                        }
                      >
                        <LuTrash2 /> Remove
                      </button>
                    )}
                  </article>
                ))}
              </div>
            </div>

            {/* Education */}
            <div className="card">
              <div className="card__title"><LuGraduationCap /> Education</div>
              <div className="jobs">
                {(local.education || []).map((ed, i) => (
                  <article className="job-card" key={i}>
                    <div className="row two">
                      <label>Institution
                        <input
                          value={ed.school || ''}
                          onChange={(e) => updateEdu(i, { school: e.target.value })}
                          placeholder="e.g. University of Nairobi"
                        />
                      </label>
                      <label>Degree / Certificate
                        <input
                          value={ed.degree || ''}
                          onChange={(e) => updateEdu(i, { degree: e.target.value })}
                          placeholder="e.g. BSc Computer Science"
                        />
                      </label>
                    </div>
                    <div className="row two">
                      <label>Field of Study
                        <input
                          value={ed.field || ''}
                          onChange={(e) => updateEdu(i, { field: e.target.value })}
                          placeholder="e.g. Computer Science"
                        />
                      </label>
                      <div className="row two">
                        <label>Start Year
                          <input
                            value={ed.startYear || ''}
                            onChange={(e) => updateEdu(i, { startYear: e.target.value })}
                            placeholder="YYYY"
                          />
                        </label>
                        <label>End Year
                          <input
                            value={ed.endYear || ''}
                            onChange={(e) => updateEdu(i, { endYear: e.target.value })}
                            placeholder="YYYY"
                          />
                        </label>
                      </div>
                    </div>
                    {(local.education || []).length > 1 && (
                      <button
                        type="button"
                        className="mini danger"
                        onClick={() => removeEdu(i)}
                      >
                        <LuTrash2 /> Remove
                      </button>
                    )}
                  </article>
                ))}
              </div>
              <button type="button" className="mini" onClick={addEdu}>
                <LuPlus /> Add education
              </button>
            </div>
          </section>
        </div>

        {/* Sticky bottom actions */}
        <div className="extract__actions">
          <button className="btn btn-primary" disabled={!canGenerate} onClick={onContinue}>
            Generate <LuChevronRight />
          </button>
        </div>
      </div>

      {showManual && (
        <ManualProfileModal
          onClose={() => {
            setShowManual(false);
            const latest = useAppStore.getState().extractedProfile;
            latest && setLocal(latest);
          }}
        />
      )}
    </section>
  );
}
