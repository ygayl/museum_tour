import React, { useEffect, useState } from 'react';
import { Check, ChevronRight, Search } from 'lucide-react';
import { Tour, Stop } from '../App';
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
  const [searchQuery, setSearchQuery] = useState('');

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

  const handleStopClick = (stop: Stop) => {
    if (onSelectStop) {
      onSelectStop(stop);
    }
  };

  const scrollToFeedback = () => {
    const feedbackSection = document.getElementById('feedback-section');
    feedbackSection?.scrollIntoView({ behavior: 'smooth' });
  };

  // Create virtual introduction stop
  const createIntroductionStop = (): Stop => ({
    id: `intro-${tour.id}`,
    title: "Introduction",
    description: tour.description,
    image: tour.image,
    artworkAudioUrl: tour.introAudio,
    artistAudioUrl: "",
    artistName: "",
    roomNumber: "",
    artworkTranscript: (tour as any).introTranscript || "",
    artistTranscript: ""
  });

  // Combine introduction with regular stops
  const allStops = tour.introAudio ? [createIntroductionStop(), ...tour.stops] : tour.stops;

  // Filter stops based on search query
  const filteredStops = allStops.filter(stop =>
    stop.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (stop.artistName && stop.artistName.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (stop.roomNumber && stop.roomNumber.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="bg-museum-gradient min-h-screen">
      {/* Sticky Tour Title Bar */}
      <div className="sticky top-16 z-10 bg-museum-neutral-50 border-b border-gray-200 px-6 py-4">
        <h1 className="text-xl text-museum-primary-900 font-serif">
          {tour.name}
        </h1>
      </div>

      {/* Search Bar */}
      <div className="px-2 py-4 bg-white">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-100 border-0 rounded-lg text-base placeholder-gray-500 focus:outline-none focus:bg-gray-50 focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Tour Stops List */}
      <div className="bg-white border-t border-gray-200 divide-y divide-gray-200">
        {filteredStops.map((stop, index) => {
            const isCompleted = isStopCompleted(stop.id);

            return (
              <button
                key={stop.id}
                onClick={() => handleStopClick(stop)}
                className="w-full p-4 text-left hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-museum-gold-500 focus:ring-inset"
              >
                <div className="flex items-center space-x-4">
                  {/* Larger Thumbnail - Left */}
                  <div className="flex-shrink-0 relative">
                    <ResponsiveImage
                      src={stop.image}
                      alt={stop.title}
                      className="w-20 h-20 object-cover rounded"
                      priority={index < 5}
                      sizes="80px"
                    />
                    {isCompleted && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-600 rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>

                  {/* Content - Middle */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-light text-museum-primary-900 mb-1">
                      {index + 1}: <span className="italic">{stop.title}</span>
                      {stop.artistName && <span>, {stop.artistName}</span>}
                    </h4>
                  </div>

                  {/* Location - Right */}
                  <div className="flex-shrink-0 flex items-center space-x-3">
                    {stop.roomNumber && (
                      <div className="text-right">
                        <p className="text-sm font-light text-museum-neutral-700">
                          {stop.roomNumber}
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
      <div id="feedback-section" className="mt-6 mb-4 px-6">
        <div className="bg-white p-4 border border-gray-200 text-center">
          <h3 className="text-lg text-gray-900 mb-2">
            Give us feedback
          </h3>
          <p className="text-gray-600 text-sm mb-4">
            Help us improve your museum experience
          </p>
          <a
            href="https://forms.google.com/feedback-form-placeholder"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-museum-gold-500 text-museum-primary-900 px-6 py-2 font-normal hover:bg-museum-gold-400 transition-all duration-200 inline-block text-sm"
          >
            Open Feedback Form
          </a>
        </div>
      </div>
    </div>
  );
};

export default TourPage;