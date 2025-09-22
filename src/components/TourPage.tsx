import React, { useEffect } from 'react';
import { Headphones, Check, ChevronRight } from 'lucide-react';
import { Tour, Stop } from '../App';
import ProgressBar from './ProgressBar';
import CompletionCelebration from './CompletionCelebration';
import ResponsiveImage from './ResponsiveImage';
import { useTourProgress } from '../hooks/useTourProgress';
import { useEngagementTracking } from '../hooks/useAnalytics';

interface TourPageProps {
  tour: Tour;
  onBackToTours?: () => void;
  onSelectStop?: (stop: Stop) => void;
  analyticsEnabled?: boolean;
}

const TourPage: React.FC<TourPageProps> = ({ tour, onBackToTours, onSelectStop, analyticsEnabled = false }) => {

  const {
    isStopCompleted,
    getCompletedCount,
    isAllCompleted,
  } = useTourProgress(tour.id, tour.stops.length, analyticsEnabled);

  // Engagement tracking
  const { trackTourCompletion } = useEngagementTracking(tour.id, tour.name);


  // Track tour completion
  useEffect(() => {
    if (isAllCompleted() && analyticsEnabled) {
      trackTourCompletion(getCompletedCount(), tour.stops.length);
    }
  }, [isAllCompleted, analyticsEnabled, trackTourCompletion, getCompletedCount, tour.stops.length]);

  const handleSegmentClick = (index: number) => {
    const stop = tour.stops[index];
    if (onSelectStop) {
      onSelectStop(stop);
    }
  };

  const handleStopClick = (stop: Stop) => {
    if (onSelectStop) {
      onSelectStop(stop);
    }
  };

  const scrollToFeedback = () => {
    const feedbackSection = document.getElementById('feedback-section');
    feedbackSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="py-4 bg-museum-gradient min-h-screen">
      {/* Thin Sticky Progress Bar */}
      <ProgressBar
        variant="thin"
        totalStops={tour.stops.length}
        completedCount={getCompletedCount()}
        onSegmentClick={handleSegmentClick}
        stops={tour.stops}
        isStopCompleted={isStopCompleted}
      />

      {/* Tour Description Card */}
      <div className="bg-white p-4 border border-gray-200 mb-4 mt-2">
        <div className="flex items-center space-x-2 mb-3">
          <Headphones className="w-5 h-5 text-museum-gold-600" />
          <span className="text-base font-medium text-museum-primary-900">{tour.name}</span>
        </div>
        <p className="text-museum-neutral-700 text-sm leading-relaxed mb-3">
          {tour.description}
        </p>
        <div className="flex items-center space-x-4 text-xs text-museum-neutral-600">
          <span className="flex items-center space-x-1">
            <span>⏱️</span>
            <span>{tour.duration}</span>
          </span>
          <span className="flex items-center space-x-1">
            <span>🎨</span>
            <span>{tour.stops.length} artworks</span>
          </span>
        </div>
      </div>


      {/* Tour Stops List */}
      <div className="space-y-1">
        <h3 className="text-lg font-semibold text-museum-primary-900 font-serif mb-4 px-2">Tour Artworks</h3>

        <div className="bg-white border border-gray-200 divide-y divide-gray-200">
          {tour.stops.map((stop, index) => {
            const isCompleted = isStopCompleted(stop.id);

            return (
              <button
                key={stop.id}
                onClick={() => handleStopClick(stop)}
                className="w-full p-4 text-left hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-museum-gold-500 focus:ring-inset"
              >
                <div className="flex items-center space-x-4">
                  {/* Small Thumbnail - Left */}
                  <div className="flex-shrink-0 relative">
                    <ResponsiveImage
                      src={stop.image}
                      alt={stop.title}
                      className="w-16 h-16 object-cover"
                      priority={index < 5}
                      sizes="64px"
                    />
                    {isCompleted && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-600 rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>

                  {/* Content - Middle */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-museum-primary-900 truncate mb-1">
                      {stop.title}
                    </h4>
                    <p className="text-sm text-museum-neutral-600 truncate">
                      {stop.artistName}
                    </p>
                  </div>

                  {/* Location - Right */}
                  <div className="flex-shrink-0 flex items-center space-x-3">
                    <div className="text-right">
                      <p className="text-sm font-medium text-museum-neutral-700">
                        {stop.roomNumber}
                      </p>
                      <p className="text-xs text-museum-neutral-500">
                        Room
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-museum-neutral-400" />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Completion Celebration */}
      {isAllCompleted() && (
        <div className="mt-4 mb-4">
          <CompletionCelebration
            museumName={tour.name}
            onStartNewTour={onBackToTours}
            onGiveFeedback={scrollToFeedback}
          />
        </div>
      )}

      {/* Feedback Section */}
      <div id="feedback-section" className="mt-6 mb-4">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">
          Give us feedback
        </h3>
        <div className="bg-white p-4 border border-gray-200">
          <p className="text-gray-600 text-center mb-4">
            Help us improve your museum experience by sharing your thoughts
          </p>
          <div className="aspect-video bg-gray-50 border border-gray-200 flex items-center justify-center">
            <div className="text-center">
              {/* <p className="text-gray-600 mb-2">Google Form Placeholder</p> */}
              <a
                href="https://forms.google.com/feedback-form-placeholder"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-museum-gold-500 text-museum-primary-900 px-6 py-3 font-medium hover:bg-museum-gold-400 transition-all duration-200 inline-block"
              >
                Open Feedback Form
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourPage;