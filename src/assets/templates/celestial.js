// src/templates/celestial.js
// Renders a CV OR a Cover Letter depending on { docType }
// Uses inline CSS for ATS/PDF friendliness.

const esc = (s) => String(s || '').replace(/[&<>"']/g, m => ({
  '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
}[m]));
const line = (arr) => (arr || []).filter(Boolean).join(' • ');

/* ---------- CV layout ---------- */
function renderCV(profile = {}) {
  const { name = '', email = '', phone = '', location = '', skills = [], experience = [], summary = '' } = profile;

  const summaryText = esc(
    summary ||
    'Results-driven professional with a track record of delivering measurable impact. Strong collaboration, problem-solving, and communication skills. Passionate about quality work and learning fast.'
  );

  const skillsHTML = skills.length
    ? `<ul class="skills">${skills.map(s => `<li>${esc(s)}</li>`).join('')}</ul>` : '';

  const expHTML = experience.length
    ? experience.map(e => `
      <article class="exp">
        <header>
          <h3>${esc(e.role || '')}</h3>
          <div class="meta">${esc(line([e.company, e.city]))}</div>
          <div class="dates">${esc(line([e.start, e.end || 'Present']))}</div>
        </header>
        ${(Array.isArray(e.bullets) && e.bullets.length) ? `
          <ul class="bullets">
            ${e.bullets.map(b => `<li>${esc(b)}</li>`).join('')}
          </ul>` : ''
        }
      </article>`).join('')
    : '<p class="muted">Add experience to showcase impact.</p>';

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
    --brand-dark: #1F1959;
    --brand-light: #52479B;
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
    display: flex;
    flex-direction: column;
    height: 100vh;
    padding-left: 24mm;
    padding-right: 24mm;
    padding-top: 10mm;
    padding-bottom: 10mm;
  }
  .header-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 150px;
    background-color: var(--brand-dark);
    clip-path: polygon(0 0, 100% 0, 100% 50%, 0 100%);
    z-index: -1;
  }
  .footer-bg {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100px;
    background-color: var(--brand-dark);
    clip-path: polygon(0 100%, 100% 100%, 100% 50%, 0 0);
    z-index: -1;
  }
  .logo {
    display: flex;
    align-items: center;
    color: #fff;
    margin-bottom: 20px;
  }
  .logo .symbol {
    width: 40px;
    height: 40px;
    background-color: var(--brand-light);
    border-radius: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 800;
    font-size: 24px;
    margin-right: 10px;
  }
  .logo-text h1 {
    margin: 0;
    font-size: 20px;
    font-weight: 700;
  }
  .logo-text p {
    margin: 0;
    font-size: 12px;
    font-weight: 400;
  }
  .main-content {
    flex-grow: 1;
    padding-top: 50px;
  }
  .name {
    font-weight: 800;
    letter-spacing: -.01em;
    font-size: 28px;
    color: var(--brand-dark);
    margin-bottom: 4px;
  }
  .contact {
    color: var(--dim);
    font-weight: 500;
    margin-bottom: 8px;
  }
  h2 {
    font-size: 13px;
    letter-spacing: .12em;
    text-transform: uppercase;
    color: var(--brand-dark);
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
  .exp {
    padding: 8px 0;
  }
  .exp header {
    display: grid;
    grid-template-columns: 1fr auto;
    grid-template-areas: "role dates" "meta dates";
    gap: 2px;
  }
  .exp h3 {
    grid-area: role;
    margin: 0;
    font-size: 16px;
    font-weight: 700;
  }
  .exp .meta {
    grid-area: meta;
    color: var(--dim);
    font-weight: 500;
  }
  .exp .dates {
    grid-area: dates;
    color: var(--dim);
    font-weight: 600;
  }
  .bullets {
    margin: 6px 0 0 18px;
  }
  .bullets li {
    margin: 3px 0;
  }
  .muted {
    color: var(--dim);
  }
</style>
</head>
<body>
  <div class="header-bg"></div>
  <div class="footer-bg"></div>
  <div class="page-container">
    <header class="logo">
      <div class="symbol">S</div>
      <div class="logo-text">
        <h1>COMPANY LOGO</h1>
        <p>Brand Solutions</p>
      </div>
    </header>
    <main class="main-content">
      <div class="name">${esc(name)}</div>
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
    </main>
  </div>
</body></html>`;
}

/* ---------- Cover Letter layout ---------- */
function renderLetter(profile = {}, body = '') {
  const { name = '', email = '', phone = '', location = '' } = profile;
  const contact = line([email, phone, location]);
  const paragraphs = String(body || '')
    .split(/\n{2,}/)
    .map(p => `<p>${esc(p).replace(/\n/g, '<br>')}</p>`)
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
    --brand-dark: #1F1959;
    --brand-light: #52479B;
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
    display: flex;
    flex-direction: column;
    height: 100vh;
    padding-left: 24mm;
    padding-right: 24mm;
    padding-top: 10mm;
    padding-bottom: 10mm;
  }
  .header-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 150px;
    background-color: var(--brand-dark);
    clip-path: polygon(0 0, 100% 0, 100% 50%, 0 100%);
    z-index: -1;
  }
  .footer-bg {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100px;
    background-color: var(--brand-dark);
    clip-path: polygon(0 100%, 100% 100%, 100% 50%, 0 0);
    z-index: -1;
  }
  .logo {
    display: flex;
    align-items: center;
    color: #fff;
    margin-bottom: 20px;
  }
  .logo .symbol {
    width: 40px;
    height: 40px;
    background-color: var(--brand-light);
    border-radius: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 800;
    font-size: 24px;
    margin-right: 10px;
  }
  .logo-text h1 {
    margin: 0;
    font-size: 20px;
    font-weight: 700;
  }
  .logo-text p {
    margin: 0;
    font-size: 12px;
    font-weight: 400;
  }
  .letter-body {
    padding-top: 50px;
    line-height: 1.8;
  }
  .recipient-info {
    margin-bottom: 20px;
  }
  .salutation {
    margin-bottom: 10px;
  }
  .signature {
    margin-top: 40px;
  }
</style>
</head>
<body>
  <div class="header-bg"></div>
  <div class="footer-bg"></div>
  <div class="page-container">
    <header class="logo">
      <div class="symbol">S</div>
      <div class="logo-text">
        <h1>COMPANY LOGO</h1>
        <p>Brand Solutions</p>
      </div>
    </header>
    <main class="letter-body">
      ${paragraphs || '<p>Write your letter content…</p>'}
    </main>
  </div>
</body>
</html>`;
}

export default function celestial({ docType, profile, body }) {
  return docType === 'cover-letter' ? renderLetter(profile, body) : renderCV(profile);
}