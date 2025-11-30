import React, { useEffect, useMemo } from 'react';
import { ChevronRight } from 'lucide-react';
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
      {/* Sticky Tour Title Bar */}
      <div className="sticky top-16 z-10 bg-museum-neutral-50 border-b border-gray-200 px-6 py-4">
        <h1 className="text-xl text-museum-primary-900 font-serif">
          {tour.name}
        </h1>
      </div>

      {/* Tour Stops List */}
      <div className="bg-white border-t border-gray-200 divide-y divide-gray-200">
        {allStops.map((stop, index) => {
            return (
              <button
                key={stop.id}
                onClick={() => handleStopClick(stop)}
                className="w-full p-4 text-left hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-museum-terracotta-500 focus:ring-inset"
              >
                <div className="flex items-center space-x-4">
                  {/* Larger Thumbnail - Left */}
                  <div className="flex-shrink-0 relative">
                    <picture className="block w-20 h-20">
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
                        className="w-20 h-20 object-cover rounded"
                        width="80"
                        height="80"
                        loading={index < 5 ? 'eager' : 'lazy'}
                        {...(index < 5 ? { fetchpriority: "high" } as React.ImgHTMLAttributes<HTMLImageElement> : {})}
                        decoding={index < 5 ? 'sync' : 'async'}
                      />
                    </picture>
                  </div>

                  {/* Content - Middle */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-light text-museum-primary-900 mb-1">
                      {stop.id.startsWith('intro-') || stop.id.startsWith('conclusion-') ? (
                        <span className="italic">{stop.title}</span>
                      ) : (
                        <>{stop.order}: <span className="italic">{stop.title}</span></>
                      )}
                      {stop.artist && <span>, {stop.artist}</span>}
                    </h4>
                  </div>

                  {/* Location - Right */}
                  <div className="flex-shrink-0 flex items-center space-x-3">
                    {stop.room && (
                      <div className="text-right">
                        <p className="text-sm font-light text-museum-neutral-700">
                          {stop.room}
                        </p>
                      </div>
                    )}
                    <ChevronRight className="w-5 h-5 text-museum-neutral-400" />
                  </div>
                </div>
              </button>
            );
          })}
      </div>

      {/* Feedback Section */}
      <div className="mt-6 mb-4 px-6">
        <div className="bg-white p-4 border border-gray-200 text-center">
          <h3 className="text-lg text-gray-900 mb-2">
            Give us feedback
          </h3>
          <p className="text-gray-600 text-sm mb-4">
            Help us improve your museum experience
          </p>
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLScjsQEJIg1bW-jVbZidx8QEzGBxLFXFaC-Cs91fxKDREpthOA/viewform?usp=header"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-museum-terracotta-500 text-white px-6 py-2 font-normal hover:bg-museum-terracotta-600 transition-all duration-200 inline-block text-sm rounded-md shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-museum-terracotta-500 focus:ring-offset-2"
          >
            Open Feedback Form
          </a>
        </div>
      </div>
    </div>
  );
};

export default TourPage;