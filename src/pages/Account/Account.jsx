import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppStore } from "../../state/useAppStore";
import { renderTemplate } from "../../assets/templates";
import html2pdf from "html2pdf.js";

import {
  LuSave,
  LuUser,
  LuMail,
  LuPhone,
  LuMapPin,
  LuSparkles,
  LuBriefcase,
  LuGraduationCap,
  LuAward,
  LuCopy,
  LuExternalLink,
  LuImagePlus,
  LuLink2,
  LuX,
  LuPlus,
  LuMoveUp,
  LuMoveDown,
  LuFolderDown,
  LuWallet,
  LuSettings,
  LuPalette,
} from "react-icons/lu";
import { CiEdit } from "react-icons/ci";
import { LiaCheckCircle } from "react-icons/lia";
import { FaGlobe, FaCloudUploadAlt } from "react-icons/fa";

import "./Account.css";

/** ---------- helpers ---------- */
const readFile = (file) =>
  new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result);
    r.onerror = rej;
    r.readAsDataURL(file);
  });

const uniq = (arr) => Array.from(new Set((arr || []).filter(Boolean)));

// Stable IDs so React keys don’t change
const mkId = () =>
  Math.random().toString(36).slice(2) + Date.now().toString(36);
const withIds = (arr) =>
  (Array.isArray(arr) ? arr : []).map((it) =>
    typeof it === "object" && it !== null ? { _id: it._id || mkId(), ...it } : it
  );

