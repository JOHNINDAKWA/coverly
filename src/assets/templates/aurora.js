// src/templates/aurora.js
// Aurora template — airy left gutter, slimmer sidebar, calm type, standout summary.
// Exports a single function: ({ docType, profile, body }) => HTML string

const esc = (s) =>
  String(s || "").replace(/[&<>"']/g, (m) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m])
  );

const line = (arr) => (arr || []).filter(Boolean).join(" • ");

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
    experience = [],
    education = [],
    achievements = [],
    certifications = [], // {name, issuer, year}
    references = [],     // {name, title, company, email, phone}
  } = profile;

  const career = title || "Professional";
  const summaryText =
    (summary || "").trim() ||
    "Professional with hands-on experience delivering measurable outcomes across fast-paced environments. Known for ownership, clarity, and a bias for impact. Skilled at translating goals into clear plans, collaborating across teams, and shipping thoughtful solutions that users love.";

  const skillsHTML = skills?.length
    ? `<ul class="tag-list">${skills.map((s) => `<li class="tag">${esc(s)}</li>`).join("")}</ul>`
    : "";

  const eduHTML = (education || [])
    .filter((ed) => ed.school || ed.degree || ed.field)
    .map(
      (ed) => `
      <li>
        <div class="edu-title"><strong>${esc(ed.degree || ed.certificate || "")}</strong>${
        ed.field ? ` — ${esc(ed.field)}` : ""
      }</div>
        <div class="dim">${esc(line([ed.school, [ed.startYear, ed.endYear].filter(Boolean).join("–")]))}</div>
      </li>`
    )
    .join("");

  const achHTML = (achievements || []).length
    ? `<ul class="bullets">${achievements.map((a) => `<li>${esc(a)}</li>`).join("")}</ul>`
    : "";

  const certs = (certifications || []).filter((c) => c.name || c.issuer || c.year);
  const certsHTML = certs.length
    ? `<ul class="bullets">
        ${certs
          .map((c) => {
            const bits = [c.name, c.issuer ? `(${c.issuer})` : "", c.year].filter(Boolean).join(" ");
            return `<li>${esc(bits)}</li>`;
          })
          .join("")}
       </ul>`
    : "";

  const refs = (references || []).filter((r) => r.name || r.email || r.phone || r.title || r.company);
  const refsHTML = refs.length
    ? `<div class="ref-grid">
        ${refs
          .map(
            (r) => `
            <article class="ref-card avoid-break">
              <div class="ref-name">${esc(r.name || "")}</div>
              <div class="ref-meta dim">${esc(line([r.title, r.company]))}</div>
              <div class="ref-contact">
                ${r.email ? `<div>${esc(r.email)}</div>` : ""}
                ${r.phone ? `<div>${esc(r.phone)}</div>` : ""}
              </div>
            </article>`
          )
          .join("")}
       </div>`
    : "";

  const jobs = (experience || []).filter((j) => j.role || j.company || (j.bullets || []).length);
  const expHTML = jobs.length
    ? `<div class="timeline">
        ${jobs
          .map(
            (j, i) => `
          <div class="tl-item avoid-break">
            <div class="tl-dot"></div>
            ${i < jobs.length - 1 ? `<div class="tl-stem"></div>` : ""}
            <header class="tl-head">
              <div class="tl-title">
                <strong>${esc(j.role || "")}</strong>
                ${j.company ? ` • <span class="dim">${esc(j.company)}</span>` : ""}
                ${j.city ? ` • <span class="dim">${esc(j.city)}</span>` : ""}
              </div>
              <div class="tl-dates dim">${esc(line([j.start, j.end || "Present"]))}</div>
            </header>
            ${
              Array.isArray(j.bullets) && j.bullets.length
                ? `<ul class="bullets">${j.bullets.map((b) => `<li>${esc(b)}</li>`).join("")}</ul>`
                : ""
            }
          </div>`
          )
          .join("")}
       </div>`
    : '<p class="muted">Add experience to showcase impact.</p>';

  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet">
  <style>
    :root{
      --ink:#121216; --dim:#56606a; --muted:#7a8791; --line:#e7edf1;
      --teal:#0f766e; --teal-6:#0f766e0f; --teal-12:#0f766e1f;
    }

    /* More left whitespace; slightly slimmer right column on paper */
    @page { size: A4; margin: 22mm 15mm 20mm 26mm; }

    html, body { margin:0; padding:0; background:#fff; }
    body {
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial;
      color: var(--ink);
      font-size: 12px; /* calmer overall scale */
    }

    /* Document container (gives a hair of inner left gutter too) */
    .doc { padding: 0 2mm 0 1mm; }

    /* Header */
    .doc-header { border-bottom:1px solid var(--line); padding:0 0 9px 0; margin-bottom:12px; }
    .doc-name { margin:0; font-weight:800; letter-spacing:-0.02em; font-size:20px; }
    .doc-title { color:#3a474d; font-weight:600; margin-top:2px; }
    .doc-contact { margin-top:5px; color:#495b62; font-weight:500; }

    /* Grid: left has more room, right slightly narrower */
    .grid { display:grid; grid-template-columns: 1.45fr .7fr; gap:16px; }

    /* Section headings */
    h3 {
      font-size:.8rem; text-transform:uppercase; letter-spacing:.14em;
      color:var(--teal); margin:14px 0 6px; font-weight:800;
    }
    .doc-section { margin-top:14px; }
    .muted { color: var(--muted); }

    /* Summary card */
    .summary-card {
      background: linear-gradient(0deg,#fff,#fff), var(--teal-6);
      border-left:3px solid var(--teal);
      border-radius:10px;
      padding:10px 12px;
      box-shadow: 0 2px 12px var(--teal-12);
    }
    .lead { margin:0; color:#2d4045; line-height:1.52; }

    /* Lists */
    .bullets { margin:0; padding:0 0 0 16px; }
    .bullets li { margin:3px 0; line-height:1.45; }

    /* Skills tags */
    .tag-list { display:flex; flex-wrap:wrap; gap:7px; padding:0; margin:0; list-style:none; }
    .tag {
      display:inline-flex; align-items:center; padding:5px 9px; border-radius:999px;
      background:#f5f8f8; color:#083f3e; font-weight:600; border:1px solid #e6efef; font-size:12px;
    }

    /* Timeline (per-entry — never crosses pages) */
    .timeline { position:relative; margin-left:4px; padding-left:12px; border-left:2px solid var(--teal-12); }
    .tl-item { position:relative; margin:8px 0; }
    .tl-dot { position:absolute; left:-18px; top:6px; width:8px; height:8px; border-radius:50%; background:var(--teal); }
    .tl-stem { position:absolute; left:-14px; top:12px; bottom:-6px; width:2px; background:var(--teal-12); }
    .tl-head { display:flex; justify-content:space-between; gap:10px; }
    .tl-title { font-weight:700; }
    .tl-dates { white-space:nowrap; color:#5a6a70; }

    /* Education */
    .edu-list { margin:0; padding:0; list-style:none; }
    .edu-list li { margin:5px 0 9px; }
    .edu-title { font-weight:700; }

    /* References */
    .ref-grid { display:grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap:9px; }
    .ref-card { border:1px solid #eef2f2; border-radius:10px; padding:9px; background:#fcfefe; box-shadow:0 1px 6px rgba(0,0,0,.03); }
    .ref-name { font-weight:700; }
    .ref-meta { margin:2px 0 6px; color:#617177; }
    .ref-contact { display:grid; gap:3px; color:#2f3a3e; font-size:12px; }

    /* Pagination hygiene */
    .avoid-break { break-inside: avoid; page-break-inside: avoid; }
    .column-buffer { height:6mm; }
  </style>
</head>
<body>
  <article class="doc">
    <header class="doc-header">
      <h1 class="doc-name">${esc(name || "Your Name")}</h1>
      <div class="doc-title">${esc(career)}</div>
      <div class="doc-contact">${esc(line([email, phone, location]))}${
        String(linkedin || "").trim() ? ` • ${esc(String(linkedin).trim())}` : ""
      }</div>
    </header>

    <div class="grid">
      <section>
        <h3>Professional Summary</h3>
        <div class="summary-card">
          <p class="lead">${esc(summaryText)}</p>
        </div>

        <section class="doc-section">
          <h3>Experience</h3>
          ${expHTML}
        </section>

        <div class="column-buffer" aria-hidden="true"></div>
      </section>

      <aside>
        ${skillsHTML ? `<h3>Skills</h3>${skillsHTML}` : ""}

        ${
          eduHTML
            ? `<section class="doc-section">
                 <h3>Education</h3>
                 <ul class="edu-list">${eduHTML}</ul>
               </section>`
            : ""
        }

        ${
          achHTML
            ? `<section class="doc-section">
                 <h3>Achievements</h3>${achHTML}
               </section>`
            : ""
        }

        ${
          certsHTML
            ? `<section class="doc-section">
                 <h3>Certifications</h3>${certsHTML}
               </section>`
            : ""
        }

        ${
          refsHTML
            ? `<section class="doc-section">
                 <h3>References</h3>${refsHTML}
               </section>`
            : ""
        }
      </aside>
    </div>
  </article>
</body>
</html>`;
}

function renderLetter(profile = {}, body = "") {
  const {
    name = "",
    title = "",
    email = "",
    phone = "",
    location = "",
  } = profile;

  const career = title || "Professional";
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
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet">
  <style>
    :root{ --ink:#121216; --dim:#56606a; --line:#e7edf1; --teal:#0f766e; --teal-12:#0f766e1f; }
    /* Keep the same generous left gutter */
    @page { size: A4; margin: 24mm 18mm 22mm 28mm; }
    html, body { margin:0; padding:0; background:#fff; }
    body {
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial;
      color: var(--ink);
      font-size: 12px;
      line-height: 1.55;
    }

    .head {
      border-bottom:1px solid var(--line);
      padding:0 0 8px 0; margin-bottom:14px;
    }
    .name { margin:0; font-size:20px; font-weight:800; letter-spacing:-.02em; }
    .career { color:#3a474d; font-weight:600; margin-top:2px; }
    .contact { margin-top:6px; color:#495b62; }

    .body { margin-top:6px; }
    .body p { margin:0 0 12px; }
    .sign { margin-top:20px; font-weight:700; }
  </style>
</head>
<body>
  <header class="head">
    <h1 class="name">${esc(name || "Your Name")}</h1>
    <div class="career">${esc(career)}</div>
    <div class="contact">${esc(line([email, phone, location]))}</div>
  </header>

  <main class="body">
    ${paragraphs || "<p>Write your letter content…</p>"}
    <div class="sign">
      <p>Sincerely,</p>
      <p>${esc(name)}</p>
    </div>
  </main>
</body>
</html>`;
}

export default function aurora({ docType, profile, body }) {
  return docType === "cover-letter" ? renderLetter(profile, body) : renderCV(profile);
}
