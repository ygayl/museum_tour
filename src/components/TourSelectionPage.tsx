import React from 'react';
import { Tour } from '../App';
import ResponsiveImage from './ResponsiveImage';

interface TourSelectionPageProps {
  tours: Tour[];
  onSelectTour: (tour: Tour) => void;
}

const TourSelectionPage: React.FC<TourSelectionPageProps> = ({ tours, onSelectTour }) => {
  // Sort tours with highlighted tours first, then alphabetically
  const sortedTours = [...tours].sort((a, b) => {
    // Check if tour is highlighted (contains "Highlights" in name)
    const aIsHighlighted = a.name.toLowerCase().includes('highlights');
    const bIsHighlighted = b.name.toLowerCase().includes('highlights');

    // If one is highlighted and the other isn't, prioritize the highlighted one
    if (aIsHighlighted && !bIsHighlighted) return -1;
    if (!aIsHighlighted && bIsHighlighted) return 1;

    // If both are highlighted or neither is highlighted, sort alphabetically
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="container mx-auto px-6 py-4">
      <div className="text-center">
        <h1 className="mb-4 text-2xl font-light tracking-wide text-museum-primary-900 font-serif md:text-4xl">
          Choose A Tour
        </h1>
        {/* <p className="text-center text-base italic text-museum-gold-600/80 mt-2 flex items-center justify-center gap-2 font-sans">
          🎧 Choose a tour and dive into the stories behind the art
        </p> */}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sortedTours.map((tour, index) => (
          <div
            key={tour.id}
            onClick={() => onSelectTour(tour)}
            className="group bg-white border border-gray-200 overflow-hidden transition-colors duration-200 hover:border-gray-300 hover:bg-gray-50 cursor-pointer"
          >
            {/* Image Section */}
            <div className="relative aspect-[4/3] bg-museum-neutral-100">
              <ResponsiveImage
                src={tour.image}
                alt={tour.name}
                className="w-full h-full object-cover"
                priority={index < 2}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            </div>

            {/* Text Section */}
            <div className="p-4">
              <h3 className="text-lg font-normal font-serif text-museum-primary-900 mb-2">
                {tour.name}
              </h3>
              <p className="text-museum-neutral-600 text-sm mb-2 leading-relaxed">
                {tour.description}
              </p>
              <p className="text-museum-gold-600 font-normal text-sm">
                Duration: {tour.duration}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TourSelectionPage;