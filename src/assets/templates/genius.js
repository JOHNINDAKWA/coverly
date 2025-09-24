// src/templates/genius.js
// “Genius” resume template — gradient header, per-entry timeline, print-friendly margins

const esc = (s) =>
  String(s || "").replace(/[&<>"']/g, (m) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m])
  );

const line = (arr) => (arr || []).filter(Boolean).join(" • ");

/* ---------- CV layout ---------- */
function renderCV(profile = {}) {
  const {
    name = "",
    title = "",
    email = "",
    phone = "",
    location = "",
    skills = [],
    experience = [],
    education = [],
    achievements = [],
    certifications = [], // [{name, issuer, year}]
    references = [],     // [{name, title, company, email, phone}]
    summary = "",
  } = profile;

  const career = title || "Professional";

  // Default 1–2 paragraph summary if none provided
  const summaryText =
    summary ||
    "Results-driven professional with experience delivering reliable outcomes in fast-moving environments. Comfortable collaborating across teams, translating goals into clear plans, and maintaining a high bar for quality and detail.\n\nI enjoy solving practical problems, learning quickly, and using simple, thoughtful solutions to create measurable business impact.";

  const skillsHTML = skills.length
    ? `<ul class="g-list">${skills.map((s) => `<li>${esc(s)}</li>`).join("")}</ul>`
    : "";

  // Per-entry timeline: each .g-exp draws its own connector so it never spans pages
  const expHTML = experience.length
    ? `<div class="g-timeline">
        ${experience
          .map(
            (e) => `
          <div class="g-exp g-avoid-break">
            <div class="g-dot"></div>
            <div class="g-exp-content">
              <header class="g-exp-head">
                <strong>${esc(e.role || "")}</strong>
                <span class="g-dates">${esc(e.start || "")} – ${esc(e.end || "Present")}</span>
              </header>
              <div class="g-meta">${esc(line([e.company, e.city]))}</div>
              ${
                Array.isArray(e.bullets) && e.bullets.length
                  ? `<ul class="g-list">${e.bullets.map((b) => `<li>${esc(b)}</li>`).join("")}</ul>`
                  : ""
              }
            </div>
          </div>`
          )
          .join("")}
      </div>`
    : '<p class="g-muted">No experience provided.</p>';

  const eduHTML = education.length
    ? education
        .map(
          (ed) => `
        <div class="g-edu g-avoid-break">
          <strong>${esc(ed.degree || ed.certificate || "")}</strong>${ed.field ? `, ${esc(ed.field)}` : ""}
          <div>${esc(ed.school || "")}${ed.endYear ? ` | ${esc(ed.endYear)}` : ""}</div>
        </div>`
        )
        .join("")
    : "";

  const achHTML = achievements.length
    ? `<ul class="g-list">${achievements.map((a) => `<li>${esc(a)}</li>`).join("")}</ul>`
    : "";

  const certsHTML = (certifications || []).filter(c => c.name || c.issuer || c.year).length
    ? `<ul class="g-list">${certifications
        .filter(c => c.name || c.issuer || c.year)
        .map((c) => {
          const bits = [c.name, c.issuer ? `(${c.issuer})` : "", c.year].filter(Boolean).join(" ");
          return `<li>${esc(bits)}</li>`;
        })
        .join("")}</ul>`
    : "";

  const refsHTML = (references || []).filter(r => r.name || r.email || r.phone || r.title || r.company).length
    ? `<div class="g-refs">
        ${(references || [])
          .filter(r => r.name || r.email || r.phone || r.title || r.company)
          .map(
            (r) => `
            <div class="g-ref-item g-avoid-break">
              <div class="g-ref-name"><strong>${esc(r.name || "")}</strong></div>
              <div class="g-dim">${esc([r.title, r.company].filter(Boolean).join(" • "))}</div>
              <div class="g-dim">${esc([r.email, r.phone].filter(Boolean).join(" • "))}</div>
            </div>`
          )
          .join("")}
      </div>`
    : "";

  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <link href="https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@400;600;700&display=swap" rel="stylesheet">
  <style>
    :root { 
      --ink:#1a1a1a; 
      --dim:#555; 
      --bg:#fff; 
      --accent:#1ba97f; 
      --sidebar:#f5f9f8; 
      --line:#e6e8ee;
    }
    /* Real print margins so content never hugs edges */
    @page { size: A4; margin: 18mm 16mm 20mm 16mm; }

    html, body { margin:0; padding:0; background:var(--bg); }
    body { font-family:'Source Sans Pro', system-ui, -apple-system, Segoe UI, Roboto, 'Helvetica Neue', Arial, sans-serif; color:var(--ink); }

    /* Header (not fixed) */
    .g-header {
      width:100%;
      padding: 18px 20px;
      background: linear-gradient(90deg,#00695c,#26a69a);
      color:#fff;
      text-align:right;
      margin-bottom: 14px;
    }
    .g-header h1 { margin:0; font-size:28px; font-weight:700; }
    .g-header p { margin:4px 0 0; font-size:16px; font-weight:600; opacity:.95; }

    .g-layout { display:grid; grid-template-columns: 250px 1fr; gap: 18px; }
    .g-sidebar { background:var(--sidebar); padding:18px; border:1px solid var(--line); border-radius:10px; }
    .g-main { padding: 0 2px; }

    h2 { 
      font-size:13px; text-transform:uppercase; letter-spacing:.09em; font-weight:700; 
      color:var(--accent); margin:18px 0 8px;
      break-after: avoid-page; page-break-after: avoid;
    }
    .g-section { margin-bottom:18px; }

    .g-list { margin:6px 0 0 18px; padding:0; font-size:13px; }
    .g-list li { margin-bottom:4px; }

    .g-summary { font-size:14px; line-height:1.55; margin-top:6px; }
    .g-summary p { margin:0 0 10px; }

    /* Per-entry timeline */
    .g-timeline { position:relative; }
    .g-exp { position:relative; padding-left:26px; margin-bottom:20px; }
    .g-dot {
      position:absolute; left:8px; top:14px; width:10px; height:10px;
      background:var(--accent); border-radius:50%;
    }
    /* The connector belongs to the entry, so it ends at the entry bottom and never crosses a page */
    .g-exp::after {
      content:""; position:absolute; left:12px; top:14px; bottom:-8px; width:2px; background:var(--accent); opacity:.6;
    }
 
    .g-exp-head { display:flex; justify-content:space-between; font-size:14px; font-weight:700; }
    .g-dates { color:var(--dim); font-size:13px; }
    .g-meta { font-size:13px; color:var(--dim); margin-bottom:4px; }

    .g-muted { color:var(--dim); font-size:13px; }

    /* References grid */
    .g-refs { display:grid; gap:8px; }
    .g-ref-name { font-size:13.5px; }

    /* Pagination hygiene */
    .g-avoid-break { break-inside: avoid; page-break-inside: avoid; }
    .g-column-buffer { height: 6mm; }
  </style>
</head>
<body>
  <div class="g-header">
    <h1>${esc(name)}</h1>
    <p>${esc(career)}</p>
  </div>

  <div class="g-layout">
    <aside class="g-sidebar">
      <h2>Contact</h2>
      <div class="g-section">
        <div>${esc(phone)}</div>
        <div>${esc(email)}</div>
        <div>${esc(location)}</div>
      </div>

      ${eduHTML ? `<h2>Education</h2><div class="g-section">${eduHTML}</div>` : ""}

      ${skillsHTML ? `<h2>Skills</h2><div class="g-section">${skillsHTML}</div>` : ""}

      ${achHTML ? `<h2>Achievements</h2><div class="g-section">${achHTML}</div>` : ""}

      ${certsHTML ? `<h2>Certifications</h2><div class="g-section">${certsHTML}</div>` : ""}

      ${refsHTML ? `<h2>References</h2><div class="g-section">${refsHTML}</div>` : ""}

      <div class="g-column-buffer" aria-hidden="true"></div>
    </aside>

    <main class="g-main">
      <h2>Profile</h2>
      <div class="g-summary">
        ${summaryText.split(/\n{2,}/).map((p) => `<p>${esc(p)}</p>`).join("")}
      </div>

      <h2>Relevant Experience</h2>
      ${expHTML}

      <div class="g-column-buffer" aria-hidden="true"></div>
    </main>
  </div>
</body>
</html>`;
}

/* ---------- Cover Letter layout ---------- */
function renderLetter(profile = {}, body = "") {
  const { name = "", title = "", email = "", phone = "", location = "" } = profile;
  const career = title || "Professional";

  const paragraphs = String(body || "")
    .split(/\n{2,}/)
    .map((p) => `<p>${esc(p).replace(/\n/g, "<br>")}</p>`)
    .join("");

  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <link href="https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@400;600;700&display=swap" rel="stylesheet">
  <style>
    :root { --ink:#1a1a1a; --dim:#555; --accent:#1ba97f; --line:#e6e8ee; }
    @page { size: A4; margin: 20mm 18mm 22mm 18mm; }
    html, body { margin:0; padding:0; background:#fff; }
    body { font-family:'Source Sans Pro', system-ui, -apple-system, Segoe UI, Roboto, 'Helvetica Neue', Arial, sans-serif; color:var(--ink); }

    .g-header {
      width:100%; padding:20px;
      background:linear-gradient(90deg,#00695c,#26a69a);
      color:#fff; text-align:right;
      border-radius:10px;
      margin-bottom: 14px;
    }
    .g-header h1 { margin:0; font-size:28px; font-weight:700; }
    .g-header p { margin:4px 0 0; font-size:16px; font-weight:600; opacity:.95; }
    .g-contact { margin-top:8px; font-size:13px; color:#eefaf7; }

    .g-letter { font-size:14px; line-height:1.6; }
    .g-letter p { margin:0 0 12px; }
  </style>
</head>
<body>
  <div class="g-header">
    <h1>${esc(name)}</h1>
    <p>${esc(career)}</p>
    <div class="g-contact">${esc(line([phone, email, location]))}</div>
  </div>
  <div class="g-letter">
    ${paragraphs || "<p>Write your letter content…</p>"}
    <p>Sincerely,</p>
    <p>${esc(name)}</p>
  </div>
</body>
</html>`;
}

export default function genius({ docType, profile, body }) {
  return docType === "cover-letter" ? renderLetter(profile, body) : renderCV(profile);
}
