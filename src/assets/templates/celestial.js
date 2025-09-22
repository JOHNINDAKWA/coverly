// src/templates/celestial.js
// Renders a CV OR a Cover Letter depending on { docType }
// Uses inline CSS for ATS/PDF friendliness.

const esc = (s) =>
  String(s || '').replace(/[&<>"']/g, (m) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m])
  );
const line = (arr) => (arr || []).filter(Boolean).join(' • ');

/* ---------- CV layout ---------- */
function renderCV(profile = {}) {
  const {
    name = '',
    title = 'Professional',
    email = '',
    phone = '',
    location = '',
    skills = [],
    experience = [],
    education = [],
    summary = '',
  } = profile;

  const summaryText = esc(
    summary ||
      'Results-driven professional with a track record of delivering measurable impact. Strong collaboration, problem-solving, and communication skills. Passionate about quality work and learning fast.'
  );

  const skillsHTML = skills.length
    ? `<ul class="skills">${skills.map((s) => `<li>${esc(s)}</li>`).join('')}</ul>`
    : '';

  const expHTML = experience.length
    ? experience
        .map(
          (e) => `
      <article class="exp">
        <header>
          <h3>${esc(e.role || '')}</h3>
          <div class="meta">${esc(line([e.company, e.city]))}</div>
          <div class="dates">${esc(line([e.start, e.end || 'Present']))}</div>
        </header>
        ${
          Array.isArray(e.bullets) && e.bullets.length
            ? `<ul class="bullets">
                ${e.bullets.map((b) => `<li>${esc(b)}</li>`).join('')}
              </ul>`
            : ''
        }
      </article>`
        )
        .join('')
    : '<p class="muted">Add experience to showcase impact.</p>';

  const eduHTML = education.length
    ? education
        .map(
          (ed) => `
      <article class="edu">
        <header>
          <h3>${esc(ed.degree || '')}</h3>
          <div class="meta">${esc(line([ed.school, ed.field]))}</div>
          <div class="dates">${esc(line([ed.startYear, ed.endYear || 'Present']))}</div>
        </header>
      </article>`
        )
        .join('')
    : '<p class="muted">Add your education background.</p>';

  return `<!doctype html>
<html><head><meta charset="utf-8" />
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style>
  :root {
    --ink: #0f172a;
    --dim: #667085;
    --line: #e2e8f0;
    --header-gradient: linear-gradient(135deg, #01a1a1, #6366f1);
    --footer-gradient: linear-gradient(135deg, #6366f1, #01a1a1);
  }
  @page { margin: 0; }
  * { box-sizing: border-box; }
  body {
    font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;
    color: var(--ink);
    line-height: 1.45;
    margin: 0;
    padding: 0;
    background: #fff;
  }
  .page-container {
    position: relative;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    padding: 0 24mm 20mm; /* bottom padding so footer won’t overlap */
  }
.header-bg {
  position: relative;
  width: 100vw;         /* full viewport width */
  margin-left: -24mm;   /* cancel the page padding */
  margin-right: -24mm;  /* cancel the page padding */
  height: 120px;
  background: var(--header-gradient);
  color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-left: 24mm;   /* keep text aligned with content */
  padding-right: 24mm;  /* keep symmetry */
}

  .header-bg h1 {
    margin: 0;
    font-size: 28px;
    font-weight: 800;
  }
  .header-bg p {
    margin: 4px 0 0;
    font-size: 16px;
    font-weight: 500;
  }
  .footer-bg {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 60px;
    background: var(--footer-gradient);
    z-index: -1;
  }
  .main-content {
    flex-grow: 1;
    margin-top: 20px;
  }
  .contact {
    color: var(--dim);
    font-weight: 500;
    margin-bottom: 12px;
  }
  h2 {
    font-size: 13px;
    letter-spacing: .12em;
    text-transform: uppercase;
    color: #01a1a1;
    margin: 16px 0 8px;
    font-weight: 700;
  }
  .sec {
    padding-top: 8px;
    border-top: 1px solid var(--line);
    margin-top: 10px;
  }
  .summary {
    margin: 6px 0 10px;
    color: #374151;
    line-height: 1.55;
  }
  .skills {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin: 0;
    padding: 0;
    list-style: none;
  }
  .skills li {
    background-color: #f0f4f8;
    border-radius: 999px;
    padding: 6px 10px;
    font-weight: 600;
    font-size: 14px;
  }
  .exp, .edu { padding: 8px 0; }
  .exp header, .edu header {
    display: grid;
    grid-template-columns: 1fr auto;
    grid-template-areas: "role dates" "meta dates";
    gap: 2px;
  }
  .exp h3, .edu h3 {
    grid-area: role;
    margin: 0;
    font-size: 16px;
    font-weight: 700;
  }
  .exp .meta, .edu .meta {
    grid-area: meta;
    color: var(--dim);
    font-weight: 500;
  }
  .exp .dates, .edu .dates {
    grid-area: dates;
    color: var(--dim);
    font-weight: 600;
  }
  .bullets {
    margin: 6px 0 0 18px;
  }
  .bullets li { margin: 3px 0; }
  .muted { color: var(--dim); }
</style>
</head>
<body>
  <div class="page-container">
    <div class="header-bg">
      <h1>${esc(name)}</h1>
      <p>${esc(title)}</p>
    </div>

    <main class="main-content">
      <div class="contact">${esc(line([email, phone, location]))}</div>

      <section class="sec">
        <h2>Summary</h2>
        <p class="summary">${summaryText}</p>
      </section>

      <section class="sec">
        <h2>Skills</h2>
        ${skillsHTML}
      </section>

      <section class="sec">
        <h2>Experience</h2>
        ${expHTML}
      </section>

      <section class="sec">
        <h2>Education</h2>
        ${eduHTML}
      </section>
    </main>

    <div class="footer-bg"></div>
  </div>
</body></html>`;
}

/* ---------- Cover Letter layout ---------- */
function renderLetter(profile = {}, body = '') {
  const { name = '', title = 'Professional', email = '', phone = '', location = '' } = profile;
  const contact = line([email, phone, location]);
  const paragraphs = String(body || '')
    .split(/\n{2,}/)
    .map((p) => `<p>${esc(p).replace(/\n/g, '<br>')}</p>`)
    .join('');

  return `<!doctype html>
<html><head><meta charset="utf-8" />
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style>
  :root {
    --ink: #0f172a;
    --dim: #667085;
    --line: #e2e8f0;
    --header-gradient: linear-gradient(135deg, #01a1a1, #6366f1);
    --footer-gradient: linear-gradient(135deg, #6366f1, #01a1a1);
  }
  @page { margin: 0; }
  body {
    font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;
    color: var(--ink);
    line-height: 1.6;
    margin: 0;
    padding: 0;
    background: #fff;
  }
  .page-container {
    position: relative;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    padding: 0 24mm 20mm;
  }
  .header-bg {
    width: 100%;
    height: 120px;
    background: var(--header-gradient);
    color: #fff;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-left: 24mm;
  }
  .header-bg h1 {
    margin: 0;
    font-size: 28px;
    font-weight: 800;
  }
  .header-bg p {
    margin: 4px 0 0;
    font-size: 16px;
    font-weight: 500;
  }
  .footer-bg {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 60px;
    background: var(--footer-gradient);
    z-index: -1;
  }
  .letter-body {
    flex-grow: 1;
    margin-top: 20px;
    line-height: 1.7;
  }
  .contact {
    color: var(--dim);
    font-weight: 500;
    margin-bottom: 20px;
  }
  .letter-body p { margin: 0 0 14px; }
  .signature { margin-top: 40px; font-weight: 600; }
</style>
</head>
<body>
  <div class="page-container">
    <div class="header-bg">
      <h1>${esc(name)}</h1>
      <p>${esc(title)}</p>
    </div>

    <main class="letter-body">
      <div class="contact">${esc(contact)}</div>
      ${paragraphs || '<p>Write your letter content…</p>'}
      <div class="signature">
        <p>Sincerely,</p>
        <p>${esc(name)}</p>
      </div>
    </main>

    <div class="footer-bg"></div>
  </div>
</body>
</html>`;
}

export default function celestial({ docType, profile, body }) {
  return docType === 'cover-letter' ? renderLetter(profile, body) : renderCV(profile);
}
