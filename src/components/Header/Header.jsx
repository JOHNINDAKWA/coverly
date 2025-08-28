import React, { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation } from 'react-router-dom';
import {
  LuMenu, LuX, LuFileText, LuPenLine, LuLogIn, LuSparkles, LuSun, LuMoon,
} from 'react-icons/lu';
import './Header.css';

export default function Header() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  // Theme handling (self-contained)
  const systemPrefersDark = useMemo(
    () => window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches,
    []
  );
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('coverly-theme');
    if (saved === 'light' || saved === 'dark') return saved;
    return systemPrefersDark ? 'dark' : 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('coverly-theme', theme);
  }, [theme]);

  // Close drawer on route change
  useEffect(() => setOpen(false), [pathname]);

  // Lock body scroll while drawer open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = open ? 'hidden' : prev || '';
    return () => (document.body.style.overflow = prev || '');
  }, [open]);

  return (
    <>
      <header className="cv-header">
        <div className="cv-header__inner">
          {/* Brand */}
          <Link to="/" className="cv-brand" aria-label="Coverly home">
            <span className="cv-brand__icon" aria-hidden><LuSparkles /></span>
            <span className="cv-brand__word">Coverly</span>
          </Link>

          {/* Desktop nav */}
          <nav className="cv-nav cv-nav--desktop" aria-label="Primary">
            <Link className="cv-nav__link" to="/upload?type=cv">
              <LuFileText className="cv-nav__ico" /><span>Resume</span>
            </Link>
            <Link className="cv-nav__link" to="/upload?type=cover-letter">
              <LuPenLine className="cv-nav__ico" /><span>Cover&nbsp;Letter</span>
            </Link>
            <Link className="cv-nav__link" to="/login">
              <LuLogIn className="cv-nav__ico" /><span>Login</span>
            </Link>
            <button
              className="cv-nav__link cv-nav__link--ghost"
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              aria-label="Toggle theme"
              title="Toggle theme"
            >
              {theme === 'light' ? <LuMoon /> : <LuSun />}
              <span>{theme === 'light' ? 'Dark' : 'Light'}</span>
            </button>
          </nav>

          {/* Desktop CTA */}
          <div className="cv-header__actions">
            <Link className="cv-btn cv-btn--primary" to="/upload">Get Started</Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="cv-menu-btn"
            aria-label="Open menu"
            aria-expanded={open}
            aria-controls="cv-mobile-sidebar"
            onClick={() => setOpen(v => !v)}
          >
            {open ? <LuX /> : <LuMenu />}
          </button>
        </div>
      </header>

      {/* ===== Overlay + Sidebar rendered to <body> so they cover the whole screen ===== */}
      {createPortal(
        <>
          <div
            className={`cv-overlay ${open ? 'is-open' : ''}`}
            onClick={() => setOpen(false)}
            aria-hidden={!open}
          />
          <aside
            id="cv-mobile-sidebar"
            className={`cv-sidebar ${open ? 'is-open' : ''}`}
            role="dialog"
            aria-modal="true"
          >
            <div className="cv-sidebar__top">
              <Link to="/" className="cv-brand cv-brand--mobile" aria-label="Coverly home">
                <span className="cv-brand__icon" aria-hidden><LuSparkles /></span>
                <span className="cv-brand__word">Coverly</span>
              </Link>
              <button className="cv-menu-close" aria-label="Close menu" onClick={() => setOpen(false)}>
                <LuX />
              </button>
            </div>

            <div className="cv-sidebar__content">
              <nav className="cv-nav cv-nav--mobile" aria-label="Mobile">
                <Link className="cv-mobile__link" to="/upload?type=cv">
                  <LuFileText className="cv-nav__ico" /> <span>Resume</span>
                </Link>
                <Link className="cv-mobile__link" to="/upload?type=cover-letter">
                  <LuPenLine className="cv-nav__ico" /> <span>Cover Letter</span>
                </Link>
                <Link className="cv-mobile__link" to="/login">
                  <LuLogIn className="cv-nav__ico" /> <span>Login</span>
                </Link>

                <button
                  className="cv-mobile__link cv-nav__link--ghost"
                  onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                  aria-label="Toggle theme"
                  title="Toggle theme"
                >
                  {theme === 'light' ? <LuMoon /> : <LuSun />}
                  <span>{theme === 'light' ? 'Dark' : 'Light'} Mode</span>
                </button>
              </nav>
            </div>

            <div className="cv-sidebar__cta">
              <Link className="cv-btn cv-btn--primary cv-btn--block" to="/upload">
                Get Started
              </Link>
            </div>
          </aside>
        </>,
        document.body
      )}
    </>
  );
}
