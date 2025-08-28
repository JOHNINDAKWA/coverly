import React, { useMemo } from 'react';
import './PdfPreview.css';

export default function PdfPreview({ html }) {
  const src = useMemo(() => {
    const blob = new Blob([html || ''], { type: 'text/html' });
    return URL.createObjectURL(blob);
  }, [html]);

  return (
    <iframe className="pdf-frame" title="Preview" src={src} />
  );
}
