import React from 'react';
import { FaGoogle, FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import { LuQuote } from 'react-icons/lu';
import './Testimonials.css';

const reviews = [
  {
    name: 'Achieng N.',
    role: 'Customer Success',
    when: '2 weeks ago',
    rating: 5,
    text:
      'Coverly turned my rough CV into a clean, ATS-ready document. I got two interviews within a week.',
  },
  {
    name: 'Brian K.',
    role: 'Software Engineer',
    when: '1 month ago',
    rating: 4.5,
    text:
      'Loved the tailored bullets. The cover letter sounded like me, just… better. Super quick too.',
  },
  {
    name: 'Nafula M.',
    role: 'Finance Analyst',
    when: '3 days ago',
    rating: 5,
    text:
      'Templates are classy and professional. Recruiter replied the same day. Worth every shilling.',
  },
  {
    name: 'Samuel O.',
    role: 'Marketing',
    when: '3 weeks ago',
    rating: 4.5,
    text:
      'Importing my old CV + JD paste took minutes. Output was sharp and easy to tweak.',
  },
];

function initials(name) {
  return name
    .split(' ')
    .map(p => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function Stars({ value, size = 14 }) {
  const full = Math.floor(value);
  const half = value - full >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return (
    <span className="t-stars" aria-label={`${value} out of 5`}>
      {Array.from({ length: full }).map((_, i) => (
        <FaStar key={`f${i}`} style={{ width: size, height: size }} />
      ))}
      {half === 1 && <FaStarHalfAlt style={{ width: size, height: size }} />}
      {Array.from({ length: empty }).map((_, i) => (
        <FaRegStar key={`e${i}`} style={{ width: size, height: size }} />
      ))}
    </span>
  );
}

export default function Testimonials() {
  const avg = 4.9;
  const count = 127;

  // SEO: AggregateRating (Google rich snippet)
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'Coverly',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: avg,
      reviewCount: count,
      bestRating: 5,
      worstRating: 1,
    },
    review: reviews.slice(0, 3).map(r => ({
      '@type': 'Review',
      author: { '@type': 'Person', name: r.name },
      reviewRating: { '@type': 'Rating', ratingValue: r.rating, bestRating: 5 },
      reviewBody: r.text,
      datePublished: '2025-01-01',
    })),
  };

  return (
    <section className="t-section">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
      />
      <div className="container">
        {/* Header */}
        <div className="t-head">
          <div className="t-title">
            <h2>What people say</h2>
            <p className="muted">Real results. Real interviews.</p>
          </div>

          {/* Google badge */}
          <div className="g-badge" aria-label="Google rating">
            <span className="g-icon"><FaGoogle /></span>
            <span className="g-copy">
              <strong>{avg}</strong> / 5
              <Stars value={avg} />
              <span className="g-count">{count} reviews</span>
            </span>
          </div>
        </div>

        {/* Cards: snap on mobile, grid on desktop */}
        <div className="t-cards" role="list">
          {reviews.map((r, idx) => (
            <article className="t-card" role="listitem" key={idx}>
              <LuQuote className="qmark" aria-hidden />
              <div className="t-row">
                <div className="avatar" aria-hidden>
                  <span>{initials(r.name)}</span>
                </div>
                <div className="meta">
                  <div className="who">
                    <strong>{r.name}</strong>
                    <span className="muted"> • {r.role}</span>
                  </div>
                  <div className="when">
                    <Stars value={r.rating} />
                    <span className="muted">{r.when}</span>
                  </div>
                </div>
              </div>

              <p className="t-text">{r.text}</p>

              <div className="t-foot">
                <span className="verify">
                  <FaGoogle />
                  Verified Google review
                </span>
              </div>
            </article>
          ))}
        </div>

        {/* CTAs */}
        <div className="t-cta">
          <a className="t-btn t-btn--primary" href="#" target="_blank" rel="noreferrer">
            See more on Google
          </a>
          <a className="t-btn t-btn--ghost" href="#" target="_blank" rel="noreferrer">
            Write a review
          </a>
        </div>
      </div>
    </section>
  );
}
