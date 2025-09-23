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
    <div className="container mx-auto px-6 py-4">
      <div className="text-center">
        <h1 className="mb-4 text-2xl font-light tracking-wide text-museum-primary-900 font-serif md:text-4xl">
          Pick Your City
        </h1>
        {/* <p className="mx-auto max-w-2xl text-lg text-museum-neutral-600 font-light md:text-xl">
          Select your city to discover curated museum experiences
        </p> */}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cities.map((city) => (
          <div
            key={city.id}
            onClick={() => onSelectCity(city)}
            className="group bg-white border border-gray-200 overflow-hidden transition-colors duration-200 hover:border-gray-300 hover:bg-gray-50 cursor-pointer"
          >
            {/* Image Section */}
            <div className="relative aspect-[4/3] bg-museum-neutral-100">
              <ResponsiveImage
                src={city.image}
                alt={city.name}
                className="w-full h-full object-cover"
                priority={false}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            </div>

            {/* Text Section */}
            <div className="p-4">
              <h3 className="text-lg font-normal font-serif text-museum-primary-900 mb-2">
                {city.name}
              </h3>
              {city.description && (
                <p className="text-museum-neutral-600 text-sm leading-relaxed">
                  {city.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CitiesPage;