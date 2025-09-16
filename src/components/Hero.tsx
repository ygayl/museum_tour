import React from 'react';

interface HeroProps {
  onStartTour: () => void;
}

const Hero: React.FC<HeroProps> = ({ onStartTour }) => {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/images/hero-museum.jpg)',
        }}
      />

      <div className="absolute inset-0 bg-gradient-to-br from-amber-900/60 via-orange-800/50 to-red-900/40" />

      <div className="relative z-10 flex h-full items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl text-center">
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
            Discover Art Like Never Before
          </h1>

          <p className="mx-auto mb-8 max-w-2xl text-lg leading-relaxed text-amber-50/90 sm:text-xl md:text-2xl">
            Immerse yourself in curated museum experiences designed to bring history's greatest masterpieces to life<br />
            <strong>in just one hour</strong>
          </p>

          <button
            onClick={onStartTour}
            className="inline-flex items-center rounded-full bg-gradient-to-r from-amber-500 to-orange-600 px-8 py-4 text-lg font-semibold text-white shadow-2xl transition-all duration-300 hover:from-amber-400 hover:to-orange-500 hover:shadow-xl hover:scale-105 focus:outline-none focus:ring-4 focus:ring-amber-500/50 sm:px-10 sm:py-5 sm:text-xl"
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
    </section>
  );
};

export default Hero;