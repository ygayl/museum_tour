import React, { useState, useEffect, useRef } from 'react';
import { Headphones, ChevronDown, Check, Play } from 'lucide-react';
import { Tour } from '../App';
import AudioPlayer from './AudioPlayer';
import ProgressBar from './ProgressBar';
import CompletionCelebration from './CompletionCelebration';
import { useTourProgress } from '../hooks/useTourProgress';
import { useEngagementTracking, useAnalytics } from '../hooks/useAnalytics';

interface TourPageProps {
  tour: Tour;
  onBackToTours?: () => void;
  analyticsEnabled?: boolean;
}

const TourPage: React.FC<TourPageProps> = ({ tour, onBackToTours, analyticsEnabled = false }) => {
  const [openStopId, setOpenStopId] = useState<string | null>(null);
  const [showIntro, setShowIntro] = useState(false);
  const stopRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const {
    markStopCompleted,
    updateAudioProgress,
    updateArtistAudioProgress,
    isStopCompleted,
    getCompletedCount,
    isAllCompleted,
  } = useTourProgress(tour.id, tour.stops.length, analyticsEnabled);

  // Engagement tracking
  const { trackTourCompletion } = useEngagementTracking(tour.id, tour.name);
  const analytics = useAnalytics();

  // Audio tracking callbacks
  const createAudioCallbacks = (stopId: string, audioType: 'artwork' | 'artist') => ({
    onPlay: () => {
      if (analyticsEnabled) {
        analytics.trackAudioPlay(tour.id, stopId, audioType);
      }
    },
    onComplete: () => {
      if (analyticsEnabled) {
        analytics.trackAudioComplete(tour.id, stopId, audioType);
      }
    }
  });

  // Handle deep linking only (no state retention from navigation)
  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash && tour.stops.find(stop => stop.id === hash)) {
      setOpenStopId(hash);
      // Scroll to the stop after a brief delay to ensure rendering
      setTimeout(() => {
        stopRefs.current[hash]?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }, 100);
    } else {
      // Ensure all accordions are closed by default
      setOpenStopId(null);
      // Clear any hash from URL
      if (window.location.hash) {
        window.history.replaceState(null, '', window.location.pathname);
      }
    }
  }, [tour.stops]);

  // Update URL hash when stop opens/closes
  useEffect(() => {
    if (openStopId) {
      window.history.replaceState(null, '', `#${openStopId}`);
    } else {
      window.history.replaceState(null, '', window.location.pathname);
    }
  }, [openStopId]);

  // Track tour completion
  useEffect(() => {
    if (isAllCompleted() && analyticsEnabled) {
      trackTourCompletion(getCompletedCount(), tour.stops.length);
    }
  }, [isAllCompleted, analyticsEnabled, trackTourCompletion, getCompletedCount, tour.stops.length]);

  const toggleStop = (stopId: string) => {
    setOpenStopId(openStopId === stopId ? null : stopId);
  };

  const handleKeyDown = (e: React.KeyboardEvent, stopId: string, index: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleStop(stopId);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = (index + 1) % tour.stops.length;
      const nextStopId = tour.stops[nextIndex].id;
      const nextButton = document.querySelector(`[data-stop-id="${nextStopId}"]`) as HTMLButtonElement;
      nextButton?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prevIndex = index === 0 ? tour.stops.length - 1 : index - 1;
      const prevStopId = tour.stops[prevIndex].id;
      const prevButton = document.querySelector(`[data-stop-id="${prevStopId}"]`) as HTMLButtonElement;
      prevButton?.focus();
    }
  };

  const handleSegmentClick = (index: number) => {
    const stopId = tour.stops[index].id;
    setOpenStopId(stopId);
    setTimeout(() => {
      stopRefs.current[stopId]?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
    }, 100);
  };

  const handleManualComplete = (stopId: string) => {
    markStopCompleted(stopId, true);
  };

  const handleAudioProgress = (stopId: string, progressPercent: number) => {
    updateAudioProgress(stopId, progressPercent);
  };

  const handleArtistAudioProgress = (stopId: string, progressPercent: number) => {
    updateArtistAudioProgress(stopId, progressPercent);
  };

  const scrollToFeedback = () => {
    const feedbackSection = document.getElementById('feedback-section');
    feedbackSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="px-4 py-4 bg-museum-gradient min-h-screen">
      {/* Thin Sticky Progress Bar */}
      <ProgressBar
        variant="thin"
        totalStops={tour.stops.length}
        completedCount={getCompletedCount()}
        onSegmentClick={handleSegmentClick}
        stops={tour.stops}
        isStopCompleted={isStopCompleted}
      />

      {/* Compact Meta Row */}
      <div className="flex items-center justify-between mb-3 mt-2">
        <div className="flex items-center space-x-2">
          <span className="text-xs px-2.5 py-1 rounded-full border bg-white/70 text-museum-neutral-600 flex items-center space-x-1">
            <span>🕑</span>
            <span>{tour.duration}</span>
          </span>
        </div>
        <button
          onClick={() => setShowIntro(!showIntro)}
          className="text-xs px-2.5 py-1 rounded-full border bg-white/70 text-museum-neutral-600 hover:bg-white/90 transition-colors flex items-center space-x-1"
          aria-expanded={showIntro}
        >
          <Play className="w-3 h-3" />
          <span>Play Intro</span>
        </button>
      </div>

      {/* Collapsible Intro Card */}
      {showIntro && (
        <div className="bg-white/70 backdrop-blur rounded-xl p-3 border border-museum-neutral-200 mb-3">
          <div className="flex items-center space-x-2 mb-2">
            <Headphones className="w-4 h-4 text-museum-gold-600" />
            <span className="text-sm font-medium text-gray-900">Introduction</span>
          </div>
          <p className="text-gray-600 text-sm mb-3">
            Start your journey with an introduction to {tour.name}.
          </p>
          <AudioPlayer audioUrl={tour.introAudio} title={`${tour.name} Introduction`} />
        </div>
      )}

      {/* Short Description */}
      <p className="text-sm text-museum-neutral-600 mb-4 line-clamp-2 font-light">
        {tour.description}
      </p>

      {/* Tour Stops Gallery */}
      <div className="space-y-1">
        <h3 className="text-lg font-semibold text-museum-primary-900 font-serif mb-2">Tour Stops</h3>

        <div className="space-y-3">
          {tour.stops.map((stop, index) => {
            const isOpen = openStopId === stop.id;
            const isCompleted = isStopCompleted(stop.id);
            
            return (
              <div 
                key={stop.id}
                ref={el => stopRefs.current[stop.id] = el}
                className={`bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-200 ${
                  isCompleted ? 'opacity-80' : ''
                } hover:shadow-xl`}
              >
                {/* Gallery Card Header */}
                <button
                  data-stop-id={stop.id}
                  onClick={() => toggleStop(stop.id)}
                  onKeyDown={(e) => handleKeyDown(e, stop.id, index)}
                  className="w-full text-left focus:outline-none focus:ring-2 focus:ring-museum-gold-500 focus:ring-inset relative"
                  aria-expanded={isOpen}
                  aria-controls={`stop-details-${stop.id}`}
                >
                  {/* Mobile Gallery Layout (Default) */}
                  <div className="md:hidden">
                    {/* Full-width Image */}
                    <div className="relative aspect-[4/3] bg-museum-neutral-100">
                      <img
                        src={stop.image}
                        alt={`${stop.title}`}
                        loading="lazy"
                        decoding="async"
                        fetchPriority="low"
                        className="w-full h-full object-cover"
                      />
                      
                      
                      {/* Completion Chip Overlay */}
                      {isCompleted && (
                        <div className="absolute bottom-2 left-2 px-2 py-1 bg-green-600/90 backdrop-blur-sm rounded-full flex items-center space-x-1">
                          <Check className="w-3 h-3 text-white" />
                          <span className="text-xs font-medium text-white">Seen</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Title and Subtitle */}
                    <div className="p-4 flex items-start justify-between">
                      <div className="flex-1 min-w-0 pr-3">
                        <h4 className="font-semibold text-gray-900 line-clamp-2 mb-1" id={`stop-title-${stop.id}`}>
                          {stop.title}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {stop.artistName} • {stop.roomNumber}
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <ChevronDown 
                          className={`w-5 h-5 text-gray-600 transition-transform duration-200 ${
                            isOpen ? 'rotate-180' : ''
                          }`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Desktop Compact Layout (md+) */}
                  <div className="hidden md:flex items-center p-4 space-x-4 hover:bg-museum-neutral-100/50 transition-colors">
                    {/* Small Thumbnail */}
                    <div className="flex-shrink-0 relative">
                      <img
                        src={stop.image}
                        alt={`${stop.title}`}
                        loading="lazy"
                        decoding="async"
                        fetchPriority="low"
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      {isCompleted && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-museum-gold-500 rounded-full flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 truncate" id={`stop-title-${stop.id}`}>
                        {stop.title}
                      </h4>
                      <p className="text-sm text-gray-600 truncate">
                        {stop.artistName} • {stop.roomNumber}
                      </p>
                    </div>
                    
                    {/* Chevron */}
                    <ChevronDown 
                      className={`w-5 h-5 text-gray-600 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </div>
                </button>
                
                {/* Expandable Details */}
                <div 
                  id={`stop-details-${stop.id}`}
                  role="region"
                  aria-labelledby={`stop-title-${stop.id}`}
                  className={`accordion-content ${isOpen ? 'accordion-open' : ''}`}
                >
                  <div className="p-4 pt-2 border-t border-museum-neutral-200">
                    {/* <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                      {stop.description}
                    </p> */}
                    
                    {/* Audio Players with Visual Grouping */}
                    <div className="bg-museum-neutral-100/50 rounded-xl p-3 space-y-3 border border-museum-neutral-200">
                      {/* Artwork Audio Section */}
                      <div>
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-lg">🎧</span>
                          <h5 className="text-sm font-medium text-museum-primary-800">Artwork narration</h5>
                        </div>
                        <AudioPlayer
                          audioUrl={stop.artworkAudioUrl}
                          title={`About: ${stop.title}`}
                          artist={stop.artistName}
                          transcript={stop.artworkTranscript}
                          onProgressUpdate={(progress) => handleAudioProgress(stop.id, progress)}
                          {...createAudioCallbacks(stop.id, 'artwork')}
                        />
                      </div>
                      
                      {/* Artist Audio Section */}
                      <div>
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-lg">👨‍🎨</span>
                          <h5 className="text-sm font-medium text-museum-primary-800">About the artist</h5>
                        </div>
                        <AudioPlayer
                          audioUrl={stop.artistAudioUrl}
                          title={`About: ${stop.artistName}`}
                          artist={stop.artistName}
                          transcript={stop.artistTranscript}
                          onProgressUpdate={(progress) => handleArtistAudioProgress(stop.id, progress)}
                          {...createAudioCallbacks(stop.id, 'artist')}
                        />
                      </div>
                    </div>
                    
                    {/* Completion Control */}
                    <div className="mt-4 mb-4 flex justify-center">
                      <button
                        onClick={() => handleManualComplete(stop.id)}
                        className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-200 min-w-[140px] ${
                          isCompleted
                            ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200'
                            : 'bg-white text-museum-neutral-700 border border-museum-neutral-300 hover:border-museum-gold-400 hover:text-museum-gold-600'
                        }`}
                      >
                        {isCompleted ? (
                          <span className="flex items-center justify-center space-x-2">
                            <span>✅</span>
                            <span>Seen</span>
                          </span>
                        ) : (
                          <span>Mark as seen</span>
                        )}
                      </button>
                    </div>                    
                  </div>
                </div>
              </div>
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
        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-museum-neutral-200">
          <p className="text-gray-600 text-center mb-4">
            Help us improve your museum experience by sharing your thoughts
          </p>
          <div className="aspect-video bg-white/50 rounded-xl border border-museum-neutral-200 flex items-center justify-center">
            <div className="text-center">
              <p className="text-gray-600 mb-2">Google Form Placeholder</p>
              <a 
                href="https://forms.google.com/feedback-form-placeholder"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-museum-gold-500 text-museum-primary-900 px-6 py-3 rounded-full font-medium hover:bg-museum-gold-400 transition-all duration-200 inline-block"
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