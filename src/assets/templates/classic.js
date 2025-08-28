// Simple type-driven classic.

const esc = (s)=>String(s||'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const ln = (a)=>a.filter(Boolean).join(' • ');

export default function classic({ docType, profile = {}, body = '' }) {
  if (docType === 'cover-letter') {
    const contact = ln([profile.email, profile.phone, profile.location]);
    const paras = String(body || '')
      .split(/\n{2,}/)
      .map(p => `<p>${esc(p).replace(/\n/g,'<br>')}</p>`)
      .join('');

    return `<!doctype html><html><head><meta charset="utf-8"/>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
<style>
  @page { margin: 25mm; }
  body{font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;margin:0;padding:30px;color:#111827;line-height:1.6}
  .hdr{margin-bottom:16px}
  .name{font-weight:700;font-size:20px}
  .contact{color:#6b7280}
  h1{font-size:18px;margin:0 0 6px}
  p{margin:8px 0}
</style></head><body>
  <div class="hdr">
    <div class="name">${esc(profile.name || '')}</div>
    <div class="contact">${esc(contact)}</div>
  </div>
  ${paras || '<p>Write your letter content…</p>'}
</body></html>`;
  }

  // ===== CV =====
  const summaryText = esc(
    profile.summary ||
    'Results-driven professional with a track record of delivering measurable impact. Strong collaboration, problem-solving, and communication skills. Passionate about building quality work and learning fast.'
  );

  const skillsHTML = (profile.skills || []).map(x => `<li>${esc(x)}</li>`).join('');

  const expHTML = (profile.experience || []).map(x => `
    <div class="row">
      <div class="l">
        <div class="role">${esc(x.role || '')}</div>
        <div class="meta">${esc(ln([x.company, x.city]))}</div>
      </div>
      <div class="r">${esc(ln([x.start, x.end || 'Present']))}</div>
      ${(x.bullets || []).length ? `<ul>${x.bullets.map(b => `<li>${esc(b)}</li>`).join('')}</ul>` : ''}
    </div>
  `).join('');

  return `<!doctype html><html><head><meta charset="utf-8"/>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
<style>
  @page { margin: 20mm; }
  body{font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;margin:0;padding:26px;color:#111827}
  h1{margin:0}
  h2{margin:14px 0 6px;font-size:14px;letter-spacing:.08em;text-transform:uppercase}
  .contact{color:#6b7280}
  .summary{margin:6px 0 10px;color:#374151;line-height:1.55}
  .skills{display:flex;flex-wrap:wrap;gap:6px;list-style:none;padding:0;margin:0}
  .skills li{border:1px solid #e5e7eb;border-radius:8px;padding:6px 10px}
  .row{padding:8px 0;border-top:1px solid #e5e7eb;display:grid;grid-template-columns:1fr auto}
  .role{font-weight:700}
  .meta,.r{color:#6b7280}
  .row ul{margin:6px 0 0 18px}
</style></head><body>
  <h1>${esc(profile.name || '')}</h1>
  <div class="contact">${esc(ln([profile.email, profile.phone, profile.location]))}</div>

  <h2>Summary</h2>
  <p class="summary">${summaryText}</p>

  <h2>Skills</h2>
  <ul class="skills">${skillsHTML}</ul>

  <h2>Experience</h2>
  ${expHTML || '<p style="color:#6b7280">Add experience…</p>'}
</body></html>`;
}
