import React from 'react';
import ResponsiveImage from './ResponsiveImage';

export interface City {
  id: string;
  name: string;
  image: string;
  description?: string;
}

interface CitiesPageProps {
  cities: City[];
  onSelectCity: (city: City) => void;
}

const CitiesPage: React.FC<CitiesPageProps> = ({ cities, onSelectCity }) => {
  return (
    <div className="cities-page-container bg-museum-gradient min-h-screen">
      <div className="container mx-auto px-6 py-4">
      <div className="text-center">
        <h1 className="cities-page-title mb-4 text-2xl font-light tracking-wide text-museum-primary-900 font-serif md:text-4xl">
          Pick Your City
        </h1>
        {/* <p className="mx-auto max-w-2xl text-lg text-museum-neutral-600 font-light md:text-xl">
          Select your city to discover curated museum experiences
        </p> */}
      </div>

      <div className="cities-grid grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cities.map((city) => (
          <button
            key={city.id}
            onClick={() => onSelectCity(city)}
            className="city-card group bg-white border border-gray-200 overflow-hidden transition-colors duration-200 hover:border-gray-300 hover:bg-gray-50 cursor-pointer focus:outline-none focus:ring-2 focus:ring-museum-gold-500 focus:ring-inset text-left w-full"
          >
            {/* Image Section */}
            <div className="city-image-container relative aspect-[4/3] bg-museum-neutral-100">
              <ResponsiveImage
                src={city.image}
                alt={city.name}
                className="city-image w-full h-full object-cover"
                priority={city.id === 'amsterdam' || city.id === 'london' || city.id === 'madrid'}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            </div>

            {/* Text Section */}
            <div className="city-info p-4">
              <h3 className="city-name text-lg font-normal font-serif text-museum-primary-900 mb-2">
                {city.name}
              </h3>
              {city.description && (
                <p className="city-description text-museum-neutral-600 text-sm leading-relaxed">
                  {city.description}
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

export default CitiesPage;