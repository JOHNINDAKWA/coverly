import React, { useEffect, useId, useRef, useState } from 'react';
import { LuClipboard, LuTrash2 } from 'react-icons/lu';
import './JDInput.css';

export default function JDInput({
  id,
  label = 'Job Description',
  placeholder = 'Paste the job description here…',
  defaultValue = '',
  onChange,
  maxChars = 8000,
}) {
  const htmlId = id || useId();
  const [value, setValue] = useState(defaultValue);
  const [copied, setCopied] = useState(false);
  const taRef = useRef(null);

  useEffect(() => { onChange?.(value); }, [value, onChange]);

  const handlePasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) setValue((prev) => (prev ? `${prev}\n${text}` : text));
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
      taRef.current?.focus();
    } catch {
      // silently ignore
    }
  };

  const handleClear = () => {
    setValue('');
    taRef.current?.focus();
  };

  const chars = value.length;
  const pct = Math.min(100, Math.round((chars / maxChars) * 100));

  return (
    <div className="jdinput">
      <div className="jdinput__head">
        <label htmlFor={htmlId}>{label}</label>
        <div className="jdinput__tools">
          <button type="button" className="tool" onClick={handlePasteFromClipboard} title="Paste from clipboard">
            <LuClipboard /> {copied ? 'Pasted!' : 'Paste'}
          </button>
          <button type="button" className="tool" onClick={handleClear} title="Clear">
            <LuTrash2 /> Clear
          </button>
        </div>
      </div>

      <div className="jdinput__box">
        <textarea
          ref={taRef}
          id={htmlId}
          placeholder={placeholder}
          value={value}
          onChange={(e) => setValue(e.target.value.slice(0, maxChars))}
          rows={10}
          spellCheck="true"
        />
        <div className="jdinput__meter" aria-hidden>
          <span style={{ width: `${pct}%` }} />
        </div>
        <div className="jdinput__hint">
          <span className="muted">{chars.toLocaleString()} / {maxChars.toLocaleString()} chars</span>
        </div>
      </div>

      <p className="jdinput__note muted">
        Tip: Paste the responsibilities & requirements. We’ll tailor the bullets to match.
      </p>
    </div>
  );
}
