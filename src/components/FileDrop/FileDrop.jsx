import React, { useCallback, useRef, useState } from 'react';
import { LuUpload, LuImage, LuFileText, LuX } from 'react-icons/lu';
import './FileDrop.css';

function formatBytes(bytes) {
  if (!bytes && bytes !== 0) return '';
  const units = ['B', 'KB', 'MB', 'GB'];
  let i = 0;
  let n = bytes;
  while (n >= 1024 && i < units.length - 1) { n /= 1024; i++; }
  return `${n.toFixed(n >= 10 || i === 0 ? 0 : 1)} ${units[i]}`;
}

export default function FileDrop({
  accept = '.pdf,.doc,.docx,.png,.jpg,.jpeg',
  multiple = true,
  maxSizeMB = 15,
  onFiles,
  onError,
  disabled = false,
}) {
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const [files, setFiles] = useState([]);

  const maxBytes = maxSizeMB * 1024 * 1024;

  const pickFiles = () => {
    if (disabled) return;
    inputRef.current?.click();
  };

  const handleChosen = (list) => {
    const arr = Array.from(list || []);
    if (!arr.length) return;

    const valid = [];
    const errors = [];

    // basic validation: type/extension + size
    const accepted = accept.split(',').map(s => s.trim().toLowerCase());
    const isAccepted = (file) => {
      if (accepted.includes('*/*')) return true;
      const ext = '.' + (file.name.split('.').pop() || '').toLowerCase();
      const mt = (file.type || '').toLowerCase();
      return accepted.includes(ext) || accepted.includes(mt);
    };

    for (const f of arr) {
      if (!isAccepted(f)) {
        errors.push(`Unsupported file: ${f.name}`);
        continue;
      }
      if (f.size > maxBytes) {
        errors.push(`File too large (${formatBytes(f.size)}): ${f.name}`);
        continue;
      }
      valid.push(f);
      if (!multiple) break;
    }

    if (errors.length && onError) onError(errors);
    if (!valid.length) return;

    const next = multiple ? valid : [valid[0]];
    setFiles(next);
    onFiles?.(next);
  };

  const onInputChange = (e) => {
    handleChosen(e.target.files);
    // allow re-choosing the same file
    e.target.value = '';
  };

  const onDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    if (disabled) return;
    if (e.dataTransfer?.files?.length) {
      handleChosen(e.dataTransfer.files);
    }
  }, [disabled]);

  const onDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setDragOver(true);
  }, [disabled]);

  const onDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
  }, []);

  const removeAll = () => {
    setFiles([]);
    onFiles?.([]);
  };

  return (
    <div className={`filedrop ${disabled ? 'is-disabled' : ''}`}>
      <div
        className={`filedrop__zone ${dragOver ? 'is-over' : ''}`}
        role="button"
        tabIndex={0}
        onClick={pickFiles}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && pickFiles()}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        aria-disabled={disabled}
        aria-label="Upload files by clicking or dragging and dropping"
      >
        <div className="filedrop__icon">
          <LuUpload />
        </div>
        <div className="filedrop__text">
          <strong>Click to upload</strong> or drag & drop
          <div className="muted small">
            Accepts {accept.replaceAll(',', ', ')} · up to {maxSizeMB}MB each
          </div>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={onInputChange}
          hidden
        />
      </div>

      {files.length > 0 && (
        <div className="filedrop__list">
          <div className="filedrop__listhead">
            <span className="muted">{files.length} file{files.length > 1 ? 's' : ''} selected</span>
            <button type="button" className="filedrop__clear" onClick={removeAll}>
              <LuX /> Clear
            </button>
          </div>
          <ul>
            {files.map((f, i) => {
              const isImg = /image\/(png|jpe?g|gif|webp)/i.test(f.type) || /\.(png|jpe?g|gif|webp)$/i.test(f.name);
              return (
                <li key={`${f.name}-${i}`} className="file">
                  <div className="file__thumb">
                    {isImg ? <LuImage /> : <LuFileText />}
                  </div>
                  <div className="file__meta">
                    <div className="file__name">{f.name}</div>
                    <div className="file__size muted small">{formatBytes(f.size)}</div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <p className="filedrop__hint muted">
        Images of job ads are supported — we’ll run OCR automatically.
      </p>
    </div>
  );
}
