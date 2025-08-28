import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAppStore } from '../../state/useAppStore';
import FileDrop from '../../components/FileDrop/FileDrop';
import JDInput from '../../components/JDInput/JDInput';
import ManualProfileModal from '../../components/ManualProfile/ManualProfile';
import { LiaCheckCircle } from 'react-icons/lia';
import { LuClipboard, LuImage } from 'react-icons/lu';
import { LuUserPlus } from 'react-icons/lu';
import { GiFairyWand } from 'react-icons/gi';
import './Upload.css';

export default function Upload() {
  const [params] = useSearchParams();
  const setDocTypeFromQuery = useAppStore(s => s.setDocTypeFromQuery);
  const addFiles = useAppStore(s => s.addFiles);
  const setJDText = useAppStore(s => s.setJDText);
  const jdText = useAppStore(s => s.jdText);
  const extractProfile = useAppStore(s => s.extractProfile);
  const profile = useAppStore(s => s.extractedProfile);
  const stage = useAppStore(s => s.stage);
  const docType = useAppStore(s => s.docType);
  const navigate = useNavigate();

  const [showManual, setShowManual] = useState(false);
  const [jdMode, setJdMode] = useState('paste'); // 'paste' | 'upload'
  const hasProfile = !!profile;
  const hasJD = jdText && jdText.trim().length > 20;

  useEffect(() => {
    setDocTypeFromQuery(params.get('type'));
  }, [params, setDocTypeFromQuery]);

  const onExtractClick = async () => {
    // Friendly wording; we will wire the actual extraction in backend later.
    await extractProfile();
  };

  const onJobAdFiles = (fs) => {
    // Optional: store uploaded ad images/PDFs if your store supports it
    const fn = useAppStore.getState().setJobAdFiles;
    if (typeof fn === 'function') fn(fs);
    // You can also kick off text reading server-side later.
  };

  const onContinue = () => {
    if (stage < 1) useAppStore.setState({ stage: 1 });
    navigate('/extract-review');
  };

  return (
    <section className="upload">
      <div className="container">
        <header className="upload__head">
          <h1>{docType === 'cv' ? 'Build your Resume' : 'Write your Cover Letter'}</h1>
          <p className="muted">
            Step 1: create your profile. Step 2: add the job ad. We’ll tailor your document from there.
          </p>
        </header>

        {/* STEP 1 — PROFILE ONLY */}
        <div className="upload__block">
          <div className="upload__blockhead">
            <span className="step-dot">1</span>
            <div className="titling">
              <h2>Your Profile</h2>
              <p className="muted">
                Start with your details. Choose one: <strong>upload your CV/Resume</strong> for quick pickup,
                or <strong>fill it in yourself</strong>.
              </p>
            </div>
            {hasProfile && (
              <span className="ready-pill">
                <LiaCheckCircle /> Profile captured
              </span>
            )}
          </div>

          <div className="upload__options">
            {/* Option A: Upload & pick up details */}
            <div className="opt opt--upload">
              <h3>Upload your CV/Resume</h3>
              <p className="muted small">PDF, DOCX, or a clear photo (PNG/JPG).</p>
              <FileDrop
                accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                onFiles={(fs) => addFiles(fs)}
              />
              <button className="btn btn-primary opt__action" onClick={onExtractClick}>
                <GiFairyWand /> Pick up my details
              </button>
            </div>

            {/* Option B: Manual entry */}
            <div className="opt opt--manual">
              <h3>Enter details manually</h3>
              <p className="muted small">Type your name, contacts, skills, and experience from scratch.</p>
              <button className="btn opt__action" onClick={() => setShowManual(true)}>
                <LuUserPlus /> Open profile form
              </button>
            </div>
          </div>
        </div>

        {/* STEP 2 — JOB AD ONLY (unlocks after profile) */}
        <div className={`upload__block ${!hasProfile ? 'is-disabled' : ''}`}>
          <div className="upload__blockhead">
            <span className="step-dot">2</span>
            <div className="titling">
              <h2>Job Ad / Description</h2>
              <p className="muted">
                This is what we’ll tailor to. Either <strong>paste the text</strong> or
                <strong> upload the job ad</strong> (screenshot or PDF). We’ll read the text automatically.
              </p>
            </div>
          </div>

          {/* Mode selector */}
          <div className="jd-mode">
            <button
              type="button"
              className={`pill ${jdMode === 'paste' ? 'is-active' : ''}`}
              onClick={() => setJdMode('paste')}
            >
              <LuClipboard /> Paste text
            </button>
            <button
              type="button"
              className={`pill ${jdMode === 'upload' ? 'is-active' : ''}`}
              onClick={() => setJdMode('upload')}
            >
              <LuImage /> Upload job ad
            </button>
          </div>

          <div className="upload__jdwrap">
            {!hasProfile && <div className="dim-overlay" aria-hidden />}
            {jdMode === 'paste' ? (
              <JDInput
                id="jd-textarea"
                placeholder="Paste the job description here… (responsibilities, requirements, must-haves)"
                onChange={(val) => setJDText(val)}
              />
            ) : (
              <div className="jobad-upload">
                <FileDrop
                  accept=".png,.jpg,.jpeg,.pdf"
                  multiple={false}
                  onFiles={onJobAdFiles}
                />
                <p className="muted tiny">
                  Tip: Clear, well-lit screenshots work best. We’ll pull out the text for you.
                </p>
              </div>
            )}
          </div>

          {/* Helpful tips */}
          <div className="tips">
            <div className="tip"><strong>Include:</strong> key duties, requirements, tech stack, and nice-to-haves.</div>
            <div className="tip"><strong>Optional:</strong> company mission or values if listed.</div>
          </div>
        </div>

        {/* Continue */}
        <div className="upload__actions">
          <button
            className="btn btn-primary"
            disabled={!(hasProfile && hasJD)}
            onClick={onContinue}
          >
            Continue
          </button>
        </div>

        <p className="upload__hint muted">
          You’ll review and tweak everything on the next step before generation.
        </p>
      </div>

      {showManual && <ManualProfileModal onClose={() => setShowManual(false)} />}
    </section>
  );
}
