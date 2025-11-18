import React from 'react';
import { Tour } from '../types/tour';

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
    <div className="bg-cream-gradient min-h-screen">
      <div className="container mx-auto px-6 py-4">
      <div className="text-center">
        <h1 className="mb-4 text-2xl font-light tracking-wide text-museum-primary-900 font-serif md:text-4xl">
          Choose A Tour
        </h1>
        {/* <p className="text-center text-base italic text-museum-terracotta-600/80 mt-2 flex items-center justify-center gap-2 font-sans">
          🎧 Choose a tour and dive into the stories behind the art
        </p> */}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sortedTours.map((tour, index) => (
          <button
            key={tour.id}
            onClick={() => onSelectTour(tour)}
            className="group bg-white border border-gray-200 overflow-hidden transition-colors duration-200 hover:border-gray-300 hover:bg-gray-50 cursor-pointer focus:outline-none focus:ring-2 focus:ring-museum-terracotta-500 focus:ring-inset text-left w-full"
          >
            {/* Image Section */}
            <div className="relative aspect-[4/3] bg-museum-neutral-100">
              <picture>
                <source
                  srcSet={`${tour.image.replace('.jpg', '')}_720.webp`}
                  type="image/webp"
                />
                <source
                  srcSet={`${tour.image.replace('.jpg', '')}_720.jpg`}
                  type="image/jpeg"
                />
                <img
                  src={`${tour.image.replace('.jpg', '')}_720.jpg`}
                  alt={tour.name}
                  className="w-full h-full object-cover"
                  width="720"
                  height="540"
                  loading={index < 2 ? 'eager' : 'lazy'}
                  {...(index < 2 ? { fetchpriority: "high" } as React.ImgHTMLAttributes<HTMLImageElement> : {})}
                  decoding={index < 2 ? 'sync' : 'async'}
                />
              </picture>
            </div>

            {/* Text Section */}
            <div className="p-4">
              <h2 className="text-lg font-normal font-serif text-museum-primary-900 mb-2">
                {tour.name}
              </h2>
              <p className="text-museum-neutral-600 text-sm mb-2 leading-relaxed">
                {tour.description}
              </p>
              <p className="text-museum-terracotta-600 font-normal text-sm">
                Duration: {tour.duration}
              </p>
            </div>
          </button>
        ))}
      </div>
      </div>
    </div>
  );
};

export default TourSelectionPage;