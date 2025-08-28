import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../state/useAppStore';
import './Generate.css';

export default function Generate() {
  const drafts = useAppStore(s => s.drafts);
  const chooseDraft = useAppStore(s => s.chooseDraft);
  const preparePreview = useAppStore(s => s.preparePreview);
  const docType = useAppStore(s => s.docType);
  const navigate = useNavigate();

  if (!drafts) return null;

  const onUse = async (key) => {
    chooseDraft(key);
    await preparePreview();
    navigate('/templates');
  };

  const keys = Object.keys(drafts);

  return (
    <section className="generate">
      <div className="container">
        <h2>Pick a {docType === 'cv' ? 'resume' : 'letter'} draft</h2>
        <div className="drafts">
          {keys.map((k) => (
            <article key={k} className="draft">
              <pre>{drafts[k]}</pre>
              <div className="actions">
                <button className="btn" onClick={() => onUse(k)}>Use this</button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
