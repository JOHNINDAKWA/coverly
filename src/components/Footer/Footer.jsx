import React from 'react';
import { Link } from 'react-router-dom';
import { FaXTwitter, FaLinkedin, FaFacebook, FaGithub } from 'react-icons/fa6';
import { LuMail, LuArrowRight, LuShield, LuSparkles } from 'react-icons/lu';
import './Footer.css';

export default function Footer() {
  const year = new Date().getFullYear();

  function handleSubscribe(e) {
    e.preventDefault(); // wire to backend later
  }

  return (
    <footer className="cvf-footer">
      {/* Top call-to-action */}
      <section className="cvf-cta">
        <div className="cvf-cta__inner">
          <div className="cvf-cta__text">
            <h3>Ready to land the interview?</h3>
            <p>Create a tailored resume & cover letter in minutes.</p>
          </div>
          <div className="cvf-cta__actions">
            <Link className="cvf-btn cvf-btn--primary" to="/upload">Get Started</Link>
            <Link className="cvf-btn cvf-btn--ghost" to="/templates">View Templates</Link>
          </div>
        </div>
      </section>

      {/* Middle row: links + contact + badges */}
      <div className="cvf-main">
        <nav className="cvf-links" aria-label="Footer">
          <Link to="/about">About</Link>
          <span className="sep" aria-hidden>•</span>
          <Link to="/accessibility">Accessibility</Link>
          <span className="sep" aria-hidden>•</span>
          <Link to="/contact">Contact</Link>
          <span className="sep" aria-hidden>•</span>
          <Link to="/privacy">Privacy Policy</Link>
          <span className="sep" aria-hidden>•</span>
          <Link to="/terms">Terms of Service</Link>
          <span className="sep" aria-hidden>•</span>
          <Link to="/templates">Our Resume Templates</Link>
        </nav>

        <div className="cvf-aside">
          <div className="cvf-contact">
            <span className="label">Need help?</span>
            <a href="mailto:support@coverly.com">support@coverly.com</a>
            <span className="sep" aria-hidden>•</span>
            <a href="tel:+254702207999">+254 7022 07999</a>
          </div>

          <div className="cvf-badges">
            <div className="badge"><LuShield /> Secure Payments</div>
            <div className="badge"><LuSparkles /> ATS Friendly</div>
          </div>
        </div>
      </div>

      {/* NEW deep section: brand, columns, newsletter */}
      <section className="cvf-deep">
        <div className="cvf-deep__inner">
          <div className="cvf-brandbox">
            <div className="cvf-logo">
              <span className="cvf-logo__icon" aria-hidden>✦</span>
              <span className="cvf-logo__word">Coverly</span>
            </div>
            <p className="cvf-blurb">
              AI-powered resumes & cover letters that are fast, relevant, and beautifully formatted.
            </p>
            <div className="cvf-trust">
              <span className="cvf-pill">Export to PDF</span>
              <span className="cvf-pill">Template Library</span>
              <span className="cvf-pill">Privacy First</span>
            </div>
          </div>

          <div className="cvf-col">
            <h4>Product</h4>
            <ul>
              <li><Link to="/upload?type=cv">Build a Resume</Link></li>
              <li><Link to="/upload?type=cover-letter">Write a Cover Letter</Link></li>
              <li><Link to="/templates">Templates</Link></li>
              <li><Link to="/pricing">Pricing</Link></li>
            </ul>
          </div>

          <div className="cvf-col">
            <h4>Resources</h4>
            <ul>
              <li><Link to="/guides/resume-tips">Resume Tips</Link></li>
              <li><Link to="/guides/cover-letter">Cover Letter Guide</Link></li>
              <li><Link to="/faq">FAQ</Link></li>
              <li><Link to="/blog">Blog</Link></li>
            </ul>
          </div>

          <div className="cvf-newsletter">
            <h4>Get interview tips</h4>
            <p className="muted">One short email per week. No spam.</p>
            <form className="cvf-news" onSubmit={handleSubscribe}>
              <div className="cvf-news__field">
                <LuMail className="mail-ico" aria-hidden />
                <input
                  type="email"
                  placeholder="you@example.com"
                  aria-label="Email address"
                  required
                />
                <button type="submit" aria-label="Subscribe">
                  <LuArrowRight />
                </button>
              </div>
            </form>
            <small className="cvf-privacy">
              By subscribing you agree to our <Link to="/privacy">Privacy Policy</Link>.
            </small>
          </div>
        </div>
      </section>

      {/* Bottom bar: copyright + socials */}
      <div className="cvf-bottom">
        <div className="cvf-copy">© {year} Coverly. All Rights Reserved.</div>
        <div className="cvf-social" aria-label="Social links">
          <a href="#" aria-label="X / Twitter"><FaXTwitter /></a>
          <a href="#" aria-label="LinkedIn"><FaLinkedin /></a>
          <a href="#" aria-label="Facebook"><FaFacebook /></a>
          <a href="#" aria-label="GitHub"><FaGithub /></a>
        </div>
      </div>
    </footer>
  );
}
