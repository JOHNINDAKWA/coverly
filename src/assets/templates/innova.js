// src/templates/innova.js
// Innova template — original L/R feel, fixed top bar, safe page margins, optional sections

const esc = (s) =>
  String(s || "").replace(
    /[&<>"']/g,
    (m) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[
        m
      ])
  );

const line = (arr) => (arr || []).filter(Boolean).join(" • ");

function renderCV(profile = {}) {

  // inside src/templates/innova.js, near the top of each render function
const ORIGIN = (typeof window !== 'undefined' ? window.location.origin : '');
const ICO_PHONE    = `${ORIGIN}/icons/phone.svg`;
const ICO_MAIL     = `${ORIGIN}/icons/mail.svg`;
const ICO_LOCATION = `${ORIGIN}/icons/location.svg`;
const ICO_LINKEDIN = `${ORIGIN}/icons/linkedin.svg`;

  const {
    name = "",
    title = "Professional",
    email = "",
    phone = "",
    location = "",
    linkedin = "",
    skills = [],
    experience = [],
    education = [],
    achievements = [],
    certifications = [], // [{name, issuer, year}]
    references = [], // [{name, title, company, email, phone}]
    summary = "",
  } = profile;

  const [firstName, ...lastParts] = String(name).trim().split(" ");
  const lastName = lastParts.join(" ");

  const summaryText =
    summary ||
    "Results-driven professional with a track record of delivering reliable outcomes in fast-moving environments. Comfortable working across teams, translating goals into clear plans, and maintaining a high bar for quality and detail.\n\nI enjoy solving practical problems, learning quickly, and using simple, thoughtful solutions to create measurable impact. I’m motivated by ownership, collaboration, and building things that people actually use.";

  const skillsHTML = skills.length
    ? `<ul class="pill-list">${skills
        .map((s) => `<li>${esc(s)}</li>`)
        .join("")}</ul>`
    : "";

  const eduHTML = education.length
    ? education
        .map(
          (e) => `
        <div class="edu-item avoid-break">
          <strong>${esc(e.degree || e.certificate || "")}</strong>
          <div>${esc(e.school || "")}</div>
          <div class="dim">${esc(
            [e.field, [e.startYear, e.endYear].filter(Boolean).join("–")]
              .filter(Boolean)
              .join(" • ")
          )}</div>
        </div>`
        )
        .join("")
    : "";

  const achHTML = achievements.length
    ? `<ul class="list">${achievements
        .map((a) => `<li>${esc(a)}</li>`)
        .join("")}</ul>`
    : "";

  const certsHTML = (certifications || []).filter(
    (c) => c.name || c.issuer || c.year
  ).length
    ? `<ul class="list">${certifications
        .filter((c) => c.name || c.issuer || c.year)
        .map((c) => {
          const bits = [c.name, c.issuer ? `(${c.issuer})` : "", c.year]
            .filter(Boolean)
            .join(" ");
          return `<li>${esc(bits)}</li>`;
        })
        .join("")}</ul>`
    : "";


  const refsHTML = (references || []).filter(
    (r) => r.name || r.email || r.phone || r.title || r.company
  ).length
    ? `<div class="refs">
        ${(references || [])
          .filter((r) => r.name || r.email || r.phone || r.title || r.company)
          .map(
            (r) => `
            <div class="ref-item avoid-break">
              <div class="ref-name"><strong>${esc(r.name || "")}</strong></div>
              <div class="dim">${esc(
                [r.title, r.company].filter(Boolean).join(" • ")
              )}</div>
              <div class="ref-contact dim">${esc(
                [r.email, r.phone].filter(Boolean).join(" • ")
              )}</div>
            </div>`
          )
          .join("")}
      </div>`
    : "";

  const expHTML = experience.length
    ? experience
        .map(
          (e) => `
      <article class="exp avoid-break">
        <header>
          <h3>${esc(e.role || "")}</h3>
          <div class="meta">${esc(line([e.company, e.city]))}</div>
          <div class="dates">${esc(line([e.start, e.end || "Present"]))}</div>
        </header>
        ${
          Array.isArray(e.bullets) && e.bullets.length
            ? `<ul class="bullets">${e.bullets
                .map((b) => `<li>${esc(b)}</li>`)
                .join("")}</ul>`
            : ""
        }
      </article>`
        )
        .join("")
    : '<p class="muted">Add experience to showcase impact.</p>';

  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --ink:#121212; --dim:#616161; --line:#e6e8ee; --theme:#c7a66b;
    }

    /* Top/bottom margins on EVERY page. L/R = 0 to keep original inner padding look. */
    @page { size:A4; margin: 14mm 0 16mm 0; }

    html, body { margin:0; padding:0; background:#fff; }
    body { font-family:'Montserrat', system-ui, -apple-system, Segoe UI, Roboto, 'Helvetica Neue', Arial, sans-serif; color:var(--ink); }

    /* Fixed bars – top stays glued to very top; bottom gives a subtle footer edge on each page */
    .top-bar { position: fixed; left: 0; width: 100%; height: 10px; background: linear-gradient(90deg, var(--theme), #d8c089); }
    .top-bar { top: 0; }

    /* Content container keeps the ORIGINAL left/right padding feel */
    .doc { padding: 0 28px 40px; } /* L/R 28px like your original, plus comfy bottom */
    
    .header { text-align:center; padding: 26px 0 16px; }
    .h-name { font-size:28px; margin:0; font-weight:700; }
    .h-name span { color:var(--theme); font-weight:600; }
    .title { font-size:14px; color:var(--dim); margin-top:4px; }

    .contacts {
      display:grid; grid-template-columns:repeat(4,1fr);
      gap:10px; margin:16px 0 20px; text-align:center; font-size:13px;
    }
    .contact-item svg { width:16px; height:16px; margin:0 auto 4px; display:block; }
.ci { width:16px; height:16px; color:#c7a66b; display:block; margin:0 auto 4px; }




    .contact-item { color:var(--ink); }

    .layout { display:grid; grid-template-columns: 2fr 1fr; gap:28px; }

    h2 {
      font-size:13px; letter-spacing:.10em; text-transform:uppercase;
      border-bottom:1px solid var(--line); padding-bottom:6px; margin:18px 0 10px;
      break-after: avoid-page; page-break-after: avoid;
    }

    .summary { font-size:13.5px; color:var(--ink); line-height:1.55; }
    .summary p { margin:0 0 10px; }

    .exp { margin-bottom:14px; }
    .exp h3 { margin:0; font-size:15px; font-weight:600; }
    .exp .meta { font-size:12.5px; color:var(--dim); margin-top:2px; }
    .exp .dates { font-size:12.5px; font-weight:600; color:var(--theme); margin-top:2px; }
    .bullets { margin:6px 0 0 18px; font-size:13px; }
    .bullets li { margin-bottom:4px; }

    .pill-list { display:flex; flex-wrap:wrap; gap:6px; padding:0; list-style:none; }
    .pill-list li { border:1px solid var(--line); border-radius:999px; padding:4px 10px; font-size:12.5px; }

    .edu-item { margin-bottom:10px; font-size:13px; }
    .edu-item .dim { font-size:12px; color:var(--dim); }

    .list { margin:0; padding-left:18px; font-size:13px; }
    .refs { display:grid; gap:8px; }
    .ref-name { font-size:13px; }
    .ref-contact { font-size:12.5px; }
    .muted { color:var(--dim); }

    /* Pagination hygiene */
    .avoid-break { break-inside: avoid; page-break-inside: avoid; }
    .column-end-gap { height: 6mm; } /* gentle buffer near page bottoms */
  </style>
</head>
<body>
  <div class="top-bar"></div>

  <div class="doc">
    <header class="header">
      <h1 class="h-name">${esc(firstName)} <span>${esc(lastName)}</span></h1>
      <div class="title">${esc(title)}</div>

<div class="contacts">
  <div class="contact-item">
    <img class="ci" src="${ICO_PHONE}" alt="" width="16" height="16" crossOrigin="anonymous" />
    ${esc(phone)}
  </div>
  <div class="contact-item">
    <img class="ci" src="${ICO_MAIL}" alt="" width="16" height="16" crossOrigin="anonymous" />
    ${esc(email)}
  </div>
  <div class="contact-item">
    <img class="ci" src="${ICO_LOCATION}" alt="" width="16" height="16" crossOrigin="anonymous" />
    ${esc(location)}
  </div>
  ${
    String(linkedin || '').trim()
      ? `<div class="contact-item">
           <img class="ci" src="${ICO_LINKEDIN}" alt="" width="16" height="16" crossOrigin="anonymous" />
           ${esc(String(linkedin).trim())}
         </div>`
      : ``
  }
</div>




    </header>

    <main class="layout">
      <section>
        <h2>Professional Profile</h2>
        <div class="summary">
          ${summaryText
            .split(/\n{2,}/)
            .map((p) => `<p>${esc(p)}</p>`)
            .join("")}
        </div>

        <h2>Work Experience</h2>
        ${expHTML}
        <div class="column-end-gap" aria-hidden="true"></div>
      </section>

      <aside>
        <h2>Skills</h2>${skillsHTML}
        <h2>Education</h2>${eduHTML}
        ${achHTML ? `<h2>Achievements</h2>${achHTML}` : ""}
        ${certsHTML ? `<h2>Certifications</h2>${certsHTML}` : ""}
        ${refsHTML ? `<h2>References</h2>${refsHTML}` : ""}
        <div class="column-end-gap" aria-hidden="true"></div>
      </aside>
    </main>
  </div>
</body>
</html>`;
}

function renderLetter(profile = {}, body = "") {

  // inside src/templates/innova.js, near the top of each render function
const ORIGIN = (typeof window !== 'undefined' ? window.location.origin : '');
const ICO_PHONE    = `${ORIGIN}/icons/phone.svg`;
const ICO_MAIL     = `${ORIGIN}/icons/mail.svg`;
const ICO_LOCATION = `${ORIGIN}/icons/location.svg`;
const ICO_LINKEDIN = `${ORIGIN}/icons/linkedin.svg`;



  const {
    name = "",
    title = "Professional",
    email = "",
    phone = "",
    location = "",
    linkedin = "",
  } = profile;
  const [firstName, ...lastParts] = String(name).trim().split(" ");
  const lastName = lastParts.join(" ");

  const paragraphs = String(body || "")
    .split(/\n{2,}/)
    .map((p) => `<p>${esc(p).replace(/\n/g, "<br>")}</p>`)
    .join("");


  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&display=swap" rel="stylesheet">
  <style>
    :root { --ink:#121212; --dim:#616161; --line:#e6e8ee; --theme:#c7a66b; }
    @page { size:A4; margin: 16mm 0 18mm 0; }
    html, body { margin:0; padding:0; background:#fff; }
    body { font-family:'Montserrat', system-ui, -apple-system, Segoe UI, Roboto, 'Helvetica Neue', Arial, sans-serif; color:var(--ink); }

    .top-bar { position: fixed; left: 0; width: 100%; height: 10px; background: linear-gradient(90deg, var(--theme), #d8c089); }
    .top-bar { top:0; } .bottom-bar { bottom:0; }

    .doc { padding: 0 28px 40px; }

    .header { text-align:center; padding: 26px 0 16px; }
    .h-name { font-size:28px; margin:0; font-weight:700; }
    .h-name span { color:var(--theme); font-weight:600; }
    .title { font-size:14px; color:var(--dim); margin-top:4px; }

    .contacts { display:grid; grid-template-columns:repeat(4,1fr); gap:10px; margin:16px 0 20px; text-align:center; font-size:13px; }
.ci { width:16px; height:16px; color:#c7a66b; display:block; margin:0 auto 4px; }




    .letter { line-height:1.6; font-size:14px; }
    .letter p { margin:0 0 12px; }
    .signature { margin-top:26px; font-weight:600; }
  </style>
</head>
<body>
  <div class="top-bar"></div>

  <div class="doc">
    <header class="header">
      <h1 class="h-name">${esc(firstName)} <span>${esc(lastName)}</span></h1>
      <div class="title">${esc(title)}</div>



<div class="contacts">
  <div class="contact-item">
    <img class="ci" src="${ICO_PHONE}" alt="" width="16" height="16" crossOrigin="anonymous" />
    ${esc(phone)}
  </div>
  <div class="contact-item">
    <img class="ci" src="${ICO_MAIL}" alt="" width="16" height="16" crossOrigin="anonymous" />
    ${esc(email)}
  </div>
  <div class="contact-item">
    <img class="ci" src="${ICO_LOCATION}" alt="" width="16" height="16" crossOrigin="anonymous" />
    ${esc(location)}
  </div>
  ${
    String(linkedin || '').trim()
      ? `<div class="contact-item">
           <img class="ci" src="${ICO_LINKEDIN}" alt="" width="16" height="16" crossOrigin="anonymous" />
           ${esc(String(linkedin).trim())}
         </div>`
      : ``
  }
</div>




    </header>

    <main class="letter">
      ${paragraphs || "<p>Write your letter content…</p>"}
      <div class="signature">
        <p>Sincerely,</p>
        <p>${esc(name)}</p>
      </div>
    </main>
  </div>

  <div class="bottom-bar"></div>
</body>
</html>`;
}

export default function innova({ docType, profile, body }) {
  return docType === "cover-letter"
    ? renderLetter(profile, body)
    : renderCV(profile);
}
