import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Play } from 'lucide-react';
import { Tour, Stop } from '../App';
import CompactAudioPlayer from './CompactAudioPlayer';
import ResponsiveImage from './ResponsiveImage';
import { useTourProgress } from '../hooks/useTourProgress';
import { useAnalytics } from '../hooks/useAnalytics';

interface ArtPiecePageProps {
  stop: Stop;
  tour: Tour;
  analyticsEnabled?: boolean;
}

const ArtPiecePage: React.FC<ArtPiecePageProps> = ({
  stop,
  tour,
  analyticsEnabled = false
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

  const currentTrackData = getCurrentTrackData();

  return (
    <div className="bg-white min-h-screen pb-24">
      {/* Scrollable Content Area */}
      <div className="bg-white">
        {/* Hero Artwork Section */}
        <div className="bg-gray-50 px-6 py-0">
          <div className="max-w-4xl w-full mx-auto">
            {/* Add minimum height container to prevent layout shift */}
            <div className="relative min-h-[50vh] bg-museum-neutral-100 flex items-center justify-center">
              <ResponsiveImage
                src={stop.image}
                alt={stop.title}
                className="w-full h-auto object-contain max-h-[80vh]"
                priority={true}
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 800px, 1200px"
              />
            </div>
          </div>
        </div>

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
              <h3 className="text-xs font-normal tracking-[0.25em] text-gray-600 uppercase mb-4">
                {currentTrack === 'artwork' ? 'NARRATOR' : 'ABOUT THE ARTIST'}
              </h3>
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

      {/* Fixed Additional Content Section */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-[9999]">
        <div className="px-6">
          <div className="max-w-4xl mx-auto">
            <button
              onClick={() => setIsAdditionalContentExpanded(!isAdditionalContentExpanded)}
              className="w-full flex items-center justify-between py-4 text-left focus:outline-none focus:ring-2 focus:ring-museum-gold-500 focus:ring-inset"
            >
              <h3 className="text-xs font-normal tracking-[0.25em] text-gray-600 uppercase">
                ADDITIONAL CONTENT
              </h3>
              {isAdditionalContentExpanded ? (
                <ChevronUp className="w-4 h-4 text-gray-600" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-600" />
              )}
            </button>

            {isAdditionalContentExpanded && (
              <div className="space-y-2 pb-4 max-h-48 overflow-y-auto">
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
                        <span className="text-sm font-normal text-gray-900">1</span>
                        <span className="text-sm text-gray-900 truncate">
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
                          <span className="text-sm font-normal text-gray-900">2</span>
                          <span className="text-sm text-gray-900 truncate">
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