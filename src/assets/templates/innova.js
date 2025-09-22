// src/templates/innova.js
// Resume + Cover Letter template with gold-beige theme and fixed bars

const esc = (s) =>
  String(s || "").replace(/[&<>"']/g, (m) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m])
  );

const line = (arr) => (arr || []).filter(Boolean).join(" • ");

/* ---------- Resume Layout ---------- */
function renderCV(profile = {}) {
  const {
    name = "",
    email = "",
    phone = "",
    location = "",
    skills = [],
    experience = [],
    summary = "",
    education = [],
    achievements = [],
    title = "Professional",
    linkedin = "",
  } = profile;

  const [firstName, ...lastParts] = name.split(" ");
  const lastName = lastParts.join(" ");

  const summaryText =
    summary ||
    "Write a short profile summary highlighting your strengths and career focus.";

  const skillsHTML = skills.length
    ? `<ul class="pill-list">${skills
        .map((s) => `<li>${esc(s)}</li>`)
        .join("")}</ul>`
    : "";

  const eduHTML = education.length
    ? education
        .map(
          (e) => `
      <div class="edu-item">
        <strong>${esc(e.degree || "")}</strong>
        <div>${esc(e.school || "")}</div>
        <div class="dim">${esc(
          [e.field, e.startYear, e.endYear].filter(Boolean).join(" • ")
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

  const expHTML = experience.length
    ? experience
        .map(
          (e) => `
      <article class="exp">
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
<html><head><meta charset="utf-8" />
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&display=swap" rel="stylesheet">
<style>
  :root {
    --ink: #111;
    --dim: #666;
    --line: #e2e8f0;
    --theme: #c7a66b;
  }
html, body {
  margin:0;
  padding:0;
  height:100%;
  width:100%;
}
 @page { margin:0; size:A4; }
  body {
    font-family: 'Montserrat', sans-serif;
    color: var(--ink);
    background: #fff;
  }
.top-bar, .bottom-bar {
  height:14px;
  width:100%;
  background:linear-gradient(90deg,var(--theme),#d8c089);
  position:fixed;
  left:0;
}
.top-bar { top:0; }
.bottom-bar { bottom:0; }
  .header { text-align: center; padding: 36px 0 18px; }
  .header h1 { font-size: 28px; margin: 0; font-weight: 700; }
  .header h1 span { color: var(--theme); font-weight: 600; }
  .header .title { font-size: 14px; color: var(--dim); margin-top: 4px; }
  .contacts {
    display: flex; justify-content: space-around;
    margin: 16px 0 22px; text-align: center;
  }
  .contact-item { font-size: 13px; color: var(--ink); }
  .contact-item svg { width:16px; height:16px; margin-bottom:4px; fill:var(--theme); display:block; margin-left:auto; margin-right:auto; }
  .layout { display: grid; grid-template-columns: 2fr 1fr; gap: 28px; padding: 0 28px 40px; }
  h2 { font-size: 14px; letter-spacing: .08em; text-transform: uppercase;
       border-bottom: 1px solid var(--line); padding-bottom: 4px; margin: 20px 0 10px; }
  .summary { font-size: 14px; color: var(--dim); }
  .exp { margin-bottom: 14px; }
  .exp h3 { margin: 0; font-size: 15px; font-weight: 600; }
  .exp .meta { font-size: 13px; color: var(--dim); }
  .exp .dates { font-size: 13px; font-weight: 600; color: var(--theme); }
  .bullets { margin: 6px 0 0 18px; font-size: 13px; }
  .pill-list { display: flex; flex-wrap: wrap; gap: 6px; padding: 0; list-style: none; }
  .pill-list li { border: 1px solid var(--line); border-radius: 999px; padding: 4px 10px; font-size: 13px; }
  .edu-item { margin-bottom: 10px; font-size: 13px; }
  .edu-item .dim { font-size: 12px; color: var(--dim); }
  .list { margin: 0; padding-left: 18px; font-size: 13px; }
  .muted { color: var(--dim); }
</style>
</head>
<body>
  <div class="top-bar"></div>
  <div class="header">
    <h1>${esc(firstName)} <span>${esc(lastName)}</span></h1>
    <div class="title">${esc(title)}</div>
    <div class="contacts">
      <div class="contact-item">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.11-.21c1.21.49 2.54.76 3.93.76a1 1 0 011 1V20a1 1 0 01-1 1C10.61 21 3 13.39 3 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.39.26 2.72.76 3.93a1 1 0 01-.21 1.11l-2.43 2.43z"/></svg>
        ${esc(phone)}
      </div>
      <div class="contact-item">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M20 4H4a2 2 0 00-2 2v.01l10 6.25L22 6.01V6a2 2 0 00-2-2zm0 4.25l-8 5-8-5V18a2 2 0 002 2h12a2 2 0 002-2V8.25z"/></svg>
        ${esc(email)}
      </div>
      <div class="contact-item">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 2C8.14 2 5 5.14 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.86-3.14-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z"/></svg>
        ${esc(location)}
      </div>
      <div class="contact-item">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M4 4a2 2 0 012-2h12a2 2 0 012 2v16l-7-3-7 3V4z"/></svg>
        ${esc(linkedin)}
      </div>
    </div>
  </div>
  <div class="layout">
    <div>
      <h2>Professional Profile</h2>
      <p class="summary">${esc(summaryText)}</p>
      <h2>Work Experience</h2>
      ${expHTML}
    </div>
    <aside>
      <h2>Skills</h2>${skillsHTML}
      <h2>Education</h2>${eduHTML}
      ${achHTML ? `<h2>Achievements</h2>${achHTML}` : ""}
    </aside>
  </div>
  <div class="bottom-bar"></div>
</body></html>`;
}

/* ---------- Cover Letter Layout ---------- */
function renderLetter(profile = {}, body = "") {
  const { name = "", email = "", phone = "", location = "", title = "Professional", linkedin = "" } = profile;
  const [firstName, ...lastParts] = name.split(" ");
  const lastName = lastParts.join(" ");

  const paragraphs = String(body || "")
    .split(/\n{2,}/)
    .map((p) => `<p>${esc(p).replace(/\n/g, "<br>")}</p>`)
    .join("");

  return `<!doctype html>
<html><head><meta charset="utf-8" />
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&display=swap" rel="stylesheet">
<style>
  :root { --ink:#111; --dim:#666; --line:#e2e8f0; --theme:#c7a66b; }
  html, body { margin:0; padding:0; }
  @page { margin:0; }
  body { font-family:'Montserrat',sans-serif;color:var(--ink);background:#fff; }
  .top-bar, .bottom-bar { height:12px;width:100%;background:linear-gradient(90deg,var(--theme),#d8c089);position:fixed;left:0; }
  .top-bar { top:0; } .bottom-bar { bottom:0; }
  .header { text-align:center;padding:36px 0 18px; }
  .header h1 { font-size:28px;margin:0;font-weight:700; }
  .header h1 span { color:var(--theme);font-weight:600; }
  .header .title { font-size:14px;color:var(--dim);margin-top:4px; }
  .contacts { display:flex;justify-content:space-around;margin:16px 0 22px;text-align:center; }
  .contact-item { font-size:13px;color:var(--ink); }
  .contact-item svg { width:16px;height:16px;margin-bottom:4px;fill:var(--theme);display:block;margin-left:auto;margin-right:auto; }
  .letter { padding:0 28px 40px; line-height:1.6; font-size:14px; }
  .letter p { margin:0 0 14px; }
  .signature { margin-top:30px; font-weight:600; }
</style>
</head>
<body>
  <div class="top-bar"></div>
  <div class="header">
    <h1>${esc(firstName)} <span>${esc(lastName)}</span></h1>
    <div class="title">${esc(title)}</div>
    <div class="contacts">
      <div class="contact-item">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.11-.21c1.21.49 2.54.76 3.93.76a1 1 0 011 1V20a1 1 0 01-1 1C10.61 21 3 13.39 3 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.39.26 2.72.76 3.93a1 1 0 01-.21 1.11l-2.43 2.43z"/></svg>
        ${esc(phone)}
      </div>
      <div class="contact-item">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M20 4H4a2 2 0 00-2 2v.01l10 6.25L22 6.01V6a2 2 0 00-2-2zm0 4.25l-8 5-8-5V18a2 2 0 002 2h12a2 2 0 002-2V8.25z"/></svg>
        ${esc(email)}
      </div>
      <div class="contact-item">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 2C8.14 2 5 5.14 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.86-3.14-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z"/></svg>
        ${esc(location)}
      </div>
      <div class="contact-item">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M4 4a2 2 0 012-2h12a2 2 0 012 2v16l-7-3-7 3V4z"/></svg>
        ${esc(linkedin)}
      </div>
    </div>
  </div>
  <div class="letter">
    ${paragraphs || "<p>Write your letter content…</p>"}
    <div class="signature">
      <p>Sincerely,</p>
      <p>${esc(name)}</p>
    </div>
  </div>
  <div class="bottom-bar"></div>
</body></html>`;
}

/* ---------- Export ---------- */
export default function innova({ docType, profile, body }) {
  return docType === "cover-letter" ? renderLetter(profile, body) : renderCV(profile);
}
