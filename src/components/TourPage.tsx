import React, { useEffect, useMemo } from 'react';
import { ChevronRight, MapPin } from 'lucide-react';
import { Tour, Stop } from '../types/tour';
import { useAnalytics } from '../hooks/useAnalytics';

interface TourPageProps {
  tour: Tour;
  onBackToTours?: () => void;
  onSelectStop?: (stop: Stop) => void;
  analyticsEnabled?: boolean;
}

const TourPage: React.FC<TourPageProps> = ({ tour, onBackToTours, onSelectStop, analyticsEnabled = false }) => {

  const analytics = useAnalytics();

  // Track tour start
  useEffect(() => {
    if (analyticsEnabled) {
      analytics.trackFunnelStep('tour_started', 5, { tour_name: tour.name });
    }
    // analytics is memoized and stable, so it's safe to omit from deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [analyticsEnabled, tour.name]);

  const handleStopClick = (stop: Stop) => {
    if (onSelectStop) {
      onSelectStop(stop);
    }
  };

  // Memoize the introduction stop to prevent recreation on every render
  const introductionStop = useMemo((): Stop | null => {
    if (!tour.introAudio) return null;
    return {
      id: `intro-${tour.id}`,
      title: "Introduction",
      image: tour.image,
      audio: tour.introAudio,
      artist: "",
      room: "",
      narration: tour.introNarration || "",
      order: 0
    };
  }, [tour.id, tour.image, tour.introAudio, tour.introNarration]);

  // Memoize the conclusion stop to prevent recreation on every render
  const conclusionStop = useMemo((): Stop | null => {
    if (!tour.outroAudio) return null;
    return {
      id: `conclusion-${tour.id}`,
      title: "Conclusion",
      image: tour.image,
      audio: tour.outroAudio,
      artist: "",
      room: "",
      narration: tour.outroNarration || "",
      order: tour.artworks.length + 1
    };
  }, [tour.id, tour.image, tour.outroAudio, tour.outroNarration, tour.artworks.length]);

  // Memoize all stops to prevent array recreation on every render
  const allStops = useMemo(() => {
    const stops = [];
    if (introductionStop) stops.push(introductionStop);
    stops.push(...tour.artworks);
    if (conclusionStop) stops.push(conclusionStop);
    return stops;
  }, [introductionStop, tour.artworks, conclusionStop]);


  return (
    <div className="bg-cream-gradient min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column - Sticky Tour Info */}
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-24 space-y-6">
              <div className="aspect-[4/3] rounded-xl overflow-hidden shadow-lg bg-museum-neutral-100">
                <img
                  src={tour.image}
                  alt={tour.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div>
                <h1 className="text-3xl justify-center lg:text-4xl text-museum-primary-900 font-serif mb-4 leading-tight">
                  {tour.name}
                </h1>
                <p className="text-museum-neutral-600 justify-center leading-relaxed">
                  {tour.description}
                </p>
                <div className="mt-4 flex items-center justify-center gap-4 text-sm text-museum-neutral-500">
                  <span>{tour.duration}</span>
                  <span>•</span>
                  <span>{allStops.length} Stops</span>
                </div>
              </div>

              {/* Mobile-only Feedback Link (hidden on desktop to avoid clutter) */}
              <div className="lg:hidden">
                 {/* Feedback Section Mobile */}
              </div>
            </div>
          </div>

          {/* Right Column - Stops List */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-100">
              {allStops.map((stop, index) => {
                return (
                  <button
                    key={stop.id}
                    onClick={() => handleStopClick(stop)}
                    className="w-full p-4 sm:p-6 text-left hover:bg-gray-50 transition-colors group focus:outline-none focus:ring-2 focus:ring-museum-terracotta-500 focus:ring-inset"
                  >
                    <div className="flex items-center gap-4 sm:gap-6">
                      {/* Larger Thumbnail */}
                      <div className="flex-shrink-0 relative">
                        <picture className="block w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden shadow-sm group-hover:shadow-md transition-shadow">
                          <source
                            srcSet={stop.image.includes('.jpg') || stop.image.includes('.jpeg')
                              ? `${stop.image.replace(/\.(jpg|jpeg)$/, '')}_360.webp`
                              : `${stop.image}_360.webp`}
                            type="image/webp"
                          />
                          <source
                            srcSet={stop.image.includes('.jpg') || stop.image.includes('.jpeg')
                              ? `${stop.image.replace(/\.(jpg|jpeg)$/, '')}_360.jpg`
                              : `${stop.image}_360.jpg`}
                            type="image/jpeg"
                          />
                          <img
                            src={stop.image.includes('.jpg') || stop.image.includes('.jpeg')
                              ? `${stop.image.replace(/\.(jpg|jpeg)$/, '')}_360.jpg`
                              : `${stop.image}_360.jpg`}
                            alt={stop.title}
                            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                            width="96"
                            height="96"
                            loading={index < 5 ? 'eager' : 'lazy'}
                            {...(index < 5 ? { fetchpriority: "high" } as React.ImgHTMLAttributes<HTMLImageElement> : {})}
                            decoding={index < 5 ? 'sync' : 'async'}
                          />
                        </picture>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-3 mb-1">
                          <span className="w-6 text-xs font-medium text-museum-terracotta-600 font-mono flex-shrink-0 text-center">
                            {index + 1 < 10 ? `0${index + 1}` : index + 1}
                          </span>
                          <h4 className="text-base sm:text-lg font-medium text-museum-primary-900 line-clamp-2 leading-tight">
                            {stop.title}
                          </h4>
                        </div>
                        {stop.artist && (
                          <div className="flex gap-3 mb-1 sm:mb-2">
                            <div className="w-6 flex-shrink-0" />
                            <p className="text-sm text-museum-neutral-600 line-clamp-2">
                              {stop.artist}
                            </p>
                          </div>
                        )}
                        {/* Location Info */}
                        {(stop.building || stop.floor !== undefined || stop.room) && (
                          <div className="flex items-start gap-3 mt-0.5">
                            <div className="w-6 flex justify-center flex-shrink-0">
                              <MapPin className="w-3.5 h-3.5 text-museum-terracotta-500 mt-0.5" />
                            </div>
                            <p className="text-xs text-museum-neutral-600 font-medium leading-relaxed">
                              {[
                                stop.building,
                                stop.floor !== undefined && `Flr\u00A0${stop.floor}`,
                                stop.room && `Room\u00A0${stop.room}`
                              ].filter(Boolean).join(' • ')}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Arrow */}
                      <div className="flex-shrink-0 text-museum-neutral-300 group-hover:text-museum-terracotta-500 transition-colors">
                        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
            
            {/* Desktop Feedback Section */}
            <div className="mt-8 p-8 bg-white rounded-xl border border-gray-100 text-center">
              <h3 className="text-lg text-museum-primary-900 mb-2 font-serif">
                Enjoying the tour?
              </h3>
              <p className="text-museum-neutral-600 text-sm mb-6">
                We'd love to hear your thoughts to improve the experience.
              </p>
              <a
                href="https://docs.google.com/forms/d/e/1FAIpQLScjsQEJIg1bW-jVbZidx8QEzGBxLFXFaC-Cs91fxKDREpthOA/viewform?usp=header"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-museum-terracotta-600 hover:bg-museum-terracotta-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-museum-terracotta-500 transition-colors shadow-sm hover:shadow-md"
              >
                Give Feedback
              </a>
            </div>
          </div>
        </div>
      </div>


    </div>
  );
};

export default TourPage;