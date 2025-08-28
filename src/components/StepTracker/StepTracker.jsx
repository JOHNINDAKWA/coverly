import React, { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  LuUpload,
  LuSearch,
  LuSparkles,
  LuGrid2X2 ,
  LuCreditCard,
} from 'react-icons/lu';
import { LiaCheckCircle } from "react-icons/lia";

import { useAppStore } from '../../state/useAppStore';
import './StepTracker.css';

const STEPS = [
  { key: 'upload',   label: 'Upload',        path: '/upload',        Icon: LuUpload },
  { key: 'review',   label: 'Review',        path: '/extract-review',Icon: LuSearch },
  { key: 'draft',    label: 'Draft',         path: '/generate',      Icon: LuSparkles },
  { key: 'templates',label: 'Templates',     path: '/templates',     Icon:  LuGrid2X2 },
  { key: 'preview',  label: 'Preview & Pay', path: '/preview-pay',   Icon: LuCreditCard },
  { key: 'done',     label: 'Done',          path: '/done',          Icon: LiaCheckCircle },
];

export default function StepTracker() {
  const stage = useAppStore(s => s.stage);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const activeIndex = useMemo(() => {
    const i = STEPS.findIndex(s => pathname.startsWith(s.path));
    return i >= 0 ? i : Math.min(stage, STEPS.length - 1);
  }, [pathname, stage]);

  const progressPct = Math.max(0, Math.min(100, (activeIndex / (STEPS.length - 1)) * 100));

  const goTo = (i) => {
    // allow clicking only to steps already reached
    if (i <= stage) navigate(STEPS[i].path);
  };

  return (
    <div className="cv-stepper">
      <div className="cv-stepper__inner">
        {/* Progress track */}
        <div className="cv-stepper__track" aria-hidden>
          <div className="cv-stepper__progress" style={{ width: `${progressPct}%` }} />
        </div>

        {/* Steps */}
        <ol className="cv-stepper__list" role="list">
          {STEPS.map((s, i) => {
            const isActive = i === activeIndex;
            const isDone = i < activeIndex || (i < stage);
            const isLocked = i > stage;
            const Icon = s.Icon;
            return (
              <li key={s.key} className="cv-step">
                <button
                  type="button"
                  className={[
                    'cv-step__dot',
                    isActive ? 'is-active' : '',
                    isDone ? 'is-done' : '',
                    isLocked ? 'is-locked' : '',
                  ].join(' ').trim()}
                  aria-current={isActive ? 'step' : undefined}
                  aria-disabled={isLocked}
                  onClick={() => !isLocked && goTo(i)}
                >
                  <Icon aria-hidden />
                  <span className="cv-step__num">{i + 1}</span>
                </button>
                <span className="cv-step__label">{s.label}</span>
              </li>
            );
          })}
        </ol>

        {/* Compact mobile summary */}
        <div className="cv-stepper__mini">
          <span className="cv-stepper__mini-pill">
            Step {activeIndex + 1} of {STEPS.length}
          </span>
          <span className="cv-stepper__mini-label">{STEPS[activeIndex]?.label}</span>
        </div>
      </div>
    </div>
  );
}
