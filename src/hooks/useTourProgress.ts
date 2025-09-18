import { useState, useEffect } from 'react';
import { useAnalytics } from './useAnalytics';

export interface TourProgress {
  [stopId: string]: {
    completed: boolean;
    completedAt?: number;
    artworkAudioProgress?: number;
    artistAudioProgress?: number;
  };
}

export const useTourProgress = (tourId: string, totalStops: number, analyticsEnabled: boolean = false) => {
  const [progress, setProgress] = useState<TourProgress>({});
  const storageKey = `tour:${tourId}:progress`;
  const analytics = useAnalytics();

  // Load progress from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setProgress(JSON.parse(saved));
      }
    } catch (error) {
      console.warn('Failed to load tour progress:', error);
    }
  }, [storageKey]);

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(progress));
    } catch (error) {
      console.warn('Failed to save tour progress:', error);
    }
  }, [progress, storageKey]);

  const markStopCompleted = (stopId: string, manual = false) => {
    const wasCompleted = progress[stopId]?.completed;
    setProgress(prev => ({
      ...prev,
      [stopId]: {
        ...prev[stopId],
        completed: !wasCompleted,
        completedAt: Date.now(),
      }
    }));

    // Track stop completion
    if (analyticsEnabled && !wasCompleted) {
      analytics.trackStopCompleted(tourId, stopId, manual ? 'manual' : 'auto');
    }

    // Show micro-feedback for manual completions
    if (manual && !wasCompleted) {
      showProgressFeedback();
    }
  };
  
  const showProgressFeedback = () => {
    // Create and show toast notification
    const completedCount = Object.values(progress).filter(stop => stop.completed).length + 1;
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium z-50 animate-bounce';
    toast.textContent = `${completedCount} of ${totalStops} stops complete 🎉`;
    document.body.appendChild(toast);
    
    // Remove after 3 seconds
    setTimeout(() => {
      if (document.body.contains(toast)) {
        document.body.removeChild(toast);
      }
    }, 3000);
  };

  const updateAudioProgress = (stopId: string, progressPercent: number) => {
    setProgress(prev => {
      const current = prev[stopId] || {};
      const artistProgress = current.artistAudioProgress || 0;
      
      const newProgress = {
        ...prev,
        [stopId]: {
          ...current,
          artworkAudioProgress: progressPercent,
        }
      };

      // Auto-complete only if BOTH audios reach 80%
      if (progressPercent >= 80 && artistProgress >= 80 && !current.completed) {
        newProgress[stopId].completed = true;
        newProgress[stopId].completedAt = Date.now();
      }

      return newProgress;
    });
  };

  const updateArtistAudioProgress = (stopId: string, progressPercent: number) => {
    setProgress(prev => {
      const current = prev[stopId] || {};
      const artworkProgress = current.artworkAudioProgress || 0;
      
      const newProgress = {
        ...prev,
        [stopId]: {
          ...current,
          artistAudioProgress: progressPercent,
        }
      };

      // Auto-complete if both audios reach 80%
      if (artworkProgress >= 80 && progressPercent >= 80 && !current.completed) {
        newProgress[stopId].completed = true;
        newProgress[stopId].completedAt = Date.now();
      }

      return newProgress;
    });
  };

  const isStopCompleted = (stopId: string) => {
    return progress[stopId]?.completed || false;
  };

  const getCompletedCount = () => {
    return Object.values(progress).filter(stop => stop.completed).length;
  };

  const getProgressPercentage = () => {
    return Math.round((getCompletedCount() / totalStops) * 100);
  };

  const isAllCompleted = () => {
    return getCompletedCount() === totalStops;
  };

  const resetProgress = () => {
    setProgress({});
    localStorage.removeItem(storageKey);
  };

  return {
    progress,
    markStopCompleted,
    updateAudioProgress,
    updateArtistAudioProgress,
    isStopCompleted,
    getCompletedCount,
    getProgressPercentage,
    isAllCompleted,
    resetProgress,
  };
};