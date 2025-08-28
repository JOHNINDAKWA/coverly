// src/templates/sleek.js
// Renders a CV OR a Cover Letter depending on { docType }
// Uses inline CSS for ATS/PDF friendliness.

const esc = (s) => String(s || '').replace(/[&<>"']/g, m => ({
  '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
}[m]));
const line = (arr) => (arr || []).filter(Boolean).join(' • ');

/* ---------- CV layout ---------- */
function renderCV(profile = {}) {
  const { name='', email='', phone='', location='', skills=[], experience=[], summary='' } = profile;

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
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style>
  :root{ --ink:#0f172a; --dim:#667085; --line:#e2e8f0; }
  @page { margin: 24mm; }
  *{box-sizing:border-box}
  body{font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:var(--ink);line-height:1.45;margin:0;padding:28px;background:#fff}
  .name{font-weight:800;letter-spacing:-.01em;font-size:28px}
  .contact{color:var(--dim);font-weight:500;margin-bottom:8px}
  h2{font-size:13px;letter-spacing:.12em;text-transform:uppercase;color:#111;margin:16px 0 8px}
  .sec{padding-top:8px;border-top:1px solid var(--line)}
  .summary{margin:6px 0 10px;color:#374151;line-height:1.55}
  .skills{display:flex;flex-wrap:wrap;gap:6px;margin:0;padding:0;list-style:none}
  .skills li{border:1px solid var(--line);border-radius:999px;padding:6px 10px;font-weight:600}
  .exp{padding:8px 0}
  .exp header{display:grid;grid-template-columns:1fr auto;grid-template-areas:"role dates" "meta dates";gap:2px}
  .exp h3{grid-area:role;margin:0;font-size:16px;font-weight:700}
  .exp .meta{grid-area:meta;color:var(--dim);font-weight:500}
  .exp .dates{grid-area:dates;color:var(--dim);font-weight:600}
  .bullets{margin:6px 0 0 18px}
  .bullets li{margin:3px 0}
  .muted{color:var(--dim)}
</style></head>
<body>
  <header>
    <div class="name">${esc(name)}</div>
    <div class="contact">${esc(line([email, phone, location]))}</div>
  </header>

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
</body></html>`;
}

/* ---------- Cover Letter layout ---------- */
function renderLetter(profile = {}, body = '') {
  const { name='', email='', phone='', location='' } = profile;
  const contact = line([email, phone, location]);
  const paragraphs = String(body||'')
    .split(/\n{2,}/)
    .map(p => `<p>${esc(p).replace(/\n/g,'<br>')}</p>`)
    .join('');

  return `<!doctype html>
<html><head><meta charset="utf-8" />
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style>
  :root{ --ink:#0f172a; --dim:#667085; --line:#e2e8f0; --brand:#6366f1; }
  @page { margin: 24mm; }
  body{font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:var(--ink);line-height:1.6;margin:0;padding:28px;background:#fff}
  .top{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:1px solid var(--line);padding-bottom:10px;margin-bottom:18px}
  .name{font-weight:800;font-size:22px;letter-spacing:-.01em}
  .contact{color:var(--dim);text-align:right}
  .title{font-weight:800;font-size:18px;margin:0 0 6px}
  p{margin:10px 0}
</style></head>
<body>
  <div class="top">
    <div class="name">${esc(name)}</div>
    <div class="contact">${esc(contact)}</div>
  </div>
  ${paragraphs || '<p>Write your letter content…</p>'}
</body></html>`;
}

export default function sleek({ docType, profile, body }) {
  return docType === 'cover-letter' ? renderLetter(profile, body) : renderCV(profile);
}
