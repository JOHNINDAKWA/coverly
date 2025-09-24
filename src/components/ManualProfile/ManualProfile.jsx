// src/components/ManualProfile/ManualProfile.jsx
import React, { useMemo, useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useAppStore } from "../../state/useAppStore";
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
} from "react-icons/lu";
import { LiaCheckCircle } from "react-icons/lia";
import "./ManualProfile.css";

const MONTHS = [
  "01 - Jan",
  "02 - Feb",
  "03 - Mar",
  "04 - Apr",
  "05 - May",
  "06 - Jun",
  "07 - Jul",
  "08 - Aug",
  "09 - Sep",
  "10 - Oct",
  "11 - Nov",
  "12 - Dec",
];

const emptyJob = {
  employer: "",
  title: "",
  city: "",
  state: "",
  startMonth: "01 - Jan",
  startYear: "",
  endMonth: "01 - Jan",
  endYear: "",
  current: false,
  bullets: "",
};

const emptyCert = { name: "", issuer: "", year: "" };
const emptyRef = { name: "", title: "", company: "", email: "", phone: "" };
const emptyEdu = {
  school: "",
  degree: "",
  field: "",
  startYear: "",
  endYear: "",
}; // ✅ NEW

// ---- Sorting helpers for jobs (most recent first) ----
const monthToNum = (label) => {
  const m = parseInt(String(label || "01 - Jan").split(" ")[0], 10);
  return Number.isFinite(m) && m >= 1 && m <= 12 ? m : 1;
};
const parseYear4 = (y) => {
  const s = String(y || "").trim();
  return /^\d{4}$/.test(s) ? parseInt(s, 10) : null; // only sort when year is complete
};
const jobSortKey = (j) => {
  // Current role floats to top
  if (j.current) return 999912;

  const eY = parseYear4(j.endYear);
  const eM = monthToNum(j.endMonth);
  if (eY) return eY * 100 + eM;

  const sY = parseYear4(j.startYear);
  const sM = monthToNum(j.startMonth);
  if (sY) return sY * 100 + sM;

  return -1; // incomplete dates sink to bottom
};
const sortJobsDesc = (jobs = []) =>
  [...jobs].sort((a, b) => jobSortKey(b) - jobSortKey(a));

