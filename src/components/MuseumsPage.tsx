import React from 'react';
import { Museum } from '../App';

interface MuseumsPageProps {
  museums: Museum[];
  onSelectMuseum: (museum: Museum) => void;
}

const MuseumsPage: React.FC<MuseumsPageProps> = ({ museums, onSelectMuseum }) => {
  return (
    <div className="bg-cream-gradient min-h-screen">
      <div className="container mx-auto px-6 py-4 max-w-7xl">

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 justify-items-center">
          {museums.map((museum, index) => (
            <button
              key={museum.id}
              onClick={() => onSelectMuseum(museum)}
              className="group bg-white rounded-xl shadow-sm hover:shadow-xl border border-gray-100 overflow-hidden transition-all duration-300 hover:-translate-y-1 cursor-pointer focus:outline-none focus:ring-2 focus:ring-museum-terracotta-500 focus:ring-offset-4 text-left w-full max-w-sm"
            >
              {/* Image Section */}
              <div className="relative aspect-[4/3] bg-museum-neutral-100 overflow-hidden">
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 z-10" />
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
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                    width="720"
                    height="540"
                    loading={index < 3 ? 'eager' : 'lazy'}
                    {...(index < 3 ? { fetchpriority: "high" } as React.ImgHTMLAttributes<HTMLImageElement> : {})}
                    decoding={index < 3 ? 'sync' : 'async'}
                  />
                </picture>
              </div>

              {/* Text Section */}
              <div className="p-6">
                <h2 className="text-xl font-medium font-serif text-museum-primary-900 mb-3 group-hover:text-museum-terracotta-600 transition-colors">
                  {museum.name}
                </h2>
                {museum.description && (
                  <p className="text-museum-neutral-600 text-sm leading-relaxed line-clamp-2">
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