import React from 'react';
import { Museum } from '../App';

interface MuseumsPageProps {
  museums: Museum[];
  onSelectMuseum: (museum: Museum) => void;
}

const MuseumsPage: React.FC<MuseumsPageProps> = ({ museums, onSelectMuseum }) => {
  return (
    <div className="bg-museum-gradient min-h-screen">
      <div className="container mx-auto px-6 py-4">
      <div className="text-center">
        <h1 className="mb-4 text-2xl font-light tracking-wide text-museum-primary-900 font-serif md:text-4xl">
          Choose A Museum
        </h1>
        {/* <p className="mx-auto max-w-2xl text-lg text-gray-600 md:text-xl">
          Select a museum to explore its curated tours
        </p> */}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {museums.map((museum, index) => (
          <button
            key={museum.id}
            onClick={() => onSelectMuseum(museum)}
            className="group bg-white border border-gray-200 overflow-hidden transition-colors duration-200 hover:border-gray-300 hover:bg-gray-50 cursor-pointer focus:outline-none focus:ring-2 focus:ring-museum-gold-500 focus:ring-inset text-left w-full"
          >
            {/* Image Section */}
            <div className="relative aspect-[4/3] bg-museum-neutral-100">
              <picture>
                <source
                  srcSet={`${museum.image}_720.webp`}
                  type="image/webp"
                />
                <source
                  srcSet={`${museum.image}_720.jpg`}
                  type="image/jpeg"
                />
                <img
                  src={`${museum.image}_720.jpg`}
                  alt={museum.name}
                  className="w-full h-full object-cover"
                  width="720"
                  height="540"
                  loading={index < 3 ? 'eager' : 'lazy'}
                  {...(index < 3 ? { fetchpriority: "high" } as React.ImgHTMLAttributes<HTMLImageElement> : {})}
                  decoding={index < 3 ? 'sync' : 'async'}
                />
              </picture>
            </div>

            {/* Text Section */}
            <div className="p-4">
              <h2 className="text-lg font-normal font-serif text-museum-primary-900 mb-2">
                {museum.name}
              </h2>
              {museum.description && (
                <p className="text-museum-neutral-600 text-sm leading-relaxed">
                  {museum.description}
                </p>
              )}
            </div>
          </button>
        ))}
      </div>
      </div>
    </div>
  );
};

export default MuseumsPage;