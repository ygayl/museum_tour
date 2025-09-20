import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, ChevronDown, ChevronUp } from 'lucide-react';

interface AudioPlayerProps {
  audioUrl: string;
  title: string;
  label?: string;
  artist?: string;
  transcript?: string;
  shouldPause?: boolean;
  onProgressUpdate?: (progressPercent: number) => void;
  onPlay?: () => void;
  onComplete?: () => void;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({
  audioUrl,
  title,
  artist,
  transcript,
  shouldPause,
  onProgressUpdate,
  onPlay,
  onComplete
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [showTranscript, setShowTranscript] = useState(false);
  const [showFullTranscript, setShowFullTranscript] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Handle external pause signal
  useEffect(() => {
    if (shouldPause && isPlaying && audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, [shouldPause, isPlaying]);

  // Media Session API for better mobile experience
  useEffect(() => {
    if ('mediaSession' in navigator && isPlaying) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: title,
        artist: artist || 'Museum Audio Guide',
        artwork: [
          { src: '/vite.svg', sizes: '96x96', type: 'image/svg+xml' }
        ]
      });
    }
  }, [isPlaying, title, artist]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
        // Track audio play event
        if (onPlay) {
          onPlay();
        }
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);

      // Report progress percentage
      if (onProgressUpdate && duration > 0) {
        const progressPercent = (audioRef.current.currentTime / duration) * 100;
        onProgressUpdate(progressPercent);

        // Track completion when audio reaches the end (95% to avoid timing issues)
        if (progressPercent >= 95 && onComplete) {
          onComplete();
        }
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Transcript management
  const toggleTranscript = () => {
    setShowTranscript(!showTranscript);
    if (!showTranscript) {
      setShowFullTranscript(false); // Reset full view when opening
    }
  };

  const getTranscriptPreview = (text: string, maxLength: number = 150) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const shouldShowReadMore = (text: string, maxLength: number = 150) => {
    return text.length > maxLength;
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl p-3 border-museum-neutral-200">
      <audio
        ref={audioRef}
        src={audioUrl}
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
        preload="metadata"
      />
      
      <div className="flex items-center space-x-4">
        <button
          onClick={togglePlay}
          className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-museum-gold-500 to-museum-gold-600 text-white rounded-full hover:from-museum-gold-600 hover:to-museum-gold-700 transition-all duration-200 border border-museum-gold-400"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <Pause className="w-6 h-6" />
          ) : (
            <Play className="w-6 h-6 ml-0.5" />
          )}
        </button>
        
        <div className="flex-1">
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-2 bg-museum-neutral-200 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      </div>

      {/* Transcript Section */}
      {transcript && (
        <div className="mt-3 border-b border-museum-neutral-200 pt-3">
          <button
            onClick={toggleTranscript}
            className="flex items-center justify-between w-full text-left text-sm font-medium text-museum-primary-700 hover:text-museum-primary-800 transition-colors"
            aria-expanded={showTranscript}
          >
            <span>
              {showTranscript ? 'Hide Transcript' : 'Show Transcript'}
            </span>
            {showTranscript ? (
              <ChevronUp className="w-4 h-4 ml-2" />
            ) : (
              <ChevronDown className="w-4 h-4 ml-2" />
            )}
          </button>

          {showTranscript && (
            <div className="mt-2 text-sm text-museum-neutral-700 leading-relaxed">
              <div className="bg-museum-neutral-50/50 rounded-lg p-3">
                <div>
                  {showFullTranscript ? (
                    <div>
                      {transcript}
                      {shouldShowReadMore(transcript) && (
                        <button
                          onClick={() => setShowFullTranscript(false)}
                          className="inline-flex items-center mt-2 text-xs text-museum-primary-600 hover:text-museum-primary-700 font-medium"
                        >
                          Collapse
                          <ChevronUp className="w-3 h-3 ml-1" />
                        </button>
                      )}
                    </div>
                  ) : (
                    <div>
                      {getTranscriptPreview(transcript)}
                      {shouldShowReadMore(transcript) && (
                        <button
                          onClick={() => setShowFullTranscript(true)}
                          className="inline-flex items-center mt-2 text-xs text-museum-primary-600 hover:text-museum-primary-700 font-medium"
                        >
                          Read More
                          <ChevronDown className="w-3 h-3 ml-1" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AudioPlayer;