import React, { useState } from 'react';
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
    updateAudioProgress(stopId, progressPercent);
  };

  const isIntroductionStop = stop.id.startsWith('intro-');

  const getStopNumber = () => {
    if (isIntroductionStop) {
      return 0; // Introduction doesn't have a number
    }
    const index = tour.stops.findIndex(s => s.id === stop.id);
    return index + 1;
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Artwork Section */}
      <div className="bg-gray-50 px-6 py-0">
        <div className="max-w-4xl w-full mx-auto">
          <ResponsiveImage
            src={stop.image}
            alt={stop.title}
            className="w-full h-auto object-contain"
            priority={true}
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 800px, 1200px"
          />
        </div>
      </div>

      {/* Compact Audio Player */}
      <div className="px-6 py-6 bg-white">
        <CompactAudioPlayer
          audioUrl={stop.artworkAudioUrl}
          stopNumber={isIntroductionStop ? 0 : getStopNumber()}
          title={isIntroductionStop ? stop.title : stop.title}
          artist={stop.artistName || ''}
          tourName={tour.name}
          transcript={stop.artworkTranscript}
          shouldPause={currentlyPlaying !== null && currentlyPlaying !== `${stop.id}-artwork`}
          onProgressUpdate={(progress: number) => handleAudioProgress(stop.id, progress)}
          {...createAudioCallbacks(stop.id, 'artwork')}
        />
      </div>

      {/* Transcript Section */}
      {stop.artworkTranscript && (
        <div className="px-6 pb-8 bg-white">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-xs font-bold tracking-widest text-gray-600 uppercase mb-4">
              NARRATOR
            </h3>
            <div className="space-y-4 text-gray-800 leading-relaxed">
              <p className="text-sm leading-relaxed">
                {stop.artworkTranscript}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArtPiecePage;