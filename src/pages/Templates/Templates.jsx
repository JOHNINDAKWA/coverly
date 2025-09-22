// src/pages/Templates/Templates.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../state/useAppStore';
import TemplateCard from '../../components/TemplateCard/TemplateCard';
import './Templates.css';

export default function Templates() {
  const docType = useAppStore((s) => s.docType);

  // Templates list updated to include innova + genius
  const TEMPLATES =
    docType === 'cover-letter'
      ? [
          { id: 'sleek', name: 'Sleek Letter' },
          { id: 'modern', name: 'Modern Letter' },
          { id: 'classic', name: 'Classic Letter' },
          { id: 'celestial', name: 'Celestial Letter' },
          { id: 'innova', name: 'Innova Letter' },
          { id: 'genius', name: 'Genius Letter' },
        ]
      : [
          { id: 'sleek', name: 'Sleek' },
          { id: 'modern', name: 'Modern' },
          { id: 'classic', name: 'Classic' },
          { id: 'celestial', name: 'Celestial' },
          { id: 'innova', name: 'Innova' },
          { id: 'genius', name: 'Genius' },
        ];

  const selected = useAppStore((s) => s.selectedTemplate);
  const selectTemplate = useAppStore((s) => s.selectTemplate);
  const preparePreview = useAppStore((s) => s.preparePreview);
  const navigate = useNavigate();

  const onChoose = (tpl) => selectTemplate(tpl);

  const onContinue = async () => {
    await preparePreview();
    navigate('/preview-pay');
  };

  return (
    <section className="templates">
      <div className="container">
        <h2>Choose a template</h2>
        <div className="tpl-grid">
          {TEMPLATES.map((t) => (
            <TemplateCard
              key={t.id}
              title={t.name}
              selected={selected?.id === t.id}
              onClick={() => onChoose(t)}
            />
          ))}
        </div>

        <div className="tpl-actions">
          <button
            className="btn btn-primary"
            disabled={!selected}
            onClick={onContinue}
          >
            Continue
          </button>
        </div>
      </div>
    </section>
  );
}
