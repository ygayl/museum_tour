import React, { useState } from 'react';
import { Tour } from '../types/tour';
import ComingSoonModal from './ComingSoonModal';

interface TourSelectionPageProps {
  tours: Tour[];
  onSelectTour: (tour: Tour) => void;
  museumId: string;
  museumName: string;
  cityId: string;
  cityName: string;
}

const TourSelectionPage: React.FC<TourSelectionPageProps> = ({
  tours,
  onSelectTour,
  museumName,
}) => {
  const [selectedComingSoonTour, setSelectedComingSoonTour] = useState<Tour | null>(null);

  // Sort tours: active highlighted first, then active alphabetically, then coming soon
  const sortedTours = [...tours].sort((a, b) => {
    const aIsComingSoon = a.status === 'coming_soon';
    const bIsComingSoon = b.status === 'coming_soon';

    // Active tours come before coming soon
    if (!aIsComingSoon && bIsComingSoon) return -1;
    if (aIsComingSoon && !bIsComingSoon) return 1;

    // Within active tours, highlighted ones come first
    const aIsHighlighted = a.name.toLowerCase().includes('highlights');
    const bIsHighlighted = b.name.toLowerCase().includes('highlights');

    if (aIsHighlighted && !bIsHighlighted) return -1;
    if (!aIsHighlighted && bIsHighlighted) return 1;

    // Then sort alphabetically
    return a.name.localeCompare(b.name);
  });

  const handleTourClick = (tour: Tour) => {
    if (tour.status === 'coming_soon') {
      setSelectedComingSoonTour(tour);
    } else {
      onSelectTour(tour);
    }
  };

  return (
    <div className="bg-cream-gradient min-h-screen">
      <div className="container mx-auto px-6 py-4">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-light tracking-wide text-museum-primary-900 font-serif md:text-4xl">
            Choose A Tour
          </h1>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sortedTours.map((tour, index) => {
            const isComingSoon = tour.status === 'coming_soon';

            return (
              <button
                key={tour.id}
                onClick={() => handleTourClick(tour)}
                className={`group bg-white overflow-hidden transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-museum-terracotta-500 focus:ring-inset text-left w-full ${
                  isComingSoon
                    ? 'border-2 border-dashed border-museum-terracotta-300 hover:border-museum-terracotta-500'
                    : 'border border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
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
                      className={`w-full h-full object-cover ${isComingSoon ? 'opacity-70' : ''}`}
                      width="720"
                      height="540"
                      loading={index < 2 ? 'eager' : 'lazy'}
                      {...(index < 2 ? { fetchpriority: "high" } as React.ImgHTMLAttributes<HTMLImageElement> : {})}
                      decoding={index < 2 ? 'sync' : 'async'}
                    />
                  </picture>

                  {/* Coming Soon Overlay */}
                  {isComingSoon && (
                    <div className="absolute inset-0 bg-white/30" />
                  )}

                  {/* Coming Soon Badge */}
                  {isComingSoon && (
                    <div className="absolute top-3 right-3">
                      <span className="bg-museum-terracotta-500 text-white text-xs font-medium px-2.5 py-1 rounded-full shadow-sm">
                        Coming Soon
                      </span>
                    </div>
                  )}
                </div>

                {/* Text Section */}
                <div className={`p-4 ${isComingSoon ? 'opacity-60' : ''}`}>
                  <h2 className="text-lg font-normal font-serif text-museum-primary-900 mb-2">
                    {tour.name}
                  </h2>
                  <p className="text-museum-neutral-600 text-sm mb-2 leading-relaxed">
                    {tour.description}
                  </p>
                  <p className={`font-normal text-sm ${
                    isComingSoon ? 'text-museum-terracotta-500' : 'text-museum-terracotta-600'
                  }`}>
                    {isComingSoon ? 'Get notified when available' : `Duration: ${tour.duration}`}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Coming Soon Modal */}
      <ComingSoonModal
        isOpen={selectedComingSoonTour !== null}
        onClose={() => setSelectedComingSoonTour(null)}
        tour={selectedComingSoonTour || { id: '', name: '', museumId: '', description: '', duration: '', theme: '', image: '', introAudio: '', artworks: [] }}
        museumName={museumName}
      />
    </div>
  );
};

export default TourSelectionPage;
