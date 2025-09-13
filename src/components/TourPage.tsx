import React, { useState, useEffect, useRef } from 'react';
import { Headphones, ChevronDown, Check, CheckCircle } from 'lucide-react';
import { Museum } from '../App';
import AudioPlayer from './AudioPlayer';
import ProgressBar from './ProgressBar';
import CompletionCelebration from './CompletionCelebration';
import { useTourProgress } from '../hooks/useTourProgress';

interface TourPageProps {
  museum: Museum;
  onBackToMuseums?: () => void;
}

const TourPage: React.FC<TourPageProps> = ({ museum, onBackToMuseums }) => {
  const [openStopId, setOpenStopId] = useState<string | null>(null);
  const stopRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  
  const {
    markStopCompleted,
    updateAudioProgress,
    updateArtistAudioProgress,
    isStopCompleted,
    getCompletedCount,
    isAllCompleted,
  } = useTourProgress(museum.id, museum.stops.length);

  // Handle deep linking only (no state retention from navigation)
  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash && museum.stops.find(stop => stop.id === hash)) {
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
  }, [museum.stops]);

  // Update URL hash when stop opens/closes
  useEffect(() => {
    if (openStopId) {
      window.history.replaceState(null, '', `#${openStopId}`);
    } else {
      window.history.replaceState(null, '', window.location.pathname);
    }
  }, [openStopId]);

  const toggleStop = (stopId: string) => {
    setOpenStopId(openStopId === stopId ? null : stopId);
  };

  const handleKeyDown = (e: React.KeyboardEvent, stopId: string, index: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleStop(stopId);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = (index + 1) % museum.stops.length;
      const nextStopId = museum.stops[nextIndex].id;
      const nextButton = document.querySelector(`[data-stop-id="${nextStopId}"]`) as HTMLButtonElement;
      nextButton?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prevIndex = index === 0 ? museum.stops.length - 1 : index - 1;
      const prevStopId = museum.stops[prevIndex].id;
      const prevButton = document.querySelector(`[data-stop-id="${prevStopId}"]`) as HTMLButtonElement;
      prevButton?.focus();
    }
  };

  const handleSegmentClick = (index: number) => {
    const stopId = museum.stops[index].id;
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
    <div className="px-4 py-6 bg-gradient-to-br from-amber-50/30 to-orange-50/20 min-h-screen">
      {/* Progress Bar */}
      <ProgressBar
        totalStops={museum.stops.length}
        completedCount={getCompletedCount()}
        onSegmentClick={handleSegmentClick}
        stops={museum.stops}
        isStopCompleted={isStopCompleted}
      />
      
      {/* Tour Introduction */}
      <div className="mb-6 mt-20">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-text mb-2">
            {museum.theme}
          </h2>
          <p className="text-muted mb-1">{museum.description}</p>
          <p className="text-accent font-medium">Duration: {museum.duration}</p>
        </div>
        
        {/* Museum Introduction Audio */}
        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 mb-4 border border-amber-100">
          <div className="flex items-center space-x-3 mb-3">
            <Headphones className="w-5 h-5 text-amber-600" />
            <span className="text-sm font-medium text-text">Museum Introduction</span>
          </div>
          <p className="text-muted text-sm mb-4">
            Start your journey with an introduction to {museum.name} and this special tour.
          </p>
          <AudioPlayer audioUrl={museum.introAudio} title={`${museum.name} Introduction`} />
        </div>
      </div>

      {/* Tour Stops Accordion */}
      <div className="space-y-1">
        <h3 className="text-xl font-semibold text-text mb-3">Tour Stops</h3>
        
        <div className="space-y-1">
          {museum.stops.map((stop, index) => {
            const isOpen = openStopId === stop.id;
            const isCompleted = isStopCompleted(stop.id);
            
            return (
              <div 
                key={stop.id}
                ref={el => stopRefs.current[stop.id] = el}
                className={`bg-white/80 backdrop-blur-sm border border-amber-200/50 rounded-xl overflow-hidden transition-opacity ${
                  isCompleted ? 'opacity-70' : ''
                }`}
              >
                {/* Stop Header */}
                <button
                  data-stop-id={stop.id}
                  onClick={() => toggleStop(stop.id)}
                  onKeyDown={(e) => handleKeyDown(e, stop.id, index)}
                  className="w-full p-4 flex items-center space-x-4 text-left hover:bg-amber-50/50 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-inset"
                  aria-expanded={isOpen}
                  aria-controls={`stop-details-${stop.id}`}
                >
                  {/* Thumbnail */}
                  <div className="flex-shrink-0">
                    <div className="relative">
                      <img
                        src={stop.image}
                        alt={stop.title}
                        loading="lazy"
                        className="w-14 h-14 object-cover rounded-lg"
                      />
                      {isCompleted && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-text truncate" id={`stop-title-${stop.id}`}>
                      {stop.title}
                    </h4>
                    <p className="text-sm text-muted truncate">
                      {stop.artistName} • {stop.roomNumber}
                    </p>
                  </div>
                  
                  {/* Chevron */}
                  <ChevronDown 
                    className={`w-5 h-5 text-muted transition-transform ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                
                {/* Expandable Details */}
                <div 
                  id={`stop-details-${stop.id}`}
                  role="region"
                  aria-labelledby={`stop-title-${stop.id}`}
                  className={`accordion-content ${isOpen ? 'accordion-open' : ''}`}
                >
                  <div className="p-4 pt-2 border-t border-amber-100">
                    <p className="text-gray-500 mb-4 text-sm leading-relaxed">
                      {stop.description}
                    </p>
                    
                    {/* Completion Control */}
                    <div className="mb-4 flex justify-center">
                      <button
                        onClick={() => handleManualComplete(stop.id)}
                        className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-200 min-w-[140px] ${
                          isCompleted
                            ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200'
                            : 'bg-white text-gray-700 border border-amber-300 hover:border-amber-400 hover:text-amber-600'
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
                    
                    {/* Audio Players with Visual Grouping */}
                    <div className="bg-amber-50/50 rounded-xl p-3 space-y-3 border border-amber-100">
                      {/* Artwork Audio Section */}
                      <div>
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-lg">🎧</span>
                          <h5 className="text-sm font-medium text-amber-800">Artwork narration</h5>
                        </div>
                        <AudioPlayer 
                          audioUrl={stop.artworkAudioUrl} 
                          title={`About: ${stop.title}`}
                          artist={stop.artistName}
                          onProgressUpdate={(progress) => handleAudioProgress(stop.id, progress)}
                        />
                      </div>
                      
                      {/* Artist Audio Section */}
                      <div>
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-lg">👨‍🎨</span>
                          <h5 className="text-sm font-medium text-amber-800">About the artist</h5>
                        </div>
                        <AudioPlayer 
                          audioUrl={stop.artistAudioUrl} 
                          title={`About: ${stop.artistName}`}
                          artist={stop.artistName}
                          onProgressUpdate={(progress) => handleArtistAudioProgress(stop.id, progress)}
                        />
                      </div>
                    </div>
                    
                    {/* Room Info Badge */}
                    <div className="mt-3 flex justify-center">
                      <span className="inline-flex items-center space-x-1 px-3 py-1 bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 text-xs font-medium rounded-full border border-amber-200">
                        <span>📍</span>
                        <span>{stop.roomNumber}</span>
                      </span>
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
        <div className="mt-6 mb-6">
          <CompletionCelebration
            museumName={museum.name}
            onStartNewTour={onBackToMuseums}
            onGiveFeedback={scrollToFeedback}
          />
        </div>
      )}

      {/* Feedback Section */}
      <div id="feedback-section" className="mt-8 mb-6">
        <h3 className="text-xl font-semibold text-text mb-4 text-center">
          Give us feedback
        </h3>
        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-amber-100">
          <p className="text-muted text-center mb-4">
            Help us improve your museum experience by sharing your thoughts
          </p>
          <div className="aspect-video bg-white/50 rounded-xl border border-amber-200 flex items-center justify-center">
            <div className="text-center">
              <p className="text-muted mb-2">Google Form Placeholder</p>
              <a 
                href="https://forms.google.com/feedback-form-placeholder"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 rounded-full font-medium hover:from-amber-600 hover:to-orange-600 transition-all duration-200 inline-block border border-amber-400"
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