import React from 'react';
import './TemplateCard.css';

export default function TemplateCard({ title, selected, onClick }) {
  return (
    <button
      type="button"
      className={`tpl-card ${selected ? 'is-selected' : ''}`}
      onClick={onClick}
    >
      <div className="thumb" aria-hidden />
      <div className="name">{title}</div>
    </button>
  );
}
