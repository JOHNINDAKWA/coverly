import React from 'react';
import { useAppStore } from '../../state/useAppStore';
import PdfPreview from '../../components/PdfPreview/PdfPreview';

export default function PreviewPay() {
  const html = useAppStore(s => s.previewHTML);
  return (
    <section className="preview">
      <div className="container">
        <h2>Preview</h2>
        <PdfPreview html={html} />
        {/* Your PayButton here */}
      </div>
    </section>
  );
}
