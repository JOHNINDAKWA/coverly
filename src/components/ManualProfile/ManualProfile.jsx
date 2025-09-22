import React, { useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { useAppStore } from '../../state/useAppStore';
import {
  LuX,
  LuSave,
  LuChevronRight,
  LuChevronLeft,
  LuUser,
  LuGlobe,
  LuMail,
  LuPhone,
  LuBriefcase,
  LuBuilding2,
  LuMapPin,
  LuCalendar,
  LuPlus,
  LuTrash2,
  LuSparkles,
  
} from 'react-icons/lu';

import { LiaCheckCircle } from "react-icons/lia";
import { FaHome } from "react-icons/fa";

import './ManualProfile.css';

const MONTHS = [
  '01 - Jan','02 - Feb','03 - Mar','04 - Apr','05 - May','06 - Jun',
  '07 - Jul','08 - Aug','09 - Sep','10 - Oct','11 - Nov','12 - Dec'
];
const emptyJob = {
  employer: '',
  title: '',
  city: '',
  state: '',
  startMonth: '01 - Jan',
  startYear: '',
  endMonth: '01 - Jan',
  endYear: '',
  current: false,
  bullets: ''
};

export default function ManualProfileModal({ onClose }) {
  const stage = useAppStore(s => s.stage);
  const existing = useAppStore(s => s.extractedProfile);

  const [step, setStep] = useState(0);
  const [form, setForm] = useState(() => {
    // If you opened from a previous saved profile, seed the form gracefully
    const seeded = existing ? {
      firstName: (existing.firstName ?? existing.name?.split(' ')?.[0]) || '',
      lastName:  (existing.lastName  ?? existing.name?.split(' ')?.slice(1).join(' ')) || '',
      address:   existing.address ?? '',
      city:      existing.city ?? existing.location?.split(',')?.[0] ?? '',
      country:   existing.country ?? existing.location?.split(',')?.[1]?.trim() ?? '',
      email:     existing.email ?? '',
      phone:     existing.phone ?? '',
      skills:    Array.isArray(existing.skills) ? existing.skills.join(', ') : (existing.skills || ''),
      jobs:      Array.isArray(existing.experience) && existing.experience.length
        ? existing.experience.map(j => ({
            employer: j.company || '',
            title: j.role || '',
            city: j.city || '',
            state: j.state || '',
            startMonth: (j.start?.split('-')?.[1] ? `${j.start.split('-')[1]} - ${MONTHS[+j.start.split('-')[1]-1].split(' - ')[1]}` : '01 - Jan'),
            startYear: j.start?.split('-')?.[0] || '',
            endMonth: (j.end && j.end !== 'Present' && j.end.includes('-'))
              ? `${j.end.split('-')[1]} - ${MONTHS[+j.end.split('-')[1]-1].split(' - ')[1]}`
              : '01 - Jan',
            endYear: (j.end && j.end !== 'Present' && j.end.includes('-')) ? j.end.split('-')[0] : '',
            current: j.end === 'Present',
            bullets: Array.isArray(j.bullets) ? j.bullets.join('\n') : (j.bullets || '')
          }))
        : [{ ...emptyJob }]
    } : null;

    return seeded || {
      firstName: '', lastName: '',
      address: '', city: '', country: '',
      email: '', phone: '',
      skills: '',
      jobs: [{ ...emptyJob }]
    };
  });

  const setField = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const setJob = (i, patch) =>
    setForm(p => ({ ...p, jobs: p.jobs.map((j, idx) => idx === i ? { ...j, ...patch } : j) }));
  const addJob = () => setForm(p => ({ ...p, jobs: [...p.jobs, { ...emptyJob }] }));
  const delJob = (i) => setForm(p => ({ ...p, jobs: p.jobs.filter((_, idx) => idx !== i) }));

const steps = useMemo(() => ([
  { key: 'profile', label: 'Profile', icon: LuUser },
  { key: 'contact', label: 'Contact', icon: LuMail },
  { key: 'experience', label: 'Experience', icon: LuBriefcase },
  { key: 'skills', label: 'Skills', icon: LuSparkles },
  { key: 'education', label: 'Education', icon: LuCalendar }
]), []);


  // Simple completion checks for the sidebar ticks
  const isStepDone = (i) => {
    if (i === 0) return !!(form.firstName && form.lastName && (form.address || form.city || form.country));
    if (i === 1) return !!(form.email && form.phone);
    if (i === 2) return form.jobs.some(j => j.employer && j.title);
    if (i === 3) return (form.skills || '').trim().length > 0;
    return false;
  };

  const goNext = () => setStep(s => Math.min(s + 1, steps.length - 1));
  const goPrev = () => setStep(s => Math.max(s - 1, 0));
  const goto = (i) => setStep(i);

  const saveProfile = (e) => {
    e?.preventDefault?.();

    const pad = (m) => m.split(' ')[0]; // "05 - May" -> "05"

    const normalized = {
      // keep detailed fields
      ...form,
      // fields your generator currently uses
      name: `${form.firstName || ''} ${form.lastName || ''}`.trim(),
      location: [form.city, form.country].filter(Boolean).join(', '),
      skills: String(form.skills).split(',').map(s => s.trim()).filter(Boolean),
      experience: form.jobs.map(j => ({
        role: j.title,
        company: j.employer,
        city: j.city,
        state: j.state,
        start: j.startYear ? `${j.startYear}-${pad(j.startMonth)}` : '',
        end: j.current ? 'Present' : (j.endYear ? `${j.endYear}-${pad(j.endMonth)}` : ''),
        bullets: String(j.bullets).split('\n').map(b => b.trim()).filter(Boolean),
      })),
      education: existing?.education || [], // keep if you had it
    };

    useAppStore.setState({
      extractedProfile: normalized,
      stage: Math.max(stage, 1),
    });

    onClose?.();
  };

  return createPortal(
    <div className="mpv2-overlay" role="dialog" aria-modal="true" aria-labelledby="mpv2-title">
      <div className="mpv2-modal">
        {/* Header */}
        <div className="mpv2-head">
          <h3 id="mpv2-title">Create your profile</h3>
          <button className="mpv2-iconbtn" onClick={onClose} aria-label="Close"><LuX /></button>
        </div>

        {/* Body */}
        <div className="mpv2-body">
          {/* Sidebar steps */}
          <aside className="mpv2-side">
            <ol className="mpv2-steps" role="list">
              {steps.map((s, i) => {
                const Icon = s.icon;
                const active = i === step;
                const done = isStepDone(i);
                return (
                  <li key={s.key}>
                    <button
                      type="button"
                      className={`mpv2-step ${active ? 'is-active' : ''} ${done ? 'is-done' : ''}`}
                      onClick={() => goto(i)}
                    >
                      <span className="mpv2-step__icon"><Icon /></span>
                      <span className="mpv2-step__label">{s.label}</span>
                      {done && <LiaCheckCircle  className="mpv2-step__check" />}
                    </button>
                  </li>
                );
              })}
            </ol>

            <div className="mpv2-progress">
              Step {step + 1} of {steps.length}
              <div className="mpv2-bar"><span style={{ width: `${((step)/(steps.length-1))*100}%` }} /></div>
            </div>
          </aside>

          {/* Main pane */}
          <section className="mpv2-main">
            {/* Step 1 — Personal */}
          {step === 0 && (
  <div className="card">
    <div className="card__title"><LuUser /> Profile details</div>
    <div className="grid two">
      <label>First name
        <input placeholder="e.g. John" value={form.firstName} onChange={e=>setField('firstName', e.target.value)} />
      </label>
      <label>Last name
        <input placeholder="e.g. Kamau" value={form.lastName} onChange={e=>setField('lastName', e.target.value)} />
      </label>
    </div>

    <label>Professional Title
      <input placeholder="e.g. Software Developer" value={form.title || ''} onChange={e=>setField('title', e.target.value)} />
      <span className="help">This is your career headline shown on top of your CV.</span>
    </label>

    <div className="grid two">
      <label>City / Town
        <input placeholder="e.g. Nairobi" value={form.city} onChange={e=>setField('city', e.target.value)} />
      </label>
      <label>Country
        <input placeholder="e.g. Kenya" value={form.country} onChange={e=>setField('country', e.target.value)} />
      </label>
    </div>
  </div>
)}

            {/* Step 2 — Contact */}
            {step === 1 && (
              <div className="card">
                <div className="card__title"><LuGlobe /> Contact</div>
                <div className="grid two">
                  <label>Email address
                    <div className="inp ico"><LuMail /><input type="email" placeholder="e.g. john_doe@example.com" value={form.email} onChange={e=>setField('email', e.target.value)} /></div>
                  </label>
                  <label>Phone
                    <div className="inp ico"><LuPhone /><input placeholder="+254 7xx xxx xxx" value={form.phone} onChange={e=>setField('phone', e.target.value)} /></div>
                  </label>
                </div>
              </div>
            )}

            {/* Step 3 — Experience */}
            {step === 2 && (
              <div className="card">
                <div className="card__title"><LuBriefcase /> Work experience</div>

                {form.jobs.map((j, i) => (
                  <div className="job" key={i}>
                    <div className="grid two">
                      <label>Employer
                        <div className="inp ico"><LuBuilding2 /><input placeholder="e.g. IBM" value={j.employer} onChange={e=>setJob(i, { employer: e.target.value })} /></div>
                      </label>
                      <label>Job title
                        <input placeholder="e.g. Engineer" value={j.title} onChange={e=>setJob(i, { title: e.target.value })} />
                      </label>
                    </div>

                    <div className="grid three">
                      <label>City/Town
                        <div className="inp ico"><LuMapPin /><input placeholder="e.g. Nairobi" value={j.city} onChange={e=>setJob(i, { city: e.target.value })} /></div>
                      </label>
                    
                      <label className="chk">
                        <input type="checkbox" checked={j.current} onChange={e=>setJob(i, { current: e.target.checked })} />
                        <span>Currently working here</span>
                      </label>
                    </div>

                    <div className="grid four">
                      <label>Start month
                        <select value={j.startMonth} onChange={e=>setJob(i, { startMonth: e.target.value })}>
                          {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                      </label>
                      <label>Start year
                        <input inputMode="numeric" placeholder="YYYY" value={j.startYear} onChange={e=>setJob(i, { startYear: e.target.value.replace(/\D/g,'').slice(0,4) })} />
                      </label>
                      <label>End month
                        <select disabled={j.current} value={j.endMonth} onChange={e=>setJob(i, { endMonth: e.target.value })}>
                          {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                      </label>
                      <label>End year
                        <input disabled={j.current} inputMode="numeric" placeholder="YYYY" value={j.endYear} onChange={e=>setJob(i, { endYear: e.target.value.replace(/\D/g,'').slice(0,4) })} />
                      </label>
                    </div>

                    <label>Key achievements (one per line)
                      <textarea rows={4} placeholder={"Increased sales by 22%\nLaunched X feature…"} value={j.bullets} onChange={e=>setJob(i, { bullets: e.target.value })} />
                    </label>

                    {form.jobs.length > 1 && (
                      <button type="button" className="mini danger" onClick={() => delJob(i)}>
                        <LuTrash2 /> Remove this job
                      </button>
                    )}
                    <hr className="sep" />
                  </div>
                ))}

                <button type="button" className="mini" onClick={addJob}><LuPlus /> Add another job</button>
              </div>
            )}

            {/* Step 4 — Skills */}
            {step === 3 && (
              <div className="card">
                <div className="card__title"><LuSparkles /> Skills</div>
                <label>Skills (comma separated)
                  <input placeholder="React, Node, SQL, Communication" value={form.skills} onChange={e=>setField('skills', e.target.value)} />
                </label>
              </div>
            )}


            {step === 4 && (
  <div className="card">
    <div className="card__title"><LuCalendar /> Education</div>

    {(form.education || []).map((ed, i) => (
      <div className="job" key={i}>
        <label>Institution
          <input placeholder="e.g. University of Nairobi" value={ed.school} onChange={e=>setForm(p => {
            const edu = [...(p.education || [])];
            edu[i] = { ...edu[i], school: e.target.value };
            return { ...p, education: edu };
          })} />
        </label>
        <label>Degree / Certificate
          <input placeholder="e.g. BSc Computer Science" value={ed.degree} onChange={e=>setForm(p => {
            const edu = [...(p.education || [])];
            edu[i] = { ...edu[i], degree: e.target.value };
            return { ...p, education: edu };
          })} />
        </label>
        <label>Field of Study
          <input placeholder="e.g. Computer Science" value={ed.field || ''} onChange={e=>setForm(p => {
            const edu = [...(p.education || [])];
            edu[i] = { ...edu[i], field: e.target.value };
            return { ...p, education: edu };
          })} />
        </label>
        <div className="grid two">
          <label>Start Year
            <input inputMode="numeric" placeholder="YYYY" value={ed.startYear || ''} onChange={e=>setForm(p => {
              const edu = [...(p.education || [])];
              edu[i] = { ...edu[i], startYear: e.target.value.replace(/\D/g,'').slice(0,4) };
              return { ...p, education: edu };
            })} />
          </label>
          <label>End Year
            <input inputMode="numeric" placeholder="YYYY" value={ed.endYear || ''} onChange={e=>setForm(p => {
              const edu = [...(p.education || [])];
              edu[i] = { ...edu[i], endYear: e.target.value.replace(/\D/g,'').slice(0,4) };
              return { ...p, education: edu };
            })} />
          </label>
        </div>
        {form.education.length > 1 && (
          <button type="button" className="mini danger" onClick={() => setForm(p => ({
            ...p,
            education: p.education.filter((_, idx) => idx !== i)
          }))}>
            <LuTrash2 /> Remove this education
          </button>
        )}
        <hr className="sep" />
      </div>
    ))}
    <button type="button" className="mini" onClick={() => setForm(p => ({
      ...p,
      education: [...(p.education || []), { school: '', degree: '', field: '', startYear: '', endYear: '' }]
    }))}><LuPlus /> Add another</button>
  </div>
)}


            {/* Actions */}
            <div className="actions">
              <button type="button" className="btn" onClick={goPrev} disabled={step === 0}><LuChevronLeft /> Back</button>
              {step < steps.length - 1 ? (
                <button type="button" className="btn btn-primary" onClick={goNext}>
                  Next <LuChevronRight />
                </button>
              ) : (
                <button type="button" className="btn btn-primary" onClick={saveProfile}>
                  <LuSave /> Save profile
                </button>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>,
    document.body
  );
}
