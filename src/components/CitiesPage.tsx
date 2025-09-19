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
        <h1 className="mb-4 text-2xl font-bold text-museum-primary-900 font-serif md:text-4xl">
          Pick Your City
        </h1>
        {/* <p className="mx-auto max-w-2xl text-lg text-museum-neutral-600 font-light md:text-xl">
          Select your city to discover curated museum experiences
        </p> */}
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {cities.map((city) => (
          <div
            key={city.id}
            onClick={() => onSelectCity(city)}
            className="group relative overflow-hidden rounded-2xl shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-105 cursor-pointer"
            style={{ aspectRatio: '4/3' }}
          >
            <ResponsiveImage
              src={city.image}
              alt={city.name}
              className="absolute inset-0"
              priority={false}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

            <div className="absolute inset-0 flex items-end p-6">
              <div className="text-white">
                <h3 className="text-2xl font-bold font-serif md:text-3xl">{city.name}</h3>
                {city.description && (
                  <p className="mt-2 text-sm opacity-90 md:text-base">
                    {city.description}
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

export default CitiesPage;