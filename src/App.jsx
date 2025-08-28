import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';

import Home from './pages/Home/Home';
import Upload from './pages/Upload/Upload';
import ExtractReview from './pages/ExtractReview/ExtractReview';
import Generate from './pages/Generate/Generate';
import Templates from './pages/Templates/Templates';
import PreviewPay from './pages/PreviewPay/PreviewPay';
import PostPay from './pages/PostPay/PostPay';

import { useAppStore } from './state/useAppStore';
import './index.css'; // ensure this includes the .app-shell styles below
import StepTracker from './components/StepTracker/StepTracker';

function StepGuard({ minStage, children }) {
  const stage = useAppStore(s => s.stage);
  const order = ['/upload', '/extract-review', '/generate', '/templates', '/preview-pay', '/done'];
  if (stage < minStage) return <Navigate to={order[stage]} replace />;
  return children;
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

export default function App() {
 const location = useLocation();
  const wizardPaths = ['/upload', '/extract-review', '/generate', '/templates', '/preview-pay', '/done'];
  const showStepper = wizardPaths.some(p => location.pathname.startsWith(p));

  return (
    <div className={`app-shell ${showStepper ? 'is-wizard' : ''}`}>
      <a href="#main" className="skip-link">Skip to content</a>

      <Header />

      {showStepper && <StepTracker   />}

      <main id="main" className="app-main">
        <ScrollToTop />
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/upload" element={<Upload />} />
          <Route
            path="/extract-review"
            element={
              <StepGuard minStage={1}>
                <ExtractReview />
              </StepGuard>
            }
          />
          <Route
            path="/generate"
            element={
              <StepGuard minStage={2}>
                <Generate />
              </StepGuard>
            }
          />
          <Route
            path="/templates"
            element={
              <StepGuard minStage={2}>
                <Templates />
              </StepGuard>
            }
          />
          <Route
            path="/preview-pay"
            element={
              <StepGuard minStage={3}>
                <PreviewPay />
              </StepGuard>
            }
          />
          <Route
            path="/done"
            element={
              <StepGuard minStage={4}>
                <PostPay />
              </StepGuard>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}