/** ---------- main ---------- */
export default function Account() {
  const profileFromStore = useAppStore((s) => s.extractedProfile) || {};
  const setProfileInStore = (p) =>
    useAppStore.setState({ extractedProfile: p });

  const navigate = useNavigate();

  /** ---------- local editable state ---------- */
  const [editing, setEditing] = useState(false);
  const [theme, setTheme] = useState(profileFromStore.theme || "aurora");
  const [cover, setCover] = useState(profileFromStore.cover || "");
  const [avatar, setAvatar] = useState(profileFromStore.avatar || "");
  const [copied, setCopied] = useState(false);


  // Drafts to keep caret stable while typing
const [expDrafts, setExpDrafts] = useState({});       // _id -> { role, company, city, start, end, bulletsText }
const [eduDrafts, setEduDrafts] = useState({});       // _id -> { school, degree, field, startYear, endYear }
const [projDrafts, setProjDrafts] = useState({});     // _id -> { name, url, description, tagsText }
const [achDrafts, setAchDrafts] = useState({});       // _id -> { title, issuer, date, url }


  // full structured local state (so we can support complex collections)
  const [local, setLocal] = useState(() => ({
    username: profileFromStore.username || "",
    name: profileFromStore.name || "",
    title: profileFromStore.title || "",
    summary:
      profileFromStore.summary ||
      "Write a short, punchy summary that shows your value.",
    email: profileFromStore.email || "",
    phone: profileFromStore.phone || "",
    location: profileFromStore.location || "",
    skills: Array.isArray(profileFromStore.skills) ? profileFromStore.skills : [],
    experience: withIds(profileFromStore.experience),
    education: withIds(profileFromStore.education),
    achievements: withIds(profileFromStore.achievements),
    projects: withIds(profileFromStore.projects),

    social: {
      website: profileFromStore.website || "",
      linkedin: profileFromStore.linkedin || "",
      github: profileFromStore.github || "",
      twitter: profileFromStore.twitter || "",
      dribbble: profileFromStore.dribbble || "",
      behance: profileFromStore.behance || "",
    },

    // section visibility + order
    sectionsOrder:
      profileFromStore.sectionsOrder || [
        "about",
        "experience",
        "projects",
        "skills",
        "education",
        "achievements",
        "social",
      ],
    sectionsHidden: profileFromStore.sectionsHidden || {}, // {about:false,...}
  }));

  /** ---------- caret-safe draft state ---------- */
  // Buffer per-experience bullets: _id -> textarea raw value
  const [expBulletsDraft, setExpBulletsDraft] = useState({});
  useEffect(() => {
    setExpBulletsDraft((prev) => {
      const next = { ...prev };
      for (const j of local.experience || []) {
        if (next[j._id] == null) {
          next[j._id] = Array.isArray(j.bullets)
            ? j.bullets.join("\n")
            : j.bullets || "";
        }
      }
      return next;
    });
  }, [local.experience]);

  /** ---------- computed ---------- */
  const initials = useMemo(() => {
    if (!local.name) return "U";
    return local.name
      .split(" ")
      .filter(Boolean)
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }, [local.name]);

  const publicLink = useMemo(
    () => `${window.location.origin}/u/${local.username || "me"}`,
    [local.username]
  );

  /** ---------- update helpers ---------- */
  const patch = (patchObj) => setLocal((p) => ({ ...p, ...patchObj }));
  const change = (k, v) => setLocal((p) => ({ ...p, [k]: v }));

  const changeSocial = (k, v) =>
    setLocal((p) => ({ ...p, social: { ...p.social, [k]: v } }));

  const addListItem = (key, item) =>
    setLocal((p) => ({
      ...p,
      [key]: [...(p[key] || []), { _id: mkId(), ...item }],
    }));

  const patchListItem = (key, index, patchObj) =>
    setLocal((p) => ({
      ...p,
      [key]: p[key].map((it, i) => (i === index ? { ...it, ...patchObj } : it)),
    }));

  const removeListItem = (key, index) =>
    setLocal((p) => ({ ...p, [key]: p[key].filter((_, i) => i !== index) }));

  const moveSection = (dir, id) => {
    setLocal((p) => {
      const order = [...p.sectionsOrder];
      const i = order.indexOf(id);
      if (i === -1) return p;
      const j = dir === "up" ? i - 1 : i + 1;
      if (j < 0 || j >= order.length) return p;
      [order[i], order[j]] = [order[j], order[i]];
      return { ...p, sectionsOrder: order };
    });
  };

  const toggleSection = (id) =>
    setLocal((p) => ({
      ...p,
      sectionsHidden: {
        ...p.sectionsHidden,
        [id]: !p.sectionsHidden?.[id],
      },
    }));

  /** ---------- uploads ---------- */
  const onCoverChange = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const data = await readFile(f);
    setCover(data);
  };
  const onAvatarChange = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const data = await readFile(f);
    setAvatar(data);
  };

  /** ---------- save ---------- */
  const handleSave = () => {
    // Optionally strip __tagsDraft before saving:
    const cleanedProjects = (local.projects || []).map((p) => {
      const { __tagsDraft, ...rest } = p || {};
      return rest;
    });

    const normalized = {
      ...local,
      projects: cleanedProjects,
      avatar,
      cover,
      theme,
      skills: uniq(local.skills || []),
    };
    setProfileInStore(normalized);
    setEditing(false);
  };

  /** ---------- copy ---------- */
  const copyLink = () => {
    navigator.clipboard.writeText(publicLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  /** ---------- one-click export ---------- */
  const exportResume = async () => {
    const html = renderTemplate({
      templateId: "sleek",
      docType: "cv",
      profile: {
        ...local,
        avatar,
        cover,
        theme,
      },
      body: "",
    });

    const container = document.createElement("div");
    container.innerHTML = html;

    const opts = {
      margin: [0, 0, 0, 0],
      filename: `${(local.name || "Resume").replace(/\s+/g, "_")}.pdf`,
      image: { type: "jpeg", quality: 1 },
      html2canvas: { scale: 2, useCORS: true, backgroundColor: "#ffffff" },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      pagebreak: { mode: ["css", "legacy"] },
    };

    await html2pdf().set(opts).from(container).save();
  };

  /** ---------- theme mount ---------- */
  const rootRef = useRef(null);
  useEffect(() => {
    if (!rootRef.current) return;
    rootRef.current.setAttribute("data-accx-theme", theme);
  }, [theme]);


  // Seed Experience drafts
useEffect(() => {
  setExpDrafts((prev) => {
    const next = { ...prev };
    for (const j of local.experience || []) {
      if (!next[j._id]) {
        next[j._id] = {
          role: j.role || "",
          company: j.company || "",
          city: j.city || "",
          start: j.start || "",
          end: j.end || "",
          bulletsText: Array.isArray(j.bullets) ? j.bullets.join("\n") : (j.bullets || "")
        };
      }
    }
    return next;
  });
}, [local.experience]);

// Seed Education drafts
useEffect(() => {
  setEduDrafts((prev) => {
    const next = { ...prev };
    for (const e of local.education || []) {
      if (!next[e._id]) {
        next[e._id] = {
          school: e.school || "",
          degree: e.degree || "",
          field: e.field || "",
          startYear: e.startYear || "",
          endYear: e.endYear || ""
        };
      }
    }
    return next;
  });
}, [local.education]);

// Seed Projects drafts
useEffect(() => {
  setProjDrafts((prev) => {
    const next = { ...prev };
    for (const p of local.projects || []) {
      if (!next[p._id]) {
        next[p._id] = {
          name: p.name || "",
          url: p.url || "",
          description: p.description || "",
          tagsText: Array.isArray(p.tags) ? p.tags.join(", ") : (p.tags || "")
        };
      }
    }
    return next;
  });
}, [local.projects]);

// Seed Achievements drafts
useEffect(() => {
  setAchDrafts((prev) => {
    const next = { ...prev };
    for (const a of local.achievements || []) {
      if (!next[a._id]) {
        next[a._id] = {
          title: a.title || "",
          issuer: a.issuer || "",
          date: a.date || "",
          url: a.url || ""
        };
      }
    }
    return next;
  });
}, [local.achievements]);


  /** ---------- small forms ---------- */
  const SkillEditor = () => {
    const [txt, setTxt] = useState("");
    const add = () => {
      if (!txt.trim()) return;
      change(
        "skills",
        uniq([...(local.skills || []), ...txt.split(",").map((s) => s.trim())])
      );
      setTxt("");
    };
    return (
      <div className="accx-skill-editor">
        <input
          className="accx-input"
          placeholder="Type skills, comma-separated"
          value={txt}
          onChange={(e) => setTxt(e.target.value)}
        />
        <button className="accx-btn accx-btn-ghost" onClick={add}>
          <LuPlus /> Add
        </button>
        <div className="accx-tags">
          {(local.skills || []).map((s, i) => (
            <span key={`${s}-${i}`} className="accx-tag">
              {s}
              <button
                className="accx-chip-x"
                onClick={() =>
                  change(
                    "skills",
                    (local.skills || []).filter((_, idx) => idx !== i)
                  )
                }
                aria-label="Remove skill"
              >
                <LuX />
              </button>
            </span>
          ))}
        </div>
      </div>
    );
  };

  const ExperienceEditor = () => (
  <div className="accx-list">
    {(local.experience || []).map((job, i) => {
      const d = expDrafts[job._id] || {
        role: "", company: "", city: "", start: "", end: "", bulletsText: ""
      };

      const commit = () => {
        patchListItem("experience", i, {
          role: d.role,
          company: d.company,
          city: d.city,
          start: d.start,
          end: d.end,
          bullets: String(d.bulletsText)
            .split("\n")
            .map((b) => b.trim())
            .filter(Boolean),
        });
      };

      return (
        <div key={job._id} className="accx-item">
          <div className="accx-row">
            <input
              className="accx-input"
              placeholder="Role"
              value={d.role}
              onChange={(e) =>
                setExpDrafts((prev) => ({
                  ...prev,
                  [job._id]: { ...d, role: e.target.value }
                }))
              }
              onBlur={commit}
            />
            <input
              className="accx-input"
              placeholder="Company"
              value={d.company}
              onChange={(e) =>
                setExpDrafts((prev) => ({
                  ...prev,
                  [job._id]: { ...d, company: e.target.value }
                }))
              }
              onBlur={commit}
            />
          </div>

          <div className="accx-row">
            <input
              className="accx-input"
              placeholder="City"
              value={d.city}
              onChange={(e) =>
                setExpDrafts((prev) => ({
                  ...prev,
                  [job._id]: { ...d, city: e.target.value }
                }))
              }
              onBlur={commit}
            />
            <input
              className="accx-input"
              placeholder="Start (YYYY-MM)"
              value={d.start}
              onChange={(e) =>
                setExpDrafts((prev) => ({
                  ...prev,
                  [job._id]: { ...d, start: e.target.value }
                }))
              }
              onBlur={commit}
            />
            <input
              className="accx-input"
              placeholder="End (YYYY-MM or Present)"
              value={d.end}
              onChange={(e) =>
                setExpDrafts((prev) => ({
                  ...prev,
                  [job._id]: { ...d, end: e.target.value }
                }))
              }
              onBlur={commit}
            />
          </div>

          <textarea
            className="accx-textarea"
            rows={4}
            placeholder="Achievements (one per line)…"
            value={d.bulletsText}
            onChange={(e) =>
              setExpDrafts((prev) => ({
                ...prev,
                [job._id]: { ...d, bulletsText: e.target.value }
              }))
            }
            onBlur={commit}
          />

          <div className="accx-item-actions">
            <button
              className="accx-btn accx-btn-ghost"
              onClick={() => removeListItem("experience", i)}
            >
              <LuX /> Remove
            </button>
          </div>
        </div>
      );
    })}

    <button
      className="accx-btn accx-btn-ghost"
      onClick={() =>
        addListItem("experience", {
          role: "",
          company: "",
          city: "",
          start: "",
          end: "",
          bullets: [],
        })
      }
    >
      <LuPlus /> Add experience
    </button>
  </div>
);


 const EducationEditor = () => (
  <div className="accx-list">
    {(local.education || []).map((ed, i) => {
      const d = eduDrafts[ed._id] || {
        school: "", degree: "", field: "", startYear: "", endYear: ""
      };
      const commit = () =>
        patchListItem("education", i, {
          school: d.school,
          degree: d.degree,
          field: d.field,
          startYear: String(d.startYear).replace(/\D/g, "").slice(0, 4),
          endYear: String(d.endYear).replace(/\D/g, "").slice(0, 4),
        });

      return (
        <div key={ed._id} className="accx-item">
          <div className="accx-row">
            <input
              className="accx-input"
              placeholder="School"
              value={d.school}
              onChange={(e) =>
                setEduDrafts((prev) => ({
                  ...prev, [ed._id]: { ...d, school: e.target.value }
                }))
              }
              onBlur={commit}
            />
            <input
              className="accx-input"
              placeholder="Degree"
              value={d.degree}
              onChange={(e) =>
                setEduDrafts((prev) => ({
                  ...prev, [ed._id]: { ...d, degree: e.target.value }
                }))
              }
              onBlur={commit}
            />
          </div>
          <div className="accx-row">
            <input
              className="accx-input"
              placeholder="Field of Study"
              value={d.field}
              onChange={(e) =>
                setEduDrafts((prev) => ({
                  ...prev, [ed._id]: { ...d, field: e.target.value }
                }))
              }
              onBlur={commit}
            />
            <input
              className="accx-input"
              placeholder="Start Year"
              value={d.startYear}
              onChange={(e) =>
                setEduDrafts((prev) => ({
                  ...prev, [ed._id]: { ...d, startYear: e.target.value }
                }))
              }
              onBlur={commit}
            />
            <input
              className="accx-input"
              placeholder="End Year"
              value={d.endYear}
              onChange={(e) =>
                setEduDrafts((prev) => ({
                  ...prev, [ed._id]: { ...d, endYear: e.target.value }
                }))
              }
              onBlur={commit}
            />
          </div>
          <div className="accx-item-actions">
            <button
              className="accx-btn accx-btn-ghost"
              onClick={() => removeListItem("education", i)}
            >
              <LuX /> Remove
            </button>
          </div>
        </div>
      );
    })}
    <button
      className="accx-btn accx-btn-ghost"
      onClick={() =>
        addListItem("education", {
          school: "",
          degree: "",
          field: "",
          startYear: "",
          endYear: "",
        })
      }
    >
      <LuPlus /> Add education
    </button>
  </div>
);

const ProjectsEditor = () => (
  <div className="accx-list">
    {(local.projects || []).map((prj, i) => {
      const d = projDrafts[prj._id] || {
        name: "", url: "", description: "", tagsText: ""
      };
      const commit = () =>
        patchListItem("projects", i, {
          name: d.name,
          url: d.url,
          description: d.description,
          tags: String(d.tagsText)
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
        });

      return (
        <div key={prj._id} className="accx-item">
          <div className="accx-row">
            <input
              className="accx-input"
              placeholder="Project name"
              value={d.name}
              onChange={(e) =>
                setProjDrafts((prev) => ({
                  ...prev, [prj._id]: { ...d, name: e.target.value }
                }))
              }
              onBlur={commit}
            />
            <input
              className="accx-input"
              placeholder="URL"
              value={d.url}
              onChange={(e) =>
                setProjDrafts((prev) => ({
                  ...prev, [prj._id]: { ...d, url: e.target.value }
                }))
              }
              onBlur={commit}
            />
          </div>
          <div className="accx-row">
            <input
              className="accx-input"
              placeholder="Tags (comma separated)"
              value={d.tagsText}
              onChange={(e) =>
                setProjDrafts((prev) => ({
                  ...prev, [prj._id]: { ...d, tagsText: e.target.value }
                }))
              }
              onBlur={commit}
            />
            <label className="accx-file">
              <LuImagePlus />
              <span>Cover image</span>
              <input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const f = e.target.files?.[0];
                  if (!f) return;
                  const data = await readFile(f);
                  // commit image immediately
                  patchListItem("projects", i, { image: data });
                }}
              />
            </label>
          </div>
          <textarea
            className="accx-textarea"
            rows={4}
            placeholder="Short description"
            value={d.description}
            onChange={(e) =>
              setProjDrafts((prev) => ({
                ...prev, [prj._id]: { ...d, description: e.target.value }
              }))
            }
            onBlur={commit}
          />
          <div className="accx-item-actions">
            <button
              className="accx-btn accx-btn-ghost"
              onClick={() => removeListItem("projects", i)}
            >
              <LuX /> Remove
            </button>
          </div>
        </div>
      );
    })}
    <button
      className="accx-btn accx-btn-ghost"
      onClick={() =>
        addListItem("projects", {
          name: "",
          url: "",
          description: "",
          tags: [],
          image: "",
        })
      }
    >
      <LuPlus /> Add project
    </button>
  </div>
);


