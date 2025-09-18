import React from 'react';
import { Tour } from '../App';

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
    <div className="container mx-auto px-4 py-4">
      <div className="text-center">
        <h1 className="mb-4 text-3xl font-bold text-museum-primary-900 font-serif md:text-4xl">
          Choose A Tour
        </h1>
        {/* <p className="text-center text-base italic text-museum-gold-600/80 mt-2 flex items-center justify-center gap-2 font-sans">
          🎧 Choose a tour and dive into the stories behind the art
        </p> */}
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {sortedTours.map((tour) => (
          <div
            key={tour.id}
            onClick={() => onSelectTour(tour)}
            className="group bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105 cursor-pointer"
          >
            {/* Image Section */}
            <div className="relative aspect-[4/3] bg-museum-neutral-100">
              <img
                src={tour.image}
                alt={tour.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-museum-gold-500/0 transition-colors duration-300 group-hover:bg-museum-gold-500/10" />
            </div>

            {/* Text Section */}
            <div className="p-6">
              <h3 className="text-xl font-bold font-serif text-museum-primary-900 mb-2">
                {tour.name}
              </h3>
              <p className="text-museum-neutral-600 text-sm mb-3 leading-relaxed">
                {tour.description}
              </p>
              <p className="text-museum-gold-600 font-medium text-sm">
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