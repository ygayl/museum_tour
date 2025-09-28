import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Play, ChevronRight, CheckCircle } from 'lucide-react';
import { Tour, Stop } from '../App';
import CompactAudioPlayer from './CompactAudioPlayer';
import { useTourProgress } from '../hooks/useTourProgress';
import { useAnalytics } from '../hooks/useAnalytics';

interface ArtPiecePageProps {
  stop: Stop;
  tour: Tour;
  analyticsEnabled?: boolean;
  onNextStop?: (stop: Stop) => void;
  onCompleteTour?: () => void;
}

const ArtPiecePage: React.FC<ArtPiecePageProps> = ({
  stop,
  tour,
  analyticsEnabled = false,
  onNextStop,
  onCompleteTour
}) => {
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [isAdditionalContentExpanded, setIsAdditionalContentExpanded] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<'artwork' | 'artist'>('artwork');

  const {
    updateAudioProgress,
  } = useTourProgress(tour.id, tour.stops.length, analyticsEnabled);

  const analytics = useAnalytics();

  // Audio tracking callbacks
  const createAudioCallbacks = (stopId: string, audioType: 'artwork' | 'artist') => {
    const playerId = `${stopId}-${audioType}`;
    return {
      onPlay: () => {
        // Set this audio as currently playing (pauses others)
        setCurrentlyPlaying(playerId);
        if (analyticsEnabled) {
          analytics.trackAudioPlay(tour.id, stopId, audioType);
        }
      },
      onComplete: () => {
        // Clear currently playing when audio completes
        setCurrentlyPlaying(null);
        if (analyticsEnabled) {
          analytics.trackAudioComplete(tour.id, stopId, audioType);
        }
      }
    };
  };

  const handleAudioProgress = (stopId: string, progressPercent: number) => {
    if (currentTrack === 'artwork') {
      updateAudioProgress(stopId, progressPercent);
    }
    // Artist audio progress tracking will be added when progress feature is restored
  };

  // Get current track data
  const getCurrentTrackData = () => {
    if (currentTrack === 'artwork') {
      return {
        audioUrl: stop.artworkAudioUrl,
        transcript: stop.artworkTranscript,
        title: stop.title,
        type: 'artwork' as const
      };
    } else {
      return {
        audioUrl: stop.artistAudioUrl,
        transcript: stop.artistTranscript,
        title: `Artist Info: ${stop.artistName}`,
        type: 'artist' as const
      };
    }
  };

  // Handle track switching
  const handleTrackSwitch = (trackType: 'artwork' | 'artist') => {
    setCurrentTrack(trackType);
    setCurrentlyPlaying(null); // Stop any currently playing audio
  };

  const isIntroductionStop = stop.id.startsWith('intro-');

  const getStopNumber = () => {
    if (isIntroductionStop) {
      return 0; // Introduction doesn't have a number
    }
    const index = tour.stops.findIndex(s => s.id === stop.id);
    return index + 1;
  };

  // Determine next stop logic
  const getNextStop = (): Stop | null => {
    if (isIntroductionStop) {
      // If on introduction, next is the first tour stop
      return tour.stops[0] || null;
    }
    const currentIndex = tour.stops.findIndex(s => s.id === stop.id);
    if (currentIndex >= 0 && currentIndex < tour.stops.length - 1) {
      return tour.stops[currentIndex + 1];
    }
    return null; // No next stop (we're at the last stop)
  };

  const nextStop = getNextStop();
  const isLastStop = !nextStop;

  // Handle navigation
  const handleNext = () => {
    if (nextStop && onNextStop) {
      onNextStop(nextStop);
    } else if (isLastStop && onCompleteTour) {
      onCompleteTour();
    }
  };

  // Swipe gesture handling for mobile
  useEffect(() => {
    let touchStartX = 0;
    let touchEndX = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.changedTouches[0].screenX;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    };

    const handleSwipe = () => {
      const swipeThreshold = 50;
      if (touchStartX - touchEndX > swipeThreshold) {
        // Swiped left - go to next
        handleNext();
      }
    };

    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [nextStop, onNextStop, onCompleteTour]);

  const currentTrackData = getCurrentTrackData();

  return (
    <div className="bg-white min-h-screen pb-40">
      {/* Scrollable Content Area */}
      <div className="bg-white">
        {/* Hero Artwork Section */}
        <div className="bg-gray-50 px-6 py-0">
          <div className="max-w-4xl w-full mx-auto">
            {/* Add minimum height container to prevent layout shift */}
            <div className="relative min-h-[50vh] bg-museum-neutral-100 flex items-center justify-center">
              <picture className="w-full h-auto">
                <source
                  srcSet={stop.image.includes('.jpg') || stop.image.includes('.jpeg')
                    ? `${stop.image.replace(/\.(jpg|jpeg)$/, '')}_360.webp 360w, ${stop.image.replace(/\.(jpg|jpeg)$/, '')}_720.webp 720w, ${stop.image.replace(/\.(jpg|jpeg)$/, '')}_1080.webp 1080w`
                    : `${stop.image}_360.webp 360w, ${stop.image}_720.webp 720w, ${stop.image}_1080.webp 1080w`}
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 800px, 1200px"
                  type="image/webp"
                />
                <source
                  srcSet={stop.image.includes('.jpg') || stop.image.includes('.jpeg')
                    ? `${stop.image.replace(/\.(jpg|jpeg)$/, '')}_360.jpg 360w, ${stop.image.replace(/\.(jpg|jpeg)$/, '')}_720.jpg 720w, ${stop.image.replace(/\.(jpg|jpeg)$/, '')}_1080.jpg 1080w`
                    : `${stop.image}_360.jpg 360w, ${stop.image}_720.jpg 720w, ${stop.image}_1080.jpg 1080w`}
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 800px, 1200px"
                  type="image/jpeg"
                />
                <img
                  src={stop.image.includes('.jpg') || stop.image.includes('.jpeg')
                    ? `${stop.image.replace(/\.(jpg|jpeg)$/, '')}_720.jpg`
                    : `${stop.image}_720.jpg`}
                  alt={stop.title}
                  className="w-full h-auto object-contain max-h-[80vh]"
                  loading="eager"
                  {...({ fetchpriority: "high" } as React.ImgHTMLAttributes<HTMLImageElement>)}
                  decoding="sync"
                  width="720"
                  height="540"
                />
              </picture>
            </div>
          </div>
        </div>

        {/* Room Number Display */}
        {stop.roomNumber && !isIntroductionStop && (
          <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
            <div className="flex items-center justify-center">
              <span className="text-xs font-normal tracking-[0.25em] text-gray-600 uppercase">
                Room {stop.roomNumber}
              </span>
            </div>
          </div>
        )}

        {/* Compact Audio Player */}
        <div className="px-6 py-6 bg-white">
          <CompactAudioPlayer
            audioUrl={currentTrackData.audioUrl}
            stopNumber={isIntroductionStop ? 0 : getStopNumber()}
            title={isIntroductionStop ? stop.title : currentTrackData.title}
            artist={currentTrack === 'artwork' ? (stop.artistName || '') : ''}
            tourName={tour.name}
            transcript={currentTrackData.transcript}
            shouldPause={currentlyPlaying !== null && currentlyPlaying !== `${stop.id}-${currentTrack}`}
            onProgressUpdate={(progress: number) => handleAudioProgress(stop.id, progress)}
            tourId={tour.id}
            stopId={stop.id}
            audioType={currentTrack}
            analyticsEnabled={analyticsEnabled}
            {...createAudioCallbacks(stop.id, currentTrack)}
          />
        </div>


        {/* Transcript Section */}
        {currentTrackData.transcript && (
          <div className="px-6 pb-8 bg-white">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-xs font-normal tracking-[0.25em] text-gray-600 uppercase mb-4">
                {currentTrack === 'artwork' ? 'NARRATOR' : 'ABOUT THE ARTIST'}
              </h2>
              <div className="space-y-4 text-gray-800 leading-relaxed">
                {currentTrackData.transcript.split('\n').filter(paragraph => paragraph.trim()).map((paragraph, index) => (
                  <p key={index} className="text-sm leading-relaxed">
                    {paragraph.trim()}
                  </p>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Subtle Navigation Button - Floating Action Button Style */}
      {/* Always show the navigation button */}
      <button
        onClick={handleNext}
        className="fixed bottom-20 right-4 bg-white/90 backdrop-blur-sm text-museum-primary-900 p-3 rounded-full shadow-lg border border-gray-200 hover:bg-white hover:scale-105 transition-all duration-200 z-[9997] group"
        aria-label={isLastStop ? "Complete Tour" : `Next: ${nextStop?.title}`}
      >
        {isLastStop ? (
          <CheckCircle className="w-6 h-6 text-museum-gold-600" />
        ) : (
          <ChevronRight className="w-6 h-6 text-museum-gold-600 group-hover:translate-x-0.5 transition-transform" />
        )}
      </button>

      {/* Fixed Additional Content Section */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-[9999]">
        <div className="px-6">
          <div className="max-w-4xl mx-auto">
            <button
              onClick={() => setIsAdditionalContentExpanded(!isAdditionalContentExpanded)}
              className="w-full flex items-center justify-between py-4 text-left focus:outline-none focus:ring-2 focus:ring-museum-gold-500 focus:ring-inset"
            >
              <h2 className="text-xs font-normal tracking-[0.25em] text-gray-600 uppercase">
                ADDITIONAL CONTENT
              </h2>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-normal tracking-[0.25em] text-gray-600 uppercase">
                  {isAdditionalContentExpanded ? 'LESS' : 'MORE'}
                </span>
                {isAdditionalContentExpanded ? (
                  <ChevronUp className="w-4 h-4 text-gray-600" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-600" />
                )}
              </div>
            </button>

            {isAdditionalContentExpanded && (
              <div className="space-y-2 pb-4 max-h-72 overflow-y-auto">
                {/* Artwork Track */}
                <button
                  onClick={() => handleTrackSwitch('artwork')}
                  className={`w-full flex items-center space-x-3 p-3 text-left transition-colors focus:outline-none focus:ring-2 focus:ring-museum-gold-500 focus:ring-inset ${
                    currentTrack === 'artwork'
                      ? 'bg-gray-100'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3 flex-1">
                    <div className="flex-shrink-0">
                      <Play className="w-4 h-4 text-gray-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline space-x-2">
                        <span className="text-sm font-semibold text-gray-900">1</span>
                        <span className="text-sm font-medium text-gray-900 truncate">
                          {stop.title}{stop.artistName && `, ${stop.artistName}`}
                        </span>
                      </div>
                    </div>
                  </div>
                  {currentTrack === 'artwork' && (
                    <div className="w-2 h-2 bg-museum-gold-500 rounded-full flex-shrink-0" />
                  )}
                </button>

                {/* Artist Track - Only show if artist audio exists */}
                {stop.artistAudioUrl && (
                  <button
                    onClick={() => handleTrackSwitch('artist')}
                    className={`w-full flex items-center space-x-3 p-3 text-left transition-colors focus:outline-none focus:ring-2 focus:ring-museum-gold-500 focus:ring-inset ${
                      currentTrack === 'artist'
                        ? 'bg-gray-100'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3 flex-1">
                      <div className="flex-shrink-0">
                        <Play className="w-4 h-4 text-gray-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline space-x-2">
                          <span className="text-sm font-semibold text-gray-900">2</span>
                          <span className="text-sm font-medium text-gray-900 truncate">
                            Artist Info: {stop.artistName}
                          </span>
                        </div>
                      </div>
                    </div>
                    {currentTrack === 'artist' && (
                      <div className="w-2 h-2 bg-museum-gold-500 rounded-full flex-shrink-0" />
                    )}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtPiecePage;