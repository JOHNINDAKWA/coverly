// String-based export to dodge global CSS (and color-mix) issues
import html2pdf from 'html2pdf.js';
import { renderTemplate } from '../templates';

export async function exportPdf({ templateId, docType, profile, body }) {
  const html = renderTemplate({ templateId, docType, profile, body });

  const opt = {
    filename: `${(profile?.name || 'document').replace(/\s+/g, '_')}.pdf`,
    html2canvas: {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
      // foreignObjectRendering helps with SVG/img consistency
      foreignObjectRendering: true,
    },
    jsPDF: { unit: 'pt', format: 'a4', orientation: 'portrait' },
    margin: [0, 0, 0, 0],
    pagebreak: { mode: ['css', 'legacy'] },
  };

  // IMPORTANT: feed HTML string, not a live node
  await html2pdf().set(opt).from(html).save();
}
