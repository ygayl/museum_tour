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

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {museums.map((museum) => (
          <div
            key={museum.id}
            onClick={() => onSelectMuseum(museum)}
            className="group bg-white border border-gray-200 overflow-hidden transition-colors duration-200 hover:border-gray-300 hover:bg-gray-50 cursor-pointer"
          >
            {/* Image Section */}
            <div className="relative aspect-[4/3] bg-museum-neutral-100">
              <ResponsiveImage
                src={museum.image}
                alt={museum.name}
                className="w-full h-full object-cover"
                priority={false}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            </div>

            {/* Text Section */}
            <div className="p-4">
              <h3 className="text-lg font-bold font-serif text-museum-primary-900 mb-2">
                {museum.name}
              </h3>
              {museum.description && (
                <p className="text-museum-neutral-600 text-sm leading-relaxed">
                  {museum.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MuseumsPage;