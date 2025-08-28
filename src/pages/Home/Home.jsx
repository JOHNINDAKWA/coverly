import React from 'react';
import LandingHero from './sections/LandingHero/LandingHero';
import Resumes from './sections/Resumes/Resumes';
import CoverLetters from './sections/CoverLetters/CoverLetters';
import Testimonials from './sections/Testimonials/Testimonials';
import './Home.css'; // keep if you want page-level tweaks

export default function Home() {
  return (
    <>
      <LandingHero />
      <Resumes />
      <CoverLetters />
      <Testimonials />
    </>
  );
}
