import React from 'react';
import { Museum } from '../App';
import ResponsiveImage from './ResponsiveImage';

interface MuseumsPageProps {
  museums: Museum[];
  onSelectMuseum: (museum: Museum) => void;
}

const MuseumsPage: React.FC<MuseumsPageProps> = ({ museums, onSelectMuseum }) => {
  return (
    <div className="container mx-auto px-6 py-4">
      <div className="text-center">
        <h1 className="mb-4 text-2xl font-bold text-museum-primary-900 font-serif md:text-4xl">
          Choose A Museum
        </h1>
        {/* <p className="mx-auto max-w-2xl text-lg text-gray-600 md:text-xl">
          Select a museum to explore its curated tours
        </p> */}
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {museums.map((museum) => (
          <div
            key={museum.id}
            onClick={() => onSelectMuseum(museum)}
            className="group relative overflow-hidden rounded-2xl shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-105 cursor-pointer"
            style={{ aspectRatio: '4/3' }}
          >
            <ResponsiveImage
              src={museum.image}
              alt={museum.name}
              className="absolute inset-0"
              priority={false}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

            <div className="absolute inset-0 flex items-end p-6">
              <div className="text-white">
                <h3 className="text-2xl font-bold font-serif md:text-3xl">{museum.name}</h3>
                {museum.description && (
                  <p className="mt-2 text-sm opacity-90 md:text-base">
                    {museum.description}
                  </p>
                )}
              </div>
            </div>

            <div className="absolute inset-0 bg-museum-gold-500/0 transition-colors duration-300 group-hover:bg-museum-gold-500/15" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MuseumsPage;