export default function ManualProfileModal({ onClose }) {
  const stage = useAppStore((s) => s.stage);
  const existing = useAppStore((s) => s.extractedProfile);

  const [step, setStep] = useState(0);
  const dialogRef = useRef(null);
  const openerRef = useRef(null);

  useEffect(() => {
    openerRef.current = document.activeElement;
    dialogRef.current?.focus();
    return () => openerRef.current && openerRef.current.focus?.();
  }, []);

  // Ensure any seeded jobs start in correct order
  useEffect(() => {
    setForm((p) => ({ ...p, jobs: sortJobsDesc(p.jobs) }));
  }, []);

  const [form, setForm] = useState(() => {
    // Seed from existing profile if present
    const seeded = existing
      ? {
          firstName:
            (existing.firstName ?? existing.name?.split(" ")?.[0]) || "",
          lastName:
            (existing.lastName ??
              existing.name?.split(" ")?.slice(1).join(" ")) ||
            "",
          address: existing.address ?? "",
          city: existing.city ?? existing.location?.split(",")?.[0] ?? "",
          country:
            existing.country ??
            existing.location?.split(",")?.[1]?.trim() ??
            "",
          email: existing.email ?? "",
          phone: existing.phone ?? "",
          skills: Array.isArray(existing.skills)
            ? existing.skills.join(", ")
            : existing.skills || "",
          jobs:
            Array.isArray(existing.experience) && existing.experience.length
              ? existing.experience.map((j) => ({
                  employer: j.company || "",
                  title: j.role || "",
                  city: j.city || "",
                  state: j.state || "",
                  startMonth: j.start?.split("-")?.[1]
                    ? `${j.start.split("-")[1]} - ${
                        MONTHS[+j.start.split("-")[1] - 1].split(" - ")[1]
                      }`
                    : "01 - Jan",
                  startYear: j.start?.split("-")?.[0] || "",
                  endMonth:
                    j.end &&
                    String(j.end).toLowerCase() !== "present" &&
                    String(j.end).includes("-")
                      ? `${j.end.split("-")[1]} - ${
                          MONTHS[+j.end.split("-")[1] - 1].split(" - ")[1]
                        }`
                      : "01 - Jan",
                  endYear:
                    j.end &&
                    String(j.end).toLowerCase() !== "present" &&
                    String(j.end).includes("-")
                      ? j.end.split("-")[0]
                      : "",
                  current: String(j.end).toLowerCase() === "present",
                  bullets: Array.isArray(j.bullets)
                    ? j.bullets.join("\n")
                    : j.bullets || "",
                }))
              : [{ ...emptyJob }],

          // ✅ Ensure at least one education row is visible
          education:
            Array.isArray(existing.education) && existing.education.length
              ? existing.education.map((ed) => ({
                  school: ed.school || "",
                  degree: ed.degree || "",
                  field: ed.field || "",
                  startYear: ed.startYear || "",
                  endYear: ed.endYear || "",
                }))
              : [{ ...emptyEdu }],

          // Optional sections
          achievementsText: Array.isArray(existing.achievements)
            ? existing.achievements.join("\n")
            : "",
          certifications:
            Array.isArray(existing.certifications) &&
            existing.certifications.length
              ? existing.certifications.map((c) => ({
                  name: c.name || "",
                  issuer: c.issuer || "",
                  year: c.year || "",
                }))
              : [{ ...emptyCert }],
          references:
            Array.isArray(existing.references) && existing.references.length
              ? existing.references.map((r) => ({
                  name: r.name || "",
                  title: r.title || "",
                  company: r.company || "",
                  email: r.email || "",
                  phone: r.phone || "",
                }))
              : [{ ...emptyRef }],
        }
      : null;

    // Defaults when no existing profile
    return (
      seeded || {
        firstName: "",
        lastName: "",
        address: "",
        city: "",
        country: "",
        email: "",
        phone: "",
        skills: "",
        jobs: [{ ...emptyJob }],
        education: [{ ...emptyEdu }], // ✅ start with one blank education row
        achievementsText: "",
        certifications: [{ ...emptyCert }],
        references: [{ ...emptyRef }],
      }
    );
  });

  const setField = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const setJob = (i, patch) =>
    setForm((p) => {
      const jobs = p.jobs.map((j, idx) => (idx === i ? { ...j, ...patch } : j));
      // Only re-order when fields that affect chronology change
      const affectsOrder = [
        "current",
        "endYear",
        "endMonth",
        "startYear",
        "startMonth",
      ].some((k) => Object.prototype.hasOwnProperty.call(patch, k));
      return { ...p, jobs: affectsOrder ? sortJobsDesc(jobs) : jobs };
    });

const addJob = () =>
  setForm((p) => ({ ...p, jobs: sortJobsDesc([...p.jobs, { ...emptyJob }]) }));

const delJob = (i) =>
  setForm((p) => ({ ...p, jobs: sortJobsDesc(p.jobs.filter((_, idx) => idx !== i)) }));


  const addCert = () =>
    setForm((p) => ({
      ...p,
      certifications: [...(p.certifications || []), { ...emptyCert }],
    }));
  const delCert = (i) =>
    setForm((p) => ({
      ...p,
      certifications: (p.certifications || []).filter((_, idx) => idx !== i),
    }));

  const addRef = () =>
    setForm((p) => ({
      ...p,
      references: [...(p.references || []), { ...emptyRef }],
    }));
  const delRef = (i) =>
    setForm((p) => ({
      ...p,
      references: (p.references || []).filter((_, idx) => idx !== i),
    }));

  const addEdu = () =>
    setForm((p) => ({
      ...p,
      education: [...(p.education || []), { ...emptyEdu }],
    })); // ✅ use emptyEdu
  const delEdu = (i) =>
    setForm((p) => ({
      ...p,
      education: (p.education || []).filter((_, idx) => idx !== i),
    }));

  const steps = useMemo(
    () => [
      { key: "profile", label: "Profile", icon: LuUser },
      { key: "contact", label: "Contact", icon: LuMail },
      { key: "experience", label: "Experience", icon: LuBriefcase },
      { key: "skills", label: "Skills", icon: LuSparkles },
      { key: "achievements", label: "Achievements", icon: LuSparkles },
      { key: "references", label: "References", icon: LuUser },
      { key: "education", label: "Education", icon: LuCalendar },
    ],
    []
  );

  const isStepDone = (i) => {
    const key = steps[i]?.key;
    if (key === "profile")
      return !!(
        form.firstName &&
        form.lastName &&
        (form.address || form.city || form.country)
      );
    if (key === "contact") return !!(form.email && form.phone);
    if (key === "experience")
      return (form.jobs || []).some((j) => j.employer && j.title);
    if (key === "skills") return (form.skills || "").trim().length > 0;
    if (key === "achievements")
      return (
        (form.achievementsText || "").trim().length > 0 ||
        (form.certifications || []).some((c) => c.name || c.issuer || c.year)
      );
    if (key === "references")
      return (form.references || []).some(
        (r) => r.name || r.email || r.phone || r.title || r.company
      );
    if (key === "education")
      return (form.education || []).some(
        (ed) => ed.school || ed.degree || ed.field
      );
    return false;
  };

  const goNext = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const goPrev = () => setStep((s) => Math.max(s - 1, 0));
  const goto = (i) => setStep(i);

  const saveProfile = (e) => {
    e?.preventDefault?.();
    // const pad = (m) => (m ? m.split(" ")[0] : "");

    const sortedJobsForSave = sortJobsDesc(form.jobs || []);
    const normalized = {
      ...form,
      name: `${form.firstName || ""} ${form.lastName || ""}`.trim(),
      location: [form.city, form.country].filter(Boolean).join(", "),
      skills: String(form.skills)
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
experience: sortedJobsForSave.map((j) => ({
    role: j.title,
    company: j.employer,
    city: j.city,
    state: j.state,
    start: j.startYear ? `${j.startYear}-${String(j.startMonth || "").split(" ")[0]}` : "",
    end: j.current
      ? "Present"
      : j.endYear
      ? `${j.endYear}-${String(j.endMonth || "").split(" ")[0]}`
      : "",
    bullets: String(j.bullets)
      .split("\n")
      .map((b) => b.trim())
      .filter(Boolean),
  })),
      education: form.education || [],
      achievements: String(form.achievementsText || "")
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      certifications: (form.certifications || [])
        .map((c) => ({
          name: c.name || "",
          issuer: c.issuer || "",
          year: c.year || "",
        }))
        .filter((c) => c.name || c.issuer || c.year),
      references: (form.references || [])
        .map((r) => ({
          name: r.name || "",
          title: r.title || "",
          company: r.company || "",
          email: r.email || "",
          phone: r.phone || "",
        }))
        .filter((r) => r.name || r.email || r.phone || r.title || r.company),
    };

    useAppStore.setState({
      extractedProfile: normalized,
      stage: Math.max(stage, 1),
    });
    onClose?.();
  };

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return createPortal(
    <div
      className="mpv2-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="mpv2-title"
      ref={dialogRef}
      tabIndex={-1}
    >
      <div className="mpv2-modal">
        {/* Header */}
        <div className="mpv2-head">
          <h3 id="mpv2-title">Create your profile</h3>
          <button className="mpv2-iconbtn" onClick={onClose} aria-label="Close">
            <LuX />
          </button>
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
                      className={`mpv2-step ${active ? "is-active" : ""} ${
                        done ? "is-done" : ""
                      }`}
                      aria-current={active ? "step" : undefined}
                      onClick={() => goto(i)}
                    >
                      <span className="mpv2-step__icon">
                        <Icon aria-hidden />
                      </span>
                      <span className="mpv2-step__label">{s.label}</span>
                      {done && (
                        <LiaCheckCircle
                          className="mpv2-step__check"
                          aria-hidden
                        />
                      )}
                    </button>
                  </li>
                );
              })}
            </ol>

            <div
              className="mpv2-progress"
              role="progressbar"
              aria-valuemin={1}
              aria-valuemax={steps.length}
              aria-valuenow={step + 1}
            >
              Step {step + 1} of {steps.length}
              <div className="mpv2-bar">
                <span
                  style={{ width: `${(step / (steps.length - 1)) * 100}%` }}
                />
              </div>
            </div>
          </aside>

          {/* Main pane */}
          <section className="mpv2-main">
            {/* Step 1 — Personal */}
            {steps[step]?.key === "profile" && (
              <div className="card">
                <div className="card__title">
                  <LuUser /> Profile details
                </div>
                <div className="grid two">
                  <label>
                    First name
                    <input
                      placeholder="e.g. John"
                      value={form.firstName}
                      onChange={(e) => setField("firstName", e.target.value)}
                    />
                  </label>
                  <label>
                    Last name
                    <input
                      placeholder="e.g. Kamau"
                      value={form.lastName}
                      onChange={(e) => setField("lastName", e.target.value)}
                    />
                  </label>
                </div>
                <label>
                  Professional Title
                  <input
                    placeholder="e.g. Software Developer"
                    value={form.title || ""}
                    onChange={(e) => setField("title", e.target.value)}
                  />
                  <span className="help">
                    This is your career headline shown on top of your CV.
                  </span>
                </label>
                <div className="grid two">
                  <label>
                    City / Town
                    <input
                      placeholder="e.g. Nairobi"
                      value={form.city}
                      onChange={(e) => setField("city", e.target.value)}
                    />
                  </label>
                  <label>
                    Country
                    <input
                      placeholder="e.g. Kenya"
                      value={form.country}
                      onChange={(e) => setField("country", e.target.value)}
                    />
                  </label>
                </div>
              </div>
            )}

            {/* Step 2 — Contact */}
            {steps[step]?.key === "contact" && (
              <div className="card">
                <div className="card__title">
                  <LuGlobe /> Contact
                </div>
                <div className="grid two">
                  <label>
                    Email address
                    <div className="inp ico">
                      <LuMail />
                      <input
                        type="email"
                        placeholder="e.g. john_doe@example.com"
                        value={form.email}
                        onChange={(e) =>
                          setField("email", e.target.value.trim())
                        }
                      />
                    </div>
                  </label>
                  <label>
                    Phone
                    <div className="inp ico">
                      <LuPhone />
                      <input
                        placeholder="+254 7xx xxx xxx"
                        value={form.phone}
                        onChange={(e) => setField("phone", e.target.value)}
                      />
                    </div>
                  </label>
                </div>
              </div>
            )}

            {/* Step 3 — Experience */}
            {steps[step]?.key === "experience" && (
              <div className="card">
                <div className="card__title">
                  <LuBriefcase /> Work experience
                </div>
                {form.jobs.map((j, i) => (
                  <div className="job" key={i}>
                    <div className="grid two">
                      <label>
                        Employer
                        <div className="inp ico">
                          <LuBuilding2 />
                          <input
                            placeholder="e.g. IBM"
                            value={j.employer}
                            onChange={(e) =>
                              setJob(i, { employer: e.target.value })
                            }
                          />
                        </div>
                      </label>
                      <label>
                        Job title
                        <input
                          placeholder="e.g. Engineer"
                          value={j.title}
                          onChange={(e) => setJob(i, { title: e.target.value })}
                        />
                      </label>
                    </div>
                    <div className="grid three">
                      <label>
                        City/Town
                        <div className="inp ico">
                          <LuMapPin />
                          <input
                            placeholder="e.g. Nairobi"
                            value={j.city}
                            onChange={(e) =>
                              setJob(i, { city: e.target.value })
                            }
                          />
                        </div>
                      </label>
                      <label className="chk">
                        <input
                          type="checkbox"
                          checked={j.current}
                          onChange={(e) =>
                            setJob(i, { current: e.target.checked })
                          }
                        />
                        <span>Currently working here</span>
                      </label>
                    </div>
                    <div className="grid four">
                      <label>
                        Start month
                        <select
                          value={j.startMonth}
                          onChange={(e) =>
                            setJob(i, { startMonth: e.target.value })
                          }
                        >
                          {MONTHS.map((m) => (
                            <option key={m} value={m}>
                              {m}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label>
                        Start year
                        <input
                          inputMode="numeric"
                          placeholder="YYYY"
                          value={j.startYear}
                          onChange={(e) =>
                            setJob(i, {
                              startYear: e.target.value
                                .replace(/\D/g, "")
                                .slice(0, 4),
                            })
                          }
                        />
                      </label>
                      <label>
                        End month
                        <select
                          disabled={j.current}
                          value={j.endMonth}
                          onChange={(e) =>
                            setJob(i, { endMonth: e.target.value })
                          }
                        >
                          {MONTHS.map((m) => (
                            <option key={m} value={m}>
                              {m}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label>
                        End year
                        <input
                          disabled={j.current}
                          inputMode="numeric"
                          placeholder="YYYY"
                          value={j.endYear}
                          onChange={(e) =>
                            setJob(i, {
                              endYear: e.target.value
                                .replace(/\D/g, "")
                                .slice(0, 4),
                            })
                          }
                        />
                      </label>
                    </div>
                    <label>
                      Key achievements (one per line)
                      <textarea
                        rows={4}
                        placeholder={
                          "Increased sales by 22%\nLaunched X feature…"
                        }
                        value={j.bullets}
                        onChange={(e) => setJob(i, { bullets: e.target.value })}
                      />
                    </label>
                    {form.jobs.length > 1 && (
                      <button
                        type="button"
                        className="mini danger"
                        onClick={() => delJob(i)}
                      >
                        <LuTrash2 /> Remove this job
                      </button>
                    )}
                    <hr className="sep" />
                  </div>
                ))}
                <button type="button" className="mini" onClick={addJob}>
                  <LuPlus /> Add another job
                </button>
              </div>
            )}

            {/* Step 4 — Skills */}
            {steps[step]?.key === "skills" && (
              <div className="card">
                <div className="card__title">
                  <LuSparkles /> Skills
                </div>
                <label>
                  Skills (comma separated)
                  <input
                    placeholder="React, Node, SQL, Communication"
                    value={form.skills}
                    onChange={(e) => setField("skills", e.target.value)}
                  />
                </label>
              </div>
            )}

            {/* Step 5 — Achievements & Certifications (optional) */}
            {steps[step]?.key === "achievements" && (
              <div className="card">
                <div className="card__title">
                  <LuSparkles /> Achievements & Certifications (optional)
                </div>
                <label>
                  Achievements (one per line)
                  <textarea
                    rows={4}
                    placeholder={
                      "Won XYZ Award 2023\nTop performer Q1 2024\nSpeaker at DevConf 2025"
                    }
                    value={form.achievementsText}
                    onChange={(e) =>
                      setField("achievementsText", e.target.value)
                    }
                  />
                </label>
                <div className="subhead">Certifications</div>
                {(form.certifications || []).map((c, i) => (
                  <div className="job" key={i}>
                    <div className="grid three">
                      <label>
                        Certification
                        <input
                          placeholder="e.g. AWS Solutions Architect"
                          value={c.name}
                          onChange={(e) =>
                            setForm((p) => {
                              const arr = [...(p.certifications || [])];
                              arr[i] = { ...arr[i], name: e.target.value };
                              return { ...p, certifications: arr };
                            })
                          }
                        />
                      </label>
                      <label>
                        Issuer
                        <input
                          placeholder="e.g. Amazon"
                          value={c.issuer}
                          onChange={(e) =>
                            setForm((p) => {
                              const arr = [...(p.certifications || [])];
                              arr[i] = { ...arr[i], issuer: e.target.value };
                              return { ...p, certifications: arr };
                            })
                          }
                        />
                      </label>
                      <label>
                        Year
                        <input
                          inputMode="numeric"
                          placeholder="YYYY"
                          value={c.year || ""}
                          onChange={(e) =>
                            setForm((p) => {
                              const arr = [...(p.certifications || [])];
                              arr[i] = {
                                ...arr[i],
                                year: e.target.value
                                  .replace(/\D/g, "")
                                  .slice(0, 4),
                              };
                              return { ...p, certifications: arr };
                            })
                          }
                        />
                      </label>
                    </div>
                    {(form.certifications || []).length > 1 && (
                      <button
                        type="button"
                        className="mini danger"
                        onClick={() => delCert(i)}
                      >
                        <LuTrash2 /> Remove
                      </button>
                    )}
                    <hr className="sep" />
                  </div>
                ))}
                <button type="button" className="mini" onClick={addCert}>
                  <LuPlus /> Add certification
                </button>
              </div>
            )}

            {/* Step 6 — References (optional) */}
            {steps[step]?.key === "references" && (
              <div className="card">
                <div className="card__title">
                  <LuUser /> References (optional)
                </div>
                {(form.references || []).map((r, i) => (
                  <div className="job" key={i}>
                    <div className="grid two">
                      <label>
                        Name
                        <input
                          placeholder="e.g. Jane Doe"
                          value={r.name}
                          onChange={(e) =>
                            setForm((p) => {
                              const arr = [...(p.references || [])];
                              arr[i] = { ...arr[i], name: e.target.value };
                              return { ...p, references: arr };
                            })
                          }
                        />
                      </label>
                      <label>
                        Title
                        <input
                          placeholder="e.g. Engineering Manager"
                          value={r.title || ""}
                          onChange={(e) =>
                            setForm((p) => {
                              const arr = [...(p.references || [])];
                              arr[i] = { ...arr[i], title: e.target.value };
                              return { ...p, references: arr };
                            })
                          }
                        />
                      </label>
                    </div>
                    <div className="grid two">
                      <label>
                        Company
                        <input
                          placeholder="e.g. Acme Corp"
                          value={r.company || ""}
                          onChange={(e) =>
                            setForm((p) => {
                              const arr = [...(p.references || [])];
                              arr[i] = { ...arr[i], company: e.target.value };
                              return { ...p, references: arr };
                            })
                          }
                        />
                      </label>
                      <label>
                        Email
                        <input
                          type="email"
                          placeholder="jane@example.com"
                          value={r.email || ""}
                          onChange={(e) =>
                            setForm((p) => {
                              const arr = [...(p.references || [])];
                              arr[i] = {
                                ...arr[i],
                                email: e.target.value.trim(),
                              };
                              return { ...p, references: arr };
                            })
                          }
                        />
                      </label>
                    </div>
                    <label>
                      Phone
                      <input
                        placeholder="+254 7xx xxx xxx"
                        value={r.phone || ""}
                        onChange={(e) =>
                          setForm((p) => {
                            const arr = [...(p.references || [])];
                            arr[i] = { ...arr[i], phone: e.target.value };
                            return { ...p, references: arr };
                          })
                        }
                      />
                    </label>
                    {(form.references || []).length > 1 && (
                      <button
                        type="button"
                        className="mini danger"
                        onClick={() => delRef(i)}
                      >
                        <LuTrash2 /> Remove reference
                      </button>
                    )}
                    <hr className="sep" />
                  </div>
                ))}
                <button type="button" className="mini" onClick={addRef}>
                  <LuPlus /> Add reference
                </button>
              </div>
            )}

            {/* Step 7 — Education */}
            {steps[step]?.key === "education" && (
              <div className="card">
                <div className="card__title">
                  <LuCalendar /> Education
                </div>
                {(form.education || []).map((ed, i) => (
                  <div className="job" key={i}>
                    <label>
                      Institution
                      <input
                        placeholder="e.g. University of Nairobi"
                        value={ed.school || ""}
                        onChange={(e) =>
                          setForm((p) => {
                            const edu = [...(p.education || [])];
                            edu[i] = { ...edu[i], school: e.target.value };
                            return { ...p, education: edu };
                          })
                        }
                      />
                    </label>
                    <label>
                      Degree / Certificate
                      <input
                        placeholder="e.g. BSc Computer Science"
                        value={ed.degree || ""}
                        onChange={(e) =>
                          setForm((p) => {
                            const edu = [...(p.education || [])];
                            edu[i] = { ...edu[i], degree: e.target.value };
                            return { ...p, education: edu };
                          })
                        }
                      />
                    </label>
                    <label>
                      Field of Study
                      <input
                        placeholder="e.g. Computer Science"
                        value={ed.field || ""}
                        onChange={(e) =>
                          setForm((p) => {
                            const edu = [...(p.education || [])];
                            edu[i] = { ...edu[i], field: e.target.value };
                            return { ...p, education: edu };
                          })
                        }
                      />
                    </label>
                    <div className="grid two">
                      <label>
                        Start Year
                        <input
                          inputMode="numeric"
                          placeholder="YYYY"
                          value={ed.startYear || ""}
                          onChange={(e) =>
                            setForm((p) => {
                              const edu = [...(p.education || [])];
                              edu[i] = {
                                ...edu[i],
                                startYear: e.target.value
                                  .replace(/\D/g, "")
                                  .slice(0, 4),
                              };
                              return { ...p, education: edu };
                            })
                          }
                        />
                      </label>
                      <label>
                        End Year
                        <input
                          inputMode="numeric"
                          placeholder="YYYY"
                          value={ed.endYear || ""}
                          onChange={(e) =>
                            setForm((p) => {
                              const edu = [...(p.education || [])];
                              edu[i] = {
                                ...edu[i],
                                endYear: e.target.value
                                  .replace(/\D/g, "")
                                  .slice(0, 4),
                              };
                              return { ...p, education: edu };
                            })
                          }
                        />
                      </label>
                    </div>
                    {(form.education || []).length > 1 && (
                      <button
                        type="button"
                        className="mini danger"
                        onClick={() => delEdu(i)}
                      >
                        <LuTrash2 /> Remove this education
                      </button>
                    )}
                    <hr className="sep" />
                  </div>
                ))}
                <button type="button" className="mini" onClick={addEdu}>
                  <LuPlus /> Add another
                </button>
              </div>
            )}

            {/* Actions */}
            <div className="actions">
              <button
                type="button"
                className="btn"
                onClick={goPrev}
                disabled={step === 0}
              >
                <LuChevronLeft /> Back
              </button>
              {step < steps.length - 1 ? (
                <button
                  type="button"
                  className="btn btn-primary btn-fixed"
                  onClick={goNext}
                >
                  Next <LuChevronRight />
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-primary btn-fixed"
                  onClick={saveProfile}
                >
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