const AchievementsEditor = () => (
  <div className="accx-list">
    {(local.achievements || []).map((ac, i) => {
      const d = achDrafts[ac._id] || {
        title: "", issuer: "", date: "", url: ""
      };
      const commit = () =>
        patchListItem("achievements", i, {
          title: d.title,
          issuer: d.issuer,
          date: d.date,
          url: d.url,
        });

      return (
        <div key={ac._id} className="accx-item">
          <div className="accx-row">
            <input
              className="accx-input"
              placeholder="Title / Certification"
              value={d.title}
              onChange={(e) =>
                setAchDrafts((prev) => ({
                  ...prev, [ac._id]: { ...d, title: e.target.value }
                }))
              }
              onBlur={commit}
            />
            <input
              className="accx-input"
              placeholder="Issuer"
              value={d.issuer}
              onChange={(e) =>
                setAchDrafts((prev) => ({
                  ...prev, [ac._id]: { ...d, issuer: e.target.value }
                }))
              }
              onBlur={commit}
            />
          </div>
          <div className="accx-row">
            <input
              className="accx-input"
              placeholder="Date (YYYY-MM)"
              value={d.date}
              onChange={(e) =>
                setAchDrafts((prev) => ({
                  ...prev, [ac._id]: { ...d, date: e.target.value }
                }))
              }
              onBlur={commit}
            />
            <input
              className="accx-input"
              placeholder="Credential URL"
              value={d.url}
              onChange={(e) =>
                setAchDrafts((prev) => ({
                  ...prev, [ac._id]: { ...d, url: e.target.value }
                }))
              }
              onBlur={commit}
            />
            <label className="accx-file">
              <FaCloudUploadAlt />
              <span>Badge icon</span>
              <input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const f = e.target.files?.[0];
                  if (!f) return;
                  const data = await readFile(f);
                  patchListItem("achievements", i, { badge: data });
                }}
              />
            </label>
          </div>
          <div className="accx-item-actions">
            <button
              className="accx-btn accx-btn-ghost"
              onClick={() => removeListItem("achievements", i)}
            >
              <LuX /> Remove
            </button>
          </div>
        </div>
      );
    })}
    <button
      className="accx-btn accx-btn-ghost"
      onClick={() =>
        addListItem("achievements", {
          title: "",
          issuer: "",
          date: "",
          url: "",
          badge: "",
        })
      }
    >
      <LuPlus /> Add achievement
    </button>
  </div>
);


  /** ---------- section renderers (read-only) ---------- */
  const SectionAbout = () => (
    <div className="accx-card">
      <h3 className="accx-sec-title">
        <LuUser /> About
      </h3>
      <p className="accx-summary">
        {local.summary || "Tell people who you are and the value you bring."}
      </p>
      <div className="accx-kv">
        <span>
          <LuMail /> {local.email || "—"}
        </span>
        <span>
          <LuPhone /> {local.phone || "—"}
        </span>
        <span>
          <LuMapPin /> {local.location || "—"}
        </span>
      </div>
    </div>
  );

  const SectionExperience = () => (
    <div className="accx-card">
      <h3 className="accx-sec-title">
        <LuBriefcase /> Experience
      </h3>
      {(local.experience || []).length === 0 ? (
        <p className="accx-muted">No experience added yet.</p>
      ) : (
        (local.experience || []).map((j) => (
          <div key={j._id} className="accx-block">
            <div className="accx-block-hd">
              <h4>{j.role || "Role"}</h4>
              <span className="accx-dates">
                {[j.start, j.end || "Present"].filter(Boolean).join(" • ")}
              </span>
            </div>
            <div className="accx-dim">
              {[j.company, j.city].filter(Boolean).join(" • ")}
            </div>
            {(j.bullets || []).length > 0 && (
              <ul className="accx-bullets">
                {j.bullets.map((b, k) => (
                  <li key={`${j._id}-b-${k}`}>{b}</li>
                ))}
              </ul>
            )}
          </div>
        ))
      )}
    </div>
  );

  const SectionProjects = () => (
    <div className="accx-card">
      <h3 className="accx-sec-title">
        <LuLink2 /> Featured Projects
      </h3>
      {(local.projects || []).length === 0 ? (
        <p className="accx-muted">No projects yet.</p>
      ) : (
        <div className="accx-projects">
          {(local.projects || []).map((p) => (
            <a
              key={p._id}
              className="accx-project"
              href={p.url || "#"}
              target="_blank"
              rel="noreferrer"
            >
              {p.image ? (
                <img src={p.image} alt="" />
              ) : (
                <div className="accx-project-ph" />
              )}
              <div className="accx-project-body">
                <div className="accx-project-hd">
                  <h4>{p.name || "Project"}</h4>
                  {p.url && <LuExternalLink />}
                </div>
                <p className="accx-muted">{p.description || ""}</p>
                <div className="accx-tags">
                  {(p.tags || []).map((t, k) => (
                    <span key={`${p._id}-t-${k}`} className="accx-tag">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );

  const SectionSkills = () => (
    <div className="accx-card">
      <h3 className="accx-sec-title">
        <LuSparkles /> Skills
      </h3>
      {(local.skills || []).length === 0 ? (
        <p className="accx-muted">Add a few of your strongest skills.</p>
      ) : (
        <div className="accx-tags">
          {(local.skills || []).map((s, i) => (
            <span key={`${s}-${i}`} className="accx-tag">
              {s}
            </span>
          ))}
        </div>
      )}
    </div>
  );

  const SectionEducation = () => (
    <div className="accx-card">
      <h3 className="accx-sec-title">
        <LuGraduationCap /> Education
      </h3>
      {(local.education || []).length === 0 ? (
        <p className="accx-muted">No education added yet.</p>
      ) : (
        (local.education || []).map((e) => (
          <div key={e._id} className="accx-block">
            <div className="accx-block-hd">
              <h4>{e.degree || "Degree"}</h4>
              <span className="accx-dates">
                {[e.startYear, e.endYear].filter(Boolean).join(" – ")}
              </span>
            </div>
            <div className="accx-dim">
              {[e.school, e.field].filter(Boolean).join(" • ")}
            </div>
          </div>
        ))
      )}
    </div>
  );

  const SectionAchievements = () => (
    <div className="accx-card">
      <h3 className="accx-sec-title">
        <LuAward /> Achievements & Certifications
      </h3>
      {(local.achievements || []).length === 0 ? (
        <p className="accx-muted">Showcase awards and certifications.</p>
      ) : (
        <div className="accx-achievements">
          {(local.achievements || []).map((a) => (
            <a
              key={a._id}
              className="accx-ach"
              href={a.url || "#"}
              target="_blank"
              rel="noreferrer"
            >
              <div className="accx-ach-badge">
                {a.badge ? <img src={a.badge} alt="" /> : <LiaCheckCircle />}
              </div>
              <div className="accx-ach-body">
                <div className="accx-ach-hd">
                  <h4>{a.title || "Achievement"}</h4>
                  {a.url && <LuExternalLink />}
                </div>
                <div className="accx-dim">
                  {[a.issuer, a.date].filter(Boolean).join(" • ")}
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );

  const SectionSocial = () => {
    const s = local.social || {};
    const entries = [
      ["website", "Website"],
      ["linkedin", "LinkedIn"],
      ["github", "GitHub"],
      ["twitter", "Twitter / X"],
      ["dribbble", "Dribbble"],
      ["behance", "Behance"],
    ];
    const hasAny = entries.some(([k]) => s[k]);
    return (
      <div className="accx-card">
        <h3 className="accx-sec-title">
          <FaGlobe /> Social
        </h3>
        {!hasAny ? (
          <p className="accx-muted">
            Add links to help people learn more about you.
          </p>
        ) : (
          <ul className="accx-links">
            {entries.map(([k, label]) =>
              s[k] ? (
                <li key={k}>
                  <span>{label}</span>
                  <a href={s[k]} target="_blank" rel="noreferrer">
                    {s[k]}
                  </a>
                </li>
              ) : null
            )}
          </ul>
        )}
      </div>
    );
  };

  /** ---------- layout ---------- */
  const editBar = (
    <div className="accx-editbar">
      <div className="accx-left">
        <label className="accx-file">
          <FaCloudUploadAlt />
          <span>Upload cover</span>
          <input type="file" accept="image/*" onChange={onCoverChange} />
        </label>
        <label className="accx-file">
          <LuImagePlus />
          <span>Upload avatar</span>
          <input type="file" accept="image/*" onChange={onAvatarChange} />
        </label>

        <div className="accx-theme">
          <LuPalette />
          <select
            className="accx-input axx"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            aria-label="Theme"
          >
          
            <option value="aurora">Aurora</option>
              <option value="sunset">Sunset</option>
            <option value="teal">Teal</option>
            <option value="violet">Violet</option>
            <option value="slate">Slate</option>
          </select>
        </div>
      </div>

      <div className="accx-right">
        <button className="accx-btn" onClick={() => navigate("/billing")}>
          <LuWallet /> Billing
        </button>
        <button className="accx-btn" onClick={() => navigate("/settings")}>
          <LuSettings /> Settings
        </button>
        <button className="accx-btn accx-btn-primary" onClick={exportResume}>
          <LuFolderDown /> Download latest resume
        </button>
        <button
          className="accx-btn accx-btn-ghost"
          onClick={() => (editing ? handleSave() : setEditing(true))}
        >
          {editing ? <LuSave /> : <CiEdit />}
          {editing ? "Save changes" : "Edit profile"}
        </button>
      </div>
    </div>
  );

  const sectionControls = (
    <div className="accx-sections-ctl">
      {[
        "about",
        "experience",
        "projects",
        "skills",
        "education",
        "achievements",
        "social",
      ].map((id) => {
        const hidden = !!local.sectionsHidden?.[id];
        const idx = local.sectionsOrder.indexOf(id);
        return (
          <div key={id} className={`accx-secchip ${hidden ? "is-off" : ""}`}>
            <span className="accx-secname">{id}</span>
            <div className="accx-secbtns">
              <button
                className="accx-icon"
                onClick={() => moveSection("up", id)}
                disabled={idx <= 0}
              >
                <LuMoveUp />
              </button>
              <button
                className="accx-icon"
                onClick={() => moveSection("down", id)}
                disabled={idx < 0 || idx >= local.sectionsOrder.length - 1}
              >
                <LuMoveDown />
              </button>
              <button
                className="accx-icon"
                onClick={() => toggleSection(id)}
                title="toggle"
              >
                {hidden ? "Show" : "Hide"}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );

  /** ---------- render ---------- */
  return (
    <section ref={rootRef} className="accx-root" data-accx-theme={theme}>
      {/* cover */}
      <div
        className="accx-cover"
        style={cover ? { backgroundImage: `url(${cover})` } : undefined}
      >
        <div className="accx-wrap">
          <div className="accx-head">
            <div className="accx-avatar">
              {avatar ? <img src={avatar} alt="avatar" /> : <span>{initials}</span>}
            </div>

            <div className="accx-id">
              {editing ? (
                <>
                  <input
                    className="accx-name-input"
                    value={local.name}
                    placeholder="Your full name"
                    onChange={(e) => change("name", e.target.value)}
                  />
                  <input
                    className="accx-title-input"
                    value={local.title}
                    placeholder="Professional title"
                    onChange={(e) => change("title", e.target.value)}
                  />
                  <input
                    className="accx-username"
                    value={local.username || ""}
                    placeholder="@username"
                    onChange={(e) =>
                      change(
                        "username",
                        e.target.value.replace(/[^\w\-]/g, "").toLowerCase()
                      )
                    }
                  />
                </>
              ) : (
                <>
                  <h1 className="accx-name">{local.name || "Your Name"}</h1>
                  <p className="accx-title">{local.title || "Your Title"}</p>

                  <div className="accx-publiclink">
                    <span>{publicLink}</span>
                    <button
                      type="button"
                      className="accx-icon"
                      onClick={copyLink}
                      title="Copy link"
                    >
                      <LuCopy />
                    </button>

                    <a
                      className="accx-icon"
                      href={publicLink}
                      target="_blank"
                      rel="noreferrer"
                      title="Open"
                    >
                      <LuExternalLink />
                    </a>
                    {copied && <em className="accx-copied">Copied!</em>}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* edit bar is inside the same centered wrap */}
          {editBar}
        </div>
      </div>

      {/* edit panels when in editing mode */}
      {editing && (
        <div className="accx-wrap">
          <div className="accx-edit-panels">
            <div className="accx-card">
              <h3 className="accx-sec-title">
                <LuUser /> Basic Info
              </h3>
              <div className="accx-row">
                <input
                  className="accx-input"
                  placeholder="Full name"
                  value={local.name}
                  onChange={(e) => change("name", e.target.value)}
                />
                <input
                  className="accx-input"
                  placeholder="Professional title"
                  value={local.title}
                  onChange={(e) => change("title", e.target.value)}
                />
              </div>
              <textarea
                className="accx-textarea"
                rows={4}
                placeholder="Summary"
                value={local.summary}
                onChange={(e) => change("summary", e.target.value)}
              />
              <div className="accx-row">
                <input
                  className="accx-input"
                  placeholder="Email"
                  value={local.email}
                  onChange={(e) => change("email", e.target.value)}
                />
                <input
                  className="accx-input"
                  placeholder="Phone"
                  value={local.phone}
                  onChange={(e) => change("phone", e.target.value)}
                />
                <input
                  className="accx-input"
                  placeholder="Location"
                  value={local.location}
                  onChange={(e) => change("location", e.target.value)}
                />
              </div>
            </div>

            <div className="accx-card">
              <h3 className="accx-sec-title">
                <LuSparkles /> Skills
              </h3>
              <SkillEditor />
            </div>

            <div className="accx-card">
              <h3 className="accx-sec-title">
                <LuBriefcase /> Experience
              </h3>
              <ExperienceEditor />
            </div>

            <div className="accx-card">
              <h3 className="accx-sec-title">
                <LuGraduationCap /> Education
              </h3>
              <EducationEditor />
            </div>

            <div className="accx-card">
              <h3 className="accx-sec-title">
                <LuLink2 /> Projects
              </h3>
              <ProjectsEditor />
            </div>

            <div className="accx-card">
              <h3 className="accx-sec-title">
                <LuAward /> Achievements
              </h3>
              <AchievementsEditor />
            </div>

            <div className="accx-card">
              <h3 className="accx-sec-title">
                <FaGlobe /> Social Links
              </h3>
              <div className="accx-grid">
                {[
                  ["website", "Website URL"],
                  ["linkedin", "LinkedIn"],
                  ["github", "GitHub"],
                  ["twitter", "Twitter/X"],
                  ["dribbble", "Dribbble"],
                  ["behance", "Behance"],
                ].map(([k, label]) => (
                  <input
                    key={k}
                    className="accx-input"
                    placeholder={label}
                    value={local.social?.[k] || ""}
                    onChange={(e) => changeSocial(k, e.target.value)}
                  />
                ))}
              </div>
            </div>

            <div className="accx-card">
              <h3 className="accx-sec-title">
                <LuSettings /> Sections & Order
              </h3>
              {sectionControls}
            </div>
          </div>
        </div>
      )}

      {/* public preview-style layout (when not editing) */}
      {!editing && (
        <div className="accx-wrap">
          <div className="accx-main accx-main--cols">
            {local.sectionsOrder.map((id) => {
              if (local.sectionsHidden?.[id]) return null;
              if (id === "about") return <SectionAbout key={id} />;
              if (id === "experience") return <SectionExperience key={id} />;
              if (id === "projects") return <SectionProjects key={id} />;
              if (id === "skills") return <SectionSkills key={id} />;
              if (id === "education") return <SectionEducation key={id} />;
              if (id === "achievements") return <SectionAchievements key={id} />;
              if (id === "social") return <SectionSocial key={id} />;
              return null;
            })}
          </div>
        </div>
      )}
    </section>
  );
}
