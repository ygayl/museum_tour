import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause } from 'lucide-react';

interface CompactAudioPlayerProps {
  audioUrl: string;
  stopNumber: number;
  title: string;
  artist: string;
  tourName: string;
  transcript?: string;
  shouldPause?: boolean;
  onProgressUpdate?: (progressPercent: number) => void;
  onPlay?: () => void;
  onComplete?: () => void;
}

const CompactAudioPlayer: React.FC<CompactAudioPlayerProps> = ({
  audioUrl,
  stopNumber,
  title,
  artist,
  tourName,
  shouldPause,
  onProgressUpdate,
  onPlay,
  onComplete
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Handle external pause signal
  useEffect(() => {
    if (shouldPause && isPlaying && audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, [shouldPause, isPlaying]);

  // Audio event handlers
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      if (onProgressUpdate && duration > 0) {
        onProgressUpdate((audio.currentTime / duration) * 100);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      onComplete?.();
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [duration, onProgressUpdate, onComplete]);

  const togglePlay = async () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      try {
        await audioRef.current.play();
        setIsPlaying(true);
        onPlay?.();
      } catch (error) {
        console.error('Error playing audio:', error);
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current || !duration) return;

    const newTime = (parseFloat(e.target.value) / 100) * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  const remainingTime = duration - currentTime;

  return (
    <div className="max-w-4xl mx-auto">
      <audio ref={audioRef} src={audioUrl} preload="metadata" />

      {/* Clean Museum-Style Audio Player */}
      <div className="bg-white py-6">
        {/* Progress Bar Section with Time Display */}
        <div className="mb-6">
          {/* Progress Bar */}
          <div className="mb-2">
            <input
              type="range"
              min="0"
              max="100"
              value={progressPercent}
              onChange={handleSeek}
              className="w-full h-0.5 bg-gray-300 appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #8B7355 0%, #8B7355 ${progressPercent}%, #D1D5DB ${progressPercent}%, #D1D5DB 100%)`
              }}
            />
          </div>

          {/* Time Display */}
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-700 font-light">
              {formatTime(currentTime)}
            </span>
            <span className="text-gray-700 font-light">
              -{formatTime(remainingTime)}
            </span>
          </div>
        </div>

        {/* Player Controls and Info */}
        <div className="flex items-center space-x-4">
          {/* Flat Play/Pause Button */}
          <button
            onClick={togglePlay}
            className="flex-shrink-0 w-12 h-12 bg-transparent hover:bg-gray-50 rounded-full flex items-center justify-center transition-colors group border border-gray-800 group-hover:border-gray-900"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <div className="flex space-x-1">
                <div className="w-1 h-4 bg-gray-800 group-hover:bg-gray-900"></div>
                <div className="w-1 h-4 bg-gray-800 group-hover:bg-gray-900"></div>
              </div>
            ) : (
              <div className="w-0 h-0 border-l-[12px] border-l-gray-800 group-hover:border-l-gray-900 border-y-[8px] border-y-transparent ml-0.5"></div>
            )}
          </button>

          {/* Track Information */}
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-light text-gray-900 mb-1">
              {stopNumber === 0 ? title : `${stopNumber}: ${title}`}
            </h2>
            <p className="text-sm font-light text-gray-600">
              {tourName}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompactAudioPlayer;