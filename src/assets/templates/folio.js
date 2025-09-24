// src/templates/folio.js
// FOLIO template — portfolio-inspired resume/letter
// Order: Summary → Skills → Experience → (Education/Achievements/Certs/Social) → References

const esc = (s) =>
  String(s || "").replace(/[&<>"']/g, (m) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m])
  );
const line = (arr) => (arr || []).filter(Boolean).join(" • ");
const initialsOf = (name = "") => {
  const p = String(name).trim().split(/\s+/);
  return ((p[0]?.[0] || "U") + (p[1]?.[0] || "")).toUpperCase();
};

/* ========================= RESUME ========================= */

function renderCV(profile = {}) {
  const {
    name = "",
    title = "",
    email = "",
    phone = "",
    location = "",
    linkedin = "",
    summary = "",
    skills = [],
    achievements = [],
    certifications = [],
    experience = [],
    education = [],
    references = [],
    social = {},
  } = profile;

  const career = title || "Professional Title";
  const sum =
    (summary || "").trim() ||
    "Results-driven professional with experience delivering reliable outcomes in fast-moving environments. Comfortable collaborating across teams, translating goals into clear plans, and maintaining a high bar for quality and detail.\n\nI enjoy solving practical problems, learning quickly, and using simple, thoughtful solutions to create measurable business impact.";

  // Skills
  const skillsHTML = skills?.length
    ? `<div class="pf-tags">${skills.map((s) => `<span class="pf-tag">${esc(s)}</span>`).join("")}</div>`
    : `<p class="pf-muted">No skills added yet.</p>`;

  // Experience
  const jobs = (experience || []).filter((j) => j.role || j.company || (j.bullets || []).length);
  const expHTML = jobs.length
    ? `<div class="pf-timeline">
        ${jobs
          .map(
            (j) => `
          <article class="pf-tl-item avoid-break">
            <div class="pf-tl-dot"></div>
            <div class="pf-tl-stem"></div>
            <div class="pf-tl-body">
              <h3 class="pf-job">
                ${esc(j.role || "Job Title")}
                <span class="pf-job__dates">${esc(line([j.start, j.end || "Present"]))}</span>
              </h3>
              <div class="pf-dim">${esc(line([j.company, j.city]))}</div>
              ${
                Array.isArray(j.bullets) && j.bullets.length
                  ? `<ul class="pf-bullets">${j.bullets.map((b) => `<li>${esc(b)}</li>`).join("")}</ul>`
                  : ""
              }
            </div>
          </article>`
          )
          .join("")}
       </div>`
    : `<p class="pf-muted">No experience added yet.</p>`;

  // Education
  const eduHTML = (education || [])
    .filter((ed) => ed.degree || ed.certificate || ed.school || ed.field)
    .map(
      (ed) => `
      <div class="pf-edu-item">
        <h4>${esc(ed.degree || ed.certificate || "Degree / Certificate")}</h4>
        <div class="pf-dim">${esc(line([ed.school, ed.field]))}</div>
        <div class="pf-muted">${esc([ed.startYear, ed.endYear].filter(Boolean).join(" – "))}</div>
      </div>`
    )
    .join("");

  // Achievements
  const achHTML = achievements?.length
    ? `<ul class="pf-list">${achievements.map((a) => `<li>${esc(a?.title || a)}</li>`).join("")}</ul>`
    : "";

  // Certifications
  const certs = (certifications || []).filter((c) => c.name || c.issuer || c.year);
  const certsHTML = certs.length
    ? `<ul class="pf-list">
         ${certs
           .map((c) => {
             const bits = [c.name, c.issuer ? `(${c.issuer})` : "", c.year].filter(Boolean).join(" ");
             return `<li>${esc(bits)}</li>`;
           })
           .join("")}
       </ul>`
    : "";

  // Social chips
  const socialEntries = [
    ["Website", social?.website],
    ["LinkedIn", social?.linkedin || linkedin],
    ["GitHub", social?.github],
    ["Twitter / X", social?.twitter],
    ["Dribbble", social?.dribbble],
    ["Behance", social?.behance],
  ].filter(([, url]) => !!url);

  const socialHTML = socialEntries.length
    ? `<ul class="pf-list pf-list--compact">
         ${socialEntries
           .map(
             ([label, url]) => `
             <li>
               <a class="pf-link-chip" href="${esc(url)}" target="_blank" rel="noreferrer">
                 <span class="pf-link-chip__label">${esc(label)}</span>
                 <span class="pf-link-chip__icon" aria-hidden>↗</span>
               </a>
             </li>`
           )
           .join("")}
       </ul>`
    : "";

  // References (full-width at bottom)
  const refs = (references || []).filter((r) => r.name || r.email || r.phone || r.title || r.company);
  const refsHTML = refs.length
    ? `<div class="ref-grid">
         ${refs
           .map(
             (r) => `
             <article class="ref-card avoid-break">
               <div class="ref-name">${esc(r.name || "")}</div>
               <div class="ref-meta pf-dim">${esc([r.title, r.company].filter(Boolean).join(" • "))}</div>
               <div class="ref-contact pf-dim">
                 ${r.email ? `<span>${esc(r.email)}</span>` : ""}
                 ${r.phone ? ` &nbsp;•&nbsp; <span>${esc(r.phone)}</span>` : ""}
               </div>
             </article>`
           )
           .join("")}
       </div>`
    : `<p class="pf-muted">References available upon request.</p>`;

  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    /* Page margins: generous left gutter, slightly tighter right */
    @page { size:A4; margin: 20mm 16mm 20mm 26mm; }

    :root{
      --brand:#6366f1; --teal:#0ea5a5; --ink:#0f172a; --dim:#667085; --line:#e2e8f0;
      --panel:#fff; --surface:#f6f8fb;
    }
    html,body{margin:0;padding:0;background:#fff}
    body{font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,"Helvetica Neue",Arial;
         color:var(--ink); font-size:12px; line-height:1.5}

    .wrap{overflow:hidden}
    .cover{
      background: linear-gradient(135deg, var(--brand), var(--teal));
      color:#fff; padding:18px 16px 22px;   border-bottom-left-radius: 14px;  border-bottom-right-radius: 14px;
      box-shadow: 0 14px 40px rgba(0,0,0,.16);
      margin-bottom:14px;
    }
    .head{display:flex; align-items:center; justify-content:center; gap:14px}
    .avatar{
      width:64px;height:64px;border-radius:16px;background:#fff;color:var(--brand);
      display:grid;place-items:center;font-weight:900;font-size:1.5rem;
      box-shadow:0 8px 24px rgba(0,0,0,.25)
    }
    .hinfo{display:grid; gap:4px}
    .name{margin:0; font-size:19px; font-weight:900; letter-spacing:-.02em}
    .title{font-weight:700; opacity:.95}
    .contact{margin-top:4px; opacity:.95}

    .full{margin-bottom:14px}
    .card{background:var(--panel); border:1px solid var(--line); border-radius:14px; padding:14px}
    .sec{font-weight:800; color:var(--brand); margin:0 0 6px; letter-spacing:.02em}
    .lead{margin:0; color:#0b2530}

    /* Grid: slightly narrower right column */
    .grid{display:grid; gap:14px}
    @media print { .grid{grid-template-columns: 1.05fr 0.85fr} }

    /* Lists & tags */
    .pf-list{list-style:none; margin:0; padding:0; display:grid; gap:8px}
    .pf-bullets{margin:6px 0 0 16px}
    .pf-bullets li{margin:3px 0}
    .pf-tags{display:flex; flex-wrap:wrap; gap:8px}
    .pf-tag{background:var(--surface); border:1px solid var(--line); border-radius:999px;
           padding:6px 10px; font-weight:600}
    .pf-muted{color:var(--dim)} .pf-dim{color:#6b7280}

    .pf-tl-item:last-child .pf-tl-stem{
  bottom:auto;         /* stop stretching to the bottom */
  height:12px;         /* short stem under the dot */
}

    /* Timeline (per-item stem) */
    .pf-timeline{position:relative; padding-left:18px}
    .pf-tl-item{position:relative; padding-bottom:12px}
    .pf-tl-dot{
      position:absolute; left:-16px; top:16px; width:10px; height:10px; border-radius:999px;
      background:var(--brand);
      box-shadow:0 0 0 3px rgba(99,102,241,0.25);
    }
    .pf-tl-stem{position:absolute; left:-12px; top:14px; bottom:-6px; width:2px;
      background:linear-gradient(var(--brand), var(--teal)); opacity:.35}
    .pf-job{font-weight:800; display:flex; align-items:center; gap:20px}
    .pf-job__dates{color:#6b7280; font-weight:500; font-size: 12px}

    /* Education */
    .pf-edu{display:grid; gap:10px}
    .pf-edu-item h4{margin:0 0 2px; font-weight:800}

    /* Social chips */
    .pf-list--compact{display:grid; gap:8px}
    .pf-link-chip{display:inline-flex; align-items:center; gap:8px; padding:8px 12px;
      border-radius:999px; border:1px solid var(--line); background:var(--panel); text-decoration:none; color:var(--ink)}
    .pf-link-chip__icon{font-weight:900}

    /* References */
    .ref-grid{display:grid; grid-template-columns: repeat(auto-fit,minmax(220px,1fr)); gap:10px}
    .ref-card{border:1px solid var(--line); border-radius:12px; padding:10px; background:#fcfefe}
    .ref-name{font-weight:800} .ref-meta{margin:3px 0 6px}
    .ref-contact{display:block}

    .avoid-break{break-inside:avoid; page-break-inside:avoid}
  </style>
</head>
<body>
  <section class="wrap">
    <!-- Cover -->
    <div class="cover">
      <header class="head">
        <div class="avatar">${esc(initialsOf(name))}</div>
        <div class="hinfo">
          <h1 class="name">${esc(name || "Your Name")}</h1>
          <div class="title">${esc(career)}</div>
          <div class="contact">${esc(line([email, phone, location]))}${
            String(linkedin || "").trim() ? ` • ${esc(String(linkedin).trim())}` : ""
          }</div>
        </div>
      </header>
    </div>

    <!-- 1) Summary (full width) -->
    <div class="full card">
      <h3 class="sec">Professional Summary</h3>
      <p class="lead">${esc(sum)}</p>
    </div>

    <!-- 2) Skills (full width) -->
    <div class="full card">
      <h3 class="sec">Skills</h3>
      ${skillsHTML}
    </div>

    <!-- 3) Experience (left) + 4) Other sections (right) -->
    <div class="grid">
      <div class="card">
        <h3 class="sec">Experience</h3>
        ${expHTML}
      </div>

      <aside class="card">
        ${eduHTML ? `<h3 class="sec">Education</h3><div class="pf-edu">${eduHTML}</div>` : ""}
        ${achHTML ? `<h3 class="sec" style="margin-top:10px">Achievements</h3>${achHTML}` : ""}
        ${certsHTML ? `<h3 class="sec" style="margin-top:10px">Certifications</h3>${certsHTML}` : ""}
        ${socialHTML ? `<h3 class="sec" style="margin-top:10px">Social</h3>${socialHTML}` : ""}
      </aside>
    </div>

    <!-- 5) References (full width, last) -->
    <div class="full card">
      <h3 class="sec">References</h3>
      ${refsHTML}
    </div>
  </section>
</body>
</html>`;
}

/* ========================= COVER LETTER ========================= */

function renderLetter(profile = {}, body = "") {
  const { name = "", title = "", email = "", phone = "", location = "" } = profile;
  const career = title || "Professional Title";

  const paragraphs = String(body || "")
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => `<p>${esc(p).replace(/\n/g, "<br>")}</p>`)
    .join("");

  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    @page { size:A4; margin: 22mm 18mm 22mm 28mm; }
    :root{ --brand:#6366f1; --teal:#0ea5a5; --ink:#0f172a; --dim:#667085; --line:#e2e8f0; }
    html,body{margin:0;padding:0;background:#fff}
    body{font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,"Helvetica Neue",Arial;
         color:var(--ink); font-size:12px; line-height:1.55}

    .cover{background: linear-gradient(135deg, var(--brand), var(--teal)); color:#fff;
           border-radius:14px; padding:14px 16px 18px; margin-bottom:14px}
    .name{margin:0; font-size:18px; font-weight:900; letter-spacing:-.02em}
    .career{font-weight:700; opacity:.95}
    .contact{margin-top:4px; opacity:.95}

    main{margin-top:6px}
    main p{margin:0 0 12px}
    .sign{margin-top:18px; font-weight:700}
  </style>
</head>
<body>
  <header class="cover">
    <h1 class="name">${esc(name || "Your Name")}</h1>
    <div class="career">${esc(career)}</div>
    <div class="contact">${esc(line([email, phone, location]))}</div>
  </header>

  <main>
    ${paragraphs || "<p>Write your letter content…</p>"}
    <div class="sign">
      <p>Sincerely,</p>
      <p>${esc(name)}</p>
    </div>
  </main>
</body>
</html>`;
}

export default function folio({ docType, profile, body }) {
  return docType === "cover-letter" ? renderLetter(profile, body) : renderCV(profile);
}
