import React from 'react';
import BackgroundImage from './BackgroundImage';

interface HeroProps {
  onStartTour: () => void;
}

const Hero: React.FC<HeroProps> = ({ onStartTour }) => {
  return (
    <BackgroundImage
      src="/images/hero/hero"
      alt="Museum art gallery hero background"
      className="relative h-screen w-full overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-museum-primary-900/70 via-museum-primary-800/60 to-museum-neutral-900/50" />

      <div className="relative z-10 flex h-full items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl text-center">
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-white font-serif sm:text-5xl md:text-6xl lg:text-7xl">
            Discover Art Like Never Before
          </h1>

          <p className="mx-auto mb-8 max-w-2xl text-lg leading-relaxed text-white/90 font-light sm:text-xl md:text-2xl">
            Immerse yourself in curated museum experiences designed to bring history's greatest masterpieces to life<br />
            <strong>in just one hour</strong>
          </p>

          <button
            onClick={onStartTour}
            className="inline-flex items-center rounded-full bg-museum-gold-500 px-8 py-4 text-lg font-semibold text-museum-primary-900 shadow-2xl transition-all duration-300 hover:bg-museum-gold-400 hover:shadow-xl hover:scale-105 focus:outline-none focus:ring-4 focus:ring-museum-gold-500/50 sm:px-10 sm:py-5 sm:text-xl"
          >
            Explore
            <svg
              className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </BackgroundImage>
  );
};

export default Hero;