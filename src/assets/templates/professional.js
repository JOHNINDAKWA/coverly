// src/templates/professional.js
// Two-column professional resume + cover letter

const esc = (s) =>
  String(s || "").replace(/[&<>"']/g, (m) =>
    ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    }[m])
  );
const line = (arr) => (arr || []).filter(Boolean).join(" • ");

/* ---------- CV layout ---------- */
function renderCV(profile = {}) {
  const {
    name = "",
    title = "Professional",
    email = "",
    phone = "",
    location = "",
    summary = "",
    experience = [],
    education = [],
    skills = [],
  } = profile;

  const expHTML = experience
    .map(
      (e) => `
      <div class="exp">
        <h4>${esc(e.role || "")}</h4>
        <div class="meta">${esc(line([e.company, e.city]))}</div>
        <div class="dates">${esc(line([e.start, e.end || "Present"]))}</div>
        ${
          Array.isArray(e.bullets) && e.bullets.length
            ? `<ul>${e.bullets.map((b) => `<li>${esc(b)}</li>`).join("")}</ul>`
            : ""
        }
      </div>`
    )
    .join("");

  const eduHTML = education
    .map(
      (ed) => `
      <div class="edu">
        <strong>${esc(ed.school || "")}</strong><br>
        <em>${esc(ed.degree || "")}${ed.field ? ", " + esc(ed.field) : ""}</em><br>
        <span>${esc(ed.startYear || "")} – ${esc(ed.endYear || "")}</span>
      </div>`
    )
    .join("");

  const skillsHTML = skills.length
    ? `<ul class="skills">${skills
        .map((s) => `<li>${esc(s)}</li>`)
        .join("")}</ul>`
    : "";

  return `<!doctype html>
<html><head><meta charset="utf-8"/>
<link href="https://fonts.googleapis.com/css2?family=Lora:wght@600&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
<style>
  body { font-family: Inter, sans-serif; margin:0; padding:30px; color:#222; }
  .header { display:flex; align-items:center; gap:20px; margin-bottom:20px; }
  .circle { width:60px; height:60px; border:2px solid #444; border-radius:50%; display:flex; align-items:center; justify-content:center; font-family:Lora, serif; font-weight:600; font-size:18px; }
  .who { display:flex; flex-direction:column; }
  .who h1 { font-family:Lora, serif; font-size:26px; margin:0; letter-spacing:1px; }
  .who p { font-size:13px; text-transform:uppercase; color:#666; margin:4px 0 0; }

  .grid { display:grid; grid-template-columns:2fr 1fr; gap:30px; }

  h2 { font-size:13px; font-weight:600; letter-spacing:.1em; background:#f5f5f5; padding:6px 10px; margin:20px 0 10px; text-transform:uppercase; }

  .exp h4 { margin:0; font-weight:600; }
  .exp .meta { color:#555; font-size:14px; }
  .exp .dates { float:right; font-size:13px; color:#666; }
  .exp ul { margin:6px 0 14px 18px; padding:0; }
  .exp ul li { margin:4px 0; }

  .edu { margin-bottom:12px; font-size:14px; }
  .edu em { font-style:italic; color:#444; }

  .skills { margin:0; padding:0; list-style:none; }
  .skills li { margin:4px 0; font-size:14px; }

  .contact p { margin:4px 0; font-size:14px; }
</style></head>
<body>
  <div class="header">
    <div class="circle">${esc(name).split(" ").map(w=>w[0]||"").join("").slice(0,2).toUpperCase()}</div>
    <div class="who">
      <h1>${esc(name)}</h1>
      <p>${esc(title)}</p>
    </div>
  </div>

  <div class="grid">
    <!-- LEFT -->
    <div>
      <h2>Career Objective</h2>
      <p>${esc(summary || "Dedicated professional with proven skills and a passion for excellence.")}</p>

      <h2>Professional Experience</h2>
      ${expHTML}
    </div>

    <!-- RIGHT -->
    <div>
      <h2>Contact</h2>
      <div class="contact">
        <p><strong>Phone</strong><br>${esc(phone)}</p>
        <p><strong>Email</strong><br>${esc(email)}</p>
        <p><strong>Location</strong><br>${esc(location)}</p>
      </div>

      ${
        eduHTML
          ? `<h2>Education</h2>
             ${eduHTML}`
          : ""
      }

      ${
        skillsHTML
          ? `<h2>Relevant Skills</h2>
             ${skillsHTML}`
          : ""
      }
    </div>
  </div>
</body></html>`;
}

/* ---------- Cover Letter layout ---------- */
function renderLetter(profile = {}, body = "") {
  const { name = "", title = "Professional", email = "", phone = "", location = "" } = profile;
  const paragraphs = String(body || "")
    .split(/\n{2,}/)
    .map((p) => `<p>${esc(p)}</p>`)
    .join("");

  return `<!doctype html>
<html><head><meta charset="utf-8"/>
<link href="https://fonts.googleapis.com/css2?family=Lora:wght@600&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
<style>
  body { font-family: Inter, sans-serif; margin:0; padding:30px; color:#222; line-height:1.6; }
  .header { margin-bottom:20px; }
  .header h1 { font-family:Lora, serif; font-size:26px; margin:0; letter-spacing:1px; }
  .header p { font-size:14px; text-transform:uppercase; color:#666; margin:4px 0 0; }
  .contact { font-size:14px; margin-top:8px; color:#444; }
  p { margin:0 0 14px; }
  .signature { margin-top:40px; font-weight:600; }
</style></head>
<body>
  <div class="header">
    <h1>${esc(name)}</h1>
    <p>${esc(title)}</p>
    <div class="contact">
      ${esc(email)} • ${esc(phone)} • ${esc(location)}
    </div>
  </div>

  ${paragraphs || "<p>Write your letter content…</p>"}

  <div class="signature">
    <p>Sincerely,</p>
    <p>${esc(name)}</p>
  </div>
</body></html>`;
}

export default function professional({ docType, profile, body }) {
  return docType === "cover-letter" ? renderLetter(profile, body) : renderCV(profile);
}
