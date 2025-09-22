import React, { useMemo } from "react";
import { useAppStore } from "../../state/useAppStore";
import {
  LuExternalLink,
  LuMail,
  LuPhone,
  LuMapPin,
  LuSparkles,
  LuBriefcase,
  LuGraduationCap,
  LuAward,
} from "react-icons/lu";
import "./Portfolio.css";

export default function Portfolio() {
  const profile = useAppStore((s) => s.extractedProfile) || {};

  const initials = useMemo(() => {
    const parts = String(profile.name || "").trim().split(/\s+/);
    return (parts[0]?.[0] || "U").toUpperCase() + (parts[1]?.[0] || "").toUpperCase();
  }, [profile.name]);

  // compact social: only platform name + icon (link opens in new tab)
  const social = profile.social || {};
  const socialEntries = [
    ["website", "Website", social.website],
    ["linkedin", "LinkedIn", social.linkedin],
    ["github", "GitHub", social.github],
    ["twitter", "Twitter / X", social.twitter],
    ["dribbble", "Dribbble", social.dribbble],
    ["behance", "Behance", social.behance],
  ].filter(([, , url]) => !!url);

  return (
    <section className="pf-wrap">
      {/* Cover */}
      <div className="pf-cover">
        <div className="pf-cover__overlay" />
        <header className="pf-head">
          <div className="pf-avatar">{initials}</div>
          <div className="pf-head__info">
            <h1 className="pf-name">{profile.name || "Your Name"}</h1>
            <p className="pf-title">{profile.title || "Professional Title"}</p>
            <div className="pf-cta-row">
              <a
                className="pf-btn pf-btn--primary"
                href={`mailto:${encodeURIComponent(profile.email || "")}?subject=${encodeURIComponent(
                  `Opportunity for ${profile.name || "you"}`
                )}`}
              >
                Hire Me
              </a>
            </div>
          </div>
        </header>
      </div>

      {/* Two-column content */}
      <div className="pf-grid">
        {/* Left column */}
        <aside className="pf-col pf-col--left">
          <div className="pf-card">
            <div className="pf-sec-title">
              <LuSparkles /> Summary
            </div>
            <p className="pf-muted">
              {profile.summary ||
                "Write a short professional summary that highlights your strengths, domain, and what you’re looking for."}
            </p>
          </div>

          <div className="pf-card">
            <div className="pf-sec-title">
              <LuMail /> Contact
            </div>
            <ul className="pf-list pf-list--contact">
              <li>
                <LuMail />
                <a href={`mailto:${profile.email || ""}`}>{profile.email || "—"}</a>
              </li>
              <li>
                <LuPhone />
                <span>{profile.phone || "—"}</span>
              </li>
              <li>
                <LuMapPin />
                <span>{profile.location || "—"}</span>
              </li>
            </ul>
          </div>

          {/* Compact Social (name + icon only) */}
          {socialEntries.length > 0 && (
            <div className="pf-card">
              <div className="pf-sec-title">
                <LuExternalLink /> Social
              </div>
              <ul className="pf-list pf-list--links pf-list--compact">
                {socialEntries.map(([key, label, url]) => (
                  <li key={key}>
                    <button
                      type="button"
                      className="pf-link-chip"
                      onClick={() => window.open(url, "_blank", "noopener,noreferrer")}
                      title={label}
                    >
                      <span className="pf-link-chip__label">{label}</span>
                      <LuExternalLink className="pf-link-chip__icon" aria-hidden="true" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="pf-card">
            <div className="pf-sec-title">
              <LuSparkles /> Skills
            </div>
            <div className="pf-tags">
              {(profile.skills || []).length ? (
                profile.skills.map((s, i) => (
                  <span key={i} className="pf-tag">
                    {s}
                  </span>
                ))
              ) : (
                <span className="pf-muted">No skills added yet.</span>
              )}
            </div>
          </div>

          {Array.isArray(profile.achievements) && profile.achievements.length > 0 && (
            <div className="pf-card">
              <div className="pf-sec-title">
                <LuAward /> Achievements / Certifications
              </div>
              <ul className="pf-list">
                {profile.achievements.map((a, i) => (
                  <li key={i}>{typeof a === "string" ? a : a?.title || "Achievement"}</li>
                ))}
              </ul>
            </div>
          )}
        </aside>

        {/* Right column */}
        <div className="pf-col pf-col--right">
          <div className="pf-card">
            <div className="pf-sec-title">
              <LuBriefcase /> Experience
            </div>

            {Array.isArray(profile.experience) && profile.experience.length ? (
              <div className="pf-timeline">
                {profile.experience.map((job, i) => (
                  <article className="pf-tl-item" key={i}>
                    <div className="pf-tl-dot" />
                    <div className="pf-tl-body">
                      <h3 className="pf-job">
                        {job.role || "Job Title"}
                        <span className="pf-job__dates">
                          {[job.start, job.end || "Present"].filter(Boolean).join(" – ")}
                        </span>
                      </h3>
                      <div className="pf-dim">
                        {[job.company, job.city].filter(Boolean).join(" • ")}
                      </div>
                      {Array.isArray(job.bullets) && job.bullets.length > 0 && (
                        <ul className="pf-bullets">
                          {job.bullets.map((b, idx) => (
                            <li key={idx}>{b}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <p className="pf-muted">No experience added yet.</p>
            )}
          </div>

          <div className="pf-card">
            <div className="pf-sec-title">
              <LuGraduationCap /> Education
            </div>
            {Array.isArray(profile.education) && profile.education.length ? (
              <div className="pf-edu">
                {profile.education.map((ed, i) => (
                  <div className="pf-edu-item" key={i}>
                    <h4>{ed.degree || "Degree / Certificate"}</h4>
                    <div className="pf-dim">
                      {[ed.school, ed.field].filter(Boolean).join(" • ")}
                    </div>
                    <div className="pf-muted">
                      {[ed.startYear, ed.endYear].filter(Boolean).join(" – ")}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="pf-muted">No education added yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* Full-width Featured Projects (bottom) */}
      {Array.isArray(profile.projects) && profile.projects.length > 0 && (
        <div className="pf-wide">
          <div className="pf-card pf-card--wide">
            <div className="pf-sec-title">
              <LuExternalLink /> Featured Projects
            </div>
            <div className="pf-projects pf-projects--wide">
              {profile.projects.map((p, i) => (
                <a
                  key={i}
                  className="pf-project"
                  href={p.url || "#"}
                  target="_blank"
                  rel="noreferrer"
                >
                  {p.image ? (
                    <div className="pf-project__img">
                      <img src={p.image} alt={p.name || "Project"} />
                    </div>
                  ) : (
                    <div className="pf-project__img pf-project__img--ph" />
                  )}
                  <div className="pf-project__body">
                    <div className="pf-project__top">
                      <h4>{p.name || "Project"}</h4>
                      {p.url && <LuExternalLink />}
                    </div>
                    {p.description && <p className="pf-muted">{p.description}</p>}
                    {Array.isArray(p.tags) && p.tags.length > 0 && (
                      <div className="pf-tags">
                        {p.tags.map((t, k) => (
                          <span className="pf-tag" key={k}>
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
