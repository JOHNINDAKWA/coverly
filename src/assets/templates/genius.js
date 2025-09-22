// src/templates/genius.js
// Resume Genius-inspired template with gradient header + timeline

const esc = (s) =>
  String(s || '').replace(/[&<>"']/g, (m) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m])
  );
const line = (arr) => (arr || []).filter(Boolean).join(' • ');

/* ---------- CV layout ---------- */
function renderCV(profile = {}) {
  const {
    name = '',
    title = '',
    email = '',
    phone = '',
    location = '',
    skills = [],
    experience = [],
    education = [],
    summary = '',
  } = profile;

  const skillsHTML = skills.length
    ? `<ul class="list">${skills.map((s) => `<li>${esc(s)}</li>`).join('')}</ul>`
    : '';

  const expHTML = experience.length
    ? `<div class="timeline">
        ${experience
          .map(
            (e) => `
          <div class="exp">
            <div class="dot"></div>
            <div class="exp-content">
              <header>
                <strong>${esc(e.role || '')}</strong>
                <span class="dates">${esc(e.start || '')} – ${esc(e.end || 'Present')}</span>
              </header>
              <div class="meta">${esc(line([e.company, e.city]))}</div>
              ${
                Array.isArray(e.bullets) && e.bullets.length
                  ? `<ul class="list">${e.bullets.map((b) => `<li>${esc(b)}</li>`).join('')}</ul>`
                  : ''
              }
            </div>
          </div>`
          )
          .join('')}
      </div>`
    : '<p class="muted">No experience provided.</p>';

  const eduHTML = education.length
    ? education
        .map(
          (ed) => `
        <div class="edu">
          <strong>${esc(ed.degree || '')}</strong>, ${esc(ed.field || '')}
          <div>${esc(ed.school || '')} ${ed.endYear ? `| ${esc(ed.endYear)}` : ''}</div>
        </div>`
        )
        .join('')
    : '';

  return `<!doctype html>
<html><head><meta charset="utf-8" />
<link href="https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@400;600;700&display=swap" rel="stylesheet">
<style>
  :root { 
    --ink:#1a1a1a; 
    --dim:#555; 
    --bg:#fff; 
    --accent:#1ba97f; 
    --sidebar:#f5f9f8; 
  }
  @page { margin: 0; }
  body { font-family:'Source Sans Pro',sans-serif; margin:0; padding:0; color:var(--ink); background:var(--bg); }
  .header {
    width:100%; 
    padding:24px; 
    background:linear-gradient(90deg,#00695c,#26a69a);
    color:#fff;
    text-align:right;
  }
  .header h1 { margin:0; font-size:28px; font-weight:700; }
  .header p { margin:4px 0 0; font-size:16px; font-weight:500; }

  .layout { display:grid; grid-template-columns:240px 1fr; }
  .sidebar { background:var(--sidebar); padding:20px; border-right:1px solid #ddd; }
  .main { padding:28px; }
  h2 { font-size:13px; text-transform:uppercase; letter-spacing:.08em; font-weight:700; color:var(--accent); margin:20px 0 8px; }
  .section { margin-bottom:20px; }
  .list { margin:6px 0 0 18px; padding:0; font-size:13px; }
  .list li { margin-bottom:4px; }
  .summary { font-size:14px; line-height:1.5; margin-top:6px; }

  /* Timeline */
  .timeline { position:relative; margin-left:12px; padding-left:20px; border-left:2px solid var(--accent); }
  .exp { position:relative; margin-bottom:20px; }
  .exp .dot {
    position:absolute;
    left:-12px;
    top:4px;
    width:10px; height:10px;
    background:var(--accent);
    border-radius:50%;
  }
  .exp header { display:flex; justify-content:space-between; font-size:14px; font-weight:600; }
  .exp .dates { color:var(--dim); font-size:13px; }
  .exp .meta { font-size:13px; color:var(--dim); margin-bottom:4px; }
  .muted { color:var(--dim); font-size:13px; }
</style>
</head>
<body>
  <div class="header">
    <h1>${esc(name)}</h1>
    <p>${esc(title)}</p>
  </div>
  <div class="layout">
    <aside class="sidebar">
      <h2>Contact</h2>
      <div class="section">
        <div>${esc(phone)}</div>
        <div>${esc(email)}</div>
        <div>${esc(location)}</div>
      </div>
      ${eduHTML ? `<h2>Education</h2><div class="section">${eduHTML}</div>` : ''}
      ${skillsHTML ? `<h2>Skills</h2><div class="section">${skillsHTML}</div>` : ''}
    </aside>
    <main class="main">
      <h2>Profile</h2>
      <p class="summary">${esc(summary || 'Write your professional profile here…')}</p>
      <h2>Relevant Experience</h2>
      ${expHTML}
    </main>
  </div>
</body></html>`;
}

/* ---------- Cover Letter layout ---------- */
function renderLetter(profile = {}, body = '') {
  const { name = '', title = '', email = '', phone = '', location = '' } = profile;
  const paragraphs = String(body || '')
    .split(/\n{2,}/)
    .map((p) => `<p>${esc(p).replace(/\n/g, '<br>')}</p>`)
    .join('');

  return `<!doctype html>
<html><head><meta charset="utf-8" />
<link href="https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@400;600;700&display=swap" rel="stylesheet">
<style>
  :root { --ink:#1a1a1a; --dim:#555; --accent:#1ba97f; }
  @page { margin:20mm; }
  body { font-family:'Source Sans Pro',sans-serif; margin:0; padding:0; color:var(--ink); }
  .header {
    width:100%; padding:24px; 
    background:linear-gradient(90deg,#00695c,#26a69a);
    color:#fff; text-align:right;
    border-top-left-radius:12px;
    border-top-right-radius:12px;
  }
  .header h1 { margin:0; font-size:28px; font-weight:700; }
  .header p { margin:4px 0 0; font-size:16px; font-weight:500; }
  .contact { margin-top:8px; font-size:13px; color:#eee; }
  .body { font-size:14px; line-height:1.6; padding:28px; }
  .body p { margin:0 0 14px; }
</style></head>
<body>
  <div class="header">
    <h1>${esc(name)}</h1>
    <p>${esc(title)}</p>
    <div class="contact">${esc(line([phone, email, location]))}</div>
  </div>
  <div class="body">
    ${paragraphs || '<p>Write your letter content…</p>'}
    <p>Sincerely,</p>
    <p>${esc(name)}</p>
  </div>
</body></html>`;
}

export default function genius({ docType, profile, body }) {
  return docType === 'cover-letter' ? renderLetter(profile, body) : renderCV(profile);
}
