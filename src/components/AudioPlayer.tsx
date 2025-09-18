import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2 } from 'lucide-react';

interface AudioPlayerProps {
  audioUrl: string;
  title: string;
  label?: string;
  artist?: string;
  onProgressUpdate?: (progressPercent: number) => void;
  onPlay?: () => void;
  onComplete?: () => void;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({
  audioUrl,
  title,
  label = "Audio Guide",
  artist,
  onProgressUpdate,
  onPlay,
  onComplete
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

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

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl p-3 border border-amber-200/50">
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
          className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full hover:from-amber-600 hover:to-orange-600 transition-all duration-200 border border-amber-400"
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
            className="w-full h-2 bg-amber-100 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;