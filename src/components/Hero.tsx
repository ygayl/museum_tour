import React from 'react';

interface HeroProps {
  onStartTour: () => void;
}

const Hero: React.FC<HeroProps> = ({ onStartTour }) => {
  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        height: 'var(--app-height)',
        minHeight: 'calc(var(--app-height) - var(--safe-area-inset-top, 0px) - var(--safe-area-inset-bottom, 0px))'
      }}
    >
      {/* Optimized Hero Image with Modern Formats */}
      <picture className="absolute inset-0">
        <source
          media="(max-width: 640px)"
          srcSet="/images/hero/hero_720.webp"
          sizes="100vw"
          type="image/webp"
        />
        <source
          media="(min-width: 641px)"
          srcSet="/images/hero/hero_720.webp 720w, /images/hero/hero_1080.webp 1080w"
          sizes="100vw"
          type="image/webp"
        />
        <source
          media="(max-width: 640px)"
          srcSet="/images/hero/hero_720.jpg"
          sizes="100vw"
          type="image/jpeg"
        />
        <img
          src="/images/hero/hero_720.jpg"
          srcSet="/images/hero/hero_720.jpg 720w, /images/hero/hero_1080.jpg 1080w"
          sizes="100vw"
          alt="Museum art gallery hero background"
          className="w-full h-full object-cover"
          loading="eager"
          {...({ fetchpriority: "high" } as any)}
          decoding="async"
        />
      </picture>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-museum-primary-900/70 via-museum-primary-800/60 to-museum-neutral-900/50" />

      {/* Content */}
      <div className="relative z-10 flex h-full items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl text-center">
          <h1 className="hero-title mb-6 text-4xl font-light tracking-wide text-white font-serif sm:text-5xl md:text-6xl lg:text-7xl">
            Discover Art Like Never Before
          </h1>

          <p className="hero-paragraph">
            Immerse yourself in curated museum experiences designed to bring history's greatest masterpieces to life<br />
            <em className="font-light italic">in just one hour</em>
          </p>

          <button
            onClick={onStartTour}
            className="inline-flex items-center rounded-full bg-museum-gold-500 px-8 py-4 text-lg font-normal text-museum-primary-900 shadow-2xl hover:bg-museum-gold-400 focus:outline-none focus:ring-4 focus:ring-museum-gold-500/50 sm:px-10 sm:py-5 sm:text-xl"
          >
            Explore
            <svg
              className="ml-2 h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;