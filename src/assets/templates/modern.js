// Sidebar-style CV; letter: same as sleek but with left rule.

const esc = (s) => String(s || '').replace(/[&<>"']/g, m => ({
  '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
}[m]));
const ln = (a)=>a.filter(Boolean).join(' • ');

function cv(profile={}) {
  const { name='', email='', phone='', location='', skills=[], experience=[] } = profile;
  const skillsHtml = skills.map(s=>`<li>${esc(s)}</li>`).join('');
  const expHtml = experience.map(e=>`
    <article class="exp">
      <h3>${esc(e.role||'')}</h3>
      <div class="meta">${esc(ln([e.company,e.city]))}</div>
      <div class="dates">${esc(ln([e.start,e.end||'Present']))}</div>
      ${(e.bullets||[]).length?`<ul>${e.bullets.map(b=>`<li>${esc(b)}</li>`).join('')}</ul>`:''}
    </article>`).join('');

  return `
<!doctype html><html><head><meta charset="utf-8"/>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet">
<style>
  @page { margin: 18mm; }
  body{font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;margin:0;color:#0f172a}
  .wrap{display:grid;grid-template-columns:220px 1fr;gap:20px;padding:24px}
  .side{border-right:1px solid #e2e8f0;padding-right:16px}
  .name{font-weight:800;font-size:24px;margin-bottom:6px}
  .contact{color:#667085}
  h2{font-size:13px;letter-spacing:.12em;text-transform:uppercase;margin:16px 0 8px}
  .skills{list-style:none;margin:0;padding:0}
  .skills li{margin:6px 0;border:1px solid #e2e8f0;border-radius:8px;padding:6px 8px;display:inline-block}
  .exp{padding:8px 0}
  .meta,.dates{color:#667085;font-weight:600}
</style></head><body>
  <div class="wrap">
    <aside class="side">
      <div class="name">${esc(name)}</div>
      <div class="contact">${esc(ln([email,phone,location]))}</div>
      <h2>Skills</h2>
      <ul class="skills">${skillsHtml}</ul>
    </aside>
    <main>
      <h2>Experience</h2>
      ${expHtml || '<p style="color:#667085">Add experience…</p>'}
    </main>
  </div>
</body></html>`.trim();
}

function letter(profile={}, body=''){
  const contact = ln([profile.email, profile.phone, profile.location]);
  const paragraphs = String(body||'').split(/\n{2,}/).map(p=>`<p>${esc(p).replace(/\n/g,'<br>')}</p>`).join('');
  return `
<!doctype html><html><head><meta charset="utf-8"/>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet">
<style>
  @page { margin: 24mm; }
  body{font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;margin:0;padding:28px;color:#0f172a}
  .rule{border-left:4px solid #6366f1;padding-left:16px;margin-bottom:12px}
  .hdr{display:flex;justify-content:space-between;border-bottom:1px solid #e2e8f0;padding-bottom:10px;margin-bottom:16px}
  .name{font-weight:800;font-size:22px}
  .contact{color:#667085}
  p{line-height:1.6;margin:10px 0}
</style></head><body>
  <div class="hdr">
    <div class="name">${esc(profile.name||'')}</div>
    <div class="contact">${esc(contact)}</div>
  </div>
  <div class="rule">
    ${paragraphs || '<p>Write your letter content…</p>'}
  </div>
</body></html>`.trim();
}

export default function modern({docType, profile, body}) {
  return docType === 'cover-letter' ? letter(profile, body) : cv(profile);
}
