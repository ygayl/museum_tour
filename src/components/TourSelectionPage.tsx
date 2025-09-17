import React from 'react';
import { Tour } from '../App';

interface TourSelectionPageProps {
  tours: Tour[];
  onSelectTour: (tour: Tour) => void;
}

const TourSelectionPage: React.FC<TourSelectionPageProps> = ({ tours, onSelectTour }) => {
  // Sort tours alphabetically by name
  const sortedTours = [...tours].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="px-4 py-6 bg-gradient-to-br from-amber-50/30 to-orange-50/20 min-h-screen">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Tours
        </h2>
        <p className="text-gray-600">
          Choose your 1-hour cultural adventure
        </p>
      </div>

      <div className="max-w-lg mx-auto">
        <div className="space-y-6">
          {sortedTours.map((tour) => (
            <div
              key={tour.id}
              className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden cursor-pointer transform transition-all duration-200 hover:scale-102 hover:shadow-xl border border-amber-100"
              onClick={() => onSelectTour(tour)}
            >
              <div className="relative h-48">
                <img
                  src={tour.image}
                  alt={tour.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
                  <div className="p-4 text-white">
                    <h4 className="text-xl font-bold mb-1">{tour.name}</h4>
                    <p className="text-sm opacity-90">{tour.theme}</p>
                  </div>
                </div>
              </div>

              <div className="p-4">
                <p className="text-gray-600 text-sm mb-3">{tour.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-blue-600 font-medium text-sm">
                    Duration: {tour.duration}
                  </span>
                  <button className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:from-amber-600 hover:to-orange-600 transition-all duration-200 border border-amber-400">
                    Start Tour
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TourSelectionPage;