import React, { useState, useEffect, useCallback } from 'react';
import { ChevronRight, CheckCircle } from 'lucide-react';
import { Tour, Stop } from '../types/tour';
import CompactAudioPlayer from './CompactAudioPlayer';
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

  const analytics = useAnalytics();

  // Audio tracking callbacks
  const createAudioCallbacks = (stopId: string) => {
    const playerId = `${stopId}-audio`;
    return {
      onPlay: () => {
        // Set this audio as currently playing (pauses others)
        setCurrentlyPlaying(playerId);
        if (analyticsEnabled) {
          analytics.trackAudioPlay(tour.id, stopId);
        }
      },
      onComplete: () => {
        // Clear currently playing when audio completes
        setCurrentlyPlaying(null);
        if (analyticsEnabled) {
          analytics.trackAudioComplete(tour.id, stopId);
        }
      }
    };
  };

  // Audio progress handler - no-op since we removed tour progress tracking
  const handleAudioProgress = (_stopId: string, _progressPercent: number) => {
    // Progress tracking removed
  };

  const isIntroductionStop = stop.id.startsWith('intro-');
  const isConclusionStop = stop.id.startsWith('conclusion-');

  const getStopNumber = () => {
    if (isIntroductionStop || isConclusionStop) {
      return 0; // Introduction and conclusion don't have numbers
    }
    const index = tour.artworks.findIndex(s => s.id === stop.id);
    return index + 1;
  };

  // Determine next stop logic
  const getNextStop = (): Stop | null => {
    if (isIntroductionStop) {
      // If on introduction, next is the first artwork
      return tour.artworks[0] || null;
    }

    if (isConclusionStop) {
      // Conclusion is always the last stop
      return null;
    }

    const currentIndex = tour.artworks.findIndex(s => s.id === stop.id);
    if (currentIndex >= 0 && currentIndex < tour.artworks.length - 1) {
      return tour.artworks[currentIndex + 1];
    }

    // We're at the last artwork - check if there's a conclusion
    if (currentIndex === tour.artworks.length - 1 && tour.outroAudio) {
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
    }

    return null; // No next stop
  };

  const nextStop = getNextStop();
  const isLastStop = !nextStop;

  // Handle navigation - memoized to prevent unnecessary re-renders
  const handleNext = useCallback(() => {
    if (nextStop && onNextStop) {
      onNextStop(nextStop);
    } else if (isLastStop && onCompleteTour) {
      onCompleteTour();
    }
  }, [nextStop, onNextStop, isLastStop, onCompleteTour]);

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
  }, [handleNext]); // Now properly includes handleNext

  return (
    <div className="bg-white min-h-screen pb-20">
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

        {/* Floor and Room Number Display */}
        {stop.room && !isIntroductionStop && !isConclusionStop && (
          <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
            <div className="flex items-center justify-center">
              <span className="text-xs font-normal tracking-[0.25em] text-gray-600 uppercase">
                {stop.floor !== undefined && `Floor ${stop.floor} - `}Room {stop.room}
              </span>
            </div>
          </div>
        )}

        {/* Compact Audio Player */}
        <div className="px-6 py-6 bg-white">
          <CompactAudioPlayer
            audioUrl={stop.audio}
            stopNumber={isIntroductionStop ? 0 : getStopNumber()}
            title={stop.title}
            artist={stop.artist || ''}
            tourName={tour.name}
            transcript={stop.narration}
            shouldPause={currentlyPlaying !== null && currentlyPlaying !== `${stop.id}-audio`}
            onProgressUpdate={(progress: number) => handleAudioProgress(stop.id, progress)}
            tourId={tour.id}
            stopId={stop.id}
            analyticsEnabled={analyticsEnabled}
            {...createAudioCallbacks(stop.id)}
          />
        </div>


        {/* Transcript Section */}
        {stop.narration && (
          <div className="px-6 pb-8 bg-white">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-xs font-normal tracking-[0.25em] text-gray-600 uppercase mb-4">
                NARRATION
              </h2>
              <div className="space-y-4 text-gray-800 leading-relaxed">
                {stop.narration.split('\n').filter(paragraph => paragraph.trim()).map((paragraph, index) => (
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
        className="fixed bottom-4 right-4 bg-white/90 backdrop-blur-sm text-museum-primary-900 p-3 rounded-full shadow-lg border border-gray-200 hover:bg-white hover:scale-105 transition-all duration-200 z-[9997] group"
        aria-label={isLastStop ? "Complete Tour" : `Next: ${nextStop?.title}`}
      >
        {isLastStop ? (
          <CheckCircle className="w-6 h-6 text-museum-gold-600" />
        ) : (
          <ChevronRight className="w-6 h-6 text-museum-gold-600 group-hover:translate-x-0.5 transition-transform" />
        )}
      </button>
    </div>
  );
};

export default ArtPiecePage;